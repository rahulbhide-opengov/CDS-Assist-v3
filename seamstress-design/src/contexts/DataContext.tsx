/**
 * DataContext
 *
 * Unified data management context that can switch between mock and API data.
 * Provides consistent data access patterns across the application.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  OGAgent,
  OGSkill,
  OGTool,
  OGKnowledgeDocument,
  OGListRequest,
  OGListResponse
} from '../types/opengov';

// Import mock data
import { mockAgentsOG, mockSkills, mockTools } from '../data';
import { generateAgent, generateSkill, generateTool, generateKnowledgeDocument } from '../utils/mockDataGenerators';

// Data source types
export type DataSourceType = 'mock' | 'api';

// Generic CRUD operations
export interface CrudOperations<T> {
  list: (request?: OGListRequest) => Promise<OGListResponse<T>>;
  get: (id: string) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
  search: (query: string) => Promise<T[]>;
}

// Complete data service interface
export interface DataService {
  agents: CrudOperations<OGAgent>;
  skills: CrudOperations<OGSkill>;
  tools: CrudOperations<OGTool>;
  documents: CrudOperations<OGKnowledgeDocument>;

  // Utility methods
  setDataSource: (source: DataSourceType) => void;
  getDataSource: () => DataSourceType;
  clearCache: () => void;
  refreshAll: () => Promise<void>;
}

// Context type
interface DataContextType extends DataService {
  loading: boolean;
  error: string | null;
}

// Create context
const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data service implementation
class MockDataService implements DataService {
  private agentsData: OGAgent[] = [...mockAgentsOG];
  private skillsData: OGSkill[] = [...mockSkills];
  private toolsData: OGTool[] = [...mockTools];
  private documentsData: OGKnowledgeDocument[];

  constructor() {
    // Initialize documents array and generate some mock documents
    this.documentsData = [];
    for (let i = 0; i < 20; i++) {
      const doc = generateKnowledgeDocument();
      this.documentsData.push(doc);
    }
  }

  // Agent operations
  agents: CrudOperations<OGAgent> = {
    list: async (request) => {
      await this.simulateDelay();
      let data = [...this.agentsData];

      // Apply search
      if (request?.search) {
        const search = request.search.toLowerCase();
        data = data.filter(agent =>
          agent.name.toLowerCase().includes(search) ||
          agent.summary?.toLowerCase().includes(search)
        );
      }

      // Apply pagination
      const page = request?.pagination?.page || 0;
      const pageSize = request?.pagination?.pageSize || 25;
      const start = page * pageSize;
      const end = start + pageSize;

      return {
        data: data.slice(start, end),
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: Math.ceil(data.length / pageSize)
        }
      };
    },
    get: async (id) => {
      await this.simulateDelay();
      const agent = this.agentsData.find(a => a.id === id);
      if (!agent) throw new Error('Agent not found');
      return agent;
    },
    create: async (data) => {
      await this.simulateDelay();
      const newAgent = generateAgent(data);
      this.agentsData.push(newAgent);
      return newAgent;
    },
    update: async (id, data) => {
      await this.simulateDelay();
      const index = this.agentsData.findIndex(a => a.id === id);
      if (index === -1) throw new Error('Agent not found');
      this.agentsData[index] = { ...this.agentsData[index], ...data };
      return this.agentsData[index];
    },
    delete: async (id) => {
      await this.simulateDelay();
      this.agentsData = this.agentsData.filter(a => a.id !== id);
    },
    search: async (query) => {
      await this.simulateDelay();
      const search = query.toLowerCase();
      return this.agentsData.filter(agent =>
        agent.name.toLowerCase().includes(search) ||
        agent.summary?.toLowerCase().includes(search)
      );
    }
  };

  // Skill operations
  skills: CrudOperations<OGSkill> = {
    list: async (request) => {
      await this.simulateDelay();
      let data = [...this.skillsData];

      if (request?.search) {
        const search = request.search.toLowerCase();
        data = data.filter(skill =>
          skill.name.toLowerCase().includes(search) ||
          skill.description.toLowerCase().includes(search)
        );
      }

      const page = request?.pagination?.page || 0;
      const pageSize = request?.pagination?.pageSize || 25;
      const start = page * pageSize;
      const end = start + pageSize;

      return {
        data: data.slice(start, end),
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: Math.ceil(data.length / pageSize)
        }
      };
    },
    get: async (id) => {
      await this.simulateDelay();
      const skill = this.skillsData.find(s => s.id === id);
      if (!skill) throw new Error('Skill not found');
      return skill;
    },
    create: async (data) => {
      await this.simulateDelay();
      const newSkill = generateSkill(data);
      this.skillsData.push(newSkill);
      return newSkill;
    },
    update: async (id, data) => {
      await this.simulateDelay();
      const index = this.skillsData.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Skill not found');
      this.skillsData[index] = { ...this.skillsData[index], ...data };
      return this.skillsData[index];
    },
    delete: async (id) => {
      await this.simulateDelay();
      this.skillsData = this.skillsData.filter(s => s.id !== id);
    },
    search: async (query) => {
      await this.simulateDelay();
      const search = query.toLowerCase();
      return this.skillsData.filter(skill =>
        skill.name.toLowerCase().includes(search) ||
        skill.description.toLowerCase().includes(search)
      );
    }
  };

  // Tool operations
  tools: CrudOperations<OGTool> = {
    list: async (request) => {
      await this.simulateDelay();
      let data = [...this.toolsData];

      if (request?.search) {
        const search = request.search.toLowerCase();
        data = data.filter(tool =>
          tool.name.toLowerCase().includes(search) ||
          tool.description.toLowerCase().includes(search)
        );
      }

      const page = request?.pagination?.page || 0;
      const pageSize = request?.pagination?.pageSize || 25;
      const start = page * pageSize;
      const end = start + pageSize;

      return {
        data: data.slice(start, end),
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: Math.ceil(data.length / pageSize)
        }
      };
    },
    get: async (id) => {
      await this.simulateDelay();
      const tool = this.toolsData.find(t => t.id === id);
      if (!tool) throw new Error('Tool not found');
      return tool;
    },
    create: async (data) => {
      await this.simulateDelay();
      const newTool = generateTool(data);
      this.toolsData.push(newTool);
      return newTool;
    },
    update: async (id, data) => {
      await this.simulateDelay();
      const index = this.toolsData.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Tool not found');
      this.toolsData[index] = { ...this.toolsData[index], ...data };
      return this.toolsData[index];
    },
    delete: async (id) => {
      await this.simulateDelay();
      this.toolsData = this.toolsData.filter(t => t.id !== id);
    },
    search: async (query) => {
      await this.simulateDelay();
      const search = query.toLowerCase();
      return this.toolsData.filter(tool =>
        tool.name.toLowerCase().includes(search) ||
        tool.description.toLowerCase().includes(search)
      );
    }
  };

  // Document operations
  documents: CrudOperations<OGKnowledgeDocument> = {
    list: async (request) => {
      await this.simulateDelay();
      let data = [...this.documentsData];

      if (request?.search) {
        const search = request.search.toLowerCase();
        data = data.filter(doc =>
          doc.title.toLowerCase().includes(search) ||
          doc.content.toLowerCase().includes(search)
        );
      }

      const page = request?.pagination?.page || 0;
      const pageSize = request?.pagination?.pageSize || 25;
      const start = page * pageSize;
      const end = start + pageSize;

      return {
        data: data.slice(start, end),
        pagination: {
          page,
          pageSize,
          total: data.length,
          totalPages: Math.ceil(data.length / pageSize)
        }
      };
    },
    get: async (id) => {
      await this.simulateDelay();
      const doc = this.documentsData.find(d => d.id === id);
      if (!doc) throw new Error('Document not found');
      return doc;
    },
    create: async (data) => {
      await this.simulateDelay();
      const newDoc = generateKnowledgeDocument(data);
      this.documentsData.push(newDoc);
      return newDoc;
    },
    update: async (id, data) => {
      await this.simulateDelay();
      const index = this.documentsData.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Document not found');
      this.documentsData[index] = { ...this.documentsData[index], ...data };
      return this.documentsData[index];
    },
    delete: async (id) => {
      await this.simulateDelay();
      this.documentsData = this.documentsData.filter(d => d.id !== id);
    },
    search: async (query) => {
      await this.simulateDelay();
      const search = query.toLowerCase();
      return this.documentsData.filter(doc =>
        doc.title.toLowerCase().includes(search) ||
        doc.content.toLowerCase().includes(search)
      );
    }
  };

  // Utility methods
  setDataSource = (source: DataSourceType) => {
    // Data source updated
  };

  getDataSource = () => 'mock' as DataSourceType;

  clearCache = () => {
    // Cache cleared
  };

  refreshAll = async () => {
    await this.simulateDelay();
    // All data refreshed
  };

  // Helper to simulate API delay
  private simulateDelay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// API data service implementation (placeholder)
class ApiDataService implements DataService {
  private apiBaseUrl = process.env.REACT_APP_API_URL || '/api/v1';

  agents: CrudOperations<OGAgent> = {
    list: async (request) => {
      const response = await fetch(`${this.apiBaseUrl}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      return response.json();
    },
    get: async (id) => {
      const response = await fetch(`${this.apiBaseUrl}/agents/${id}`);
      return response.json();
    },
    create: async (data) => {
      const response = await fetch(`${this.apiBaseUrl}/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    update: async (id, data) => {
      const response = await fetch(`${this.apiBaseUrl}/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    delete: async (id) => {
      await fetch(`${this.apiBaseUrl}/agents/${id}`, { method: 'DELETE' });
    },
    search: async (query) => {
      const response = await fetch(`${this.apiBaseUrl}/agents/search?q=${query}`);
      return response.json();
    }
  };

  // Similar implementations for skills, tools, documents...
  skills: CrudOperations<OGSkill> = {} as CrudOperations<OGSkill>;
  tools: CrudOperations<OGTool> = {} as CrudOperations<OGTool>;
  documents: CrudOperations<OGKnowledgeDocument> = {} as CrudOperations<OGKnowledgeDocument>;

  setDataSource = (source: DataSourceType) => {};
  getDataSource = () => 'api' as DataSourceType;
  clearCache = () => {};
  refreshAll = async () => {};
}

// Provider component
export function DataProvider({
  children,
  defaultSource = 'mock'
}: {
  children: React.ReactNode;
  defaultSource?: DataSourceType;
}) {
  const [dataSource, setDataSource] = useState<DataSourceType>(defaultSource);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create service instance based on data source
  const service = React.useMemo(() => {
    return dataSource === 'mock' ? new MockDataService() : new ApiDataService();
  }, [dataSource]);

  // Wrap service methods with loading/error handling
  const wrappedService: DataContextType = {
    ...service,
    loading,
    error,
    setDataSource: (source: DataSourceType) => {
      setDataSource(source);
      service.setDataSource(source);
    }
  };

  return (
    <DataContext.Provider value={wrappedService}>
      {children}
    </DataContext.Provider>
  );
}

// Hook to use data context
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

// Convenience hooks for specific entities
export function useAgents() {
  const { agents, loading, error } = useData();
  return { ...agents, loading, error };
}

export function useSkills() {
  const { skills, loading, error } = useData();
  return { ...skills, loading, error };
}

export function useTools() {
  const { tools, loading, error } = useData();
  return { ...tools, loading, error };
}

export function useDocuments() {
  const { documents, loading, error } = useData();
  return { ...documents, loading, error };
}