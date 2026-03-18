/**
 * Section Library Service
 * Manages shared/reusable document sections for templates
 *
 * Features:
 * - CRUD operations for shared sections
 * - Search and filtering by category/tags
 * - Usage tracking
 * - Section categorization
 */

import { DocumentStorage } from './DocumentStorage';
import type { SharedSection } from '../../types/procurement';

export class SectionLibraryService {
  private storage: DocumentStorage;
  private cache = new Map<string, SharedSection>();

  constructor() {
    this.storage = new DocumentStorage();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  // ============================================================================
  // Section CRUD Operations
  // ============================================================================

  /**
   * Get all shared sections
   */
  async getAllSections(): Promise<SharedSection[]> {
    try {
      return await this.storage.getSharedSections();
    } catch (error) {
      console.error('Error fetching sections:', error);
      return [];
    }
  }

  /**
   * Get section by ID
   */
  async getSection(sectionId: string): Promise<SharedSection | null> {
    try {
      // Check cache first
      if (this.cache.has(sectionId)) {
        return this.cache.get(sectionId)!;
      }

      const section = await this.storage.getSharedSection(sectionId);
      if (section) {
        this.cache.set(sectionId, section);
      }
      return section;
    } catch (error) {
      console.error('Error fetching section:', error);
      return null;
    }
  }

  /**
   * Get sections by category
   */
  async getSectionsByCategory(category: string): Promise<SharedSection[]> {
    try {
      return await this.storage.getSharedSectionsByCategory(category);
    } catch (error) {
      console.error('Error fetching sections by category:', error);
      return [];
    }
  }

  /**
   * Create a new shared section
   */
  async createSection(data: {
    title: string;
    content: string;
    category: string;
    tags?: string[];
    variables?: string[];
  }): Promise<SharedSection> {
    const sectionId = this.generateId();

    const section: SharedSection = {
      sectionId,
      title: data.title,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      variables: data.variables || [],
      usageCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.storage.saveSharedSection(section);
    this.cache.set(sectionId, section);

    return section;
  }

  /**
   * Update an existing shared section
   */
  async updateSection(
    sectionId: string,
    updates: Partial<Omit<SharedSection, 'sectionId' | 'createdAt' | 'usageCount'>>
  ): Promise<SharedSection | null> {
    try {
      const existing = await this.getSection(sectionId);
      if (!existing) {
        throw new Error('Section not found');
      }

      const updated: SharedSection = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.saveSharedSection(updated);
      this.cache.set(sectionId, updated);

      return updated;
    } catch (error) {
      console.error('Error updating section:', error);
      return null;
    }
  }

  /**
   * Delete a shared section
   */
  async deleteSection(sectionId: string): Promise<boolean> {
    try {
      await this.storage.deleteSharedSection(sectionId);
      this.cache.delete(sectionId);
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      return false;
    }
  }

  /**
   * Increment section usage count
   */
  async incrementUsageCount(sectionId: string): Promise<void> {
    try {
      const section = await this.getSection(sectionId);
      if (section) {
        await this.updateSection(sectionId, {
          usageCount: section.usageCount + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing usage count:', error);
    }
  }

  // ============================================================================
  // Search and Filtering
  // ============================================================================

  /**
   * Search sections by title, content, or tags
   */
  async searchSections(query: string): Promise<SharedSection[]> {
    try {
      const allSections = await this.getAllSections();
      const lowerQuery = query.toLowerCase();

      return allSections.filter(
        (section) =>
          section.title.toLowerCase().includes(lowerQuery) ||
          section.content.toLowerCase().includes(lowerQuery) ||
          section.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          section.category.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching sections:', error);
      return [];
    }
  }

  /**
   * Get sections by tags
   */
  async getSectionsByTags(tags: string[]): Promise<SharedSection[]> {
    try {
      const allSections = await this.getAllSections();
      const lowerTags = tags.map((t) => t.toLowerCase());

      return allSections.filter((section) =>
        section.tags.some((tag) => lowerTags.includes(tag.toLowerCase()))
      );
    } catch (error) {
      console.error('Error fetching sections by tags:', error);
      return [];
    }
  }

  /**
   * Get most used sections
   */
  async getMostUsedSections(limit: number = 10): Promise<SharedSection[]> {
    try {
      const sections = await this.getAllSections();
      return sections.sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
    } catch (error) {
      console.error('Error fetching most used sections:', error);
      return [];
    }
  }

  /**
   * Get recently added sections
   */
  async getRecentSections(limit: number = 10): Promise<SharedSection[]> {
    try {
      const sections = await this.getAllSections();
      return sections
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent sections:', error);
      return [];
    }
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const sections = await this.getAllSections();
      const categories = new Set(sections.map((s) => s.category));
      return Array.from(categories).sort();
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get all unique tags
   */
  async getTags(): Promise<string[]> {
    try {
      const sections = await this.getAllSections();
      const tags = new Set<string>();
      sections.forEach((s) => s.tags.forEach((tag) => tags.add(tag)));
      return Array.from(tags).sort();
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  // ============================================================================
  // Bulk Operations
  // ============================================================================

  /**
   * Import multiple sections
   */
  async importSections(sections: Omit<SharedSection, 'sectionId' | 'usageCount' | 'createdAt' | 'updatedAt'>[]): Promise<SharedSection[]> {
    const imported: SharedSection[] = [];

    for (const sectionData of sections) {
      try {
        const section = await this.createSection(sectionData);
        imported.push(section);
      } catch (error) {
        console.error('Error importing section:', error);
      }
    }

    return imported;
  }

  /**
   * Export sections by category
   */
  async exportSectionsByCategory(category: string): Promise<SharedSection[]> {
    return this.getSectionsByCategory(category);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let sectionLibraryServiceInstance: SectionLibraryService | null = null;

export function getSectionLibraryService(): SectionLibraryService {
  if (!sectionLibraryServiceInstance) {
    sectionLibraryServiceInstance = new SectionLibraryService();
  }
  return sectionLibraryServiceInstance;
}
