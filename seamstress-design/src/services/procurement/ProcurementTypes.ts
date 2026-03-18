/**
 * Extended Procurement Type Definitions
 *
 * Additional types for the Document Builder that extend the core procurement types.
 * These types are used by DocumentStorage, DocumentService, and related services.
 *
 * NOTE: Core types (SharedSection, Signature, Variable, ValidationReport, etc.)
 * are now defined in types/procurement.ts and re-exported here for compatibility.
 */

import type { Contact, Attachment, Approval, Document } from '../../types/procurement';

// Re-export core types from types/procurement.ts for backward compatibility
export type {
  SectionCategory,
  SharedSection,
  SignatureType,
  SignatureStatus,
  Signature,
  VariableSource,
  Variable,
  ValidationSeverity,
  ValidationResult,
  ValidationReport,
  QuestionOption,
  ProjectQuestionAnswer,
} from '../../types/procurement';

// ============================================================================
// Extended Approval Types
// ============================================================================

export type ApprovalMode = 'serial' | 'parallel';

export interface ExtendedApproval extends Approval {
  documentId: string;
  step: number; // Step in approval workflow
  mode: ApprovalMode;
  approvedAt?: string;
  rejectedAt?: string;
}

// ============================================================================
// Extended Attachment/Exhibit Types
// ============================================================================

export interface Exhibit extends Attachment {
  exhibitId: string; // Alias for attachmentId
  documentId: string;
  order: number; // Position in exhibit list
  label?: string; // E.g., "Exhibit A", "Exhibit B"
  fileBlob?: Blob; // Store file blob in IndexedDB
  description?: string;
}

// ============================================================================
// Audit Log Types
// ============================================================================

export type AuditEntityType =
  | 'project'
  | 'document'
  | 'template'
  | 'section'
  | 'exhibit'
  | 'signature'
  | 'approval';

export type AuditAction =
  | 'created'
  | 'updated'
  | 'deleted'
  | 'approved'
  | 'rejected'
  | 'signed'
  | 'uploaded'
  | 'restored';

export interface AuditLog {
  logId: string;
  entityType: AuditEntityType;
  entityId: string;
  userId: string;
  userName: string;
  action: AuditAction;
  timestamp: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  metadata?: Record<string, any>;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'approval_requested'
  | 'approval_approved'
  | 'approval_rejected'
  | 'signature_requested'
  | 'signature_signed'
  | 'document_updated'
  | 'document_finalized'
  | 'comment_added';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  notificationId: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  actionUrl?: string; // Deep link to relevant entity
  documentId?: string;
  projectId?: string;
  createdAt: string;
  readAt?: string;
}

// ============================================================================
// Variable Types (Extended - VariableSource and Variable are re-exported above)
// ============================================================================

import type { VariableSource } from '../../types/procurement';

export interface VariableDefinition {
  name: string;
  source: VariableSource;
  label: string;
  description?: string;
  defaultValue?: any;
  format?: string; // For dates, numbers, etc.
}

// ============================================================================
// Compilation Types
// ============================================================================

export type CompilationStatus = 'pending' | 'compiling' | 'success' | 'error';

export type CompilationFormat = 'pdf' | 'docx';

export interface CompilationResult {
  documentId: string;
  format: CompilationFormat;
  status: CompilationStatus;
  url?: string; // URL to compiled file (blob URL or cloud URL)
  blob?: Blob; // Compiled file blob
  error?: string;
  compiledAt?: string;
  fileSize?: number;
}

export interface CompilationOptions {
  includeExhibits: boolean;
  includeSignatureBlock: boolean;
  includeTableOfContents: boolean;
  includeTitlePage: boolean;
  titlePageContent?: {
    title: string;
    subtitle?: string;
    logo?: string;
    date?: string;
  };
  watermark?: string;
  pageNumbering: boolean;
}

// ============================================================================
// Validation Types (Extended - base types re-exported above)
// ============================================================================

// Note: ValidationSeverity, ValidationResult, and ValidationReport are
// defined in types/procurement.ts and re-exported at the top of this file.
// The ValidationResult here adds an optional 'fix' action for UI use.

// ============================================================================
// Document Builder State Types
// ============================================================================

export interface DocumentBuilderState {
  document: Document | null;
  selectedSectionId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: string | null;
  validationReport: ValidationReport | null;
  compilationResult: CompilationResult | null;
}

// ============================================================================
// Template Extended Types
// ============================================================================

export interface TemplateSection {
  sectionId: string;
  title: string;
  content: string;
  order: number;
  type: 'text' | 'list' | 'heading' | 'shared';
  isRequired: boolean;
}

export interface TemplateWithDetails {
  templateId: string;
  name: string;
  type: string;
  description?: string;
  defaultSections: TemplateSection[];
  setupQuestions: TemplateQuestionWithOptions[];
  variables: VariableDefinition[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  usageCount: number;
}

export interface TemplateQuestionWithOptions {
  questionId: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'boolean' | 'date' | 'number';
  required: boolean;
  options?: QuestionOption[];
  conditionalLogic?: {
    showIf: {
      questionId: string;
      value: string | boolean | number;
    };
  };
  defaultValue?: any;
  helpText?: string;
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface SectionSearchFilters {
  category?: SectionCategory;
  tags?: string[];
  query?: string;
}

export interface SectionSearchResult {
  section: SharedSection;
  relevanceScore: number;
  matchedFields: string[];
}

// ============================================================================
// Export Types
// ============================================================================

export interface ExportOptions {
  format: CompilationFormat;
  includeExhibits: boolean;
  includeSignatures: boolean;
  includeApprovals: boolean;
  fileName?: string;
}

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  url?: string;
  fileName: string;
  fileSize: number;
  error?: string;
}

// ============================================================================
// Collaboration Types (Future)
// ============================================================================

export interface Comment {
  commentId: string;
  documentId: string;
  sectionId?: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  replies?: Comment[];
}

export interface DocumentActivity {
  activityId: string;
  documentId: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// Permission Types (Future)
// ============================================================================

export type PermissionLevel = 'view' | 'comment' | 'edit' | 'admin';

export interface DocumentPermission {
  documentId: string;
  userId: string;
  level: PermissionLevel;
  grantedBy: string;
  grantedAt: string;
}

export interface DocumentAccessControl {
  documentId: string;
  isPublic: boolean;
  allowedUsers: DocumentPermission[];
  allowedRoles: string[];
  owner: string;
}
