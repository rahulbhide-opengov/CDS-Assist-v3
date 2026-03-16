/**
 * Command Center navigation configuration.
 */

import type { NavConfig } from '../../types';

/** Command Center nav config. */
export const commandCenterNavConfig: NavConfig = {
  appName: 'Command Center',
  menuOptions: [{ id: 'dashboard', label: 'Dashboard', path: '/command-center' }],
  globalNav: {
    centeredBranding: true,
    hideSuiteNav: true,
  },
};
