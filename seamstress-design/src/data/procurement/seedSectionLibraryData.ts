/**
 * Seed Section Library Data
 * Initialize IndexedDB with mock section library data
 */

import { DocumentStorage } from '../../services/procurement/DocumentStorage';
import { MOCK_SHARED_SECTIONS } from './sectionLibraryData';

/**
 * Seed shared sections into IndexedDB
 */
export async function seedSectionLibraryData(): Promise<void> {
  try {
    const storage = new DocumentStorage();

    console.log('Seeding section library data...');

    // Check if sections already exist
    const existingSections = await storage.getSharedSections();
    if (existingSections.length > 0) {
      console.log(`Section library already seeded (${existingSections.length} sections found)`);
      return;
    }

    // Seed sections
    for (const section of MOCK_SHARED_SECTIONS) {
      await storage.saveSharedSection(section);
    }
    console.log(`✅ Seeded ${MOCK_SHARED_SECTIONS.length} shared sections`);

    console.log('✅ Section library data seeding complete!');
  } catch (error) {
    console.error('Error seeding section library data:', error);
    throw error;
  }
}
