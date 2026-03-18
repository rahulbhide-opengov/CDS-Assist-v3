/**
 * Persona → Card Mapping Configuration
 * Defines which cards each persona should see on the unified homepage
 */

// ============================================================================
// CARD IDS
// ============================================================================

export type CardId =
  | 'todayTasks'
  | 'bills'
  | 'utilities'
  | 'taxes'
  | 'permits'
  | 'violations'
  | 'businessOverview'
  | 'permitsInspections'
  | 'grantsPrograms'
  | 'vendorActivity'
  | 'schoolOps'
  | 'newResidentSetup'
  | 'paymentAssistance'
  | 'notifications'
  | 'history'
  | 'exploreServices'
  | 'quickActions'
  | 'faq'
  | 'helpCard'
  | 'autoPay';

// ============================================================================
// PERSONA CARD CONFIG TYPE
// ============================================================================

export interface PersonaCardConfig {
  label: string;
  description: string;
  visibleCards: CardId[];
}

// ============================================================================
// PERSONA → CARD MAPPING
// ============================================================================

export const PERSONA_CARD_CONFIG: Record<string, PersonaCardConfig> = {
  // ---------------------------------------------------------------------------
  // RESIDENTS
  // ---------------------------------------------------------------------------
  
  maria: {
    label: 'Maria - Everyday Resident',
    description: 'Primary focus on paying utility bills and managing household expenses',
    visibleCards: [
      'todayTasks',
      'bills',
      'utilities',
      'paymentAssistance',
      'taxes',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
      'faq',
      'helpCard',
      'autoPay',
    ],
  },

  devin: {
    label: 'Devin - Mobile Quick User',
    description: 'Fast actions on mobile, code violations focus',
    visibleCards: [
      'todayTasks',
      'bills',
      'utilities',
      'violations',
      'permits',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
    ],
  },

  charles: {
    label: 'Charles - Senior Resident',
    description: 'Accessibility-focused, simplified navigation',
    visibleCards: [
      'todayTasks',
      'bills',
      'utilities',
      'taxes',
      'paymentAssistance',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
      'faq',
      'helpCard',
    ],
  },

  jasmine: {
    label: 'Jasmine - Payment Assistance',
    description: 'Focus on financial help programs and payment plans',
    visibleCards: [
      'todayTasks',
      'bills',
      'utilities',
      'paymentAssistance',
      'taxes',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
      'faq',
      'helpCard',
    ],
  },

  taylor: {
    label: 'Taylor - New Resident',
    description: 'Onboarding and setup for new city residents',
    visibleCards: [
      'todayTasks',
      'newResidentSetup',
      'bills',
      'utilities',
      'permits',
      'taxes',
      'notifications',
      'exploreServices',
      'quickActions',
      'faq',
      'helpCard',
    ],
  },

  sandra: {
    label: 'Sandra - Multi-Taxpayer',
    description: 'Multiple properties, complex tax management',
    visibleCards: [
      'todayTasks',
      'taxes',
      'bills',
      'utilities',
      'permits',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
      'autoPay',
    ],
  },

  // ---------------------------------------------------------------------------
  // BUSINESSES
  // ---------------------------------------------------------------------------

  priya: {
    label: 'Priya - Small Business Owner',
    description: 'Business licenses, permits, and commercial operations',
    visibleCards: [
      'todayTasks',
      'businessOverview',
      'bills',
      'utilities',
      'taxes',
      'permits',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
      'autoPay',
    ],
  },

  danny: {
    label: 'Danny - Contractor',
    description: 'Permits and inspections for construction trades',
    visibleCards: [
      'todayTasks',
      'permitsInspections',
      'permits',
      'bills',
      'utilities',
      'businessOverview',
      'notifications',
      'exploreServices',
      'quickActions',
    ],
  },

  landlord: {
    label: 'Landlord - Multi-Property',
    description: 'Managing multiple rental properties',
    visibleCards: [
      'todayTasks',
      'bills',
      'utilities',
      'taxes',
      'permits',
      'violations',
      'businessOverview',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
    ],
  },

  // ---------------------------------------------------------------------------
  // ORGANIZATIONS
  // ---------------------------------------------------------------------------

  alicia: {
    label: 'Alicia - Nonprofit Administrator',
    description: 'Grants, programs, and nonprofit operations',
    visibleCards: [
      'todayTasks',
      'grantsPrograms',
      'bills',
      'utilities',
      'permits',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
      'faq',
    ],
  },

  marco: {
    label: 'Marco - Community Organizer',
    description: 'Events, facilities, and community engagement',
    visibleCards: [
      'todayTasks',
      'permits',
      'grantsPrograms',
      'bills',
      'notifications',
      'exploreServices',
      'quickActions',
      'faq',
    ],
  },

  // ---------------------------------------------------------------------------
  // VENDORS
  // ---------------------------------------------------------------------------

  jordan: {
    label: 'Jordan - Small Vendor',
    description: 'Basic procurement and bidding opportunities',
    visibleCards: [
      'todayTasks',
      'vendorActivity',
      'businessOverview',
      'bills',
      'notifications',
      'exploreServices',
      'quickActions',
    ],
  },

  samuel: {
    label: 'Samuel - Enterprise Vendor',
    description: 'Large-scale vendor operations and contracts',
    visibleCards: [
      'todayTasks',
      'vendorActivity',
      'businessOverview',
      'bills',
      'taxes',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
    ],
  },

  // ---------------------------------------------------------------------------
  // INSTITUTIONS
  // ---------------------------------------------------------------------------

  school_admin: {
    label: 'School Administrator',
    description: 'School facilities, utilities, and operations',
    visibleCards: [
      'todayTasks',
      'schoolOps',
      'bills',
      'utilities',
      'permits',
      'grantsPrograms',
      'notifications',
      'history',
      'exploreServices',
      'quickActions',
    ],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get the card configuration for a specific persona
 */
export const getPersonaCardConfig = (personaId: string): PersonaCardConfig | undefined => {
  return PERSONA_CARD_CONFIG[personaId];
};

/**
 * Check if a card is visible for a specific persona
 */
export const isCardVisibleForPersona = (personaId: string, cardId: CardId): boolean => {
  const config = PERSONA_CARD_CONFIG[personaId];
  if (!config) return false;
  return config.visibleCards.includes(cardId);
};

/**
 * Get all card IDs that are visible for a persona
 */
export const getVisibleCardsForPersona = (personaId: string): CardId[] => {
  const config = PERSONA_CARD_CONFIG[personaId];
  if (!config) return [];
  return config.visibleCards;
};

/**
 * Get all unique card IDs across all personas
 */
export const getAllCardIds = (): CardId[] => {
  const allCards = new Set<CardId>();
  Object.values(PERSONA_CARD_CONFIG).forEach(config => {
    config.visibleCards.forEach(card => allCards.add(card));
  });
  return Array.from(allCards);
};

