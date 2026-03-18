/**
 * Agent Studio Workspace Types
 * Types for the workspace demo showing cross-suite mutations and agent coordination
 */

import type { Message, Conversation } from '@opengov/components-ai-patterns';

// ============================================================================
// Suite Types
// ============================================================================

export type SuiteCode = 'EAM' | 'B&P' | 'PRO' | 'FIN' | 'R&T' | 'PLC' | 'STUDIO' | 'DOCUMENT';

export interface Suite {
  code: SuiteCode;
  name: string;
  color: string;
  icon: string;
}

// ============================================================================
// Mutation Types
// ============================================================================

export type MutationOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type MutationStatus = 'staged' | 'applied' | 'reverted' | 'failed' | 'blocked';

export interface StagedMutation {
  id: string;
  suite: SuiteCode;
  operation: MutationOperation;
  table: string;
  displayName: string;
  description?: string;
  data: Record<string, any>;
  linkedMutations: string[]; // IDs of related mutations
  status: MutationStatus;
  canRevert: boolean;
  appliedAt?: string;
  appliedBy?: string;
  revertedAt?: string;
  revertedBy?: string;
  requiresUserAction?: {
    reason: string;
    actionNeeded: string;
    blocking: boolean;
  };
}

export interface ApplyResult {
  success: boolean;
  applied: number;
  failed: number;
  errors?: string[];
  timestamp: string;
}

export interface RevertResult {
  success: boolean;
  reverted: number;
  failed: number;
  errors?: string[];
  timestamp: string;
}

// ============================================================================
// Agent Types
// ============================================================================

export type AgentStatus = 'idle' | 'analyzing' | 'planning' | 'creating' | 'complete' | 'error';

export interface WorkspaceAgent {
  id: string;
  name: string;
  type: string;
  status: AgentStatus;
  progress?: number;
  currentAction?: string;
  toolCalls?: string[];
  results?: {
    summary: string;
    details?: any;
  };
  startedAt?: string;
  completedAt?: string;
}

export interface AgentActivity {
  id: string;
  timestamp: Date;
  agentName: string;
  action: string;
  details: string;
  toolCalls?: string[];
  mutationsCreated?: string[];
  status: 'success' | 'failed' | 'pending';
}

// ============================================================================
// Document Types
// ============================================================================

export type DocumentStatus = 'uploading' | 'processing' | 'indexed' | 'error';
export type DocumentType = 'pdf' | 'doc' | 'excel' | 'image' | 'presentation' | 'plan' | 'report';

export interface WorkspaceDocument {
  id: string;
  name: string;
  type: DocumentType;
  size?: number;
  status: DocumentStatus;
  uploadedAt: Date;
  uploadedBy?: string;
  purpose?: string;
  summary?: string;
  embeddings?: number;
  citations?: number;
}

export interface GeneratedDocument {
  id: string;
  type: DocumentType;
  name: string;
  format: string;
  pages?: number;
  thumbnail?: string;
  previewUrl?: string;
  downloadUrl?: string;
  generatedBy: string;
  generatedAt: Date;
  description?: string;
}

// ============================================================================
// Data Source Types
// ============================================================================

export interface DataSource {
  id: string;
  suite: SuiteCode;
  name: string;
  table: string;
  recordsQueried: number;
  lastQueried: Date;
  status: 'connected' | 'querying' | 'error';
}

// ============================================================================
// Insights Types
// ============================================================================

export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';
export type InsightCategory = 'action' | 'risk' | 'opportunity' | 'info';

export interface Insight {
  id: string;
  category: InsightCategory;
  priority: InsightPriority;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  metadata?: Record<string, any>;
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  items: Array<{
    label: string;
    status: 'pass' | 'warn' | 'fail';
    description?: string;
  }>;
}

export interface TimelineProjection {
  fastTrack: number;
  standard: number;
  withVariances: number;
  phases: Array<{
    name: string;
    startDay: number;
    endDay: number;
    description: string;
  }>;
}

// ============================================================================
// Workspace State Types
// ============================================================================

export interface WorkspaceState {
  // Demo step (0-10)
  demoStep: number;

  // Conversation
  conversation: Conversation;
  isLoading: boolean;
  thinkingMessage?: string;

  // Context
  documents: WorkspaceDocument[];
  generatedDocuments: GeneratedDocument[];
  agents: WorkspaceAgent[];
  dataSources: DataSource[];
  activityLog: AgentActivity[];

  // Insights
  priorityActions: Insight[];
  riskAssessment?: RiskAssessment;
  timelineProjection?: TimelineProjection;
  aiInsights: string[];

  // Mutations
  stagedMutations: StagedMutation[];
  appliedMutations: StagedMutation[];

  // UI State
  showMutationOutput: boolean;
  showAppliedPanel: boolean;
  applyProgress: number;
}

// ============================================================================
// Demo Configuration
// ============================================================================

export interface DemoConfig {
  autoPlay: boolean;
  speed: number; // 0.5x, 1x, 2x
  stepDurations: Record<number, number>; // ms for each step
  enableAnimations: boolean;
}

// ============================================================================
// Workspace Context Type
// ============================================================================

export interface WorkspaceContextType {
  state: WorkspaceState;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  applyMutations: (mutationIds?: string[]) => Promise<ApplyResult>;
  revertMutation: (mutationId: string) => Promise<RevertResult>;
  revertSuite: (suite: SuiteCode) => Promise<RevertResult>;
  resetDemo: () => void;

  // UI Actions
  setShowMutationOutput: (show: boolean) => void;
  expandMutationSuite: (suite: SuiteCode) => void;

  // Demo Controls
  pauseDemo: () => void;
  resumeDemo: () => void;
  skipToStep: (step: number) => void;
}
