/**
 * Card → Product Access Configuration
 * Maps cards to required OpenGov products for product-level filtering
 */

import type { CardId } from './personaCardConfig';

// ============================================================================
// PRODUCT TYPES
// ============================================================================

export type OpenGovProduct =
  | 'utilities'
  | 'tax'
  | 'permits'
  | 'procurement'
  | 'grants'
  | 'parksRec'
  | 'codeEnforcement'
  | 'businessLicense';

// ============================================================================
// CARD PRODUCT CONFIG TYPE
// ============================================================================

export interface CardProductRequirement {
  /** Products required for this card (if 'all', ALL must be present; if 'any', at least ONE) */
  requiredProducts: OpenGovProduct[];
  /** Match mode: 'all' means all products required, 'any' means at least one */
  matchMode: 'all' | 'any';
  /** Human-readable description of the requirement */
  description?: string;
}

// ============================================================================
// CARD → PRODUCT MAPPING
// ============================================================================

/**
 * Maps card IDs to their required OpenGov products
 * Cards not in this map have no product-level restrictions
 */
export const CARD_PRODUCT_CONFIG: Partial<Record<CardId, CardProductRequirement>> = {
  // ---------------------------------------------------------------------------
  // UTILITY & BILLING CARDS
  // ---------------------------------------------------------------------------
  
  utilities: {
    requiredProducts: ['utilities'],
    matchMode: 'all',
    description: 'Requires utility billing product access',
  },

  // ---------------------------------------------------------------------------
  // TAX CARDS
  // ---------------------------------------------------------------------------

  taxes: {
    requiredProducts: ['tax'],
    matchMode: 'all',
    description: 'Requires tax product access',
  },

  // ---------------------------------------------------------------------------
  // PERMITS CARDS
  // ---------------------------------------------------------------------------

  permits: {
    requiredProducts: ['permits'],
    matchMode: 'all',
    description: 'Requires permits product access',
  },

  permitsInspections: {
    requiredProducts: ['permits'],
    matchMode: 'all',
    description: 'Requires permits product access for contractor dashboard',
  },

  // ---------------------------------------------------------------------------
  // CODE ENFORCEMENT
  // ---------------------------------------------------------------------------

  violations: {
    requiredProducts: ['codeEnforcement'],
    matchMode: 'all',
    description: 'Requires code enforcement product access',
  },

  // ---------------------------------------------------------------------------
  // GRANTS & PROGRAMS
  // ---------------------------------------------------------------------------

  grantsPrograms: {
    requiredProducts: ['grants', 'parksRec'],
    matchMode: 'any',
    description: 'Requires grants OR parks & rec product access',
  },

  // ---------------------------------------------------------------------------
  // VENDOR & PROCUREMENT
  // ---------------------------------------------------------------------------

  vendorActivity: {
    requiredProducts: ['procurement'],
    matchMode: 'all',
    description: 'Requires procurement product access',
  },

  // ---------------------------------------------------------------------------
  // BUSINESS CARDS
  // ---------------------------------------------------------------------------

  businessOverview: {
    requiredProducts: ['permits', 'tax', 'utilities', 'businessLicense'],
    matchMode: 'any',
    description: 'Requires any business-related product access',
  },

  // ---------------------------------------------------------------------------
  // INSTITUTIONAL CARDS
  // ---------------------------------------------------------------------------

  schoolOps: {
    requiredProducts: ['permits', 'utilities', 'parksRec'],
    matchMode: 'any',
    description: 'Requires permits, utilities, or parks & rec for school operations',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get product requirements for a card
 */
export const getCardProductRequirement = (cardId: CardId): CardProductRequirement | undefined => {
  return CARD_PRODUCT_CONFIG[cardId];
};

/**
 * Check if a card's product requirements are met
 * @param cardId - The card to check
 * @param userProducts - Array of products the user has access to
 * @returns true if requirements are met (or no requirements exist)
 */
export const isCardProductAccessMet = (
  cardId: CardId,
  userProducts: OpenGovProduct[]
): boolean => {
  const requirement = CARD_PRODUCT_CONFIG[cardId];
  
  // No requirement = always visible (product-wise)
  if (!requirement) {
    return true;
  }
  
  const { requiredProducts, matchMode } = requirement;
  
  if (matchMode === 'all') {
    // All required products must be present
    return requiredProducts.every(product => userProducts.includes(product));
  } else {
    // At least one required product must be present
    return requiredProducts.some(product => userProducts.includes(product));
  }
};

/**
 * Get all cards that require a specific product
 */
export const getCardsRequiringProduct = (product: OpenGovProduct): CardId[] => {
  const cards: CardId[] = [];
  
  (Object.entries(CARD_PRODUCT_CONFIG) as [CardId, CardProductRequirement][]).forEach(
    ([cardId, config]) => {
      if (config.requiredProducts.includes(product)) {
        cards.push(cardId);
      }
    }
  );
  
  return cards;
};

/**
 * Get all cards with no product requirements (always visible)
 */
export const getUnrestrictedCards = (): CardId[] => {
  const allPossibleCards: CardId[] = [
    'todayTasks',
    'bills',
    'utilities',
    'taxes',
    'permits',
    'violations',
    'businessOverview',
    'permitsInspections',
    'grantsPrograms',
    'vendorActivity',
    'schoolOps',
    'newResidentSetup',
    'paymentAssistance',
    'notifications',
    'history',
    'exploreServices',
    'quickActions',
    'faq',
    'helpCard',
    'autoPay',
  ];
  
  return allPossibleCards.filter(cardId => !CARD_PRODUCT_CONFIG[cardId]);
};

