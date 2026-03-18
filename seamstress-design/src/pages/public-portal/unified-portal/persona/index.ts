/**
 * Persona System Exports
 * Central export point for persona-related functionality
 */

// Types - explicit exports for better Vite compatibility
export type {
  PersonaId,
  PersonaCategory,
  UBTaxCategory,
  PersonaEntityType,
  OpenGovProductAccess,
  EntityType,
  LinkedEntity,
  UserRole,
  PersonaCapabilities,
  UBTaxClassification,
  Persona,
  PersonaInferenceRules,
  UserProfile,
  PersonaContextState,
  PersonaContextActions,
  PersonaContext as PersonaContextType,
  PersonaSwitcherProps,
  PersonaGateProps,
} from './types';

// Configuration
export {
  personas,
  inferenceRules,
  tileConfigs,
  defaultFeatureFlags,
  getPersonasByCategory,
  getPersonaById,
  isTileVisible,
  getDefaultProductAccess,
} from './personaConfig';
export type { TileConfig, PersonaFeatureFlags } from './personaConfig';

// Persona → Card Configuration
export {
  PERSONA_CARD_CONFIG,
  getPersonaCardConfig,
  isCardVisibleForPersona,
  getVisibleCardsForPersona,
  getAllCardIds,
} from './personaCardConfig';
export type { CardId, PersonaCardConfig } from './personaCardConfig';

// Card → Product Configuration
export {
  CARD_PRODUCT_CONFIG,
  getCardProductRequirement,
  isCardProductAccessMet,
  getCardsRequiringProduct,
  getUnrestrictedCards,
} from './cardProductConfig';
export type { OpenGovProduct, CardProductRequirement } from './cardProductConfig';

// Context & Hooks
export {
  PersonaProvider,
  usePersona,
  usePersonaCapability,
  usePersonaCapabilities,
  mockUserProfiles,
} from './PersonaContext';

// Visible Cards Hook
export {
  useVisibleCards,
  computeVisibleCards,
  getPotentialCardsForPersona,
  wouldCardBeVisible,
  getUBTaxCards,
  getNonUBTaxCards,
} from './useVisibleCards';
export type { VisibleCardsResult } from './useVisibleCards';

// Persona Classification Hook
export {
  usePersonaClassification,
  usePersonasByUBTaxCategory,
  useUBTaxCategoryConfig,
  classifyPersona,
  classifyByProductAccess,
  shouldShowUBTaxCards,
  shouldShowNonUBTaxCards,
  filterCardsByClassification,
  UB_TAX_CARD_IDS,
  NON_UB_TAX_CARD_IDS,
  SHARED_CARD_IDS,
} from './usePersonaClassification';
export type { PersonaClassificationResult } from './usePersonaClassification';

// Components
export { PersonaSwitcher, PersonaGate } from './PersonaSwitcher';
