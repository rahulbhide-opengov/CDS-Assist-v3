/**
 * Knowledge System Type Definitions
 * Comprehensive types for document management, references, and @ mentions
 */

export type DocumentType = 'markdown' | 'pdf' | 'excel' | 'csv' | 'word' | 'txt';
export type ReferenceType = 'knowledge' | 'agent' | 'skill' | 'tool';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string; // Markdown content
  type: DocumentType;
  originalFile?: Blob;
  originalFileName?: string;
  metadata: {
    author: string;
    created: Date;
    modified: Date;
    tags: string[];
    references: DocumentReference[];
    referencedBy: string[]; // Document IDs that reference this document
    version: number;
    size?: number;
    mimeType?: string;
  };
  permissions: {
    owner: string;
    public: boolean;
    sharedWith: string[];
    canEdit: string[];
    canView: string[];
  };
  searchableContent?: string; // Extracted text for search
  embedding?: number[]; // Vector embedding for semantic search
  publishingStatus: 'draft' | 'published' | 'archived';
}

export interface DocumentReference {
  id: string;
  type: ReferenceType;
  entityId: string;
  entityName: string;
  position?: { start: number; end: number };
  context?: string;
}


export interface MentionSuggestion {
  id: string;
  type: ReferenceType;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  path?: string; // e.g., @seamstress/contexts/business-logic
  metadata?: any;
}

export interface SearchResult {
  document: KnowledgeDocument;
  score: number;
  highlights?: {
    field: string;
    snippet: string;
    position: { start: number; end: number };
  }[];
}

export interface UploadResult {
  success: boolean;
  documentId?: string;
  error?: string;
  extractedContent?: string;
  metadata?: Partial<KnowledgeDocument['metadata']>;
  originalFile?: Blob;
  originalFileName?: string;
}

export interface KnowledgeContext {
  currentDocument?: KnowledgeDocument;
  recentDocuments: KnowledgeDocument[];
  relatedDocuments: KnowledgeDocument[];
  activeReferences: DocumentReference[];
}

export interface VersionHistory {
  documentId: string;
  versions: DocumentVersion[];
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  metadata: KnowledgeDocument['metadata'];
  created: Date;
  author: string;
  changeDescription?: string;
}

export interface KnowledgeStats {
  totalDocuments: number;
  documentsByType: Record<DocumentType, number>;
  totalSize: number;
  lastUpdated: Date;
  mostReferenced: string[];
  recentlyViewed: string[];
}

// Integration with existing agent/skill types
export interface AgentKnowledgeBinding {
  agentId: string;
  documentIds: string[];
  context: string;
  priority: number;
}

export interface SkillKnowledgeBinding {
  skillId: string;
  documentIds: string[];
  requiredContext: string[];
}

// @ Mention trigger patterns
export const MENTION_PATTERNS = {
  knowledge: /^@knowledge\/([\w-\/]+)/,
  agent: /^@agent\/([\w-]+)/,
  skill: /^@skill\/([\w-]+)/,
  tool: /^@tool\/([\w-]+)/,
  seamstress: /^@seamstress\/([\w-\/]+)/,
} as const;

export interface ProcessingJob {
  id: string;
  documentId: string;
  status: ProcessingStatus;
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  result?: {
    extractedText?: string;
    metadata?: any;
    pageCount?: number;
  };
}