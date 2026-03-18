/**
 * Procurement Project Type Definitions
 *
 * Core data model for procurement project management system
 */

// ============================================================================
// Core Entities
// ============================================================================

export type ProjectStatus =
  | 'Draft'
  | 'Review'
  | 'Final'
  | 'Post Pending'
  | 'Open'
  | 'Pending'
  | 'Evaluation'
  | 'Award Pending'
  | 'Closed';

export type LifecyclePhaseType =
  | 'request'
  | 'solicitation'
  | 'builder'
  | 'sourcing'
  | 'evaluations'
  | 'contract';

export type LifecyclePhaseStatus =
  | 'skipped'
  | 'not_started'
  | 'in_progress'
  | 'complete';

export type DocumentType = 'Scope' | 'Attachment' | 'Evaluation' | 'Addenda';

export type DocumentStatus = 'Draft' | 'Review' | 'Final';

export type TemplateType = 'Solicitation' | 'Contract' | 'Intake';

// ============================================================================
// Supporting Types
// ============================================================================

export interface Contact {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  avatarUrl?: string;
}

export interface Department {
  departmentId: string;
  name: string;
  description?: string;
  icon?: string;
}

export interface Category {
  categoryId: string;
  code: string;
  name: string;
  type: 'NIGP' | 'NAICS' | 'UNSPSC';
}

export interface Template {
  templateId: string;
  name: string;
  type: TemplateType;
  description: string;
  sections: Array<{
    title: string;
    type: 'text' | 'list' | 'heading';
    content?: string;
    required?: boolean;
  }>;
  variables: string[];
  questions: string[]; // Array of question IDs
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateQuestion {
  questionId: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'boolean' | 'date';
  required: boolean;
  options?: string[];
  conditionalLogic?: {
    showIf: {
      questionId: string;
      value: string | boolean | number;
    };
  };
}

export interface Budget {
  amount: number;
  account: string;
  description?: string;
}

export interface ProjectTimeline {
  preProposalDate?: string;
  releaseDate?: string;
  postedAt?: string;
  qaSubmissionDeadline?: string;
  qaResponseDeadline?: string;
  responseSubmissionDeadline?: string;
}

export interface StatusHistoryEntry {
  status: ProjectStatus;
  timestamp: string;
  changedBy: string;
  notes?: string;
}

export interface Request {
  requestId: string;
  title: string;
  description?: string;
  createdAt: string;
  createdBy: string;
}

// ============================================================================
// Lifecycle & Actions
// ============================================================================

export interface PhaseAction {
  actionId: string;
  label: string;
  description?: string;
  icon?: string;
  onClick?: () => void;
}

export interface LifecyclePhase {
  phaseId: string;
  phase: LifecyclePhaseType;
  status: LifecyclePhaseStatus;
  startedAt?: string;
  completedAt?: string;
  actions: PhaseAction[];
  subPhases?: LifecyclePhase[];
  nextAction?: {
    label: string;
    color: 'primary' | 'success' | 'info' | 'warning' | 'error';
    onClick?: () => void;
  };
  otherActions?: PhaseAction[];
}

// ============================================================================
// Document Types
// ============================================================================

export interface DocumentSection {
  sectionId: string;
  title: string;
  type: 'text' | 'list' | 'shared' | 'heading';
  content: string; // HTML from Tiptap
  order: number;
  parentId?: string;
  isCollapsed?: boolean;
}

export interface Attachment {
  attachmentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  isInternal: boolean;
}

export interface Revision {
  revisionId: string;
  version: number;
  createdAt: string;
  createdBy: string;
  changes: string;
  documentSnapshot?: string;
}

export interface Approval {
  approvalId: string;
  approver: Contact;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}

export interface Document {
  documentId: string;
  projectId: string;
  type: DocumentType;
  status: DocumentStatus;
  sections: DocumentSection[];
  variables: Record<string, string | number | boolean>;
  attachments: Attachment[];
  internalAttachments: Attachment[];
  revisionHistory: Revision[];
  approvals: Approval[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Checklist Types
// ============================================================================

export type ChecklistCategory = 'project_properties' | 'document_outline' | 'approvals' | 'legal';

export type ChecklistItemStatus = 'complete' | 'incomplete' | 'error';

export interface ChecklistItem {
  itemId: string;
  category: ChecklistCategory;
  label: string;
  description?: string;
  required: boolean;
  status: ChecklistItemStatus;
  autoCheck?: boolean; // Auto-check based on project state
  errorMessage?: string;
  validator?: (project: Project, document?: Document) => boolean;
}

// ============================================================================
// Main Project Type
// ============================================================================

export interface Project {
  projectId: string;
  title: string;
  departmentId: string;
  department: Department;
  procurementContactId: string;
  procurementContact: Contact;
  projectContactId: string;
  projectContact: Contact;
  status: ProjectStatus;
  closedSubstatus?: string;
  templateId: string;
  template: Template;
  setupQuestions: Record<string, string | number | boolean>;
  timeline: ProjectTimeline;
  budget?: Budget;
  categories: Category[];
  isEmergency: boolean;
  requests: Request[];
  createdBy: string;
  createdAt: string;
  lastUpdate: string;
  statusHistory: StatusHistoryEntry[];
  lifecycle: LifecyclePhase[];
  documents: Document[];
  followers: string[];
}

// ============================================================================
// Filter & Search Types
// ============================================================================

export interface ProjectFiltersState {
  status: ProjectStatus[];
  departments: string[];
  templates: TemplateType[];
}

export interface ProjectFilters {
  status: ProjectStatus[];
  departments: string[];
  templates: TemplateType[];
  searchQuery: string;
}

export interface ProjectListState {
  projects: Project[];
  filteredProjects: Project[];
  filters: ProjectFilters;
  isLoading: boolean;
  error?: string;
}

// ============================================================================
// Extended Types (also in ProcurementTypes.ts for backward compatibility)
// ============================================================================

export type SectionCategory =
  | 'legal'
  | 'compliance'
  | 'evaluation'
  | 'financial'
  | 'operational'
  | 'technical'
  | 'other';

export interface SharedSection {
  sectionId: string;
  title: string;
  content: string;
  category: SectionCategory;
  tags: string[];
  description?: string;
  usageCount: number;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type SignatureType = 'wet' | 'electronic';
export type SignatureStatus = 'pending' | 'signed' | 'declined';

export interface Signature {
  signatureId: string;
  documentId: string;
  signerName: string;
  signerTitle: string;
  signerEmail: string;
  signatureType: SignatureType;
  order: number;
  status: SignatureStatus;
  isRequired?: boolean;
  signedAt?: string;
  signatureData?: string;
  comments?: string;
  createdAt?: string;
}

export type VariableSource = 'project' | 'contract' | 'question' | 'custom';

export interface Variable {
  name: string;
  source: VariableSource;
  value: string | number | boolean | Date;
  label?: string;
  description?: string;
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationResult {
  ruleId: string;
  ruleName: string;
  severity: ValidationSeverity;
  passed: boolean;
  message: string;
  location?: {
    sectionId?: string;
    field?: string;
  };
}

export interface ValidationReport {
  documentId: string;
  overallStatus: 'valid' | 'invalid' | 'warnings';
  results: ValidationResult[];
  completionPercentage: number;
  validatedAt: string;
}

export interface QuestionOption {
  optionId: string;
  questionId: string;
  label: string;
  value: string;
  order: number;
}

export interface ProjectQuestionAnswer {
  answerId: string;
  projectId: string;
  questionId: string;
  answer: string | number | boolean | string[];
  answeredAt: string;
  answeredBy: string;
}
