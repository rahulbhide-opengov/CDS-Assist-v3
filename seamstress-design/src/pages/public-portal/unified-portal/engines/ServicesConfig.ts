/**
 * Persona-Aware Services Configuration
 * Defines service ordering and visibility for each persona type
 */

import type { PersonaId, UBTaxCategory } from '../persona/types';

// ============================================================================
// TYPES
// ============================================================================

export interface ServiceItem {
  id: string;
  label: string;
  description: string;
  icon: string; // MUI icon name
  href: string;
  color: string;
  bgColor: string;
  keywords?: string[];
}

// ============================================================================
// ALL SERVICES
// ============================================================================

export const ALL_SERVICES: Record<string, ServiceItem> = {
  utilities: {
    id: 'utilities',
    label: 'Utilities',
    description: 'Water, trash & sewer',
    icon: 'Water',
    href: '/unified-portal/utilities',
    color: 'cerulean600',
    bgColor: 'cerulean50',
    keywords: ['water', 'trash', 'sewer', 'recycling', 'bill'],
  },
  taxes: {
    id: 'taxes',
    label: 'Taxes',
    description: 'Property & business',
    icon: 'AccountBalance',
    href: '/unified-portal/taxes',
    color: 'yellow600',
    bgColor: 'yellow50',
    keywords: ['property tax', 'business tax', 'assessment'],
  },
  permits: {
    id: 'permits',
    label: 'Permits & Licensing',
    description: 'Building, business, events',
    icon: 'Description',
    href: '/unified-portal/permits',
    color: 'blurple500',
    bgColor: 'blurple50',
    keywords: ['permit', 'license', 'building', 'construction'],
  },
  parks: {
    id: 'parks',
    label: 'Parks & Recreation',
    description: 'Facilities & programs',
    icon: 'Park',
    href: '/unified-portal/parks',
    color: 'green600',
    bgColor: 'green50',
    keywords: ['park', 'recreation', 'facility', 'sports', 'rental'],
  },
  grants: {
    id: 'grants',
    label: 'Grants & Funding',
    description: 'Nonprofits & businesses',
    icon: 'CardGiftcard',
    href: '/unified-portal/grants',
    color: 'magenta500',
    bgColor: 'magenta50',
    keywords: ['grant', 'funding', 'nonprofit', 'assistance'],
  },
  vendor: {
    id: 'vendor',
    label: 'Vendor Portal',
    description: 'Bids & contracts',
    icon: 'Gavel',
    href: '/unified-portal/vendor',
    color: 'orange500',
    bgColor: 'orange50',
    keywords: ['vendor', 'bid', 'rfp', 'contract', 'procurement'],
  },
  report: {
    id: 'report',
    label: 'Report an Issue',
    description: '311 services',
    icon: 'ReportProblem',
    href: '/unified-portal/311',
    color: 'red500',
    bgColor: 'red50',
    keywords: ['311', 'report', 'issue', 'pothole', 'streetlight'],
  },
  transparency: {
    id: 'transparency',
    label: 'Open Data',
    description: 'Budgets & records',
    icon: 'Visibility',
    href: '/unified-portal/transparency',
    color: 'gray600',
    bgColor: 'gray100',
    keywords: ['transparency', 'budget', 'data', 'records'],
  },
  violations: {
    id: 'violations',
    label: 'Code Violations',
    description: 'View & pay violations',
    icon: 'Warning',
    href: '/unified-portal/violations',
    color: 'orange500',
    bgColor: 'orange50',
    keywords: ['violation', 'code', 'citation', 'fine'],
  },
  licenses: {
    id: 'licenses',
    label: 'Business Licenses',
    description: 'Apply & renew',
    icon: 'Badge',
    href: '/unified-portal/licenses',
    color: 'cerulean600',
    bgColor: 'cerulean50',
    keywords: ['license', 'business', 'registration'],
  },
  events: {
    id: 'events',
    label: 'Community Events',
    description: 'What\'s happening',
    icon: 'Event',
    href: '/unified-portal/events',
    color: 'magenta500',
    bgColor: 'magenta50',
    keywords: ['event', 'community', 'calendar'],
  },
  assistance: {
    id: 'assistance',
    label: 'Payment Assistance',
    description: 'Help programs',
    icon: 'VolunteerActivism',
    href: '/unified-portal/assistance',
    color: 'green600',
    bgColor: 'green50',
    keywords: ['assistance', 'help', 'low income', 'payment plan'],
  },
};

