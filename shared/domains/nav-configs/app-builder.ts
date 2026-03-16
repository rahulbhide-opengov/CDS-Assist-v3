/**
 * App Builder navigation configuration.
 */

import type { NavConfig } from '../../types';

/** App Builder nav config. */
export const appBuilderNavConfig: NavConfig = {
  appName: 'App Builder',
  menuOptions: [
    { id: 'dashboard', label: 'Dashboard', path: '/app-builder/dashboard' },
    { id: 'app-library', label: 'App Library', path: '/app-builder/app-library' },
    { id: 'templates', label: 'Templates', path: '/app-builder/templates' },
    { id: 'settings', label: 'Settings', path: '/app-builder/settings' },
  ],
};
