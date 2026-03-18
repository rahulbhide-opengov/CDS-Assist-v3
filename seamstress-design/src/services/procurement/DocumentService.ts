/**
 * Document Service
 * Core business logic for procurement document management
 *
 * Provides CRUD operations, document creation from templates,
 * section management, and orchestrates other services.
 */

import { documentStorage } from './DocumentStorage';
import type {
  Document,
  DocumentSection,
  DocumentStatus,
  Template,
  Project,
  Revision,
} from '../../types/procurement';
import type {
  AuditLog,
  Variable,
  ValidationReport,
  ValidationResult,
} from './ProcurementTypes';

export class DocumentService {
  private cache = new Map<string, Document>();

  /**
   * Generate a UUID
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  // ============================================================================
  // Document CRUD
  // ============================================================================

  /**
   * Create a new document from a template
   */
  async createDocumentFromTemplate(
    projectId: string,
    templateId: string,
    variables: Record<string, any> = {}
  ): Promise<Document> {
    const template = await documentStorage.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const documentId = this.generateId();
    const now = new Date().toISOString();

    // Create default sections from template
    const sections: DocumentSection[] = (template.defaultSections || []).map((sectionTitle, index) => ({
      sectionId: this.generateId(),
      title: sectionTitle,
      type: 'text' as const,
      content: '', // Empty content, to be filled by user
      order: index,
    }));

    const document: Document = {
      documentId,
      projectId,
      type: 'Scope', // Default type
      status: 'Draft',
      sections,
      variables,
      attachments: [],
      internalAttachments: [],
      revisionHistory: [],
      approvals: [],
      createdAt: now,
      updatedAt: now,
    };

    await documentStorage.saveDocument(document);
    this.cache.set(documentId, document);

    // Create initial version
    await this.createVersion(documentId, 'Document created from template');

    // Log audit event
    await this.logAudit({
      logId: this.generateId(),
      entityType: 'document',
      entityId: documentId,
      userId: 'current-user', // TODO: Get from auth context
      userName: 'Current User',
      action: 'created',
      timestamp: now,
      metadata: { templateId, projectId },
    });

    return document;
  }

  /**
   * Get document by ID (with caching)
   */
  async getDocument(documentId: string): Promise<Document | null> {
    if (this.cache.has(documentId)) {
      return this.cache.get(documentId)!;
    }

    const document = await documentStorage.getDocument(documentId);
    if (document) {
      this.cache.set(documentId, document);
    }
    return document;
  }

  /**
   * Get or create a document with a specific ID
   * This is useful when working with mock data where document IDs are pre-assigned
   */
  async getOrCreateDocument(
    documentId: string,
    projectId: string,
    options: {
      type?: Document['type'];
      title?: string;
    } = {}
  ): Promise<Document> {
    // Try to get existing document first
    const existing = await this.getDocument(documentId);
    if (existing) {
      return existing;
    }

    // Create new document with the specified ID
    // Note: Scope of Work is intentionally excluded so the AI assistant can suggest adding it
    const now = new Date().toISOString();
    const document: Document = {
      documentId,
      projectId,
      type: options.type || 'Scope',
      title: options.title || 'RFP Document',
      status: 'Draft',
      sections: [
        {
          sectionId: this.generateId(),
          title: 'Introduction',
          type: 'text',
          content: '<p>The City of Atlanta Department of Public Works is seeking qualified contractors to provide comprehensive fleet maintenance services for the city\'s vehicle fleet. This Request for Proposal (RFP) outlines the requirements and evaluation criteria for this procurement.</p>',
          order: 0,
        },
        {
          sectionId: this.generateId(),
          title: 'Terms and Conditions',
          type: 'text',
          content: '<p>The selected contractor shall comply with all applicable federal, state, and local laws and regulations. The initial contract term shall be three (3) years with two (2) optional one-year renewal periods.</p>',
          order: 1,
        },
        {
          sectionId: this.generateId(),
          title: 'Submission Requirements',
          type: 'text',
          content: '<p>Proposals must be submitted electronically through the city\'s procurement portal by the deadline specified in the project timeline. Late submissions will not be accepted.</p>',
          order: 2,
        },
      ],
      variables: {},
      attachments: [],
      internalAttachments: [],
      revisionHistory: [],
      approvals: [],
      createdAt: now,
      updatedAt: now,
    };

    await documentStorage.saveDocument(document);
    this.cache.set(documentId, document);

    // Create initial version
    await this.createVersion(documentId, 'Document created');

    // Log audit event
    await this.logAudit({
      logId: this.generateId(),
      entityType: 'document',
      entityId: documentId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'created',
      timestamp: now,
      metadata: { projectId },
    });

    return document;
  }

