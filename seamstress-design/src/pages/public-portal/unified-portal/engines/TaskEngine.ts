/**
 * Task Engine
 * Computes priority tasks based on persona type and user data
 * Powers the "What needs your attention" section of the Command Center
 */

import type { PersonaId, UBTaxCategory } from '../persona/types';

// ============================================================================
// TYPES
// ============================================================================

export type TaskType = 
  | 'bill_payment'
  | 'bill_overdue'
  | 'tax_due'
  | 'tax_assessment'
  | 'permit_action'
  | 'inspection'
  | 'document_needed'
  | 'grant_deadline'
  | 'grant_status'
  | 'bid_opportunity'
  | 'bid_deadline'
  | 'contract_action'
  | 'license_renewal'
  | 'violation'
  | 'onboarding'
  | 'autopay_setup'
  | 'account_setup';

export type TaskUrgency = 'overdue' | 'urgent' | 'soon' | 'info' | 'success';

export interface PriorityTask {
  id: string;
  type: TaskType;
  urgency: TaskUrgency;
  title: string;
  subtitle: string;
  amount?: number;
  dueDate?: Date;
  icon: string; // Icon name from MUI
  color: string; // Color token
  action: {
    label: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'text';
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  metadata?: Record<string, unknown>;
}

export interface TaskEngineConfig {
  maxTasks: number;
  includeInfoTasks: boolean;
  personaId: PersonaId;
  ubTaxCategory: UBTaxCategory;
}

// ============================================================================
// MOCK DATA GENERATORS
// ============================================================================

/**
 * Generate mock tasks for UB/TAX personas (utility billing + taxes)
 */
const generateUBTaxTasks = (personaId: PersonaId): PriorityTask[] => {
  const tasks: PriorityTask[] = [];
  
  // Overdue bill
  if (['maria', 'ind_util_tax_1p', 'ind_util_tax_mp', 'charles', 'jasmine'].includes(personaId)) {
    tasks.push({
      id: 'bill-overdue-1',
      type: 'bill_overdue',
      urgency: 'overdue',
      title: 'Water bill overdue',
      subtitle: '123 Main Street · Due Dec 1',
      amount: 124.50,
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      icon: 'Warning',
      color: 'red600',
      action: { label: 'Pay Now', href: '/unified-portal/pay?bill=water-123', variant: 'primary' },
      secondaryAction: { label: 'Payment Plan', href: '/unified-portal/payment-plan' },
    });
  }
  
  // Upcoming bill
  tasks.push({
    id: 'bill-upcoming-1',
    type: 'bill_payment',
    urgency: 'soon',
    title: 'Trash & recycling due',
    subtitle: '123 Main Street · Due in 5 days',
    amount: 45.00,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    icon: 'Receipt',
    color: 'yellow600',
    action: { label: 'Pay $45.00', href: '/unified-portal/pay?bill=trash-123', variant: 'primary' },
  });
  
  // Tax assessment available
  if (['sandra', 'ind_util_tax_mp', 'll_util_tax_mp', 'bus_util_tax_mp'].includes(personaId)) {
    tasks.push({
      id: 'tax-assessment-1',
      type: 'tax_assessment',
      urgency: 'info',
      title: 'Property tax assessment ready',
      subtitle: '2024 assessment for 789 Oak Ave',
      icon: 'Description',
      color: 'blurple500',
      action: { label: 'View Assessment', href: '/unified-portal/taxes?property=789-oak', variant: 'secondary' },
      secondaryAction: { label: 'Appeal', href: '/unified-portal/taxes/appeal' },
    });
  }
  
  // AutoPay suggestion
  if (personaId === 'maria' || personaId === 'ind_util_tax_1p') {
    tasks.push({
      id: 'autopay-setup',
      type: 'autopay_setup',
      urgency: 'info',
      title: 'Never miss a payment',
      subtitle: 'Set up AutoPay for your water bill',
      icon: 'Autorenew',
      color: 'green600',
      action: { label: 'Set Up AutoPay', href: '/unified-portal/autopay', variant: 'secondary' },
    });
  }
  
  return tasks;
};

/**
 * Generate mock tasks for NON-UB/TAX personas (permits, grants, vendors)
 */
const generateNonUBTaxTasks = (personaId: PersonaId): PriorityTask[] => {
  const tasks: PriorityTask[] = [];
  
  // Contractor tasks
  if (personaId === 'danny') {
    tasks.push({
      id: 'inspection-ready',
      type: 'inspection',
      urgency: 'urgent',
      title: 'Schedule your inspection',
      subtitle: '456 Oak St remodel · Electrical rough-in',
      icon: 'EventAvailable',
      color: 'yellow600',
      action: { label: 'Schedule Now', href: '/unified-portal/permits/123/inspection', variant: 'primary' },
    });
    
    tasks.push({
      id: 'docs-needed',
      type: 'document_needed',
      urgency: 'soon',
      title: 'Documents needed',
      subtitle: '789 Pine St · Upload electrical plans',
      icon: 'Upload',
      color: 'blurple500',
      action: { label: 'Upload', href: '/unified-portal/permits/456/documents', variant: 'primary' },
    });
    
    tasks.push({
      id: 'permit-approved',
      type: 'permit_action',
      urgency: 'success',
      title: 'Permit approved!',
      subtitle: '321 Elm St plumbing · Ready to print',
      icon: 'CheckCircle',
      color: 'green600',
      action: { label: 'View Permit', href: '/unified-portal/permits/789', variant: 'secondary' },
    });
  }
  
  // Nonprofit tasks
  if (personaId === 'alicia') {
    tasks.push({
      id: 'grant-deadline',
      type: 'grant_deadline',
      urgency: 'urgent',
      title: 'Grant application deadline',
      subtitle: 'Community Development Grant · 3 days left',
      icon: 'AccessTime',
      color: 'yellow600',
      action: { label: 'Complete Application', href: '/unified-portal/grants/apply/cdg-2024', variant: 'primary' },
    });
    
    tasks.push({
      id: 'grant-status',
      type: 'grant_status',
      urgency: 'info',
      title: 'Grant under review',
      subtitle: 'Youth Programs Fund · Submitted Nov 15',
      icon: 'HourglassEmpty',
      color: 'blurple500',
      action: { label: 'View Status', href: '/unified-portal/grants/ypf-2024', variant: 'secondary' },
    });
  }
  
  // Community organizer tasks
  if (personaId === 'marco') {
    tasks.push({
      id: 'event-permit',
      type: 'permit_action',
      urgency: 'soon',
      title: 'Event permit approved',
      subtitle: 'Winter Festival 2024 · Dec 15',
      icon: 'Celebration',
      color: 'green600',
      action: { label: 'View Details', href: '/unified-portal/permits/event-123', variant: 'secondary' },
    });
    
    tasks.push({
      id: 'facility-booking',
      type: 'permit_action',
      urgency: 'info',
      title: 'Confirm facility booking',
      subtitle: 'Community Center · Dec 10, 2-6pm',
      icon: 'Place',
      color: 'blurple500',
      action: { label: 'Confirm', href: '/unified-portal/parks/booking/456', variant: 'primary' },
    });
  }
  
  // Vendor tasks
  if (personaId === 'jordan' || personaId === 'samuel') {
    tasks.push({
      id: 'bid-deadline',
      type: 'bid_deadline',
      urgency: 'urgent',
      title: 'Bid submission deadline',
      subtitle: 'IT Services RFP · 48 hours left',
      icon: 'Gavel',
      color: 'yellow600',
      action: { label: 'Submit Bid', href: '/unified-portal/vendor/bids/rfp-2024-it', variant: 'primary' },
    });
    
    tasks.push({
      id: 'new-opportunity',
      type: 'bid_opportunity',
      urgency: 'info',
      title: 'New opportunity',
      subtitle: 'Office Supplies Contract · $50K-100K',
      icon: 'Campaign',
      color: 'green600',
      action: { label: 'View RFP', href: '/unified-portal/vendor/opportunities/osc-2024', variant: 'secondary' },
    });
    
    if (personaId === 'samuel') {
      tasks.push({
        id: 'contract-renewal',
        type: 'contract_action',
        urgency: 'soon',
        title: 'Contract renewal due',
        subtitle: 'Maintenance Services · Expires Jan 15',
        icon: 'Autorenew',
        color: 'yellow600',
        action: { label: 'Renew Contract', href: '/unified-portal/vendor/contracts/ms-2023/renew', variant: 'primary' },
      });
    }
  }
  
  // School admin tasks
  if (personaId === 'school_admin') {
    tasks.push({
      id: 'facility-permit',
      type: 'permit_action',
      urgency: 'soon',
      title: 'Field use permit expiring',
      subtitle: 'Athletic fields · Renew by Dec 20',
      icon: 'SportsScore',
      color: 'yellow600',
      action: { label: 'Renew Permit', href: '/unified-portal/permits/field-use/renew', variant: 'primary' },
    });
    
    tasks.push({
      id: 'utility-summary',
      type: 'bill_payment',
      urgency: 'info',
      title: 'Monthly utility summary',
      subtitle: 'November 2024 · 3 facilities',
      amount: 4250.00,
      icon: 'Summarize',
      color: 'blurple500',
      action: { label: 'View Summary', href: '/unified-portal/utilities/summary', variant: 'secondary' },
    });
  }
  
  return tasks;
};

/**
 * Generate tasks for new residents (onboarding)
 */
const generateOnboardingTasks = (): PriorityTask[] => {
  return [
    {
      id: 'setup-water',
      type: 'account_setup',
      urgency: 'urgent',
      title: 'Set up water service',
      subtitle: 'Required for your new address',
      icon: 'Water',
      color: 'cerulean600',
      action: { label: 'Start Setup', href: '/unified-portal/utilities/setup/water', variant: 'primary' },
    },
    {
      id: 'setup-trash',
      type: 'account_setup',
      urgency: 'soon',
      title: 'Register for trash & recycling',
      subtitle: 'Choose your pickup day',
      icon: 'Delete',
      color: 'green600',
      action: { label: 'Register', href: '/unified-portal/utilities/setup/trash', variant: 'secondary' },
    },
    {
      id: 'view-taxes',
      type: 'onboarding',
      urgency: 'info',
      title: 'View your property taxes',
      subtitle: 'See your assessment and payment schedule',
      icon: 'AccountBalance',
      color: 'blurple500',
      action: { label: 'View Taxes', href: '/unified-portal/taxes', variant: 'secondary' },
    },
    {
      id: 'explore-services',
      type: 'onboarding',
      urgency: 'info',
      title: 'Explore city services',
      subtitle: 'Parks, permits, programs & more',
      icon: 'Explore',
      color: 'magenta500',
      action: { label: 'Explore', href: '/unified-portal/services', variant: 'text' },
    },
  ];
};

/**
 * Generate tasks for hybrid users (home + business)
 */
const generateHybridTasks = (context: 'personal' | 'business'): PriorityTask[] => {
  if (context === 'personal') {
    return [
      {
        id: 'home-bill',
        type: 'bill_payment',
        urgency: 'soon',
        title: 'Home water bill due',
        subtitle: '123 Main Street · Due in 7 days',
        amount: 89.50,
        icon: 'Home',
        color: 'cerulean600',
        action: { label: 'Pay $89.50', href: '/unified-portal/pay?bill=home-water', variant: 'primary' },
      },
      {
        id: 'home-tax',
        type: 'tax_due',
        urgency: 'info',
        title: 'Property tax installment',
        subtitle: 'Q1 2025 · Due Feb 1',
        amount: 1250.00,
        icon: 'AccountBalance',
        color: 'blurple500',
        action: { label: 'View Details', href: '/unified-portal/taxes?type=personal', variant: 'secondary' },
      },
    ];
  } else {
    return [
      {
        id: 'biz-bill',
        type: 'bill_payment',
        urgency: 'urgent',
        title: 'Business utilities due',
        subtitle: '456 Commerce Ave · Due in 3 days',
        amount: 345.00,
        icon: 'Business',
        color: 'yellow600',
        action: { label: 'Pay $345.00', href: '/unified-portal/pay?bill=biz-util', variant: 'primary' },
      },
      {
        id: 'biz-license',
        type: 'license_renewal',
        urgency: 'soon',
        title: 'Business license renewal',
        subtitle: 'ABC Consulting LLC · Due Dec 31',
        amount: 150.00,
        icon: 'Badge',
        color: 'blurple500',
        action: { label: 'Renew License', href: '/unified-portal/licenses/renew', variant: 'primary' },
      },
      {
        id: 'biz-tax',
        type: 'tax_due',
        urgency: 'info',
        title: 'Business property tax',
        subtitle: 'Q1 2025 · Due Feb 1',
        amount: 2400.00,
        icon: 'Receipt',
        color: 'gray500',
        action: { label: 'View Details', href: '/unified-portal/taxes?type=business', variant: 'secondary' },
      },
    ];
  }
};

// ============================================================================
// TASK ENGINE
// ============================================================================

/**
 * Get priority tasks for a persona
 */
export function getPriorityTasks(
  personaId: PersonaId,
  ubTaxCategory: UBTaxCategory,
  options: Partial<TaskEngineConfig> = {}
): PriorityTask[] {
  const config: TaskEngineConfig = {
    maxTasks: 3,
    includeInfoTasks: true,
    personaId,
    ubTaxCategory,
    ...options,
  };
  
  let tasks: PriorityTask[] = [];
  
  // New resident gets onboarding tasks
  if (personaId === 'taylor') {
    tasks = generateOnboardingTasks();
  }
  // UB/TAX personas
  else if (ubTaxCategory === 'UB_TAX') {
    tasks = generateUBTaxTasks(personaId);
  }
  // NON-UB/TAX personas
  else if (ubTaxCategory === 'NON_UB_TAX') {
    tasks = generateNonUBTaxTasks(personaId);
  }
  // Hybrid personas - mix of both
  else {
    tasks = [
      ...generateUBTaxTasks(personaId).slice(0, 2),
      ...generateNonUBTaxTasks(personaId).slice(0, 1),
    ];
  }
  
  // Filter out info tasks if not wanted
  if (!config.includeInfoTasks) {
    tasks = tasks.filter(t => t.urgency !== 'info');
  }
  
  // Sort by urgency
  const urgencyOrder: Record<TaskUrgency, number> = {
    overdue: 0,
    urgent: 1,
    soon: 2,
    info: 3,
    success: 4,
  };
  
  tasks.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
  
  // Limit to max tasks
  return tasks.slice(0, config.maxTasks);
}

/**
 * Get tasks for hybrid users with context
 */
export function getHybridTasks(context: 'personal' | 'business'): PriorityTask[] {
  return generateHybridTasks(context);
}

/**
 * Get task count summary for the greeting
 */
export function getTaskSummary(tasks: PriorityTask[]): {
  total: number;
  overdue: number;
  urgent: number;
  actionNeeded: number;
} {
  return {
    total: tasks.length,
    overdue: tasks.filter(t => t.urgency === 'overdue').length,
    urgent: tasks.filter(t => t.urgency === 'urgent').length,
    actionNeeded: tasks.filter(t => ['overdue', 'urgent', 'soon'].includes(t.urgency)).length,
  };
}

/**
 * Get greeting message based on task summary
 */
export function getGreetingMessage(
  name: string,
  tasks: PriorityTask[],
  ubTaxCategory: UBTaxCategory
): { headline: string; subline: string } {
  const summary = getTaskSummary(tasks);
  
  if (summary.overdue > 0) {
    return {
      headline: `Hello, ${name}!`,
      subline: `You have ${summary.overdue} overdue ${summary.overdue === 1 ? 'item' : 'items'} needing attention.`,
    };
  }
  
  if (summary.actionNeeded > 0) {
    return {
      headline: `Hello, ${name}!`,
      subline: `You have ${summary.actionNeeded} ${summary.actionNeeded === 1 ? 'item' : 'items'} to review.`,
    };
  }
  
  // All caught up messages by category
  if (ubTaxCategory === 'UB_TAX') {
    return {
      headline: `Hello, ${name}!`,
      subline: `You're all caught up. Your accounts are in good standing.`,
    };
  }
  
  if (ubTaxCategory === 'NON_UB_TAX') {
    return {
      headline: `Hello, ${name}!`,
      subline: `No urgent items. Browse opportunities or check your applications.`,
    };
  }
  
  return {
    headline: `Hello, ${name}!`,
    subline: `Here's your portal overview.`,
  };
}

// ============================================================================
// URGENCY STYLING
// ============================================================================

export const urgencyConfig: Record<TaskUrgency, { 
  bgColor: string; 
  borderColor: string; 
  textColor: string;
  badgeColor: string;
  icon: string;
}> = {
  overdue: {
    bgColor: 'red50',
    borderColor: 'red200',
    textColor: 'red700',
    badgeColor: 'red600',
    icon: 'Error',
  },
  urgent: {
    bgColor: 'yellow50',
    borderColor: 'yellow200',
    textColor: 'yellow700',
    badgeColor: 'yellow600',
    icon: 'Warning',
  },
  soon: {
    bgColor: 'blurple50',
    borderColor: 'blurple200',
    textColor: 'blurple700',
    badgeColor: 'blurple500',
    icon: 'Schedule',
  },
  info: {
    bgColor: 'gray50',
    borderColor: 'gray200',
    textColor: 'gray700',
    badgeColor: 'gray500',
    icon: 'Info',
  },
  success: {
    bgColor: 'green50',
    borderColor: 'green200',
    textColor: 'green700',
    badgeColor: 'green600',
    icon: 'CheckCircle',
  },
};

