/**
 * useDataSeeding Hook
 *
 * Handles automatic seeding of procurement mock data on app initialization.
 * This ensures realistic data is available for development and testing.
 */

import { useState, useEffect, useCallback } from 'react';
import { dataSeedingService } from '../../services/procurement/DataSeedingService';

interface UseSeedingState {
  isSeeding: boolean;
  isSeeded: boolean;
  error: string | null;
  stats: {
    projectCount: number;
    documentCount: number;
  } | null;
}

interface UseDataSeedingReturn extends UseSeedingState {
  reseed: () => Promise<void>;
  clearAndReseed: () => Promise<void>;
}

/**
 * Hook that handles automatic seeding of procurement data
 *
 * @param autoSeed - Whether to automatically seed on mount (default: true)
 */
export function useDataSeeding(autoSeed: boolean = true): UseDataSeedingReturn {
  const [state, setState] = useState<UseSeedingState>({
    isSeeding: false,
    isSeeded: dataSeedingService.isSeeded(),
    error: null,
    stats: null,
  });

  /**
   * Seed data if needed
   */
  const seedIfNeeded = useCallback(async () => {
    setState(prev => ({ ...prev, isSeeding: true, error: null }));

    try {
      const result = await dataSeedingService.seedIfNeeded();

      if (result.seeded) {
        console.log(`[useDataSeeding] Seeded ${result.projectCount} projects with ${result.documentCount} documents`);
      }

      setState({
        isSeeding: false,
        isSeeded: true,
        error: null,
        stats: {
          projectCount: result.projectCount,
          documentCount: result.documentCount,
        },
      });
    } catch (err) {
      console.error('[useDataSeeding] Error seeding data:', err);
      setState(prev => ({
        ...prev,
        isSeeding: false,
        error: err instanceof Error ? err.message : 'Failed to seed data',
      }));
    }
  }, []);

  /**
   * Force reseed all data
   */
  const reseed = useCallback(async () => {
    setState(prev => ({ ...prev, isSeeding: true, error: null }));

    try {
      const result = await dataSeedingService.forceReseed();

      console.log(`[useDataSeeding] Reseeded ${result.projectCount} projects with ${result.documentCount} documents`);

      setState({
        isSeeding: false,
        isSeeded: true,
        error: null,
        stats: {
          projectCount: result.projectCount,
          documentCount: result.documentCount,
        },
      });
    } catch (err) {
      console.error('[useDataSeeding] Error reseeding data:', err);
      setState(prev => ({
        ...prev,
        isSeeding: false,
        error: err instanceof Error ? err.message : 'Failed to reseed data',
      }));
    }
  }, []);

  /**
   * Clear seeding flag and reseed (useful for development)
   */
  const clearAndReseed = useCallback(async () => {
    dataSeedingService.clearSeedingFlag();
    await reseed();
  }, [reseed]);

  // Auto-seed on mount if enabled
  useEffect(() => {
    if (autoSeed && !state.isSeeded) {
      seedIfNeeded();
    }
  }, [autoSeed, state.isSeeded, seedIfNeeded]);

  return {
    ...state,
    reseed,
    clearAndReseed,
  };
}

export default useDataSeeding;
