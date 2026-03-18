/**
 * AI Actions Types
 *
 * Type definitions for the Document Builder AI action tracking system.
 * Supports audit logging, approval workflows, and relationship tracking.
 */

// =============================================================================
// Core Types
// =============================================================================

export type AIActionType = 'add_section' | 'update_section' | 'delete_section' | 'navigate';
export type AIActionStatus = 'pending' | 'approved' | 'rejected' | 'auto_applied';

/**
 * Preview content shown before an action is approved
 */
export interface PreviewContent {
  title: string;
  body: string;
  variables?: string[];
}

/**
 * Target information for an action
 */
export interface ActionTarget {
  sectionId?: string;
  sectionTitle?: string;
}

/**
 * Payload data for an action
 */
export interface ActionPayload {
  content?: string;
  previousContent?: string;
  previewContent?: PreviewContent;
}

/**
 * Relationship tracking between actions
 */
export interface ActionRelationships {
  /** Parent action that triggered this one */
  parentActionId?: string;
  /** Related actions in the same context */
  relatedActionIds: string[];
  /** Message ID that generated this action */
  messageId?: string;
  /** Group ID for related actions */
  groupId?: string;
}

/**
 * Metadata about the action source
 */
export interface ActionMetadata {
  agentName: string;
  userPrompt?: string;
  stepName?: string;
  demoStep?: string;
}

// =============================================================================
// Main Action Log Interface
// =============================================================================

/**
 * Complete AI action log entry for audit tracking
 */
export interface AIActionLog {
  /** Unique identifier for this action */
  actionId: string;
  /** Type of action being performed */
  type: AIActionType;
  /** Current status of the action */
  status: AIActionStatus;
  /** ISO timestamp of when the action was created */
  timestamp: string;
  /** Target of the action (section info) */
  target: ActionTarget;
  /** Action payload (content, preview) */
  payload: ActionPayload;
  /** Relationship tracking */
  relationships: ActionRelationships;
  /** Action metadata */
  metadata: ActionMetadata;
}

// =============================================================================
// Relationship Grouping
// =============================================================================

/**
 * Group of related actions for visualization
 */
export interface ActionRelationshipGroup {
  /** Unique group identifier */
  groupId: string;
  /** Display name for the group */
  groupName: string;
  /** Timestamp of the first action in the group */
  timestamp: string;
  /** Actions in this group */
  actions: AIActionLog[];
  /** Whether the group is expanded in UI */
  isExpanded?: boolean;
}

// =============================================================================
// UI State Types
// =============================================================================

/**
 * View mode for the action list
 */
export type ActionViewMode = 'grouped' | 'timeline';

/**
 * Filter options for action list
 */
export interface ActionFilterOptions {
  status?: AIActionStatus[];
  type?: AIActionType[];
  searchQuery?: string;
}

/**
 * State for the AIActionsPanel
 */
export interface AIActionsPanelState {
  viewMode: ActionViewMode;
  filters: ActionFilterOptions;
  selectedActionId: string | null;
  expandedGroupIds: string[];
}

// =============================================================================
// Helper Types
// =============================================================================

/**
 * Input for creating a new action
 */
export interface CreateActionInput {
  type: AIActionType;
  target: ActionTarget;
  payload: ActionPayload;
  metadata: ActionMetadata;
  parentActionId?: string;
  groupId?: string;
  messageId?: string;
  /** Whether this action should auto-apply (no approval needed) */
  autoApply?: boolean;
}

/**
 * Result of an action execution
 */
export interface ActionExecutionResult {
  success: boolean;
  actionId: string;
  error?: string;
}

// =============================================================================
// Utility Functions
// =============================================================================

// Re-export ID generation utilities from centralized module
export { generateActionId, generateGroupId } from '../utils/id';

/**
 * Check if an action type requires approval
 */
export function requiresApproval(type: AIActionType): boolean {
  // Navigate actions auto-apply, content changes require approval
  return type !== 'navigate';
}

/**
 * Get display label for action type
 */
export function getActionTypeLabel(type: AIActionType): string {
  switch (type) {
    case 'add_section':
      return 'Add Section';
    case 'update_section':
      return 'Update Section';
    case 'delete_section':
      return 'Delete Section';
    case 'navigate':
      return 'Navigate';
    default:
      return 'Unknown Action';
  }
}

/**
 * Get display label for action status
 */
export function getActionStatusLabel(status: AIActionStatus): string {
  switch (status) {
    case 'pending':
      return 'Pending Approval';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'auto_applied':
      return 'Auto-Applied';
    default:
      return 'Unknown';
  }
}
