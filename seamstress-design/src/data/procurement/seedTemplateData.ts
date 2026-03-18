/**
 * Seed Template Data
 * Initialize IndexedDB with mock template data
 */

import { DocumentStorage } from '../../services/procurement/DocumentStorage';
import {
  MOCK_TEMPLATES,
  MOCK_QUESTIONS,
  MOCK_QUESTION_OPTIONS,
} from './templateMockData';

/**
 * Seed templates, questions, and options into IndexedDB
 */
export async function seedTemplateData(): Promise<void> {
  try {
    const storage = new DocumentStorage();
    await storage.initialize();

    console.log('Seeding template data...');

    // Check if templates already exist
    const existingTemplates = await storage.getTemplates();
    if (existingTemplates.length > 0) {
      console.log(`Templates already seeded (${existingTemplates.length} templates found)`);
      return;
    }

    // Seed templates
    for (const template of MOCK_TEMPLATES) {
      await storage.saveTemplate(template);
    }
    console.log(`✅ Seeded ${MOCK_TEMPLATES.length} templates`);

    // Seed questions
    for (const question of MOCK_QUESTIONS) {
      await storage.saveQuestion(question);
    }
    console.log(`✅ Seeded ${MOCK_QUESTIONS.length} questions`);

    // Seed question options
    for (const option of MOCK_QUESTION_OPTIONS) {
      await storage.saveQuestionOption(option);
    }
    console.log(`✅ Seeded ${MOCK_QUESTION_OPTIONS.length} question options`);

    console.log('✅ Template data seeding complete!');
  } catch (error) {
    console.error('Error seeding template data:', error);
    throw error;
  }
}
