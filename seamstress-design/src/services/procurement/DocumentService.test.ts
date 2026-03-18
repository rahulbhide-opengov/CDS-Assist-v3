import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DocumentService } from './DocumentService';
import { documentStorage } from './DocumentStorage';
import type { Document, DocumentSection, Template, Project, Revision } from '../../types/procurement';
import type { AuditLog, ValidationReport } from './ProcurementTypes';

// Mock the DocumentStorage
vi.mock('./DocumentStorage');

describe('DocumentService', () => {
  let service: DocumentService;

  // Helper to create mock documents
  const createMockDocument = (overrides: Partial<Document> = {}): Document => ({
    documentId: 'doc-123',
    projectId: 'proj-123',
    type: 'Scope',
    status: 'Draft',
    sections: [],
    variables: {},
    attachments: [],
    internalAttachments: [],
    revisionHistory: [],
    approvals: [],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  });

  // Helper to create mock template
  const createMockTemplate = (overrides: Partial<Template> = {}): Template => ({
    templateId: 'template-123',
    name: 'Test Template',
    type: 'Solicitation',
    description: 'Test description',
    sections: [],
    variables: [],
    questions: [],
    usageCount: 0,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  });

  // Helper to create mock project
  const createMockProject = (overrides: Partial<Project> = {}): Project => ({
    projectId: 'proj-123',
    title: 'Test Project',
    departmentId: 'dept-123',
    department: { departmentId: 'dept-123', name: 'Test Department' },
    procurementContactId: 'contact-1',
    procurementContact: {
      contactId: 'contact-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    projectContactId: 'contact-2',
    projectContact: {
      contactId: 'contact-2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
    },
    status: 'Draft',
    templateId: 'template-123',
    template: createMockTemplate(),
    setupQuestions: {},
    timeline: {},
    categories: [],
    isEmergency: false,
    requests: [],
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastUpdate: '2024-01-01T00:00:00.000Z',
    statusHistory: [],
    lifecycle: [],
    documents: [],
    followers: [],
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DocumentService();

    // Setup default mock implementations
    vi.mocked(documentStorage.saveDocument).mockResolvedValue(undefined);
    vi.mocked(documentStorage.getDocument).mockResolvedValue(null);
    vi.mocked(documentStorage.getDocumentsByProject).mockResolvedValue([]);
    vi.mocked(documentStorage.deleteDocument).mockResolvedValue(undefined);
    vi.mocked(documentStorage.getTemplate).mockResolvedValue(null);
    vi.mocked(documentStorage.getProject).mockResolvedValue(null);
    vi.mocked(documentStorage.saveSection).mockResolvedValue(undefined);
    vi.mocked(documentStorage.deleteSection).mockResolvedValue(undefined);
    vi.mocked(documentStorage.saveVersion).mockResolvedValue(undefined);
    vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([]);
    vi.mocked(documentStorage.saveAuditLog).mockResolvedValue(undefined);
    vi.mocked(documentStorage.getAuditLogs).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Document CRUD Operations', () => {
    describe('createDocumentFromTemplate', () => {
      it('should create a document from a template', async () => {
        const mockTemplate = createMockTemplate({
          defaultSections: ['Introduction', 'Scope of Work', 'Terms'],
        });
        vi.mocked(documentStorage.getTemplate).mockResolvedValue(mockTemplate);

        const doc = await service.createDocumentFromTemplate('proj-123', 'template-123', { customVar: 'value' });

        expect(doc).toMatchObject({
          projectId: 'proj-123',
          type: 'Scope',
          status: 'Draft',
          variables: { customVar: 'value' },
        });
        expect(doc.documentId).toBeDefined();
        expect(doc.sections).toHaveLength(3);
        expect(doc.sections[0].title).toBe('Introduction');
        expect(doc.sections[1].title).toBe('Scope of Work');
        expect(doc.sections[2].title).toBe('Terms');
        expect(documentStorage.saveDocument).toHaveBeenCalledWith(expect.objectContaining({
          projectId: 'proj-123',
        }));
      });

      it('should throw error if template not found', async () => {
        vi.mocked(documentStorage.getTemplate).mockResolvedValue(null);

        await expect(
          service.createDocumentFromTemplate('proj-123', 'nonexistent-template')
        ).rejects.toThrow('Template not found: nonexistent-template');
      });

      it('should create initial version after document creation', async () => {
        const mockTemplate = createMockTemplate();
        vi.mocked(documentStorage.getTemplate).mockResolvedValue(mockTemplate);

        await service.createDocumentFromTemplate('proj-123', 'template-123');

        expect(documentStorage.saveVersion).toHaveBeenCalledWith(
          expect.objectContaining({
            changes: 'Document created from template',
            version: 1,
          })
        );
      });

      it('should log audit event for document creation', async () => {
        const mockTemplate = createMockTemplate();
        vi.mocked(documentStorage.getTemplate).mockResolvedValue(mockTemplate);

        await service.createDocumentFromTemplate('proj-123', 'template-123');

        expect(documentStorage.saveAuditLog).toHaveBeenCalledWith(
          expect.objectContaining({
            entityType: 'document',
            action: 'created',
            metadata: { templateId: 'template-123', projectId: 'proj-123' },
          })
        );
      });
    });

    describe('getDocument', () => {
      it('should retrieve a document from storage', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const doc = await service.getDocument('doc-123');

        expect(doc).toEqual(mockDoc);
        expect(documentStorage.getDocument).toHaveBeenCalledWith('doc-123');
      });

      it('should return null for non-existent document', async () => {
        vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

        const doc = await service.getDocument('nonexistent');

        expect(doc).toBeNull();
      });

      it('should cache retrieved documents', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        // First call
        await service.getDocument('doc-123');
        // Second call should use cache
        await service.getDocument('doc-123');

        // Storage should only be called once
        expect(documentStorage.getDocument).toHaveBeenCalledTimes(1);
      });
    });

    describe('getDocumentsByProject', () => {
      it('should retrieve all documents for a project', async () => {
        const mockDocs = [
          createMockDocument({ documentId: 'doc-1' }),
          createMockDocument({ documentId: 'doc-2' }),
        ];
        vi.mocked(documentStorage.getDocumentsByProject).mockResolvedValue(mockDocs);

        const docs = await service.getDocumentsByProject('proj-123');

        expect(docs).toHaveLength(2);
        expect(documentStorage.getDocumentsByProject).toHaveBeenCalledWith('proj-123');
      });
    });

    describe('updateDocument', () => {
      it('should update document and save to storage', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const updated = await service.updateDocument('doc-123', { status: 'Review' });

        expect(updated.status).toBe('Review');
        expect(documentStorage.saveDocument).toHaveBeenCalledWith(
          expect.objectContaining({ status: 'Review' })
        );
      });

      it('should throw error if document not found', async () => {
        vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

        await expect(
          service.updateDocument('nonexistent', { status: 'Review' })
        ).rejects.toThrow('Document not found: nonexistent');
      });

      it('should create version when requested', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([]);

        await service.updateDocument('doc-123', { status: 'Review' }, true);

        expect(documentStorage.saveVersion).toHaveBeenCalled();
      });

      it('should log audit event for update', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        await service.updateDocument('doc-123', { status: 'Review' });

        expect(documentStorage.saveAuditLog).toHaveBeenCalledWith(
          expect.objectContaining({
            entityType: 'document',
            action: 'updated',
            changes: expect.arrayContaining([
              expect.objectContaining({
                field: 'status',
                oldValue: 'Draft',
                newValue: 'Review',
              }),
            ]),
          })
        );
      });

      it('should update timestamp on update', async () => {
        const mockDoc = createMockDocument({
          updatedAt: '2024-01-01T00:00:00.000Z',
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const updated = await service.updateDocument('doc-123', { status: 'Review' });

        expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
          new Date('2024-01-01T00:00:00.000Z').getTime()
        );
      });
    });

    describe('deleteDocument', () => {
      it('should delete document and clear cache', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        // First, cache the document
        await service.getDocument('doc-123');

        // Delete it
        await service.deleteDocument('doc-123');

        expect(documentStorage.deleteDocument).toHaveBeenCalledWith('doc-123');
      });

      it('should log audit event for deletion', async () => {
        await service.deleteDocument('doc-123');

        expect(documentStorage.saveAuditLog).toHaveBeenCalledWith(
          expect.objectContaining({
            entityType: 'document',
            entityId: 'doc-123',
            action: 'deleted',
          })
        );
      });
    });
  });

  describe('Section Management', () => {
    describe('addSection', () => {
      it('should add a section to a document', async () => {
        const mockDoc = createMockDocument({ sections: [] });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const section = await service.addSection('doc-123', {
          title: 'New Section',
          type: 'text',
          content: '<p>Content</p>',
          order: 0,
        });

        expect(section).toMatchObject({
          title: 'New Section',
          type: 'text',
          content: '<p>Content</p>',
          order: 0,
        });
        expect(section.sectionId).toBeDefined();
        expect(documentStorage.saveSection).toHaveBeenCalled();
      });

      it('should insert section at specific position', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Section 1', type: 'text', content: '', order: 0 },
            { sectionId: 's2', title: 'Section 2', type: 'text', content: '', order: 1 },
          ],
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const section = await service.addSection(
          'doc-123',
          { title: 'Inserted Section', type: 'text', content: '', order: 0 },
          1
        );

        expect(section.title).toBe('Inserted Section');
        // The document should be updated with reordered sections
        expect(documentStorage.saveDocument).toHaveBeenCalled();
      });

      it('should throw error if document not found', async () => {
        vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

        await expect(
          service.addSection('nonexistent', { title: 'Test', type: 'text', content: '', order: 0 })
        ).rejects.toThrow('Document not found: nonexistent');
      });
    });

    describe('updateSection', () => {
      it('should update a section', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Old Title', type: 'text', content: 'Old content', order: 0 },
          ],
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const updated = await service.updateSection('doc-123', 's1', {
          title: 'New Title',
          content: 'New content',
        });

        expect(updated).toMatchObject({
          sectionId: 's1',
          title: 'New Title',
          content: 'New content',
        });
        expect(documentStorage.saveSection).toHaveBeenCalled();
      });

      it('should throw error if section not found', async () => {
        const mockDoc = createMockDocument({ sections: [] });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        await expect(
          service.updateSection('doc-123', 'nonexistent', { title: 'Test' })
        ).rejects.toThrow('Section not found: nonexistent');
      });
    });

    describe('deleteSection', () => {
      it('should delete a section and reorder remaining sections', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Section 1', type: 'text', content: '', order: 0 },
            { sectionId: 's2', title: 'Section 2', type: 'text', content: '', order: 1 },
            { sectionId: 's3', title: 'Section 3', type: 'text', content: '', order: 2 },
          ],
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        await service.deleteSection('doc-123', 's2');

        expect(documentStorage.deleteSection).toHaveBeenCalledWith('s2');
        expect(documentStorage.saveDocument).toHaveBeenCalledWith(
          expect.objectContaining({
            sections: expect.arrayContaining([
              expect.objectContaining({ sectionId: 's1', order: 0 }),
              expect.objectContaining({ sectionId: 's3', order: 1 }),
            ]),
          })
        );
      });
    });

    describe('reorderSections', () => {
      it('should reorder sections based on provided order', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Section 1', type: 'text', content: '', order: 0 },
            { sectionId: 's2', title: 'Section 2', type: 'text', content: '', order: 1 },
            { sectionId: 's3', title: 'Section 3', type: 'text', content: '', order: 2 },
          ],
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const reordered = await service.reorderSections('doc-123', ['s3', 's1', 's2']);

        expect(reordered[0]).toMatchObject({ sectionId: 's3', order: 0 });
        expect(reordered[1]).toMatchObject({ sectionId: 's1', order: 1 });
        expect(reordered[2]).toMatchObject({ sectionId: 's2', order: 2 });
      });
    });
  });

  describe('Version Management', () => {
    describe('createVersion', () => {
      it('should create a new version with snapshot', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([]);

        const version = await service.createVersion('doc-123', 'Test changes');

        expect(version).toMatchObject({
          version: 1,
          changes: 'Test changes',
        });
        expect(version.revisionId).toBeDefined();
        expect(version.documentSnapshot).toBe(JSON.stringify(mockDoc));
        expect(documentStorage.saveVersion).toHaveBeenCalled();
      });

      it('should increment version number', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([
          { revisionId: 'v1', version: 1, createdAt: '', createdBy: '', changes: '' },
          { revisionId: 'v2', version: 2, createdAt: '', createdBy: '', changes: '' },
        ]);

        const version = await service.createVersion('doc-123', 'New changes');

        expect(version.version).toBe(3);
      });
    });

    describe('getVersionHistory', () => {
      it('should return version history for a document', async () => {
        const mockVersions: Revision[] = [
          { revisionId: 'v1', version: 1, createdAt: '2024-01-01', createdBy: 'user', changes: 'Initial' },
          { revisionId: 'v2', version: 2, createdAt: '2024-01-02', createdBy: 'user', changes: 'Update' },
        ];
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue(mockVersions);

        const history = await service.getVersionHistory('doc-123');

        expect(history).toEqual(mockVersions);
      });
    });

    describe('restoreVersion', () => {
      it('should restore document from a version snapshot', async () => {
        const oldDoc = createMockDocument({ status: 'Draft' });
        const mockVersions: Revision[] = [
          {
            revisionId: 'v1',
            version: 1,
            createdAt: '2024-01-01',
            createdBy: 'user',
            changes: 'Initial',
            documentSnapshot: JSON.stringify(oldDoc),
          },
        ];
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue(mockVersions);

        const restored = await service.restoreVersion('doc-123', 'v1');

        expect(restored.status).toBe('Draft');
        expect(documentStorage.saveDocument).toHaveBeenCalled();
      });

      it('should throw error if version not found', async () => {
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([]);

        await expect(
          service.restoreVersion('doc-123', 'nonexistent')
        ).rejects.toThrow('Version not found: nonexistent');
      });

      it('should log audit event for restore', async () => {
        const oldDoc = createMockDocument();
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([
          {
            revisionId: 'v1',
            version: 1,
            createdAt: '2024-01-01',
            createdBy: 'user',
            changes: 'Initial',
            documentSnapshot: JSON.stringify(oldDoc),
          },
        ]);

        await service.restoreVersion('doc-123', 'v1');

        expect(documentStorage.saveAuditLog).toHaveBeenCalledWith(
          expect.objectContaining({
            action: 'restored',
            metadata: { restoredFromVersion: 1 },
          })
        );
      });
    });
  });

  describe('Variable Management', () => {
    describe('updateVariables', () => {
      it('should update document variables', async () => {
        const mockDoc = createMockDocument({ variables: { oldVar: 'old' } });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const updated = await service.updateVariables('doc-123', { newVar: 'new' });

        expect(updated.variables).toEqual({ newVar: 'new' });
      });
    });

    describe('getAvailableVariables', () => {
      it('should return variables from project data', async () => {
        const mockDoc = createMockDocument();
        const mockProject = createMockProject({
          timeline: { releaseDate: '2024-06-01' },
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

        const variables = await service.getAvailableVariables('doc-123');

        expect(variables).toContainEqual(
          expect.objectContaining({
            name: 'project.title',
            source: 'project',
            value: 'Test Project',
          })
        );
        expect(variables).toContainEqual(
          expect.objectContaining({
            name: 'project.department',
            source: 'project',
            value: 'Test Department',
          })
        );
        expect(variables).toContainEqual(
          expect.objectContaining({
            name: 'contract.startDate',
            source: 'contract',
            value: '2024-06-01',
          })
        );
      });

      it('should include custom variables from document', async () => {
        const mockDoc = createMockDocument({
          variables: { customField: 'Custom Value' },
        });
        const mockProject = createMockProject();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

        const variables = await service.getAvailableVariables('doc-123');

        expect(variables).toContainEqual(
          expect.objectContaining({
            name: 'customField',
            source: 'custom',
            value: 'Custom Value',
          })
        );
      });

      it('should return empty array if project not found', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getProject).mockResolvedValue(null);

        const variables = await service.getAvailableVariables('doc-123');

        expect(variables).toEqual([]);
      });
    });
  });

  describe('Validation', () => {
    describe('validateDocument', () => {
      it('should return valid status when all rules pass', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Section', type: 'text', content: 'Content here', order: 0 },
          ],
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const report = await service.validateDocument('doc-123');

        expect(report.overallStatus).toBe('valid');
        expect(report.completionPercentage).toBe(100);
      });

      it('should return invalid status when document has no sections', async () => {
        const mockDoc = createMockDocument({ sections: [] });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const report = await service.validateDocument('doc-123');

        expect(report.overallStatus).toBe('invalid');
        expect(report.results).toContainEqual(
          expect.objectContaining({
            ruleId: 'sections-required',
            passed: false,
            severity: 'error',
          })
        );
      });

      it('should return warning status when sections are empty', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Empty Section', type: 'text', content: '', order: 0 },
          ],
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const report = await service.validateDocument('doc-123');

        expect(report.results).toContainEqual(
          expect.objectContaining({
            ruleId: 'sections-content',
            passed: false,
            severity: 'warning',
          })
        );
      });

      it('should detect unresolved variables', async () => {
        const mockDoc = createMockDocument({
          sections: [
            { sectionId: 's1', title: 'Section', type: 'text', content: '<p>Hello {{project.name}} and {{unknown.var}}</p>', order: 0 },
          ],
          variables: {},
        });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        const report = await service.validateDocument('doc-123');

        expect(report.results).toContainEqual(
          expect.objectContaining({
            ruleId: 'variables-resolved',
            passed: false,
          })
        );
      });

      it('should throw error if document not found', async () => {
        vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

        await expect(service.validateDocument('nonexistent')).rejects.toThrow(
          'Document not found: nonexistent'
        );
      });
    });
  });

  describe('Status Management', () => {
    describe('updateStatus', () => {
      it('should update document status and create version', async () => {
        const mockDoc = createMockDocument({ status: 'Draft' });
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
        vi.mocked(documentStorage.getVersionHistory).mockResolvedValue([]);

        const updated = await service.updateStatus('doc-123', 'Review');

        expect(updated.status).toBe('Review');
        expect(documentStorage.saveVersion).toHaveBeenCalled();
      });
    });
  });

  describe('Audit Logging', () => {
    describe('getAuditLogs', () => {
      it('should retrieve audit logs for a document', async () => {
        const mockLogs: AuditLog[] = [
          {
            logId: 'log-1',
            entityType: 'document',
            entityId: 'doc-123',
            userId: 'user-1',
            userName: 'John',
            action: 'created',
            timestamp: '2024-01-01T00:00:00.000Z',
          },
        ];
        vi.mocked(documentStorage.getAuditLogs).mockResolvedValue(mockLogs);

        const logs = await service.getAuditLogs('doc-123');

        expect(logs).toEqual(mockLogs);
        expect(documentStorage.getAuditLogs).toHaveBeenCalledWith('doc-123');
      });
    });
  });

  describe('Cache Management', () => {
    describe('clearCache', () => {
      it('should clear all cached documents', async () => {
        const mockDoc = createMockDocument();
        vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);

        // Cache a document
        await service.getDocument('doc-123');

        // Clear cache
        service.clearCache();

        // Should fetch from storage again
        await service.getDocument('doc-123');

        expect(documentStorage.getDocument).toHaveBeenCalledTimes(2);
      });
    });

    describe('removeCachedDocument', () => {
      it('should remove specific document from cache', async () => {
        const mockDoc1 = createMockDocument({ documentId: 'doc-1' });
        const mockDoc2 = createMockDocument({ documentId: 'doc-2' });
        vi.mocked(documentStorage.getDocument)
          .mockResolvedValueOnce(mockDoc1)
          .mockResolvedValueOnce(mockDoc2)
          .mockResolvedValueOnce(mockDoc1);

        // Cache both documents
        await service.getDocument('doc-1');
        await service.getDocument('doc-2');

        // Remove only doc-1 from cache
        service.removeCachedDocument('doc-1');

        // doc-1 should fetch again, doc-2 should use cache
        await service.getDocument('doc-1');
        await service.getDocument('doc-2');

        expect(documentStorage.getDocument).toHaveBeenCalledTimes(3);
      });
    });
  });
});
