/**
 * useVisibleCards Hook
 * Computes which cards should be visible based on:
 * 1. Active persona
 * 2. UB/TAX classification
 * 3. Product access
 */

import { useMemo, useCallback } from 'react';
import { usePersona } from './PersonaContext';
import type { CardId } from './personaCardConfig';
import { PERSONA_CARD_CONFIG, getVisibleCardsForPersona } from './personaCardConfig';
import { isCardProductAccessMet, type OpenGovProduct } from './cardProductConfig';
import { 
  usePersonaClassification, 
  filterCardsByClassification,
  UB_TAX_CARD_IDS,
  NON_UB_TAX_CARD_IDS,
  SHARED_CARD_IDS,
  type PersonaClassificationResult,
} from './usePersonaClassification';

// ============================================================================
// TYPES
// ============================================================================

export interface VisibleCardsResult {
  /** Array of card IDs that should be visible */
  visibleCards: CardId[];
  
  /** Check if a specific card should be shown */
  showCard: (cardId: CardId) => boolean;
  
  /** The active persona ID */
  activePersonaId: string;
  
  /** Products the user has access to */
  productAccess: OpenGovProduct[];
  
  /** Whether an override is active */
  isOverrideActive: boolean;
  
  /** UB/TAX classification info */
  classification: PersonaClassificationResult;
  
  /** Convenience flags for UB/TAX */
  isUBTaxUser: boolean;
  isNonUBTaxUser: boolean;
  
  /** Cards grouped by type */
  ubTaxCards: CardId[];
  nonUBTaxCards: CardId[];
  sharedCards: CardId[];
  
  /** Debug info for development */
  debug: {
    personaCards: CardId[];
    filteredByUBTax: CardId[];
    filteredByProduct: CardId[];
    finalCards: CardId[];
  };
}

// ============================================================================
// PRODUCT ACCESS MAPPER
// ============================================================================

/**
 * Maps the OpenGovProductAccess interface to an array of OpenGovProduct strings
 */
