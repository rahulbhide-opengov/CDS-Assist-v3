import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAgentsData } from '../useAgentsData';
import type { OGAgent } from '../../types/opengov';

describe('useAgentsData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: false }));

    expect(result.current.agents).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0
    });
  });

  it('should fetch agents on mount when autoFetch is true', async () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: true }));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.agents.length).toBeGreaterThan(0);
    expect(result.current.error).toBe(null);
  });

  it('should handle pagination correctly', async () => {
    const { result } = renderHook(() =>
      useAgentsData({ autoFetch: true, pageSize: 2 })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.agents.length).toBeLessThanOrEqual(2);
    expect(result.current.pagination.pageSize).toBe(2);

    act(() => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.pagination.page).toBe(2);
    });
  });

  it('should filter agents by search query', async () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSearch('budget');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    result.current.agents.forEach(agent => {
      const matchesSearch =
        agent.name.toLowerCase().includes('budget') ||
        agent.summary.toLowerCase().includes('budget') ||
        agent.description?.toLowerCase().includes('budget');
      expect(matchesSearch).toBe(true);
    });
  });

  it('should handle sorting', async () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.setSort({ field: 'name', direction: 'asc' });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const names = result.current.agents.map(a => a.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  it('should delete an agent', async () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialCount = result.current.agents.length;
    const agentToDelete = result.current.agents[0];

    await act(async () => {
      await result.current.deleteAgent(agentToDelete.id);
    });

    await waitFor(() => {
      expect(result.current.agents.length).toBe(initialCount - 1);
    });

    const deletedAgent = result.current.agents.find(a => a.id === agentToDelete.id);
    expect(deletedAgent).toBeUndefined();
  });

  it('should update an agent', async () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const agentToUpdate = result.current.agents[0];
    const updates = { name: 'Updated Agent Name' };

    await act(async () => {
      await result.current.updateAgent(agentToUpdate.id, updates);
    });

    await waitFor(() => {
      const updatedAgent = result.current.agents.find(a => a.id === agentToUpdate.id);
      expect(updatedAgent?.name).toBe('Updated Agent Name');
    });
  });

  it('should create a new agent', async () => {
    const { result } = renderHook(() => useAgentsData({ autoFetch: true }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newAgent = {
      name: 'Test Agent',
      summary: 'Test summary',
      status: 'draft' as const,
      createdBy: 'test-user',
      activity: { actions: 0 }
    };

    let createdAgent: OGAgent | undefined;

    await act(async () => {
      createdAgent = await result.current.createAgent(newAgent);
    });

    expect(createdAgent).toBeDefined();
    expect(createdAgent?.name).toBe('Test Agent');
    expect(createdAgent?.id).toBeDefined();
  });
});