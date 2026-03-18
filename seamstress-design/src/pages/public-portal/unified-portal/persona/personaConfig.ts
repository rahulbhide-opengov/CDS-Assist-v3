/**
 * Persona Configuration
 * Comprehensive persona definitions with UB/TAX classification
 * 
 * UB/TAX = Utility Billing + Taxes focused personas
 * NON-UB/TAX = Permits, Licenses, Grants, Vendors focused personas
 * HYBRID = Can show both based on context
 */

import type {
  Persona,
  PersonaId,
  PersonaCapabilities,
  PersonaInferenceRules,
  OpenGovProductAccess,
  UBTaxClassification,
  PersonaCategory,
  UBTaxCategory,
} from './types';

// ============================================================================
// DEFAULT CAPABILITIES (all false baseline)
// ============================================================================

const defaultCapabilities: PersonaCapabilities = {
  // Section visibility
  showUtilityBilling: false,
  showPropertyTaxes: false,
  showBusinessOverview: false,
  showPermitsInspections: false,
  showVendorActivity: false,
  showGrantsPrograms: false,
  showParksAndRec: false,
  showCodeViolations: false,
  
  // Special features
  showPaymentAssistance: false,
  showNewResidentOnboarding: false,
  showAccessibilityBar: false,
  showQuickActions: true,
  showMultiPropertyView: false,
  showContractorDashboard: false,
  showNonprofitTools: false,
  showSchoolFacilities: false,
  
  // UI preferences
  useLargeText: false,
  useHighContrast: false,
  useSimplifiedNav: false,
  showMobileOptimized: false,
  
  // Access levels
  hasBusinessAccess: false,
  hasVendorAccess: false,
  hasInstitutionalAccess: false,
  isNewResident: false,
  isSenior: false,
  needsAssistance: false,
};

// ============================================================================
// UB/TAX CLASSIFICATION HELPERS
// ============================================================================

/**
 * Create UB/TAX classification object
 */
const createUBTaxClassification = (
  isUtilityUser: boolean,
  isTaxUser: boolean,
  supportsMultiProperty: boolean,
  entityType: 'individual' | 'business' | 'organization' | 'school'
): UBTaxClassification => {
  const isUBTaxPersona = isUtilityUser || isTaxUser;
  const isNonUBTaxPersona = !isUtilityUser && !isTaxUser;
  
  let ubTaxCategory: UBTaxCategory;
  if (isNonUBTaxPersona) {
    ubTaxCategory = 'NON_UB_TAX';
  } else if (isUtilityUser && isTaxUser) {
    ubTaxCategory = 'UB_TAX';
  } else {
    ubTaxCategory = 'HYBRID';
  }
  
  return {
    isUtilityUser,
    isTaxUser,
    isUBTaxPersona,
    isNonUBTaxPersona,
    supportsMultiProperty,
    entityType,
    ubTaxCategory,
  };
};

// ============================================================================
// CARD IDs FOR VISIBILITY
// ============================================================================

// UB/TAX Cards
const UB_TAX_CARDS = [
  'todayTasks',
  'bills',
  'utilities',
  'taxes',
  'paymentAssistance',
  'propertySelector',
  'multiPropertyDashboard',
  'notifications',
  'history',
  'exploreServices',
  'quickActions',
  'faq',
  'helpCard',
];

// NON-UB/TAX Cards
const NON_UB_TAX_CARDS = [
  'todayTasks',
  'permits',
  'permitsInspections',
  'grantsPrograms',
  'vendorActivity',
  'schoolOps',
  'businessOverview',
  'communityEvents',
  'notifications',
  'exploreServices',
  'quickActions',
  'faq',
  'helpCard',
];

// ============================================================================
// PERSONA DEFINITIONS
// ============================================================================

