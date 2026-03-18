/**
 * Mock Template Data
 * Realistic procurement document templates with setup questions
 *
 * Includes:
 * - 10 common template types (RFP, RFQ, IFB, RFI, etc.)
 * - Pre-configured sections for each template
 * - Setup questions to customize documents
 * - Variable definitions
 */

import type { Template, Question, QuestionOption } from '../../types/procurement';

// ============================================================================
// Template Data
// ============================================================================

export const MOCK_TEMPLATES: Template[] = [
  // 1. RFP - Professional Services
  {
    templateId: 'template-001',
    name: 'RFP - Professional Services',
    description:
      'Comprehensive Request for Proposals for professional services including consulting, IT services, and other knowledge-based work.',
    type: 'Solicitation',
    sections: [
      {
        title: 'Introduction',
        type: 'text',
        content:
          '<p>The {{agency.name}} is soliciting proposals from qualified firms to provide {{project.title}}.</p>',
        required: true,
      },
      {
        title: 'Scope of Work',
        type: 'text',
        content: '<p>Describe the specific services to be performed...</p>',
        required: true,
      },
      {
        title: 'Deliverables',
        type: 'list',
        content: '<ul><li>List all required deliverables</li></ul>',
        required: true,
      },
      {
        title: 'Evaluation Criteria',
        type: 'text',
        content: '<p>Proposals will be evaluated on the following criteria...</p>',
        required: true,
      },
      {
        title: 'Submission Requirements',
        type: 'text',
        content: '<p>Proposals must include...</p>',
        required: true,
      },
      {
        title: 'Timeline and Milestones',
        type: 'text',
        content: '<p>Project start date: {{contract.startDate}}</p>',
        required: true,
      },
      {
        title: 'Budget and Payment Terms',
        type: 'text',
        content: '<p>Estimated budget: {{contract.value}}</p>',
        required: false,
      },
    ],
    variables: [
      'agency.name',
      'project.title',
      'contract.startDate',
      'contract.endDate',
      'contract.value',
      'contact.name',
      'contact.email',
    ],
    questions: [],
    usageCount: 42,
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2025-01-10T14:30:00Z',
  },

  // 2. RFQ - Goods Procurement
  {
    templateId: 'template-002',
    name: 'RFQ - Goods Procurement',
    description:
      'Request for Quotation for purchasing goods, equipment, or supplies with specific specifications.',
    type: 'Solicitation',
    sections: [
      {
        title: 'Project Overview',
        type: 'text',
        content: '<p>{{agency.name}} is requesting quotations for {{project.title}}.</p>',
        required: true,
      },
      {
        title: 'Item Specifications',
        type: 'list',
        content: '<ul><li>Item 1: [Description]</li><li>Item 2: [Description]</li></ul>',
        required: true,
      },
      {
        title: 'Quantity and Delivery',
        type: 'text',
        content: '<p>Quantity required: [Specify]</p><p>Delivery location: [Address]</p>',
        required: true,
      },
      {
        title: 'Pricing Table',
        type: 'text',
        content: '<p>Provide pricing for each line item including shipping and taxes.</p>',
        required: true,
      },
      {
        title: 'Vendor Qualifications',
        type: 'text',
        content: '<p>Vendors must demonstrate...</p>',
        required: false,
      },
      {
        title: 'Terms and Conditions',
        type: 'text',
        content: '<p>Standard procurement terms apply...</p>',
        required: true,
      },
    ],
    variables: ['agency.name', 'project.title', 'delivery.date', 'contact.name', 'contact.email'],
    questions: [],
    usageCount: 38,
    isActive: true,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2025-01-08T16:45:00Z',
  },

  // 3. IFB - Construction Contract
  {
    templateId: 'template-003',
    name: 'IFB - Construction Contract',
    description:
      'Invitation for Bids for construction projects including infrastructure, buildings, and public works.',
    type: 'Solicitation',
    sections: [
      {
        title: 'Project Description',
        type: 'text',
        content:
          '<p>{{agency.name}} invites sealed bids for {{project.title}}.</p><p>Project location: {{project.location}}</p>',
        required: true,
      },
      {
        title: 'Scope of Work',
        type: 'text',
        content: '<p>The contractor shall provide all labor, materials, and equipment...</p>',
        required: true,
      },
      {
        title: 'Plans and Specifications',
        type: 'text',
        content: '<p>Plans are available for review at...</p>',
        required: true,
      },
      {
        title: 'Pre-Bid Conference',
        type: 'text',
        content: '<p>A mandatory pre-bid conference will be held on {{prebid.date}}.</p>',
        required: false,
      },
      {
        title: 'Bid Submission',
        type: 'text',
        content: '<p>Bids must be submitted by {{submission.deadline}}.</p>',
        required: true,
      },
      {
        title: 'Insurance Requirements',
        type: 'list',
        content:
          '<ul><li>General Liability: $1M/$2M</li><li>Workers Compensation</li><li>Auto Insurance</li></ul>',
        required: true,
      },
      {
        title: 'Prevailing Wage',
        type: 'text',
        content: '<p>This project is subject to prevailing wage requirements.</p>',
        required: true,
      },
      {
        title: 'DBE Requirements',
        type: 'text',
        content:
          '<p>This project has a {{dbe.goal}}% Disadvantaged Business Enterprise goal.</p>',
        required: false,
      },
    ],
    variables: [
      'agency.name',
      'project.title',
      'project.location',
      'prebid.date',
      'submission.deadline',
      'contract.startDate',
      'contract.completionDate',
      'dbe.goal',
    ],
    questions: [],
    usageCount: 28,
    isActive: true,
    createdAt: '2024-02-01T11:30:00Z',
    updatedAt: '2025-01-12T09:15:00Z',
  },

  // 4. RFI - Information Gathering
  {
    templateId: 'template-004',
    name: 'RFI - Information Gathering',
    description:
      'Request for Information to gather market intelligence and vendor capabilities before formal solicitation.',
    type: 'Solicitation',
    sections: [
      {
        title: 'Purpose',
        type: 'text',
        content:
          '<p>{{agency.name}} is seeking information about {{project.title}} to inform future procurement decisions.</p>',
        required: true,
      },
      {
        title: 'Background',
        type: 'text',
        content: '<p>Provide context about the project and current situation...</p>',
        required: true,
      },
      {
        title: 'Information Requested',
        type: 'list',
        content: '<ul><li>Question 1</li><li>Question 2</li><li>Question 3</li></ul>',
        required: true,
      },
      {
        title: 'Vendor Capabilities',
        type: 'text',
        content: '<p>Describe your company\'s experience and capabilities...</p>',
        required: true,
      },
      {
        title: 'Response Format',
        type: 'text',
        content: '<p>Responses should be submitted by {{submission.deadline}}.</p>',
        required: true,
      },
    ],
    variables: ['agency.name', 'project.title', 'submission.deadline', 'contact.email'],
    questions: [],
    usageCount: 15,
    isActive: true,
    createdAt: '2024-02-10T13:00:00Z',
    updatedAt: '2024-12-20T10:30:00Z',
  },

  // 5. Standard Service Contract
  {
    templateId: 'template-005',
    name: 'Standard Service Contract',
    description: 'General purpose service contract for professional services, consulting, and recurring work.',
    type: 'Contract',
    sections: [
      {
        title: 'Parties',
        type: 'text',
        content:
          '<p>This Agreement is made between {{agency.name}} ("Client") and {{vendor.name}} ("Contractor").</p>',
        required: true,
      },
      {
        title: 'Scope of Services',
        type: 'text',
        content: '<p>The Contractor shall provide the following services...</p>',
        required: true,
      },
      {
        title: 'Term and Termination',
        type: 'text',
        content:
          '<p>Term: {{contract.startDate}} to {{contract.endDate}}</p><p>Either party may terminate with 30 days notice.</p>',
        required: true,
      },
      {
        title: 'Compensation',
        type: 'text',
        content: '<p>Total contract value: {{contract.value}}</p><p>Payment terms: Net 30</p>',
        required: true,
      },
      {
        title: 'Insurance',
        type: 'text',
        content: '<p>Contractor shall maintain appropriate insurance...</p>',
        required: true,
      },
      {
        title: 'Indemnification',
        type: 'text',
        content: '<p>Contractor agrees to indemnify and hold harmless...</p>',
        required: true,
      },
      {
        title: 'Signature Block',
        type: 'text',
        content: '<p>IN WITNESS WHEREOF, the parties have executed this Agreement.</p>',
        required: true,
      },
    ],
    variables: [
      'agency.name',
      'vendor.name',
      'contract.startDate',
      'contract.endDate',
      'contract.value',
    ],
    questions: [],
    usageCount: 52,
    isActive: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2025-01-14T11:20:00Z',
  },

  // 6. Purchase Order Template
  {
    templateId: 'template-006',
    name: 'Purchase Order',
    description: 'Standard purchase order for one-time procurement of goods or services.',
    type: 'Contract',
    sections: [
      {
        title: 'Purchase Order Information',
        type: 'text',
        content:
          '<p>PO Number: {{po.number}}</p><p>Date: {{date.today}}</p><p>Vendor: {{vendor.name}}</p>',
        required: true,
      },
      {
        title: 'Ship To',
        type: 'text',
        content: '<p>{{agency.name}}</p><p>{{agency.address}}</p>',
        required: true,
      },
      {
        title: 'Items',
        type: 'list',
        content: '<ul><li>Item description, quantity, unit price, total</li></ul>',
        required: true,
      },
      {
        title: 'Payment Terms',
        type: 'text',
        content: '<p>Net 30 days from receipt of goods and invoice.</p>',
        required: true,
      },
      {
        title: 'Special Instructions',
        type: 'text',
        content: '<p>Additional delivery or handling instructions...</p>',
        required: false,
      },
    ],
    variables: [
      'po.number',
      'date.today',
      'vendor.name',
      'agency.name',
      'agency.address',
      'contact.name',
    ],
    questions: [],
    usageCount: 125,
    isActive: true,
    createdAt: '2024-01-05T09:00:00Z',
    updatedAt: '2025-01-13T15:00:00Z',
  },

  // 7. Intergovernmental Agreement
  {
    templateId: 'template-007',
    name: 'Intergovernmental Agreement',
    description: 'Agreement template for collaborations between government entities.',
    type: 'Contract',
    sections: [
      {
        title: 'Parties',
        type: 'text',
        content: '<p>This Agreement is made between {{agency.name}} and {{partner.agency}}.</p>',
        required: true,
      },
      {
        title: 'Purpose',
        type: 'text',
        content: '<p>The purpose of this Agreement is to...</p>',
        required: true,
      },
      {
        title: 'Responsibilities',
        type: 'text',
        content:
          '<p>{{agency.name}} shall...</p><p>{{partner.agency}} shall...</p>',
        required: true,
      },
      {
        title: 'Financial Terms',
        type: 'text',
        content: '<p>Cost sharing arrangement: {{cost.sharing}}</p>',
        required: true,
      },
      {
        title: 'Term',
        type: 'text',
        content: '<p>Effective {{contract.startDate}} through {{contract.endDate}}.</p>',
        required: true,
      },
      {
        title: 'Amendment and Termination',
        type: 'text',
        content: '<p>This Agreement may be amended by mutual written consent...</p>',
        required: true,
      },
    ],
    variables: [
      'agency.name',
      'partner.agency',
      'cost.sharing',
      'contract.startDate',
      'contract.endDate',
    ],
    questions: [],
    usageCount: 8,
    isActive: true,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-11-15T14:00:00Z',
  },

  // 8. Sole Source Justification
  {
    templateId: 'template-008',
    name: 'Sole Source Justification',
    description: 'Documentation for non-competitive procurement when only one vendor can meet requirements.',
    type: 'Intake',
    sections: [
      {
        title: 'Project Information',
        type: 'text',
        content: '<p>Project: {{project.title}}</p><p>Department: {{department.name}}</p>',
        required: true,
      },
      {
        title: 'Vendor Information',
        type: 'text',
        content: '<p>Vendor: {{vendor.name}}</p><p>Estimated Cost: {{contract.value}}</p>',
        required: true,
      },
      {
        title: 'Justification',
        type: 'text',
        content: '<p>This vendor is the sole source because...</p>',
        required: true,
      },
      {
        title: 'Market Research',
        type: 'text',
        content: '<p>Market research was conducted to determine if alternatives exist...</p>',
        required: true,
      },
      {
        title: 'Public Benefit',
        type: 'text',
        content: '<p>This procurement serves the public interest by...</p>',
        required: true,
      },
    ],
    variables: ['project.title', 'department.name', 'vendor.name', 'contract.value'],
    questions: [],
    usageCount: 12,
    isActive: true,
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-12-10T09:30:00Z',
  },

  // 9. Emergency Procurement
  {
    templateId: 'template-009',
    name: 'Emergency Procurement',
    description: 'Expedited procurement documentation for emergency situations requiring immediate action.',
    type: 'Intake',
    sections: [
      {
        title: 'Emergency Declaration',
        type: 'text',
        content: '<p>An emergency exists requiring immediate procurement action for {{project.title}}.</p>',
        required: true,
      },
      {
        title: 'Nature of Emergency',
        type: 'text',
        content: '<p>Describe the emergency situation and immediate needs...</p>',
        required: true,
      },
      {
        title: 'Why Standard Process Cannot Be Used',
        type: 'text',
        content: '<p>Normal procurement timeframes would result in...</p>',
        required: true,
      },
      {
        title: 'Vendor Selection',
        type: 'text',
        content: '<p>Vendor {{vendor.name}} was selected because...</p>',
        required: true,
      },
      {
        title: 'Cost Justification',
        type: 'text',
        content: '<p>Cost: {{contract.value}}</p><p>This cost is reasonable because...</p>',
        required: true,
      },
      {
        title: 'Approvals',
        type: 'text',
        content: '<p>Emergency procurement approved by {{approver.name}} on {{approval.date}}.</p>',
        required: true,
      },
    ],
    variables: [
      'project.title',
      'vendor.name',
      'contract.value',
      'approver.name',
      'approval.date',
    ],
    questions: [],
    usageCount: 5,
    isActive: true,
    createdAt: '2024-03-10T14:00:00Z',
    updatedAt: '2024-10-22T16:30:00Z',
  },

  // 10. Cooperative Purchasing Agreement
  {
    templateId: 'template-010',
    name: 'Cooperative Purchasing Agreement',
    description: 'Leverage existing contracts from other government entities for procurement.',
    type: 'Contract',
    sections: [
      {
        title: 'Agreement Overview',
        type: 'text',
        content:
          '<p>{{agency.name}} is utilizing a cooperative contract established by {{lead.agency}}.</p>',
        required: true,
      },
      {
        title: 'Original Contract Information',
        type: 'text',
        content:
          '<p>Contract Number: {{original.contract.number}}</p><p>Vendor: {{vendor.name}}</p>',
        required: true,
      },
      {
        title: 'Scope of Work Under This Agreement',
        type: 'text',
        content: '<p>Under this cooperative agreement, the Vendor shall provide...</p>',
        required: true,
      },
      {
        title: 'Pricing',
        type: 'text',
        content: '<p>Pricing follows the rates established in the original contract...</p>',
        required: true,
      },
      {
        title: 'Term',
        type: 'text',
        content: '<p>This agreement is effective {{contract.startDate}} through {{contract.endDate}}.</p>',
        required: true,
      },
    ],
    variables: [
      'agency.name',
      'lead.agency',
      'original.contract.number',
      'vendor.name',
      'contract.startDate',
      'contract.endDate',
    ],
    questions: [],
    usageCount: 18,
    isActive: true,
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-12-28T13:45:00Z',
  },
];

