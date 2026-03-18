/**
 * Data Seeding Service
 *
 * Initializes IndexedDB with realistic mock data for all procurement projects.
 * This service ensures that demo data is available for testing and development.
 */

import { faker } from '@faker-js/faker';
import { documentStorage, DocumentStorage } from './DocumentStorage';
import { mockProjects, MOCK_TEMPLATES, MOCK_CONTACTS } from '../../data/procurementProjectMockData';
import { getSectionContent } from '../../data/procurement/realisticSectionContent';
import type {
  Project,
  Document,
  DocumentSection,
  Template,
} from '../../types/procurement';
import type { SharedSection, Signature } from './ProcurementTypes';

// Key to track if seeding has been done
const SEEDING_KEY = 'seamstress-procurement-seeded';
const SEEDING_VERSION = '2'; // Increment to force re-seeding

export class DataSeedingService {
  private storage: DocumentStorage;

  constructor(storage: DocumentStorage = documentStorage) {
    this.storage = storage;
  }

  /**
   * Check if data has already been seeded
   */
  isSeeded(): boolean {
    const seeded = localStorage.getItem(SEEDING_KEY);
    return seeded === SEEDING_VERSION;
  }

  /**
   * Mark data as seeded
   */
  private markSeeded(): void {
    localStorage.setItem(SEEDING_KEY, SEEDING_VERSION);
  }

  /**
   * Clear the seeding flag to force re-seeding on next load
   */
  clearSeedingFlag(): void {
    localStorage.removeItem(SEEDING_KEY);
  }

  /**
   * Seed all data if not already seeded
   */
  async seedIfNeeded(): Promise<{ seeded: boolean; projectCount: number; documentCount: number }> {
    if (this.isSeeded()) {
      return { seeded: false, projectCount: 0, documentCount: 0 };
    }

    // Clear existing data before seeding
    await this.storage.clearAll();

    const result = await this.seedAllData();
    this.markSeeded();

    return { seeded: true, ...result };
  }

  /**
   * Force re-seed all data (clears existing data first)
   */
  async forceReseed(): Promise<{ projectCount: number; documentCount: number }> {
    this.clearSeedingFlag();
    await this.storage.clearAll();
    const result = await this.seedAllData();
    this.markSeeded();
    return result;
  }

  /**
   * Seed all data
   */
  private async seedAllData(): Promise<{ projectCount: number; documentCount: number }> {
    // Initialize storage
    await this.storage.initialize();

    // Set a consistent seed for reproducible data
    faker.seed(456);

    // Seed templates first
    await this.seedTemplates();

    // Seed shared sections library
    await this.seedSharedSections();

    // Seed projects with their documents
    let documentCount = 0;
    for (const project of mockProjects) {
      await this.seedProjectWithDocuments(project);
      documentCount += project.documents.length;
    }

    console.log(`[DataSeeding] Seeded ${mockProjects.length} projects with ${documentCount} documents`);

    return {
      projectCount: mockProjects.length,
      documentCount,
    };
  }

  /**
   * Seed templates
   */
  private async seedTemplates(): Promise<void> {
    // Convert mock templates to full Template objects
    const fullTemplates: Template[] = MOCK_TEMPLATES.map((t) => ({
      templateId: t.templateId,
      name: t.name,
      type: this.mapTemplateType(t.type),
      description: t.description || '',
      sections: t.defaultSections?.map((title, index) => ({
        title,
        type: 'text' as const,
        content: '',
        required: index < 3,
      })) || [],
      variables: ['{{project.title}}', '{{department.name}}', '{{contact.name}}', '{{contact.email}}'],
      questions: t.setupQuestions?.map((q) => q.questionId) || [],
      usageCount: faker.number.int({ min: 5, max: 50 }),
      isActive: true,
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    }));

    for (const template of fullTemplates) {
      await this.storage.saveTemplate(template);
    }
  }

  /**
   * Map string template type to correct type
   */
  private mapTemplateType(type: string): 'Solicitation' | 'Contract' | 'Intake' {
    const typeMap: Record<string, 'Solicitation' | 'Contract' | 'Intake'> = {
      'RFP': 'Solicitation',
      'RFQ': 'Solicitation',
      'IFB': 'Solicitation',
      'RFI': 'Solicitation',
      'Evaluation': 'Contract',
    };
    return typeMap[type] || 'Solicitation';
  }

