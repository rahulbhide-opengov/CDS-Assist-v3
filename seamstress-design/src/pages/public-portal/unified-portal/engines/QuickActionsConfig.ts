/**
 * Persona-Aware Quick Actions Configuration
 * Defines contextual quick actions for each persona type
 */

import type { PersonaId, UBTaxCategory } from '../persona/types';

// ============================================================================
// TYPES
// ============================================================================

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: string; // MUI icon name
  href: string;
  color: string; // Color token
  bgColor: string;
  badge?: string | number;
  isNew?: boolean;
  isPrimary?: boolean;
}

// ============================================================================
// UB/TAX QUICK ACTIONS (Utility Billing + Taxes)
// ============================================================================

const UB_TAX_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'pay-bill',
    label: 'Pay Bill',
    description: 'Make a payment',
    icon: 'Payment',
    href: '/unified-portal/pay',
    color: 'green600',
    bgColor: 'green50',
    isPrimary: true,
  },
  {
    id: 'autopay',
    label: 'AutoPay',
    description: 'Set up automatic payments',
    icon: 'Autorenew',
    href: '/unified-portal/autopay',
    color: 'blurple500',
    bgColor: 'blurple50',
  },
  {
    id: 'view-usage',
    label: 'View Usage',
    description: 'Water & utility usage',
    icon: 'BarChart',
    href: '/unified-portal/utilities/usage',
    color: 'cerulean600',
    bgColor: 'cerulean50',
  },
  {
    id: 'payment-history',
    label: 'Payment History',
    description: 'View past payments',
    icon: 'History',
    href: '/unified-portal/history',
    color: 'gray600',
    bgColor: 'gray100',
  },
  {
    id: 'report-issue',
    label: 'Report Issue',
    description: 'Water leak, outage, etc.',
    icon: 'ReportProblem',
    href: '/unified-portal/311',
    color: 'orange500',
    bgColor: 'orange50',
  },
  {
    id: 'contact-support',
    label: 'Get Help',
    description: 'Contact support',
    icon: 'SupportAgent',
    href: '/unified-portal/support',
    color: 'magenta500',
    bgColor: 'magenta50',
  },
];

// ============================================================================
// NON-UB/TAX QUICK ACTIONS (Permits, Grants, Vendors)
// ============================================================================

const PERMITS_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'new-permit',
    label: 'Apply for Permit',
    description: 'Start new application',
    icon: 'Add',
    href: '/unified-portal/permits/apply',
    color: 'blurple500',
    bgColor: 'blurple50',
    isPrimary: true,
  },
  {
    id: 'schedule-inspection',
    label: 'Schedule Inspection',
    description: 'Book an inspection',
    icon: 'EventAvailable',
    href: '/unified-portal/permits/inspections',
    color: 'cerulean600',
    bgColor: 'cerulean50',
  },
  {
    id: 'upload-docs',
    label: 'Upload Documents',
    description: 'Submit required files',
    icon: 'Upload',
    href: '/unified-portal/documents',
    color: 'green600',
    bgColor: 'green50',
  },
  {
    id: 'check-status',
    label: 'Check Status',
    description: 'View permit status',
    icon: 'Search',
    href: '/unified-portal/permits/status',
    color: 'yellow600',
    bgColor: 'yellow50',
  },
];

const GRANTS_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'apply-grant',
    label: 'Apply for Grant',
    description: 'Start application',
    icon: 'CardGiftcard',
    href: '/unified-portal/grants/apply',
    color: 'magenta500',
    bgColor: 'magenta50',
    isPrimary: true,
  },
  {
    id: 'view-opportunities',
    label: 'View Opportunities',
    description: 'Browse available grants',
    icon: 'Search',
    href: '/unified-portal/grants/opportunities',
    color: 'blurple500',
    bgColor: 'blurple50',
  },
  {
    id: 'submit-report',
    label: 'Submit Report',
    description: 'Grant compliance report',
    icon: 'Assessment',
    href: '/unified-portal/grants/reports',
    color: 'cerulean600',
    bgColor: 'cerulean50',
  },
  {
    id: 'check-grant-status',
    label: 'Check Status',
    description: 'Application status',
    icon: 'Timeline',
    href: '/unified-portal/grants/status',
    color: 'green600',
    bgColor: 'green50',
  },
];

const VENDOR_QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'find-bids',
    label: 'Find Opportunities',
    description: 'Browse open RFPs',
    icon: 'Campaign',
    href: '/unified-portal/vendor/opportunities',
    color: 'blurple500',
    bgColor: 'blurple50',
    isPrimary: true,
    badge: 'New',
  },
  {
    id: 'submit-proposal',
    label: 'Submit Proposal',
    description: 'Respond to RFP',
    icon: 'Send',
    href: '/unified-portal/vendor/submit',
    color: 'green600',
    bgColor: 'green50',
  },
  {
    id: 'my-contracts',
    label: 'My Contracts',
    description: 'View active contracts',
    icon: 'Description',
    href: '/unified-portal/vendor/contracts',
    color: 'cerulean600',
    bgColor: 'cerulean50',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    description: 'Documents & certifications',
    icon: 'VerifiedUser',
    href: '/unified-portal/vendor/compliance',
    color: 'yellow600',
    bgColor: 'yellow50',
  },
];

