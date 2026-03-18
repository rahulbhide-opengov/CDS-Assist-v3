/**
 * Persona Classification Hook
 * Determines UB/TAX vs NON-UB/TAX classification for conditional UI rendering
 */

import { useMemo } from 'react';
import { usePersona } from './PersonaContext';
import type { Persona, UBTaxClassification, UBTaxCategory, PersonaId, OpenGovProductAccess } from './types';
import { personas, getPersonasByUBTaxCategory, ubTaxCategoryConfig } from './personaConfig';

// ============================================================================
// CLASSIFICATION TYPES
// ============================================================================

export interface PersonaClassificationResult {
  // Current persona classification
  classification: UBTaxClassification;
  
  // Convenience flags
  isUBTaxPersona: boolean;
  isNonUBTaxPersona: boolean;
  isHybridPersona: boolean;
  
  // Property flags
  supportsMultiProperty: boolean;
  entityType: 'individual' | 'business' | 'organization' | 'school';
  
  // UB/TAX category for UI grouping
  ubTaxCategory: UBTaxCategory;
  categoryLabel: string;
  categoryDescription: string;
  
  // Product access-based classification
  hasUtilityAccess: boolean;
  hasTaxAccess: boolean;
  hasPermitsAccess: boolean;
  hasProcurementAccess: boolean;
  hasGrantsAccess: boolean;
  
  // Computed card visibility
  shouldShowUBTaxCards: boolean;
  shouldShowNonUBTaxCards: boolean;
}

// ============================================================================
// CLASSIFIER FUNCTION
// ============================================================================

/**
 * Classify a persona based on UB/TAX criteria
 * Can be used outside of React components
 */
export function classifyPersona(personaId: PersonaId): UBTaxClassification {
  const persona = personas[personaId];
  if (!persona) {
    // Return default non-UB/TAX classification for unknown personas
    return {
      isUtilityUser: false,
      isTaxUser: false,
      isUBTaxPersona: false,
      isNonUBTaxPersona: true,
      supportsMultiProperty: false,
      entityType: 'individual',
      ubTaxCategory: 'NON_UB_TAX',
    };
  }
  return persona.ubTaxClassification;
}

/**
 * Classify based on product access (runtime classification)
 * This determines what the user can actually see based on their access
 */
export function classifyByProductAccess(productAccess: OpenGovProductAccess): {
  isUtilityUser: boolean;
  isTaxUser: boolean;
  isUBTaxUser: boolean;
  isNonUBTaxUser: boolean;
  ubTaxCategory: UBTaxCategory;
} {
  const isUtilityUser = productAccess.billing;
  const isTaxUser = productAccess.taxes;
  const isUBTaxUser = isUtilityUser || isTaxUser;
  const isNonUBTaxUser = !isUBTaxUser;
  
  let ubTaxCategory: UBTaxCategory;
  if (isNonUBTaxUser) {
    ubTaxCategory = 'NON_UB_TAX';
  } else if (isUtilityUser && isTaxUser) {
    ubTaxCategory = 'UB_TAX';
  } else {
    ubTaxCategory = 'HYBRID';
  }
  
  return {
    isUtilityUser,
    isTaxUser,
    isUBTaxUser,
    isNonUBTaxUser,
    ubTaxCategory,
  };
}

/**
 * Determine if a persona should show UB/TAX cards
 * Takes into account both persona classification and actual product access
 */
export function shouldShowUBTaxCards(
  persona: Persona,
  productAccess: OpenGovProductAccess
): boolean {
  // If persona is UB/TAX focused, check if they have the product access
  if (persona.ubTaxClassification.isUBTaxPersona) {
    return productAccess.billing || productAccess.taxes;
  }
  
  // If persona is hybrid, always show if they have access
  if (persona.ubTaxClassification.ubTaxCategory === 'HYBRID') {
    return productAccess.billing || productAccess.taxes;
  }
  
  // For NON-UB/TAX personas, still show if they happen to have access
  return productAccess.billing || productAccess.taxes;
}

/**
 * Determine if a persona should show NON-UB/TAX cards
 * (permits, grants, vendors, etc.)
 */
export function shouldShowNonUBTaxCards(
  persona: Persona,
  productAccess: OpenGovProductAccess
): boolean {
  // NON-UB/TAX personas always show these cards
  if (persona.ubTaxClassification.isNonUBTaxPersona) {
    return true;
  }
  
  // Hybrid personas show if they have relevant access
  if (persona.ubTaxClassification.ubTaxCategory === 'HYBRID') {
    return productAccess.permits || productAccess.grants || productAccess.procurement || productAccess.parksAndRec;
  }
  
  // UB/TAX personas can still show if they have access
  return productAccess.permits || productAccess.grants || productAccess.procurement || productAccess.parksAndRec;
}

// ============================================================================
// REACT HOOK
// ============================================================================

/**
 * Default UB/TAX classification for personas that don't have one
 */