  /**
   * Seed shared sections library
   */
  private async seedSharedSections(): Promise<void> {
    const categories = ['legal', 'compliance', 'evaluation', 'financial', 'operational', 'technical'] as const;
    const sectionTitles = [
      { title: 'Standard Terms and Conditions', category: 'legal' as const, tags: ['terms', 'conditions', 'contract'] },
      { title: 'Insurance Requirements', category: 'legal' as const, tags: ['insurance', 'liability', 'coverage'] },
      { title: 'Indemnification Clause', category: 'legal' as const, tags: ['indemnification', 'liability'] },
      { title: 'Security Compliance', category: 'compliance' as const, tags: ['security', 'compliance', 'data'] },
      { title: 'Privacy Requirements', category: 'compliance' as const, tags: ['privacy', 'data', 'GDPR'] },
      { title: 'ADA Compliance', category: 'compliance' as const, tags: ['ADA', 'accessibility', 'compliance'] },
      { title: 'Evaluation Criteria Matrix', category: 'evaluation' as const, tags: ['evaluation', 'scoring', 'criteria'] },
      { title: 'Price Evaluation Methodology', category: 'evaluation' as const, tags: ['price', 'evaluation', 'cost'] },
      { title: 'Payment Terms', category: 'financial' as const, tags: ['payment', 'billing', 'invoice'] },
      { title: 'Budget Template', category: 'financial' as const, tags: ['budget', 'cost', 'financial'] },
      { title: 'Project Timeline', category: 'operational' as const, tags: ['timeline', 'schedule', 'milestones'] },
      { title: 'Reporting Requirements', category: 'operational' as const, tags: ['reporting', 'progress', 'status'] },
      { title: 'Technical Specifications', category: 'technical' as const, tags: ['technical', 'specifications', 'requirements'] },
      { title: 'Integration Requirements', category: 'technical' as const, tags: ['integration', 'API', 'systems'] },
    ];

    for (const { title, category, tags } of sectionTitles) {
      const section: SharedSection = {
        sectionId: `shared-${faker.string.uuid()}`,
        title,
        content: getSectionContent(title),
        category,
        tags,
        description: `Standard ${title.toLowerCase()} section for procurement documents`,
        usageCount: faker.number.int({ min: 5, max: 100 }),
        variables: this.extractVariables(getSectionContent(title)),
        createdAt: faker.date.past({ years: 1 }).toISOString(),
        updatedAt: faker.date.recent({ days: 60 }).toISOString(),
        createdBy: faker.helpers.arrayElement(MOCK_CONTACTS).contactId,
      };

      await this.storage.saveSharedSection(section);
    }
  }

