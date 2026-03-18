/* eslint-disable react-refresh/only-export-components */
/**
 * DocumentBuilderAssistantContext
 *
 * Context provider for managing the Document Builder AI Assistant state.
 * Handles:
 * - Highlight state management for outline sections
 * - Document action execution bridge
 * - Cross-component communication via events
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import type { AnimationState } from '../components/ai/AIScanHighlight';
import {
  BEACON_CONFIG,
  BEACON_LOOP_DURATION,
} from '../components/ai/AIScanHighlight';
import type {
  AIActionLog,
  ActionRelationshipGroup,
  CreateActionInput,
  ActionExecutionResult,
} from '../types/aiActions';
import {
  generateActionId,
  generateGroupId,
  requiresApproval,
} from '../types/aiActions';

// =============================================================================
// Types
// =============================================================================

export interface DocumentAction {
  type: 'add_section' | 'update_section' | 'navigate';
  sectionTitle?: string;
  sectionType?: 'text' | 'list' | 'heading';
  content?: string;
  variables?: string[];
}

export interface HighlightTarget {
  type: 'outline' | 'section' | 'editor';
  sectionId?: string;
}

interface DocumentBuilderAssistantContextType {
  /** Current highlight states for sections */
  highlights: Record<string, AnimationState>;

  /** Set highlight state for a specific section */
  setHighlight: (sectionId: string, state: AnimationState) => void;

  /** Clear highlight for a specific section */
  clearHighlight: (sectionId: string) => void;

  /** Clear all highlights */
  clearAllHighlights: () => void;

  /** Trigger a complete highlight sequence (in -> loop -> out) */
  triggerHighlightSequence: (sectionId: string, options?: HighlightSequenceOptions) => void;

  /** Execute a document action (add section, etc.) */
  executeDocumentAction: (action: DocumentAction) => void;

  /** Register the document action handler */
  registerActionHandler: (handler: (action: DocumentAction) => void) => void;

  /** Whether the assistant is currently active */
  isAssistantActive: boolean;

  /** Set assistant active state */
  setAssistantActive: (active: boolean) => void;

  /** Last executed action (for UI feedback) */
  lastAction: DocumentAction | null;

  // -------------------------------------------------------------------------
  // AI Action Tracking (Gen UX Audit Workspace)
  // -------------------------------------------------------------------------

  /** All tracked actions (pending + history) */
  actionHistory: AIActionLog[];

  /** Only pending actions awaiting approval */
  pendingActions: AIActionLog[];

  /** Action relationship groups for visualization */
  actionGroups: ActionRelationshipGroup[];

  /** Add a new pending action to the tracking system */
  addPendingAction: (input: CreateActionInput) => string;

  /** Approve a pending action and execute it */
  approveAction: (actionId: string) => Promise<ActionExecutionResult>;

  /** Reject a pending action */
  rejectAction: (actionId: string) => void;

  /** Undo an approved action */
  undoAction: (actionId: string) => Promise<ActionExecutionResult>;

  /** Approve all pending actions */
  approveAllPending: () => Promise<void>;

  /** Clear all action history */
  clearActionHistory: () => void;
}

interface HighlightSequenceOptions {
  /** Duration to stay in 'loop' state (ms), default uses BEACON_LOOP_DURATION (3s) */
  loopDuration?: number;
  /** Whether to start with 'in' animation, default true */
  startWithIn?: boolean;
}

// =============================================================================
// Context
// =============================================================================

const DocumentBuilderAssistantContext = createContext<DocumentBuilderAssistantContextType | undefined>(undefined);

// =============================================================================
// Hook
// =============================================================================

export const useDocumentBuilderAssistant = () => {
  const context = useContext(DocumentBuilderAssistantContext);
  if (!context) {
    throw new Error('useDocumentBuilderAssistant must be used within DocumentBuilderAssistantProvider');
  }
  return context;
};

/**
 * Safe hook that returns null if context is not available.
 * Use this in components that may exist outside the provider.
 */
export const useDocumentBuilderAssistantSafe = () => {
  return useContext(DocumentBuilderAssistantContext);
};

// =============================================================================
// Provider
// =============================================================================

interface DocumentBuilderAssistantProviderProps {
  children: ReactNode;
}

