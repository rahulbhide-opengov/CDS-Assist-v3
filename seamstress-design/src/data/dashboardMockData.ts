/**
 * Comprehensive Mock Data for Agent Studio Observability Dashboard
 *
 * This file contains mock data for tracking and visualizing:
 * - Agent performance and activity
 * - Skill usage and execution metrics
 * - Tool call statistics and latency
 * - User engagement and feedback
 * - Guardrail violations and safety metrics
 * - Model provider metrics (tokens, cost, latency)
 * - Feedback processing flywheel
 */

// Import types and helpers from organized structure
import type {
  GoalMetric,
  HeroKPI,
  TimeSeriesDataPoint,
  AgentPerformance,
  SkillUsage,
  ToolCallStats,
  UserActivity,
  FeedbackEntry,
  GuardrailViolation,
  ModelProviderStats,
  FeedbackFlywheel,
  DashboardData,
} from './dashboard/types';

import {
  generateDateRange,
  generateTimeSeriesData,
  randomPastDate,
} from './dashboard/helpers';

// Re-export types for backward compatibility
export type {
  GoalMetric,
  HeroKPI,
  TimeSeriesDataPoint,
  AgentPerformance,
  SkillUsage,
  ToolCallStats,
  UserActivity,
  FeedbackEntry,
  GuardrailViolation,
  ModelProviderStats,
  FeedbackFlywheel,
  DashboardData,
}

// ============================================================================
// Goal Metrics
// ============================================================================

export const goalMetrics: GoalMetric[] = [
  {
    name: 'Feedback Cycle Time',
    current: 36,
    target: 48,
    unit: 'hours',
    trend: 'down',
    changePercent: -25
  },
  {
    name: 'New Use Cases',
    current: 18,
    target: 15,
    unit: 'count',
    trend: 'up',
    changePercent: 20
  },
  {
    name: 'Pilot Tenants',
    current: 5,
    target: 3,
    unit: 'count',
    trend: 'up',
    changePercent: 67
  }
];

// ============================================================================
// Hero KPIs
// ============================================================================

export const heroKPIs = {
  totalTasks: {
    label: 'Total Tasks',
    value: 8547,
    trend: 'up' as const,
    changePercent: 23.5,
    icon: 'tasks'
  },
  activeAgents: {
    label: 'Active Agents',
    value: 12,
    trend: 'up' as const,
    changePercent: 9.1,
    icon: 'robot'
  },
  satisfactionRate: {
    label: 'Satisfaction Rate',
    value: 94.2,
    unit: '%',
    trend: 'up' as const,
    changePercent: 2.8,
    icon: 'smile'
  },
  activeUsers: {
    label: 'Active Users',
    value: 342,
    trend: 'up' as const,
    changePercent: 15.3,
    icon: 'users'
  },
  successRate: {
    label: 'Success Rate',
    value: 96.8,
    unit: '%',
    trend: 'stable' as const,
    changePercent: 0.4,
    icon: 'check'
  },
  totalMessages: {
    label: 'Total Messages',
    value: 45293,
    trend: 'up' as const,
    changePercent: 31.2,
    icon: 'message'
  },
  avgResponseTime: {
    label: 'Avg Response Time',
    value: 2.3,
    unit: 'sec',
    trend: 'down' as const,
    changePercent: -12.5,
    icon: 'clock'
  }
};

// ============================================================================
// Agent Performance Data
// ============================================================================

