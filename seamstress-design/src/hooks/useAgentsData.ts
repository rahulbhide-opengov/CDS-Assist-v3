import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  OGAgent,
  OGListRequest,
  OGListResponse,
  OGApiError,
  OGFilter,
  OGSort
} from '../types/opengov';

interface UseAgentsDataOptions {
  autoFetch?: boolean;
  pageSize?: number;
  initialFilters?: OGFilter[];
  initialSort?: OGSort;
  pollingInterval?: number;
}

interface UseAgentsDataReturn {
  agents: OGAgent[];
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
  deleteAgent: (id: string) => Promise<void>;
  updateAgent: (id: string, updates: Partial<OGAgent>) => Promise<void>;
  createAgent: (agent: Omit<OGAgent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OGAgent>;
}

const mockAgents: OGAgent[] = [
  {
    id: '1',
    name: 'Category Code Recommender',
    summary: 'Recommend category codes',
    description: 'AI-powered agent that analyzes spending patterns and recommends appropriate category codes for budget items',
    status: 'draft',
    createdBy: 'OpenGov',
    category: 'Finance',
    tags: ['budget', 'classification', 'automation'],
    activity: {
      actions: 100,
      lastUsed: '2024-03-15T10:30:00Z',
      uniqueUsers: 25
    },
    createdAt: '2024-02-01T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'OG Helper',
    summary: 'Helps OpenGov employees quickly find accurate answers to process and product questions',
    description: 'Internal knowledge base assistant with access to documentation, policies, and procedures',
    status: 'published',
    createdBy: 'OpenGov',
    category: 'Support',
    tags: ['help', 'documentation', 'internal'],
    activity: {
      actions: 325,
      lastUsed: '2024-03-14T15:45:00Z',
      uniqueUsers: 87
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-14T15:45:00Z'
  },
  {
    id: '3',
    name: 'Document Specialist',
    summary: 'Streamlines communication between departments by providing structured document analysis',
    description: 'Advanced document processing agent with OCR, classification, and extraction capabilities',
    status: 'published',
    createdBy: 'Benson Barley',
    category: 'Document Management',
    tags: ['documents', 'analysis', 'communication'],
    activity: {
      actions: 9,
      lastUsed: '2024-03-13T09:20:00Z',
      uniqueUsers: 3
    },
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-03-13T09:20:00Z'
  },
  {
    id: '4',
    name: 'Compliance Auditor',
    summary: 'Enhances user experience by allowing employees to efficiently search through company documents',
    description: 'Automated compliance checking against regulatory requirements and internal policies',
    status: 'published',
    createdBy: 'Benson Barley',
    category: 'Compliance',
    tags: ['audit', 'compliance', 'search'],
    activity: {
      actions: 78,
      lastUsed: '2024-03-12T14:00:00Z',
      uniqueUsers: 15
    },
    createdAt: '2024-02-10T10:30:00Z',
    updatedAt: '2024-03-12T14:00:00Z'
  },
  {
    id: '5',
    name: 'Legal Writer',
    summary: 'Fosters a collaborative environment by integrating feedback from multiple stakeholders',
    description: 'Assists in drafting legal documents with templates, clause libraries, and version control',
    status: 'published',
    createdBy: 'OpenGov',
    category: 'Legal',
    tags: ['legal', 'writing', 'collaboration'],
    activity: {
      actions: 450,
      lastUsed: '2024-03-11T11:30:00Z',
      uniqueUsers: 62
    },
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-03-11T11:30:00Z'
  },
  {
    id: '6',
    name: 'Form Builder',
    summary: 'Empowers users with a comprehensive guide to navigate complex regulatory requirements',
    description: 'Dynamic form generation with conditional logic, validation, and workflow integration',
    status: 'draft',
    createdBy: 'OpenGov',
    category: 'Forms',
    tags: ['forms', 'regulatory', 'workflow'],
    activity: {
      actions: 89,
      lastUsed: '2024-03-10T16:45:00Z',
      uniqueUsers: 28
    },
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-03-10T16:45:00Z'
  }
];

export function useAgentsData(options: UseAgentsDataOptions = {}): UseAgentsDataReturn {
  const {
    autoFetch = true,
    pageSize: initialPageSize = 10,
    initialFilters = [],
    initialSort = { field: 'updatedAt', direction: 'desc' },
    pollingInterval = 0
  } = options;

  const [agents, setAgents] = useState<OGAgent[]>([]);
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

  const fetchAgents = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredAgents = [...mockAgents];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredAgents = filteredAgents.filter(agent =>
          agent.name.toLowerCase().includes(searchLower) ||
          agent.summary.toLowerCase().includes(searchLower) ||
          agent.description?.toLowerCase().includes(searchLower) ||
          agent.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      filters.forEach(filter => {
        filteredAgents = filteredAgents.filter(agent => {
          const value = agent[filter.field as keyof OGAgent];
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

      filteredAgents.sort((a, b) => {
        const aValue = a[sort.field as keyof OGAgent] as any;
        const bValue = b[sort.field as keyof OGAgent] as any;

        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedAgents = filteredAgents.slice(startIndex, endIndex);

      setAgents(paginatedAgents);
      setTotal(filteredAgents.length);

      if (pollingInterval > 0) {
        pollingTimeoutRef.current = setTimeout(fetchAgents, pollingInterval);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError({
          code: 'FETCH_ERROR',
          message: err.message || 'Failed to fetch agents',
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, sort, search, pollingInterval]);

  const refetch = useCallback(async () => {
    await fetchAgents();
  }, [fetchAgents]);

  const deleteAgent = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedMockAgents = mockAgents.filter(a => a.id !== id);
      mockAgents.length = 0;
      mockAgents.push(...updatedMockAgents);

      await refetch();
    } catch (err: any) {
      throw {
        code: 'DELETE_ERROR',
        message: err.message || 'Failed to delete agent',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const updateAgent = useCallback(async (id: string, updates: Partial<OGAgent>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const agentIndex = mockAgents.findIndex(a => a.id === id);
      if (agentIndex !== -1) {
        mockAgents[agentIndex] = {
          ...mockAgents[agentIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }

      await refetch();
    } catch (err: any) {
      throw {
        code: 'UPDATE_ERROR',
        message: err.message || 'Failed to update agent',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const createAgent = useCallback(async (
    agent: Omit<OGAgent, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OGAgent> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newAgent: OGAgent = {
        ...agent,
        id: String(mockAgents.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockAgents.push(newAgent);
      await refetch();

      return newAgent;
    } catch (err: any) {
      throw {
        code: 'CREATE_ERROR',
        message: err.message || 'Failed to create agent',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  useEffect(() => {
    if (autoFetch) {
      fetchAgents();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [fetchAgents, autoFetch]);

  return {
    agents,
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
    deleteAgent,
    updateAgent,
    createAgent
  };
}