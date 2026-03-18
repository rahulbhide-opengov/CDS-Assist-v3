import type { OGTool } from '../types/opengov';

export const mockTools: OGTool[] = [
  {
    id: 'search-documents',
    name: 'Search Documents',
    description: 'Search through government documents and records using natural language queries',
    category: 'Information Retrieval',
    type: 'api',
    status: 'published',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/search/documents',
    authentication: {
      type: 'apiKey',
      config: { header: 'X-API-Key' }
    },
    parameters: [
      { name: 'query', in: 'query', type: 'string', required: true, description: 'Search query' },
      { name: 'limit', in: 'query', type: 'number', required: false, description: 'Result limit' },
      { name: 'filters', in: 'body', type: 'object', required: false, description: 'Search filters' }
    ],
    responses: [
      { status: 200, description: 'Successful search results' },
      { status: 400, description: 'Invalid query parameters' },
      { status: 401, description: 'Unauthorized' }
    ],
    usage: {
      count: 15234,
      lastUsed: '2024-03-15T14:30:00Z',
      errors: 23
    }
  },
  {
    id: 'database-query',
    name: 'Database Query',
    description: 'Execute queries against government databases with proper access controls',
    category: 'Data Access',
    type: 'database',
    status: 'published',
    createdAt: '2024-01-12T09:00:00Z',
    updatedAt: '2024-03-14T11:00:00Z',
    createdBy: 'system',
    endpoint: 'postgres://gov-db.internal:5432',
    authentication: {
      type: 'oauth2',
      config: { scope: 'database.read' }
    },
    parameters: [
      { name: 'query', in: 'body', type: 'string', required: true, description: 'SQL query' },
      { name: 'database', in: 'query', type: 'string', required: true, description: 'Database name' }
    ],
    responses: [
      { status: 200, description: 'Query executed successfully' },
      { status: 403, description: 'Insufficient permissions' }
    ],
    usage: {
      count: 8932,
      lastUsed: '2024-03-15T13:45:00Z',
      errors: 12
    }
  },
  {
    id: 'file-upload',
    name: 'File Upload',
    description: 'Securely upload and process various file formats',
    category: 'File Management',
    type: 'file',
    status: 'published',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-13T09:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/files/upload',
    authentication: {
      type: 'apiKey',
      config: { header: 'X-API-Key' }
    },
    parameters: [
      { name: 'file', in: 'body', type: 'binary', required: true, description: 'File to upload' },
      { name: 'metadata', in: 'body', type: 'object', required: false, description: 'File metadata' }
    ],
    responses: [
      { status: 201, description: 'File uploaded successfully' },
      { status: 413, description: 'File too large' }
    ],
    usage: {
      count: 4567,
      lastUsed: '2024-03-15T12:20:00Z',
      errors: 34
    }
  },
  {
    id: 'category-codes',
    name: 'Category Code Search',
    description: 'Search NIGP, NAICS, and UNSPSC category codes',
    category: 'Procurement',
    type: 'api',
    status: 'published',
    createdAt: '2024-01-18T11:00:00Z',
    updatedAt: '2024-03-12T14:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/procurement/codes',
    authentication: {
      type: 'none'
    },
    parameters: [
      { name: 'codeType', in: 'query', type: 'string', required: true, description: 'Code type (NIGP/NAICS/UNSPSC)' },
      { name: 'search', in: 'query', type: 'string', required: true, description: 'Search term' }
    ],
    responses: [
      { status: 200, description: 'Code results returned' }
    ],
    usage: {
      count: 6789,
      lastUsed: '2024-03-15T11:00:00Z',
      errors: 5
    }
  },
  {
    id: 'gis-integration',
    name: 'GIS Integration',
    description: 'Access geographic information system data and mapping services',
    category: 'Mapping',
    type: 'integration',
    status: 'published',
    createdAt: '2024-01-20T08:30:00Z',
    updatedAt: '2024-03-11T10:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/gis',
    authentication: {
      type: 'apiKey',
      config: { header: 'X-GIS-Token' }
    },
    parameters: [
      { name: 'coordinates', in: 'body', type: 'object', required: true, description: 'Lat/Long coordinates' },
      { name: 'layer', in: 'query', type: 'string', required: false, description: 'Map layer' }
    ],
    responses: [
      { status: 200, description: 'GIS data returned' }
    ],
    usage: {
      count: 3421,
      lastUsed: '2024-03-15T09:30:00Z',
      errors: 18
    }
  },
  {
    id: 'email-notification',
    name: 'Email Notification',
    description: 'Send automated email notifications to citizens and staff',
    category: 'Communication',
    type: 'utility',
    status: 'published',
    createdAt: '2024-01-22T09:00:00Z',
    updatedAt: '2024-03-10T15:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/notifications/email',
    authentication: {
      type: 'apiKey',
      config: { header: 'X-API-Key' }
    },
    parameters: [
      { name: 'to', in: 'body', type: 'array', required: true, description: 'Recipients' },
      { name: 'template', in: 'body', type: 'string', required: true, description: 'Email template ID' },
      { name: 'data', in: 'body', type: 'object', required: false, description: 'Template data' }
    ],
    responses: [
      { status: 202, description: 'Email queued' }
    ],
    usage: {
      count: 12456,
      lastUsed: '2024-03-15T15:00:00Z',
      errors: 67
    }
  },
  {
    id: 'pdf-generator',
    name: 'PDF Generator',
    description: 'Generate PDF documents from templates and data',
    category: 'Document Processing',
    type: 'utility',
    status: 'published',
    createdAt: '2024-01-25T10:30:00Z',
    updatedAt: '2024-03-09T11:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/documents/pdf',
    authentication: {
      type: 'apiKey',
      config: { header: 'X-API-Key' }
    },
    parameters: [
      { name: 'template', in: 'body', type: 'string', required: true, description: 'Template HTML' },
      { name: 'data', in: 'body', type: 'object', required: true, description: 'Data to inject' }
    ],
    responses: [
      { status: 200, description: 'PDF generated', schema: { type: 'binary' } }
    ],
    usage: {
      count: 8901,
      lastUsed: '2024-03-15T08:45:00Z',
      errors: 23
    }
  },
  {
    id: 'payment-processor',
    name: 'Payment Processor',
    description: 'Process online payments for government services',
    category: 'Financial',
    type: 'integration',
    status: 'published',
    createdAt: '2024-01-28T11:00:00Z',
    updatedAt: '2024-03-08T09:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/payments',
    authentication: {
      type: 'oauth2',
      config: { scope: 'payments.process' }
    },
    parameters: [
      { name: 'amount', in: 'body', type: 'number', required: true, description: 'Payment amount' },
      { name: 'method', in: 'body', type: 'string', required: true, description: 'Payment method' },
      { name: 'reference', in: 'body', type: 'string', required: true, description: 'Transaction reference' }
    ],
    responses: [
      { status: 200, description: 'Payment processed' },
      { status: 402, description: 'Payment failed' }
    ],
    usage: {
      count: 5678,
      lastUsed: '2024-03-15T10:15:00Z',
      errors: 89
    }
  },
  {
    id: 'weather-api',
    name: 'Weather API',
    description: 'Get weather data for emergency planning and operations',
    category: 'External Data',
    type: 'api',
    status: 'draft',
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-03-07T12:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/weather',
    authentication: {
      type: 'apiKey',
      config: { header: 'X-Weather-Key' }
    },
    parameters: [
      { name: 'location', in: 'query', type: 'string', required: true, description: 'Location' },
      { name: 'forecast', in: 'query', type: 'boolean', required: false, description: 'Include forecast' }
    ],
    responses: [
      { status: 200, description: 'Weather data returned' }
    ],
    usage: {
      count: 2345,
      lastUsed: '2024-03-14T16:00:00Z',
      errors: 12
    }
  },
  {
    id: 'analytics-engine',
    name: 'Analytics Engine',
    description: 'Run complex analytics and generate insights from government data',
    category: 'Analytics',
    type: 'database',
    status: 'draft',
    createdAt: '2024-02-05T09:30:00Z',
    updatedAt: '2024-03-06T14:00:00Z',
    createdBy: 'system',
    endpoint: '/api/v1/analytics',
    authentication: {
      type: 'oauth2',
      config: { scope: 'analytics.execute' }
    },
    parameters: [
      { name: 'analysis', in: 'body', type: 'object', required: true, description: 'Analysis configuration' },
      { name: 'dataset', in: 'body', type: 'string', required: true, description: 'Dataset ID' }
    ],
    responses: [
      { status: 200, description: 'Analysis complete' },
      { status: 500, description: 'Analysis failed' }
    ],
    usage: {
      count: 1234,
      lastUsed: '2024-03-13T11:30:00Z',
      errors: 45
    }
  }
];