export const agentPerformance: AgentPerformance[] = [
  {
    id: 'agent-001',
    name: 'Budget Assistant',
    description: 'Helps with budget analysis, forecasting, and financial reporting',
    tasksCount: 1847,
    messagesCount: 9856,
    satisfactionRate: 96.5,
    successRate: 98.2,
    avgResponseTime: 2.1,
    avgStreamTime: 1.8,
    status: 'active',
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    category: 'Finance',
    tags: ['finance', 'budgeting', 'analysis'],
    timeSeriesData: generateTimeSeriesData(30, 62, 20)
  },
  {
    id: 'agent-002',
    name: 'Procurement Advisor',
    description: 'Assists with vendor evaluation, RFP management, and procurement compliance',
    tasksCount: 1234,
    messagesCount: 6789,
    satisfactionRate: 94.8,
    successRate: 97.1,
    avgResponseTime: 2.8,
    avgStreamTime: 2.3,
    status: 'active',
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    category: 'Procurement',
    tags: ['procurement', 'vendors', 'compliance'],
    timeSeriesData: generateTimeSeriesData(30, 41, 15)
  },
  {
    id: 'agent-003',
    name: 'Citizen Services Agent',
    description: 'Handles citizen inquiries, service requests, and information lookup',
    tasksCount: 2567,
    messagesCount: 15432,
    satisfactionRate: 92.3,
    successRate: 95.6,
    avgResponseTime: 1.5,
    avgStreamTime: 1.2,
    status: 'active',
    lastActive: new Date(Date.now() - 1800000).toISOString(),
    category: 'Customer Service',
    tags: ['citizen', 'service', 'support'],
    timeSeriesData: generateTimeSeriesData(30, 86, 25)
  },
  {
    id: 'agent-004',
    name: 'Compliance Checker',
    description: 'Reviews documents and processes for regulatory compliance',
    tasksCount: 892,
    messagesCount: 4231,
    satisfactionRate: 97.2,
    successRate: 99.1,
    avgResponseTime: 3.4,
    avgStreamTime: 2.9,
    status: 'active',
    lastActive: new Date(Date.now() - 10800000).toISOString(),
    category: 'Governance',
    tags: ['compliance', 'regulations', 'audit'],
    timeSeriesData: generateTimeSeriesData(30, 30, 10)
  },
  {
    id: 'agent-005',
    name: 'HR Assistant',
    description: 'Supports employee onboarding, policy questions, and benefits information',
    tasksCount: 743,
    messagesCount: 3892,
    satisfactionRate: 95.1,
    successRate: 97.8,
    avgResponseTime: 1.9,
    avgStreamTime: 1.6,
    status: 'active',
    lastActive: new Date(Date.now() - 5400000).toISOString(),
    category: 'Human Resources',
    tags: ['hr', 'employees', 'benefits'],
    timeSeriesData: generateTimeSeriesData(30, 25, 8)
  },
  {
    id: 'agent-006',
    name: 'Contract Reviewer',
    description: 'Analyzes contracts for terms, conditions, and potential risks',
    tasksCount: 456,
    messagesCount: 2341,
    satisfactionRate: 93.7,
    successRate: 96.4,
    avgResponseTime: 4.2,
    avgStreamTime: 3.7,
    status: 'active',
    lastActive: new Date(Date.now() - 14400000).toISOString(),
    category: 'Legal',
    tags: ['contracts', 'legal', 'risk'],
    timeSeriesData: generateTimeSeriesData(30, 15, 6)
  },
  {
    id: 'agent-007',
    name: 'Data Analyst',
    description: 'Performs data analysis, generates insights, and creates visualizations',
    tasksCount: 1089,
    messagesCount: 5678,
    satisfactionRate: 96.8,
    successRate: 98.5,
    avgResponseTime: 2.7,
    avgStreamTime: 2.2,
    status: 'active',
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    category: 'Analytics',
    tags: ['data', 'analytics', 'reporting'],
    timeSeriesData: generateTimeSeriesData(30, 36, 12)
  },
  {
    id: 'agent-008',
    name: 'Policy Guide',
    description: 'Provides information about government policies and procedures',
    tasksCount: 567,
    messagesCount: 2891,
    satisfactionRate: 91.4,
    successRate: 94.2,
    avgResponseTime: 2.0,
    avgStreamTime: 1.7,
    status: 'active',
    lastActive: new Date(Date.now() - 18000000).toISOString(),
    category: 'Information',
    tags: ['policy', 'procedures', 'guidance'],
    timeSeriesData: generateTimeSeriesData(30, 19, 7)
  },
  {
    id: 'agent-009',
    name: 'Permit Assistant',
    description: 'Helps with permit applications, status checks, and requirements',
    tasksCount: 834,
    messagesCount: 4567,
    satisfactionRate: 93.9,
    successRate: 96.7,
    avgResponseTime: 1.8,
    avgStreamTime: 1.5,
    status: 'active',
    lastActive: new Date(Date.now() - 9000000).toISOString(),
    category: 'Permitting',
    tags: ['permits', 'applications', 'requirements'],
    timeSeriesData: generateTimeSeriesData(30, 28, 9)
  },
  {
    id: 'agent-010',
    name: 'Meeting Coordinator',
    description: 'Schedules meetings, prepares agendas, and manages action items',
    tasksCount: 623,
    messagesCount: 3214,
    satisfactionRate: 94.6,
    successRate: 97.3,
    avgResponseTime: 1.6,
    avgStreamTime: 1.3,
    status: 'active',
    lastActive: new Date(Date.now() - 10800000).toISOString(),
    category: 'Administration',
    tags: ['meetings', 'scheduling', 'coordination'],
    timeSeriesData: generateTimeSeriesData(30, 21, 7)
  },
  {
    id: 'agent-011',
    name: 'Asset Manager',
    description: 'Tracks and manages government assets, maintenance, and inventory',
    tasksCount: 412,
    messagesCount: 2134,
    satisfactionRate: 95.3,
    successRate: 98.1,
    avgResponseTime: 2.4,
    avgStreamTime: 2.0,
    status: 'active',
    lastActive: new Date(Date.now() - 21600000).toISOString(),
    category: 'Operations',
    tags: ['assets', 'maintenance', 'inventory'],
    timeSeriesData: generateTimeSeriesData(30, 14, 5)
  },
  {
    id: 'agent-012',
    name: 'Training Bot',
    description: 'Provides training materials and answers questions about system usage',
    tasksCount: 283,
    messagesCount: 1268,
    satisfactionRate: 89.7,
    successRate: 92.4,
    avgResponseTime: 1.4,
    avgStreamTime: 1.1,
    status: 'maintenance',
    lastActive: new Date(Date.now() - 86400000).toISOString(),
    category: 'Training',
    tags: ['training', 'education', 'support'],
    timeSeriesData: generateTimeSeriesData(30, 9, 4)
  }
];

// ============================================================================
// Skill Usage Data
// ============================================================================

