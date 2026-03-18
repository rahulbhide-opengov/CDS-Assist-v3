/**
 * Knowledge Slug to ID Mapping
 * Maps knowledge slugs (used in @knowledge/slug mentions) to their actual document IDs
 *
 * IMPORTANT: When adding new knowledge documents:
 * 1. Add the document to mockDocuments in src/hooks/useKnowledgeData.ts with a unique ID
 * 2. Add the slug-to-ID mapping here in KNOWLEDGE_SLUG_MAP
 * 3. Use @knowledge/your-slug in agent responses and skills
 * 4. The KnowledgeCitation component will automatically create clickable links
 *
 * Example: @knowledge/residential-building-code will link to /knowledge/8d80d293-f61f-46b4-aa5b-35c5e0c11389
 */

export interface KnowledgeSlugMapping {
  slug: string;
  id: string;
  title: string;
}

// Central mapping of knowledge slugs to document IDs
// Add new mappings here when creating new knowledge documents
export const KNOWLEDGE_SLUG_MAP: Record<string, string> = {
  // Building & Planning
  'residential-building-code': '8d80d293-f61f-46b4-aa5b-35c5e0c11389',

  // Finance
  'budget-manual': '1',

  // Procurement
  'procurement-policies': '2',

  // HR
  'employee-handbook': '4',

  // IT
  'it-security-guidelines': '5',
};

/**
 * Gets the knowledge document ID for a given slug
 * @param slug The knowledge slug (e.g., "residential-building-code")
 * @returns The document ID or the slug if no mapping exists
 */
export function getKnowledgeIdFromSlug(slug: string): string {
  return KNOWLEDGE_SLUG_MAP[slug] || slug;
}

/**
 * Gets the knowledge slug for a given ID
 * @param id The document ID
 * @returns The slug or null if no mapping exists
 */
export function getKnowledgeSlugFromId(id: string): string | null {
  const entry = Object.entries(KNOWLEDGE_SLUG_MAP).find(([_, docId]) => docId === id);
  return entry ? entry[0] : null;
}

/**
 * Checks if a slug has a mapping
 * @param slug The knowledge slug
 * @returns True if the slug has a mapping
 */
export function hasKnowledgeSlugMapping(slug: string): boolean {
  return slug in KNOWLEDGE_SLUG_MAP;
}

/**
 * Gets all available knowledge slug mappings
 * @returns Array of all slug mappings
 */
export function getAllKnowledgeMappings(): KnowledgeSlugMapping[] {
  return Object.entries(KNOWLEDGE_SLUG_MAP).map(([slug, id]) => ({
    slug,
    id,
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }));
}
