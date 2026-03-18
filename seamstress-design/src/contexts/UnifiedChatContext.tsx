/**
 * UnifiedChatContext
 *
 * Consolidated context merging:
 * - WorkspaceChatContext (container state: open, docked, fullscreen, panel visibility)
 * - OGAssistContext (conversation state: messages, agents, history)
 *
 * Provides a single global context for the unified chat experience.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Conversation, Message } from '@opengov/components-ai-patterns';
import type { ConversationHistory } from '../components/OGAssist/OGAssistChatHistory';
import { ogAssistService } from '../services/ogAssistService';
import { eamSchedulerChatService } from '../services/eamSchedulerChatService';
import { inspectionChatService } from '../services/inspectionChatService';
import type { AIActionLog, ActionRelationshipGroup, CreateActionInput } from '../types/aiActions';
import { generateActionId, generateGroupId, requiresApproval } from '../types/aiActions';
import { logger } from '../utils/logger';
import {
  AGENT_MIN_WAIT_TIMES,
  THINKING_MESSAGE_ROTATION_INTERVAL,
} from '../constants/timing';
import { generateMessageId, generateConversationId } from '../utils/id';

// ============================================================================
// Types
// ============================================================================

interface UnifiedChatContextType {
  // Container state (from WorkspaceChatContext)
  isOpen: boolean;
  isDocked: boolean;
  isFullscreen: boolean;
  dockedWidth: number;
  showWorkspaces: boolean;
  showTasks: boolean;
  workspacesWidth: number;
  tasksWidth: number;

  // Conversation state (from OGAssistContext)
  conversation: Conversation;
  isLoading: boolean;
  thinkingMessage?: string;
  selectedAgent: string;
  conversationHistory: ConversationHistory[];
  activeConversationId: string | null;
  error: string | null;

  // AI Actions state (for Gen UX audit workspace)
  aiActions: AIActionLog[];
  pendingAiActions: AIActionLog[];
  aiActionGroups: ActionRelationshipGroup[];

  // Container actions
  openChat: () => void;
  closeChat: () => void;
  toggleDock: () => void;
  toggleFullscreen: () => void;
  setDockedWidth: (width: number) => void;
  toggleWorkspaces: (show: boolean) => void;
  toggleTasks: (show: boolean) => void;
  setWorkspacesWidth: (width: number) => void;
  setTasksWidth: (width: number) => void;

  // Conversation actions
  setSelectedAgent: (agentId: string) => void;
  sendMessage: (message: string) => Promise<void>;
  createNewConversation: () => void;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  clearError: () => void;

  // AI Actions actions
  addAiAction: (input: CreateActionInput) => string;
  approveAiAction: (actionId: string) => void;
  rejectAiAction: (actionId: string) => void;
  undoAiAction: (actionId: string) => void;
  approveAllAiActions: () => void;
}

const UnifiedChatContext = createContext<UnifiedChatContextType | undefined>(undefined);

// ============================================================================
// Hook
// ============================================================================

export const useUnifiedChat = () => {
  const context = useContext(UnifiedChatContext);
  if (!context) {
    throw new Error('useUnifiedChat must be used within UnifiedChatProvider');
  }
  return context;
};

// ============================================================================
// Provider
// ============================================================================

interface UnifiedChatProviderProps {
  children: ReactNode;
}

export const UnifiedChatProvider: React.FC<UnifiedChatProviderProps> = ({ children }) => {
  // -------------------------------------------------------------------------
  // Container State
  // -------------------------------------------------------------------------
  const [isOpen, setIsOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dockedWidth, setDockedWidth] = useState(600);
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [workspacesWidth, setWorkspacesWidth] = useState(400);
  const [tasksWidth, setTasksWidth] = useState(450);

  // -------------------------------------------------------------------------
  // Conversation State
  // -------------------------------------------------------------------------
  const [conversation, setConversation] = useState<Conversation>({
    messages: [],
    conversationId: 'default',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState<string | undefined>();
  const [selectedAgentState, setSelectedAgentState] = useState('budget');
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('default');
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------------
  // AI Actions State (for Gen UX audit workspace)
  // -------------------------------------------------------------------------
  const [aiActions, setAiActions] = useState<AIActionLog[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // Derived: pending actions only
  const pendingAiActions = aiActions.filter(a => a.status === 'pending');

  // Group actions by relationship
  const aiActionGroups: ActionRelationshipGroup[] = React.useMemo(() => {
    const groupMap = new Map<string, AIActionLog[]>();
    aiActions.forEach(action => {
      const gId = action.relationships.groupId || 'default';
      if (!groupMap.has(gId)) {
        groupMap.set(gId, []);
      }
      groupMap.get(gId)!.push(action);
    });
    return Array.from(groupMap.entries()).map(([gId, actions]) => ({
      groupId: gId,
      groupName: actions[0]?.metadata.stepName || 'RFP Completion',
      timestamp: actions[0]?.timestamp || new Date().toISOString(),
      actions: actions.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    }));
  }, [aiActions]);

  // -------------------------------------------------------------------------
  // Container Actions
  // -------------------------------------------------------------------------
  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  const toggleDock = useCallback(() => {
    setIsDocked(prev => !prev);
    if (isFullscreen) setIsFullscreen(false);
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
    if (isDocked) setIsDocked(false);
  }, [isDocked]);

  const toggleWorkspaces = useCallback((show: boolean) => setShowWorkspaces(show), []);
  const toggleTasks = useCallback((show: boolean) => setShowTasks(show), []);

  // -------------------------------------------------------------------------
  // Agent Initialization
  // -------------------------------------------------------------------------
  const initializeAgent = useCallback(async (agentId: string) => {
    const createIntroMessage = (
      content: string,
      agentName: string,
      skillName: string
    ): Message => ({
      id: generateMessageId(),
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      metadata: { agentName, skillName },
    });

    if (agentId === 'eamScheduler') {
      eamSchedulerChatService.reset();
      const introMessage = await eamSchedulerChatService.processMessage('');
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'budget') {
      ogAssistService.resetDemo();
      const introMessage = createIntroMessage(
        'Welcome to the Budget & Planning Agent demo! I\'ll guide you through a 5-step budget variance analysis.\n\nThis demonstration will show you how to:\n• Identify budget variances\n• Analyze department overspending\n• Optimize advertising costs\n• Reallocate saved budget\n• Create an action plan\n\n*Type anything to begin the analysis* →',
        'Budget & Planning Agent',
        'Introduction'
      );
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'inspection') {
      inspectionChatService.reset();
      const introMessage = await inspectionChatService.processMessage('');
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'buildingCode') {
      ogAssistService.setAgent('buildingCode');
      ogAssistService.resetDemo();
      const introMessage = createIntroMessage(
        'Welcome to the Building Code Assistant! I\'m here to help you understand local building codes, permit requirements, and construction regulations.\n\n📚 **Knowledge Source**: I have access to the complete **Residential Construction Requirements** document (@knowledge/residential-building-code) and will cite specific sections in my responses.\n\nI can help you with:\n• Permit requirements for decks, sheds, and additions\n• Setback measurements and exceptions\n• Approved materials and specifications\n• Inspection schedules and requirements\n• Pre-filling permit applications\n\nLet me know what construction project you\'re planning, and I\'ll guide you through the requirements with code citations!\n\n*Example: "I want to build a 12x16 deck in my backyard"*',
        'Building Code Assistant',
        'Building Code Lookup'
      );
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'buildingCodeGenUX') {
      ogAssistService.setAgent('buildingCodeGenUX');
      ogAssistService.resetDemo();
      const introMessage = createIntroMessage(
        'Welcome to the **Building Code Assistant - Gen UX**! 🎨\n\nI provide the same expert guidance as the standard Building Code Assistant, but with **interactive visual components** and **dynamic UI elements** to make the experience more engaging.\n\n📚 **Knowledge Source**: I have access to the complete **Residential Construction Requirements** document (@knowledge/residential-building-code) and will cite specific sections in my responses.\n\n✨ **Enhanced Features**:\n• Interactive project configurator\n• Visual permit requirement checker\n• Dynamic code section explorer\n• Real-time cost estimator\n• Guided permit application builder\n\nLet me know what construction project you\'re planning, and I\'ll guide you through with interactive tools and code citations!\n\n*Example: "I want to build a 12x16 deck in my backyard"*',
        'Building Code Assistant - Gen UX',
        'Building Code Lookup'
      );
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'eamDashboard') {
      ogAssistService.setAgent('eamDashboard');
      ogAssistService.resetDemo();
      const introMessage = createIntroMessage(
        'Welcome to the **EAM Dashboard Assistant**! 📊\n\nI can help you understand your work order operations and create custom visualizations for your dashboard.\n\n## What I Can Do\n\n• **Analyze work orders** - Get insights into status, priorities, and trends\n• **Generate visualizations** - Add charts, graphs, and maps to your dashboard\n• **Monitor operations** - Track overdue items and completion rates\n• **Provide recommendations** - Suggest improvements and optimizations\n\n## Current Operations\n\nYou have **47 active work orders** across your facilities. I can help you visualize and understand this data better.\n\n*Try asking: "I need to understand our work order situation"*',
        'EAM Dashboard Assistant',
        'Dashboard Analysis'
      );
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'documentBuilder') {
      ogAssistService.setAgent('documentBuilder');
      ogAssistService.resetDemo();
      const introMessage = createIntroMessage(
        'Welcome to the **Document Builder Assistant**!\n\nI can help you create and complete procurement documents by:\n\n• **Analyzing your document** - Identify missing sections and requirements\n• **Generating content** - Create section content with appropriate variables\n• **Suggesting structure** - Recommend standard procurement sections\n• **Reviewing completeness** - Ensure your document meets requirements\n\n*Type anything or click a suggestion to begin the document analysis*',
        'Document Builder Assistant',
        'Document Analysis'
      );
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'documentBuilderSimple') {
      ogAssistService.setAgent('documentBuilderSimple');
      ogAssistService.resetDemo();
      const introMessage = createIntroMessage(
        'Welcome to the **Document Builder Assistant**!\n\nI\'ll help you create procurement document content that you can copy and paste into your document.\n\n**How it works:**\n1. I\'ll analyze your document and identify missing sections\n2. I\'ll generate content for each section\n3. Use the **copy button** on my messages to copy content\n4. Paste into your document sections manually\n\n*Type anything to begin the document analysis*',
        'Document Builder Assistant',
        'Document Analysis'
      );
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    }
  }, [activeConversationId]);

  const setSelectedAgent = useCallback(
    async (agentId: string) => {
      setSelectedAgentState(agentId);
      await initializeAgent(agentId);
    },
    [initializeAgent]
  );

  // -------------------------------------------------------------------------
  // Register global functions for external triggers
  // -------------------------------------------------------------------------
  const openChatWithAgent = useCallback(async (agentId: string) => {
    await setSelectedAgent(agentId);
    openChat();
  }, [setSelectedAgent, openChat]);

  useEffect(() => {
    (window as any).openWorkspaceChat = openChat;
    (window as any).openUnifiedChat = openChat;
    (window as any).openUnifiedChatWithAgent = openChatWithAgent;

    return () => {
      delete (window as any).openWorkspaceChat;
      delete (window as any).openUnifiedChat;
      delete (window as any).openUnifiedChatWithAgent;
    };
  }, [openChat, openChatWithAgent]);

  // -------------------------------------------------------------------------
  // Listen for openChatWithAgent events from DocumentBuilderAssistantContext
  // -------------------------------------------------------------------------
  useEffect(() => {
    const handleOpenChatWithAgent = async (event: CustomEvent<{ agentId: string }>) => {
      const { agentId } = event.detail;
      await setSelectedAgent(agentId);
      openChat();
    };

    window.addEventListener('openChatWithAgent', handleOpenChatWithAgent as EventListener);

    return () => {
      window.removeEventListener('openChatWithAgent', handleOpenChatWithAgent as EventListener);
    };
  }, [openChat, setSelectedAgent]);

  // -------------------------------------------------------------------------
  // Conversation History Persistence
  // -------------------------------------------------------------------------
  useEffect(() => {
    const savedHistory = localStorage.getItem('unifiedChatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setConversationHistory(
          parsed.map((conv: any) => ({
            ...conv,
            timestamp: new Date(conv.timestamp),
          }))
        );
      } catch (e) {
        logger.error('Failed to load conversation history', e);
      }
    }
  }, []);

  useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem('unifiedChatHistory', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  // -------------------------------------------------------------------------
  // Send Message
  // -------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      const userMessage: Message = {
        role: 'user',
        content: message,
      };

      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage],
      }));

      setIsLoading(true);
      setError(null);

      try {
        let response: Message;
        const startTime = Date.now();

        // Dynamic thinking messages per agent
        const thinkingSteps = getThinkingSteps(selectedAgentState);
        let currentThinkingIndex = 0;
        setThinkingMessage(thinkingSteps[0]);

        const thinkingInterval = setInterval(() => {
          currentThinkingIndex = (currentThinkingIndex + 1) % thinkingSteps.length;
          setThinkingMessage(thinkingSteps[currentThinkingIndex]);
        }, THINKING_MESSAGE_ROTATION_INTERVAL);

        // Route to appropriate agent
        const minWaitTime = getMinWaitTime(selectedAgentState);

        if (selectedAgentState === 'eamScheduler') {
          response = await eamSchedulerChatService.processMessage(message);
        } else if (selectedAgentState === 'inspection') {
          response = await inspectionChatService.processMessage(message);
        } else {
          response = await ogAssistService.sendMessage(message);
        }

        // Ensure minimum wait time for realistic UX
        const elapsed = Date.now() - startTime;
        if (elapsed < minWaitTime) {
          await new Promise(resolve => setTimeout(resolve, minWaitTime - elapsed));
        }

        clearInterval(thinkingInterval);
        setThinkingMessage(undefined);

        setConversation(prev => ({
          ...prev,
          messages: [...prev.messages, response],
        }));

        // Update conversation history
        updateConversationHistory(response.content || '', message);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          isError: true,
        };
        setConversation(prev => ({
          ...prev,
          messages: [...prev.messages, errorMessage],
        }));
      } finally {
        setIsLoading(false);
      }
    },
    [selectedAgentState, activeConversationId, conversationHistory]
  );

  const updateConversationHistory = useCallback(
    (responseContent: string, userMessage: string) => {
      const currentConv = conversationHistory.find(c => c.id === activeConversationId);
      if (currentConv) {
        setConversationHistory(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  lastMessage:
                    responseContent.length > 100
                      ? responseContent.substring(0, 100) + '...'
                      : responseContent,
                  timestamp: new Date(),
                }
              : conv
          )
        );
      } else {
        const newConv: ConversationHistory = {
          id: activeConversationId || 'default',
          title: userMessage.substring(0, 50),
          lastMessage:
            responseContent.length > 100
              ? responseContent.substring(0, 100) + '...'
              : responseContent,
          timestamp: new Date(),
        };
        setConversationHistory(prev => [newConv, ...prev]);
      }
    },
    [activeConversationId, conversationHistory]
  );

  // -------------------------------------------------------------------------
  // Conversation Management
  // -------------------------------------------------------------------------
  const createNewConversation = useCallback(async () => {
    const newId = generateConversationId();
    setActiveConversationId(newId);
    ogAssistService.resetDemo();
    await initializeAgent(selectedAgentState);
  }, [selectedAgentState, initializeAgent]);

  const setActiveConversation = useCallback(
    (id: string) => {
      setActiveConversationId(id);
      const conv = conversationHistory.find(c => c.id === id);
      if (conv) {
        setConversation({ messages: [], conversationId: id });
        ogAssistService.resetDemo();
      }
    },
    [conversationHistory]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      setConversationHistory(prev => prev.filter(c => c.id !== id));
      if (activeConversationId === id) {
        createNewConversation();
      }
    },
    [activeConversationId, createNewConversation]
  );

  const clearError = useCallback(() => setError(null), []);

  // -------------------------------------------------------------------------
  // AI Actions Methods
  // -------------------------------------------------------------------------

  const addAiAction = useCallback((input: CreateActionInput): string => {
    const actionId = generateActionId();
    const gId = input.groupId || currentGroupId || generateGroupId();

    if (!currentGroupId) {
      setCurrentGroupId(gId);
    }

    const newAction: AIActionLog = {
      actionId,
      type: input.type,
      status: input.autoApply || !requiresApproval(input.type) ? 'auto_applied' : 'pending',
      timestamp: new Date().toISOString(),
      target: input.target,
      payload: input.payload,
      relationships: {
        parentActionId: input.parentActionId,
        relatedActionIds: [],
        messageId: input.messageId,
        groupId: gId,
      },
      metadata: input.metadata,
    };

    setAiActions(prev => [...prev, newAction]);

    // If auto-apply, dispatch the action event
    if (newAction.status === 'auto_applied') {
      window.dispatchEvent(new CustomEvent('documentBuilderAction', {
        detail: {
          type: input.type,
          sectionTitle: input.target.sectionTitle,
          content: input.payload.content,
        },
      }));
    }

    return actionId;
  }, [currentGroupId]);

  const approveAiAction = useCallback((actionId: string): void => {
    const action = aiActions.find(a => a.actionId === actionId);
    if (!action || action.status !== 'pending') return;

    setAiActions(prev =>
      prev.map(a => a.actionId === actionId ? { ...a, status: 'approved' as const } : a)
    );

    // Execute the action
    window.dispatchEvent(new CustomEvent('documentBuilderAction', {
      detail: {
        type: action.type,
        sectionTitle: action.target.sectionTitle,
        content: action.payload.content,
      },
    }));
  }, [aiActions]);

  const rejectAiAction = useCallback((actionId: string): void => {
    setAiActions(prev =>
      prev.map(a => a.actionId === actionId ? { ...a, status: 'rejected' as const } : a)
    );
  }, []);

  const undoAiAction = useCallback((actionId: string): void => {
    const action = aiActions.find(a => a.actionId === actionId);
    if (!action) return;

    // Dispatch undo event
    window.dispatchEvent(new CustomEvent('documentBuilderUndo', {
      detail: {
        actionId,
        sectionTitle: action.target.sectionTitle,
      },
    }));

    setAiActions(prev =>
      prev.map(a => a.actionId === actionId ? { ...a, status: 'rejected' as const } : a)
    );
  }, [aiActions]);

  const approveAllAiActions = useCallback((): void => {
    const pending = aiActions.filter(a => a.status === 'pending');
    pending.forEach(action => {
      approveAiAction(action.actionId);
    });
  }, [aiActions, approveAiAction]);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------
  const value: UnifiedChatContextType = {
    // Container state
    isOpen,
    isDocked,
    isFullscreen,
    dockedWidth,
    showWorkspaces,
    showTasks,
    workspacesWidth,
    tasksWidth,

    // Conversation state
    conversation,
    isLoading,
    thinkingMessage,
    selectedAgent: selectedAgentState,
    conversationHistory,
    activeConversationId,
    error,

    // AI Actions state
    aiActions,
    pendingAiActions,
    aiActionGroups,

    // Container actions
    openChat,
    closeChat,
    toggleDock,
    toggleFullscreen,
    setDockedWidth,
    toggleWorkspaces,
    toggleTasks,
    setWorkspacesWidth,
    setTasksWidth,

    // Conversation actions
    setSelectedAgent,
    sendMessage,
    createNewConversation,
    setActiveConversation,
    deleteConversation,
    clearError,

    // AI Actions actions
    addAiAction,
    approveAiAction,
    rejectAiAction,
    undoAiAction,
    approveAllAiActions,
  };

  return (
    <UnifiedChatContext.Provider value={value}>
      {children}
    </UnifiedChatContext.Provider>
  );
};

// ============================================================================
// Helpers
// ============================================================================

function getThinkingSteps(agentId: string): string[] {
  switch (agentId) {
    case 'eamScheduler':
      return [
        'Analyzing request...',
        'Evaluating crew availability...',
        'Checking work zones...',
        'Reviewing schedule conflicts...',
        'Matching skills to tasks...',
        'Optimizing assignments...',
        'Finalizing schedule...',
      ];
    case 'inspection':
      return [
        'Querying inspection database...',
        'Checking inspector availability...',
        'Analyzing capacity metrics...',
        'Reviewing schedule conflicts...',
        'Calculating utilization rates...',
        'Gathering inspection results...',
        'Preparing summary...',
      ];
    case 'buildingCode':
    case 'buildingCodeGenUX':
      return [
        'Searching building code database...',
        'Analyzing project requirements...',
        'Checking permit thresholds...',
        'Calculating setback requirements...',
        'Reviewing code sections...',
        'Preparing guidance...',
      ];
    case 'eamDashboard':
      return [
        'Analyzing work order data...',
        'Querying operations database...',
        'Calculating metrics...',
        'Generating visualization...',
        'Preparing insights...',
        'Adding widget to dashboard...',
      ];
    case 'documentBuilder':
      return [
        'Analyzing document structure...',
        'Checking section completeness...',
        'Identifying missing requirements...',
        'Generating content recommendations...',
        'Preparing section preview...',
        'Finalizing suggestions...',
      ];
    case 'documentBuilderSimple':
      return [
        'Analyzing document structure...',
        'Reviewing procurement requirements...',
        'Generating section content...',
        'Formatting for copy/paste...',
        'Preparing response...',
      ];
    default:
      return [
        'Understanding your question...',
        'Searching knowledge base...',
        'Analyzing relevant data...',
        'Formulating response...',
        'Preparing insights...',
      ];
  }
}

function getMinWaitTime(agentId: string): number {
  switch (agentId) {
    case 'eamScheduler':
      return AGENT_MIN_WAIT_TIMES.EAM_SCHEDULER;
    case 'inspection':
    case 'buildingCode':
    case 'buildingCodeGenUX':
      return AGENT_MIN_WAIT_TIMES.BUILDING_CODE;
    case 'documentBuilder':
      return AGENT_MIN_WAIT_TIMES.DOCUMENT_BUILDER;
    case 'documentBuilderSimple':
      return AGENT_MIN_WAIT_TIMES.DOCUMENT_BUILDER_SIMPLE;
    default:
      return AGENT_MIN_WAIT_TIMES.DEFAULT;
  }
}

export default UnifiedChatProvider;