export const skillUsage: SkillUsage[] = [
  {
    id: 'skill-001',
    name: 'Budget Analysis',
    description: 'Analyze budget data and identify variances, trends, and anomalies',
    category: 'Finance',
    executionsCount: 3421,
    avgExecutionTime: 2.8,
    successRate: 97.6,
    errorRate: 2.4,
    lastUsed: new Date(Date.now() - 3600000).toISOString(),
    timesReferenced: 4123,
    toolCallsCount: 8942,
    agentIds: ['agent-001', 'agent-007']
  },
  {
    id: 'skill-002',
    name: 'Document Search',
    description: 'Search through documents and knowledge base for relevant information',
    category: 'Information Retrieval',
    executionsCount: 8934,
    avgExecutionTime: 1.2,
    successRate: 98.9,
    errorRate: 1.1,
    lastUsed: new Date(Date.now() - 1800000).toISOString(),
    timesReferenced: 9876,
    toolCallsCount: 15432,
    agentIds: ['agent-003', 'agent-008', 'agent-009']
  },
  {
    id: 'skill-003',
    name: 'Vendor Evaluation',
    description: 'Score and compare vendor proposals against evaluation criteria',
    category: 'Procurement',
    executionsCount: 1876,
    avgExecutionTime: 4.3,
    successRate: 96.2,
    errorRate: 3.8,
    lastUsed: new Date(Date.now() - 7200000).toISOString(),
    timesReferenced: 2341,
    toolCallsCount: 5234,
    agentIds: ['agent-002']
  },
  {
    id: 'skill-004',
    name: 'Compliance Validation',
    description: 'Check documents and processes against compliance requirements',
    category: 'Governance',
    executionsCount: 2567,
    avgExecutionTime: 3.7,
    successRate: 99.1,
    errorRate: 0.9,
    lastUsed: new Date(Date.now() - 10800000).toISOString(),
    timesReferenced: 2892,
    toolCallsCount: 6789,
    agentIds: ['agent-004', 'agent-002']
  },
  {
    id: 'skill-005',
    name: 'Data Visualization',
    description: 'Create charts and graphs from data sets',
    category: 'Analytics',
    executionsCount: 1543,
    avgExecutionTime: 2.1,
    successRate: 95.4,
    errorRate: 4.6,
    lastUsed: new Date(Date.now() - 5400000).toISOString(),
    timesReferenced: 1876,
    toolCallsCount: 3421,
    agentIds: ['agent-007', 'agent-001']
  },
  {
    id: 'skill-006',
    name: 'Natural Language Query',
    description: 'Convert natural language questions into database queries',
    category: 'Data Access',
    executionsCount: 6789,
    avgExecutionTime: 1.6,
    successRate: 94.7,
    errorRate: 5.3,
    lastUsed: new Date(Date.now() - 3600000).toISOString(),
    timesReferenced: 7234,
    toolCallsCount: 12456,
    agentIds: ['agent-003', 'agent-007', 'agent-009']
  },
  {
    id: 'skill-007',
    name: 'Contract Analysis',
    description: 'Review contracts for key terms, risks, and compliance issues',
    category: 'Legal',
    executionsCount: 892,
    avgExecutionTime: 5.2,
    successRate: 97.8,
    errorRate: 2.2,
    lastUsed: new Date(Date.now() - 14400000).toISOString(),
    timesReferenced: 1123,
    toolCallsCount: 2456,
    agentIds: ['agent-006', 'agent-002']
  },
  {
    id: 'skill-008',
    name: 'Report Generation',
    description: 'Generate formatted reports from templates and data',
    category: 'Content',
    executionsCount: 2341,
    avgExecutionTime: 3.4,
    successRate: 98.3,
    errorRate: 1.7,
    lastUsed: new Date(Date.now() - 7200000).toISOString(),
    timesReferenced: 2678,
    toolCallsCount: 5432,
    agentIds: ['agent-001', 'agent-007', 'agent-004']
  },
  {
    id: 'skill-009',
    name: 'Sentiment Analysis',
    description: 'Analyze sentiment and tone in text content',
    category: 'Analytics',
    executionsCount: 4567,
    avgExecutionTime: 0.8,
    successRate: 96.5,
    errorRate: 3.5,
    lastUsed: new Date(Date.now() - 1800000).toISOString(),
    timesReferenced: 5234,
    toolCallsCount: 7891,
    agentIds: ['agent-003', 'agent-005']
  },
  {
    id: 'skill-010',
    name: 'Form Filling',
    description: 'Extract information from context and populate form fields',
    category: 'Automation',
    executionsCount: 3789,
    avgExecutionTime: 1.9,
    successRate: 97.2,
    errorRate: 2.8,
    lastUsed: new Date(Date.now() - 9000000).toISOString(),
    timesReferenced: 4321,
    toolCallsCount: 6789,
    agentIds: ['agent-009', 'agent-002']
  },
  {
    id: 'skill-011',
    name: 'Calendar Management',
    description: 'Schedule, reschedule, and manage calendar events',
    category: 'Administration',
    executionsCount: 2134,
    avgExecutionTime: 1.3,
    successRate: 98.7,
    errorRate: 1.3,
    lastUsed: new Date(Date.now() - 10800000).toISOString(),
    timesReferenced: 2567,
    toolCallsCount: 4123,
    agentIds: ['agent-010']
  },
  {
    id: 'skill-012',
    name: 'Asset Tracking',
    description: 'Track asset location, status, and maintenance history',
    category: 'Operations',
    executionsCount: 1456,
    avgExecutionTime: 2.6,
    successRate: 98.9,
    errorRate: 1.1,
    lastUsed: new Date(Date.now() - 21600000).toISOString(),
    timesReferenced: 1789,
    toolCallsCount: 3421,
    agentIds: ['agent-011']
  },
  {
    id: 'skill-013',
    name: 'Email Drafting',
    description: 'Draft professional emails based on context and intent',
    category: 'Communication',
    executionsCount: 5432,
    avgExecutionTime: 1.7,
    successRate: 95.8,
    errorRate: 4.2,
    lastUsed: new Date(Date.now() - 5400000).toISOString(),
    timesReferenced: 6123,
    toolCallsCount: 8934,
    agentIds: ['agent-003', 'agent-005', 'agent-010']
  },
  {
    id: 'skill-014',
    name: 'Knowledge Synthesis',
    description: 'Combine information from multiple sources into coherent summaries',
    category: 'Information',
    executionsCount: 3214,
    avgExecutionTime: 3.1,
    successRate: 94.3,
    errorRate: 5.7,
    lastUsed: new Date(Date.now() - 7200000).toISOString(),
    timesReferenced: 3892,
    toolCallsCount: 6234,
    agentIds: ['agent-008', 'agent-012']
  },
  {
    id: 'skill-015',
    name: 'Workflow Automation',
    description: 'Automate multi-step workflows and approval processes',
    category: 'Automation',
    executionsCount: 1876,
    avgExecutionTime: 4.8,
    successRate: 96.1,
    errorRate: 3.9,
    lastUsed: new Date(Date.now() - 14400000).toISOString(),
    timesReferenced: 2234,
    toolCallsCount: 5678,
    agentIds: ['agent-002', 'agent-009']
  }
];

