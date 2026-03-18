import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  OGSkill,
  OGListRequest,
  OGListResponse,
  OGApiError,
  OGFilter,
  OGSort
} from '../types/opengov';

interface UseSkillsDataOptions {
  autoFetch?: boolean;
  pageSize?: number;
  initialFilters?: OGFilter[];
  initialSort?: OGSort;
  pollingInterval?: number;
  agentId?: string;
}

interface UseSkillsDataReturn {
  skills: OGSkill[];
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
  deleteSkill: (id: string) => Promise<void>;
  updateSkill: (id: string, updates: Partial<OGSkill>) => Promise<void>;
  createSkill: (skill: Omit<OGSkill, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OGSkill>;
}

const mockSkills: OGSkill[] = [
  {
    id: '1',
    name: 'Budget Analysis',
    description: 'Analyze budget variances and generate insights',
    category: 'Financial Analysis',
    status: 'published',
    parameters: [
      {
        name: 'timeframe',
        type: 'string',
        required: true,
        description: 'Analysis period (e.g., Q1, FY2024)',
        validation: { enum: ['Q1', 'Q2', 'Q3', 'Q4', 'FY'] }
      },
      {
        name: 'departments',
        type: 'array',
        required: false,
        description: 'List of departments to analyze'
      }
    ],
    examples: [
      'Analyze Q3 budget variance',
      'Show department overspending',
      'Compare actuals vs budget'
    ],
    usage: {
      count: 1234,
      successRate: 98.5,
      avgResponseTime: 2.3
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-15T14:30:00Z'
  },
  {
    id: '2',
    name: 'Document Search',
    description: 'Search and retrieve documents based on natural language queries',
    category: 'Document Management',
    status: 'published',
    agentId: '3',
    parameters: [
      {
        name: 'query',
        type: 'string',
        required: true,
        description: 'Search query'
      },
      {
        name: 'fileTypes',
        type: 'array',
        required: false,
        description: 'Filter by file types'
      },
      {
        name: 'dateRange',
        type: 'object',
        required: false,
        description: 'Date range filter'
      }
    ],
    examples: [
      'Find all budget reports from Q2',
      'Search for compliance documents',
      'Retrieve vendor contracts'
    ],
    usage: {
      count: 3456,
      successRate: 96.2,
      avgResponseTime: 1.8
    },
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-03-14T09:15:00Z'
  },
  {
    id: '3',
    name: 'Form Auto-Fill',
    description: 'Automatically populate form fields with relevant data',
    category: 'Automation',
    status: 'published',
    agentId: '6',
    parameters: [
      {
        name: 'formType',
        type: 'string',
        required: true,
        description: 'Type of form to fill'
      },
      {
        name: 'context',
        type: 'object',
        required: false,
        description: 'Additional context for form filling'
      }
    ],
    examples: [
      'Fill budget request form',
      'Complete vendor registration',
      'Auto-populate employee onboarding'
    ],
    usage: {
      count: 892,
      successRate: 94.7,
      avgResponseTime: 3.1
    },
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-03-13T16:20:00Z'
  },
  {
    id: '4',
    name: 'Compliance Check',
    description: 'Verify compliance with regulations and internal policies',
    category: 'Compliance',
    status: 'published',
    agentId: '4',
    parameters: [
      {
        name: 'documentId',
        type: 'string',
        required: true,
        description: 'Document to check'
      },
      {
        name: 'regulations',
        type: 'array',
        required: false,
        description: 'Specific regulations to check against'
      }
    ],
    examples: [
      'Check GASB compliance',
      'Verify procurement policy adherence',
      'Review audit requirements'
    ],
    usage: {
      count: 567,
      successRate: 99.1,
      avgResponseTime: 4.5
    },
    createdAt: '2024-02-10T13:45:00Z',
    updatedAt: '2024-03-12T11:00:00Z'
  },
  {
    id: '5',
    name: 'Report Generation',
    description: 'Generate custom reports from various data sources',
    category: 'Reporting',
    status: 'draft',
    parameters: [
      {
        name: 'reportType',
        type: 'string',
        required: true,
        description: 'Type of report to generate'
      },
      {
        name: 'dataSource',
        type: 'array',
        required: true,
        description: 'Data sources to include'
      },
      {
        name: 'format',
        type: 'string',
        required: false,
        description: 'Output format',
        default: 'pdf',
        validation: { enum: ['pdf', 'excel', 'csv', 'html'] }
      }
    ],
    examples: [
      'Generate monthly financial report',
      'Create department performance dashboard',
      'Export budget summary to Excel'
    ],
    usage: {
      count: 234,
      successRate: 97.8,
      avgResponseTime: 5.2
    },
    createdAt: '2024-02-15T10:15:00Z',
    updatedAt: '2024-03-11T13:30:00Z'
  }
];

export function useSkillsData(options: UseSkillsDataOptions = {}): UseSkillsDataReturn {
  const {
    autoFetch = true,
    pageSize: initialPageSize = 10,
    initialFilters = [],
    initialSort = { field: 'updatedAt', direction: 'desc' },
    pollingInterval = 0,
    agentId
  } = options;

  const [skills, setSkills] = useState<OGSkill[]>([]);
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

  const fetchSkills = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredSkills = [...mockSkills];

      if (agentId) {
        filteredSkills = filteredSkills.filter(skill => skill.agentId === agentId);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredSkills = filteredSkills.filter(skill =>
          skill.name.toLowerCase().includes(searchLower) ||
          skill.description.toLowerCase().includes(searchLower) ||
          skill.category.toLowerCase().includes(searchLower) ||
          skill.examples?.some(ex => ex.toLowerCase().includes(searchLower))
        );
      }

      filters.forEach(filter => {
        filteredSkills = filteredSkills.filter(skill => {
          const value = skill[filter.field as keyof OGSkill];
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

      filteredSkills.sort((a, b) => {
        const aValue = a[sort.field as keyof OGSkill] as any;
        const bValue = b[sort.field as keyof OGSkill] as any;

        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedSkills = filteredSkills.slice(startIndex, endIndex);

      setSkills(paginatedSkills);
      setTotal(filteredSkills.length);

      if (pollingInterval > 0) {
        pollingTimeoutRef.current = setTimeout(fetchSkills, pollingInterval);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError({
          code: 'FETCH_ERROR',
          message: err.message || 'Failed to fetch skills',
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, sort, search, pollingInterval, agentId]);

  const refetch = useCallback(async () => {
    await fetchSkills();
  }, [fetchSkills]);

  const deleteSkill = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedMockSkills = mockSkills.filter(s => s.id !== id);
      mockSkills.length = 0;
      mockSkills.push(...updatedMockSkills);

      await refetch();
    } catch (err: any) {
      throw {
        code: 'DELETE_ERROR',
        message: err.message || 'Failed to delete skill',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const updateSkill = useCallback(async (id: string, updates: Partial<OGSkill>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const skillIndex = mockSkills.findIndex(s => s.id === id);
      if (skillIndex !== -1) {
        mockSkills[skillIndex] = {
          ...mockSkills[skillIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }

      await refetch();
    } catch (err: any) {
      throw {
        code: 'UPDATE_ERROR',
        message: err.message || 'Failed to update skill',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const createSkill = useCallback(async (
    skill: Omit<OGSkill, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OGSkill> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newSkill: OGSkill = {
        ...skill,
        id: String(mockSkills.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockSkills.push(newSkill);
      await refetch();

      return newSkill;
    } catch (err: any) {
      throw {
        code: 'CREATE_ERROR',
        message: err.message || 'Failed to create skill',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  useEffect(() => {
    if (autoFetch) {
      fetchSkills();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [fetchSkills, autoFetch]);

  return {
    skills,
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
    deleteSkill,
    updateSkill,
    createSkill
  };
}