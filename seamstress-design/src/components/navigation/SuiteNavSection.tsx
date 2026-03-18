/**
 * SuiteNavSection Component
 *
 * Renders the suite-specific navigation (app name, menu items, favorites)
 * using a custom SuiteNav component.
 */

import React from 'react';
import { SuiteNav } from './SuiteNav';
import type { SuiteNavSectionProps } from './types';

export function SuiteNavSection({ appName, menuItems, favorites }: SuiteNavSectionProps) {
  return (
    <SuiteNav
      appName={appName}
      menuItems={menuItems}
      favorites={favorites}
    />
  );
}

export default SuiteNavSection;
