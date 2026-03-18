export interface OGUser {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

export interface OGTimestamp {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface OGStatus {
  status: 'published' | 'draft' | 'archived';
  isActive?: boolean;
}

export interface OGPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface OGSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface OGFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte';
  value: any;
}

export interface OGListRequest {
  pagination?: Partial<OGPagination>;
  sort?: OGSort;
  filters?: OGFilter[];
  search?: string;
}

export interface OGListResponse<T> {
  data: T[];
  pagination: OGPagination;
  metadata?: Record<string, any>;
}

export interface OGAgent extends OGTimestamp, OGStatus {
  id: string;
  name: string;
  summary: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdBy: string;
  activity: {
    actions: number;
    lastUsed?: string;
    uniqueUsers?: number;
  };
  configuration?: Record<string, any>;
  skills?: string[];
}

export interface OGSkill extends OGTimestamp, OGStatus {
  id: string;
  name: string;
  description: string;
  category: string;
  agentId?: string;
  parameters?: OGSkillParameter[];
  examples?: string[];
  configuration?: Record<string, any>;
  usage: {
    count: number;
    successRate?: number;
    avgResponseTime?: number;
  };
}

export interface OGSkillParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description?: string;
  default?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
  };
}

export interface OGTool extends OGTimestamp, OGStatus {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'api' | 'database' | 'file' | 'integration' | 'utility';
  endpoint?: string;
  authentication?: {
    type: 'none' | 'apiKey' | 'oauth2' | 'basic';
    config?: Record<string, any>;
  };
  parameters?: OGToolParameter[];
  responses?: OGToolResponse[];
  usage: {
    count: number;
    lastUsed?: string;
    errors?: number;
  };
}

export interface OGToolParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'body';
  type: string;
  required: boolean;
  description?: string;
}

export interface OGToolResponse {
  status: number;
  description: string;
  schema?: Record<string, any>;
}

export interface OGKnowledgeDocument extends OGTimestamp, OGStatus {
  id: string;
  title: string;
  content: string;
  type: 'pdf' | 'csv' | 'excel' | 'txt' | 'markdown' | 'word' | 'html';
  size: number;
  mimeType: string;
  folderId?: string;
  tags?: string[];
  metadata?: {
    author?: string;
    version?: string;
    department?: string;
    category?: string;
    keywords?: string[];
  };
  permissions?: {
    read?: string[];
    write?: string[];
    delete?: string[];
  };
  analytics?: {
    views: number;
    downloads: number;
    shares: number;
    lastViewed?: string;
  };
}

export interface OGKnowledgeFolder extends OGTimestamp {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  path: string;
  documentCount: number;
  permissions?: {
    read?: string[];
    write?: string[];
    delete?: string[];
  };
}

export interface OGSearchResult<T = any> {
  item: T;
  score: number;
  highlights?: {
    field: string;
    snippet: string;
  }[];
  type: 'agent' | 'skill' | 'tool' | 'document' | 'folder';
}

export interface OGApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  traceId?: string;
}

export interface OGApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: OGApiError;
  metadata?: {
    requestId: string;
    timestamp: string;
    version: string;
  };
}

export type OGEntityType = 'agent' | 'skill' | 'tool' | 'document' | 'folder';

export interface OGBulkOperation<T = any> {
  operation: 'create' | 'update' | 'delete';
  entities: T[];
  options?: {
    skipValidation?: boolean;
    continueOnError?: boolean;
  };
}

export interface OGBulkResult<T = any> {
  successful: T[];
  failed: {
    entity: T;
    error: OGApiError;
  }[];
  summary: {
    total: number;
    succeeded: number;
    failed: number;
  };
}