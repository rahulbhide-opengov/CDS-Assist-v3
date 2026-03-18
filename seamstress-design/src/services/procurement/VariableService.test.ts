import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { VariableService } from './VariableService';
import { documentStorage } from './DocumentStorage';
import type { Document, Project, DocumentSection } from '../../types/procurement';

// Mock the DocumentStorage
vi.mock('./DocumentStorage');

describe('VariableService', () => {
  let service: VariableService;

  // Helper to create mock document
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
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2024-01-15T12:00:00.000Z',
    ...overrides,
  });

  // Helper to create mock project
  const createMockProject = (overrides: Partial<Project> = {}): Project => ({
    projectId: 'proj-123',
    title: 'City Infrastructure Upgrade',
    departmentId: 'dept-123',
    department: { departmentId: 'dept-123', name: 'Public Works' },
    procurementContactId: 'contact-1',
    procurementContact: {
      contactId: 'contact-1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@city.gov',
      phone: '555-0101',
      title: 'Procurement Manager',
    },
    projectContactId: 'contact-2',
    projectContact: {
      contactId: 'contact-2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@city.gov',
      phone: '555-0102',
      title: 'Project Lead',
    },
    status: 'Draft',
    templateId: 'template-123',
    template: {
      templateId: 'template-123',
      name: 'Standard RFP',
      type: 'Solicitation',
      description: 'Standard RFP template',
      sections: [],
      variables: [],
      questions: [],
      usageCount: 10,
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    setupQuestions: { contractDuration: '12 months', paymentTerms: 'Net 30' },
    timeline: {
      releaseDate: '2024-02-01',
      responseSubmissionDeadline: '2024-03-01',
      preProposalDate: '2024-02-15',
      qaSubmissionDeadline: '2024-02-20',
    },
    budget: {
      amount: 500000,
      account: '1234-5678',
      description: 'Capital improvement budget',
    },
    categories: [
      { categoryId: 'cat-1', code: '12345', name: 'Construction Services', type: 'NIGP' },
    ],
    isEmergency: false,
    requests: [],
    createdBy: 'user-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastUpdate: '2024-01-15T00:00:00.000Z',
    statusHistory: [],
    lifecycle: [],
    documents: [],
    followers: [],
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    service = new VariableService();

    // Setup default mocks
    vi.mocked(documentStorage.getDocument).mockResolvedValue(null);
    vi.mocked(documentStorage.getProject).mockResolvedValue(null);
    vi.mocked(documentStorage.getSectionsByDocument).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseVariables', () => {
    it('should extract single variable from content', () => {
      const content = 'Hello {{project.title}}!';
      const variables = service.parseVariables(content);

      expect(variables).toEqual(['project.title']);
    });

    it('should extract multiple variables from content', () => {
      const content = 'Project: {{project.title}} by {{project.contact.name}} on {{date.today}}';
      const variables = service.parseVariables(content);

      expect(variables).toHaveLength(3);
      expect(variables).toContain('project.title');
      expect(variables).toContain('project.contact.name');
      expect(variables).toContain('date.today');
    });

    it('should handle variables with spaces inside braces', () => {
      const content = 'Hello {{ project.title }} and {{  date.today  }}';
      const variables = service.parseVariables(content);

      expect(variables).toEqual(['project.title', 'date.today']);
    });

    it('should return unique variables only', () => {
      const content = '{{project.title}} is {{project.title}}';
      const variables = service.parseVariables(content);

      expect(variables).toEqual(['project.title']);
    });

    it('should return empty array for content without variables', () => {
      const content = 'Hello world without any variables';
      const variables = service.parseVariables(content);

      expect(variables).toEqual([]);
    });

    it('should handle HTML content', () => {
      const content = '<p>Project: <strong>{{project.title}}</strong></p><p>Contact: {{project.contact.email}}</p>';
      const variables = service.parseVariables(content);

      expect(variables).toHaveLength(2);
      expect(variables).toContain('project.title');
      expect(variables).toContain('project.contact.email');
    });

    it('should handle nested-looking variable names', () => {
      const content = '{{answer.contractDuration}} and {{custom.field.name}}';
      const variables = service.parseVariables(content);

      expect(variables).toHaveLength(2);
      expect(variables).toContain('answer.contractDuration');
      expect(variables).toContain('custom.field.name');
    });
  });

  describe('resolveVariables', () => {
    it('should resolve variables from project and document data', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['project.title']).toBe('City Infrastructure Upgrade');
      expect(resolved['project.department']).toBe('Public Works');
      expect(resolved['project.contact.name']).toBe('Bob Smith');
      expect(resolved['project.contact.email']).toBe('bob@city.gov');
      expect(resolved['procurement.contact.name']).toBe('Alice Johnson');
    });

    it('should resolve timeline variables', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['contract.startDate']).toBeDefined();
      expect(resolved['contract.endDate']).toBeDefined();
      expect(resolved['contract.preProposalDate']).toBeDefined();
    });

    it('should resolve budget variables', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['contract.value']).toBe('$500,000.00');
      expect(resolved['contract.account']).toBe('1234-5678');
    });

    it('should resolve setup question answers', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['answer.contractDuration']).toBe('12 months');
      expect(resolved['answer.paymentTerms']).toBe('Net 30');
    });

    it('should include date variables', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['date.today']).toBeDefined();
      expect(resolved['date.year']).toBeDefined();
      expect(resolved['date.month']).toBeDefined();
      expect(resolved['date.day']).toBeDefined();
    });

    it('should return default variables when document not found', async () => {
      vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

      const resolved = await service.resolveVariables('nonexistent');

      expect(resolved['date.today']).toBeDefined();
      expect(resolved['date.year']).toBeDefined();
      expect(resolved['project.title']).toBeUndefined();
    });

    it('should return default variables when project not found', async () => {
      const mockDoc = createMockDocument();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(null);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['date.today']).toBeDefined();
      expect(resolved['project.title']).toBeUndefined();
    });

    it('should include custom document variables', async () => {
      const mockDoc = createMockDocument({
        variables: { customField: 'Custom Value', anotherField: 'Another Value' },
      });
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['customField']).toBe('Custom Value');
      expect(resolved['anotherField']).toBe('Another Value');
    });

    it('should resolve category variables', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const resolved = await service.resolveVariables('doc-123');

      expect(resolved['category.primary']).toBe('Construction Services');
      expect(resolved['category.code']).toBe('12345');
      expect(resolved['category.type']).toBe('NIGP');
    });
  });

  describe('replaceVariables', () => {
    it('should replace variables with resolved values', () => {
      const content = 'Welcome to {{project.title}}!';
      const variables = { 'project.title': 'City Infrastructure Upgrade' };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Welcome to City Infrastructure Upgrade!');
    });

    it('should replace multiple occurrences', () => {
      const content = '{{project.title}} is a great {{project.title}}';
      const variables = { 'project.title': 'Project' };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Project is a great Project');
    });

    it('should handle variables with spaces around them', () => {
      const content = 'Hello {{ project.title }}!';
      const variables = { 'project.title': 'Test' };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Hello Test!');
    });

    it('should leave unresolved variables unchanged', () => {
      const content = '{{project.title}} by {{unknown.variable}}';
      const variables = { 'project.title': 'Test' };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Test by {{unknown.variable}}');
    });

    it('should handle null/undefined values gracefully', () => {
      const content = 'Value: {{someVar}}';
      const variables = { 'someVar': null };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Value: ');
    });

    it('should handle numeric values', () => {
      const content = 'Amount: {{contract.value}}';
      const variables = { 'contract.value': 50000 };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Amount: 50000');
    });

    it('should handle special regex characters in variable names', () => {
      const content = 'Test {{field.name}} here';
      const variables = { 'field.name': 'value' };

      const result = service.replaceVariables(content, variables);

      expect(result).toBe('Test value here');
    });
  });

  describe('getAvailableVariableDefinitions', () => {
    it('should return all standard variable definitions', () => {
      const definitions = service.getAvailableVariableDefinitions();

      expect(definitions.length).toBeGreaterThan(0);

      // Check for expected project variables
      expect(definitions).toContainEqual(
        expect.objectContaining({
          name: 'project.title',
          source: 'project',
          label: 'Project Title',
        })
      );

      // Check for contract variables
      expect(definitions).toContainEqual(
        expect.objectContaining({
          name: 'contract.value',
          source: 'contract',
        })
      );

      // Check for date variables
      expect(definitions).toContainEqual(
        expect.objectContaining({
          name: 'date.today',
          source: 'custom',
        })
      );
    });

    it('should include descriptions for all definitions', () => {
      const definitions = service.getAvailableVariableDefinitions();

      definitions.forEach(def => {
        expect(def.description).toBeDefined();
        expect(def.description!.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getVariablesWithValues', () => {
    it('should return variables with resolved values', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const variables = await service.getVariablesWithValues('doc-123');

      const projectTitleVar = variables.find(v => v.name === 'project.title');
      expect(projectTitleVar).toBeDefined();
      expect(projectTitleVar?.value).toBe('City Infrastructure Upgrade');
    });

    it('should include custom document variables', async () => {
      const mockDoc = createMockDocument({
        variables: { myCustomVar: 'Custom Value' },
      });
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const variables = await service.getVariablesWithValues('doc-123');

      const customVar = variables.find(v => v.name === 'myCustomVar');
      expect(customVar).toBeDefined();
      expect(customVar?.source).toBe('custom');
      expect(customVar?.value).toBe('Custom Value');
    });

    it('should include variables found in document sections', async () => {
      const mockDoc = createMockDocument();
      const mockProject = createMockProject();
      const mockSections: DocumentSection[] = [
        { sectionId: 's1', title: 'Section 1', type: 'text', content: 'Uses {{unusual.variable}}', order: 0 },
      ];
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);
      vi.mocked(documentStorage.getSectionsByDocument).mockResolvedValue(mockSections);

      const variables = await service.getVariablesWithValues('doc-123');

      const unusualVar = variables.find(v => v.name === 'unusual.variable');
      expect(unusualVar).toBeDefined();
      expect(unusualVar?.source).toBe('custom');
    });

    it('should return variables with empty values on resolution failure', async () => {
      vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

      const variables = await service.getVariablesWithValues('nonexistent');

      expect(variables.length).toBeGreaterThan(0);
      // All values should be empty strings
      const projectVar = variables.find(v => v.name === 'project.title');
      expect(projectVar?.value).toBe('');
    });
  });

  describe('findUnresolvedVariables', () => {
    it('should find variables not in resolved map', () => {
      const content = '{{project.title}} and {{unknown.var}}';
      const resolved = { 'project.title': 'Test' };

      const unresolved = service.findUnresolvedVariables(content, resolved);

      expect(unresolved).toEqual(['unknown.var']);
    });

    it('should return empty array when all variables are resolved', () => {
      const content = '{{project.title}} and {{project.status}}';
      const resolved = { 'project.title': 'Test', 'project.status': 'Draft' };

      const unresolved = service.findUnresolvedVariables(content, resolved);

      expect(unresolved).toEqual([]);
    });

    it('should return all variables when none are resolved', () => {
      const content = '{{var1}} and {{var2}}';
      const resolved = {};

      const unresolved = service.findUnresolvedVariables(content, resolved);

      expect(unresolved).toHaveLength(2);
      expect(unresolved).toContain('var1');
      expect(unresolved).toContain('var2');
    });
  });

  describe('validateVariables', () => {
    it('should return valid when all variables are resolved', async () => {
      const mockDoc = createMockDocument({
        sections: [
          { sectionId: 's1', title: 'Section', type: 'text', content: '{{project.title}}', order: 0 },
        ],
      });
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const result = await service.validateVariables('doc-123');

      expect(result.valid).toBe(true);
      expect(result.unresolvedVariables).toHaveLength(0);
    });

    it('should return invalid when variables are unresolved', async () => {
      const mockDoc = createMockDocument({
        sections: [
          { sectionId: 's1', title: 'Section', type: 'text', content: '{{unknown.variable}}', order: 0 },
        ],
      });
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const result = await service.validateVariables('doc-123');

      expect(result.valid).toBe(false);
      expect(result.unresolvedVariables).toContain('unknown.variable');
    });

    it('should count resolved and total variables correctly', async () => {
      const mockDoc = createMockDocument({
        sections: [
          { sectionId: 's1', title: 'Section', type: 'text', content: '{{project.title}} {{unknown.var}} {{project.status}}', order: 0 },
        ],
      });
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const result = await service.validateVariables('doc-123');

      expect(result.totalCount).toBe(3);
      expect(result.resolvedCount).toBe(2);
      expect(result.unresolvedVariables).toHaveLength(1);
    });

    it('should throw error if document not found', async () => {
      vi.mocked(documentStorage.getDocument).mockResolvedValue(null);

      await expect(service.validateVariables('nonexistent')).rejects.toThrow(
        'Document not found: nonexistent'
      );
    });

    it('should check variables across multiple sections', async () => {
      const mockDoc = createMockDocument({
        sections: [
          { sectionId: 's1', title: 'Section 1', type: 'text', content: '{{project.title}}', order: 0 },
          { sectionId: 's2', title: 'Section 2', type: 'text', content: '{{project.department}} {{missing.var}}', order: 1 },
        ],
      });
      const mockProject = createMockProject();
      vi.mocked(documentStorage.getDocument).mockResolvedValue(mockDoc);
      vi.mocked(documentStorage.getProject).mockResolvedValue(mockProject);

      const result = await service.validateVariables('doc-123');

      expect(result.totalCount).toBe(3);
      expect(result.unresolvedVariables).toContain('missing.var');
    });
  });

  describe('resolveVariablesFromProject', () => {
    it('should handle project without budget', () => {
      const project = createMockProject({ budget: undefined });
      const document = createMockDocument();

      const resolved = service.resolveVariablesFromProject(project, document);

      expect(resolved['contract.value']).toBeUndefined();
      expect(resolved['contract.account']).toBeUndefined();
    });

    it('should handle project without categories', () => {
      const project = createMockProject({ categories: [] });
      const document = createMockDocument();

      const resolved = service.resolveVariablesFromProject(project, document);

      expect(resolved['category.primary']).toBeUndefined();
    });

    it('should handle contacts without optional fields', () => {
      const project = createMockProject({
        projectContact: {
          contactId: 'c1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          // No phone or title
        },
      });
      const document = createMockDocument();

      const resolved = service.resolveVariablesFromProject(project, document);

      expect(resolved['project.contact.phone']).toBe('');
      expect(resolved['project.contact.title']).toBe('');
    });

    it('should include document-specific variables', () => {
      const project = createMockProject();
      const document = createMockDocument({
        documentId: 'doc-456',
        type: 'Attachment',
        status: 'Review',
      });

      const resolved = service.resolveVariablesFromProject(project, document);

      expect(resolved['document.id']).toBe('doc-456');
      expect(resolved['document.type']).toBe('Attachment');
      expect(resolved['document.status']).toBe('Review');
    });
  });
});
