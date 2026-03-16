/**
 * Procurement navigation configuration.
 */

import type { NavConfig } from '../../types';

/** Procurement nav config. */
export const procurementNavConfig: NavConfig = {
  appName: 'Procurement',
  menuOptions: [
    { id: 'dashboard', label: 'Dashboard', path: '/procurement/dashboard' },
    { id: 'projects', label: 'Projects', path: '/procurement/projects' },
  ],
  searchConfig: {
    filters: ['All', 'Projects', 'Requests', 'Contracts', 'Vendors'],
  },
};
