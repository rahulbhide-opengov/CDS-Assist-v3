import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ExhibitService } from './ExhibitService';
import { DocumentStorage } from './DocumentStorage';
import type { Attachment } from '../../types/procurement';

// Mock the DocumentStorage
vi.mock('./DocumentStorage');

describe('ExhibitService', () => {
  let service: ExhibitService;
  let mockStorage: jest.Mocked<DocumentStorage>;

  // Helper to create mock exhibit
  const createMockExhibit = (overrides: Partial<Attachment> = {}): Attachment => ({
    attachmentId: 'exhibit-123',
    fileName: 'test.pdf',
    fileSize: 1024,
    fileType: 'application/pdf',
    uploadedBy: 'user-1',
    uploadedAt: '2024-01-15T00:00:00.000Z',
    url: '',
    isInternal: false,
    documentId: 'doc-123',
    order: 1,
    ...overrides,
  });

  // Helper to create mock File
  const createMockFile = (
    name = 'test.pdf',
    type = 'application/pdf',
    size = 1024
  ): File => {
    const content = new ArrayBuffer(size);
    return new File([content], name, { type });
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock storage instance
    mockStorage = {
      getExhibitsByDocument: vi.fn().mockResolvedValue([]),
      getExhibit: vi.fn().mockResolvedValue(null),
      saveExhibit: vi.fn().mockResolvedValue(undefined),
      deleteExhibit: vi.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<DocumentStorage>;

    // Mock the DocumentStorage constructor
    vi.mocked(DocumentStorage).mockImplementation(() => mockStorage);

    service = new ExhibitService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('uploadExhibit', () => {
    it('should upload a file as an exhibit', async () => {
      const file = createMockFile('document.pdf', 'application/pdf', 2048);
      mockStorage.getExhibitsByDocument.mockResolvedValue([]);

      const exhibit = await service.uploadExhibit({
        file,
        documentId: 'doc-123',
        isInternal: false,
        description: 'Test document',
      });

      expect(exhibit).toMatchObject({
        fileName: 'document.pdf',
        fileSize: 2048,
        fileType: 'application/pdf',
        documentId: 'doc-123',
        isInternal: false,
        description: 'Test document',
        order: 1,
      });
      expect(exhibit.attachmentId).toBeDefined();
      expect(mockStorage.saveExhibit).toHaveBeenCalled();
    });

    it('should set correct order based on existing exhibits', async () => {
      const existingExhibits = [
        createMockExhibit({ attachmentId: 'ex-1', order: 1 }),
        createMockExhibit({ attachmentId: 'ex-2', order: 2 }),
      ];
      mockStorage.getExhibitsByDocument.mockResolvedValue(existingExhibits);

      const file = createMockFile();
      const exhibit = await service.uploadExhibit({
        file,
        documentId: 'doc-123',
      });

      expect(exhibit.order).toBe(3);
    });

    it('should default isInternal to false', async () => {
      const file = createMockFile();
      mockStorage.getExhibitsByDocument.mockResolvedValue([]);

      const exhibit = await service.uploadExhibit({
        file,
        documentId: 'doc-123',
      });

      expect(exhibit.isInternal).toBe(false);
    });

    it('should throw error for files exceeding 100MB', async () => {
      const largeFile = createMockFile('large.pdf', 'application/pdf', 150 * 1024 * 1024);

      await expect(
        service.uploadExhibit({ file: largeFile, documentId: 'doc-123' })
      ).rejects.toThrow('File size exceeds maximum allowed size of 100MB');
    });
  });

  describe('getExhibitsByDocument', () => {
    it('should return exhibits sorted by order', async () => {
      const exhibits = [
        createMockExhibit({ attachmentId: 'ex-3', order: 3 }),
        createMockExhibit({ attachmentId: 'ex-1', order: 1 }),
        createMockExhibit({ attachmentId: 'ex-2', order: 2 }),
      ];
      mockStorage.getExhibitsByDocument.mockResolvedValue(exhibits);

      const result = await service.getExhibitsByDocument('doc-123');

      expect(result[0].attachmentId).toBe('ex-1');
      expect(result[1].attachmentId).toBe('ex-2');
      expect(result[2].attachmentId).toBe('ex-3');
    });

    it('should return empty array for document with no exhibits', async () => {
      mockStorage.getExhibitsByDocument.mockResolvedValue([]);

      const result = await service.getExhibitsByDocument('doc-123');

      expect(result).toEqual([]);
    });
  });

  describe('getExhibit', () => {
    it('should retrieve a single exhibit by ID', async () => {
      const exhibit = createMockExhibit();
      mockStorage.getExhibit.mockResolvedValue(exhibit);

      const result = await service.getExhibit('exhibit-123');

      expect(result).toEqual(exhibit);
      expect(mockStorage.getExhibit).toHaveBeenCalledWith('exhibit-123');
    });

    it('should return null for non-existent exhibit', async () => {
      mockStorage.getExhibit.mockResolvedValue(null);

      const result = await service.getExhibit('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateExhibit', () => {
    it('should update exhibit metadata', async () => {
      const exhibit = createMockExhibit();
      mockStorage.getExhibit.mockResolvedValue(exhibit);

      const updated = await service.updateExhibit('exhibit-123', {
        fileName: 'renamed.pdf',
        isInternal: true,
        description: 'Updated description',
      });

      expect(updated).toMatchObject({
        fileName: 'renamed.pdf',
        isInternal: true,
        description: 'Updated description',
      });
      expect(mockStorage.saveExhibit).toHaveBeenCalled();
    });

    it('should throw error if exhibit not found', async () => {
      mockStorage.getExhibit.mockResolvedValue(null);

      await expect(
        service.updateExhibit('nonexistent', { fileName: 'test.pdf' })
      ).rejects.toThrow('Exhibit not found: nonexistent');
    });

    it('should update order when specified', async () => {
      const exhibit = createMockExhibit({ order: 1 });
      mockStorage.getExhibit.mockResolvedValue(exhibit);

      const updated = await service.updateExhibit('exhibit-123', { order: 5 });

      expect(updated?.order).toBe(5);
    });
  });

  describe('reorderExhibits', () => {
    it('should update order based on provided array', async () => {
      const exhibits = [
        createMockExhibit({ attachmentId: 'ex-1', order: 1 }),
        createMockExhibit({ attachmentId: 'ex-2', order: 2 }),
        createMockExhibit({ attachmentId: 'ex-3', order: 3 }),
      ];
      mockStorage.getExhibitsByDocument.mockResolvedValue(exhibits);

      await service.reorderExhibits('doc-123', ['ex-3', 'ex-1', 'ex-2']);

      // Verify saveExhibit was called with correct orders
      expect(mockStorage.saveExhibit).toHaveBeenCalledTimes(3);
      expect(mockStorage.saveExhibit).toHaveBeenCalledWith(
        expect.objectContaining({ attachmentId: 'ex-3', order: 1 })
      );
      expect(mockStorage.saveExhibit).toHaveBeenCalledWith(
        expect.objectContaining({ attachmentId: 'ex-1', order: 2 })
      );
      expect(mockStorage.saveExhibit).toHaveBeenCalledWith(
        expect.objectContaining({ attachmentId: 'ex-2', order: 3 })
      );
    });
  });

  describe('deleteExhibit', () => {
    it('should delete an exhibit', async () => {
      await service.deleteExhibit('exhibit-123');

      expect(mockStorage.deleteExhibit).toHaveBeenCalledWith('exhibit-123');
    });
  });

  describe('getExhibitsByType', () => {
    it('should return only internal exhibits', async () => {
      const exhibits = [
        createMockExhibit({ attachmentId: 'ex-1', isInternal: true }),
        createMockExhibit({ attachmentId: 'ex-2', isInternal: false }),
        createMockExhibit({ attachmentId: 'ex-3', isInternal: true }),
      ];
      mockStorage.getExhibitsByDocument.mockResolvedValue(exhibits);

      const result = await service.getExhibitsByType('doc-123', true);

      expect(result).toHaveLength(2);
      expect(result.every(ex => ex.isInternal)).toBe(true);
    });

    it('should return only external exhibits', async () => {
      const exhibits = [
        createMockExhibit({ attachmentId: 'ex-1', isInternal: true }),
        createMockExhibit({ attachmentId: 'ex-2', isInternal: false }),
        createMockExhibit({ attachmentId: 'ex-3', isInternal: false }),
      ];
      mockStorage.getExhibitsByDocument.mockResolvedValue(exhibits);

      const result = await service.getExhibitsByType('doc-123', false);

      expect(result).toHaveLength(2);
      expect(result.every(ex => !ex.isInternal)).toBe(true);
    });
  });

  describe('getTotalFileSize', () => {
    it('should calculate total file size', async () => {
      const exhibits = [
        createMockExhibit({ fileSize: 1024 }),
        createMockExhibit({ fileSize: 2048 }),
        createMockExhibit({ fileSize: 512 }),
      ];
      mockStorage.getExhibitsByDocument.mockResolvedValue(exhibits);

      const totalSize = await service.getTotalFileSize('doc-123');

      expect(totalSize).toBe(3584);
    });

    it('should return 0 for document with no exhibits', async () => {
      mockStorage.getExhibitsByDocument.mockResolvedValue([]);

      const totalSize = await service.getTotalFileSize('doc-123');

      expect(totalSize).toBe(0);
    });
  });

  describe('downloadExhibit', () => {
    it('should throw error if file blob is missing', () => {
      const exhibit = createMockExhibit({ fileBlob: undefined });

      expect(() => service.downloadExhibit(exhibit)).toThrow('File blob not found');
    });
  });
});