// ============================================================================
// PERSONA-SPECIFIC CONFIGURATIONS
// ============================================================================

export const PERSONA_QUICK_ACTIONS: Record<PersonaId, QuickAction[]> = {
  // UB/TAX Personas
  ind_util_tax_1p: UB_TAX_QUICK_ACTIONS,
  ind_util_tax_mp: [
    ...UB_TAX_QUICK_ACTIONS.slice(0, 2),
    {
      id: 'all-properties',
      label: 'All Properties',
      description: 'View all accounts',
      icon: 'Apartment',
      href: '/unified-portal/properties',
      color: 'cerulean600',
      bgColor: 'cerulean50',
    },
    ...UB_TAX_QUICK_ACTIONS.slice(3),
  ],
  bus_util_tax_1p: [
    ...UB_TAX_QUICK_ACTIONS.slice(0, 3),
    {
      id: 'business-tax',
      label: 'Business Taxes',
      description: 'View tax obligations',
      icon: 'AccountBalance',
      href: '/unified-portal/taxes/business',
      color: 'yellow600',
      bgColor: 'yellow50',
    },
    ...UB_TAX_QUICK_ACTIONS.slice(4),
  ],
  bus_util_tax_mp: [
    {
      id: 'pay-all',
      label: 'Pay All Bills',
      description: 'Pay all locations',
      icon: 'Payments',
      href: '/unified-portal/pay/batch',
      color: 'green600',
      bgColor: 'green50',
      isPrimary: true,
    },
    {
      id: 'all-locations',
      label: 'All Locations',
      description: 'View all sites',
      icon: 'LocationCity',
      href: '/unified-portal/properties',
      color: 'blurple500',
      bgColor: 'blurple50',
    },
    ...UB_TAX_QUICK_ACTIONS.slice(2, 4),
  ],
  hyb_util_tax: [
    ...UB_TAX_QUICK_ACTIONS.slice(0, 2),
    {
      id: 'switch-context',
      label: 'Switch View',
      description: 'Home ↔ Business',
      icon: 'SwapHoriz',
      href: '#switch-context',
      color: 'magenta500',
      bgColor: 'magenta50',
    },
    ...UB_TAX_QUICK_ACTIONS.slice(2, 4),
  ],
  ll_util_tax_mp: [
    {
      id: 'all-properties',
      label: 'All Properties',
      description: 'Manage rentals',
      icon: 'Apartment',
      href: '/unified-portal/properties',
      color: 'cerulean600',
      bgColor: 'cerulean50',
      isPrimary: true,
    },
    ...UB_TAX_QUICK_ACTIONS.slice(0, 2),
    {
      id: 'violations',
      label: 'Violations',
      description: 'View code issues',
      icon: 'Warning',
      href: '/unified-portal/violations',
      color: 'orange500',
      bgColor: 'orange50',
    },
  ],
  
  // Hybrid Personas
  maria: UB_TAX_QUICK_ACTIONS,
  devin: [
    UB_TAX_QUICK_ACTIONS[0], // Pay Bill
    {
      id: 'violations',
      label: 'My Violations',
      description: 'View & pay violations',
      icon: 'Warning',
      href: '/unified-portal/violations',
      color: 'orange500',
      bgColor: 'orange50',
    },
    UB_TAX_QUICK_ACTIONS[4], // Report Issue
    {
      id: 'quick-pay',
      label: 'Quick Pay',
      description: 'Scan & pay',
      icon: 'QrCodeScanner',
      href: '/unified-portal/quick-pay',
      color: 'blurple500',
      bgColor: 'blurple50',
    },
  ],
  charles: [
    {
      ...UB_TAX_QUICK_ACTIONS[0],
      label: 'Pay My Bill',
      description: 'Simple payment',
    },
    UB_TAX_QUICK_ACTIONS[1], // AutoPay
    {
      id: 'large-print',
      label: 'Print Statement',
      description: 'Large print bill',
      icon: 'Print',
      href: '/unified-portal/print-statement',
      color: 'gray600',
      bgColor: 'gray100',
    },
    UB_TAX_QUICK_ACTIONS[5], // Get Help
  ],
  jasmine: [
    UB_TAX_QUICK_ACTIONS[0], // Pay Bill
    {
      id: 'payment-plan',
      label: 'Payment Plans',
      description: 'Flexible options',
      icon: 'AccountBalanceWallet',
      href: '/unified-portal/payment-plan',
      color: 'green600',
      bgColor: 'green50',
      isPrimary: true,
    },
    {
      id: 'assistance',
      label: 'Get Assistance',
      description: 'Apply for help',
      icon: 'VolunteerActivism',
      href: '/unified-portal/assistance',
      color: 'magenta500',
      bgColor: 'magenta50',
    },
    UB_TAX_QUICK_ACTIONS[5], // Get Help
  ],
  taylor: [
    {
      id: 'setup-services',
      label: 'Set Up Services',
      description: 'Start here',
      icon: 'PlayArrow',
      href: '/unified-portal/setup',
      color: 'green600',
      bgColor: 'green50',
      isPrimary: true,
    },
    {
      id: 'explore',
      label: 'Explore City',
      description: 'Discover services',
      icon: 'Explore',
      href: '/unified-portal/services',
      color: 'blurple500',
      bgColor: 'blurple50',
    },
    {
      id: 'resident-guide',
      label: 'Resident Guide',
      description: 'Getting started',
      icon: 'MenuBook',
      href: '/unified-portal/guide',
      color: 'cerulean600',
      bgColor: 'cerulean50',
    },
    UB_TAX_QUICK_ACTIONS[5], // Get Help
  ],
  sandra: [
    {
      id: 'all-taxes',
      label: 'All Taxes',
      description: 'View all properties',
      icon: 'AccountBalance',
      href: '/unified-portal/taxes/all',
      color: 'yellow600',
      bgColor: 'yellow50',
      isPrimary: true,
    },
    UB_TAX_QUICK_ACTIONS[0], // Pay Bill
    {
      id: 'tax-calendar',
      label: 'Tax Calendar',
      description: 'Due dates',
      icon: 'CalendarMonth',
      href: '/unified-portal/taxes/calendar',
      color: 'blurple500',
      bgColor: 'blurple50',
    },
    UB_TAX_QUICK_ACTIONS[3], // History
  ],
  priya: [
    {
      id: 'business-overview',
      label: 'Business Overview',
      description: 'All at a glance',
      icon: 'Business',
      href: '/unified-portal/business',
      color: 'cerulean600',
      bgColor: 'cerulean50',
      isPrimary: true,
    },
    UB_TAX_QUICK_ACTIONS[0], // Pay Bill
    PERMITS_QUICK_ACTIONS[0], // Apply for Permit
    {
      id: 'renew-license',
      label: 'Renew License',
      description: 'Business license',
      icon: 'Badge',
      href: '/unified-portal/licenses/renew',
      color: 'green600',
      bgColor: 'green50',
    },
  ],
  danny: PERMITS_QUICK_ACTIONS,
  school_admin: [
    {
      id: 'facilities',
      label: 'Facilities',
      description: 'Manage buildings',
      icon: 'School',
      href: '/unified-portal/facilities',
      color: 'yellow600',
      bgColor: 'yellow50',
      isPrimary: true,
    },
    UB_TAX_QUICK_ACTIONS[0], // Pay Bill
    PERMITS_QUICK_ACTIONS[0], // Apply for Permit
    GRANTS_QUICK_ACTIONS[0], // Apply for Grant
  ],
  
  // NON-UB/TAX Personas
  alicia: GRANTS_QUICK_ACTIONS,
  marco: [
    {
      id: 'event-permit',
      label: 'Event Permit',
      description: 'Apply for event',
      icon: 'Celebration',
      href: '/unified-portal/permits/event',
      color: 'magenta500',
      bgColor: 'magenta50',
      isPrimary: true,
    },
    {
      id: 'book-facility',
      label: 'Book Facility',
      description: 'Reserve a space',
      icon: 'Place',
      href: '/unified-portal/parks/book',
      color: 'green600',
      bgColor: 'green50',
    },
    GRANTS_QUICK_ACTIONS[0], // Apply for Grant
    {
      id: 'community-calendar',
      label: 'Community Events',
      description: 'What\'s happening',
      icon: 'Event',
      href: '/unified-portal/events',
      color: 'blurple500',
      bgColor: 'blurple50',
    },
  ],
  jordan: VENDOR_QUICK_ACTIONS,
  samuel: [
    VENDOR_QUICK_ACTIONS[0], // Find Opportunities
    VENDOR_QUICK_ACTIONS[2], // My Contracts
    {
      id: 'invoicing',
      label: 'Invoicing',
      description: 'Submit invoices',
      icon: 'Receipt',
      href: '/unified-portal/vendor/invoices',
      color: 'green600',
      bgColor: 'green50',
    },
    VENDOR_QUICK_ACTIONS[3], // Compliance
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get quick actions for a persona
 */
export function getQuickActionsForPersona(personaId: PersonaId): QuickAction[] {
  return PERSONA_QUICK_ACTIONS[personaId] || UB_TAX_QUICK_ACTIONS;
}

/**
 * Get quick actions by UB/TAX category (fallback)
 */
export function getQuickActionsByCategory(category: UBTaxCategory): QuickAction[] {
  switch (category) {
    case 'UB_TAX':
      return UB_TAX_QUICK_ACTIONS;
    case 'NON_UB_TAX':
      return [...PERMITS_QUICK_ACTIONS.slice(0, 2), ...GRANTS_QUICK_ACTIONS.slice(0, 2)];
    case 'HYBRID':
      return [...UB_TAX_QUICK_ACTIONS.slice(0, 2), ...PERMITS_QUICK_ACTIONS.slice(0, 2)];
  }
}

/**
 * Get primary action for a persona
 */
export function getPrimaryAction(personaId: PersonaId): QuickAction | undefined {
  const actions = PERSONA_QUICK_ACTIONS[personaId];
  return actions?.find(a => a.isPrimary) || actions?.[0];
}

