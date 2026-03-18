import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Conversation, Message } from '@opengov/components-ai-patterns';
import type { ConversationHistory } from '../components/OGAssist/OGAssistChatHistory';
import { ogAssistService } from '../services/ogAssistService';
import { eamSchedulerChatService } from '../services/eamSchedulerChatService';
import { inspectionChatService } from '../services/inspectionChatService';
import { logger } from '../utils/logger';
import {
  AGENT_MIN_WAIT_TIMES,
  THINKING_MESSAGE_ROTATION_INTERVAL,
} from '../constants/timing';
import { generateMessageId, generateConversationId } from '../utils/id';

interface OGAssistContextType {
  // Current conversation
  conversation: Conversation;
  isLoading: boolean;
  thinkingMessage?: string;

  // Agent selection
  selectedAgent: string;
  setSelectedAgent: (agentId: string) => void;

  // Conversation history
  conversationHistory: ConversationHistory[];
  activeConversationId: string | null;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  createNewConversation: () => void;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

  // Error handling
  error: string | null;
  clearError: () => void;
}

const OGAssistContext = createContext<OGAssistContextType | undefined>(undefined);

export const useOGAssistContext = () => {
  const context = useContext(OGAssistContext);
  if (!context) {
    throw new Error('useOGAssistContext must be used within OGAssistProvider');
  }
  return context;
};

interface OGAssistProviderProps {
  children: ReactNode;
}

