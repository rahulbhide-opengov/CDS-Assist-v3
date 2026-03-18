/**
 * Variable Service
 * Handles variable parsing, resolution, and substitution in document content
 *
 * Supports variables like:
 * - {{project.title}}
 * - {{contract.startDate}}
 * - {{answer.contractValue}}
 */

import type { Document, Project } from '../../types/procurement';
import type { Variable, VariableDefinition } from './ProcurementTypes';
import { documentStorage } from './DocumentStorage';

export class VariableService {
  /**
   * Parse variables from content
   * Extracts all {{variable}} patterns from HTML/text content
   */
  parseVariables(content: string): string[] {
    const variablePattern = /\{\{([^}]+)\}\}/g;
    const variables = new Set<string>();

    let match;
    while ((match = variablePattern.exec(content)) !== null) {
      const varName = match[1].trim();
      variables.add(varName);
    }

    return Array.from(variables);
  }

  /**
   * Resolve all variables for a document based on project data
   * Returns empty object if document or project not found (graceful degradation)
   */
  async resolveVariables(documentId: string): Promise<Record<string, any>> {
    const document = await documentStorage.getDocument(documentId);
    if (!document) {
      // Return empty resolved variables instead of throwing
      console.warn(`Document not found: ${documentId}`);
      return this.getDefaultVariables();
    }

    const project = await documentStorage.getProject(document.projectId);
    if (!project) {
      // Return partial variables with just document data
      console.warn(`Project not found: ${document.projectId}`);
      return this.getDefaultVariables();
    }

    return this.resolveVariablesFromProject(project, document);
  }

  /**
   * Get default variable values when project/document not found
   */
  private getDefaultVariables(): Record<string, any> {
    const now = new Date();
    return {
      'date.today': this.formatDate(now.toISOString()),
      'date.now': this.formatDateTime(now.toISOString()),
      'date.year': now.getFullYear().toString(),
      'date.month': (now.getMonth() + 1).toString().padStart(2, '0'),
      'date.day': now.getDate().toString().padStart(2, '0'),
    };
  }

  /**
   * Resolve variables from project and document data
   */
  resolveVariablesFromProject(project: Project, document: Document): Record<string, any> {
    const resolved: Record<string, any> = {};

    // Project variables
    resolved['project.title'] = project.title;
    resolved['project.id'] = project.projectId;
    resolved['project.status'] = project.status;
    resolved['project.department'] = project.department.name;
    resolved['project.isEmergency'] = project.isEmergency;

    // Project contacts
    resolved['project.contact.name'] = `${project.projectContact.firstName} ${project.projectContact.lastName}`;
    resolved['project.contact.firstName'] = project.projectContact.firstName;
    resolved['project.contact.lastName'] = project.projectContact.lastName;
    resolved['project.contact.email'] = project.projectContact.email;
    resolved['project.contact.phone'] = project.projectContact.phone || '';
    resolved['project.contact.title'] = project.projectContact.title || '';

    // Procurement contact
    resolved['procurement.contact.name'] = `${project.procurementContact.firstName} ${project.procurementContact.lastName}`;
    resolved['procurement.contact.firstName'] = project.procurementContact.firstName;
    resolved['procurement.contact.lastName'] = project.procurementContact.lastName;
    resolved['procurement.contact.email'] = project.procurementContact.email;
    resolved['procurement.contact.phone'] = project.procurementContact.phone || '';
    resolved['procurement.contact.title'] = project.procurementContact.title || '';

    // Timeline variables
    if (project.timeline.releaseDate) {
      resolved['contract.startDate'] = this.formatDate(project.timeline.releaseDate);
      resolved['contract.releaseDate'] = this.formatDate(project.timeline.releaseDate);
    }
    if (project.timeline.responseSubmissionDeadline) {
      resolved['contract.endDate'] = this.formatDate(project.timeline.responseSubmissionDeadline);
      resolved['contract.submissionDeadline'] = this.formatDate(project.timeline.responseSubmissionDeadline);
    }
    if (project.timeline.preProposalDate) {
      resolved['contract.preProposalDate'] = this.formatDate(project.timeline.preProposalDate);
    }
    if (project.timeline.qaSubmissionDeadline) {
      resolved['contract.qaDeadline'] = this.formatDate(project.timeline.qaSubmissionDeadline);
    }

    // Budget variables
    if (project.budget) {
      resolved['contract.value'] = this.formatCurrency(project.budget.amount);
      resolved['contract.amount'] = this.formatCurrency(project.budget.amount);
      resolved['contract.account'] = project.budget.account;
      resolved['contract.budgetDescription'] = project.budget.description || '';
    }

    // Template variables
    resolved['template.name'] = project.template.name;
    resolved['template.type'] = project.template.type;

    // Department variables
    resolved['department.name'] = project.department.name;
    resolved['department.id'] = project.department.departmentId;

    // Categories
    if (project.categories && project.categories.length > 0) {
      resolved['category.primary'] = project.categories[0].name;
      resolved['category.code'] = project.categories[0].code;
      resolved['category.type'] = project.categories[0].type;
    }

    // Setup question answers
    Object.entries(project.setupQuestions || {}).forEach(([key, value]) => {
      resolved[`answer.${key}`] = value;
    });

    // Document-specific variables
    resolved['document.id'] = document.documentId;
    resolved['document.type'] = document.type;
    resolved['document.status'] = document.status;
    resolved['document.createdAt'] = this.formatDate(document.createdAt);
    resolved['document.updatedAt'] = this.formatDate(document.updatedAt);

    // Custom variables from document
    Object.entries(document.variables || {}).forEach(([key, value]) => {
      resolved[key] = value;
    });

    // Current date/time variables
    const now = new Date();
    resolved['date.today'] = this.formatDate(now.toISOString());
    resolved['date.now'] = this.formatDateTime(now.toISOString());
    resolved['date.year'] = now.getFullYear().toString();
    resolved['date.month'] = (now.getMonth() + 1).toString().padStart(2, '0');
    resolved['date.day'] = now.getDate().toString().padStart(2, '0');

    return resolved;
  }

  /**
   * Replace variables in content with resolved values
   */
  replaceVariables(content: string, variables: Record<string, any>): string {
    let result = content;

    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`\\{\\{\\s*${this.escapeRegExp(key)}\\s*\\}\\}`, 'g');
      result = result.replace(pattern, String(value ?? ''));
    });

    return result;
  }

  /**
   * Get available variable definitions for a document
   */
  getAvailableVariableDefinitions(): VariableDefinition[] {
    return [
      // Project variables
      {
        name: 'project.title',
        source: 'project',
        label: 'Project Title',
        description: 'The title of the procurement project',
      },
      {
        name: 'project.department',
        source: 'project',
        label: 'Department',
        description: 'The department managing the project',
      },
      {
        name: 'project.status',
        source: 'project',
        label: 'Project Status',
        description: 'Current status of the project',
      },
      {
        name: 'project.contact.name',
        source: 'project',
        label: 'Project Contact Name',
        description: 'Full name of the project contact',
      },
      {
        name: 'project.contact.email',
        source: 'project',
        label: 'Project Contact Email',
        description: 'Email address of the project contact',
      },
      {
        name: 'project.contact.phone',
        source: 'project',
        label: 'Project Contact Phone',
        description: 'Phone number of the project contact',
      },

      // Procurement contact variables
      {
        name: 'procurement.contact.name',
        source: 'project',
        label: 'Procurement Contact Name',
        description: 'Full name of the procurement contact',
      },
      {
        name: 'procurement.contact.email',
        source: 'project',
        label: 'Procurement Contact Email',
        description: 'Email address of the procurement contact',
      },

      // Contract/Timeline variables
      {
        name: 'contract.startDate',
        source: 'contract',
        label: 'Contract Start Date',
        description: 'Project release/start date',
        format: 'date',
      },
      {
        name: 'contract.endDate',
        source: 'contract',
        label: 'Contract End Date',
        description: 'Submission deadline',
        format: 'date',
      },
      {
        name: 'contract.value',
        source: 'contract',
        label: 'Contract Value',
        description: 'Total contract budget amount',
        format: 'currency',
      },
      {
        name: 'contract.account',
        source: 'contract',
        label: 'Account Number',
        description: 'Budget account number',
      },

      // Department variables
      {
        name: 'department.name',
        source: 'project',
        label: 'Department Name',
        description: 'Name of the department',
      },

      // Template variables
      {
        name: 'template.name',
        source: 'project',
        label: 'Template Name',
        description: 'Name of the template used',
      },
      {
        name: 'template.type',
        source: 'project',
        label: 'Template Type',
        description: 'Type of template (RFP, RFQ, etc.)',
      },

      // Date variables
      {
        name: 'date.today',
        source: 'custom',
        label: 'Today\'s Date',
        description: 'Current date',
        format: 'date',
      },
      {
        name: 'date.year',
        source: 'custom',
        label: 'Current Year',
        description: 'Current year',
      },
    ];
  }

  /**
   * Get variables with resolved values
   * Returns variable definitions with empty values if resolution fails
   * Also includes custom variables from the document
   */
  async getVariablesWithValues(documentId: string): Promise<Variable[]> {
    const definitions = this.getAvailableVariableDefinitions();
    const variables: Variable[] = [];

    try {
      const resolved = await this.resolveVariables(documentId);

      // Add standard variable definitions
      for (const def of definitions) {
        variables.push({
          name: def.name,
          source: def.source,
          label: def.label,
          description: def.description,
          value: resolved[def.name] || '',
        });
      }

      // Add custom variables from the document that aren't in the standard definitions
      const document = await documentStorage.getDocument(documentId);
      if (document?.variables) {
        const standardNames = new Set(definitions.map(d => d.name));
        for (const [key, value] of Object.entries(document.variables)) {
          if (!standardNames.has(key)) {
            variables.push({
              name: key,
              source: 'custom',
              label: this.formatVariableLabel(key),
              description: 'Custom document variable',
              value: String(value || ''),
            });
          }
        }
      }

      // Also scan document sections for any variables that are used but not defined
      // Sections are stored separately in IndexedDB, so we need to fetch them
      const sections = await documentStorage.getSectionsByDocument(documentId);
      if (sections && sections.length > 0) {
        const existingNames = new Set(variables.map(v => v.name));
        for (const section of sections) {
          const usedVars = this.parseVariables(section.content || '');
          for (const varName of usedVars) {
            if (!existingNames.has(varName)) {
              variables.push({
                name: varName,
                source: 'custom',
                label: this.formatVariableLabel(varName),
                description: 'Variable used in document',
                value: resolved[varName] || '',
              });
              existingNames.add(varName);
            }
          }
        }
      }

      return variables;
    } catch (error) {
      // Return definitions without values if resolution fails
      console.warn('Failed to resolve variables:', error);
      return definitions.map(def => ({
        name: def.name,
        source: def.source,
        label: def.label,
        description: def.description,
        value: '',
      }));
    }
  }

  /**
   * Format a variable name into a human-readable label
   */
  private formatVariableLabel(varName: string): string {
    return varName
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  /**
   * Find unresolved variables in content
   */
  findUnresolvedVariables(content: string, resolvedVariables: Record<string, any>): string[] {
    const parsedVars = this.parseVariables(content);
    return parsedVars.filter(varName => !(varName in resolvedVariables));
  }

  /**
   * Validate all variables in document sections
   */
  async validateVariables(documentId: string): Promise<{
    valid: boolean;
    unresolvedVariables: string[];
    resolvedCount: number;
    totalCount: number;
  }> {
    const document = await documentStorage.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const resolved = await this.resolveVariables(documentId);
    const allVariables = new Set<string>();
    const unresolvedVariables = new Set<string>();

    // Check all sections
    for (const section of document.sections) {
      const sectionVars = this.parseVariables(section.content);
      sectionVars.forEach(varName => {
        allVariables.add(varName);
        if (!(varName in resolved)) {
          unresolvedVariables.add(varName);
        }
      });
    }

    return {
      valid: unresolvedVariables.size === 0,
      unresolvedVariables: Array.from(unresolvedVariables),
      resolvedCount: allVariables.size - unresolvedVariables.size,
      totalCount: allVariables.size,
    };
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Format date to readable string
   */
  private formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Format date and time to readable string
   */
  private formatDateTime(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Format currency
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Escape special regex characters
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

// Singleton instance
export const variableService = new VariableService();
