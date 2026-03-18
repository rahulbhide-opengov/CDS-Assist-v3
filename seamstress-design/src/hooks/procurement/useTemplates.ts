/**
 * useTemplates Hook
 * React hook for template management operations
 *
 * Features:
 * - Template CRUD
 * - Question management
 * - Template search and filtering
 * - Loading states
 * - Error handling
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTemplateService } from '../../services/procurement/TemplateService';
import type {
  Template,
  TemplateType,
  Question,
  QuestionType,
  QuestionOption,
  ProjectQuestion,
} from '../../types/procurement';

interface UseTemplatesReturn {
  // State
  templates: Template[];
  selectedTemplate: Template | null;
  questions: Question[];
  isLoading: boolean;
  error: string | null;

  // Template operations
  loadTemplates: () => Promise<void>;
  loadTemplate: (templateId: string) => Promise<void>;
  createTemplate: (data: {
    name: string;
    description: string;
    type: TemplateType;
    sections?: Array<{
      title: string;
      type: 'text' | 'list' | 'heading';
      content?: string;
      required?: boolean;
    }>;
    variables?: string[];
  }) => Promise<Template | null>;
  updateTemplate: (
    templateId: string,
    updates: Partial<Omit<Template, 'templateId' | 'createdAt'>>
  ) => Promise<Template | null>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
  duplicateTemplate: (templateId: string, newName?: string) => Promise<Template | null>;
  searchTemplates: (query: string) => Promise<Template[]>;
  getTemplatesByType: (type: TemplateType) => Promise<Template[]>;

  // Question operations
  loadQuestions: (templateId: string) => Promise<void>;
  addQuestion: (
    templateId: string,
    data: {
      text: string;
      type: QuestionType;
      required?: boolean;
      helpText?: string;
      defaultValue?: string;
      variableName?: string;
    }
  ) => Promise<Question | null>;
  updateQuestion: (
    questionId: string,
    updates: Partial<Omit<Question, 'questionId' | 'templateId' | 'createdAt'>>
  ) => Promise<Question | null>;
  deleteQuestion: (questionId: string) => Promise<boolean>;
  reorderQuestions: (templateId: string, questionIds: string[]) => Promise<void>;

  // Question options
  loadQuestionOptions: (questionId: string) => Promise<QuestionOption[]>;
  addQuestionOption: (
    questionId: string,
    data: { label: string; value: string }
  ) => Promise<QuestionOption | null>;
  updateQuestionOption: (
    optionId: string,
    updates: Partial<Omit<QuestionOption, 'optionId' | 'questionId'>>
  ) => Promise<QuestionOption | null>;
  deleteQuestionOption: (optionId: string) => Promise<boolean>;

  // Project question answers
  loadProjectAnswers: (projectId: string) => Promise<ProjectQuestion[]>;
  saveProjectAnswer: (
    projectId: string,
    questionId: string,
    answer: string | string[]
  ) => Promise<ProjectQuestion | null>;

  // Utility
  clearError: () => void;
  validateTemplate: (templateId: string) => Promise<{ valid: boolean; errors: string[] }>;
}

export function useTemplates(): UseTemplatesReturn {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use useMemo to get a stable service reference
  const templateService = useMemo(() => getTemplateService(), []);

  // ============================================================================
  // Template Operations
  // ============================================================================

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allTemplates = await templateService.getTemplates();
      setTemplates(allTemplates);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load templates';
      setError(message);
      console.error('Error loading templates:', err);
    } finally {
      setIsLoading(false);
    }
  }, [templateService]);

  const loadTemplate = useCallback(
    async (templateId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const template = await templateService.getTemplate(templateId);
        if (template) {
          setSelectedTemplate(template);
          // Also load questions for this template
          const templateQuestions = await templateService.getTemplateQuestions(templateId);
          setQuestions(templateQuestions);
        } else {
          setError('Template not found');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load template';
        setError(message);
        console.error('Error loading template:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const createTemplate = useCallback(
    async (data: {
      name: string;
      description: string;
      type: TemplateType;
      sections?: Array<{
        title: string;
        type: 'text' | 'list' | 'heading';
        content?: string;
        required?: boolean;
      }>;
      variables?: string[];
    }): Promise<Template | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newTemplate = await templateService.createTemplate(data);
        // Refresh templates list
        await loadTemplates();
        return newTemplate;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create template';
        setError(message);
        console.error('Error creating template:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, loadTemplates]
  );

  const updateTemplate = useCallback(
    async (
      templateId: string,
      updates: Partial<Omit<Template, 'templateId' | 'createdAt'>>
    ): Promise<Template | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await templateService.updateTemplate(templateId, updates);
        if (updated) {
          // Update selected template if it's the one being edited
          if (selectedTemplate?.templateId === templateId) {
            setSelectedTemplate(updated);
          }
          // Refresh templates list
          await loadTemplates();
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update template';
        setError(message);
        console.error('Error updating template:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, selectedTemplate, loadTemplates]
  );

  const deleteTemplate = useCallback(
    async (templateId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const success = await templateService.deleteTemplate(templateId);
        if (success) {
          // Clear selected template if it was deleted
          if (selectedTemplate?.templateId === templateId) {
            setSelectedTemplate(null);
            setQuestions([]);
          }
          // Refresh templates list
          await loadTemplates();
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete template';
        setError(message);
        console.error('Error deleting template:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, selectedTemplate, loadTemplates]
  );

  const duplicateTemplate = useCallback(
    async (templateId: string, newName?: string): Promise<Template | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const duplicate = await templateService.duplicateTemplate(templateId, newName);
        if (duplicate) {
          // Refresh templates list
          await loadTemplates();
        }
        return duplicate;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to duplicate template';
        setError(message);
        console.error('Error duplicating template:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, loadTemplates]
  );

  const searchTemplates = useCallback(
    async (query: string): Promise<Template[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await templateService.searchTemplates(query);
        return results;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Search failed';
        setError(message);
        console.error('Error searching templates:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const getTemplatesByType = useCallback(
    async (type: TemplateType): Promise<Template[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await templateService.getTemplatesByType(type);
        return results;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load templates by type';
        setError(message);
        console.error('Error loading templates by type:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  // ============================================================================
  // Question Operations
  // ============================================================================

  const loadQuestions = useCallback(
    async (templateId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const templateQuestions = await templateService.getTemplateQuestions(templateId);
        setQuestions(templateQuestions);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load questions';
        setError(message);
        console.error('Error loading questions:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const addQuestion = useCallback(
    async (
      templateId: string,
      data: {
        text: string;
        type: QuestionType;
        required?: boolean;
        helpText?: string;
        defaultValue?: string;
        variableName?: string;
      }
    ): Promise<Question | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newQuestion = await templateService.addQuestion(templateId, data);
        // Reload questions for the template
        await loadQuestions(templateId);
        return newQuestion;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add question';
        setError(message);
        console.error('Error adding question:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, loadQuestions]
  );

  const updateQuestion = useCallback(
    async (
      questionId: string,
      updates: Partial<Omit<Question, 'questionId' | 'templateId' | 'createdAt'>>
    ): Promise<Question | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await templateService.updateQuestion(questionId, updates);
        if (updated && selectedTemplate) {
          // Reload questions for the current template
          await loadQuestions(selectedTemplate.templateId);
        }
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update question';
        setError(message);
        console.error('Error updating question:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, selectedTemplate, loadQuestions]
  );

  const deleteQuestion = useCallback(
    async (questionId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const success = await templateService.deleteQuestion(questionId);
        if (success && selectedTemplate) {
          // Reload questions for the current template
          await loadQuestions(selectedTemplate.templateId);
        }
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete question';
        setError(message);
        console.error('Error deleting question:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, selectedTemplate, loadQuestions]
  );

  const reorderQuestions = useCallback(
    async (templateId: string, questionIds: string[]) => {
      setIsLoading(true);
      setError(null);
      try {
        await templateService.reorderQuestions(templateId, questionIds);
        // Reload questions to get new order
        await loadQuestions(templateId);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to reorder questions';
        setError(message);
        console.error('Error reordering questions:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [templateService, loadQuestions]
  );

  // ============================================================================
  // Question Options
  // ============================================================================

  const loadQuestionOptions = useCallback(
    async (questionId: string): Promise<QuestionOption[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const options = await templateService.getQuestionOptions(questionId);
        return options;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load question options';
        setError(message);
        console.error('Error loading question options:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const addQuestionOption = useCallback(
    async (
      questionId: string,
      data: { label: string; value: string }
    ): Promise<QuestionOption | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const newOption = await templateService.addQuestionOption(questionId, data);
        return newOption;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add question option';
        setError(message);
        console.error('Error adding question option:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const updateQuestionOption = useCallback(
    async (
      optionId: string,
      updates: Partial<Omit<QuestionOption, 'optionId' | 'questionId'>>
    ): Promise<QuestionOption | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const updated = await templateService.updateQuestionOption(optionId, updates);
        return updated;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update question option';
        setError(message);
        console.error('Error updating question option:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const deleteQuestionOption = useCallback(
    async (optionId: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const success = await templateService.deleteQuestionOption(optionId);
        return success;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete question option';
        setError(message);
        console.error('Error deleting question option:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  // ============================================================================
  // Project Question Answers
  // ============================================================================

  const loadProjectAnswers = useCallback(
    async (projectId: string): Promise<ProjectQuestion[]> => {
      setIsLoading(true);
      setError(null);
      try {
        const answers = await templateService.getProjectAnswers(projectId);
        return answers;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load project answers';
        setError(message);
        console.error('Error loading project answers:', err);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  const saveProjectAnswer = useCallback(
    async (
      projectId: string,
      questionId: string,
      answer: string | string[]
    ): Promise<ProjectQuestion | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const saved = await templateService.saveProjectAnswer(projectId, questionId, answer);
        return saved;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save answer';
        setError(message);
        console.error('Error saving answer:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  // ============================================================================
  // Utility
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const validateTemplate = useCallback(
    async (templateId: string): Promise<{ valid: boolean; errors: string[] }> => {
      setIsLoading(true);
      setError(null);
      try {
        const validation = await templateService.validateTemplate(templateId);
        return validation;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Validation failed';
        setError(message);
        console.error('Error validating template:', err);
        return { valid: false, errors: [message] };
      } finally {
        setIsLoading(false);
      }
    },
    [templateService]
  );

  // Load templates on mount and seed data if needed
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Dynamically import the seed function
        const { seedTemplateData } = await import('../../data/procurement/seedTemplateData');
        await seedTemplateData();

        // Load templates after seeding
        setIsLoading(true);
        const allTemplates = await templateService.getTemplates();
        setTemplates(allTemplates);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing templates:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize templates');
        setIsLoading(false);
      }
    };

    initializeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  return {
    // State
    templates,
    selectedTemplate,
    questions,
    isLoading,
    error,

    // Template operations
    loadTemplates,
    loadTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    searchTemplates,
    getTemplatesByType,

    // Question operations
    loadQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,

    // Question options
    loadQuestionOptions,
    addQuestionOption,
    updateQuestionOption,
    deleteQuestionOption,

    // Project question answers
    loadProjectAnswers,
    saveProjectAnswer,

    // Utility
    clearError,
    validateTemplate,
  };
}
