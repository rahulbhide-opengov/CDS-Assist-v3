/**
 * useSectionLibrary Hook
 * React hook for section library operations
 *
 * Features:
 * - Section CRUD
 * - Search and filtering
 * - Category and tag management
 * - Loading states
 * - Error handling
 * - Auto-seeding
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getSectionLibraryService } from '../../services/procurement/SectionLibraryService';
import type { SharedSection } from '../../types/procurement';

interface UseSectionLibraryReturn {
  // State
  sections: SharedSection[];
  isLoading: boolean;
  error: string | null;

  // Operations
  loadSections: () => Promise<void>;
  getSection: (sectionId: string) => Promise<SharedSection | null>;
  getSectionsByCategory: (category: string) => Promise<SharedSection[]>;
  createSection: (data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    variables?: string[];
  }) => Promise<SharedSection | null>;
  updateSection: (
    sectionId: string,
    updates: Partial<Omit<SharedSection, 'sectionId' | 'createdAt' | 'usageCount'>>
  ) => Promise<SharedSection | null>;
  deleteSection: (sectionId: string) => Promise<boolean>;
  searchSections: (query: string) => Promise<SharedSection[]>;
  getSectionsByTags: (tags: string[]) => Promise<SharedSection[]>;
  getMostUsedSections: (limit?: number) => Promise<SharedSection[]>;
  getRecentSections: (limit?: number) => Promise<SharedSection[]>;
  getCategories: () => Promise<string[]>;
  getTags: () => Promise<string[]>;
  incrementUsageCount: (sectionId: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

export function useSectionLibrary(): UseSectionLibraryReturn {
  const [sections, setSections] = useState<SharedSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useMemo to get a stable service reference
  const service = useMemo(() => getSectionLibraryService(), []);

  // ============================================================================
  // Section Operations
  // ============================================================================

  const loadSections = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allSections = await service.getAllSections();
      setSections(allSections);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load sections';
      setError(message);
      console.error('Error loading sections:', err);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const getSection = useCallback(
    async (sectionId: string): Promise<SharedSection | null> => {
      setIsLoading(true);
      setError(null);
      try {
        return await service.getSection(sectionId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load section';
        setError(message);
        console.error('Error loading section:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const getSectionsByCategory = useCallback(
    async (category: string): Promise<SharedSection[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await service.getSectionsByCategory(category);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load sections by category';
        setError(message);
        console.error('Error loading sections by category:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const createSection = useCallback(
    async (data: {
      title: string;
      content: string;
      category: string;
      tags?: string[];
      variables?: string[];
    }): Promise<SharedSection | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newSection = await service.createSection(data);
        // Refresh sections list
        await loadSections();
        return newSection;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create section';
        setError(message);
        console.error('Error creating section:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [service, loadSections]
  );

  const updateSection = useCallback(
    async (
      sectionId: string,
      updates: Partial<Omit<SharedSection, 'sectionId' | 'createdAt' | 'usageCount'>>
    ): Promise<SharedSection | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await service.updateSection(sectionId, updates);
        if (updated) {
          // Refresh sections list
          await loadSections();
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update section';
        setError(message);
        console.error('Error updating section:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [service, loadSections]
  );

  const deleteSection = useCallback(
    async (sectionId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const success = await service.deleteSection(sectionId);
        if (success) {
          // Refresh sections list
          await loadSections();
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete section';
        setError(message);
        console.error('Error deleting section:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [service, loadSections]
  );

  // ============================================================================
  // Search and Filtering
  // ============================================================================

  const searchSections = useCallback(
    async (query: string): Promise<SharedSection[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await service.searchSections(query);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed';
        setError(message);
        console.error('Error searching sections:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const getSectionsByTags = useCallback(
    async (tags: string[]): Promise<SharedSection[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await service.getSectionsByTags(tags);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load sections by tags';
        setError(message);
        console.error('Error loading sections by tags:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const getMostUsedSections = useCallback(
    async (limit: number = 10): Promise<SharedSection[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await service.getMostUsedSections(limit);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load most used sections';
        setError(message);
        console.error('Error loading most used sections:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const getRecentSections = useCallback(
    async (limit: number = 10): Promise<SharedSection[]> => {
      setIsLoading(true);
      setError(null);
      try {
        return await service.getRecentSections(limit);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load recent sections';
        setError(message);
        console.error('Error loading recent sections:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [service]
  );

  const getCategories = useCallback(async (): Promise<string[]> => {
    setError(null);
    try {
      return await service.getCategories();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load categories';
      setError(message);
      console.error('Error loading categories:', err);
      return [];
    }
  }, [service]);

  const getTags = useCallback(async (): Promise<string[]> => {
    setError(null);
    try {
      return await service.getTags();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tags';
      setError(message);
      console.error('Error loading tags:', err);
      return [];
    }
  }, [service]);

  const incrementUsageCount = useCallback(
    async (sectionId: string): Promise<void> => {
      try {
        await service.incrementUsageCount(sectionId);
        // Refresh sections to show updated count
        await loadSections();
      } catch (err) {
        console.error('Error incrementing usage count:', err);
      }
    },
    [service, loadSections]
  );

  // ============================================================================
  // Utility
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load sections on mount and seed data if needed
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Dynamically import the seed function
        const { seedSectionLibraryData } = await import('../../data/procurement/seedSectionLibraryData');
        await seedSectionLibraryData();

        // Load sections after seeding
        setIsLoading(true);
        const allSections = await service.getAllSections();
        setSections(allSections);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing sections:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize sections');
        setIsLoading(false);
      }
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return {
    // State
    sections,
    isLoading,
    error,

    // Operations
    loadSections,
    getSection,
    getSectionsByCategory,
    createSection,
    updateSection,
    deleteSection,
    searchSections,
    getSectionsByTags,
    getMostUsedSections,
    getRecentSections,
    getCategories,
    getTags,
    incrementUsageCount,

    // Utility
    clearError,
  };
}