// ============================================================================
// Template Questions
// ============================================================================

export const MOCK_QUESTIONS: Question[] = [
  // RFP - Professional Services (template-001)
  {
    questionId: 'question-001',
    templateId: 'template-001',
    text: 'What is the estimated contract value?',
    type: 'text',
    required: true,
    helpText: 'Enter the total estimated contract value for budget planning',
    variableName: 'contract.value',
    order: 0,
    createdAt: '2024-01-15T10:05:00Z',
  },
  {
    questionId: 'question-002',
    templateId: 'template-001',
    text: 'Is this a multi-year contract?',
    type: 'yes_no',
    required: true,
    helpText: 'Select if the contract extends beyond one fiscal year',
    variableName: 'contract.multiyear',
    order: 1,
    createdAt: '2024-01-15T10:06:00Z',
  },
  {
    questionId: 'question-003',
    templateId: 'template-001',
    text: 'Which insurance types are required?',
    type: 'checkbox',
    required: true,
    helpText: 'Select all insurance types the contractor must maintain',
    order: 2,
    createdAt: '2024-01-15T10:07:00Z',
  },
  {
    questionId: 'question-004',
    templateId: 'template-001',
    text: 'What is the project start date?',
    type: 'date',
    required: true,
    helpText: 'Expected project commencement date',
    variableName: 'contract.startDate',
    order: 3,
    createdAt: '2024-01-15T10:08:00Z',
  },
  {
    questionId: 'question-005',
    templateId: 'template-001',
    text: 'What evaluation method will be used?',
    type: 'multiple_choice',
    required: true,
    helpText: 'Select the scoring methodology for proposal evaluation',
    order: 4,
    createdAt: '2024-01-15T10:09:00Z',
  },

  // RFQ - Goods Procurement (template-002)
  {
    questionId: 'question-006',
    templateId: 'template-002',
    text: 'What is the delivery timeline?',
    type: 'text',
    required: true,
    helpText: 'Specify required delivery timeframe (e.g., "30 days from award")',
    variableName: 'delivery.timeline',
    order: 0,
    createdAt: '2024-01-20T09:05:00Z',
  },
  {
    questionId: 'question-007',
    templateId: 'template-002',
    text: 'Is installation required?',
    type: 'yes_no',
    required: true,
    helpText: 'Does the vendor need to install or set up the goods?',
    variableName: 'installation.required',
    order: 1,
    createdAt: '2024-01-20T09:06:00Z',
  },
  {
    questionId: 'question-008',
    templateId: 'template-002',
    text: 'What is the warranty requirement?',
    type: 'multiple_choice',
    required: true,
    helpText: 'Select minimum warranty period',
    variableName: 'warranty.period',
    order: 2,
    createdAt: '2024-01-20T09:07:00Z',
  },

  // IFB - Construction Contract (template-003)
  {
    questionId: 'question-009',
    templateId: 'template-003',
    text: 'What is the DBE participation goal?',
    type: 'text',
    required: false,
    helpText: 'Enter percentage (e.g., "15") or leave blank if not applicable',
    variableName: 'dbe.goal',
    order: 0,
    createdAt: '2024-02-01T11:35:00Z',
  },
  {
    questionId: 'question-010',
    templateId: 'template-003',
    text: 'Is a pre-bid conference required?',
    type: 'yes_no',
    required: true,
    helpText: 'Will bidders be required to attend a pre-bid meeting?',
    variableName: 'prebid.required',
    order: 1,
    createdAt: '2024-02-01T11:36:00Z',
  },
  {
    questionId: 'question-011',
    templateId: 'template-003',
    text: 'What is the substantial completion date?',
    type: 'date',
    required: true,
    helpText: 'Target date for substantial completion of work',
    variableName: 'contract.completionDate',
    order: 2,
    createdAt: '2024-02-01T11:37:00Z',
  },
  {
    questionId: 'question-012',
    templateId: 'template-003',
    text: 'Is prevailing wage applicable?',
    type: 'yes_no',
    required: true,
    helpText: 'Does this project require payment of prevailing wages?',
    variableName: 'prevailing.wage',
    order: 3,
    createdAt: '2024-02-01T11:38:00Z',
  },

  // Standard Service Contract (template-005)
  {
    questionId: 'question-013',
    templateId: 'template-005',
    text: 'What is the contract term?',
    type: 'multiple_choice',
    required: true,
    helpText: 'Select the duration of the service contract',
    variableName: 'contract.term',
    order: 0,
    createdAt: '2024-01-10T08:05:00Z',
  },
  {
    questionId: 'question-014',
    templateId: 'template-005',
    text: 'Include renewal options?',
    type: 'yes_no',
    required: true,
    helpText: 'Add optional renewal periods to the contract?',
    variableName: 'contract.renewals',
    order: 1,
    createdAt: '2024-01-10T08:06:00Z',
  },
  {
    questionId: 'question-015',
    templateId: 'template-005',
    text: 'What are the payment terms?',
    type: 'multiple_choice',
    required: true,
    helpText: 'Select when payment is due after invoice',
    variableName: 'payment.terms',
    order: 2,
    createdAt: '2024-01-10T08:07:00Z',
  },
];

