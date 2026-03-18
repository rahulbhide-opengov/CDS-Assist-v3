import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  OGKnowledgeDocument,
  OGKnowledgeFolder,
  OGListRequest,
  OGListResponse,
  OGApiError,
  OGFilter,
  OGSort
} from '../types/opengov';

interface UseKnowledgeDataOptions {
  autoFetch?: boolean;
  pageSize?: number;
  initialFilters?: OGFilter[];
  initialSort?: OGSort;
  pollingInterval?: number;
  folderId?: string;
}

interface UseKnowledgeDataReturn {
  documents: OGKnowledgeDocument[];
  folders: OGKnowledgeFolder[];
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
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: Partial<OGKnowledgeDocument>) => Promise<void>;
  createDocument: (doc: Omit<OGKnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OGKnowledgeDocument>;
  createFolder: (folder: Omit<OGKnowledgeFolder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<OGKnowledgeFolder>;
  deleteFolder: (id: string) => Promise<void>;
}

const mockDocuments: OGKnowledgeDocument[] = [
  {
    id: '8d80d293-f61f-46b4-aa5b-35c5e0c11389',
    title: 'Residential Construction Requirements',
    content: `# Residential Construction Requirements

## Overview
This document contains the complete local building codes for residential construction, including requirements for decks, sheds, additions, and other residential structures.

## Deck Construction

### Permit Requirements
- **Section 3.2.1**: All decks 30 inches or more above ground level require a building permit
- **Section 3.2.2**: Decks less than 200 square feet and less than 30 inches above ground may be exempt from permitting requirements
- **Section 3.2.3**: Building permit applications must be submitted with detailed plans including dimensions, materials, and foundation specifications

### Setback Requirements
- **Section 3.3.1**: Decks must maintain a minimum 10-foot setback from rear property line
- **Section 3.3.2**: Decks must maintain a minimum 5-foot setback from side property lines
- **Section 3.3.3**: Corner lots require 15-foot setback from street-facing property lines
- **Section 3.3.4**: Exceptions may be granted for lots smaller than 5,000 square feet with variance approval

### Materials and Construction
- **Section 3.4.1**: Approved decking materials include pressure-treated lumber, cedar, composite materials, and PVC
- **Section 3.4.2**: Ledger boards must be properly flashed and attached with lag screws or bolts
- **Section 3.4.3**: Footings must extend below frost line (36 inches minimum depth)
- **Section 3.4.4**: Guardrails required for decks 30 inches or more above ground, minimum 36 inches high

### Inspection Requirements
- **Section 3.5.1**: Footing inspection required before pouring concrete
- **Section 3.5.2**: Framing inspection required before decking installation
- **Section 3.5.3**: Final inspection required before certificate of occupancy

## Shed Construction

### Permit Requirements
- **Section 4.2.1**: Sheds over 120 square feet require a building permit
- **Section 4.2.2**: Sheds must not exceed 15 feet in height
- **Section 4.2.3**: One accessory structure under 120 square feet is permitted without a permit per property

### Setback Requirements
- **Section 4.3.1**: Minimum 5-foot setback from all property lines
- **Section 4.3.2**: Sheds must not be located within any easement areas
- **Section 4.3.3**: Maximum lot coverage for all accessory structures is 20% of rear yard area

## Home Additions

### General Requirements
- **Section 5.1.1**: All home additions require a building permit regardless of size
- **Section 5.1.2**: Additions must comply with current energy code requirements
- **Section 5.1.3**: Structural plans must be stamped by a licensed professional engineer

### Setback Requirements
- **Section 5.2.1**: Additions must maintain existing setback requirements or greater
- **Section 5.2.2**: Cannot reduce nonconforming setbacks further
- **Section 5.2.3**: Side yard additions require minimum 5-foot setback`,
    type: 'markdown',
    size: 15678,
    mimeType: 'text/markdown',
    status: 'published',
    folderId: '5',
    tags: ['building-codes', 'residential', 'permits', 'construction', 'regulations'],
    metadata: {
      author: 'Building Department',
      version: '2024.1',
      department: 'Planning & Development',
      category: 'Building Codes',
      keywords: ['building', 'construction', 'permits', 'residential', 'codes', 'deck', 'shed', 'addition']
    },
    permissions: {
      read: ['all'],
      write: ['planning_admin'],
      delete: ['planning_admin']
    },
    analytics: {
      views: 3456,
      downloads: 892,
      shares: 156,
      lastViewed: '2024-03-15T16:45:00Z'
    },
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-03-10T12:30:00Z'
  },
  {
    id: '1',
    title: 'FY2024 Budget Guidelines',
    content: 'Comprehensive guidelines for fiscal year 2024 budget preparation...',
    type: 'pdf',
    size: 2456789,
    mimeType: 'application/pdf',
    status: 'published',
    folderId: '1',
    tags: ['budget', 'guidelines', 'fy2024'],
    metadata: {
      author: 'Finance Department',
      version: '2.1',
      department: 'Finance',
      category: 'Guidelines',
      keywords: ['budget', 'fiscal', 'planning']
    },
    permissions: {
      read: ['all'],
      write: ['finance_admin'],
      delete: ['finance_admin']
    },
    analytics: {
      views: 1234,
      downloads: 456,
      shares: 78,
      lastViewed: '2024-03-15T14:30:00Z'
    },
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z'
  },
  {
    id: '2',
    title: 'Procurement Policy Manual',
    content: 'Standard operating procedures for procurement processes...',
    type: 'word',
    size: 1234567,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'published',
    folderId: '2',
    tags: ['procurement', 'policy', 'manual'],
    metadata: {
      author: 'Procurement Team',
      version: '3.0',
      department: 'Procurement',
      category: 'Policy',
      keywords: ['procurement', 'vendor', 'purchasing']
    },
    analytics: {
      views: 892,
      downloads: 234,
      shares: 45
    },
    createdAt: '2023-12-15T11:30:00Z',
    updatedAt: '2024-02-28T16:45:00Z'
  },
  {
    id: '3',
    title: 'Q3 Financial Report',
    content: 'Third quarter financial performance report with detailed analysis...',
    type: 'excel',
    size: 3456789,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    status: 'published',
    folderId: '1',
    tags: ['financial', 'report', 'q3', 'analysis'],
    metadata: {
      author: 'CFO Office',
      version: '1.0',
      department: 'Finance',
      category: 'Reports',
      keywords: ['quarterly', 'financial', 'performance']
    },
    analytics: {
      views: 567,
      downloads: 123,
      shares: 34,
      lastViewed: '2024-03-14T11:20:00Z'
    },
    createdAt: '2024-02-01T09:15:00Z',
    updatedAt: '2024-02-15T14:30:00Z'
  },
  {
    id: '4',
    title: 'Employee Handbook',
    content: 'Complete guide to company policies, procedures, and benefits...',
    type: 'pdf',
    size: 4567890,
    mimeType: 'application/pdf',
    status: 'published',
    folderId: '3',
    tags: ['hr', 'handbook', 'policies', 'benefits'],
    metadata: {
      author: 'Human Resources',
      version: '2024.1',
      department: 'HR',
      category: 'Handbook',
      keywords: ['employee', 'policies', 'benefits', 'procedures']
    },
    analytics: {
      views: 2345,
      downloads: 678,
      shares: 123
    },
    createdAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-03-10T10:15:00Z'
  },
  {
    id: '5',
    title: 'IT Security Guidelines',
    content: 'Information security best practices and compliance requirements...',
    type: 'markdown',
    size: 234567,
    mimeType: 'text/markdown',
    status: 'draft',
    folderId: '4',
    tags: ['it', 'security', 'compliance', 'guidelines'],
    metadata: {
      author: 'IT Security Team',
      version: '1.5',
      department: 'IT',
      category: 'Security',
      keywords: ['security', 'compliance', 'data protection']
    },
    analytics: {
      views: 456,
      downloads: 89,
      shares: 12
    },
    createdAt: '2024-02-20T13:45:00Z',
    updatedAt: '2024-03-12T15:30:00Z'
  }
];

const mockFolders: OGKnowledgeFolder[] = [
  {
    id: '5',
    name: 'Building & Planning',
    description: 'Building codes, permits, and planning documents',
    path: '/Building & Planning',
    documentCount: 8,
    permissions: {
      read: ['all'],
      write: ['planning_team'],
      delete: ['planning_admin']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z'
  },
  {
    id: '1',
    name: 'Finance',
    description: 'Financial documents and reports',
    path: '/Finance',
    documentCount: 15,
    permissions: {
      read: ['all'],
      write: ['finance_team'],
      delete: ['finance_admin']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-15T12:00:00Z'
  },
  {
    id: '2',
    name: 'Procurement',
    description: 'Procurement policies and procedures',
    path: '/Procurement',
    documentCount: 8,
    permissions: {
      read: ['all'],
      write: ['procurement_team'],
      delete: ['procurement_admin']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-14T10:30:00Z'
  },
  {
    id: '3',
    name: 'HR',
    description: 'Human resources documents',
    path: '/HR',
    documentCount: 12,
    permissions: {
      read: ['employees'],
      write: ['hr_team'],
      delete: ['hr_admin']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-13T09:15:00Z'
  },
  {
    id: '4',
    name: 'IT',
    description: 'IT policies and technical documentation',
    path: '/IT',
    documentCount: 20,
    permissions: {
      read: ['all'],
      write: ['it_team'],
      delete: ['it_admin']
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2024-03-12T14:45:00Z'
  }
];

export function useKnowledgeData(options: UseKnowledgeDataOptions = {}): UseKnowledgeDataReturn {
  const {
    autoFetch = true,
    pageSize: initialPageSize = 10,
    initialFilters = [],
    initialSort = { field: 'updatedAt', direction: 'desc' },
    pollingInterval = 0,
    folderId
  } = options;

  const [documents, setDocuments] = useState<OGKnowledgeDocument[]>([]);
  const [folders, setFolders] = useState<OGKnowledgeFolder[]>([]);
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

  const fetchData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredDocuments = [...mockDocuments];
      let filteredFolders = [...mockFolders];

      if (folderId) {
        filteredDocuments = filteredDocuments.filter(doc => doc.folderId === folderId);
        filteredFolders = filteredFolders.filter(folder => folder.parentId === folderId);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filteredDocuments = filteredDocuments.filter(doc =>
          doc.title.toLowerCase().includes(searchLower) ||
          doc.content.toLowerCase().includes(searchLower) ||
          doc.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
          doc.metadata?.keywords?.some(kw => kw.toLowerCase().includes(searchLower))
        );

        filteredFolders = filteredFolders.filter(folder =>
          folder.name.toLowerCase().includes(searchLower) ||
          folder.description?.toLowerCase().includes(searchLower)
        );
      }

      filters.forEach(filter => {
        filteredDocuments = filteredDocuments.filter(doc => {
          const value = doc[filter.field as keyof OGKnowledgeDocument];
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

      filteredDocuments.sort((a, b) => {
        const aValue = a[sort.field as keyof OGKnowledgeDocument] as any;
        const bValue = b[sort.field as keyof OGKnowledgeDocument] as any;

        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });

      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

      setDocuments(paginatedDocuments);
      setFolders(filteredFolders);
      setTotal(filteredDocuments.length);

      if (pollingInterval > 0) {
        pollingTimeoutRef.current = setTimeout(fetchData, pollingInterval);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError({
          code: 'FETCH_ERROR',
          message: err.message || 'Failed to fetch knowledge data',
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, filters, sort, search, pollingInterval, folderId]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const deleteDocument = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedDocs = mockDocuments.filter(d => d.id !== id);
      mockDocuments.length = 0;
      mockDocuments.push(...updatedDocs);

      await refetch();
    } catch (err: any) {
      throw {
        code: 'DELETE_ERROR',
        message: err.message || 'Failed to delete document',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const updateDocument = useCallback(async (id: string, updates: Partial<OGKnowledgeDocument>) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const docIndex = mockDocuments.findIndex(d => d.id === id);
      if (docIndex !== -1) {
        mockDocuments[docIndex] = {
          ...mockDocuments[docIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }

      await refetch();
    } catch (err: any) {
      throw {
        code: 'UPDATE_ERROR',
        message: err.message || 'Failed to update document',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const createDocument = useCallback(async (
    doc: Omit<OGKnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OGKnowledgeDocument> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newDoc: OGKnowledgeDocument = {
        ...doc,
        id: String(mockDocuments.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockDocuments.push(newDoc);
      await refetch();

      return newDoc;
    } catch (err: any) {
      throw {
        code: 'CREATE_ERROR',
        message: err.message || 'Failed to create document',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const createFolder = useCallback(async (
    folder: Omit<OGKnowledgeFolder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<OGKnowledgeFolder> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const newFolder: OGKnowledgeFolder = {
        ...folder,
        id: String(mockFolders.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockFolders.push(newFolder);
      await refetch();

      return newFolder;
    } catch (err: any) {
      throw {
        code: 'CREATE_ERROR',
        message: err.message || 'Failed to create folder',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  const deleteFolder = useCallback(async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedFolders = mockFolders.filter(f => f.id !== id);
      mockFolders.length = 0;
      mockFolders.push(...updatedFolders);

      await refetch();
    } catch (err: any) {
      throw {
        code: 'DELETE_ERROR',
        message: err.message || 'Failed to delete folder',
        timestamp: new Date().toISOString()
      };
    }
  }, [refetch]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (pollingTimeoutRef.current) {
        clearTimeout(pollingTimeoutRef.current);
      }
    };
  }, [fetchData, autoFetch]);

  return {
    documents,
    folders,
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
    deleteDocument,
    updateDocument,
    createDocument,
    createFolder,
    deleteFolder
  };
}