// ============================================================================
// SERVICE ORDERING BY UB/TAX CATEGORY
// ============================================================================

export const SERVICE_ORDER_BY_CATEGORY: Record<UBTaxCategory, string[]> = {
  'UB_TAX': ['utilities', 'taxes', 'permits', 'parks', 'report', 'assistance'],
  'NON_UB_TAX': ['permits', 'grants', 'licenses', 'vendor', 'parks', 'events'],
  'HYBRID': ['utilities', 'taxes', 'permits', 'licenses', 'grants', 'parks'],
};

// ============================================================================
// SERVICE ORDERING BY PERSONA
// ============================================================================

export const SERVICE_ORDER_BY_PERSONA: Record<PersonaId, string[]> = {
  // UB/TAX Personas
  ind_util_tax_1p: ['utilities', 'taxes', 'permits', 'parks', 'report'],
  ind_util_tax_mp: ['utilities', 'taxes', 'permits', 'parks', 'report'],
  bus_util_tax_1p: ['utilities', 'taxes', 'licenses', 'permits', 'parks'],
  bus_util_tax_mp: ['utilities', 'taxes', 'licenses', 'permits', 'transparency'],
  hyb_util_tax: ['utilities', 'taxes', 'licenses', 'permits', 'parks'],
  ll_util_tax_mp: ['utilities', 'taxes', 'violations', 'permits', 'report'],
  
  // Hybrid Personas
  maria: ['utilities', 'taxes', 'parks', 'report', 'assistance'],
  devin: ['utilities', 'violations', 'report', 'permits', 'parks'],
  charles: ['utilities', 'taxes', 'assistance', 'report', 'parks'],
  jasmine: ['utilities', 'taxes', 'assistance', 'grants', 'report'],
  taylor: ['utilities', 'taxes', 'permits', 'parks', 'events'],
  sandra: ['taxes', 'utilities', 'permits', 'transparency', 'report'],
  priya: ['licenses', 'utilities', 'taxes', 'permits', 'grants'],
  danny: ['permits', 'licenses', 'utilities', 'taxes', 'report'],
  school_admin: ['utilities', 'permits', 'grants', 'parks', 'taxes'],
  
  // NON-UB/TAX Personas
  alicia: ['grants', 'permits', 'events', 'parks', 'transparency'],
  marco: ['events', 'permits', 'parks', 'grants', 'transparency'],
  jordan: ['vendor', 'permits', 'licenses', 'transparency', 'events'],
  samuel: ['vendor', 'permits', 'licenses', 'taxes', 'transparency'],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get ordered services for a persona
 */
export function getServicesForPersona(personaId: PersonaId, limit?: number): ServiceItem[] {
  const order = SERVICE_ORDER_BY_PERSONA[personaId] || SERVICE_ORDER_BY_CATEGORY['HYBRID'];
  const services = order.map(id => ALL_SERVICES[id]).filter(Boolean);
  return limit ? services.slice(0, limit) : services;
}

/**
 * Get services by category
 */
export function getServicesByCategory(category: UBTaxCategory, limit?: number): ServiceItem[] {
  const order = SERVICE_ORDER_BY_CATEGORY[category];
  const services = order.map(id => ALL_SERVICES[id]).filter(Boolean);
  return limit ? services.slice(0, limit) : services;
}

/**
 * Search services by keyword
 */
export function searchServices(query: string): ServiceItem[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(ALL_SERVICES).filter(service => 
    service.label.toLowerCase().includes(lowerQuery) ||
    service.description.toLowerCase().includes(lowerQuery) ||
    service.keywords?.some(k => k.includes(lowerQuery))
  );
}