export const OGAssistProvider: React.FC<OGAssistProviderProps> = ({ children }) => {
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

  // Custom setSelectedAgent that handles agent initialization
  const setSelectedAgent = useCallback(async (agentId: string) => {
    setSelectedAgentState(agentId);

    // If switching to EAM scheduler, initialize with intro
    if (agentId === 'eamScheduler') {
      eamSchedulerChatService.reset();
      const introMessage = await eamSchedulerChatService.processMessage('');
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'budget') {
      // Initialize budget agent with intro message
      ogAssistService.resetDemo();
      const introMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Welcome to the Budget & Planning Agent demo! I\'ll guide you through a 5-step budget variance analysis.\n\nThis demonstration will show you how to:\n• Identify budget variances\n• Analyze department overspending\n• Optimize advertising costs\n• Reallocate saved budget\n• Create an action plan\n\n*Type anything to begin the analysis* →',
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'Budget & Planning Agent',
          skillName: 'Introduction',
        },
      };
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'inspection') {
      // Initialize inspection agent with intro message
      inspectionChatService.reset();
      const introMessage = await inspectionChatService.processMessage('');
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'buildingCode') {
      // Initialize building code agent with intro message
      ogAssistService.setAgent('buildingCode');
      ogAssistService.resetDemo();
      const introMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Welcome to the Building Code Assistant! I\'m here to help you understand local building codes, permit requirements, and construction regulations.\n\n📚 **Knowledge Source**: I have access to the complete **Residential Construction Requirements** document (@knowledge/residential-building-code) and will cite specific sections in my responses.\n\nI can help you with:\n• Permit requirements for decks, sheds, and additions\n• Setback measurements and exceptions\n• Approved materials and specifications\n• Inspection schedules and requirements\n• Pre-filling permit applications\n\nLet me know what construction project you\'re planning, and I\'ll guide you through the requirements with code citations!\n\n*Example: "I want to build a 12x16 deck in my backyard"*',
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'Building Code Assistant',
          skillName: 'Building Code Lookup',
        },
      };
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'buildingCodeGenUX') {
      // Initialize building code Gen UX agent with intro message
      ogAssistService.setAgent('buildingCodeGenUX');
      ogAssistService.resetDemo();
      const introMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Welcome to the **Building Code Assistant - Gen UX**! 🎨\n\nI provide the same expert guidance as the standard Building Code Assistant, but with **interactive visual components** and **dynamic UI elements** to make the experience more engaging.\n\n📚 **Knowledge Source**: I have access to the complete **Residential Construction Requirements** document (@knowledge/residential-building-code) and will cite specific sections in my responses.\n\n✨ **Enhanced Features**:\n• Interactive project configurator\n• Visual permit requirement checker\n• Dynamic code section explorer\n• Real-time cost estimator\n• Guided permit application builder\n\nLet me know what construction project you\'re planning, and I\'ll guide you through with interactive tools and code citations!\n\n*Example: "I want to build a 12x16 deck in my backyard"*',
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'Building Code Assistant - Gen UX',
          skillName: 'Building Code Lookup',
        },
      };
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    } else if (agentId === 'eamDashboard') {
      // Initialize EAM Dashboard agent with intro message
      ogAssistService.setAgent('eamDashboard');
      ogAssistService.resetDemo();
      const introMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Welcome to the **EAM Dashboard Assistant**! 📊\n\nI can help you understand your work order operations and create custom visualizations for your dashboard.\n\n## What I Can Do\n\n• **Analyze work orders** - Get insights into status, priorities, and trends\n• **Generate visualizations** - Add charts, graphs, and maps to your dashboard\n• **Monitor operations** - Track overdue items and completion rates\n• **Provide recommendations** - Suggest improvements and optimizations\n\n## Current Operations\n\nYou have **47 active work orders** across your facilities. I can help you visualize and understand this data better.\n\n*Try asking: "I need to understand our work order situation"*',
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'EAM Dashboard Assistant',
          skillName: 'Dashboard Analysis',
        },
      };
      setConversation({
        messages: [introMessage],
        conversationId: activeConversationId || 'default',
      });
    }
  }, [activeConversationId]);

  // Load conversation history from localStorage on mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('ogAssistHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setConversationHistory(parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
        })));
      } catch (e) {
        logger.error('Failed to load conversation history', e);
      }
    }
  }, []);

  // Save conversation history to localStorage whenever it changes
  React.useEffect(() => {
    if (conversationHistory.length > 0) {
      localStorage.setItem('ogAssistHistory', JSON.stringify(conversationHistory));
    }
  }, [conversationHistory]);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
    };

    // Add user message to conversation
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setIsLoading(true);
    setError(null);

    try {
      let response: Message;
      const startTime = Date.now();

      // Dynamic thinking messages that rotate every 2 seconds
      const thinkingSteps = selectedAgentState === 'eamScheduler' ? [
        'Analyzing request...',
        'Evaluating crew availability...',
        'Checking work zones...',
        'Reviewing schedule conflicts...',
        'Matching skills to tasks...',
        'Optimizing assignments...',
        'Finalizing schedule...',
      ] : selectedAgentState === 'inspection' ? [
        'Querying inspection database...',
        'Checking inspector availability...',
        'Analyzing capacity metrics...',
        'Reviewing schedule conflicts...',
        'Calculating utilization rates...',
        'Gathering inspection results...',
        'Preparing summary...',
      ] : (selectedAgentState === 'buildingCode' || selectedAgentState === 'buildingCodeGenUX') ? [
        'Searching building code database...',
        'Analyzing project requirements...',
        'Checking permit thresholds...',
        'Calculating setback requirements...',
        'Reviewing code sections...',
        'Preparing guidance...',
      ] : selectedAgentState === 'eamDashboard' ? [
        'Analyzing work order data...',
        'Querying operations database...',
        'Calculating metrics...',
        'Generating visualization...',
        'Preparing insights...',
        'Adding widget to dashboard...',
      ] : [
        'Understanding your question...',
        'Searching knowledge base...',
        'Analyzing relevant data...',
        'Formulating response...',
        'Preparing insights...',
      ];

      let currentThinkingIndex = 0;
      setThinkingMessage(thinkingSteps[0]);

      // Rotate thinking messages (slower for longer scramble)
      const thinkingInterval = setInterval(() => {
        currentThinkingIndex = (currentThinkingIndex + 1) % thinkingSteps.length;
        setThinkingMessage(thinkingSteps[currentThinkingIndex]);
      }, THINKING_MESSAGE_ROTATION_INTERVAL);

      // Handle different agents
      if (selectedAgentState === 'eamScheduler') {
        // Get EAM response
        response = await eamSchedulerChatService.processMessage(message);

        // Ensure minimum thinking time for realistic tool calls
        const elapsed = Date.now() - startTime;
        if (elapsed < AGENT_MIN_WAIT_TIMES.EAM_SCHEDULER) {
          await new Promise(resolve => setTimeout(resolve, AGENT_MIN_WAIT_TIMES.EAM_SCHEDULER - elapsed));
        }
      } else if (selectedAgentState === 'inspection') {
        // Get inspection agent response using linear progression
        response = await inspectionChatService.processMessage(message);

        // Ensure minimum thinking time for inspection queries
        const elapsed = Date.now() - startTime;
        if (elapsed < AGENT_MIN_WAIT_TIMES.INSPECTION) {
          await new Promise(resolve => setTimeout(resolve, AGENT_MIN_WAIT_TIMES.INSPECTION - elapsed));
        }
      } else if (selectedAgentState === 'buildingCode' || selectedAgentState === 'buildingCodeGenUX') {
        // Get building code agent response using linear progression
        response = await ogAssistService.sendMessage(message);

        // Ensure minimum thinking time for code lookups
        const elapsed = Date.now() - startTime;
        if (elapsed < AGENT_MIN_WAIT_TIMES.BUILDING_CODE) {
          await new Promise(resolve => setTimeout(resolve, AGENT_MIN_WAIT_TIMES.BUILDING_CODE - elapsed));
        }
      } else {
        // Get standard AI response (budget agent)
        response = await ogAssistService.sendMessage(message);

        // Ensure minimum response time for standard responses
        const elapsed = Date.now() - startTime;
        if (elapsed < AGENT_MIN_WAIT_TIMES.DEFAULT) {
          await new Promise(resolve => setTimeout(resolve, AGENT_MIN_WAIT_TIMES.DEFAULT - elapsed));
        }
      }

      // Clear thinking interval and message
      clearInterval(thinkingInterval);
      setThinkingMessage(undefined);

      // Add AI response to conversation (preserving metadata if present)
      setConversation(prev => ({
        ...prev,
        messages: [...prev.messages, response],
      }));

      // Update conversation history
      const responseContent = response.content || '';
      const currentConv = conversationHistory.find(c => c.id === activeConversationId);
      if (currentConv) {
        setConversationHistory(prev =>
          prev.map(conv =>
            conv.id === activeConversationId
              ? {
                  ...conv,
                  lastMessage: responseContent.length > 100
                    ? responseContent.substring(0, 100) + '...'
                    : responseContent,
                  timestamp: new Date(),
                }
              : conv
          )
        );
      } else {
        // Create new conversation entry
        const newConv: ConversationHistory = {
          id: activeConversationId || 'default',
          title: message.substring(0, 50),
          lastMessage: responseContent.length > 100
            ? responseContent.substring(0, 100) + '...'
            : responseContent,
          timestamp: new Date(),
        };
        setConversationHistory(prev => [newConv, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');

      // Add error message to conversation
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
  }, [activeConversationId, conversationHistory, selectedAgentState]);

  const createNewConversation = useCallback(async () => {
    const newId = generateConversationId();
    setActiveConversationId(newId);

    // Reset services
    ogAssistService.resetDemo();

    // If EAM scheduler is selected, start with intro message
    if (selectedAgentState === 'eamScheduler') {
      eamSchedulerChatService.reset();
      const introMessage = await eamSchedulerChatService.processMessage('');
      setConversation({
        messages: [introMessage],
        conversationId: newId,
      });
    } else if (selectedAgentState === 'inspection') {
      inspectionChatService.reset();
      const introMessage = await inspectionChatService.processMessage('');
      setConversation({
        messages: [introMessage],
        conversationId: newId,
      });
    } else if (selectedAgentState === 'buildingCode') {
      ogAssistService.setAgent('buildingCode');
      ogAssistService.resetDemo();
      const introMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Welcome to the Building Code Assistant! I\'m here to help you understand local building codes, permit requirements, and construction regulations.\n\n📚 **Knowledge Source**: I have access to the complete **Residential Construction Requirements** document (@knowledge/residential-building-code) and will cite specific sections in my responses.\n\nI can help you with:\n• Permit requirements for decks, sheds, and additions\n• Setback measurements and exceptions\n• Approved materials and specifications\n• Inspection schedules and requirements\n• Pre-filling permit applications\n\nLet me know what construction project you\'re planning, and I\'ll guide you through the requirements with code citations!\n\n*Example: "I want to build a 12x16 deck in my backyard"*',
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'Building Code Assistant',
          skillName: 'Building Code Lookup',
        },
      };
      setConversation({
        messages: [introMessage],
        conversationId: newId,
      });
    } else if (selectedAgentState === 'buildingCodeGenUX') {
      ogAssistService.setAgent('buildingCodeGenUX');
      ogAssistService.resetDemo();
      const introMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Welcome to the **Building Code Assistant - Gen UX**! 🎨\n\nI provide the same expert guidance as the standard Building Code Assistant, but with **interactive visual components** and **dynamic UI elements** to make the experience more engaging.\n\n📚 **Knowledge Source**: I have access to the complete **Residential Construction Requirements** document (@knowledge/residential-building-code) and will cite specific sections in my responses.\n\n✨ **Enhanced Features**:\n• Interactive project configurator\n• Visual permit requirement checker\n• Dynamic code section explorer\n• Real-time cost estimator\n• Guided permit application builder\n\nLet me know what construction project you\'re planning, and I\'ll guide you through with interactive tools and code citations!\n\n*Example: "I want to build a 12x16 deck in my backyard"*',
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'Building Code Assistant - Gen UX',
          skillName: 'Building Code Lookup',
        },
      };
      setConversation({
        messages: [introMessage],
        conversationId: newId,
      });
    } else {
      setConversation({
        messages: [],
        conversationId: newId,
      });
    }
  }, [selectedAgentState]);

  const setActiveConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // Load conversation from history
    const conv = conversationHistory.find(c => c.id === id);
    if (conv) {
      // In a real app, load full conversation from storage/API
      // For now, just reset to empty
      setConversation({
        messages: [],
        conversationId: id,
      });
      // Reset demo when switching conversations
      ogAssistService.resetDemo();
    }
  }, [conversationHistory]);

  const deleteConversation = useCallback((id: string) => {
    setConversationHistory(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      createNewConversation();
    }
  }, [activeConversationId, createNewConversation]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: OGAssistContextType = {
    conversation,
    isLoading,
    thinkingMessage,
    selectedAgent: selectedAgentState,
    setSelectedAgent,
    conversationHistory,
    activeConversationId,
    sendMessage,
    createNewConversation,
    setActiveConversation,
    deleteConversation,
    error,
    clearError,
  };

  return (
    <OGAssistContext.Provider value={value}>
      {children}
    </OGAssistContext.Provider>
  );
};