import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  OGTool,
  OGListRequest,
  OGListResponse,
  OGApiError,
  OGFilter,
  OGSort
} from '../types/opengov';

interface UseToolsDataOptions {
  autoFetch?: boolean;
  pageSize?: number;
  initialFilters?: OGFilter[];
  initialSort?: OGSort;
  pollingInterval?: number;
}

interface UseToolsDataReturn {
  tools: OGTool[];
  loading: boolean;
  error: OGApiError | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: OGFilter[]) => void;
  setSort: (sort: OGSort) => void;
  setSearch: (search: string) => void;
  deleteTool: (id: string) => Promise<void>;
  updateTool: (id: string, updates: Partial<OGTool>) => Promise<void>;
  createTool: (tool: Omit<OGTool, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OGTool>;
}

const mockTools: OGTool[] = [
  {
    id: '1',
    name: 'Budget API',
    description: 'RESTful API for budget data operations',
    category: 'API',
    type: 'api',
    status: 'published',
    endpoint: 'https://api.opengov.com/v1/budget',
    authentication: {
      type: 'apiKey',
      config: {
        header: 'X-API-Key',
        required: true
      }
    },
    parameters: [
      {
        name: 'fiscalYear',
        in: 'query',
        type: 'integer',
        required: false,
        description: 'Fiscal year for budget data'
      },
      {
        name: 'departmentId',
        in: 'path',
        type: 'string',
        required: true,
        description: 'Department identifier'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Successful response with budget data',
        schema: { type: 'object' }
      },
      {
        status: 404,
        description: 'Department not found'
      }
    ],
    usage: {
      count: 15234,
      lastUsed: '2024-03-15T16:30:00Z',
      errors: 23
    },
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-03-15T16:30:00Z'
  },
  {
    id: '2',
    name: 'Document Database',
    description: 'NoSQL database for document storage and retrieval',
    category: 'Database',
    type: 'database',
    status: 'published',
    endpoint: 'mongodb://docs.opengov.internal:27017',
    authentication: {
      type: 'basic',
      config: {
        connectionString: 'encrypted'
      }
    },
    parameters: [
      {
        name: 'collection',
        in: 'query',
        type: 'string',
        required: true,
        description: 'Database collection name'
      },
      {
        name: 'query',
        in: 'body',
        type: 'object',
        required: false,
        description: 'MongoDB query object'
      }
    ],
    usage: {
      count: 45678,
      lastUsed: '2024-03-15T17:00:00Z',
      errors: 12
    },
    createdAt: '2024-01-05T10:30:00Z',
    updatedAt: '2024-03-15T17:00:00Z'
  },
  {
    id: '3',
    name: 'File Storage Service',
    description: 'Cloud-based file storage and management',
    category: 'Storage',
    type: 'file',
    status: 'published',
    endpoint: 's3://opengov-files.s3.amazonaws.com',
    authentication: {
      type: 'oauth2',
      config: {
        authUrl: 'https://auth.opengov.com/oauth2/authorize',
        tokenUrl: 'https://auth.opengov.com/oauth2/token'
      }
    },
    parameters: [
      {
        name: 'bucket',
        in: 'path',
        type: 'string',
        required: true,
        description: 'S3 bucket name'
      },
      {
        name: 'key',
        in: 'path',
        type: 'string',
        required: true,
        description: 'Object key'
      }
    ],
    usage: {
      count: 8923,
      lastUsed: '2024-03-15T15:45:00Z',
      errors: 5
    },
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-03-15T15:45:00Z'
  },
  {
    id: '4',
    name: 'Slack Integration',
    description: 'Send notifications and updates to Slack channels',
    category: 'Communication',
    type: 'integration',
    status: 'published',
    endpoint: 'https://hooks.slack.com/services',
    authentication: {
      type: 'apiKey',
      config: {
        webhook: true
      }
    },
    parameters: [
      {
        name: 'channel',
        in: 'body',
        type: 'string',
        required: true,
        description: 'Slack channel ID or name'
      },
      {
        name: 'message',
        in: 'body',
        type: 'object',
        required: true,
        description: 'Message payload'
      }
    ],
    usage: {
      count: 3456,
      lastUsed: '2024-03-15T17:15:00Z',
      errors: 2
    },
    createdAt: '2024-02-01T14:20:00Z',
    updatedAt: '2024-03-15T17:15:00Z'
  },
  {
    id: '5',
    name: 'PDF Generator',
    description: 'Generate PDF documents from templates and data',
    category: 'Document Processing',
    type: 'utility',
    status: 'draft',
    endpoint: 'https://pdf.opengov.com/v2/generate',
    authentication: {
      type: 'apiKey',
      config: {
        header: 'Authorization',
        prefix: 'Bearer'
      }
    },
    parameters: [
      {
        name: 'template',
        in: 'body',
        type: 'string',
        required: true,
        description: 'Template ID or inline template'
      },
      {
        name: 'data',
        in: 'body',
        type: 'object',
        required: true,
        description: 'Data to merge with template'
      },
      {
        name: 'format',
        in: 'query',
        type: 'string',
        required: false,
        description: 'Output format options'
      }
    ],
    usage: {
      count: 567,
      lastUsed: '2024-03-14T12:00:00Z',
      errors: 8
    },
    createdAt: '2024-02-15T09:30:00Z',
    updatedAt: '2024-03-14T12:00:00Z'
  },
  {
    id: '6',
    name: 'Email Service',
    description: 'Send transactional and notification emails',
    category: 'Communication',
    type: 'integration',
    status: 'published',
    endpoint: 'https://email.opengov.com/api/send',
    authentication: {
      type: 'apiKey',
      config: {
        header: 'X-Email-API-Key'
      }
    },
    parameters: [
      {
        name: 'to',
        in: 'body',
        type: 'array',
        required: true,
        description: 'Recipient email addresses'
      },
      {
        name: 'subject',
        in: 'body',
        type: 'string',
        required: true,
        description: 'Email subject'
      },
      {
        name: 'body',
        in: 'body',
        type: 'object',
        required: true,
        description: 'Email body (HTML and text)'
      }
    ],
    usage: {
      count: 12345,
      lastUsed: '2024-03-15T17:30:00Z',
      errors: 34
    },
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-03-15T17:30:00Z'
  }
];