const mapProductAccessToArray = (productAccess: {
  billing?: boolean;
  taxes?: boolean;
  permits?: boolean;
  procurement?: boolean;
  grants?: boolean;
  parksAndRec?: boolean;
  codeEnforcement?: boolean;
  businessLicense?: boolean;
}): OpenGovProduct[] => {
  const products: OpenGovProduct[] = [];
  
  if (productAccess.billing) products.push('utilities');
  if (productAccess.taxes) products.push('tax');
  if (productAccess.permits) products.push('permits');
  if (productAccess.procurement) products.push('procurement');
  if (productAccess.grants) products.push('grants');
  if (productAccess.parksAndRec) products.push('parksRec');
  if (productAccess.codeEnforcement) products.push('codeEnforcement');
  if (productAccess.businessLicense) products.push('businessLicense');
  
  return products;
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to compute visible cards based on persona, UB/TAX classification, and product access
 * 
 * @example
 * const { visibleCards, showCard, isUBTaxUser } = useVisibleCards();
 * 
 * return (
 *   <div>
 *     {showCard('todayTasks') && <TodayTasksCard />}
 *     {isUBTaxUser && showCard('bills') && <BillsCard />}
 *     {showCard('utilities') && <UtilitiesCard />}
 *   </div>
 * );
 */
export const useVisibleCards = (): VisibleCardsResult => {
  const {
    activePersona,
    userProfile,
    isOverrideActive,
  } = usePersona();
  
  // Get UB/TAX classification
  const classification = usePersonaClassification();
  
  // Get the active persona ID
  const activePersonaId = activePersona.id;
  
  // Convert product access to array format
  const productAccess = useMemo(() => {
    return mapProductAccessToArray(userProfile.productAccess);
  }, [userProfile.productAccess]);
  
  // Compute visible cards with UB/TAX filtering
  const { visibleCards, ubTaxCards, nonUBTaxCards, sharedCards, debug } = useMemo(() => {
    // Step 1: Get cards for the active persona
    const personaCards = getVisibleCardsForPersona(activePersonaId);
    
    // Step 2: Filter by UB/TAX classification
    const afterUBTaxFilter = filterCardsByClassification(personaCards, classification);
    const filteredByUBTax = personaCards.filter(c => !afterUBTaxFilter.includes(c));
    
    // Step 3: Filter by product access
    const filteredByProduct: CardId[] = [];
    const finalCards = afterUBTaxFilter.filter(cardId => {
      const hasAccess = isCardProductAccessMet(cardId, productAccess);
      if (!hasAccess) {
        filteredByProduct.push(cardId);
      }
      return hasAccess;
    });
    
    // Categorize final cards
    const ubTax = finalCards.filter(c => 
      UB_TAX_CARD_IDS.includes(c as typeof UB_TAX_CARD_IDS[number])
    );
    const nonUBTax = finalCards.filter(c => 
      NON_UB_TAX_CARD_IDS.includes(c as typeof NON_UB_TAX_CARD_IDS[number])
    );
    const shared = finalCards.filter(c => 
      SHARED_CARD_IDS.includes(c as typeof SHARED_CARD_IDS[number])
    );
    
    return {
      visibleCards: finalCards,
      ubTaxCards: ubTax,
      nonUBTaxCards: nonUBTax,
      sharedCards: shared,
      debug: {
        personaCards,
        filteredByUBTax,
        filteredByProduct,
        finalCards,
      },
    };
  }, [activePersonaId, classification, productAccess]);
  
  // Helper function to check if a card should be shown
  const showCard = useCallback((cardId: CardId): boolean => {
    return visibleCards.includes(cardId);
  }, [visibleCards]);
  
  return {
    visibleCards,
    showCard,
    activePersonaId,
    productAccess,
    isOverrideActive,
    classification,
    isUBTaxUser: classification.shouldShowUBTaxCards,
    isNonUBTaxUser: classification.shouldShowNonUBTaxCards,
    ubTaxCards,
    nonUBTaxCards,
    sharedCards,
    debug,
  };
};

// ============================================================================
// STANDALONE UTILITY FUNCTIONS
// ============================================================================

/**
 * Compute visible cards without using hooks (for SSR or testing)
 */
export const computeVisibleCards = (
  personaId: string,
  productAccess: OpenGovProduct[]
): CardId[] => {
  // Get cards for the persona
  const personaCards = getVisibleCardsForPersona(personaId);
  
  // Filter by product access (UB/TAX filtering requires classification context)
  return personaCards.filter(cardId => 
    isCardProductAccessMet(cardId, productAccess)
  );
};

/**
 * Get all cards that a persona could potentially see
 * (without product filtering)
 */
export const getPotentialCardsForPersona = (personaId: string): CardId[] => {
  return getVisibleCardsForPersona(personaId);
};

/**
 * Check if a specific card would be visible for given persona and products
 */
export const wouldCardBeVisible = (
  cardId: CardId,
  personaId: string,
  productAccess: OpenGovProduct[]
): boolean => {
  // Check if persona includes this card
  const personaCards = getVisibleCardsForPersona(personaId);
  if (!personaCards.includes(cardId)) {
    return false;
  }
  
  // Check product access
  return isCardProductAccessMet(cardId, productAccess);
};

/**
 * Get UB/TAX specific cards from a list
 */
export const getUBTaxCards = (cards: CardId[]): CardId[] => {
  return cards.filter(c => UB_TAX_CARD_IDS.includes(c as typeof UB_TAX_CARD_IDS[number]));
};

/**
 * Get NON-UB/TAX specific cards from a list
 */
export const getNonUBTaxCards = (cards: CardId[]): CardId[] => {
  return cards.filter(c => NON_UB_TAX_CARD_IDS.includes(c as typeof NON_UB_TAX_CARD_IDS[number]));
};

export default useVisibleCards;