  /**
   * Extract variables from content
   */
  private extractVariables(content: string): string[] {
    const matches = content.match(/\{\{[^}]+\}\}/g) || [];
    return [...new Set(matches)];
  }

  /**
   * Seed a project with its documents
   */
  private async seedProjectWithDocuments(project: Project): Promise<void> {
    // Save the project
    await this.storage.saveProject(project);

    // For each document in the project, create realistic content and save
    for (const document of project.documents) {
      const enrichedDocument = this.enrichDocument(document, project);
      await this.storage.saveDocument(enrichedDocument);

      // Also seed signatures for the document
      await this.seedSignatures(document.documentId, project);
    }
  }

  /**
   * Enrich a document with realistic content
   */
  private enrichDocument(document: Document, project: Project): Document {
    // Get section titles from the document
    const sectionTitles = [
      'Introduction',
      'Scope of Work',
      'Requirements',
      'Terms and Conditions',
      'Evaluation Criteria',
      'Security Compliance Requirements',
      'Pricing Table',
      'Vendor Questionnaire',
      'Project Timeline',
      'Insurance Requirements',
      'Delivery Schedule',
      'Attachments',
    ];

    // Create sections with realistic content
    const sections: DocumentSection[] = sectionTitles.slice(0, faker.number.int({ min: 5, max: 10 })).map((title, index) => {
      // Get realistic content for the section
      let content = getSectionContent(title);

      // Replace placeholders with actual project data
      content = this.replacePlaceholders(content, project);

      return {
        sectionId: `section-${document.documentId}-${index + 1}`,
        title,
        type: title === 'Attachments' ? 'list' : 'text',
        content,
        order: index,
      };
    });

    // Create variables with project-specific values
    const variables: Record<string, string | number | boolean> = {
      'project.title': project.title,
      'project.id': project.projectId,
      'department.name': project.department.name,
      'contact.name': `${project.projectContact.firstName} ${project.projectContact.lastName}`,
      'contact.email': project.projectContact.email,
      'contact.phone': project.projectContact.phone || '555-0100',
      'city.name': faker.location.city(),
      'city.address': faker.location.streetAddress(),
      'state.name': faker.location.state(),
      'county.name': faker.location.county(),
      'timeline.releaseDate': project.timeline.releaseDate || faker.date.soon({ days: 14 }).toLocaleDateString(),
      'timeline.preProposalDate': project.timeline.preProposalDate || faker.date.soon({ days: 7 }).toLocaleDateString(),
      'timeline.qaDeadline': project.timeline.qaSubmissionDeadline || faker.date.soon({ days: 21 }).toLocaleDateString(),
      'timeline.submissionDeadline': project.timeline.responseSubmissionDeadline || faker.date.soon({ days: 30 }).toLocaleDateString(),
      'timeline.awardDate': faker.date.soon({ days: 60 }).toLocaleDateString(),
      'budget.amount': project.budget?.amount || faker.number.int({ min: 100000, max: 5000000 }),
      'contract.startDate': faker.date.soon({ days: 90 }).toLocaleDateString(),
      'contract.endDate': faker.date.future({ years: 2 }).toLocaleDateString(),
    };

    return {
      ...document,
      sections,
      variables,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Replace placeholder variables in content
   */
  private replacePlaceholders(content: string, project: Project): string {
    const replacements: Record<string, string> = {
      '{{project.title}}': project.title,
      '{{department.name}}': project.department.name,
      '{{contact.name}}': `${project.projectContact.firstName} ${project.projectContact.lastName}`,
      '{{contact.email}}': project.projectContact.email,
      '{{contact.phone}}': project.projectContact.phone || '555-0100',
      '{{city.name}}': faker.location.city(),
      '{{city.address}}': faker.location.streetAddress(),
      '{{state.name}}': faker.location.state(),
      '{{county.name}}': faker.location.county(),
      '{{timeline.releaseDate}}': project.timeline.releaseDate || faker.date.soon({ days: 14 }).toLocaleDateString(),
      '{{timeline.preProposalDate}}': project.timeline.preProposalDate || faker.date.soon({ days: 7 }).toLocaleDateString(),
      '{{timeline.qaDeadline}}': project.timeline.qaSubmissionDeadline || faker.date.soon({ days: 21 }).toLocaleDateString(),
      '{{timeline.submissionDeadline}}': project.timeline.responseSubmissionDeadline || faker.date.soon({ days: 30 }).toLocaleDateString(),
      '{{timeline.awardDate}}': faker.date.soon({ days: 60 }).toLocaleDateString(),
    };

    let result = content;
    for (const [placeholder, value] of Object.entries(replacements)) {
      result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    }

    return result;
  }

  /**
   * Seed signatures for a document
   */
  private async seedSignatures(documentId: string, project: Project): Promise<void> {
    const signatureRoles = [
      { name: 'Department Director', title: 'Director', required: true },
      { name: 'Procurement Officer', title: 'Senior Procurement Officer', required: true },
      { name: 'Legal Review', title: 'City Attorney', required: true },
      { name: 'Budget Approval', title: 'Budget Director', required: false },
    ];

    // Only add signatures to some documents
    if (faker.datatype.boolean({ probability: 0.7 })) {
      const numSignatures = faker.number.int({ min: 2, max: 4 });

      for (let i = 0; i < numSignatures; i++) {
        const role = signatureRoles[i];
        const contact = faker.helpers.arrayElement(MOCK_CONTACTS);

        const signature: Signature = {
          signatureId: `sig-${documentId}-${i + 1}`,
          documentId,
          signerName: `${contact.firstName} ${contact.lastName}`,
          signerTitle: role.title,
          signerEmail: contact.email,
          signatureType: faker.helpers.arrayElement(['electronic', 'wet']),
          order: i + 1,
          status: faker.helpers.arrayElement(['pending', 'signed', 'pending', 'pending']), // Most are pending
          isRequired: role.required,
          createdAt: faker.date.recent({ days: 30 }).toISOString(),
          signedAt: faker.helpers.maybe(() => faker.date.recent({ days: 7 }).toISOString(), { probability: 0.3 }),
        };

        await this.storage.saveSignature(signature);
      }
    }
  }
}

// Singleton instance
export const dataSeedingService = new DataSeedingService();
