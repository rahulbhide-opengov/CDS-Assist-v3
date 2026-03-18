/**
 * Mock Data Generator Utilities
 *
 * Factory functions for generating realistic mock data for all entity types.
 * Uses faker.js for realistic random data generation.
 */

import { faker } from '@faker-js/faker';
import type { OGAgent, OGSkill, OGTool, OGKnowledgeDocument } from '../types/opengov';

// Set seed for consistent results during development
faker.seed(123);

/**
 * Generate a random agent with realistic data
 */
export function generateAgent(overrides?: Partial<OGAgent>): OGAgent {
  const createdAt = faker.date.past({ years: 1 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  const status = faker.helpers.arrayElement(['published', 'draft', 'archived'] as const);

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      `${faker.word.adjective()} ${faker.word.noun()} Agent`,
      `${faker.company.buzzNoun()} Assistant`,
      `${faker.word.verb()} Coordinator`,
      `${faker.company.buzzAdjective()} Helper`
    ]),
    summary: faker.lorem.sentence({ min: 8, max: 15 }),
    description: faker.lorem.paragraph({ min: 2, max: 4 }),
    status,
    category: faker.helpers.arrayElement([
      'Support',
      'Analytics',
      'Procurement',
      'Finance',
      'Operations',
      'Compliance',
      'Communication',
      'Document Processing'
    ]),
    createdBy: faker.helpers.arrayElement(['OpenGov', faker.person.fullName()]),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    activity: {
      actions: faker.number.int({ min: 0, max: 2000 }),
      lastUsed: faker.date.recent({ days: 7 }).toISOString(),
      uniqueUsers: faker.number.int({ min: 1, max: 100 })
    },
    tags: faker.helpers.arrayElements([
      'automation',
      'ai',
      'workflow',
      'analytics',
      'reporting',
      'compliance',
      'citizen-services',
      'internal'
    ], { min: 2, max: 4 }),
    skills: faker.helpers.arrayElements([
      'data-analysis',
      'document-processing',
      'natural-language',
      'pattern-recognition',
      'forecasting'
    ], { min: 1, max: 3 }),
    ...overrides
  };
}

/**
 * Generate a random skill with realistic data
 */
export function generateSkill(overrides?: Partial<OGSkill>): OGSkill {
  const createdAt = faker.date.past({ years: 1 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  const status = faker.helpers.arrayElement(['published', 'draft', 'archived'] as const);

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      `${faker.word.verb()} ${faker.word.noun()}`,
      `${faker.word.adjective()} Analysis`,
      `${faker.company.buzzNoun()} Processing`
    ]),
    description: faker.lorem.sentence({ min: 10, max: 20 }),
    category: faker.helpers.arrayElement([
      'Analytics',
      'Content',
      'Governance',
      'Finance',
      'Procurement',
      'Communication',
      'Legal',
      'Data Management'
    ]),
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    createdBy: 'system',
    parameters: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () => ({
      name: faker.hacker.noun(),
      type: faker.helpers.arrayElement(['string', 'number', 'boolean', 'object', 'array'] as const),
      required: faker.datatype.boolean({ probability: 0.6 }),
      description: faker.lorem.sentence({ min: 5, max: 10 })
    })),
    examples: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () =>
      faker.lorem.sentence({ min: 5, max: 10 })
    ),
    usage: {
      count: faker.number.int({ min: 10, max: 5000 }),
      successRate: faker.number.int({ min: 85, max: 100 }),
      avgResponseTime: parseFloat(faker.number.float({ min: 0.5, max: 5.0, fractionDigits: 1 }).toFixed(1))
    },
    ...overrides
  };
}

/**
 * Generate a random tool with realistic data
 */