// ============================================================================
// Tool Call Statistics
// ============================================================================

export const toolCallStats: ToolCallStats[] = [
  {
    id: 'tool-001',
    name: 'OpenGov Budget API',
    type: 'api',
    callCount: 12456,
    avgLatency: 342,
    errorRate: 1.2,
    successRate: 98.8,
    lastCalled: new Date(Date.now() - 3600000).toISOString(),
    skillIds: ['skill-001', 'skill-008']
  },
  {
    id: 'tool-002',
    name: 'Document Database',
    type: 'database',
    callCount: 23891,
    avgLatency: 89,
    errorRate: 0.6,
    successRate: 99.4,
    lastCalled: new Date(Date.now() - 1800000).toISOString(),
    skillIds: ['skill-002', 'skill-014']
  },
  {
    id: 'tool-003',
    name: 'Postgres Query Engine',
    type: 'database',
    callCount: 18734,
    avgLatency: 156,
    errorRate: 2.3,
    successRate: 97.7,
    lastCalled: new Date(Date.now() - 3600000).toISOString(),
    skillIds: ['skill-006', 'skill-012']
  },
  {
    id: 'tool-004',
    name: 'Chart Generator',
    type: 'utility',
    callCount: 4567,
    avgLatency: 423,
    errorRate: 3.1,
    successRate: 96.9,
    lastCalled: new Date(Date.now() - 5400000).toISOString(),
    skillIds: ['skill-005']
  },
  {
    id: 'tool-005',
    name: 'OpenGov Procurement API',
    type: 'api',
    callCount: 8934,
    avgLatency: 412,
    errorRate: 1.8,
    successRate: 98.2,
    lastCalled: new Date(Date.now() - 7200000).toISOString(),
    skillIds: ['skill-003', 'skill-015']
  },
  {
    id: 'tool-006',
    name: 'Compliance Rules Engine',
    type: 'mcp_server',
    callCount: 6789,
    avgLatency: 234,
    errorRate: 0.4,
    successRate: 99.6,
    lastCalled: new Date(Date.now() - 10800000).toISOString(),
    mcpServer: 'compliance-mcp',
    skillIds: ['skill-004']
  },
  {
    id: 'tool-007',
    name: 'Email Service',
    type: 'integration',
    callCount: 9876,
    avgLatency: 567,
    errorRate: 2.7,
    successRate: 97.3,
    lastCalled: new Date(Date.now() - 5400000).toISOString(),
    skillIds: ['skill-013']
  },
  {
    id: 'tool-008',
    name: 'Calendar API',
    type: 'integration',
    callCount: 5432,
    avgLatency: 289,
    errorRate: 1.5,
    successRate: 98.5,
    lastCalled: new Date(Date.now() - 10800000).toISOString(),
    skillIds: ['skill-011']
  },
  {
    id: 'tool-009',
    name: 'PDF Generator',
    type: 'utility',
    callCount: 7234,
    avgLatency: 1234,
    errorRate: 2.1,
    successRate: 97.9,
    lastCalled: new Date(Date.now() - 7200000).toISOString(),
    skillIds: ['skill-008']
  },
  {
    id: 'tool-010',
    name: 'Sentiment Analysis API',
    type: 'api',
    callCount: 11234,
    avgLatency: 178,
    errorRate: 1.9,
    successRate: 98.1,
    lastCalled: new Date(Date.now() - 1800000).toISOString(),
    skillIds: ['skill-009']
  },
  {
    id: 'tool-011',
    name: 'Vector Search',
    type: 'mcp_server',
    callCount: 15678,
    avgLatency: 67,
    errorRate: 0.8,
    successRate: 99.2,
    lastCalled: new Date(Date.now() - 1800000).toISOString(),
    mcpServer: 'vector-db-mcp',
    skillIds: ['skill-002', 'skill-014']
  },
  {
    id: 'tool-012',
    name: 'File Storage',
    type: 'file_system',
    callCount: 13456,
    avgLatency: 234,
    errorRate: 1.3,
    successRate: 98.7,
    lastCalled: new Date(Date.now() - 5400000).toISOString(),
    skillIds: ['skill-002', 'skill-008']
  },
  {
    id: 'tool-013',
    name: 'OpenAI Embeddings',
    type: 'api',
    callCount: 9876,
    avgLatency: 456,
    errorRate: 1.6,
    successRate: 98.4,
    lastCalled: new Date(Date.now() - 3600000).toISOString(),
    skillIds: ['skill-002']
  },
  {
    id: 'tool-014',
    name: 'Asset Management System',
    type: 'api',
    callCount: 4321,
    avgLatency: 378,
    errorRate: 2.4,
    successRate: 97.6,
    lastCalled: new Date(Date.now() - 21600000).toISOString(),
    skillIds: ['skill-012']
  },
  {
    id: 'tool-015',
    name: 'Form Parser',
    type: 'utility',
    callCount: 6789,
    avgLatency: 201,
    errorRate: 3.2,
    successRate: 96.8,
    lastCalled: new Date(Date.now() - 9000000).toISOString(),
    skillIds: ['skill-010']
  },
  {
    id: 'tool-016',
    name: 'Contract Analysis MCP',
    type: 'mcp_server',
    callCount: 3421,
    avgLatency: 892,
    errorRate: 1.1,
    successRate: 98.9,
    lastCalled: new Date(Date.now() - 14400000).toISOString(),
    mcpServer: 'legal-analysis-mcp',
    skillIds: ['skill-007']
  }
];