  /**
   * Get all documents for a project
   */
  async getDocumentsByProject(projectId: string): Promise<Document[]> {
    return await documentStorage.getDocumentsByProject(projectId);
  }

  /**
   * Update document
   */
  async updateDocument(
    documentId: string,
    updates: Partial<Document>,
    createVersion: boolean = false
  ): Promise<Document> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const updatedDocument = {
      ...document,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await documentStorage.saveDocument(updatedDocument);
    this.cache.set(documentId, updatedDocument);

    // Create version if requested
    if (createVersion) {
      await this.createVersion(documentId, 'Document updated');
    }

    // Log audit event
    await this.logAudit({
      logId: this.generateId(),
      entityType: 'document',
      entityId: documentId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'updated',
      timestamp: updatedDocument.updatedAt,
      changes: Object.keys(updates).map((field) => ({
        field,
        oldValue: (document as any)[field],
        newValue: (updates as any)[field],
      })),
    });

    return updatedDocument;
  }

  /**
   * Delete document and all related data
   */
  async deleteDocument(documentId: string): Promise<void> {
    await documentStorage.deleteDocument(documentId);
    this.cache.delete(documentId);

    // Log audit event
    await this.logAudit({
      logId: this.generateId(),
      entityType: 'document',
      entityId: documentId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'deleted',
      timestamp: new Date().toISOString(),
    });
  }

  // ============================================================================
  // Section Management
  // ============================================================================

  /**
   * Add a section to a document
   */
  async addSection(
    documentId: string,
    section: Omit<DocumentSection, 'sectionId'>,
    position?: number
  ): Promise<DocumentSection> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const newSection: DocumentSection = {
      ...section,
      sectionId: this.generateId(),
    };

    // Insert at position or append
    const sections = [...document.sections];
    if (position !== undefined) {
      sections.splice(position, 0, newSection);
      // Reorder sections
      sections.forEach((s, idx) => {
        s.order = idx;
      });
    } else {
      newSection.order = sections.length;
      sections.push(newSection);
    }

    await this.updateDocument(documentId, { sections });
    await documentStorage.saveSection(newSection);

