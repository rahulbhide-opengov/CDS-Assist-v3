import type { OGAgent } from '../types/opengov';

export const mockAgentsOG: OGAgent[] = [
  {
    id: '1',
    name: 'Category Code Recommender',
    summary: 'Recommend category codes',
    description: 'AI agent that recommends appropriate NIGP, NAICS, and UNSPSC codes for procurement items',
    status: 'draft',
    category: 'Procurement',
    createdBy: 'OpenGov',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    activity: {
      actions: 100,
      lastUsed: '2024-03-15T10:00:00Z',
      uniqueUsers: 25
    },
    tags: ['procurement', 'classification', 'automation'],
    skills: ['category-lookup', 'code-matching', 'description-analysis']
  },
  {
    id: '2',
    name: 'OG Helper',
    summary: 'Helps OpenGov employees quickly find accurate answers to process and product questions',
    description: 'Internal knowledge assistant that provides instant access to documentation, procedures, and best practices',
    status: 'published',
    category: 'Support',
    createdBy: 'OpenGov',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-03-14T15:45:00Z',
    activity: {
      actions: 325,
      lastUsed: '2024-03-15T14:30:00Z',
      uniqueUsers: 78
    },
    tags: ['support', 'knowledge-base', 'internal'],
    skills: ['document-search', 'q&a', 'process-guidance']
  },
  {
    id: '3',
    name: 'Document Specialist',
    summary: 'Streamlines communication between departments by providing structured document analysis',
    description: 'Analyzes documents to extract key information, identify action items, and route to appropriate departments',
    status: 'published',
    category: 'Document Processing',
    createdBy: 'Benson Barley',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-03-13T09:20:00Z',
    activity: {
      actions: 9,
      lastUsed: '2024-03-13T08:00:00Z',
      uniqueUsers: 5
    },
    tags: ['documents', 'analysis', 'workflow'],
    skills: ['text-extraction', 'entity-recognition', 'document-routing']
  },
  {
    id: '4',
    name: 'Compliance Auditor',
    summary: 'Enhances user experience by allowing employees to efficiently search through company documents',
    description: 'Automated compliance checking against regulations, policies, and best practices',
    status: 'published',
    category: 'Compliance',
    createdBy: 'Benson Barley',
    createdAt: '2024-01-25T11:00:00Z',
    updatedAt: '2024-03-12T14:00:00Z',
    activity: {
      actions: 78,
      lastUsed: '2024-03-15T09:15:00Z',
      uniqueUsers: 12
    },
    tags: ['compliance', 'audit', 'regulations'],
    skills: ['policy-check', 'regulation-matching', 'risk-assessment']
  },
  {
    id: '5',
    name: 'Legal Writer',
    summary: 'Fosters a collaborative environment by integrating feedback from multiple stakeholders',
    description: 'Assists in drafting legal documents, contracts, and agreements with proper terminology and structure',
    status: 'published',
    category: 'Legal',
    createdBy: 'OpenGov',
    createdAt: '2024-02-01T08:30:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 450,
      lastUsed: '2024-03-15T11:00:00Z',
      uniqueUsers: 34
    },
    tags: ['legal', 'contracts', 'documentation'],
    skills: ['legal-drafting', 'clause-generation', 'contract-review']
  },
  {
    id: '6',
    name: 'Form Builder',
    summary: 'Empowers users with a comprehensive guide to navigate complex regulatory requirements',
    description: 'Creates and manages dynamic forms for citizen services and internal processes',
    status: 'draft',
    category: 'Forms',
    createdBy: 'OpenGov',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 89,
      lastUsed: '2024-03-10T16:00:00Z',
      uniqueUsers: 15
    },
    tags: ['forms', 'citizen-services', 'automation'],
    skills: ['form-generation', 'validation-rules', 'workflow-creation']
  },
  {
    id: '7',
    name: 'Task Scheduler',
    summary: 'Promotes consistency in responses to inquiries across different teams and departments',
    description: 'Intelligent task scheduling and resource allocation based on priorities and dependencies',
    status: 'draft',
    category: 'Operations',
    createdBy: 'Benson Barley',
    createdAt: '2024-02-08T10:30:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 212,
      lastUsed: '2024-03-14T13:45:00Z',
      uniqueUsers: 28
    },
    tags: ['scheduling', 'tasks', 'workflow'],
    skills: ['priority-assessment', 'resource-allocation', 'dependency-tracking']
  },
  {
    id: '8',
    name: 'Bill Cycle Analyst',
    summary: 'Facilitates training for new employees through easily accessible resources and templates',
    description: 'Analyzes utility billing cycles to identify patterns, anomalies, and optimization opportunities',
    status: 'draft',
    category: 'Finance',
    createdBy: 'Benson Barley',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 34,
      lastUsed: '2024-03-08T10:00:00Z',
      uniqueUsers: 8
    },
    tags: ['billing', 'utilities', 'analytics'],
    skills: ['billing-analysis', 'pattern-detection', 'usage-forecasting']
  },
  {
    id: '9',
    name: 'Financial Analyst',
    summary: 'Encourages knowledge sharing by linking similar topics within Content Management System',
    description: 'Comprehensive financial analysis including budgeting, forecasting, and variance reporting',
    status: 'draft',
    category: 'Finance',
    createdBy: 'OpenGov',
    createdAt: '2024-02-12T08:00:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 527,
      lastUsed: '2024-03-15T12:30:00Z',
      uniqueUsers: 42
    },
    tags: ['finance', 'budget', 'analysis'],
    skills: ['budget-analysis', 'forecasting', 'variance-reporting']
  },
  {
    id: '10',
    name: 'Asset Manager',
    summary: 'Improves productivity by reducing the time spent searching for information and documents',
    description: 'Tracks and manages physical and digital assets throughout their lifecycle',
    status: 'draft',
    category: 'Asset Management',
    createdBy: 'Benson Barley',
    createdAt: '2024-02-15T09:30:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 19,
      lastUsed: '2024-03-05T14:00:00Z',
      uniqueUsers: 6
    },
    tags: ['assets', 'inventory', 'lifecycle'],
    skills: ['asset-tracking', 'depreciation-calculation', 'maintenance-scheduling']
  },
  {
    id: '11',
    name: 'PS Implementation Agent',
    summary: 'Provides regular updates to keep the content accurate and relevant for the users',
    description: 'Guides professional services implementations with best practices and project management',
    status: 'draft',
    category: 'Professional Services',
    createdBy: 'Benson Barley',
    createdAt: '2024-02-18T10:00:00Z',
    updatedAt: '2024-03-11T11:30:00Z',
    activity: {
      actions: 399,
      lastUsed: '2024-03-15T08:00:00Z',
      uniqueUsers: 23
    },
    tags: ['implementation', 'project-management', 'professional-services'],
    skills: ['project-planning', 'milestone-tracking', 'resource-management']
  },
  {
    id: '12',
    name: 'Citizen Engagement Bot',
    summary: 'Enhances citizen engagement through automated responses and service routing',
    description: 'Multi-channel citizen engagement bot that handles inquiries, requests, and feedback',
    status: 'published',
    category: 'Citizen Services',
    createdBy: 'OpenGov',
    createdAt: '2024-02-20T11:30:00Z',
    updatedAt: '2024-03-14T10:00:00Z',
    activity: {
      actions: 1892,
      lastUsed: '2024-03-15T15:00:00Z',
      uniqueUsers: 234
    },
    tags: ['citizen-services', 'engagement', 'chatbot'],
    skills: ['natural-language', 'service-routing', 'sentiment-analysis']
  },
  {
    id: '13',
    name: 'Permit Assistant',
    summary: 'Streamlines permit application and review processes',
    description: 'Assists with permit applications, checks requirements, and tracks approval status',
    status: 'published',
    category: 'Permitting',
    createdBy: 'OpenGov',
    createdAt: '2024-02-22T08:45:00Z',
    updatedAt: '2024-03-13T14:30:00Z',
    activity: {
      actions: 567,
      lastUsed: '2024-03-15T13:00:00Z',
      uniqueUsers: 89
    },
    tags: ['permits', 'applications', 'workflow'],
    skills: ['requirement-checking', 'status-tracking', 'deadline-monitoring']
  },
  {
    id: '14',
    name: 'Budget Optimizer',
    summary: 'Identifies cost-saving opportunities and budget optimization strategies',
    description: 'Analyzes spending patterns to recommend budget adjustments and cost reductions',
    status: 'draft',
    category: 'Finance',
    createdBy: 'OpenGov',
    createdAt: '2024-02-25T09:15:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    activity: {
      actions: 234,
      lastUsed: '2024-03-14T09:00:00Z',
      uniqueUsers: 18
    },
    tags: ['budget', 'optimization', 'cost-savings'],
    skills: ['spend-analysis', 'optimization-modeling', 'recommendation-engine']
  },
  {
    id: '15',
    name: 'Emergency Response Coordinator',
    summary: 'Coordinates emergency response efforts and resource allocation',
    description: 'Manages emergency situations by coordinating resources, personnel, and communication',
    status: 'published',
    category: 'Emergency Management',
    createdBy: 'OpenGov',
    createdAt: '2024-02-28T10:00:00Z',
    updatedAt: '2024-03-12T08:00:00Z',
    activity: {
      actions: 45,
      lastUsed: '2024-03-10T22:00:00Z',
      uniqueUsers: 12
    },
    tags: ['emergency', 'coordination', 'response'],
    skills: ['incident-management', 'resource-dispatch', 'alert-generation']
  }
];