// ============================================================================
// User Activity Data
// ============================================================================

export const userActivity: UserActivity[] = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@springfield.gov',
    role: 'Budget Director',
    tasksCount: 234,
    messagesCount: 1456,
    avgSessionDuration: 28,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    satisfactionGiven: 45,
    firstSeen: '2024-08-15T08:00:00Z',
    agentInteractions: [
      { agentId: 'agent-001', count: 187 },
      { agentId: 'agent-007', count: 47 }
    ]
  },
  {
    id: 'user-002',
    name: 'Michael Chen',
    email: 'michael.chen@springfield.gov',
    role: 'Procurement Manager',
    tasksCount: 189,
    messagesCount: 987,
    avgSessionDuration: 32,
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    satisfactionGiven: 38,
    firstSeen: '2024-08-20T09:00:00Z',
    agentInteractions: [
      { agentId: 'agent-002', count: 143 },
      { agentId: 'agent-006', count: 46 }
    ]
  },
  {
    id: 'user-003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@springfield.gov',
    role: 'Customer Service Rep',
    tasksCount: 567,
    messagesCount: 3421,
    avgSessionDuration: 19,
    lastActive: new Date(Date.now() - 1800000).toISOString(),
    satisfactionGiven: 89,
    firstSeen: '2024-07-10T10:00:00Z',
    agentInteractions: [
      { agentId: 'agent-003', count: 512 },
      { agentId: 'agent-009', count: 55 }
    ]
  },
  {
    id: 'user-004',
    name: 'David Kim',
    email: 'david.kim@springfield.gov',
    role: 'Compliance Officer',
    tasksCount: 156,
    messagesCount: 823,
    avgSessionDuration: 41,
    lastActive: new Date(Date.now() - 10800000).toISOString(),
    satisfactionGiven: 31,
    firstSeen: '2024-09-01T08:30:00Z',
    agentInteractions: [
      { agentId: 'agent-004', count: 134 },
      { agentId: 'agent-008', count: 22 }
    ]
  },
  {
    id: 'user-005',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@springfield.gov',
    role: 'HR Specialist',
    tasksCount: 143,
    messagesCount: 712,
    avgSessionDuration: 24,
    lastActive: new Date(Date.now() - 5400000).toISOString(),
    satisfactionGiven: 28,
    firstSeen: '2024-08-25T11:00:00Z',
    agentInteractions: [
      { agentId: 'agent-005', count: 143 }
    ]
  },
  {
    id: 'user-006',
    name: 'Robert Taylor',
    email: 'robert.taylor@springfield.gov',
    role: 'Data Analyst',
    tasksCount: 298,
    messagesCount: 1678,
    avgSessionDuration: 35,
    lastActive: new Date(Date.now() - 7200000).toISOString(),
    satisfactionGiven: 54,
    firstSeen: '2024-07-20T09:30:00Z',
    agentInteractions: [
      { agentId: 'agent-007', count: 267 },
      { agentId: 'agent-001', count: 31 }
    ]
  },
  {
    id: 'user-007',
    name: 'Amanda White',
    email: 'amanda.white@springfield.gov',
    role: 'Permit Coordinator',
    tasksCount: 412,
    messagesCount: 2134,
    avgSessionDuration: 22,
    lastActive: new Date(Date.now() - 9000000).toISOString(),
    satisfactionGiven: 67,
    firstSeen: '2024-07-15T08:00:00Z',
    agentInteractions: [
      { agentId: 'agent-009', count: 389 },
      { agentId: 'agent-003', count: 23 }
    ]
  },
  {
    id: 'user-008',
    name: 'James Wilson',
    email: 'james.wilson@springfield.gov',
    role: 'City Manager',
    tasksCount: 89,
    messagesCount: 456,
    avgSessionDuration: 45,
    lastActive: new Date(Date.now() - 14400000).toISOString(),
    satisfactionGiven: 18,
    firstSeen: '2024-08-01T07:30:00Z',
    agentInteractions: [
      { agentId: 'agent-001', count: 34 },
      { agentId: 'agent-007', count: 28 },
      { agentId: 'agent-010', count: 27 }
    ]
  },
  {
    id: 'user-009',
    name: 'Maria Garcia',
    email: 'maria.garcia@springfield.gov',
    role: 'Finance Analyst',
    tasksCount: 267,
    messagesCount: 1432,
    avgSessionDuration: 31,
    lastActive: new Date(Date.now() - 3600000).toISOString(),
    satisfactionGiven: 52,
    firstSeen: '2024-08-10T09:00:00Z',
    agentInteractions: [
      { agentId: 'agent-001', count: 234 },
      { agentId: 'agent-007', count: 33 }
    ]
  },
  {
    id: 'user-010',
    name: 'Thomas Brown',
    email: 'thomas.brown@springfield.gov',
    role: 'Operations Manager',
    tasksCount: 178,
    messagesCount: 892,
    avgSessionDuration: 27,
    lastActive: new Date(Date.now() - 21600000).toISOString(),
    satisfactionGiven: 34,
    firstSeen: '2024-09-05T10:00:00Z',
    agentInteractions: [
      { agentId: 'agent-011', count: 156 },
      { agentId: 'agent-010', count: 22 }
    ]
  }
];