export function generateTool(overrides?: Partial<OGTool>): OGTool {
  const createdAt = faker.date.past({ years: 1 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  const status = faker.helpers.arrayElement(['published', 'draft', 'archived'] as const);
  const toolType = faker.helpers.arrayElement(['api', 'database', 'file', 'integration', 'utility'] as const);

  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      `${faker.word.verb()} ${faker.word.noun()}`,
      `${faker.company.buzzNoun()} API`,
      `${faker.word.adjective()} Service`
    ]),
    description: faker.lorem.sentence({ min: 10, max: 20 }),
    category: faker.helpers.arrayElement([
      'Information Retrieval',
      'Data Access',
      'File Management',
      'Communication',
      'Analytics',
      'Financial',
      'External Data'
    ]),
    type: toolType,
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    createdBy: 'system',
    endpoint: `/api/v1/${faker.word.noun()}/${faker.word.verb()}`,
    authentication: faker.helpers.arrayElement([
      { type: 'none' as const },
      { type: 'apiKey' as const, config: { header: 'X-API-Key' } },
      { type: 'oauth2' as const, config: { scope: faker.word.noun() } },
      { type: 'basic' as const, config: {} }
    ]),
    parameters: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
      name: faker.hacker.noun(),
      in: faker.helpers.arrayElement(['query', 'path', 'header', 'body'] as const),
      type: faker.helpers.arrayElement(['string', 'number', 'boolean', 'object']),
      required: faker.datatype.boolean({ probability: 0.5 }),
      description: faker.lorem.sentence({ min: 5, max: 10 })
    })),
    responses: [
      { status: 200, description: 'Success' },
      { status: 400, description: 'Bad Request' },
      { status: 401, description: 'Unauthorized' }
    ],
    usage: {
      count: faker.number.int({ min: 100, max: 20000 }),
      lastUsed: faker.date.recent({ days: 7 }).toISOString(),
      errors: faker.number.int({ min: 0, max: 100 })
    },
    ...overrides
  };
}

/**
 * Generate a random knowledge document
 */
export function generateKnowledgeDocument(overrides?: Partial<OGKnowledgeDocument>): OGKnowledgeDocument {
  const createdAt = faker.date.past({ years: 1 });
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
  const status = faker.helpers.arrayElement(['published', 'draft', 'archived'] as const);
  const docType = faker.helpers.arrayElement(['pdf', 'csv', 'excel', 'txt', 'markdown', 'word', 'html'] as const);

  const mimeTypes: Record<string, string> = {
    pdf: 'application/pdf',
    csv: 'text/csv',
    excel: 'application/vnd.ms-excel',
    txt: 'text/plain',
    markdown: 'text/markdown',
    word: 'application/msword',
    html: 'text/html'
  };

  return {
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      `${faker.date.month()} ${faker.date.recent().getFullYear()} ${faker.word.noun()} Report`,
      `${faker.company.buzzNoun()} Guidelines v${faker.number.int({ min: 1, max: 5 })}.${faker.number.int({ min: 0, max: 9 })}`,
      `${faker.word.adjective()} ${faker.word.noun()} Documentation`
    ]),
    content: faker.lorem.paragraphs({ min: 3, max: 6 }),
    type: docType,
    size: faker.number.int({ min: 1024, max: 10485760 }), // 1KB to 10MB
    mimeType: mimeTypes[docType],
    status,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    createdBy: faker.person.fullName(),
    tags: faker.helpers.arrayElements([
      'policy',
      'procedure',
      'report',
      'guidelines',
      'training',
      'reference',
      'compliance'
    ], { min: 2, max: 4 }),
    metadata: {
      author: faker.person.fullName(),
      version: `${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 9 })}`,
      department: faker.commerce.department(),
      category: faker.helpers.arrayElement(['Policy', 'Procedure', 'Report', 'Training', 'Reference']),
      keywords: faker.helpers.arrayElements([
        faker.word.noun(),
        faker.word.adjective(),
        faker.company.buzzVerb()
      ], { min: 3, max: 6 })
    },
    analytics: {
      views: faker.number.int({ min: 10, max: 1000 }),
      downloads: faker.number.int({ min: 0, max: 500 }),
      shares: faker.number.int({ min: 0, max: 100 }),
      lastViewed: faker.date.recent({ days: 30 }).toISOString()
    },
    ...overrides
  };
}

/**
 * Generate multiple entities at once
 */
export function generateBulkData<T>(
  generator: (overrides?: Partial<T>) => T,
  count: number,
  overrides?: Partial<T>
): T[] {
  return Array.from({ length: count }, () => generator(overrides));
}

/**
 * Generate a complete dataset for development
 */
export function generateCompleteDataset() {
  return {
    agents: generateBulkData(generateAgent, 20),
    skills: generateBulkData(generateSkill, 30),
    tools: generateBulkData(generateTool, 25),
    documents: generateBulkData(generateKnowledgeDocument, 50)
  };
}

/**
 * Generate sample data matching specific criteria
 */
export function generateFilteredData<T>(
  generator: (overrides?: Partial<T>) => T,
  count: number,
  filter: Partial<T>
): T[] {
  return Array.from({ length: count }, () => generator(filter));
}