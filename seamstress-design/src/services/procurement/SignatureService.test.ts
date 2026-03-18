import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SignatureService } from './SignatureService';
import { DocumentStorage } from './DocumentStorage';
import type { Signature } from '../../types/procurement';

// Mock the DocumentStorage
vi.mock('./DocumentStorage');

describe('SignatureService', () => {
  let service: SignatureService;
  let mockStorage: jest.Mocked<DocumentStorage>;

  // Helper to create mock signature
  const createMockSignature = (overrides: Partial<Signature> = {}): Signature => ({
    signatureId: 'sig-123',
    documentId: 'doc-123',
    signerName: 'John Doe',
    signerTitle: 'Director',
    signerEmail: 'john@example.com',
    signatureType: 'electronic',
    order: 1,
    status: 'pending',
    isRequired: true,
    createdAt: '2024-01-15T00:00:00.000Z',
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock storage instance
    mockStorage = {
      getSignaturesByDocument: vi.fn().mockResolvedValue([]),
      getSignature: vi.fn().mockResolvedValue(null),
      saveSignature: vi.fn().mockResolvedValue(undefined),
      deleteSignature: vi.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<DocumentStorage>;

    // Mock the DocumentStorage constructor
    vi.mocked(DocumentStorage).mockImplementation(() => mockStorage);

    service = new SignatureService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createSignature', () => {
    it('should create a new signature block', async () => {
      const signature = await service.createSignature({
        documentId: 'doc-123',
        signerName: 'Jane Smith',
        signerTitle: 'Manager',
        signerEmail: 'jane@example.com',
        signatureType: 'electronic',
        order: 1,
        isRequired: true,
      });

      expect(signature).toMatchObject({
        documentId: 'doc-123',
        signerName: 'Jane Smith',
        signerTitle: 'Manager',
        signerEmail: 'jane@example.com',
        signatureType: 'electronic',
        order: 1,
        isRequired: true,
        status: 'pending',
      });
      expect(signature.signatureId).toBeDefined();
      expect(signature.createdAt).toBeDefined();
      expect(mockStorage.saveSignature).toHaveBeenCalled();
    });

    it('should default isRequired to true', async () => {
      const signature = await service.createSignature({
        documentId: 'doc-123',
        signerName: 'Test User',
        signerTitle: 'Tester',
        signatureType: 'wet',
        order: 1,
      });

      expect(signature.isRequired).toBe(true);
    });

    it('should allow setting isRequired to false', async () => {
      const signature = await service.createSignature({
        documentId: 'doc-123',
        signerName: 'Test User',
        signerTitle: 'Tester',
        signatureType: 'wet',
        order: 1,
        isRequired: false,
      });

      expect(signature.isRequired).toBe(false);
    });
  });

  describe('getSignaturesByDocument', () => {
    it('should return signatures sorted by order', async () => {
      const signatures = [
        createMockSignature({ signatureId: 'sig-3', order: 3 }),
        createMockSignature({ signatureId: 'sig-1', order: 1 }),
        createMockSignature({ signatureId: 'sig-2', order: 2 }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const result = await service.getSignaturesByDocument('doc-123');

      expect(result[0].signatureId).toBe('sig-1');
      expect(result[1].signatureId).toBe('sig-2');
      expect(result[2].signatureId).toBe('sig-3');
    });

    it('should return empty array for document with no signatures', async () => {
      mockStorage.getSignaturesByDocument.mockResolvedValue([]);

      const result = await service.getSignaturesByDocument('doc-123');

      expect(result).toEqual([]);
    });
  });

  describe('getSignature', () => {
    it('should retrieve a single signature by ID', async () => {
      const signature = createMockSignature();
      mockStorage.getSignature.mockResolvedValue(signature);

      const result = await service.getSignature('sig-123');

      expect(result).toEqual(signature);
      expect(mockStorage.getSignature).toHaveBeenCalledWith('sig-123');
    });

    it('should return null for non-existent signature', async () => {
      mockStorage.getSignature.mockResolvedValue(null);

      const result = await service.getSignature('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateSignature', () => {
    it('should update signature metadata', async () => {
      const signature = createMockSignature();
      mockStorage.getSignature.mockResolvedValue(signature);

      const updated = await service.updateSignature('sig-123', {
        signerName: 'Jane Doe',
        signerTitle: 'Senior Director',
      });

      expect(updated).toMatchObject({
        signerName: 'Jane Doe',
        signerTitle: 'Senior Director',
      });
      expect(mockStorage.saveSignature).toHaveBeenCalled();
    });

    it('should throw error if signature not found', async () => {
      mockStorage.getSignature.mockResolvedValue(null);

      await expect(
        service.updateSignature('nonexistent', { signerName: 'Test' })
      ).rejects.toThrow('Signature not found: nonexistent');
    });

    it('should update status', async () => {
      const signature = createMockSignature({ status: 'pending' });
      mockStorage.getSignature.mockResolvedValue(signature);

      const updated = await service.updateSignature('sig-123', { status: 'signed' });

      expect(updated?.status).toBe('signed');
    });
  });

  describe('deleteSignature', () => {
    it('should delete a signature', async () => {
      await service.deleteSignature('sig-123');

      expect(mockStorage.deleteSignature).toHaveBeenCalledWith('sig-123');
    });
  });

  describe('reorderSignatures', () => {
    it('should update order based on provided array', async () => {
      const signatures = [
        createMockSignature({ signatureId: 'sig-1', order: 1 }),
        createMockSignature({ signatureId: 'sig-2', order: 2 }),
        createMockSignature({ signatureId: 'sig-3', order: 3 }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      await service.reorderSignatures('doc-123', ['sig-3', 'sig-1', 'sig-2']);

      expect(mockStorage.saveSignature).toHaveBeenCalledTimes(3);
      expect(mockStorage.saveSignature).toHaveBeenCalledWith(
        expect.objectContaining({ signatureId: 'sig-3', order: 1 })
      );
      expect(mockStorage.saveSignature).toHaveBeenCalledWith(
        expect.objectContaining({ signatureId: 'sig-1', order: 2 })
      );
      expect(mockStorage.saveSignature).toHaveBeenCalledWith(
        expect.objectContaining({ signatureId: 'sig-2', order: 3 })
      );
    });
  });

  describe('getNextOrder', () => {
    it('should return 1 for document with no signatures', async () => {
      mockStorage.getSignaturesByDocument.mockResolvedValue([]);

      const nextOrder = await service.getNextOrder('doc-123');

      expect(nextOrder).toBe(1);
    });

    it('should return next order based on existing signatures', async () => {
      const signatures = [
        createMockSignature({ order: 1 }),
        createMockSignature({ order: 3 }),
        createMockSignature({ order: 2 }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const nextOrder = await service.getNextOrder('doc-123');

      expect(nextOrder).toBe(4);
    });
  });

  describe('signSignature', () => {
    it('should mark signature as signed', async () => {
      const signature = createMockSignature({ status: 'pending' });
      mockStorage.getSignature.mockResolvedValue(signature);

      const result = await service.signSignature('sig-123', 'signature-data');

      expect(result).toMatchObject({
        status: 'signed',
        signatureData: 'signature-data',
      });
      expect(result?.signedAt).toBeDefined();
    });

    it('should work without signature data', async () => {
      const signature = createMockSignature({ status: 'pending' });
      mockStorage.getSignature.mockResolvedValue(signature);

      const result = await service.signSignature('sig-123');

      expect(result?.status).toBe('signed');
      expect(result?.signedAt).toBeDefined();
    });
  });

  describe('declineSignature', () => {
    it('should mark signature as declined', async () => {
      const signature = createMockSignature({ status: 'pending' });
      mockStorage.getSignature.mockResolvedValue(signature);

      const result = await service.declineSignature('sig-123');

      expect(result?.status).toBe('declined');
    });
  });

  describe('areAllRequiredSignaturesComplete', () => {
    it('should return true when all required signatures are signed', async () => {
      const signatures = [
        createMockSignature({ isRequired: true, status: 'signed' }),
        createMockSignature({ isRequired: true, status: 'signed' }),
        createMockSignature({ isRequired: false, status: 'pending' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const result = await service.areAllRequiredSignaturesComplete('doc-123');

      expect(result).toBe(true);
    });

    it('should return false when some required signatures are pending', async () => {
      const signatures = [
        createMockSignature({ isRequired: true, status: 'signed' }),
        createMockSignature({ isRequired: true, status: 'pending' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const result = await service.areAllRequiredSignaturesComplete('doc-123');

      expect(result).toBe(false);
    });

    it('should return true when there are no required signatures', async () => {
      const signatures = [
        createMockSignature({ isRequired: false, status: 'pending' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const result = await service.areAllRequiredSignaturesComplete('doc-123');

      expect(result).toBe(true);
    });

    it('should return true when there are no signatures', async () => {
      mockStorage.getSignaturesByDocument.mockResolvedValue([]);

      const result = await service.areAllRequiredSignaturesComplete('doc-123');

      expect(result).toBe(true);
    });
  });

  describe('getSignatureProgress', () => {
    it('should calculate progress correctly', async () => {
      const signatures = [
        createMockSignature({ isRequired: true, status: 'signed' }),
        createMockSignature({ isRequired: true, status: 'signed' }),
        createMockSignature({ isRequired: true, status: 'pending' }),
        createMockSignature({ isRequired: true, status: 'declined' }),
        createMockSignature({ isRequired: false, status: 'pending' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const progress = await service.getSignatureProgress('doc-123');

      expect(progress).toEqual({
        total: 4,
        signed: 2,
        pending: 1,
        declined: 1,
        percentage: 50,
      });
    });

    it('should return 100% when no required signatures', async () => {
      mockStorage.getSignaturesByDocument.mockResolvedValue([]);

      const progress = await service.getSignatureProgress('doc-123');

      expect(progress.percentage).toBe(100);
    });

    it('should return 0% when no signatures are signed', async () => {
      const signatures = [
        createMockSignature({ isRequired: true, status: 'pending' }),
        createMockSignature({ isRequired: true, status: 'pending' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const progress = await service.getSignatureProgress('doc-123');

      expect(progress.percentage).toBe(0);
    });
  });

  describe('getSignaturesByType', () => {
    it('should return only electronic signatures', async () => {
      const signatures = [
        createMockSignature({ signatureType: 'electronic' }),
        createMockSignature({ signatureType: 'wet' }),
        createMockSignature({ signatureType: 'electronic' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const result = await service.getSignaturesByType('doc-123', 'electronic');

      expect(result).toHaveLength(2);
      expect(result.every(s => s.signatureType === 'electronic')).toBe(true);
    });

    it('should return only wet signatures', async () => {
      const signatures = [
        createMockSignature({ signatureType: 'electronic' }),
        createMockSignature({ signatureType: 'wet' }),
        createMockSignature({ signatureType: 'wet' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const result = await service.getSignaturesByType('doc-123', 'wet');

      expect(result).toHaveLength(2);
      expect(result.every(s => s.signatureType === 'wet')).toBe(true);
    });
  });

  describe('getSignaturesByStatus', () => {
    it('should return signatures by status', async () => {
      const signatures = [
        createMockSignature({ status: 'pending' }),
        createMockSignature({ status: 'signed' }),
        createMockSignature({ status: 'pending' }),
        createMockSignature({ status: 'declined' }),
      ];
      mockStorage.getSignaturesByDocument.mockResolvedValue(signatures);

      const pending = await service.getSignaturesByStatus('doc-123', 'pending');
      const signed = await service.getSignaturesByStatus('doc-123', 'signed');
      const declined = await service.getSignaturesByStatus('doc-123', 'declined');

      expect(pending).toHaveLength(2);
      expect(signed).toHaveLength(1);
      expect(declined).toHaveLength(1);
    });
  });
});
