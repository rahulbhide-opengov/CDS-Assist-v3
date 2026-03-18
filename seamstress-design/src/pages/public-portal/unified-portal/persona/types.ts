/**
 * Persona System Types
 * TypeScript definitions for the role-aware UI system
 * Enhanced with UB/TAX classification for conditional card rendering
 */

// ============================================================================
// PERSONA DEFINITIONS
// ============================================================================

/**
 * All available persona identifiers
 * Organized by UB/TAX vs NON-UB/TAX focus
 */
export type PersonaId =
  // === UB/TAX PERSONAS (Utility Billing + Taxes Focus) ===
  | 'ind_util_tax_1p'   // Individual, Single Property, Utilities + Taxes
  | 'ind_util_tax_mp'   // Individual, Multi-Property, Utilities + Taxes
  | 'bus_util_tax_1p'   // Business, Single Location, Utilities + Taxes
  | 'bus_util_tax_mp'   // Business, Multi-Site, Utilities + Taxes
  | 'hyb_util_tax'      // Hybrid: Individual + Business UB/TAX
  | 'll_util_tax_mp'    // Landlord Multi-Unit Utilities & Taxes
  
  // === HYBRID PERSONAS (Can be UB/TAX or NON-UB/TAX) ===
  | 'maria'             // Resident (Bills/Utilities) - UB if present
  | 'devin'             // Mobile Quick User (Violations)
  | 'charles'           // Senior (Accessibility) - UB/TAX if present
  | 'jasmine'           // Payment Assistance - UB/TAX focus
  | 'taylor'            // New Resident - UB/TAX if enabled
  | 'sandra'            // Multi-Taxpayer - Pure UB/TAX
  | 'priya'             // Small Business Owner - NON-UB/TAX unless business UB
  | 'danny'             // Contractor - Permits focus
  | 'school_admin'      // School Admin - Can have UB/TAX
  
  // === NON-UB/TAX PERSONAS (Permits, Licenses, Grants, Vendors) ===
  | 'alicia'            // Nonprofit Administrator
  | 'marco'             // Community Organizer
  | 'jordan'            // Small Vendor
  | 'samuel';           // Enterprise Vendor

/**
 * Persona category groupings - now includes UB/TAX classification
 */
export type PersonaCategory =
  | 'resident'
  | 'business'
  | 'organization'
  | 'vendor'
  | 'institution';

/**
 * UB/TAX classification category for the persona switcher grouping
 */
export type UBTaxCategory = 'UB_TAX' | 'NON_UB_TAX' | 'HYBRID';

/**
 * Entity type for persona (individual, business, organization, school)
 */
export type PersonaEntityType = 'individual' | 'business' | 'organization' | 'school';

/**
 * OpenGov product access flags
 */
export interface OpenGovProductAccess {
  billing: boolean;        // Utility billing
  taxes: boolean;          // Property taxes
  permits: boolean;        // Permits & licensing
  procurement: boolean;    // Vendor/procurement
  grants: boolean;         // Grants management
  parksAndRec: boolean;    // Parks & recreation
  codeEnforcement: boolean; // Code enforcement / violations
  businessLicense: boolean; // Business licensing
}

/**
 * Entity types that can be linked to a user
 */
export type EntityType =
  | 'residential_property'
  | 'business'
  | 'contractor_license'
  | 'vendor_registration'
  | 'nonprofit'
  | 'school'
  | 'community_org';

/**
 * A linked entity (property, business, etc.)
 */
export interface LinkedEntity {
  id: string;
  type: EntityType;
  name: string;
  address?: string;
  role: 'owner' | 'manager' | 'authorized' | 'member';
  isPrimary?: boolean;
}

/**
 * User roles from backend
 */
export type UserRole =
  | 'resident'
  | 'property_owner'
  | 'business_owner'
  | 'contractor'
  | 'vendor'
  | 'nonprofit_admin'
  | 'community_leader'
  | 'school_admin'
  | 'landlord'
  | 'senior'
  | 'low_income'
  | 'new_resident';

// ============================================================================
// PERSONA CAPABILITIES
// ============================================================================

/**
 * Capabilities derived from active persona
 * These drive conditional rendering of UI sections
 */
export interface PersonaCapabilities {
  // Section visibility
  showUtilityBilling: boolean;
  showPropertyTaxes: boolean;
  showBusinessOverview: boolean;
  showPermitsInspections: boolean;
  showVendorActivity: boolean;
  showGrantsPrograms: boolean;
  showParksAndRec: boolean;
  showCodeViolations: boolean;
  
  // Special features
  showPaymentAssistance: boolean;
  showNewResidentOnboarding: boolean;
  showAccessibilityBar: boolean;
  showQuickActions: boolean;
  showMultiPropertyView: boolean;
  showContractorDashboard: boolean;
  showNonprofitTools: boolean;
  showSchoolFacilities: boolean;
  
