/**
 * useExhibits Hook
 * React hook for exhibit management operations
 *
 * Features:
 * - Upload files
 * - List exhibits
 * - Reorder exhibits
 * - Download and delete
 * - Loading states
 * - Error handling
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getExhibitService, type ExhibitUploadData } from '../../services/procurement/ExhibitService';
import type { Attachment } from '../../types/procurement';

interface UseExhibitsOptions {
  documentId: string;
  autoLoad?: boolean;
}

interface UploadError {
  fileName: string;
  error: string;
}

interface UploadResult {
  successful: Attachment[];
  failed: UploadError[];
}

interface UseExhibitsReturn {
  // State
  exhibits: Attachment[];
  internalExhibits: Attachment[];
  externalExhibits: Attachment[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  uploadErrors: UploadError[];
  totalFileSize: number;

  // Operations
  loadExhibits: () => Promise<void>;
  uploadExhibit: (data: Omit<ExhibitUploadData, 'documentId'>) => Promise<Attachment | null>;
  uploadMultiple: (files: File[], isInternal?: boolean) => Promise<UploadResult>;
  deleteExhibit: (exhibitId: string) => Promise<boolean>;
  downloadExhibit: (exhibit: Attachment) => void;
  reorderExhibits: (exhibitIds: string[]) => Promise<void>;
  updateExhibit: (
    exhibitId: string,
    updates: { fileName?: string; isInternal?: boolean; description?: string }
  ) => Promise<Attachment | null>;

  // Utility
  clearError: () => void;
  clearUploadErrors: () => void;
  formatFileSize: (bytes: number) => string;
}

export function useExhibits({ documentId, autoLoad = true }: UseExhibitsOptions): UseExhibitsReturn {
  const [exhibits, setExhibits] = useState<Attachment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<UploadError[]>([]);

  // Use useMemo to get a stable service reference
  const service = useMemo(() => getExhibitService(), []);

  // ============================================================================
  // Load Exhibits
  // ============================================================================

  const loadExhibits = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allExhibits = await service.getExhibitsByDocument(documentId);
      setExhibits(allExhibits);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load exhibits';
      setError(message);
      console.error('Error loading exhibits:', err);
    } finally {
      setIsLoading(false);
    }
  }, [documentId, service]);

  // Auto-load on mount
  useEffect(() => {
    if (autoLoad) {
      loadExhibits();
    }
  }, [autoLoad, loadExhibits]);

  // ============================================================================
  // Upload Operations
  // ============================================================================

  const uploadExhibit = useCallback(
    async (data: Omit<ExhibitUploadData, 'documentId'>): Promise<Attachment | null> => {
      setIsUploading(true);
      setError(null);
      try {
        const exhibit = await service.uploadExhibit({
          ...data,
          documentId,
        });
        // Refresh list
        await loadExhibits();
        return exhibit;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload exhibit';
        setError(message);
        console.error('Error uploading exhibit:', err);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [documentId, service, loadExhibits]
  );

  const uploadMultiple = useCallback(
    async (files: File[], isInternal: boolean = false): Promise<UploadResult> => {
      setIsUploading(true);
      setError(null);
      setUploadErrors([]);

      const successful: Attachment[] = [];
      const failed: UploadError[] = [];

      try {
        for (const file of files) {
          try {
            const exhibit = await service.uploadExhibit({
              file,
              documentId,
              isInternal,
            });
            successful.push(exhibit);
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Upload failed';
            failed.push({ fileName: file.name, error: errorMessage });
            console.error(`Failed to upload ${file.name}:`, err);
          }
        }

        // Set upload errors if any files failed
        if (failed.length > 0) {
          setUploadErrors(failed);
          if (successful.length === 0) {
            setError(`All ${failed.length} file(s) failed to upload`);
          } else {
            setError(`${failed.length} of ${files.length} file(s) failed to upload`);
          }
        }

        // Refresh list
        await loadExhibits();
        return { successful, failed };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload exhibits';
        setError(message);
        console.error('Error uploading exhibits:', err);
        return { successful, failed };
      } finally {
        setIsUploading(false);
      }
    },
    [documentId, service, loadExhibits]
  );

  // ============================================================================
  // Update and Delete Operations
  // ============================================================================

  const updateExhibit = useCallback(
    async (
      exhibitId: string,
      updates: { fileName?: string; isInternal?: boolean; description?: string }
    ): Promise<Attachment | null> => {
      setError(null);
      try {
        const updated = await service.updateExhibit(exhibitId, updates);
        if (updated) {
          // Update local state
          setExhibits((prev) => prev.map((ex) => (ex.attachmentId === exhibitId ? updated : ex)));
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update exhibit';
        setError(message);
        console.error('Error updating exhibit:', err);
        return null;
      }
    },
    [service]
  );

  const deleteExhibit = useCallback(
    async (exhibitId: string): Promise<boolean> => {
      setError(null);
      try {
        await service.deleteExhibit(exhibitId);
        // Update local state
        setExhibits((prev) => prev.filter((ex) => ex.attachmentId !== exhibitId));
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete exhibit';
        setError(message);
        console.error('Error deleting exhibit:', err);
        return false;
      }
    },
    [service]
  );

  const reorderExhibits = useCallback(
    async (exhibitIds: string[]): Promise<void> => {
      setError(null);
      try {
        await service.reorderExhibits(documentId, exhibitIds);
        // Refresh to get updated order
        await loadExhibits();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reorder exhibits';
        setError(message);
        console.error('Error reordering exhibits:', err);
      }
    },
    [documentId, service, loadExhibits]
  );

  const downloadExhibit = useCallback(
    (exhibit: Attachment): void => {
      try {
        service.downloadExhibit(exhibit);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to download exhibit';
        setError(message);
        console.error('Error downloading exhibit:', err);
      }
    },
    [service]
  );

  // ============================================================================
  // Computed Values
  // ============================================================================

  const internalExhibits = exhibits.filter((ex) => ex.isInternal);
  const externalExhibits = exhibits.filter((ex) => !ex.isInternal);
  const totalFileSize = exhibits.reduce((total, ex) => total + ex.fileSize, 0);

  // ============================================================================
  // Utility
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }, []);

  const clearUploadErrors = useCallback(() => {
    setUploadErrors([]);
  }, []);

  return {
    // State
    exhibits,
    internalExhibits,
    externalExhibits,
    isLoading,
    isUploading,
    error,
    uploadErrors,
    totalFileSize,

    // Operations
    loadExhibits,
    uploadExhibit,
    uploadMultiple,
    deleteExhibit,
    downloadExhibit,
    reorderExhibits,
    updateExhibit,

    // Utility
    clearError,
    clearUploadErrors,
    formatFileSize,
  };
}
