/**
 * Template Service
 * Manages document templates, setup questions, and template-based document generation
 *
 * Features:
 * - CRUD operations for templates
 * - Question management (yes/no, multiple choice, text)
 * - Template search and filtering
 * - Usage tracking
 * - Template validation
 */

import { DocumentStorage } from './DocumentStorage';
import type {
  Template,
  TemplateType,
  Question,
  QuestionType,
  QuestionOption,
  ProjectQuestion,
} from '../../types/procurement';

export class TemplateService {
  private storage: DocumentStorage;
  private cache = new Map<string, Template>();

  constructor() {
    this.storage = new DocumentStorage();
  }

  /**
   * Initialize the service
   */
  async initialize(): Promise<void> {
    await this.storage.initialize();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  // ============================================================================
  // Template CRUD Operations
  // ============================================================================

  /**
   * Get all templates
   */
  async getTemplates(): Promise<Template[]> {
    try {
      const templates = await this.storage.getTemplates();
      return templates;
    } catch (error) {
      console.error('Error fetching templates:', error);
      return [];
    }
  }

  /**
   * Get templates by type
   */
  async getTemplatesByType(type: TemplateType): Promise<Template[]> {
    try {
      const templates = await this.storage.getTemplatesByType(type);
      return templates;
    } catch (error) {
      console.error('Error fetching templates by type:', error);
      return [];
    }
  }

  /**
   * Get single template by ID
   */
  async getTemplate(templateId: string): Promise<Template | null> {
    try {
      // Check cache first
      if (this.cache.has(templateId)) {
        return this.cache.get(templateId)!;
      }

      const template = await this.storage.getTemplate(templateId);
      if (template) {
        this.cache.set(templateId, template);
      }
      return template;
    } catch (error) {
      console.error('Error fetching template:', error);
      return null;
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(data: {
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
  }): Promise<Template> {
    const templateId = this.generateId();
    const now = new Date().toISOString();

    const template: Template = {
      templateId,
      name: data.name,
      description: data.description,
      type: data.type,
      sections: data.sections || [],
      variables: data.variables || [],
      questions: [],
      usageCount: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await this.storage.saveTemplate(template);
    this.cache.set(templateId, template);

    return template;
  }

  /**
   * Update an existing template
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<Omit<Template, 'templateId' | 'createdAt'>>
  ): Promise<Template | null> {
    try {
      const existing = await this.getTemplate(templateId);
      if (!existing) {
        throw new Error('Template not found');
      }

      const updated: Template = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.saveTemplate(updated);
      this.cache.set(templateId, updated);

      return updated;
    } catch (error) {
      console.error('Error updating template:', error);
      return null;
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      await this.storage.deleteTemplate(templateId);
      this.cache.delete(templateId);
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      return false;
    }
  }

  /**
   * Duplicate a template
   */
  async duplicateTemplate(templateId: string, newName?: string): Promise<Template | null> {
    try {
      const original = await this.getTemplate(templateId);
      if (!original) {
        return null;
      }

      const duplicate = await this.createTemplate({
        name: newName || `${original.name} (Copy)`,
        description: original.description,
        type: original.type,
        sections: original.sections.map((s) => ({ ...s })),
        variables: [...original.variables],
      });

      // Copy questions
      const questions = await this.getTemplateQuestions(templateId);
      for (const question of questions) {
        await this.addQuestion(duplicate.templateId, {
          text: question.text,
          type: question.type,
          required: question.required,
          helpText: question.helpText,
          defaultValue: question.defaultValue,
          variableName: question.variableName,
        });

        // Copy options if multiple choice
        if (question.type === 'multiple_choice' || question.type === 'checkbox') {
          const options = await this.getQuestionOptions(question.questionId);
          for (const option of options) {
            await this.addQuestionOption(question.questionId, {
              label: option.label,
              value: option.value,
            });
          }
        }
      }

      return duplicate;
    } catch (error) {
      console.error('Error duplicating template:', error);
      return null;
    }
  }

  /**
   * Increment template usage count
   */
  async incrementUsageCount(templateId: string): Promise<void> {
    try {
      const template = await this.getTemplate(templateId);
      if (template) {
        await this.updateTemplate(templateId, {
          usageCount: template.usageCount + 1,
        });
      }
    } catch (error) {
      console.error('Error incrementing usage count:', error);
    }
  }

  // ============================================================================
  // Question Management
  // ============================================================================

  /**
   * Get all questions for a template
   */
  async getTemplateQuestions(templateId: string): Promise<Question[]> {
    try {
      return await this.storage.getQuestionsByTemplate(templateId);
    } catch (error) {
      console.error('Error fetching template questions:', error);
      return [];
    }
  }

  /**
   * Add a question to a template
   */
  async addQuestion(
    templateId: string,
    data: {
      text: string;
      type: QuestionType;
      required?: boolean;
      helpText?: string;
      defaultValue?: string;
      variableName?: string;
    }
  ): Promise<Question> {
    const questionId = this.generateId();
    const now = new Date().toISOString();

    const question: Question = {
      questionId,
      templateId,
      text: data.text,
      type: data.type,
      required: data.required ?? false,
      helpText: data.helpText,
      defaultValue: data.defaultValue,
      variableName: data.variableName,
      order: 0, // Will be set by storage
      createdAt: now,
    };

    await this.storage.saveQuestion(question);
    return question;
  }

  /**
   * Update a question
   */
  async updateQuestion(
    questionId: string,
    updates: Partial<Omit<Question, 'questionId' | 'templateId' | 'createdAt'>>
  ): Promise<Question | null> {
    try {
      const existing = await this.storage.getQuestion(questionId);
      if (!existing) {
        throw new Error('Question not found');
      }

      const updated: Question = {
        ...existing,
        ...updates,
      };

      await this.storage.saveQuestion(updated);
      return updated;
    } catch (error) {
      console.error('Error updating question:', error);
      return null;
    }
  }

  /**
   * Delete a question
   */
  async deleteQuestion(questionId: string): Promise<boolean> {
    try {
      // Delete all options first
      const options = await this.getQuestionOptions(questionId);
      for (const option of options) {
        await this.storage.deleteQuestionOption(option.optionId);
      }

      await this.storage.deleteQuestion(questionId);
      return true;
    } catch (error) {
      console.error('Error deleting question:', error);
      return false;
    }
  }

  /**
   * Reorder questions
   */
  async reorderQuestions(templateId: string, questionIds: string[]): Promise<void> {
    try {
      const questions = await this.getTemplateQuestions(templateId);
      for (let i = 0; i < questionIds.length; i++) {
        const question = questions.find((q) => q.questionId === questionIds[i]);
        if (question) {
          await this.updateQuestion(question.questionId, { order: i });
        }
      }
    } catch (error) {
      console.error('Error reordering questions:', error);
    }
  }

  // ============================================================================
  // Question Options (for multiple choice, checkbox)
  // ============================================================================

  /**
   * Get all options for a question
   */
  async getQuestionOptions(questionId: string): Promise<QuestionOption[]> {
    try {
      return await this.storage.getQuestionOptionsByQuestion(questionId);
    } catch (error) {
      console.error('Error fetching question options:', error);
      return [];
    }
  }

  /**
   * Add an option to a question
   */
  async addQuestionOption(
    questionId: string,
    data: {
      label: string;
      value: string;
    }
  ): Promise<QuestionOption> {
    const optionId = this.generateId();

    const option: QuestionOption = {
      optionId,
      questionId,
      label: data.label,
      value: data.value,
      order: 0, // Will be set by storage
    };

    await this.storage.saveQuestionOption(option);
    return option;
  }

  /**
   * Update a question option
   */
  async updateQuestionOption(
    optionId: string,
    updates: Partial<Omit<QuestionOption, 'optionId' | 'questionId'>>
  ): Promise<QuestionOption | null> {
    try {
      const existing = await this.storage.getQuestionOption(optionId);
      if (!existing) {
        throw new Error('Question option not found');
      }

      const updated: QuestionOption = {
        ...existing,
        ...updates,
      };

      await this.storage.saveQuestionOption(updated);
      return updated;
    } catch (error) {
      console.error('Error updating question option:', error);
      return null;
    }
  }

  /**
   * Delete a question option
   */
  async deleteQuestionOption(optionId: string): Promise<boolean> {
    try {
      await this.storage.deleteQuestionOption(optionId);
      return true;
    } catch (error) {
      console.error('Error deleting question option:', error);
      return false;
    }
  }

  // ============================================================================
  // Project Question Answers
  // ============================================================================

  /**
   * Get all answers for a project
   */
  async getProjectAnswers(projectId: string): Promise<ProjectQuestion[]> {
    try {
      return await this.storage.getProjectQuestionsByProject(projectId);
    } catch (error) {
      console.error('Error fetching project answers:', error);
      return [];
    }
  }

  /**
   * Save an answer to a project question
   */
  async saveProjectAnswer(
    projectId: string,
    questionId: string,
    answer: string | string[]
  ): Promise<ProjectQuestion> {
    const answerId = this.generateId();

    const projectQuestion: ProjectQuestion = {
      answerId,
      projectId,
      questionId,
      answer,
      answeredAt: new Date().toISOString(),
    };

    await this.storage.saveProjectQuestion(projectQuestion);
    return projectQuestion;
  }

  /**
   * Get answer for a specific question in a project
   */
  async getProjectAnswer(projectId: string, questionId: string): Promise<ProjectQuestion | null> {
    try {
      const answers = await this.getProjectAnswers(projectId);
      return answers.find((a) => a.questionId === questionId) || null;
    } catch (error) {
      console.error('Error fetching project answer:', error);
      return null;
    }
  }

  // ============================================================================
  // Search and Filtering
  // ============================================================================

  /**
   * Search templates by name or description
   */
  async searchTemplates(query: string): Promise<Template[]> {
    try {
      const allTemplates = await this.getTemplates();
      const lowerQuery = query.toLowerCase();

      return allTemplates.filter(
        (template) =>
          template.name.toLowerCase().includes(lowerQuery) ||
          template.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching templates:', error);
      return [];
    }
  }

  /**
   * Get most used templates
   */
  async getMostUsedTemplates(limit: number = 5): Promise<Template[]> {
    try {
      const templates = await this.getTemplates();
      return templates.sort((a, b) => b.usageCount - a.usageCount).slice(0, limit);
    } catch (error) {
      console.error('Error fetching most used templates:', error);
      return [];
    }
  }

  /**
   * Get recently updated templates
   */
  async getRecentTemplates(limit: number = 5): Promise<Template[]> {
    try {
      const templates = await this.getTemplates();
      return templates
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching recent templates:', error);
      return [];
    }
  }

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Validate template configuration
   */
  async validateTemplate(templateId: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];

    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        errors.push('Template not found');
        return { valid: false, errors };
      }

      // Check for empty name
      if (!template.name || template.name.trim().length === 0) {
        errors.push('Template name is required');
      }

      // Check for sections
      if (template.sections.length === 0) {
        errors.push('Template must have at least one section');
      }

      // Check questions
      const questions = await this.getTemplateQuestions(templateId);
      for (const question of questions) {
        if (!question.text || question.text.trim().length === 0) {
          errors.push(`Question ${question.questionId} is missing text`);
        }

        // Check options for multiple choice questions
        if (question.type === 'multiple_choice' || question.type === 'checkbox') {
          const options = await this.getQuestionOptions(question.questionId);
          if (options.length === 0) {
            errors.push(`Question "${question.text}" must have at least one option`);
          }
        }
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      console.error('Error validating template:', error);
      return { valid: false, errors: ['Validation error occurred'] };
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let templateServiceInstance: TemplateService | null = null;

export function getTemplateService(): TemplateService {
  if (!templateServiceInstance) {
    templateServiceInstance = new TemplateService();
    templateServiceInstance.initialize();
  }
  return templateServiceInstance;
}
