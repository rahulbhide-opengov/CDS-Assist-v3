/**
 * useDocumentBuilder Hook
 * Main state management hook for the document builder UI
 *
 * Provides:
 * - Document loading and management
 * - Section selection and editing
 * - Auto-save functionality
 * - Dirty state tracking
 * - Validation state
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { documentService } from '../../services/procurement/DocumentService';
import type { Document, DocumentSection } from '../../types/procurement';
import type { ValidationReport } from '../../services/procurement/ProcurementTypes';

interface UseDocumentBuilderOptions {
  documentId: string;
  projectId?: string; // Required if document might not exist yet
  autoSave?: boolean;
  autoSaveDelay?: number; // milliseconds
}

interface UseDocumentBuilderReturn {
  // State
  document: Document | null;
  selectedSectionId: string | null;
  selectedSection: DocumentSection | null;
  isDirty: boolean;
  isSaving: boolean;
  isLoading: boolean;
  lastSavedAt: string | null;
  validationReport: ValidationReport | null;
  error: string | null;

  // Document actions
  loadDocument: () => Promise<void>;
  saveDocument: () => Promise<void>;
  updateDocumentField: (field: keyof Document, value: any) => void;

  // Section actions
  selectSection: (sectionId: string | null) => void;
  addSection: (section: Omit<DocumentSection, 'sectionId'>, position?: number) => Promise<string | undefined>;
  updateSection: (sectionId: string, updates: Partial<DocumentSection>) => Promise<void>;
  updateSectionContent: (sectionId: string, content: string) => void;
  deleteSection: (sectionId: string) => Promise<void>;
  reorderSections: (sectionIds: string[]) => Promise<void>;

  // Variable actions
  updateVariables: (variables: Record<string, any>) => Promise<void>;

  // Validation
  validateDocument: () => Promise<void>;

  // Version control
  createVersion: (changes: string) => Promise<void>;

  // Utility
  markClean: () => void;
  markDirty: () => void;
}

export function useDocumentBuilder(options: UseDocumentBuilderOptions): UseDocumentBuilderReturn {
  const { documentId, projectId, autoSave = true, autoSaveDelay = 2000 } = options;

  // State
  const [document, setDocument] = useState<Document | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const saveInProgressRef = useRef(false);

  // Selected section
  const selectedSection = selectedSectionId
    ? document?.sections.find((s) => s.sectionId === selectedSectionId) || null
    : null;

  /**
   * Load document from storage
   * If projectId is provided and document doesn't exist, creates it automatically
   */
  const loadDocument = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let doc: Document | null;

      if (projectId) {
        // Use getOrCreate when projectId is available (auto-creates if missing)
        doc = await documentService.getOrCreateDocument(documentId, projectId);
      } else {
        // Fall back to just getting the document
        doc = await documentService.getDocument(documentId);
        if (!doc) {
          throw new Error(`Document not found: ${documentId}`);
        }
      }

      setDocument(doc);
      setIsDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document');
      console.error('Error loading document:', err);
    } finally {
      setIsLoading(false);
    }
  }, [documentId, projectId]);

  /**
   * Save document to storage
   */
  const saveDocument = useCallback(async () => {
    if (!document || saveInProgressRef.current) return;

    saveInProgressRef.current = true;
    setIsSaving(true);
    setError(null);

    try {
      const updatedDoc = await documentService.updateDocument(documentId, document);
      setDocument(updatedDoc);
      setIsDirty(false);
      setLastSavedAt(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document');
      console.error('Error saving document:', err);
    } finally {
      setIsSaving(false);
      saveInProgressRef.current = false;
    }
  }, [document, documentId]);

  /**
   * Schedule auto-save
   */
  const scheduleAutoSave = useCallback(() => {
    if (!autoSave || !isDirty) return;

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Schedule new save
    autoSaveTimerRef.current = setTimeout(() => {
      saveDocument();
    }, autoSaveDelay);
  }, [autoSave, isDirty, saveDocument, autoSaveDelay]);

  /**
   * Update document field
   * Note: document is not in dependencies as we use functional setState
   */
  const updateDocumentField = useCallback(
    (field: keyof Document, value: any) => {
      setDocument((prev) => {
        if (!prev) return prev;
        return { ...prev, [field]: value };
      });
      setIsDirty(true);
    },
    []
  );

  /**
   * Select a section
   */
  const selectSection = useCallback((sectionId: string | null) => {
    setSelectedSectionId(sectionId);
  }, []);

  /**
   * Add a new section
   */
  const addSection = useCallback(
    async (section: Omit<DocumentSection, 'sectionId'>, position?: number): Promise<string | undefined> => {
      if (!document) return undefined;

      try {
        const newSection = await documentService.addSection(documentId, section, position);

        // Reload document to get updated sections
        await loadDocument();

        // Auto-select the new section
        setSelectedSectionId(newSection.sectionId);

        // Return the new section ID for external use (e.g., highlighting)
        return newSection.sectionId;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add section');
        console.error('Error adding section:', err);
        return undefined;
      }
    },
    [document, documentId, loadDocument]
  );

  /**
   * Update a section (persisted immediately)
   */
  const updateSection = useCallback(
    async (sectionId: string, updates: Partial<DocumentSection>) => {
      if (!document) return;

      try {
        await documentService.updateSection(documentId, sectionId, updates);
        await loadDocument();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update section');
        console.error('Error updating section:', err);
      }
    },
    [document, documentId, loadDocument]
  );

  /**
   * Update section content (local state only, auto-save handles persistence)
   * Note: document is not in dependencies as we use functional setState
   */
  const updateSectionContent = useCallback(
    (sectionId: string, content: string) => {
      setDocument((prev) => {
        if (!prev) return prev;

        const sections = prev.sections.map((s) =>
          s.sectionId === sectionId ? { ...s, content } : s
        );

        return { ...prev, sections };
      });
      setIsDirty(true);
    },
    []
  );

  /**
   * Delete a section
   */
  const deleteSection = useCallback(
    async (sectionId: string) => {
      if (!document) return;

      try {
        await documentService.deleteSection(documentId, sectionId);
        await loadDocument();

        // Clear selection if deleted section was selected
        if (selectedSectionId === sectionId) {
          setSelectedSectionId(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete section');
        console.error('Error deleting section:', err);
      }
    },
    [document, documentId, loadDocument, selectedSectionId]
  );

  /**
   * Reorder sections
   */
  const reorderSections = useCallback(
    async (sectionIds: string[]) => {
      if (!document) return;

      try {
        await documentService.reorderSections(documentId, sectionIds);
        await loadDocument();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reorder sections');
        console.error('Error reordering sections:', err);
      }
    },
    [document, documentId, loadDocument]
  );

  /**
   * Update variables
   */
  const updateVariables = useCallback(
    async (variables: Record<string, any>) => {
      if (!document) return;

      try {
        const updatedDoc = await documentService.updateVariables(documentId, variables);
        setDocument(updatedDoc);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update variables');
        console.error('Error updating variables:', err);
      }
    },
    [document, documentId]
  );

  /**
   * Validate document
   */
  const validateDocument = useCallback(async () => {
    if (!document) return;

    try {
      const report = await documentService.validateDocument(documentId);
      setValidationReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate document');
      console.error('Error validating document:', err);
    }
  }, [document, documentId]);

  /**
   * Create a version
   */
  const createVersion = useCallback(
    async (changes: string) => {
      if (!document) return;

      try {
        await documentService.createVersion(documentId, changes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create version');
        console.error('Error creating version:', err);
      }
    },
    [document, documentId]
  );

  /**
   * Mark document as clean
   */
  const markClean = useCallback(() => {
    setIsDirty(false);
  }, []);

  /**
   * Mark document as dirty
   */
  const markDirty = useCallback(() => {
    setIsDirty(true);
  }, []);

  // Effect: Load document on mount
  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Effect: Schedule auto-save when document changes
  useEffect(() => {
    if (isDirty) {
      scheduleAutoSave();
    }

    // Cleanup timer on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, scheduleAutoSave]);

  // Effect: Warn user about unsaved changes on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return {
    // State
    document,
    selectedSectionId,
    selectedSection,
    isDirty,
    isSaving,
    isLoading,
    lastSavedAt,
    validationReport,
    error,

    // Document actions
    loadDocument,
    saveDocument,
    updateDocumentField,

    // Section actions
    selectSection,
    addSection,
    updateSection,
    updateSectionContent,
    deleteSection,
    reorderSections,

    // Variable actions
    updateVariables,

    // Validation
    validateDocument,

    // Version control
    createVersion,

    // Utility
    markClean,
    markDirty,
  };
}
