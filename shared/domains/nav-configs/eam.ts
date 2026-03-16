/**
 * EAM (Enterprise Asset Management) navigation configuration.
 */

import type { NavConfig } from '../../types';

/** EAM nav config. */
export const eamNavConfig: NavConfig = {
  appName: 'EAM',
  menuOptions: [
    { id: 'dashboard', label: 'Dashboard', path: '/eam/dashboard' },
    { id: 'analytics', label: 'Analytics', path: '/eam/analytics' },
  ],
  searchConfig: {
    filters: ['All', 'Work Orders', 'Assets', 'Maintenance'],
  },
};