    return newSection;
  }

  /**
   * Update a section
   */
  async updateSection(
    documentId: string,
    sectionId: string,
    updates: Partial<DocumentSection>
  ): Promise<DocumentSection> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const sectionIndex = document.sections.findIndex((s) => s.sectionId === sectionId);
    if (sectionIndex === -1) {
      throw new Error(`Section not found: ${sectionId}`);
    }

    const updatedSection = {
      ...document.sections[sectionIndex],
      ...updates,
    };

    document.sections[sectionIndex] = updatedSection;
    await this.updateDocument(documentId, { sections: document.sections });
    await documentStorage.saveSection(updatedSection);

    return updatedSection;
  }

  /**
   * Delete a section
   */
  async deleteSection(documentId: string, sectionId: string): Promise<void> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const sections = document.sections.filter((s) => s.sectionId !== sectionId);
    // Reorder remaining sections
    sections.forEach((s, idx) => {
      s.order = idx;
    });

    await this.updateDocument(documentId, { sections });
    await documentStorage.deleteSection(sectionId);
  }

  /**
   * Reorder sections
   */
  async reorderSections(
    documentId: string,
    sectionIds: string[]
  ): Promise<DocumentSection[]> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    // Create a map of sections by ID
    const sectionMap = new Map(document.sections.map((s) => [s.sectionId, s]));

    // Reorder based on provided order
    const reorderedSections = sectionIds
      .map((id) => sectionMap.get(id))
      .filter((s): s is DocumentSection => s !== undefined)
      .map((section, index) => ({
        ...section,
        order: index,
      }));

    await this.updateDocument(documentId, { sections: reorderedSections });

    // Update each section in storage
    for (const section of reorderedSections) {
      await documentStorage.saveSection(section);
    }

    return reorderedSections;
  }

  // ============================================================================
  // Version Management
  // ============================================================================

  /**
   * Create a new version of the document
   */
  async createVersion(documentId: string, changes: string): Promise<Revision> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const versions = await documentStorage.getVersionHistory(documentId);
    const version = versions.length + 1;

    const revision: Revision = {
      revisionId: this.generateId(),
      version,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user', // TODO: Get from auth context
      changes,
      documentSnapshot: JSON.stringify(document),
    };

    await documentStorage.saveVersion(revision);

    return revision;
  }

  /**
   * Get version history for a document
   */
  async getVersionHistory(documentId: string): Promise<Revision[]> {
    return await documentStorage.getVersionHistory(documentId);
  }

  /**
   * Restore a previous version
   */
  async restoreVersion(documentId: string, versionId: string): Promise<Document> {
    const versions = await documentStorage.getVersionHistory(documentId);
    const version = versions.find((v) => v.revisionId === versionId);

    if (!version || !version.documentSnapshot) {
      throw new Error(`Version not found: ${versionId}`);
    }

    const snapshotDocument = JSON.parse(version.documentSnapshot) as Document;

    // Update document with snapshot data
    const restoredDocument = {
      ...snapshotDocument,
      updatedAt: new Date().toISOString(),
    };

    await documentStorage.saveDocument(restoredDocument);
    this.cache.set(documentId, restoredDocument);

    // Create new version marking the restore
    await this.createVersion(documentId, `Restored from version ${version.version}`);

    // Log audit event
    await this.logAudit({
      logId: this.generateId(),
      entityType: 'document',
      entityId: documentId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'restored',
      timestamp: restoredDocument.updatedAt,
      metadata: { restoredFromVersion: version.version },
    });

    return restoredDocument;
  }

  // ============================================================================
  // Variable Management
  // ============================================================================

  /**
   * Update variables in a document
   */
  async updateVariables(
    documentId: string,
    variables: Record<string, any>
  ): Promise<Document> {
    return await this.updateDocument(documentId, { variables });
  }

  /**
   * Get available variables for a document (from project and template)
   */
  async getAvailableVariables(documentId: string): Promise<Variable[]> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const project = await documentStorage.getProject(document.projectId);
    if (!project) {
      return [];
    }

    // Build variables from project data
    const variables: Variable[] = [
      {
        name: 'project.title',
        source: 'project',
        value: project.title,
        label: 'Project Title',
      },
      {
        name: 'project.department',
        source: 'project',
        value: project.department.name,
        label: 'Department',
      },
      {
        name: 'project.contact.name',
        source: 'project',
        value: `${project.projectContact.firstName} ${project.projectContact.lastName}`,
        label: 'Project Contact Name',
      },
      {
        name: 'project.contact.email',
        source: 'project',
        value: project.projectContact.email,
        label: 'Project Contact Email',
      },
    ];

    // Add contract/timeline variables if they exist
    if (project.timeline.releaseDate) {
      variables.push({
        name: 'contract.startDate',
        source: 'contract',
        value: project.timeline.releaseDate,
        label: 'Contract Start Date',
      });
    }

    // Add custom variables from document
    Object.entries(document.variables).forEach(([key, value]) => {
      variables.push({
        name: key,
        source: 'custom',
        value,
        label: key.replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      });
    });

    return variables;
  }

  // ============================================================================
  // Validation
  // ============================================================================

  /**
   * Validate a document against rules
   */
  async validateDocument(documentId: string): Promise<ValidationReport> {
    const document = await this.getDocument(documentId);
    if (!document) {
      throw new Error(`Document not found: ${documentId}`);
    }

    const results: ValidationResult[] = [];

    // Rule 1: Document must have at least one section
    results.push({
      ruleId: 'sections-required',
      ruleName: 'Sections Required',
      severity: 'error',
      passed: document.sections.length > 0,
      message:
        document.sections.length > 0
          ? 'Document has sections'
          : 'Document must have at least one section',
    });

    // Rule 2: All sections must have content
    const emptySections = document.sections.filter((s) => !s.content || s.content.trim() === '');
    results.push({
      ruleId: 'sections-content',
      ruleName: 'Section Content',
      severity: 'warning',
      passed: emptySections.length === 0,
      message:
        emptySections.length === 0
          ? 'All sections have content'
          : `${emptySections.length} section(s) are empty`,
    });

    // Rule 3: All variables should be resolved (basic check)
    const unresolvedVariables = this.findUnresolvedVariables(document);
    results.push({
      ruleId: 'variables-resolved',
      ruleName: 'Variables Resolved',
      severity: 'error',
      passed: unresolvedVariables.length === 0,
      message:
        unresolvedVariables.length === 0
          ? 'All variables are resolved'
          : `${unresolvedVariables.length} unresolved variable(s)`,
    });

    // Rule 4: Document status check
    results.push({
      ruleId: 'document-status',
      ruleName: 'Document Status',
      severity: 'info',
      passed: true,
      message: `Document status: ${document.status}`,
    });

    // Calculate completion percentage
    const passedRules = results.filter((r) => r.passed && r.severity !== 'info').length;
    const totalRules = results.filter((r) => r.severity !== 'info').length;
    const completionPercentage = totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 0;

    // Determine overall status
    const hasErrors = results.some((r) => !r.passed && r.severity === 'error');
    const hasWarnings = results.some((r) => !r.passed && r.severity === 'warning');
    const overallStatus = hasErrors ? 'invalid' : hasWarnings ? 'warnings' : 'valid';

    return {
      documentId,
      overallStatus,
      results,
      completionPercentage,
      validatedAt: new Date().toISOString(),
    };
  }

  /**
   * Find unresolved variables in document content
   */
  private findUnresolvedVariables(document: Document): string[] {
    const variablePattern = /\{\{([^}]+)\}\}/g;
    const unresolvedVars = new Set<string>();

    // Check each section's content
    for (const section of document.sections) {
      const matches = section.content.matchAll(variablePattern);
      for (const match of matches) {
        const varName = match[1].trim();
        // Check if variable is defined
        if (!document.variables[varName]) {
          unresolvedVars.add(varName);
        }
      }
    }

    return Array.from(unresolvedVars);
  }

  // ============================================================================
  // Audit Logging
  // ============================================================================

  /**
   * Log an audit event
   */
  private async logAudit(log: AuditLog): Promise<void> {
    await documentStorage.saveAuditLog(log);
  }

  /**
   * Get audit logs for a document
   */
  async getAuditLogs(documentId: string): Promise<AuditLog[]> {
    return await documentStorage.getAuditLogs(documentId);
  }

  // ============================================================================
  // Status Management
  // ============================================================================

  /**
   * Update document status
   */
  async updateStatus(documentId: string, status: DocumentStatus): Promise<Document> {
    const document = await this.updateDocument(documentId, { status }, true);

    // Log audit event
    await this.logAudit({
      logId: this.generateId(),
      entityType: 'document',
      entityId: documentId,
      userId: 'current-user',
      userName: 'Current User',
      action: 'updated',
      timestamp: new Date().toISOString(),
      changes: [
        {
          field: 'status',
          oldValue: document.status,
          newValue: status,
        },
      ],
    });

    return document;
  }

  // ============================================================================
  // Cache Management
  // ============================================================================

  /**
   * Clear the document cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove a specific document from cache
   */
  removeCachedDocument(documentId: string): void {
    this.cache.delete(documentId);
  }
}

// Singleton instance with lazy loading factory pattern
let documentServiceInstance: DocumentService | null = null;

export function getDocumentService(): DocumentService {
  if (!documentServiceInstance) {
    documentServiceInstance = new DocumentService();
  }
  return documentServiceInstance;
}

// Legacy direct export for backward compatibility
export const documentService = getDocumentService();
