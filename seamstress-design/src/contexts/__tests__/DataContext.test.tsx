/**
 * Tests for DataContext
 */

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DataProvider, useData, useAgents, useSkills, useTools } from '../DataContext';
import { generateAgent, generateSkill, generateTool } from '../../utils/mockDataGenerators';

// Mock jest for the console.error spy
const originalConsoleError = console.error;

// Test component that uses the data context
const TestComponent = () => {
  const data = useData();
  return (
    <div>
      <div>Data Source: {data.getDataSource()}</div>
      <div>Loading: {data.loading.toString()}</div>
      <div>Error: {data.error || 'none'}</div>
    </div>
  );
};

// Test component for agents
const AgentTestComponent = () => {
  const agents = useAgents();
  const [agentList, setAgentList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const response = await agents.list();
      setAgentList(response.data);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div>
      <div>Loading: {loading.toString()}</div>
      <div>Agent Count: {agentList.length}</div>
      <button onClick={loadAgents}>Reload</button>
    </div>
  );
};

describe('DataContext', () => {
  it('provides data context to children', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByText('Data Source: mock')).toBeInTheDocument();
    expect(screen.getByText('Loading: false')).toBeInTheDocument();
    expect(screen.getByText('Error: none')).toBeInTheDocument();
  });

  it('throws error when useData is used outside provider', () => {
    // Suppress console.error for this test
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useData must be used within a DataProvider');

    console.error = originalConsoleError;
  });

  it('uses mock data source by default', () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByText('Data Source: mock')).toBeInTheDocument();
  });

  it('allows setting data source', () => {
    render(
      <DataProvider defaultSource="api">
        <TestComponent />
      </DataProvider>
    );

    expect(screen.getByText('Data Source: api')).toBeInTheDocument();
  });
});

describe('useAgents hook', () => {
  it('provides agent CRUD operations', async () => {
    render(
      <DataProvider>
        <AgentTestComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Agent Count: \d+/)).toBeInTheDocument();
    });
  });

  it('can list agents', async () => {
    const TestListComponent = () => {
      const agents = useAgents();
      const [data, setData] = React.useState<any>(null);

      React.useEffect(() => {
        agents.list().then(setData);
      }, []);

      return <div>{data ? `Total: ${data.pagination.total}` : 'Loading...'}</div>;
    };

    render(
      <DataProvider>
        <TestListComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Total: \d+/)).toBeInTheDocument();
    });
  });

  it('can create an agent', async () => {
    const TestCreateComponent = () => {
      const agents = useAgents();
      const [created, setCreated] = React.useState<any>(null);

      const handleCreate = async () => {
        const newAgent = await agents.create({
          name: 'Test Agent',
          summary: 'Test Summary'
        });
        setCreated(newAgent);
      };

      return (
        <div>
          <button onClick={handleCreate}>Create Agent</button>
          {created && <div>Created: {created.name}</div>}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestCreateComponent />
      </DataProvider>
    );

    const createButton = screen.getByRole('button', { name: /create agent/i });
    act(() => {
      createButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Created: Test Agent')).toBeInTheDocument();
    });
  });

  it('can search agents', async () => {
    const TestSearchComponent = () => {
      const agents = useAgents();
      const [results, setResults] = React.useState<any[]>([]);

      React.useEffect(() => {
        agents.search('test').then(setResults);
      }, []);

      return <div>Results: {results.length}</div>;
    };

    render(
      <DataProvider>
        <TestSearchComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Results: \d+/)).toBeInTheDocument();
    });
  });
});

describe('useSkills hook', () => {
  it('provides skill operations', async () => {
    const TestSkillComponent = () => {
      const skills = useSkills();
      const [data, setData] = React.useState<any>(null);

      React.useEffect(() => {
        skills.list().then(setData);
      }, []);

      return <div>{data ? `Skills: ${data.data.length}` : 'Loading...'}</div>;
    };

    render(
      <DataProvider>
        <TestSkillComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Skills: \d+/)).toBeInTheDocument();
    });
  });
});

describe('useTools hook', () => {
  it('provides tool operations', async () => {
    const TestToolComponent = () => {
      const tools = useTools();
      const [data, setData] = React.useState<any>(null);

      React.useEffect(() => {
        tools.list().then(setData);
      }, []);

      return <div>{data ? `Tools: ${data.data.length}` : 'Loading...'}</div>;
    };

    render(
      <DataProvider>
        <TestToolComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Tools: \d+/)).toBeInTheDocument();
    });
  });

  it('can update a tool', async () => {
    const TestUpdateComponent = () => {
      const tools = useTools();
      const [updated, setUpdated] = React.useState(false);

      const handleUpdate = async () => {
        try {
          // First get a tool
          const list = await tools.list();
          if (list.data.length > 0) {
            const tool = list.data[0];
            await tools.update(tool.id, { name: 'Updated Tool' });
            setUpdated(true);
          }
        } catch (error) {
          console.error('Update failed:', error);
        }
      };

      return (
        <div>
          <button onClick={handleUpdate}>Update Tool</button>
          {updated && <div>Tool Updated</div>}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestUpdateComponent />
      </DataProvider>
    );

    const updateButton = screen.getByRole('button', { name: /update tool/i });
    await act(async () => {
      updateButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Tool Updated')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('can delete a tool', async () => {
    const TestDeleteComponent = () => {
      const tools = useTools();
      const [deleted, setDeleted] = React.useState(false);

      const handleDelete = async () => {
        try {
          // First create a tool to delete
          const newTool = await tools.create({ name: 'Tool to Delete' });
          await tools.delete(newTool.id);
          setDeleted(true);
        } catch (error) {
          console.error('Delete failed:', error);
        }
      };

      return (
        <div>
          <button onClick={handleDelete}>Delete Tool</button>
          {deleted && <div>Tool Deleted</div>}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestDeleteComponent />
      </DataProvider>
    );

    const deleteButton = screen.getByRole('button', { name: /delete tool/i });
    await act(async () => {
      deleteButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Tool Deleted')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('Data pagination', () => {
  it('supports pagination in list operations', async () => {
    const TestPaginationComponent = () => {
      const agents = useAgents();
      const [pageData, setPageData] = React.useState<any>(null);

      React.useEffect(() => {
        agents.list({
          pagination: { page: 0, pageSize: 5 }
        }).then(setPageData);
      }, []);

      return (
        <div>
          {pageData && (
            <>
              <div>Page Size: {pageData.pagination.pageSize}</div>
              <div>Current Page: {pageData.pagination.page}</div>
              <div>Total Pages: {pageData.pagination.totalPages}</div>
            </>
          )}
        </div>
      );
    };

    render(
      <DataProvider>
        <TestPaginationComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Page Size: 5')).toBeInTheDocument();
      expect(screen.getByText('Current Page: 0')).toBeInTheDocument();
      expect(screen.getByText(/Total Pages: \d+/)).toBeInTheDocument();
    });
  });
});

describe('Error handling', () => {
  it('handles get errors gracefully', async () => {
    const TestErrorComponent = () => {
      const agents = useAgents();
      const [error, setError] = React.useState<string | null>(null);

      React.useEffect(() => {
        agents.get('non-existent-id').catch(err => {
          setError(err.message);
        });
      }, []);

      return <div>{error && `Error: ${error}`}</div>;
    };

    render(
      <DataProvider>
        <TestErrorComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Agent not found')).toBeInTheDocument();
    });
  });
});