export const DocumentBuilderAssistantProvider: React.FC<DocumentBuilderAssistantProviderProps> = ({ children }) => {
  const [highlights, setHighlights] = useState<Record<string, AnimationState>>({});
  const [isAssistantActive, setAssistantActive] = useState(false);
  const [lastAction, setLastAction] = useState<DocumentAction | null>(null);
  const [actionHandler, setActionHandler] = useState<((action: DocumentAction) => void) | null>(null);

  // -------------------------------------------------------------------------
  // AI Action Tracking State
  // -------------------------------------------------------------------------

  const [actionHistory, setActionHistory] = useState<AIActionLog[]>([]);
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);

  // Derived state: pending actions only
  const pendingActions = useMemo(
    () => actionHistory.filter(a => a.status === 'pending'),
    [actionHistory]
  );

  // Group actions by relationship for visualization
  const actionGroups = useMemo((): ActionRelationshipGroup[] => {
    const groupMap = new Map<string, AIActionLog[]>();

    actionHistory.forEach(action => {
      const groupId = action.relationships.groupId || 'default';
      if (!groupMap.has(groupId)) {
        groupMap.set(groupId, []);
      }
      groupMap.get(groupId)!.push(action);
    });

    return Array.from(groupMap.entries()).map(([groupId, actions]) => ({
      groupId,
      groupName: actions[0]?.metadata.stepName || 'RFP Completion',
      timestamp: actions[0]?.timestamp || new Date().toISOString(),
      actions: actions.sort((a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ),
    }));
  }, [actionHistory]);

  // -------------------------------------------------------------------------
  // Document Action Execution (must be defined before AI Action Tracking)
  // -------------------------------------------------------------------------

  const registerActionHandler = useCallback((handler: (action: DocumentAction) => void) => {
    setActionHandler(() => handler);
  }, []);

  const executeDocumentAction = useCallback((action: DocumentAction) => {
    setLastAction(action);

    if (actionHandler) {
      actionHandler(action);
    }

    // Dispatch custom event for cross-component communication
    window.dispatchEvent(new CustomEvent('documentBuilderAction', {
      detail: action,
    }));
  }, [actionHandler]);

  // -------------------------------------------------------------------------
  // AI Action Tracking Methods
  // -------------------------------------------------------------------------

  const addPendingAction = useCallback((input: CreateActionInput): string => {
    const actionId = generateActionId();
    const groupId = input.groupId || currentGroupId || generateGroupId();

    // Set current group if not set
    if (!currentGroupId) {
      setCurrentGroupId(groupId);
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
        groupId,
      },
      metadata: input.metadata,
    };

    setActionHistory(prev => [...prev, newAction]);

    // If auto-apply, execute immediately
    if (newAction.status === 'auto_applied') {
      const docAction: DocumentAction = {
        type: input.type as DocumentAction['type'],
        sectionTitle: input.target.sectionTitle,
        content: input.payload.content,
      };
      executeDocumentAction(docAction);
    }

    return actionId;
  }, [currentGroupId, executeDocumentAction]);

  const approveAction = useCallback(async (actionId: string): Promise<ActionExecutionResult> => {
    const action = actionHistory.find(a => a.actionId === actionId);
    if (!action) {
      return { success: false, actionId, error: 'Action not found' };
    }

    if (action.status !== 'pending') {
      return { success: false, actionId, error: 'Action is not pending' };
    }

    // Update status to approved
    setActionHistory(prev =>
      prev.map(a =>
        a.actionId === actionId ? { ...a, status: 'approved' as const } : a
      )
    );

    // Execute the document action
    const docAction: DocumentAction = {
      type: action.type as DocumentAction['type'],
      sectionTitle: action.target.sectionTitle,
      content: action.payload.content,
    };
    executeDocumentAction(docAction);

    return { success: true, actionId };
  }, [actionHistory, executeDocumentAction]);

  const rejectAction = useCallback((actionId: string): void => {
    setActionHistory(prev =>
      prev.map(a =>
        a.actionId === actionId ? { ...a, status: 'rejected' as const } : a
      )
    );
  }, []);

  const undoAction = useCallback(async (actionId: string): Promise<ActionExecutionResult> => {
    const action = actionHistory.find(a => a.actionId === actionId);
    if (!action) {
      return { success: false, actionId, error: 'Action not found' };
    }

    if (action.status !== 'approved' && action.status !== 'auto_applied') {
      return { success: false, actionId, error: 'Action cannot be undone' };
    }

    // For demo purposes, we'll dispatch a delete action for the section
    if (action.type === 'add_section' && action.target.sectionTitle) {
      const undoDocAction: DocumentAction = {
        type: 'navigate', // Using navigate as a placeholder for undo
        sectionTitle: action.target.sectionTitle,
      };

      window.dispatchEvent(new CustomEvent('documentBuilderUndo', {
        detail: {
          actionId,
          sectionTitle: action.target.sectionTitle,
        },
      }));
    }

    // Update status to indicate it was undone
    setActionHistory(prev =>
      prev.map(a =>
        a.actionId === actionId ? { ...a, status: 'rejected' as const } : a
      )
    );

    return { success: true, actionId };
  }, [actionHistory]);

  const approveAllPending = useCallback(async (): Promise<void> => {
    const pending = actionHistory.filter(a => a.status === 'pending');
    for (const action of pending) {
      await approveAction(action.actionId);
    }
  }, [actionHistory, approveAction]);

  const clearActionHistory = useCallback((): void => {
    setActionHistory([]);
    setCurrentGroupId(null);
  }, []);

  // -------------------------------------------------------------------------
  // Highlight Management
  // -------------------------------------------------------------------------

  const setHighlight = useCallback((sectionId: string, state: AnimationState) => {
    setHighlights(prev => ({
      ...prev,
      [sectionId]: state,
    }));
  }, []);

  const clearHighlight = useCallback((sectionId: string) => {
    setHighlights(prev => {
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  }, []);

  const clearAllHighlights = useCallback(() => {
    setHighlights({});
  }, []);

  const triggerHighlightSequence = useCallback((
    sectionId: string,
    options: HighlightSequenceOptions = {}
  ) => {
    // Beacon timing: 1.1s in → 3s loop → 1.1s out
    const inMs = BEACON_CONFIG.sweepIn * 1000;
    const outMs = BEACON_CONFIG.sweepOut * 1000;
    const { loopDuration = BEACON_LOOP_DURATION * 1000, startWithIn = true } = options;

    if (startWithIn) {
      // Start with 'in' animation
      setHighlight(sectionId, 'in');

      // Transition to 'loop' after in animation
      setTimeout(() => {
        setHighlight(sectionId, 'loop');
      }, inMs);

      // Transition to 'out' after loop duration
      setTimeout(() => {
        setHighlight(sectionId, 'out');
      }, inMs + loopDuration);

      // Clear highlight after 'out' animation
      setTimeout(() => {
        clearHighlight(sectionId);
      }, inMs + loopDuration + outMs);
    } else {
      // Start directly in 'loop' state
      setHighlight(sectionId, 'loop');

      // Transition to 'out' after loop duration
      setTimeout(() => {
        setHighlight(sectionId, 'out');
      }, loopDuration);

      // Clear highlight after 'out' animation
      setTimeout(() => {
        clearHighlight(sectionId);
      }, loopDuration + outMs);
    }
  }, [setHighlight, clearHighlight]);

  // -------------------------------------------------------------------------
  // Global Function for Opening Chat with Agent
  // -------------------------------------------------------------------------

  useEffect(() => {
    // Register global function to open unified chat with document builder agent
    const windowWithChat = window as Window & {
      openUnifiedChatWithAgent?: (agentId: string) => void;
    };
    windowWithChat.openUnifiedChatWithAgent = (agentId: string) => {
      // Dispatch event for UnifiedChatContext to handle
      window.dispatchEvent(new CustomEvent('openChatWithAgent', {
        detail: { agentId },
      }));
      setAssistantActive(true);
    };

    return () => {
      delete windowWithChat.openUnifiedChatWithAgent;
    };
  }, []);

  // -------------------------------------------------------------------------
  // Context Value
  // -------------------------------------------------------------------------

  const value: DocumentBuilderAssistantContextType = {
    highlights,
    setHighlight,
    clearHighlight,
    clearAllHighlights,
    triggerHighlightSequence,
    executeDocumentAction,
    registerActionHandler,
    isAssistantActive,
    setAssistantActive,
    lastAction,
    // AI Action Tracking
    actionHistory,
    pendingActions,
    actionGroups,
    addPendingAction,
    approveAction,
    rejectAction,
    undoAction,
    approveAllPending,
    clearActionHistory,
  };

  return (
    <DocumentBuilderAssistantContext.Provider value={value}>
      {children}
    </DocumentBuilderAssistantContext.Provider>
  );
};

export default DocumentBuilderAssistantProvider;
