/**
 * useSignatures Hook
 * React hook for signature block management
 *
 * Features:
 * - Add/remove signers
 * - Reorder signatures
 * - Track signature status
 * - Loading states
 * - Error handling
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getSignatureService,
  type SignatureCreateData,
  type SignatureUpdateData,
} from '../../services/procurement/SignatureService';
import type { Signature } from '../../types/procurement';

interface UseSignaturesOptions {
  documentId: string;
  autoLoad?: boolean;
}

interface UseSignaturesReturn {
  // State
  signatures: Signature[];
  isLoading: boolean;
  error: string | null;
  progress: {
    total: number;
    signed: number;
    pending: number;
    declined: number;
    percentage: number;
  };

  // Operations
  loadSignatures: () => Promise<void>;
  addSignature: (data: Omit<SignatureCreateData, 'documentId' | 'order'>) => Promise<Signature | null>;
  updateSignature: (signatureId: string, updates: SignatureUpdateData) => Promise<Signature | null>;
  deleteSignature: (signatureId: string) => Promise<boolean>;
  reorderSignatures: (signatureIds: string[]) => Promise<void>;
  signSignature: (signatureId: string, signatureData?: string) => Promise<Signature | null>;
  declineSignature: (signatureId: string) => Promise<Signature | null>;

  // Computed
  isComplete: boolean;
  wetSignatures: Signature[];
  electronicSignatures: Signature[];
  pendingSignatures: Signature[];

  // Utility
  clearError: () => void;
}

export function useSignatures({
  documentId,
  autoLoad = true,
}: UseSignaturesOptions): UseSignaturesReturn {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({
    total: 0,
    signed: 0,
    pending: 0,
    declined: 0,
    percentage: 0,
  });

  // Use useMemo to get a stable service reference
  const service = useMemo(() => getSignatureService(), []);

  // ============================================================================
  // Load Signatures
  // ============================================================================

  const loadSignatures = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sigs, prog] = await Promise.all([
        service.getSignaturesByDocument(documentId),
        service.getSignatureProgress(documentId),
      ]);
      setSignatures(sigs);
      setProgress(prog);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load signatures';
      setError(message);
      console.error('Error loading signatures:', err);
    } finally {
      setIsLoading(false);
    }
  }, [documentId, service]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadSignatures();
    }
  }, [autoLoad, loadSignatures]);

  // ============================================================================
  // CRUD Operations
  // ============================================================================

  const addSignature = useCallback(
    async (
      data: Omit<SignatureCreateData, 'documentId' | 'order'>
    ): Promise<Signature | null> => {
      setError(null);
      try {
        const nextOrder = await service.getNextOrder(documentId);
        const signature = await service.createSignature({
          ...data,
          documentId,
          order: nextOrder,
        });

        // Refresh list and progress
        await loadSignatures();
        return signature;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add signature';
        setError(message);
        console.error('Error adding signature:', err);
        return null;
      }
    },
    [documentId, service, loadSignatures]
  );

  const updateSignature = useCallback(
    async (signatureId: string, updates: SignatureUpdateData): Promise<Signature | null> => {
      setError(null);
      try {
        const updated = await service.updateSignature(signatureId, updates);
        if (updated) {
          // Update local state
          setSignatures((prev) =>
            prev.map((sig) => (sig.signatureId === signatureId ? updated : sig))
          );
          // Refresh progress
          const prog = await service.getSignatureProgress(documentId);
          setProgress(prog);
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update signature';
        setError(message);
        console.error('Error updating signature:', err);
        return null;
      }
    },
    [documentId, service]
  );

  const deleteSignature = useCallback(
    async (signatureId: string): Promise<boolean> => {
      setError(null);
      try {
        await service.deleteSignature(signatureId);
        // Update local state
        setSignatures((prev) => prev.filter((sig) => sig.signatureId !== signatureId));
        // Refresh progress
        const prog = await service.getSignatureProgress(documentId);
        setProgress(prog);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete signature';
        setError(message);
        console.error('Error deleting signature:', err);
        return false;
      }
    },
    [documentId, service]
  );

  const reorderSignatures = useCallback(
    async (signatureIds: string[]): Promise<void> => {
      setError(null);
      try {
        await service.reorderSignatures(documentId, signatureIds);
        // Refresh to get updated order
        await loadSignatures();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reorder signatures';
        setError(message);
        console.error('Error reordering signatures:', err);
      }
    },
    [documentId, service, loadSignatures]
  );

  const signSignature = useCallback(
    async (signatureId: string, signatureData?: string): Promise<Signature | null> => {
      setError(null);
      try {
        const signed = await service.signSignature(signatureId, signatureData);
        if (signed) {
          // Update local state
          setSignatures((prev) =>
            prev.map((sig) => (sig.signatureId === signatureId ? signed : sig))
          );
          // Refresh progress
          const prog = await service.getSignatureProgress(documentId);
          setProgress(prog);
        }
        return signed;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to sign';
        setError(message);
        console.error('Error signing:', err);
        return null;
      }
    },
    [documentId, service]
  );

  const declineSignature = useCallback(
    async (signatureId: string): Promise<Signature | null> => {
      setError(null);
      try {
        const declined = await service.declineSignature(signatureId);
        if (declined) {
          // Update local state
          setSignatures((prev) =>
            prev.map((sig) => (sig.signatureId === signatureId ? declined : sig))
          );
          // Refresh progress
          const prog = await service.getSignatureProgress(documentId);
          setProgress(prog);
        }
        return declined;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to decline';
        setError(message);
        console.error('Error declining:', err);
        return null;
      }
    },
    [documentId, service]
  );

  // ============================================================================
  // Computed Values
  // ============================================================================

  const isComplete = progress.total > 0 && progress.percentage === 100;
  const wetSignatures = signatures.filter((sig) => sig.signatureType === 'wet');
  const electronicSignatures = signatures.filter((sig) => sig.signatureType === 'electronic');
  const pendingSignatures = signatures.filter((sig) => sig.status === 'pending');

  // ============================================================================
  // Utility
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    signatures,
    isLoading,
    error,
    progress,

    // Operations
    loadSignatures,
    addSignature,
    updateSignature,
    deleteSignature,
    reorderSignatures,
    signSignature,
    declineSignature,

    // Computed
    isComplete,
    wetSignatures,
    electronicSignatures,
    pendingSignatures,

    // Utility
    clearError,
  };
}
