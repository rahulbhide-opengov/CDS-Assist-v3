/**
 * Persona Context Provider
 * Manages persona state, inference, and switching
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type {
  PersonaContext as IPersonaContext,
  PersonaContextState,
  PersonaId,
  Persona,
  PersonaCapabilities,
  UserProfile,
  OpenGovProductAccess,
  LinkedEntity,
} from './types';
import {
  personas,
  inferenceRules,
  defaultFeatureFlags,
  getDefaultProductAccess,
} from './personaConfig';

// ============================================================================
// STORAGE KEYS
// ============================================================================

const STORAGE_KEYS = {
  OVERRIDE_PERSONA: 'persona_override',
  MODE: 'persona_mode',
} as const;

// ============================================================================
// MOCK USER PROFILES FOR DEVELOPMENT
// ============================================================================

/**
 * Sample user profiles for testing different personas
 */
export const mockUserProfiles: Record<string, UserProfile> = {
  maria: {
    id: 'user-maria',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    roles: ['resident', 'property_owner'],
    linkedEntities: [
      { id: 'prop-1', type: 'residential_property', name: '123 Main Street', address: '123 Main St, Cloud City, ST 12345', role: 'owner', isPrimary: true },
    ],
    productAccess: { ...getDefaultProductAccess(), billing: true, taxes: true },
    accountCreatedAt: new Date('2020-01-15'),
  },
  
  paul: {
    id: 'user-paul',
    name: 'Paul Atreides',
    email: 'paul@example.com',
    roles: ['resident', 'property_owner', 'business_owner'],
    linkedEntities: [
      { id: 'prop-1', type: 'residential_property', name: '123 Main Street', address: '123 Main St, Cloud City, ST 12345', role: 'owner', isPrimary: true },
      { id: 'prop-2', type: 'residential_property', name: '789 Oak Avenue', address: '789 Oak Ave, Cloud City, ST 12345', role: 'owner' },
      { id: 'biz-1', type: 'business', name: 'ABC Consulting LLC', address: '456 Business Ave, Cloud City, ST 12345', role: 'owner' },
    ],
    productAccess: { ...getDefaultProductAccess(), billing: true, taxes: true, permits: true, businessLicense: true },
    accountCreatedAt: new Date('2019-06-01'),
  },
  
  taylor: {
    id: 'user-taylor',
    name: 'Taylor Swift',
    email: 'taylor@example.com',
    roles: ['new_resident'],
    linkedEntities: [],
    productAccess: { ...getDefaultProductAccess(), billing: true },
    accountCreatedAt: new Date(), // Just created
  },
  
  danny: {
    id: 'user-danny',
    name: 'Danny Builder',
    email: 'danny@example.com',
    roles: ['contractor'],
    linkedEntities: [
      { id: 'lic-1', type: 'contractor_license', name: "Danny's Construction", role: 'owner' },
      { id: 'biz-2', type: 'business', name: "Danny's Construction LLC", address: '100 Industrial Way', role: 'owner' },
    ],
    productAccess: { ...getDefaultProductAccess(), permits: true, businessLicense: true },
    accountCreatedAt: new Date('2018-03-10'),
  },
  
  alicia: {
    id: 'user-alicia',
    name: 'Alicia Nonprofit',
    email: 'alicia@example.com',
    roles: ['nonprofit_admin'],
    linkedEntities: [
      { id: 'np-1', type: 'nonprofit', name: 'Cloud City Food Bank', address: '200 Charity Lane', role: 'manager' },
    ],
    productAccess: { ...getDefaultProductAccess(), grants: true, permits: true },
    accountCreatedAt: new Date('2017-09-20'),
  },
  
  jordan: {
    id: 'user-jordan',
    name: 'Jordan Vendor',
    email: 'jordan@example.com',
    roles: ['vendor'],
    linkedEntities: [
      { id: 'ven-1', type: 'vendor_registration', name: 'JV Supplies Inc', role: 'owner' },
      { id: 'biz-3', type: 'business', name: 'JV Supplies Inc', address: '300 Commerce Blvd', role: 'owner' },
    ],
    productAccess: { ...getDefaultProductAccess(), procurement: true },
    accountCreatedAt: new Date('2021-02-15'),
  },
  
  sandra: {
    id: 'user-sandra',
    name: 'Sandra Multi-Property',
    email: 'sandra@example.com',
    roles: ['resident', 'property_owner'],
    linkedEntities: [
      { id: 'prop-a', type: 'residential_property', name: '100 First Ave', address: '100 First Ave, Cloud City', role: 'owner', isPrimary: true },
      { id: 'prop-b', type: 'residential_property', name: '200 Second St', address: '200 Second St, Cloud City', role: 'owner' },
      { id: 'prop-c', type: 'residential_property', name: '300 Third Blvd', address: '300 Third Blvd, Cloud City', role: 'owner' },
    ],
    productAccess: { ...getDefaultProductAccess(), billing: true, taxes: true },
    accountCreatedAt: new Date('2015-08-01'),
  },
  
  charles: {
    id: 'user-charles',
    name: 'Charles Senior',
    email: 'charles@example.com',
    roles: ['resident', 'property_owner', 'senior'],
    linkedEntities: [
      { id: 'prop-sr', type: 'residential_property', name: '555 Elm Street', address: '555 Elm St, Cloud City', role: 'owner', isPrimary: true },
    ],
    productAccess: { ...getDefaultProductAccess(), billing: true, taxes: true },
    accountCreatedAt: new Date('2010-01-01'),
    preferences: {
      accessibility: { largeText: true, highContrast: true },
    },
  },
};