export const personas: Record<PersonaId, Persona> = {
  // ===========================================================================
  // UB/TAX PERSONAS (Utility Billing + Taxes Focus)
  // ===========================================================================
  
  ind_util_tax_1p: {
    id: 'ind_util_tax_1p',
    name: 'Homeowner',
    label: 'Homeowner – Simple Household',
    description: 'One home, one utility account, one property tax account. Simple UB/TAX view.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, true, false, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Pay monthly utility bills, view property taxes, simple account management',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'taxes'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  ind_util_tax_mp: {
    id: 'ind_util_tax_mp',
    name: 'Multi-Property Owner',
    label: 'Multi-Property Individual',
    description: 'Owns several homes or rentals. Multiple utility and property tax accounts. Needs aggregated UB/TAX view.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, true, true, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showMultiPropertyView: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Manage utilities and taxes across multiple properties, view aggregated balances',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'taxes'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'propertySelector', 'multiPropertyDashboard', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  bus_util_tax_1p: {
    id: 'bus_util_tax_1p',
    name: 'Single-Site Business',
    label: 'Single-Site Business',
    description: 'One storefront or facility. Commercial utilities and business/property tax.',
    category: 'business',
    ubTaxClassification: createUBTaxClassification(true, true, false, 'business'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showBusinessOverview: true,
      hasBusinessAccess: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Manage commercial utility bills, pay business taxes, single location management',
      typicalEntities: ['business', 'residential_property'],
      typicalProducts: ['billing', 'taxes', 'businessLicense'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'businessOverview', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  bus_util_tax_mp: {
    id: 'bus_util_tax_mp',
    name: 'Multi-Site Business',
    label: 'Multi-Site Business Operator',
    description: 'Multiple business locations. Multiple UB/TAX accounts across sites.',
    category: 'business',
    ubTaxClassification: createUBTaxClassification(true, true, true, 'business'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showBusinessOverview: true,
      showMultiPropertyView: true,
      hasBusinessAccess: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Manage utilities and taxes across multiple business locations, aggregated reporting',
      typicalEntities: ['business'],
      typicalProducts: ['billing', 'taxes', 'businessLicense'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'businessOverview', 'propertySelector', 'multiPropertyDashboard', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  hyb_util_tax: {
    id: 'hyb_util_tax',
    name: 'Home + Business Owner',
    label: 'Hybrid Home + Business Owner',
    description: 'Has personal utilities/taxes AND business utilities/taxes. Needs persona-switchable views.',
    category: 'business',
    ubTaxClassification: createUBTaxClassification(true, true, true, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showBusinessOverview: true,
      showMultiPropertyView: true,
      hasBusinessAccess: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Toggle between personal and business views, manage both types of accounts',
      typicalEntities: ['residential_property', 'business'],
      typicalProducts: ['billing', 'taxes', 'businessLicense'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'businessOverview', 'propertySelector', 'multiPropertyDashboard', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  ll_util_tax_mp: {
    id: 'll_util_tax_mp',
    name: 'Landlord',
    label: 'Landlord – Multi-Unit Utilities & Taxes',
    description: 'Utilities and taxes across rental units. Property management focus.',
    category: 'business',
    ubTaxClassification: createUBTaxClassification(true, true, true, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showMultiPropertyView: true,
      showPermitsInspections: true,
      showCodeViolations: true,
      hasBusinessAccess: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Manage multiple rental properties, handle violations, permits across properties',
      typicalEntities: ['residential_property', 'business'],
      typicalProducts: ['billing', 'taxes', 'permits', 'codeEnforcement'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'propertySelector', 'multiPropertyDashboard', 'violations', 'permits', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  // ===========================================================================
  // HYBRID PERSONAS (Can be UB/TAX or NON-UB/TAX depending on access)
  // ===========================================================================

  maria: {
    id: 'maria',
    name: 'Maria',
    label: 'Resident (Bills/Utilities)',
    description: 'Primary focus on paying utility bills. If UB is present → UB persona. If UB/TAX disabled → becomes NON-UB/TAX resident.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, false, false, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showParksAndRec: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Pay monthly utility bills, view usage, manage autopay',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'taxes'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'paymentAssistance', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  devin: {
    id: 'devin',
    name: 'Devin',
    label: 'Mobile Quick User (Violations)',
    description: 'Focus on fast actions and violations. Usually NON-UB/TAX but may overlap.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, false, false, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showCodeViolations: true,
      showQuickActions: true,
      showMobileOptimized: true,
      useSimplifiedNav: true,
    },
    characteristics: {
      primaryUseCase: 'Quick bill payments on mobile, view/respond to violations',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'codeEnforcement'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'violations', 'permits', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  charles: {
    id: 'charles',
    name: 'Charles',
    label: 'Senior (Accessibility)',
    description: 'Accessibility-focused. Primarily UB/TAX if they have them, otherwise NON-UB/TAX resident.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, true, false, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showAccessibilityBar: true,
      showQuickActions: true,
      useLargeText: true,
      useHighContrast: true,
      useSimplifiedNav: true,
      isSenior: true,
    },
    characteristics: {
      primaryUseCase: 'Easy-to-read bills, simple navigation, large text',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'taxes'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'taxes', 'paymentAssistance', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  jasmine: {
    id: 'jasmine',
    name: 'Jasmine',
    label: 'Payment Assistance Resident',
    description: 'Emphasis on payment plans (UB/TAX). If no UB/TAX, emphasize government support programs.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, true, false, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showPaymentAssistance: true,
      showGrantsPrograms: true,
      showQuickActions: true,
      needsAssistance: true,
    },
    characteristics: {
      primaryUseCase: 'Find payment plans, assistance programs, low-income benefits',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'taxes', 'grants'],
    },
    visibleCards: ['todayTasks', 'bills', 'utilities', 'paymentAssistance', 'taxes', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  taylor: {
    id: 'taylor',
    name: 'Taylor',
    label: 'New Resident',
    description: 'If UB/TAX enabled, setup tasks include utilities + tax. If NOT enabled, setup tasks only include permits, onboarding, services.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, true, false, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showNewResidentOnboarding: true,
      showUtilityBilling: true,
      showParksAndRec: true,
      showQuickActions: true,
      isNewResident: true,
    },
    characteristics: {
      primaryUseCase: 'Set up new utility accounts, learn about city services',
      typicalEntities: [],
      typicalProducts: ['billing', 'parksAndRec'],
    },
    visibleCards: ['todayTasks', 'newResidentSetup', 'bills', 'utilities', 'permits', 'taxes', 'notifications', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  sandra: {
    id: 'sandra',
    name: 'Sandra',
    label: 'Multi-Taxpayer',
    description: 'PURE UB/TAX persona. Multiple property tax accounts. Very detailed tax dashboards.',
    category: 'resident',
    ubTaxClassification: createUBTaxClassification(true, true, true, 'individual'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showMultiPropertyView: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Manage taxes and bills across multiple properties',
      typicalEntities: ['residential_property'],
      typicalProducts: ['billing', 'taxes'],
    },
    visibleCards: ['todayTasks', 'taxes', 'bills', 'utilities', 'propertySelector', 'multiPropertyDashboard', 'permits', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  priya: {
    id: 'priya',
    name: 'Priya',
    label: 'Small Business Owner',
    description: 'Largely NON-UB/TAX unless business utilities/taxes exist. Shows business licensing + commercial UB/TAX if enabled.',
    category: 'business',
    ubTaxClassification: createUBTaxClassification(false, false, false, 'business'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPropertyTaxes: true,
      showBusinessOverview: true,
      showPermitsInspections: true,
      showQuickActions: true,
      hasBusinessAccess: true,
    },
    characteristics: {
      primaryUseCase: 'Renew business license, pay commercial bills, manage permits',
      typicalEntities: ['business', 'residential_property'],
      typicalProducts: ['billing', 'taxes', 'permits', 'businessLicense'],
    },
    visibleCards: ['todayTasks', 'businessOverview', 'bills', 'utilities', 'taxes', 'permits', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  danny: {
    id: 'danny',
    name: 'Danny',
    label: 'Contractor/Trades Professional',
    description: 'Permits + inspections (NON-UB/TAX). UB/TAX only if business site has UB/TAX accounts.',
    category: 'business',
    ubTaxClassification: createUBTaxClassification(false, false, false, 'business'),
    capabilities: {
      ...defaultCapabilities,
      showPermitsInspections: true,
      showContractorDashboard: true,
      showQuickActions: true,
      hasBusinessAccess: true,
    },
    characteristics: {
      primaryUseCase: 'Apply for permits, schedule inspections, track permit status',
      typicalEntities: ['contractor_license', 'business'],
      typicalProducts: ['permits'],
    },
    visibleCards: ['todayTasks', 'permitsInspections', 'permits', 'bills', 'utilities', 'businessOverview', 'notifications', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  school_admin: {
    id: 'school_admin',
    name: 'School Administrator',
    label: 'School Administrator / Facility Manager',
    description: 'School facilities, staff licensing. Can also have UB/TAX if school utilities/taxes exist.',
    category: 'institution',
    ubTaxClassification: createUBTaxClassification(true, false, true, 'school'),
    capabilities: {
      ...defaultCapabilities,
      showUtilityBilling: true,
      showPermitsInspections: true,
      showSchoolFacilities: true,
      showParksAndRec: true,
      showGrantsPrograms: true,
      showQuickActions: true,
      hasInstitutionalAccess: true,
    },
    characteristics: {
      primaryUseCase: 'Manage school utilities, facility permits, field reservations, grants',
      typicalEntities: ['school'],
      typicalProducts: ['billing', 'permits', 'parksAndRec', 'grants'],
    },
    visibleCards: ['todayTasks', 'schoolOps', 'bills', 'utilities', 'permits', 'grantsPrograms', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  // ===========================================================================
  // NON-UB/TAX PERSONAS (Permits, Licenses, Grants, Vendors)
  // ===========================================================================

  alicia: {
    id: 'alicia',
    name: 'Alicia',
    label: 'Nonprofit Administrator',
    description: 'Grants & Programs (NON-UB/TAX). Focus on nonprofit compliance and community programs.',
    category: 'organization',
    ubTaxClassification: createUBTaxClassification(false, false, false, 'organization'),
    capabilities: {
      ...defaultCapabilities,
      showGrantsPrograms: true,
      showNonprofitTools: true,
      showPermitsInspections: true,
      showQuickActions: true,
      hasInstitutionalAccess: true,
    },
    characteristics: {
      primaryUseCase: 'Apply for grants, manage nonprofit compliance, event permits',
      typicalEntities: ['nonprofit'],
      typicalProducts: ['grants', 'permits'],
    },
    visibleCards: ['todayTasks', 'grantsPrograms', 'bills', 'utilities', 'permits', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  marco: {
    id: 'marco',
    name: 'Marco',
    label: 'Community Organizer',
    description: 'Events, Parks & Rec (NON-UB/TAX). Focus on community engagement and event permits.',
    category: 'organization',
    ubTaxClassification: createUBTaxClassification(false, false, false, 'organization'),
    capabilities: {
      ...defaultCapabilities,
      showParksAndRec: true,
      showPermitsInspections: true,
      showGrantsPrograms: true,
      showQuickActions: true,
    },
    characteristics: {
      primaryUseCase: 'Reserve facilities, apply for event permits, community programs',
      typicalEntities: ['community_org'],
      typicalProducts: ['parksAndRec', 'permits', 'grants'],
    },
    visibleCards: ['todayTasks', 'permits', 'grantsPrograms', 'communityEvents', 'bills', 'notifications', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  jordan: {
    id: 'jordan',
    name: 'Jordan',
    label: 'Small Vendor',
    description: 'Vendor procurement (NON-UB/TAX). Basic procurement and bidding.',
    category: 'vendor',
    ubTaxClassification: createUBTaxClassification(false, false, false, 'business'),
    capabilities: {
      ...defaultCapabilities,
      showVendorActivity: true,
      showQuickActions: true,
      hasVendorAccess: true,
    },
    characteristics: {
      primaryUseCase: 'Find bid opportunities, submit proposals, track contracts',
      typicalEntities: ['vendor_registration', 'business'],
      typicalProducts: ['procurement'],
    },
    visibleCards: ['todayTasks', 'vendorActivity', 'businessOverview', 'bills', 'notifications', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },

  samuel: {
    id: 'samuel',
    name: 'Samuel',
    label: 'Enterprise Vendor',
    description: 'Vendor procurement at scale (NON-UB/TAX). Large-scale vendor operations.',
    category: 'vendor',
    ubTaxClassification: createUBTaxClassification(false, false, false, 'business'),
    capabilities: {
      ...defaultCapabilities,
      showVendorActivity: true,
      showBusinessOverview: true,
      showQuickActions: true,
      hasVendorAccess: true,
      hasBusinessAccess: true,
    },
    characteristics: {
      primaryUseCase: 'Manage large contracts, compliance docs, multi-department bids',
      typicalEntities: ['vendor_registration', 'business'],
      typicalProducts: ['procurement', 'businessLicense'],
    },
    visibleCards: ['todayTasks', 'vendorActivity', 'businessOverview', 'bills', 'taxes', 'notifications', 'history', 'exploreServices', 'quickActions', 'faq', 'helpCard'],
  },
};

// ============================================================================
// PERSONA GROUPING BY UB/TAX CATEGORY
// ============================================================================

/**
 * Get personas grouped by UB/TAX category for the switcher
 */
export const getPersonasByUBTaxCategory = (): Record<UBTaxCategory, Persona[]> => {
  const result: Record<UBTaxCategory, Persona[]> = {
    'UB_TAX': [],
    'HYBRID': [],
    'NON_UB_TAX': [],
  };
  
  Object.values(personas).forEach(persona => {
    result[persona.ubTaxClassification.ubTaxCategory].push(persona);
  });
  
  return result;
};

/**
 * UB/TAX category configuration for UI display
 */
export const ubTaxCategoryConfig: Record<UBTaxCategory, { label: string; description: string; color: string; bgColor: string }> = {
  'UB_TAX': {
    label: 'Utility & Tax Users',
    description: 'Primary focus on utility billing and property taxes',
    color: '#0066CC',
    bgColor: '#E6F0FF',
  },
  'HYBRID': {
    label: 'Flexible Users',
    description: 'Can use both UB/TAX and non-UB/TAX features',
    color: '#7C3AED',
    bgColor: '#F3E8FF',
  },
  'NON_UB_TAX': {
    label: 'Services & Permits',
    description: 'Focus on permits, grants, vendors, and programs',
    color: '#059669',
    bgColor: '#D1FAE5',
  },
};

// ============================================================================
// PERSONA INFERENCE RULES
// ============================================================================

/**
 * Rules for automatic persona detection
 * Ordered by priority (highest first)
 */
export const inferenceRules: PersonaInferenceRules[] = [
  // Priority 100: Special cases - New users
  {
    priority: 100,
    conditions: {
      isNewUser: true,
    },
    inferredPersona: 'taylor',
  },
  
  // Priority 95: Multi-site business with UB/TAX
  {
    priority: 95,
    conditions: {
      hasEntityTypes: ['business'],
      entityCount: { min: 2 },
      hasProductAccess: ['billing', 'taxes'],
    },
    inferredPersona: 'bus_util_tax_mp',
  },
  
  // Priority 92: Hybrid home + business
  {
    priority: 92,
    conditions: {
      hasEntityTypes: ['residential_property', 'business'],
      hasProductAccess: ['billing', 'taxes', 'businessLicense'],
    },
    inferredPersona: 'hyb_util_tax',
  },
  
  // Priority 90: School administrators
  {
    priority: 90,
    conditions: {
      hasEntityTypes: ['school'],
      hasRoles: ['school_admin'],
    },
    inferredPersona: 'school_admin',
  },
  
  // Priority 88: Landlords (multiple properties)
  {
    priority: 88,
    conditions: {
      hasEntityTypes: ['residential_property'],
      entityCount: { min: 3 },
      hasRoles: ['landlord'],
      hasProductAccess: ['billing', 'taxes'],
    },
    inferredPersona: 'll_util_tax_mp',
  },
  
  // Priority 85: Enterprise vendors
  {
    priority: 85,
    conditions: {
      hasEntityTypes: ['vendor_registration'],
      hasProductAccess: ['procurement'],
      entityCount: { min: 2 },
    },
    inferredPersona: 'samuel',
  },
  
  // Priority 82: Small vendors
  {
    priority: 82,
    conditions: {
      hasEntityTypes: ['vendor_registration'],
      hasProductAccess: ['procurement'],
    },
    inferredPersona: 'jordan',
  },
  
  // Priority 80: Nonprofits
  {
    priority: 80,
    conditions: {
      hasEntityTypes: ['nonprofit'],
      hasProductAccess: ['grants'],
    },
    inferredPersona: 'alicia',
  },
  
  // Priority 75: Contractors
  {
    priority: 75,
    conditions: {
      hasEntityTypes: ['contractor_license'],
      hasProductAccess: ['permits'],
    },
    inferredPersona: 'danny',
  },
  
  // Priority 72: Single-site business with UB/TAX
  {
    priority: 72,
    conditions: {
      hasEntityTypes: ['business'],
      hasProductAccess: ['billing', 'businessLicense'],
    },
    inferredPersona: 'bus_util_tax_1p',
  },
  
  // Priority 70: Business owners (general)
  {
    priority: 70,
    conditions: {
      hasEntityTypes: ['business'],
      hasProductAccess: ['businessLicense'],
    },
    inferredPersona: 'priya',
  },
  
  // Priority 65: Multi-property owners with taxes
  {
    priority: 65,
    conditions: {
      hasEntityTypes: ['residential_property'],
      entityCount: { min: 2 },
      hasProductAccess: ['taxes'],
    },
    inferredPersona: 'ind_util_tax_mp',
  },
  
  // Priority 60: Multi-taxpayer (Sandra)
  {
    priority: 60,
    conditions: {
      hasEntityTypes: ['residential_property'],
      entityCount: { min: 2 },
      hasProductAccess: ['billing', 'taxes'],
    },
    inferredPersona: 'sandra',
  },
  
  // Priority 55: Payment assistance
  {
    priority: 55,
    conditions: {
      hasRoles: ['low_income'],
      hasProductAccess: ['billing'],
    },
    inferredPersona: 'jasmine',
  },
  
  // Priority 50: Senior users
  {
    priority: 50,
    conditions: {
      hasRoles: ['senior'],
    },
    inferredPersona: 'charles',
  },
  
  // Priority 45: Community organizers
  {
    priority: 45,
    conditions: {
      hasEntityTypes: ['community_org'],
      hasRoles: ['community_leader'],
    },
    inferredPersona: 'marco',
  },
  
  // Priority 40: Code violations focus
  {
    priority: 40,
    conditions: {
      hasProductAccess: ['codeEnforcement', 'billing'],
    },
    inferredPersona: 'devin',
  },
  
  // Priority 30: Simple homeowner with UB/TAX
  {
    priority: 30,
    conditions: {
      hasEntityTypes: ['residential_property'],
      hasProductAccess: ['billing', 'taxes'],
      entityCount: { max: 1 },
    },
    inferredPersona: 'ind_util_tax_1p',
  },
  
  // Priority 10: Default resident (utility payer)
  {
    priority: 10,
    conditions: {
      hasProductAccess: ['billing'],
    },
    inferredPersona: 'maria',
  },
];

// ============================================================================
// TILE CONFIGURATION
// ============================================================================

/**
 * Homepage tiles and their persona requirements
 */
export interface TileConfig {
  id: string;
  title: string;
  requiredCapabilities: (keyof PersonaCapabilities)[];
  requireAll?: boolean;
  ubTaxOnly?: boolean;
  nonUBTaxOnly?: boolean;
}

export const tileConfigs: TileConfig[] = [
  // UB/TAX tiles
  {
    id: 'utility-billing',
    title: 'Utility Bills',
    requiredCapabilities: ['showUtilityBilling'],
    ubTaxOnly: true,
  },
  {
    id: 'property-taxes',
    title: 'Property Taxes',
    requiredCapabilities: ['showPropertyTaxes'],
    ubTaxOnly: true,
  },
  {
    id: 'payment-assistance',
    title: 'Payment Assistance',
    requiredCapabilities: ['showPaymentAssistance', 'needsAssistance'],
    ubTaxOnly: true,
  },
  {
    id: 'multi-property',
    title: 'Property Dashboard',
    requiredCapabilities: ['showMultiPropertyView'],
    ubTaxOnly: true,
  },
  
  // NON-UB/TAX tiles
  {
    id: 'permits-inspections',
    title: 'Permits & Inspections',
    requiredCapabilities: ['showPermitsInspections'],
  },
  {
    id: 'grants-programs',
    title: 'Grants & Programs',
    requiredCapabilities: ['showGrantsPrograms'],
    nonUBTaxOnly: true,
  },
  {
    id: 'vendor-activity',
    title: 'Vendor Activity',
    requiredCapabilities: ['showVendorActivity', 'hasVendorAccess'],
    requireAll: true,
    nonUBTaxOnly: true,
  },
  {
    id: 'school-facilities',
    title: 'School Facilities',
    requiredCapabilities: ['showSchoolFacilities', 'hasInstitutionalAccess'],
    requireAll: true,
    nonUBTaxOnly: true,
  },
  
  // Shared tiles
  {
    id: 'business-overview',
    title: 'Business Overview',
    requiredCapabilities: ['showBusinessOverview', 'hasBusinessAccess'],
    requireAll: true,
  },
  {
    id: 'parks-rec',
    title: 'Parks & Recreation',
    requiredCapabilities: ['showParksAndRec'],
  },
  {
    id: 'code-violations',
    title: 'Code Violations',
    requiredCapabilities: ['showCodeViolations'],
  },
  {
    id: 'new-resident',
    title: 'New Resident Setup',
    requiredCapabilities: ['showNewResidentOnboarding', 'isNewResident'],
    requireAll: true,
  },
  {
    id: 'contractor-dashboard',
    title: 'Contractor Dashboard',
    requiredCapabilities: ['showContractorDashboard'],
  },
  {
    id: 'nonprofit-tools',
    title: 'Nonprofit Tools',
    requiredCapabilities: ['showNonprofitTools'],
  },
];

// ============================================================================
// FEATURE FLAGS
// ============================================================================

export interface PersonaFeatureFlags {
  personaSwitcherEnabled: boolean;
  showInProduction: boolean;
  allowAllPersonas: boolean;
  enableAutoDetection: boolean;
}

export const defaultFeatureFlags: PersonaFeatureFlags = {
  personaSwitcherEnabled: true,
  showInProduction: false,
  allowAllPersonas: true,
  enableAutoDetection: true,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all personas in a specific category
 */
export const getPersonasByCategory = (category: PersonaCategory): Persona[] => {
  return Object.values(personas).filter(p => p.category === category);
};

/**
 * Get persona by ID
 */
export const getPersonaById = (id: PersonaId): Persona | undefined => {
  return personas[id];
};

/**
 * Check if a tile should be visible for given capabilities
 */
export const isTileVisible = (
  tileId: string,
  capabilities: PersonaCapabilities
): boolean => {
  const tile = tileConfigs.find(t => t.id === tileId);
  if (!tile) return false;
  
  if (tile.requireAll) {
    return tile.requiredCapabilities.every(cap => capabilities[cap]);
  }
  return tile.requiredCapabilities.some(cap => capabilities[cap]);
};

/**
 * Get default product access (all false)
 */
export const getDefaultProductAccess = (): OpenGovProductAccess => ({
  billing: false,
  taxes: false,
  permits: false,
  procurement: false,
  grants: false,
  parksAndRec: false,
  codeEnforcement: false,
  businessLicense: false,
});

/**
 * Check if persona is UB/TAX focused
 */
export const isUBTaxPersona = (personaId: PersonaId): boolean => {
  const persona = personas[personaId];
  return persona?.ubTaxClassification.isUBTaxPersona ?? false;
};

/**
 * Check if persona is NON-UB/TAX focused
 */
export const isNonUBTaxPersona = (personaId: PersonaId): boolean => {
  const persona = personas[personaId];
  return persona?.ubTaxClassification.isNonUBTaxPersona ?? true;
};

/**
 * Get visible cards based on UB/TAX classification
 */
export const getUBTaxAwareCards = (persona: Persona, hasUBTaxAccess: boolean): string[] => {
  const baseCards = persona.visibleCards;
  
  // If persona is NON-UB/TAX, filter out UB/TAX cards unless they have access
  if (persona.ubTaxClassification.isNonUBTaxPersona && !hasUBTaxAccess) {
    return baseCards.filter(card => !['bills', 'utilities', 'taxes', 'paymentAssistance', 'propertySelector', 'multiPropertyDashboard'].includes(card));
  }
  
  return baseCards;
};