// ============================================================================
// Question Options
// ============================================================================

export const MOCK_QUESTION_OPTIONS: QuestionOption[] = [
  // Options for question-003 (Insurance types for RFP)
  {
    optionId: 'option-001',
    questionId: 'question-003',
    label: 'General Liability ($1M/$2M)',
    value: 'general_liability',
    order: 0,
  },
  {
    optionId: 'option-002',
    questionId: 'question-003',
    label: 'Professional Liability (E&O)',
    value: 'professional_liability',
    order: 1,
  },
  {
    optionId: 'option-003',
    questionId: 'question-003',
    label: 'Workers Compensation',
    value: 'workers_comp',
    order: 2,
  },
  {
    optionId: 'option-004',
    questionId: 'question-003',
    label: 'Auto Insurance',
    value: 'auto_insurance',
    order: 3,
  },
  {
    optionId: 'option-005',
    questionId: 'question-003',
    label: 'Cyber Liability',
    value: 'cyber_liability',
    order: 4,
  },

  // Options for question-005 (Evaluation method)
  {
    optionId: 'option-006',
    questionId: 'question-005',
    label: 'Best Value (Quality + Price)',
    value: 'best_value',
    order: 0,
  },
  {
    optionId: 'option-007',
    questionId: 'question-005',
    label: 'Lowest Responsive Bidder',
    value: 'lowest_bidder',
    order: 1,
  },
  {
    optionId: 'option-008',
    questionId: 'question-005',
    label: 'Qualifications-Based (QBS)',
    value: 'qbs',
    order: 2,
  },
  {
    optionId: 'option-009',
    questionId: 'question-005',
    label: 'Two-Step (Technical then Price)',
    value: 'two_step',
    order: 3,
  },

  // Options for question-008 (Warranty for RFQ)
  {
    optionId: 'option-010',
    questionId: 'question-008',
    label: '1 Year Standard Warranty',
    value: '1_year',
    order: 0,
  },
  {
    optionId: 'option-011',
    questionId: 'question-008',
    label: '2 Year Extended Warranty',
    value: '2_year',
    order: 1,
  },
  {
    optionId: 'option-012',
    questionId: 'question-008',
    label: '3 Year Extended Warranty',
    value: '3_year',
    order: 2,
  },
  {
    optionId: 'option-013',
    questionId: 'question-008',
    label: '5 Year Extended Warranty',
    value: '5_year',
    order: 3,
  },

  // Options for question-013 (Contract term)
  {
    optionId: 'option-014',
    questionId: 'question-013',
    label: '1 Year',
    value: '1_year',
    order: 0,
  },
  {
    optionId: 'option-015',
    questionId: 'question-013',
    label: '2 Years',
    value: '2_years',
    order: 1,
  },
  {
    optionId: 'option-016',
    questionId: 'question-013',
    label: '3 Years',
    value: '3_years',
    order: 2,
  },
  {
    optionId: 'option-017',
    questionId: 'question-013',
    label: '5 Years',
    value: '5_years',
    order: 3,
  },

  // Options for question-015 (Payment terms)
  {
    optionId: 'option-018',
    questionId: 'question-015',
    label: 'Net 15 (Payment within 15 days)',
    value: 'net_15',
    order: 0,
  },
  {
    optionId: 'option-019',
    questionId: 'question-015',
    label: 'Net 30 (Payment within 30 days)',
    value: 'net_30',
    order: 1,
  },
  {
    optionId: 'option-020',
    questionId: 'question-015',
    label: 'Net 45 (Payment within 45 days)',
    value: 'net_45',
    order: 2,
  },
  {
    optionId: 'option-021',
    questionId: 'question-015',
    label: 'Net 60 (Payment within 60 days)',
    value: 'net_60',
    order: 3,
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get template by ID
 */
export function getTemplateById(templateId: string): Template | undefined {
  return MOCK_TEMPLATES.find((t) => t.templateId === templateId);
}

/**
 * Get questions for a template
 */
export function getTemplateQuestions(templateId: string): Question[] {
  return MOCK_QUESTIONS.filter((q) => q.templateId === templateId);
}

/**
 * Get options for a question
 */
export function getQuestionOptions(questionId: string): QuestionOption[] {
  return MOCK_QUESTION_OPTIONS.filter((o) => o.questionId === questionId);
}

/**
 * Get templates by type
 */
export function getTemplatesByType(type: string): Template[] {
  return MOCK_TEMPLATES.filter((t) => t.type === type);
}