// Default user profile (Paul - has multiple account types)
const defaultUserProfile = mockUserProfiles.paul;

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const PersonaContext = createContext<IPersonaContext | null>(null);

// ============================================================================
// INFERENCE ENGINE
// ============================================================================

/**
 * Infer the best persona based on user profile
 */
function inferPersona(profile: UserProfile): PersonaId {
  // Check if user is brand new (created within last 7 days)
  const daysSinceCreation = Math.floor(
    (Date.now() - profile.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isNewUser = daysSinceCreation < 7 && profile.linkedEntities.length === 0;
  
  // Sort rules by priority (highest first)
  const sortedRules = [...inferenceRules].sort((a, b) => b.priority - a.priority);
  
  for (const rule of sortedRules) {
    const { conditions, inferredPersona } = rule;
    let matches = true;
    
    // Check isNewUser condition
    if (conditions.isNewUser !== undefined) {
      if (conditions.isNewUser !== isNewUser) {
        matches = false;
      }
    }
    
    // Check entity types
    if (conditions.hasEntityTypes && matches) {
      const hasRequiredEntity = conditions.hasEntityTypes.some(entityType =>
        profile.linkedEntities.some(e => e.type === entityType)
      );
      if (!hasRequiredEntity) matches = false;
    }
    
    // Check roles
    if (conditions.hasRoles && matches) {
      const hasRequiredRole = conditions.hasRoles.some(role =>
        profile.roles.includes(role)
      );
      if (!hasRequiredRole) matches = false;
    }
    
    // Check product access
    if (conditions.hasProductAccess && matches) {
      const hasRequiredProduct = conditions.hasProductAccess.some(product =>
        profile.productAccess[product]
      );
      if (!hasRequiredProduct) matches = false;
    }
    
    // Check entity count
    if (conditions.entityCount && matches) {
      const count = profile.linkedEntities.length;
      if (conditions.entityCount.min !== undefined && count < conditions.entityCount.min) {
        matches = false;
      }
      if (conditions.entityCount.max !== undefined && count > conditions.entityCount.max) {
        matches = false;
      }
    }
    
    if (matches) {
      return inferredPersona;
    }
  }
  
  // Default fallback
  return 'maria';
}

/**
 * Merge persona capabilities with user-specific overrides
 */
function mergeCapabilities(
  baseCapabilities: PersonaCapabilities,
  profile: UserProfile
): PersonaCapabilities {
  const merged = { ...baseCapabilities };
  
  // Apply accessibility preferences
  if (profile.preferences?.accessibility?.largeText) {
    merged.useLargeText = true;
  }
  if (profile.preferences?.accessibility?.highContrast) {
    merged.useHighContrast = true;
  }
  
  // Enable sections based on actual product access
  if (profile.productAccess.billing) merged.showUtilityBilling = true;
  if (profile.productAccess.taxes) merged.showPropertyTaxes = true;
  if (profile.productAccess.permits) merged.showPermitsInspections = true;
  if (profile.productAccess.procurement) {
    merged.showVendorActivity = true;
    merged.hasVendorAccess = true;
  }
  if (profile.productAccess.grants) merged.showGrantsPrograms = true;
  if (profile.productAccess.parksAndRec) merged.showParksAndRec = true;
  if (profile.productAccess.codeEnforcement) merged.showCodeViolations = true;
  if (profile.productAccess.businessLicense) {
    merged.showBusinessOverview = true;
    merged.hasBusinessAccess = true;
  }
  
  // Check for multiple properties
  const propertyCount = profile.linkedEntities.filter(
    e => e.type === 'residential_property'
  ).length;
  if (propertyCount > 1) {
    merged.showMultiPropertyView = true;
  }
  
  return merged;
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface PersonaProviderProps {
  children: React.ReactNode;
  initialProfile?: UserProfile;
  featureFlags?: typeof defaultFeatureFlags;
}

export const PersonaProvider: React.FC<PersonaProviderProps> = ({
  children,
  initialProfile = defaultUserProfile,
  featureFlags = defaultFeatureFlags,
}) => {
  // State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [overridePersonaId, setOverridePersonaId] = useState<PersonaId | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.OVERRIDE_PERSONA);
      return stored as PersonaId | null;
    }
    return null;
  });
  const [mode, setModeState] = useState<'automatic' | 'manual'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEYS.MODE);
      return (stored as 'automatic' | 'manual') || 'automatic';
    }
    return 'automatic';
  });
  
  // Determine if dev mode
  const isDevMode = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' ||
             window.location.hostname === '127.0.0.1' ||
             window.location.search.includes('dev=true');
    }
    return false;
  }, []);
  
  // Should the switcher be enabled?
  const personaSwitcherEnabled = useMemo(() => {
    return featureFlags.personaSwitcherEnabled && (isDevMode || featureFlags.showInProduction);
  }, [featureFlags, isDevMode]);
  
  // Infer persona from profile
  const inferredPersonaId = useMemo(() => {
    if (featureFlags.enableAutoDetection) {
      return inferPersona(userProfile);
    }
    return 'maria';
  }, [userProfile, featureFlags.enableAutoDetection]);
  
  // Active persona ID (considering override)
  const activePersonaId = useMemo(() => {
    if (mode === 'manual' && overridePersonaId) {
      return overridePersonaId;
    }
    return inferredPersonaId;
  }, [mode, overridePersonaId, inferredPersonaId]);
  
  // Get full persona object
  const activePersona = useMemo<Persona>(() => {
    return personas[activePersonaId] || personas.maria;
  }, [activePersonaId]);
  
  // Available personas for switching
  const availablePersonas = useMemo<Persona[]>(() => {
    if (featureFlags.allowAllPersonas && isDevMode) {
      return Object.values(personas);
    }
    // In production, only show personas that match user's actual access
    return Object.values(personas).filter(persona => {
      // Always include the inferred persona
      if (persona.id === inferredPersonaId) return true;
      
      // Check if user has matching entity types
      const hasMatchingEntity = persona.characteristics.typicalEntities.some(entityType =>
        userProfile.linkedEntities.some(e => e.type === entityType)
      );
      
      // Check if user has matching product access
      const hasMatchingProduct = persona.characteristics.typicalProducts.some(product =>
        userProfile.productAccess[product as keyof OpenGovProductAccess]
      );
      
      return hasMatchingEntity || hasMatchingProduct;
    });
  }, [featureFlags.allowAllPersonas, isDevMode, inferredPersonaId, userProfile]);
  
  // Merged capabilities
  const capabilities = useMemo<PersonaCapabilities>(() => {
    return mergeCapabilities(activePersona.capabilities, userProfile);
  }, [activePersona, userProfile]);
  
  // Actions
  const setPersonaOverride = useCallback((personaId: PersonaId) => {
    setOverridePersonaId(personaId);
    setModeState('manual');
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.OVERRIDE_PERSONA, personaId);
      localStorage.setItem(STORAGE_KEYS.MODE, 'manual');
    }
  }, []);
  
  const clearOverride = useCallback(() => {
    setOverridePersonaId(null);
    setModeState('automatic');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.OVERRIDE_PERSONA);
      localStorage.setItem(STORAGE_KEYS.MODE, 'automatic');
    }
  }, []);
  
  const setMode = useCallback((newMode: 'automatic' | 'manual') => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.MODE, newMode);
    }
    if (newMode === 'automatic') {
      setOverridePersonaId(null);
      localStorage.removeItem(STORAGE_KEYS.OVERRIDE_PERSONA);
    }
  }, []);
  
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  }, []);
  
  const refreshPersona = useCallback(() => {
    // Force re-inference by updating a timestamp or similar
    setUserProfile(prev => ({ ...prev }));
  }, []);
  
  // Build context value
  const contextValue = useMemo<IPersonaContext>(() => ({
    // State
    activePersona,
    availablePersonas,
    capabilities,
    userProfile,
    isOverrideActive: mode === 'manual' && overridePersonaId !== null,
    overridePersonaId,
    mode,
    personaSwitcherEnabled,
    isDevMode,
    
    // Actions
    setPersonaOverride,
    clearOverride,
    setMode,
    updateUserProfile,
    refreshPersona,
  }), [
    activePersona,
    availablePersonas,
    capabilities,
    userProfile,
    mode,
    overridePersonaId,
    personaSwitcherEnabled,
    isDevMode,
    setPersonaOverride,
    clearOverride,
    setMode,
    updateUserProfile,
    refreshPersona,
  ]);
  
  return (
    <PersonaContext.Provider value={contextValue}>
      {children}
    </PersonaContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

/**
 * Hook to access persona context
 */
export const usePersona = (): IPersonaContext => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

/**
 * Hook to check if a specific capability is enabled
 */
export const usePersonaCapability = (capability: keyof PersonaCapabilities): boolean => {
  const { capabilities } = usePersona();
  return capabilities[capability];
};

/**
 * Hook to check multiple capabilities
 */
export const usePersonaCapabilities = (
  requiredCapabilities: (keyof PersonaCapabilities)[],
  requireAll = true
): boolean => {
  const { capabilities } = usePersona();
  
  if (requireAll) {
    return requiredCapabilities.every(cap => capabilities[cap]);
  }
  return requiredCapabilities.some(cap => capabilities[cap]);
};

export default PersonaContext;

