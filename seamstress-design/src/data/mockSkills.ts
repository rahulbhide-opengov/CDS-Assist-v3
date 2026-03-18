import type { OGSkill } from '../types/opengov';

export const mockSkills: OGSkill[] = [
  {
    id: '1',
    name: 'Data Analysis',
    description: 'Analyze complex datasets to extract meaningful insights and patterns',
    category: 'Analytics',
    status: 'published',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'dataset', type: 'string', required: true, description: 'Dataset identifier' },
      { name: 'metrics', type: 'array', required: false, description: 'Metrics to analyze' }
    ],
    examples: [
      'Analyze Q4 budget variance',
      'Compare departmental spending trends',
      'Identify cost-saving opportunities'
    ],
    usage: {
      count: 1245,
      successRate: 96,
      avgResponseTime: 2.3
    }
  },
  {
    id: '2',
    name: 'Document Generation',
    description: 'Create professional documents and reports from templates and data',
    category: 'Content',
    status: 'published',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-03-14T14:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'template', type: 'string', required: true, description: 'Template ID' },
      { name: 'data', type: 'object', required: true, description: 'Data to populate' }
    ],
    examples: [
      'Generate monthly budget report',
      'Create procurement RFP document',
      'Build council meeting agenda'
    ],
    usage: {
      count: 892,
      successRate: 98,
      avgResponseTime: 1.8
    }
  },
  {
    id: '3',
    name: 'Compliance Check',
    description: 'Validate compliance with regulatory requirements and policies',
    category: 'Governance',
    status: 'published',
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-03-10T09:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'documentId', type: 'string', required: true, description: 'Document to check' },
      { name: 'regulations', type: 'array', required: false, description: 'Specific regulations' }
    ],
    examples: [
      'Check contract for compliance',
      'Validate procurement process',
      'Review policy adherence'
    ],
    usage: {
      count: 567,
      successRate: 94,
      avgResponseTime: 3.2
    }
  },
  {
    id: '4',
    name: 'Budget Forecasting',
    description: 'Generate budget forecasts and financial projections',
    category: 'Finance',
    status: 'draft',
    createdAt: '2024-02-10T11:00:00Z',
    updatedAt: '2024-03-12T16:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'period', type: 'string', required: true, description: 'Forecast period' },
      { name: 'assumptions', type: 'object', required: false, description: 'Forecast assumptions' }
    ],
    examples: [
      'Forecast FY2025 budget',
      'Project quarterly revenue',
      'Estimate department expenses'
    ],
    usage: {
      count: 234,
      successRate: 92,
      avgResponseTime: 4.1
    }
  },
  {
    id: '5',
    name: 'Vendor Assessment',
    description: 'Evaluate and score vendor proposals against criteria',
    category: 'Procurement',
    status: 'published',
    createdAt: '2024-02-15T08:30:00Z',
    updatedAt: '2024-03-11T11:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'proposalId', type: 'string', required: true, description: 'Vendor proposal ID' },
      { name: 'criteria', type: 'array', required: true, description: 'Evaluation criteria' }
    ],
    examples: [
      'Score RFP responses',
      'Compare vendor capabilities',
      'Evaluate pricing proposals'
    ],
    usage: {
      count: 432,
      successRate: 97,
      avgResponseTime: 2.7
    }
  },
  {
    id: '6',
    name: 'Citizen Inquiry Response',
    description: 'Generate appropriate responses to citizen inquiries and requests',
    category: 'Communication',
    status: 'published',
    createdAt: '2024-01-25T09:30:00Z',
    updatedAt: '2024-03-13T10:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'inquiry', type: 'string', required: true, description: 'Citizen inquiry text' },
      { name: 'context', type: 'object', required: false, description: 'Additional context' }
    ],
    examples: [
      'Respond to permit inquiry',
      'Answer tax question',
      'Provide service information'
    ],
    usage: {
      count: 1567,
      successRate: 95,
      avgResponseTime: 1.5
    }
  },
  {
    id: '7',
    name: 'Contract Review',
    description: 'Review contracts for terms, conditions, and potential issues',
    category: 'Legal',
    status: 'draft',
    createdAt: '2024-02-20T10:30:00Z',
    updatedAt: '2024-03-09T14:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'contractId', type: 'string', required: true, description: 'Contract document ID' },
      { name: 'reviewType', type: 'string', required: false, description: 'Type of review' }
    ],
    examples: [
      'Review service agreement',
      'Check contract terms',
      'Identify risk factors'
    ],
    usage: {
      count: 189,
      successRate: 91,
      avgResponseTime: 5.3
    }
  },
  {
    id: '8',
    name: 'Performance Metrics',
    description: 'Calculate and track KPIs and performance metrics',
    category: 'Analytics',
    status: 'published',
    createdAt: '2024-01-30T11:00:00Z',
    updatedAt: '2024-03-08T09:30:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'metricType', type: 'string', required: true, description: 'Type of metric' },
      { name: 'timeRange', type: 'object', required: true, description: 'Time period' }
    ],
    examples: [
      'Calculate service efficiency',
      'Track response times',
      'Measure citizen satisfaction'
    ],
    usage: {
      count: 876,
      successRate: 99,
      avgResponseTime: 0.9
    }
  },
  {
    id: '9',
    name: 'Workflow Automation',
    description: 'Automate routine tasks and approval workflows',
    category: 'Automation',
    status: 'draft',
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-07T15:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'workflowId', type: 'string', required: true, description: 'Workflow identifier' },
      { name: 'parameters', type: 'object', required: false, description: 'Workflow parameters' }
    ],
    examples: [
      'Route approval requests',
      'Process permit applications',
      'Manage purchase orders'
    ],
    usage: {
      count: 123,
      successRate: 89,
      avgResponseTime: 2.1
    }
  },
  {
    id: '10',
    name: 'Data Validation',
    description: 'Validate data quality and integrity across systems',
    category: 'Data Management',
    status: 'published',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-03-06T10:00:00Z',
    createdBy: 'system',
    parameters: [
      { name: 'dataSource', type: 'string', required: true, description: 'Data source ID' },
      { name: 'rules', type: 'array', required: true, description: 'Validation rules' }
    ],
    examples: [
      'Validate address data',
      'Check financial records',
      'Verify citizen information'
    ],
    usage: {
      count: 654,
      successRate: 93,
      avgResponseTime: 1.2
    }
  }
];