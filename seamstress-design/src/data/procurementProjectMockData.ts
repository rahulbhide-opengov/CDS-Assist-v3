/**
 * Mock Data Generators for Procurement Projects
 *
 * Generates realistic mock data for projects, documents, sections, attachments,
 * and all related entities in the procurement management system.
 */

import { faker } from '@faker-js/faker';
import type {
  Project,
  ProjectStatus,
  Contact,
  Department,
  Category,
  Template,
  TemplateType,
  ProjectTimeline,
  StatusHistoryEntry,
  LifecyclePhase,
  Document,
  DocumentSection,
  Attachment,
  ChecklistItem,
} from '../types/procurement';

// Set seed for consistent results during development
faker.seed(456);

// ============================================================================
// Static Reference Data
// ============================================================================

export const MOCK_DEPARTMENTS: Department[] = [
  { departmentId: 'dept-001', name: 'Procurement', description: 'Centralized procurement office' },
  { departmentId: 'dept-002', name: 'Finance', description: 'Financial management and accounting' },
  { departmentId: 'dept-003', name: 'Public Works', description: 'Infrastructure and utilities' },
  { departmentId: 'dept-004', name: 'IT Services', description: 'Information technology' },
  { departmentId: 'dept-005', name: 'Parks & Recreation', description: 'Community services and facilities' },
  { departmentId: 'dept-006', name: 'Human Resources', description: 'Personnel management' },
  { departmentId: 'dept-007', name: 'Legal', description: 'Legal counsel and compliance' },
  { departmentId: 'dept-008', name: 'Engineering', description: 'Engineering services and projects' },
];

