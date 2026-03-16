/**
 * Utility Billing navigation configuration.
 */

import type { NavConfig } from '../../types';

/** Utility Billing nav config. */
export const utilityBillingNavConfig: NavConfig = {
  appName: 'Utility Billing',
  menuOptions: [
    { id: 'home', label: 'Home', path: '/utility-billing/home' },
    {
      id: 'workflows',
      label: 'Workflows',
      path: '/utility-billing/workflows',
      submenu: [{ id: 'cutoff', label: 'Cutoff', path: '/utility-billing/workflows/cutoff' }],
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/utility-billing/settings',
      submenu: [
        {
          id: 'account-number-format',
          label: 'Account Number Format',
          path: '/utility-billing/settings/account-number-format',
        },
      ],
    },
  ],
  favoritesData: [
    { label: 'Cutoff', path: '/utility-billing/workflows/cutoff' },
    { label: 'Account Number Format', path: '/utility-billing/settings/account-number-format' },
  ],
  searchConfig: {
    filters: ['All', 'Accounts', 'Customers', 'Bills', 'Payments'],
  },
};
