import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SectionLibraryService } from './SectionLibraryService';
import { DocumentStorage } from './DocumentStorage';
import type { SharedSection } from '../../types/procurement';

// Mock the DocumentStorage
vi.mock('./DocumentStorage');

describe('SectionLibraryService', () => {
  let service: SectionLibraryService;
  let mockStorage: jest.Mocked<DocumentStorage>;

  // Helper to create mock shared section
  const createMockSection = (overrides: Partial<SharedSection> = {}): SharedSection => ({
    sectionId: 'sec-123',
    title: 'Terms and Conditions',
    content: '<p>Standard terms and conditions content...</p>',
    category: 'legal',
    tags: ['terms', 'conditions', 'legal'],
    description: 'Standard T&C section',
    usageCount: 5,
    variables: ['{{contract.startDate}}', '{{contract.endDate}}'],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    createdBy: 'user-1',
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock storage instance
    mockStorage = {
      getSharedSections: vi.fn().mockResolvedValue([]),
      getSharedSection: vi.fn().mockResolvedValue(null),
      getSharedSectionsByCategory: vi.fn().mockResolvedValue([]),
      saveSharedSection: vi.fn().mockResolvedValue(undefined),
      deleteSharedSection: vi.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<DocumentStorage>;

    // Mock the DocumentStorage constructor
    vi.mocked(DocumentStorage).mockImplementation(() => mockStorage);

    service = new SectionLibraryService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllSections', () => {
    it('should return all sections', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1' }),
        createMockSection({ sectionId: 'sec-2' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getAllSections();

      expect(result).toHaveLength(2);
      expect(mockStorage.getSharedSections).toHaveBeenCalled();
    });

    it('should return empty array on error', async () => {
      mockStorage.getSharedSections.mockRejectedValue(new Error('DB error'));

      const result = await service.getAllSections();

      expect(result).toEqual([]);
    });
  });

  describe('getSection', () => {
    it('should retrieve a section by ID', async () => {
      const section = createMockSection();
      mockStorage.getSharedSection.mockResolvedValue(section);

      const result = await service.getSection('sec-123');

      expect(result).toEqual(section);
      expect(mockStorage.getSharedSection).toHaveBeenCalledWith('sec-123');
    });

    it('should cache retrieved sections', async () => {
      const section = createMockSection();
      mockStorage.getSharedSection.mockResolvedValue(section);

      // First call
      await service.getSection('sec-123');
      // Second call should use cache
      await service.getSection('sec-123');

      expect(mockStorage.getSharedSection).toHaveBeenCalledTimes(1);
    });

    it('should return null for non-existent section', async () => {
      mockStorage.getSharedSection.mockResolvedValue(null);

      const result = await service.getSection('nonexistent');

      expect(result).toBeNull();
    });

    it('should return null on error', async () => {
      mockStorage.getSharedSection.mockRejectedValue(new Error('DB error'));

      const result = await service.getSection('sec-123');

      expect(result).toBeNull();
    });
  });

  describe('getSectionsByCategory', () => {
    it('should return sections by category', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', category: 'legal' }),
        createMockSection({ sectionId: 'sec-2', category: 'legal' }),
      ];
      mockStorage.getSharedSectionsByCategory.mockResolvedValue(sections);

      const result = await service.getSectionsByCategory('legal');

      expect(result).toHaveLength(2);
      expect(mockStorage.getSharedSectionsByCategory).toHaveBeenCalledWith('legal');
    });

    it('should return empty array on error', async () => {
      mockStorage.getSharedSectionsByCategory.mockRejectedValue(new Error('DB error'));

      const result = await service.getSectionsByCategory('legal');

      expect(result).toEqual([]);
    });
  });

  describe('createSection', () => {
    it('should create a new section', async () => {
      const section = await service.createSection({
        title: 'New Section',
        content: '<p>Content</p>',
        category: 'compliance',
        tags: ['compliance', 'new'],
        variables: ['{{project.title}}'],
      });

      expect(section).toMatchObject({
        title: 'New Section',
        content: '<p>Content</p>',
        category: 'compliance',
        tags: ['compliance', 'new'],
        variables: ['{{project.title}}'],
        usageCount: 0,
      });
      expect(section.sectionId).toBeDefined();
      expect(section.createdAt).toBeDefined();
      expect(mockStorage.saveSharedSection).toHaveBeenCalled();
    });

    it('should default tags and variables to empty arrays', async () => {
      const section = await service.createSection({
        title: 'Minimal Section',
        content: '<p>Content</p>',
        category: 'other',
      });

      expect(section.tags).toEqual([]);
      expect(section.variables).toEqual([]);
    });
  });

  describe('updateSection', () => {
    it('should update an existing section', async () => {
      const existingSection = createMockSection();
      mockStorage.getSharedSection.mockResolvedValue(existingSection);

      const updated = await service.updateSection('sec-123', {
        title: 'Updated Title',
        content: '<p>Updated content</p>',
      });

      expect(updated).toMatchObject({
        title: 'Updated Title',
        content: '<p>Updated content</p>',
      });
      expect(mockStorage.saveSharedSection).toHaveBeenCalled();
    });

    it('should return null if section not found', async () => {
      mockStorage.getSharedSection.mockResolvedValue(null);

      const result = await service.updateSection('nonexistent', { title: 'Test' });

      expect(result).toBeNull();
    });

    it('should update timestamp on update', async () => {
      const existingSection = createMockSection({
        updatedAt: '2024-01-01T00:00:00.000Z',
      });
      mockStorage.getSharedSection.mockResolvedValue(existingSection);

      const updated = await service.updateSection('sec-123', { title: 'New Title' });

      expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThan(
        new Date('2024-01-01T00:00:00.000Z').getTime()
      );
    });

    it('should update cache after update', async () => {
      const existingSection = createMockSection();
      mockStorage.getSharedSection.mockResolvedValue(existingSection);

      await service.updateSection('sec-123', { title: 'Updated' });

      // Subsequent get should not call storage again due to cache
      await service.getSection('sec-123');
      expect(mockStorage.getSharedSection).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteSection', () => {
    it('should delete a section', async () => {
      const result = await service.deleteSection('sec-123');

      expect(result).toBe(true);
      expect(mockStorage.deleteSharedSection).toHaveBeenCalledWith('sec-123');
    });

    it('should remove from cache on delete', async () => {
      // First, cache the section
      const section = createMockSection();
      mockStorage.getSharedSection.mockResolvedValue(section);
      await service.getSection('sec-123');

      // Delete it
      await service.deleteSection('sec-123');

      // Next get should call storage again
      await service.getSection('sec-123');
      expect(mockStorage.getSharedSection).toHaveBeenCalledTimes(2);
    });

    it('should return false on error', async () => {
      mockStorage.deleteSharedSection.mockRejectedValue(new Error('DB error'));

      const result = await service.deleteSection('sec-123');

      expect(result).toBe(false);
    });
  });

  describe('incrementUsageCount', () => {
    it('should increment usage count', async () => {
      const section = createMockSection({ usageCount: 5 });
      mockStorage.getSharedSection.mockResolvedValue(section);

      await service.incrementUsageCount('sec-123');

      expect(mockStorage.saveSharedSection).toHaveBeenCalledWith(
        expect.objectContaining({ usageCount: 6 })
      );
    });

    it('should do nothing if section not found', async () => {
      mockStorage.getSharedSection.mockResolvedValue(null);

      await service.incrementUsageCount('nonexistent');

      expect(mockStorage.saveSharedSection).not.toHaveBeenCalled();
    });
  });

  describe('searchSections', () => {
    it('should search by title', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', title: 'Payment Schedules', content: '<p>Content A</p>', tags: ['schedule'], category: 'financial' }),
        createMockSection({ sectionId: 'sec-2', title: 'Insurance Requirements', content: '<p>Content B</p>', tags: ['insurance'], category: 'compliance' }),
        createMockSection({ sectionId: 'sec-3', title: 'Payment Terms', content: '<p>Content C</p>', tags: ['payment'], category: 'financial' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.searchSections('payment');

      expect(result).toHaveLength(2);
      expect(result.map(s => s.sectionId)).toContain('sec-1');
      expect(result.map(s => s.sectionId)).toContain('sec-3');
    });

    it('should search by content', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', title: 'Section A', content: '<p>Contains xyzcompliancexyz text</p>', tags: ['a'], category: 'other' }),
        createMockSection({ sectionId: 'sec-2', title: 'Section B', content: '<p>Different content</p>', tags: ['b'], category: 'other' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.searchSections('xyzcompliancexyz');

      expect(result).toHaveLength(1);
      expect(result[0].sectionId).toBe('sec-1');
    });

    it('should search by tags', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', title: 'Section A', content: '<p>Content A</p>', tags: ['uniquetag123', 'contract'], category: 'other' }),
        createMockSection({ sectionId: 'sec-2', title: 'Section B', content: '<p>Content B</p>', tags: ['financial', 'budget'], category: 'other' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.searchSections('uniquetag123');

      expect(result).toHaveLength(1);
      expect(result[0].sectionId).toBe('sec-1');
    });

    it('should search by category', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', category: 'compliance' }),
        createMockSection({ sectionId: 'sec-2', category: 'legal' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.searchSections('compliance');

      expect(result).toHaveLength(1);
      expect(result[0].sectionId).toBe('sec-1');
    });

    it('should be case-insensitive', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', title: 'TERMS AND CONDITIONS' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.searchSections('terms');

      expect(result).toHaveLength(1);
    });
  });

  describe('getSectionsByTags', () => {
    it('should return sections with matching tags', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', tags: ['legal', 'contract'] }),
        createMockSection({ sectionId: 'sec-2', tags: ['financial', 'budget'] }),
        createMockSection({ sectionId: 'sec-3', tags: ['legal', 'compliance'] }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getSectionsByTags(['legal']);

      expect(result).toHaveLength(2);
    });

    it('should match any of the provided tags', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', tags: ['legal'] }),
        createMockSection({ sectionId: 'sec-2', tags: ['financial'] }),
        createMockSection({ sectionId: 'sec-3', tags: ['compliance'] }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getSectionsByTags(['legal', 'financial']);

      expect(result).toHaveLength(2);
    });

    it('should be case-insensitive', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', tags: ['LEGAL'] }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getSectionsByTags(['legal']);

      expect(result).toHaveLength(1);
    });
  });

  describe('getMostUsedSections', () => {
    it('should return sections sorted by usage count', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', usageCount: 5 }),
        createMockSection({ sectionId: 'sec-2', usageCount: 10 }),
        createMockSection({ sectionId: 'sec-3', usageCount: 3 }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getMostUsedSections(3);

      expect(result[0].sectionId).toBe('sec-2');
      expect(result[1].sectionId).toBe('sec-1');
      expect(result[2].sectionId).toBe('sec-3');
    });

    it('should respect limit parameter', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', usageCount: 10 }),
        createMockSection({ sectionId: 'sec-2', usageCount: 8 }),
        createMockSection({ sectionId: 'sec-3', usageCount: 5 }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getMostUsedSections(2);

      expect(result).toHaveLength(2);
    });

    it('should default limit to 10', async () => {
      const sections = Array.from({ length: 15 }, (_, i) =>
        createMockSection({ sectionId: `sec-${i}`, usageCount: i })
      );
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getMostUsedSections();

      expect(result).toHaveLength(10);
    });
  });

  describe('getRecentSections', () => {
    it('should return sections sorted by creation date', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', createdAt: '2024-01-01T00:00:00.000Z' }),
        createMockSection({ sectionId: 'sec-2', createdAt: '2024-01-15T00:00:00.000Z' }),
        createMockSection({ sectionId: 'sec-3', createdAt: '2024-01-10T00:00:00.000Z' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getRecentSections(3);

      expect(result[0].sectionId).toBe('sec-2');
      expect(result[1].sectionId).toBe('sec-3');
      expect(result[2].sectionId).toBe('sec-1');
    });

    it('should respect limit parameter', async () => {
      const sections = [
        createMockSection({ sectionId: 'sec-1', createdAt: '2024-01-15T00:00:00.000Z' }),
        createMockSection({ sectionId: 'sec-2', createdAt: '2024-01-10T00:00:00.000Z' }),
        createMockSection({ sectionId: 'sec-3', createdAt: '2024-01-01T00:00:00.000Z' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getRecentSections(2);

      expect(result).toHaveLength(2);
    });
  });

  describe('getCategories', () => {
    it('should return unique categories sorted alphabetically', async () => {
      const sections = [
        createMockSection({ category: 'legal' }),
        createMockSection({ category: 'compliance' }),
        createMockSection({ category: 'legal' }),
        createMockSection({ category: 'financial' }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getCategories();

      expect(result).toEqual(['compliance', 'financial', 'legal']);
    });
  });

  describe('getTags', () => {
    it('should return unique tags sorted alphabetically', async () => {
      const sections = [
        createMockSection({ tags: ['legal', 'contract'] }),
        createMockSection({ tags: ['contract', 'compliance'] }),
        createMockSection({ tags: ['financial'] }),
      ];
      mockStorage.getSharedSections.mockResolvedValue(sections);

      const result = await service.getTags();

      expect(result).toEqual(['compliance', 'contract', 'financial', 'legal']);
    });
  });

  describe('importSections', () => {
    it('should import multiple sections', async () => {
      const sectionsToImport = [
        { title: 'Section 1', content: '<p>Content 1</p>', category: 'legal', tags: [] },
        { title: 'Section 2', content: '<p>Content 2</p>', category: 'compliance', tags: [] },
      ];

      const imported = await service.importSections(sectionsToImport);

      expect(imported).toHaveLength(2);
      expect(mockStorage.saveSharedSection).toHaveBeenCalledTimes(2);
    });

    it('should continue importing even if one fails', async () => {
      mockStorage.saveSharedSection
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('DB error'))
        .mockResolvedValueOnce(undefined);

      const sectionsToImport = [
        { title: 'Section 1', content: '<p>Content 1</p>', category: 'legal', tags: [] },
        { title: 'Section 2', content: '<p>Content 2</p>', category: 'compliance', tags: [] },
        { title: 'Section 3', content: '<p>Content 3</p>', category: 'financial', tags: [] },
      ];

      const imported = await service.importSections(sectionsToImport);

      // Should have imported 2 out of 3 (middle one failed)
      expect(imported).toHaveLength(2);
    });
  });

  describe('exportSectionsByCategory', () => {
    it('should export sections by category', async () => {
      const sections = [createMockSection(), createMockSection()];
      mockStorage.getSharedSectionsByCategory.mockResolvedValue(sections);

      const result = await service.exportSectionsByCategory('legal');

      expect(result).toHaveLength(2);
      expect(mockStorage.getSharedSectionsByCategory).toHaveBeenCalledWith('legal');
    });
  });

  describe('clearCache', () => {
    it('should clear the internal cache', async () => {
      // First, cache a section
      const section = createMockSection();
      mockStorage.getSharedSection.mockResolvedValue(section);
      await service.getSection('sec-123');

      // Clear cache
      service.clearCache();

      // Next get should call storage again
      await service.getSection('sec-123');
      expect(mockStorage.getSharedSection).toHaveBeenCalledTimes(2);
    });
  });
});