export const MOCK_CONTACTS: Contact[] = [
  {
    contactId: 'contact-001',
    firstName: 'Chris',
    lastName: 'Barnes',
    email: 'cbarnes@opengov.com',
    phone: '555-0101',
    title: 'Senior Procurement Officer',
    avatarUrl: 'https://i.pravatar.cc/150?u=cbarnes',
  },
  {
    contactId: 'contact-002',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sjohnson@opengov.com',
    phone: '555-0102',
    title: 'Procurement Manager',
    avatarUrl: 'https://i.pravatar.cc/150?u=sjohnson',
  },
  {
    contactId: 'contact-003',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@opengov.com',
    phone: '555-0103',
    title: 'Contract Administrator',
    avatarUrl: 'https://i.pravatar.cc/150?u=mchen',
  },
  {
    contactId: 'contact-004',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'erodriguez@opengov.com',
    phone: '555-0104',
    title: 'Procurement Analyst',
    avatarUrl: 'https://i.pravatar.cc/150?u=erodriguez',
  },
  {
    contactId: 'contact-005',
    firstName: 'Moti',
    lastName: 'Sorkin',
    email: 'msorkin@opengov.com',
    phone: '555-0105',
    title: 'Director of Procurement',
    avatarUrl: 'https://i.pravatar.cc/150?u=msorkin',
  },
  {
    contactId: 'contact-006',
    firstName: 'David',
    lastName: 'Kim',
    email: 'dkim@opengov.com',
    phone: '555-0106',
    title: 'Senior Buyer',
    avatarUrl: 'https://i.pravatar.cc/150?u=dkim',
  },
  {
    contactId: 'contact-007',
    firstName: 'Jennifer',
    lastName: 'White',
    email: 'jwhite@opengov.com',
    phone: '555-0107',
    title: 'Procurement Specialist',
    avatarUrl: 'https://i.pravatar.cc/150?u=jwhite',
  },
  {
    contactId: 'contact-008',
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'rmartinez@opengov.com',
    phone: '555-0108',
    title: 'Contract Specialist',
    avatarUrl: 'https://i.pravatar.cc/150?u=rmartinez',
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { categoryId: 'cat-001', code: 'NIGP-920', name: 'IT Services', type: 'NIGP' },
  { categoryId: 'cat-002', code: 'NIGP-150', name: 'Construction Services', type: 'NIGP' },
  { categoryId: 'cat-003', code: 'NIGP-910', name: 'Professional Services', type: 'NIGP' },
  { categoryId: 'cat-004', code: 'NAICS-541511', name: 'Custom Computer Programming', type: 'NAICS' },
  { categoryId: 'cat-005', code: 'NIGP-060', name: 'Office Supplies', type: 'NIGP' },
  { categoryId: 'cat-006', code: 'NIGP-970', name: 'Engineering Services', type: 'NIGP' },
  { categoryId: 'cat-007', code: 'NAICS-237310', name: 'Highway & Street Construction', type: 'NAICS' },
  { categoryId: 'cat-008', code: 'UNSPSC-43230000', name: 'Software', type: 'UNSPSC' },
];

export const MOCK_TEMPLATES: Template[] = [
  {
    templateId: 'tmpl-001',
    name: 'Request for Proposal (RFP)',
    type: 'RFP',
    description: 'Comprehensive proposal request for complex services or projects',
    setupQuestions: [
      { questionId: 'q1', question: 'Is this a multi-year contract?', type: 'boolean', required: true },
      { questionId: 'q2', question: 'Estimated contract value', type: 'text', required: true },
      { questionId: 'q3', question: 'Number of anticipated respondents', type: 'text', required: false },
    ],
    defaultSections: ['Scope of Work', 'Evaluation Criteria', 'Terms and Conditions'],
  },
  {
    templateId: 'tmpl-002',
    name: 'Request for Quotation (RFQ)',
    type: 'RFQ',
    description: 'Price quote request for well-defined products or services',
  },
  {
    templateId: 'tmpl-003',
    name: 'Invitation for Bid (IFB)',
    type: 'IFB',
    description: 'Formal sealed bid process for competitive procurement',
  },
  {
    templateId: 'tmpl-004',
    name: 'Request for Information (RFI)',
    type: 'RFI',
    description: 'Information gathering from potential vendors',
  },
  {
    templateId: 'tmpl-005',
    name: 'Evaluation Template',
    type: 'Evaluation',
    description: 'Template for evaluating vendor responses',
  },
];

const PROJECT_STATUSES: ProjectStatus[] = [
  'Draft',
  'Review',
  'Final',
  'Post Pending',
  'Open',
  'Pending',
  'Evaluation',
  'Award Pending',
  'Closed',
];

// ============================================================================
// Generator Functions
// ============================================================================

/**
 * Generate a random contact
 */
export function generateContact(overrides?: Partial<Contact>): Contact {
  return {
    contactId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: `555-${faker.number.int({ min: 1000, max: 9999 })}`,
    title: faker.person.jobTitle(),
    avatarUrl: `https://i.pravatar.cc/150?u=${faker.string.uuid()}`,
    ...overrides,
  };
}

/**
 * Generate a project timeline
 */
function generateTimeline(createdAt: Date): ProjectTimeline {
  const preProposalDate = faker.date.between({ from: createdAt, to: faker.date.soon({ days: 30, refDate: createdAt }) });
  const releaseDate = faker.date.soon({ days: 15, refDate: preProposalDate });
  const postedAt = faker.helpers.maybe(() => faker.date.soon({ days: 5, refDate: releaseDate }));
  const qaSubmissionDeadline = faker.date.soon({ days: 14, refDate: releaseDate });
  const qaResponseDeadline = faker.date.soon({ days: 7, refDate: qaSubmissionDeadline });
  const responseSubmissionDeadline = faker.date.soon({ days: 30, refDate: qaResponseDeadline });

  return {
    preProposalDate: faker.helpers.maybe(() => preProposalDate.toISOString(), { probability: 0.6 }),
    releaseDate: faker.helpers.maybe(() => releaseDate.toISOString(), { probability: 0.7 }),
    postedAt: postedAt?.toISOString(),
    qaSubmissionDeadline: faker.helpers.maybe(() => qaSubmissionDeadline.toISOString(), { probability: 0.8 }),
    qaResponseDeadline: faker.helpers.maybe(() => qaResponseDeadline.toISOString(), { probability: 0.8 }),
    responseSubmissionDeadline: faker.helpers.maybe(() => responseSubmissionDeadline.toISOString(), { probability: 0.9 }),
  };
}

/**
 * Generate lifecycle phases based on project status
 */
function generateLifecyclePhases(status: ProjectStatus): LifecyclePhase[] {
  const phases: LifecyclePhase[] = [
    {
      phaseId: 'phase-request',
      phase: 'request',
      status: 'skipped',
      actions: [],
    },
    {
      phaseId: 'phase-solicitation',
      phase: 'solicitation',
      status: status === 'Draft' || status === 'Review' ? 'in_progress' : 'complete',
      startedAt: faker.date.recent({ days: 30 }).toISOString(),
      actions: [
        { actionId: 'act-001', label: 'Edit Solicitation', icon: 'edit' },
        { actionId: 'act-002', label: 'View Solicitation', icon: 'visibility' },
        { actionId: 'act-003', label: 'Manage Vendors', icon: 'people' },
      ],
    },
    {
      phaseId: 'phase-builder',
      phase: 'builder',
      status: status === 'Draft' ? 'in_progress' : 'complete',
      actions: [
        { actionId: 'act-010', label: 'Edit Document', description: 'Modify document content', icon: 'edit' },
        { actionId: 'act-011', label: 'View Document', description: 'Preview document', icon: 'view' },
        { actionId: 'act-012', label: 'Approvals', description: 'Manage approval workflow', icon: 'list' },
        { actionId: 'act-013', label: 'Revisions History', description: 'View document history', icon: 'description' },
      ],
      nextAction: status === 'Draft' ? {
        label: 'Approve Solicit',
        color: 'success',
      } : undefined,
      otherActions: [
        { actionId: 'act-020', label: 'Invite Collaborators', icon: 'people' },
        { actionId: 'act-021', label: 'Discover Vendors', icon: 'public' },
        { actionId: 'act-022', label: 'Invite Vendors', icon: 'people' },
        { actionId: 'act-023', label: 'Export Document', icon: 'description' },
        { actionId: 'act-024', label: 'Preview Document', icon: 'view' },
        { actionId: 'act-025', label: 'Copy Document', icon: 'description' },
        { actionId: 'act-026', label: 'Create Checklist', icon: 'list' },
        { actionId: 'act-027', label: 'Public Display Options', icon: 'view' },
        { actionId: 'act-028', label: 'Create Associated Project', icon: 'edit' },
        { actionId: 'act-029', label: 'Create Intake from Project', icon: 'edit' },
        { actionId: 'act-030', label: 'Put On Hold', icon: 'edit' },
        { actionId: 'act-031', label: 'Delete Document', icon: 'edit' },
      ],
    },
    {
      phaseId: 'phase-sourcing',
      phase: 'sourcing',
      status: status === 'Open' ? 'in_progress' : status === 'Evaluation' || status === 'Award Pending' || status === 'Closed' ? 'complete' : 'not_started',
      actions: [
        { actionId: 'act-040', label: 'Invite Vendors', description: 'Send invitations', icon: 'people' },
        { actionId: 'act-041', label: 'Discover Vendors', description: 'Search vendor database', icon: 'public' },
        { actionId: 'act-042', label: 'View Responses', description: 'Review submissions', icon: 'list' },
      ],
      nextAction: status === 'Open' ? {
        label: 'Close Solicitation',
        color: 'primary',
      } : undefined,
      otherActions: status === 'Open' ? [
        { actionId: 'act-043', label: 'Send Vendor Messages', icon: 'people' },
        { actionId: 'act-044', label: 'Extend Deadline', icon: 'edit' },
      ] : [],
    },
    {
      phaseId: 'phase-evaluations',
      phase: 'evaluations',
      status: status === 'Evaluation' ? 'in_progress' : status === 'Award Pending' || status === 'Closed' ? 'complete' : 'not_started',
      actions: [
        { actionId: 'act-050', label: 'Create Scorecard', description: 'Set up evaluation criteria', icon: 'edit' },
        { actionId: 'act-051', label: 'View Responses', description: 'Review vendor submissions', icon: 'list' },
        { actionId: 'act-052', label: 'Compare Vendors', description: 'Side-by-side comparison', icon: 'view' },
        { actionId: 'act-053', label: 'Evaluator Assignments', description: 'Assign team members', icon: 'people' },
      ],
      nextAction: status === 'Evaluation' ? {
        label: 'Complete Evaluation',
        color: 'success',
      } : undefined,
      otherActions: status === 'Evaluation' ? [
        { actionId: 'act-054', label: 'Export Evaluation Report', icon: 'description' },
      ] : [],
    },
    {
      phaseId: 'phase-contract',
      phase: 'contract',
      status: status === 'Closed' ? 'complete' : 'not_started',
      actions: [
        { actionId: 'act-060', label: 'Create Contract', description: 'Draft contract document', icon: 'edit' },
        { actionId: 'act-061', label: 'View Contract', description: 'Preview contract', icon: 'view' },
      ],
    },
  ];

  return phases;
}

/**
 * Generate document sections
 */
function generateDocumentSections(documentId: string, count: number = 7): DocumentSection[] {
  const sectionTitles = [
    'Scope of Work',
    'Attachments',
    'Evaluation Criteria',
    'Security Compliance Requirements',
    'Pricing Table',
    'Vendor Questionnaire',
    'Project Timeline',
    'Terms and Conditions',
    'Insurance Requirements',
    'Delivery Schedule',
  ];

  return sectionTitles.slice(0, count).map((title, index): DocumentSection => ({
    sectionId: `section-${documentId}-${index + 1}`,
    title,
    type: title === 'Attachments' ? 'list' : 'text',
    content: title === 'Attachments' ? '' : `<p>${faker.lorem.paragraphs(2, '<br/>')}</p>`,
    order: index + 1,
  }));
}

/**
 * Generate attachments
 */
function generateAttachments(count: number, isInternal: boolean = false): Attachment[] {
  const fileTypes = ['pdf', 'docx', 'xlsx', 'png', 'jpg'];
  const fileNames = [
    'RFP_Scope',
    'Technical_Specifications',
    'Budget_Template',
    'Evaluation_Criteria',
    'Terms_and_Conditions',
    'Insurance_Certificate',
    'Vendor_Questionnaire',
    'Project_Timeline',
    'Internal_Notes',
    'Background_Research',
  ];

  return Array.from({ length: count }, () => {
    const fileType = faker.helpers.arrayElement(fileTypes);
    const fileName = `${faker.helpers.arrayElement(fileNames)}.${fileType}`;
    return {
      attachmentId: faker.string.uuid(),
      fileName,
      fileSize: faker.number.int({ min: 100000, max: 10000000 }), // 100KB to 10MB
      fileType: `application/${fileType}`,
      uploadedBy: faker.helpers.arrayElement(MOCK_CONTACTS).contactId,
      uploadedAt: faker.date.recent({ days: 30 }).toISOString(),
      url: `#`,
      isInternal,
    };
  });
}

/**
 * Generate mock document
 */
export function generateDocument(projectId: string, overrides?: Partial<Document>): Document {
  const documentId = faker.string.uuid();
  const createdAt = faker.date.recent({ days: 60 }).toISOString();

  return {
    documentId,
    projectId,
    type: 'Scope',
    status: faker.helpers.arrayElement(['Draft', 'Review', 'Final'] as const),
    sections: generateDocumentSections(documentId),
    variables: {
      projectTitle: 'Untitled Project',
      departmentName: 'Procurement',
      contactName: 'Chris Barnes',
    },
    attachments: generateAttachments(faker.number.int({ min: 0, max: 3 })),
    internalAttachments: generateAttachments(faker.number.int({ min: 0, max: 2 }), true),
    revisionHistory: [],
    approvals: [],
    createdAt,
    updatedAt: faker.date.between({ from: new Date(createdAt), to: new Date() }).toISOString(),
    ...overrides,
  };
}

/**
 * Generate status history
 */
function generateStatusHistory(status: ProjectStatus, createdAt: Date): StatusHistoryEntry[] {
  const history: StatusHistoryEntry[] = [
    {
      status: 'Draft',
      timestamp: createdAt.toISOString(),
      changedBy: faker.helpers.arrayElement(MOCK_CONTACTS).contactId,
      notes: 'Project created',
    },
  ];

  // Add more status changes based on current status
  if (status !== 'Draft') {
    history.push({
      status: 'Review',
      timestamp: faker.date.soon({ days: 5, refDate: createdAt }).toISOString(),
      changedBy: faker.helpers.arrayElement(MOCK_CONTACTS).contactId,
      notes: 'Submitted for review',
    });
  }

  if (status === 'Evaluation' || status === 'Award Pending' || status === 'Closed') {
    history.push({
      status: 'Evaluation',
      timestamp: faker.date.soon({ days: 30, refDate: createdAt }).toISOString(),
      changedBy: faker.helpers.arrayElement(MOCK_CONTACTS).contactId,
      notes: 'Evaluation phase started',
    });
  }

  return history;
}

/**
 * Generate a single mock project
 */
export function generateProject(overrides?: Partial<Project>): Project {
  const projectId = overrides?.projectId || `PRJ-${faker.number.int({ min: 10000, max: 99999 })}`;
  const createdAt = faker.date.past({ years: 1 });
  const lastUpdate = faker.date.between({ from: createdAt, to: new Date() });
  const status = overrides?.status || faker.helpers.arrayElement(PROJECT_STATUSES);
  const template = faker.helpers.arrayElement(MOCK_TEMPLATES);
  const department = faker.helpers.arrayElement(MOCK_DEPARTMENTS);
  const projectContact = faker.helpers.arrayElement(MOCK_CONTACTS);
  const procurementContact = faker.helpers.arrayElement(MOCK_CONTACTS.filter(c => c.contactId !== projectContact.contactId));

  return {
    projectId,
    title: overrides?.title || faker.helpers.arrayElement([
      `${faker.company.buzzAdjective()} ${faker.company.buzzNoun()} Project`,
      `Annual ${faker.commerce.department()} Services Contract`,
      `${faker.commerce.productName()} Procurement`,
      `${faker.company.buzzVerb()} ${faker.company.buzzNoun()} Initiative`,
    ]),
    departmentId: department.departmentId,
    department,
    procurementContactId: procurementContact.contactId,
    procurementContact,
    projectContactId: projectContact.contactId,
    projectContact,
    status,
    closedSubstatus: status === 'Closed' ? faker.helpers.arrayElement(['Awarded', 'Cancelled', 'No Response']) : undefined,
    templateId: template.templateId,
    template,
    setupQuestions: {
      multiYear: faker.datatype.boolean(),
      estimatedValue: faker.number.int({ min: 100000, max: 5000000 }),
      anticipatedRespondents: faker.number.int({ min: 3, max: 20 }),
    },
    timeline: generateTimeline(createdAt),
    budget: faker.helpers.maybe(() => ({
      amount: faker.number.int({ min: 50000, max: 5000000 }),
      account: `${faker.number.int({ min: 1000, max: 9999 })}-${faker.number.int({ min: 100, max: 999 })}`,
      description: faker.commerce.productDescription(),
    }), { probability: 0.7 }),
    categories: faker.helpers.arrayElements(MOCK_CATEGORIES, { min: 1, max: 3 }),
    isEmergency: faker.helpers.maybe(() => true, { probability: 0.1 }) || false,
    requests: [],
    createdBy: projectContact.contactId,
    createdAt: createdAt.toISOString(),
    lastUpdate: lastUpdate.toISOString(),
    statusHistory: generateStatusHistory(status, createdAt),
    lifecycle: generateLifecyclePhases(status),
    documents: [generateDocument(projectId)],
    followers: faker.helpers.arrayElements(MOCK_CONTACTS.map(c => c.contactId), { min: 0, max: 5 }),
    ...overrides,
  };
}

/**
 * Generate multiple mock projects
 */
export function generateProjects(count: number = 25): Project[] {
  const projects: Project[] = [];

  // Generate projects with weighted status distribution
  const statusWeights: Record<ProjectStatus, number> = {
    'Draft': 10,
    'Review': 5,
    'Final': 3,
    'Post Pending': 2,
    'Open': 3,
    'Pending': 2,
    'Evaluation': 5,
    'Award Pending': 2,
    'Closed': 3,
  };

  const weightedStatuses: ProjectStatus[] = [];
  Object.entries(statusWeights).forEach(([status, weight]) => {
    for (let i = 0; i < weight; i++) {
      weightedStatuses.push(status as ProjectStatus);
    }
  });

  for (let i = 0; i < count; i++) {
    const status = faker.helpers.arrayElement(weightedStatuses);
    projects.push(generateProject({ status }));
  }

  // Sort by lastUpdate descending (most recent first)
  return projects.sort((a, b) =>
    new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime()
  );
}

/**
 * Generate checklist items for final review
 */
export function generateChecklistItems(project: Project, document?: Document): ChecklistItem[] {
  const items: ChecklistItem[] = [
    // Project Properties Checklist
    {
      itemId: 'check-001',
      category: 'project_properties',
      label: 'Project Information',
      description: 'Title, department, and contacts are complete',
      required: true,
      status: project.title && project.department && project.projectContact ? 'complete' : 'incomplete',
      autoCheck: true,
    },
    {
      itemId: 'check-002',
      category: 'project_properties',
      label: 'Document Set Up',
      description: 'Template and setup questions completed',
      required: true,
      status: project.template && Object.keys(project.setupQuestions).length > 0 ? 'complete' : 'error',
      autoCheck: true,
    },
    {
      itemId: 'check-003',
      category: 'project_properties',
      label: 'Summary & Background',
      description: 'Project summary and background information provided',
      required: false,
      status: 'incomplete',
      autoCheck: false,
    },
    {
      itemId: 'check-004',
      category: 'project_properties',
      label: 'Timeline',
      description: 'Key dates and deadlines configured',
      required: true,
      status: project.timeline.releaseDate && project.timeline.responseSubmissionDeadline ? 'complete' : 'error',
      autoCheck: true,
    },
    {
      itemId: 'check-005',
      category: 'project_properties',
      label: 'Posting Options',
      description: 'Visibility and posting settings configured',
      required: false,
      status: 'complete',
      autoCheck: true,
    },
  ];

  // Document Outline Checklist
  if (document) {
    document.sections.forEach((section, index) => {
      const hasContent = section.content && section.content.length > 0;
      items.push({
        itemId: `check-doc-${index + 1}`,
        category: 'document_outline',
        label: `${index + 1}. ${section.title}`,
        description: `Section content completed`,
        required: index < 3, // First 3 sections required
        status: hasContent ? 'complete' : 'incomplete',
        autoCheck: true,
      });
    });
  }

  return items;
}

// ============================================================================
// Export Generated Data
// ============================================================================

export const mockProjects = generateProjects(25);

// Override first project's IDs for easier testing
if (mockProjects.length > 0) {
  mockProjects[0].projectId = 'PRJ-TEST-001';
  if (mockProjects[0].documents.length > 0) {
    mockProjects[0].documents[0].documentId = 'doc-test-001';
    mockProjects[0].documents[0].projectId = 'PRJ-TEST-001';
  }
}

// Filter utility functions
export function filterProjects(
  projects: Project[],
  filters: {
    status?: ProjectStatus[];
    departments?: string[];
    templates?: TemplateType[];
    searchQuery?: string;
  }
): Project[] {
  return projects.filter(project => {
    // Status filter
    if (filters.status && filters.status.length > 0 && !filters.status.includes(project.status)) {
      return false;
    }

    // Department filter
    if (filters.departments && filters.departments.length > 0 && !filters.departments.includes(project.department.name)) {
      return false;
    }

    // Template filter
    if (filters.templates && filters.templates.length > 0 && !filters.templates.includes(project.template.type)) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = `${project.title} ${project.projectId} ${project.department.name}`.toLowerCase();
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    return true;
  });
}

export default {
  projects: mockProjects,
  departments: MOCK_DEPARTMENTS,
  contacts: MOCK_CONTACTS,
  categories: MOCK_CATEGORIES,
  templates: MOCK_TEMPLATES,
};