// ============================================================================
// Feedback Data
// ============================================================================

export const feedbackData: FeedbackEntry[] = [
  {
    id: 'feedback-001',
    taskId: 'task-1234',
    messageId: 'msg-5678',
    userId: 'user-001',
    agentId: 'agent-001',
    rating: 'positive',
    comment: 'Very helpful with budget variance analysis. Clear explanations.',
    sentiment: 'very_positive',
    category: 'helpfulness',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-002',
    taskId: 'task-1235',
    messageId: 'msg-5679',
    userId: 'user-003',
    agentId: 'agent-003',
    rating: 'positive',
    comment: 'Quick response and accurate information about permit requirements.',
    sentiment: 'positive',
    category: 'speed',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-003',
    taskId: 'task-1236',
    messageId: 'msg-5680',
    userId: 'user-002',
    agentId: 'agent-002',
    rating: 'negative',
    comment: 'Did not provide complete vendor scoring criteria.',
    sentiment: 'negative',
    category: 'completeness',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    resolved: false,
    resolutionNotes: 'Need to improve skill-003 vendor evaluation completeness'
  },
  {
    id: 'feedback-004',
    taskId: 'task-1237',
    messageId: 'msg-5681',
    userId: 'user-004',
    agentId: 'agent-004',
    rating: 'positive',
    comment: 'Thorough compliance check, caught an issue I missed.',
    sentiment: 'very_positive',
    category: 'accuracy',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-005',
    taskId: 'task-1238',
    messageId: 'msg-5682',
    userId: 'user-006',
    agentId: 'agent-007',
    rating: 'positive',
    comment: 'Great data visualizations, easy to understand trends.',
    sentiment: 'positive',
    category: 'clarity',
    timestamp: new Date(Date.now() - 18000000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-006',
    taskId: 'task-1239',
    messageId: 'msg-5683',
    userId: 'user-005',
    agentId: 'agent-005',
    rating: 'positive',
    comment: 'Helpful with benefits questions.',
    sentiment: 'positive',
    category: 'helpfulness',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-007',
    taskId: 'task-1240',
    messageId: 'msg-5684',
    userId: 'user-007',
    agentId: 'agent-009',
    rating: 'negative',
    comment: 'Response was a bit slow and required multiple clarifications.',
    sentiment: 'negative',
    category: 'speed',
    timestamp: new Date(Date.now() - 25200000).toISOString(),
    resolved: false,
    resolutionNotes: 'Investigating latency issues with skill-010'
  },
  {
    id: 'feedback-008',
    taskId: 'task-1241',
    messageId: 'msg-5685',
    userId: 'user-001',
    agentId: 'agent-001',
    rating: 'positive',
    comment: 'Excellent forecasting capabilities.',
    sentiment: 'very_positive',
    category: 'accuracy',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-009',
    taskId: 'task-1242',
    messageId: 'msg-5686',
    userId: 'user-008',
    agentId: 'agent-010',
    rating: 'positive',
    comment: 'Efficiently scheduled our council meeting.',
    sentiment: 'positive',
    category: 'helpfulness',
    timestamp: new Date(Date.now() - 32400000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-010',
    taskId: 'task-1243',
    messageId: 'msg-5687',
    userId: 'user-003',
    agentId: 'agent-003',
    rating: 'positive',
    comment: 'Great for handling citizen inquiries.',
    sentiment: 'positive',
    category: 'accuracy',
    timestamp: new Date(Date.now() - 36000000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-011',
    taskId: 'task-1244',
    messageId: 'msg-5688',
    userId: 'user-002',
    agentId: 'agent-006',
    rating: 'positive',
    comment: 'Detailed contract analysis, identified key risks.',
    sentiment: 'very_positive',
    category: 'completeness',
    timestamp: new Date(Date.now() - 39600000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-012',
    taskId: 'task-1245',
    messageId: 'msg-5689',
    userId: 'user-009',
    agentId: 'agent-001',
    rating: 'positive',
    comment: 'Clear budget explanations.',
    sentiment: 'positive',
    category: 'clarity',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-013',
    taskId: 'task-1246',
    messageId: 'msg-5690',
    userId: 'user-010',
    agentId: 'agent-011',
    rating: 'negative',
    comment: 'Asset tracking info was outdated.',
    sentiment: 'negative',
    category: 'accuracy',
    timestamp: new Date(Date.now() - 46800000).toISOString(),
    resolved: false,
    resolutionNotes: 'Need to update asset database sync frequency'
  },
  {
    id: 'feedback-014',
    taskId: 'task-1247',
    messageId: 'msg-5691',
    userId: 'user-004',
    agentId: 'agent-008',
    rating: 'positive',
    comment: 'Policy information was accurate and up to date.',
    sentiment: 'positive',
    category: 'accuracy',
    timestamp: new Date(Date.now() - 50400000).toISOString(),
    resolved: true
  },
  {
    id: 'feedback-015',
    taskId: 'task-1248',
    messageId: 'msg-5692',
    userId: 'user-006',
    agentId: 'agent-007',
    rating: 'positive',
    comment: 'Excellent data insights.',
    sentiment: 'very_positive',
    category: 'helpfulness',
    timestamp: new Date(Date.now() - 54000000).toISOString(),
    resolved: true
  }
];

// ============================================================================
// Guardrail Violations
// ============================================================================

export const guardrailViolations: GuardrailViolation[] = [
  {
    id: 'violation-001',
    type: 'user_message',
    violationType: 'pii_exposure',
    severity: 'high',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    agentId: 'agent-003',
    taskId: 'task-5678',
    userId: 'user-003',
    description: 'User included SSN in message text',
    action: 'redacted',
    resolved: true
  },
  {
    id: 'violation-002',
    type: 'user_message',
    violationType: 'inappropriate_content',
    severity: 'medium',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    agentId: 'agent-003',
    taskId: 'task-5679',
    userId: 'user-003',
    description: 'Profanity detected in user message',
    action: 'flagged',
    resolved: true
  },
  {
    id: 'violation-003',
    type: 'agent_message',
    violationType: 'sensitive_data',
    severity: 'critical',
    timestamp: new Date(Date.now() - 21600000).toISOString(),
    agentId: 'agent-001',
    taskId: 'task-5680',
    description: 'Agent attempted to expose salary information',
    action: 'blocked',
    resolved: true
  },
  {
    id: 'violation-004',
    type: 'user_message',
    violationType: 'policy_violation',
    severity: 'low',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    agentId: 'agent-002',
    taskId: 'task-5681',
    userId: 'user-002',
    description: 'Attempted to bypass approval workflow',
    action: 'warned',
    resolved: true
  },
  {
    id: 'violation-005',
    type: 'user_message',
    violationType: 'pii_exposure',
    severity: 'high',
    timestamp: new Date(Date.now() - 36000000).toISOString(),
    agentId: 'agent-005',
    taskId: 'task-5682',
    userId: 'user-005',
    description: 'Credit card number detected in upload',
    action: 'blocked',
    resolved: true
  },
  {
    id: 'violation-006',
    type: 'agent_message',
    violationType: 'bias_detected',
    severity: 'medium',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    agentId: 'agent-005',
    taskId: 'task-5683',
    description: 'Potential bias in candidate evaluation response',
    action: 'flagged',
    resolved: false
  },
  {
    id: 'violation-007',
    type: 'user_message',
    violationType: 'harmful_content',
    severity: 'high',
    timestamp: new Date(Date.now() - 50400000).toISOString(),
    agentId: 'agent-003',
    taskId: 'task-5684',
    userId: 'user-003',
    description: 'Threat detected in citizen inquiry',
    action: 'blocked',
    resolved: true
  },
  {
    id: 'violation-008',
    type: 'agent_message',
    violationType: 'pii_exposure',
    severity: 'critical',
    timestamp: new Date(Date.now() - 57600000).toISOString(),
    agentId: 'agent-009',
    taskId: 'task-5685',
    description: 'Agent included resident address in public response',
    action: 'blocked',
    resolved: true
  }
];

// ============================================================================
// Model Provider Statistics
// ============================================================================

export const modelProviderStats: ModelProviderStats[] = [
  {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    callCount: 32567,
    tokenCount: {
      input: 45678234,
      output: 12345678,
      total: 58023912
    },
    cost: 1156.48,
    avgLatency: 1234,
    errorRate: 0.6,
    timeSeriesData: generateTimeSeriesData(24, 1357, 200)
  },
  {
    provider: 'anthropic',
    model: 'claude-3-haiku-20240307',
    callCount: 18934,
    tokenCount: {
      input: 23456789,
      output: 6789123,
      total: 30245912
    },
    cost: 302.46,
    avgLatency: 678,
    errorRate: 0.4,
    timeSeriesData: generateTimeSeriesData(24, 789, 150)
  },
  {
    provider: 'openai',
    model: 'gpt-4-turbo-preview',
    callCount: 5678,
    tokenCount: {
      input: 8901234,
      output: 2345678,
      total: 11246912
    },
    cost: 337.41,
    avgLatency: 1567,
    errorRate: 1.2,
    timeSeriesData: generateTimeSeriesData(24, 237, 80)
  },
  {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    callCount: 3421,
    tokenCount: {
      input: 4567890,
      output: 1234567,
      total: 5802457
    },
    cost: 29.01,
    avgLatency: 892,
    errorRate: 0.8,
    timeSeriesData: generateTimeSeriesData(24, 143, 50)
  }
];

// ============================================================================
// Time Series Data for Charts
// ============================================================================

export const timeSeriesData = {
  dailyTaskVolume: generateTimeSeriesData(30, 285, 60).map((point, index) => ({
    ...point,
    label: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })),

  hourlyActivity: generateTimeSeriesData(24, 356, 80).map((point, index) => ({
    ...point,
    label: new Date(point.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
  })),

  weeklyGrowth: (() => {
    const now = new Date();
    const weeks: TimeSeriesDataPoint[] = [];
    let baseValue = 1200;

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7));
      baseValue += Math.floor(Math.random() * 150) + 100; // growing trend

      weeks.push({
        timestamp: weekStart.toISOString(),
        value: baseValue,
        label: `Week ${12 - i}`
      });
    }

    return weeks;
  })()
};

// ============================================================================
// Feedback Processing Flywheel
// ============================================================================

export const feedbackFlywheel: FeedbackFlywheel = {
  feedbackQueue: {
    pending: 23,
    processing: 7,
    avgWaitTime: 12.5
  },
  assessments: {
    pending: 15,
    completed: 187,
    avgCompletionTime: 18.3
  },
  suggestedChanges: {
    pendingOGReview: 8,
    approved: 42,
    rejected: 5
  },
  implementation: {
    changesImplemented: 38,
    avgImplementationTime: 5.2,
    successRate: 94.7
  }
};

// ============================================================================
// Complete Dashboard Data Export
// ============================================================================

export const dashboardMockData: DashboardData = {
  goalMetrics,
  heroKPIs,
  agentPerformance,
  skillUsage,
  toolCallStats,
  userActivity,
  feedbackData,
  guardrailViolations,
  modelProviderStats,
  timeSeriesData,
  feedbackFlywheel
};

// ============================================================================
// Utility Functions for Data Access
// ============================================================================

/**
 * Get agent performance data by ID
 */
export function getAgentById(agentId: string): AgentPerformance | undefined {
  return agentPerformance.find(agent => agent.id === agentId);
}

/**
 * Get top performing agents by satisfaction rate
 */
export function getTopAgentsBySatisfaction(limit: number = 5): AgentPerformance[] {
  return [...agentPerformance]
    .sort((a, b) => b.satisfactionRate - a.satisfactionRate)
    .slice(0, limit);
}

/**
 * Get most used skills
 */
export function getTopSkills(limit: number = 10): SkillUsage[] {
  return [...skillUsage]
    .sort((a, b) => b.executionsCount - a.executionsCount)
    .slice(0, limit);
}

/**
 * Get recent feedback (last N entries)
 */
export function getRecentFeedback(limit: number = 10): FeedbackEntry[] {
  return [...feedbackData]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/**
 * Get unresolved guardrail violations
 */
export function getUnresolvedViolations(): GuardrailViolation[] {
  return guardrailViolations.filter(v => !v.resolved);
}

/**
 * Calculate overall satisfaction rate
 */
export function calculateOverallSatisfaction(): number {
  const positive = feedbackData.filter(f => f.rating === 'positive').length;
  const total = feedbackData.length;
  return total > 0 ? (positive / total) * 100 : 0;
}

/**
 * Get total model costs
 */
export function getTotalModelCost(): number {
  return modelProviderStats.reduce((sum, provider) => sum + provider.cost, 0);
}

/**
 * Get active users in last N days
 */
export function getActiveUsersInPeriod(days: number): UserActivity[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return userActivity.filter(user =>
    new Date(user.lastActive) >= cutoffDate
  );
}

// Default export
export default dashboardMockData;