export function useToolsData(options: UseToolsDataOptions = {}): UseToolsDataReturn {
  const {
    autoFetch = true,
    pageSize: initialPageSize = 10,
    initialFilters = [],
    initialSort = { field: 'updatedAt', direction: 'desc' },
    pollingInterval = 0
  } = options;

  const [tools, setTools] = useState<OGTool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<OGApiError | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<OGFilter[]>(initialFilters);
  const [sort, setSort] = useState<OGSort>(initialSort);
  const [search, setSearch] = useState('');

  const abortControllerRef = useRef<AbortController | null>(null);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTools = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredTools = [...mockTools];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredTools = filteredTools.filter(tool =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.description.toLowerCase().includes(searchLower) ||
          tool.category.toLowerCase().includes(searchLower) ||
          tool.type.toLowerCase().includes(searchLower)
        );
      }

      filters.forEach(filter => {
        filteredTools = filteredTools.filter(tool => {
          const value = tool[filter.field as keyof OGTool];
          switch (filter.operator) {
            case 'equals':
              return value === filter.value;
            case 'contains':
              return String(value).includes(filter.value);
            default:
              return true;
          }
        });
      });

      filteredTools.sort((a, b) => {
        const aValue = a[sort.field as keyof OGTool] as any;
        const bValue = b[sort.field as keyof OGTool] as any;

        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTools = filteredTools.slice(startIndex, endIndex);

      setTools(paginatedTools);
      setTotal(filteredTools.length);

      if (pollingInterval > 0) {
        pollingTimeoutRef.current = setTimeout(fetchTools, pollingInterval);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError({
          code: 'FETCH_ERROR',
          message: err.message || 'Failed to fetch tools',
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, sort, search, pollingInterval]);

  const refetch = useCallback(async () => {
    await fetchTools();
  }, [fetchTools]);

  const deleteTool = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedMockTools = mockTools.filter(t => t.id !== id);
      mockTools.length = 0;
      mockTools.push(...updatedMockTools);

      await refetch();
    } catch (err: any) {
      throw {
        code: 'DELETE_ERROR',
        message: err.message || 'Failed to delete tool',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const updateTool = useCallback(async (id: string, updates: Partial<OGTool>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const toolIndex = mockTools.findIndex(t => t.id === id);
      if (toolIndex !== -1) {
        mockTools[toolIndex] = {
          ...mockTools[toolIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }

      await refetch();
    } catch (err: any) {
      throw {
        code: 'UPDATE_ERROR',
        message: err.message || 'Failed to update tool',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const createTool = useCallback(async (
    tool: Omit<OGTool, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OGTool> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newTool: OGTool = {
        ...tool,
        id: String(mockTools.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockTools.push(newTool);
      await refetch();

      return newTool;
    } catch (err: any) {
      throw {
        code: 'CREATE_ERROR',
        message: err.message || 'Failed to create tool',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  useEffect(() => {
    if (autoFetch) {
      fetchTools();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [fetchTools, autoFetch]);

  return {
    tools,
    loading,
    error,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    },
    refetch,
    setPage,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
    setFilters,
    setSort,
    setSearch,
    deleteTool,
    updateTool,
    createTool
  };
}