const defaultUBTaxClassification: UBTaxClassification = {
  isUtilityUser: true,
  isTaxUser: true,
  isUBTaxPersona: true,
  isNonUBTaxPersona: false,
  supportsMultiProperty: false,
  entityType: 'individual',
  ubTaxCategory: 'HYBRID',
};

/**
 * Hook to get persona classification for the current active persona
 */
export function usePersonaClassification(): PersonaClassificationResult {
  const { activePersona, userProfile } = usePersona();
  const productAccess = userProfile.productAccess;
  
  return useMemo(() => {
    // Get classification with fallback for personas that don't have it
    const classification = activePersona.ubTaxClassification || defaultUBTaxClassification;
    const categoryConfig = ubTaxCategoryConfig[classification.ubTaxCategory];
    
    // Product access based flags (with fallbacks for safety)
    const hasUtilityAccess = productAccess?.billing ?? false;
    const hasTaxAccess = productAccess?.taxes ?? false;
    const hasPermitsAccess = productAccess?.permits ?? false;
    const hasProcurementAccess = productAccess?.procurement ?? false;
    const hasGrantsAccess = productAccess?.grants ?? false;
    
    // Safe product access for helper functions
    const safeProductAccess = productAccess ?? {
      billing: false,
      taxes: false,
      permits: false,
      procurement: false,
      grants: false,
      parksAndRec: false,
      codeEnforcement: false,
      businessLicense: false,
    };
    
    return {
      // Classification data
      classification,
      
      // Convenience flags from classification
      isUBTaxPersona: classification.isUBTaxPersona,
      isNonUBTaxPersona: classification.isNonUBTaxPersona,
      isHybridPersona: classification.ubTaxCategory === 'HYBRID',
      
      // Property flags
      supportsMultiProperty: classification.supportsMultiProperty,
      entityType: classification.entityType,
      
      // Category info for UI
      ubTaxCategory: classification.ubTaxCategory,
      categoryLabel: categoryConfig.label,
      categoryDescription: categoryConfig.description,
      
      // Product access flags
      hasUtilityAccess,
      hasTaxAccess,
      hasPermitsAccess,
      hasProcurementAccess,
      hasGrantsAccess,
      
      // Computed visibility
      shouldShowUBTaxCards: shouldShowUBTaxCards(activePersona, safeProductAccess),
      shouldShowNonUBTaxCards: shouldShowNonUBTaxCards(activePersona, safeProductAccess),
    };
  }, [activePersona, productAccess]);
}

// ============================================================================
// PERSONA GROUPING UTILITIES
// ============================================================================

/**
 * Get all personas grouped by UB/TAX category
 * Useful for the persona switcher UI
 */
export function usePersonasByUBTaxCategory() {
  return useMemo(() => {
    return getPersonasByUBTaxCategory();
  }, []);
}

/**
 * Get UB/TAX category configuration
 */
export function useUBTaxCategoryConfig() {
  return ubTaxCategoryConfig;
}

// ============================================================================
// CARD FILTERING UTILITIES
// ============================================================================

/**
 * UB/TAX card IDs - these are hidden for NON-UB/TAX personas
 */
export const UB_TAX_CARD_IDS = [
  'bills',
  'utilities',
  'taxes',
  'paymentAssistance',
  'propertySelector',
  'multiPropertyDashboard',
] as const;

/**
 * NON-UB/TAX card IDs - these are the primary cards for non-billing personas
 */
export const NON_UB_TAX_CARD_IDS = [
  'permits',
  'permitsInspections',
  'grantsPrograms',
  'vendorActivity',
  'schoolOps',
  'communityEvents',
] as const;

/**
 * Shared card IDs - shown regardless of classification
 */
export const SHARED_CARD_IDS = [
  'todayTasks',
  'businessOverview',
  'notifications',
  'history',
  'exploreServices',
  'quickActions',
  'faq',
  'helpCard',
  'newResidentSetup',
  'violations',
] as const;

/**
 * Filter cards based on UB/TAX classification
 */
export function filterCardsByClassification(
  cards: string[],
  classification: PersonaClassificationResult
): string[] {
  return cards.filter(cardId => {
    // Always show shared cards
    if (SHARED_CARD_IDS.includes(cardId as typeof SHARED_CARD_IDS[number])) {
      return true;
    }
    
    // UB/TAX cards - show only if should show UB/TAX
    if (UB_TAX_CARD_IDS.includes(cardId as typeof UB_TAX_CARD_IDS[number])) {
      return classification.shouldShowUBTaxCards;
    }
    
    // NON-UB/TAX cards - show only if should show NON-UB/TAX
    if (NON_UB_TAX_CARD_IDS.includes(cardId as typeof NON_UB_TAX_CARD_IDS[number])) {
      return classification.shouldShowNonUBTaxCards;
    }
    
    // Unknown cards - show by default
    return true;
  });
}