  // UI preferences
  useLargeText: boolean;
  useHighContrast: boolean;
  useSimplifiedNav: boolean;
  showMobileOptimized: boolean;
  
  // Access levels
  hasBusinessAccess: boolean;
  hasVendorAccess: boolean;
  hasInstitutionalAccess: boolean;
  isNewResident: boolean;
  isSenior: boolean;
  needsAssistance: boolean;
}

// ============================================================================
// PERSONA DEFINITION
// ============================================================================

/**
 * UB/TAX classification flags for a persona
 * These determine which cards and experiences are shown
 */
export interface UBTaxClassification {
  /** Has utility billing access */
  isUtilityUser: boolean;
  /** Has property/business tax access */
  isTaxUser: boolean;
  /** True if either isUtilityUser or isTaxUser is true */
  isUBTaxPersona: boolean;
  /** True only when both isUtilityUser and isTaxUser are false */
  isNonUBTaxPersona: boolean;
  /** Supports multiple properties/accounts */
  supportsMultiProperty: boolean;
  /** Entity type for this persona */
  entityType: PersonaEntityType;
  /** UB/TAX category for switcher grouping */
  ubTaxCategory: UBTaxCategory;
}

/**
 * Full persona definition
 */
export interface Persona {
  id: PersonaId;
  name: string;
  label: string;
  description: string;
  category: PersonaCategory;
  avatar?: string;
  
  // UB/TAX classification
  ubTaxClassification: UBTaxClassification;
  
  // Default capabilities for this persona
  capabilities: PersonaCapabilities;
  
  // Typical user characteristics
  characteristics: {
    primaryUseCase: string;
    typicalEntities: EntityType[];
    typicalProducts: (keyof OpenGovProductAccess)[];
  };
  
  // Cards visible for this persona
  visibleCards: string[];
}

// ============================================================================
// PERSONA CONTEXT
// ============================================================================

/**
 * Inference rules for automatic persona detection
 */
export interface PersonaInferenceRules {
  // Priority order for inference (higher = checked first)
  priority: number;
  
  // Conditions that trigger this persona
  conditions: {
    hasEntityTypes?: EntityType[];
    hasRoles?: UserRole[];
    hasProductAccess?: (keyof OpenGovProductAccess)[];
    entityCount?: { min?: number; max?: number };
    isNewUser?: boolean;
  };
  
  // Resulting persona
  inferredPersona: PersonaId;
}

/**
 * User profile data used for persona inference
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  linkedEntities: LinkedEntity[];
  productAccess: OpenGovProductAccess;
  accountCreatedAt: Date;
  preferences?: {
    accessibility?: {
      largeText?: boolean;
      highContrast?: boolean;
    };
  };
}

/**
 * Persona context state
 */
export interface PersonaContextState {
  // Current active persona
  activePersona: Persona;
  
  // All available personas for this user
  availablePersonas: Persona[];
  
  // Derived capabilities (merged from persona + user overrides)
  capabilities: PersonaCapabilities;
  
  // User's actual profile data
  userProfile: UserProfile;
  
  // Override state
  isOverrideActive: boolean;
  overridePersonaId: PersonaId | null;
  
  // Mode
  mode: 'automatic' | 'manual';
  
  // Feature flags
  personaSwitcherEnabled: boolean;
  isDevMode: boolean;
}

/**
 * Persona context actions
 */
export interface PersonaContextActions {
  // Switch to a specific persona (manual override)
  setPersonaOverride: (personaId: PersonaId) => void;
  
  // Clear override and return to automatic detection
  clearOverride: () => void;
  
  // Toggle between automatic and manual mode
  setMode: (mode: 'automatic' | 'manual') => void;
  
  // Update user profile (simulates backend data changes)
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  
  // Refresh persona inference
  refreshPersona: () => void;
}

/**
 * Full persona context (state + actions)
 */
export interface PersonaContext extends PersonaContextState, PersonaContextActions {}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

/**
 * Props for PersonaSwitcher component
 */
export interface PersonaSwitcherProps {
  // Visual style
  variant?: 'dropdown' | 'segmented' | 'drawer';
  
  // Position
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline';
  
  // Show category groupings
  showCategories?: boolean;
  
  // Compact mode (icon only until expanded)
  compact?: boolean;
  
  // Custom class name
  className?: string;
}

/**
 * Props for conditional section wrapper
 */
export interface PersonaGateProps {
  // Capabilities required to show children
  requires?: (keyof PersonaCapabilities)[];
  
  // Show if ANY of these are true (default: all must be true)
  requiresAny?: boolean;
  
  // Invert logic (hide if conditions met)
  invert?: boolean;
  
  // Fallback content if not shown
  fallback?: React.ReactNode;
  
  // Children to conditionally render
  children: React.ReactNode;
}

