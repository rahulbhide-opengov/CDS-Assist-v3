/**
 * UnifiedNavigation Component
 *
 * Main unified navigation component that combines:
 * - GlobalNavSection (animated, can hide/show)
 * - SuiteNavSection (custom SuiteNav)
 *
 * The global nav section animates in/out based on:
 * 1. Route configuration (hidden on Action Hub pages)
 * 2. Scroll direction (hides when scrolling down, shows when scrolling up)
 *
 * State transitions (centeredBranding, hideSuiteNav) are animated
 * to provide smooth transitions when navigating between different
 * suite contexts (e.g., Command Center -> Agent Studio).
 */

import React from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlobalNavSection } from './GlobalNavSection';
import { SuiteNavSection } from './SuiteNavSection';
import { UnifiedNavigationProvider, useNavigationContext } from './UnifiedNavigationContext';
import type { UnifiedNavigationProps, SuiteNavMenuItem, SuiteNavFavoritesSection } from './types';
import { durations } from '../../theme/transitions';

interface UnifiedNavigationInnerProps extends UnifiedNavigationProps {
  appName: string;
  menuItems: SuiteNavMenuItem[];
  favorites?: SuiteNavFavoritesSection[];
}

/**
 * Animation variants for SuiteNav visibility
 */
const suiteNavVariants = {
  visible: {
    height: 'auto',
    opacity: 1,
    y: 0,
  },
  hidden: {
    height: 0,
    opacity: 0,
    y: -8,
  },
};

const suiteNavTransition = {
  duration: durations.standard / 1000,
  ease: [0.4, 0, 0.2, 1],
};

const instantTransition = {
  duration: 0,
};

/**
 * Inner component that uses navigation context
 */
function UnifiedNavigationInner({
  globalNav,
  onThemeEditorOpen,
  appName,
  menuItems,
  favorites,
}: UnifiedNavigationInnerProps) {
  const { isGlobalNavVisible } = useNavigationContext();
  const prefersReducedMotion = useReducedMotion() ?? false;

  const showSuiteNav = !globalNav?.hideSuiteNav;

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 'appBar',
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <AnimatePresence mode="sync">
        <GlobalNavSection
          key="global-nav"
          isVisible={isGlobalNavVisible}
          onThemeEditorOpen={onThemeEditorOpen}
          centeredBranding={globalNav?.centeredBranding}
        />
      </AnimatePresence>

      {/* SuiteNav with animated show/hide - waits for exit before enter */}
      <AnimatePresence mode="wait">
        {showSuiteNav && (
          <motion.div
            key="suite-nav"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={suiteNavVariants}
            transition={prefersReducedMotion ? instantTransition : suiteNavTransition}
            style={{ overflow: 'hidden' }}
          >
            <SuiteNavSection
              appName={appName}
              menuItems={menuItems}
              favorites={favorites}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export interface UnifiedNavigationComponentProps extends UnifiedNavigationProps {
  appName: string;
  menuItems: SuiteNavMenuItem[];
  favorites?: SuiteNavFavoritesSection[];
}

/**
 * Main UnifiedNavigation component with context provider
 */
export function UnifiedNavigation({
  globalNav,
  onThemeEditorOpen,
  appName,
  menuItems,
  favorites,
}: UnifiedNavigationComponentProps) {
  return (
    <UnifiedNavigationProvider globalNav={globalNav}>
      <UnifiedNavigationInner
        globalNav={globalNav}
        onThemeEditorOpen={onThemeEditorOpen}
        appName={appName}
        menuItems={menuItems}
        favorites={favorites}
      />
    </UnifiedNavigationProvider>
  );
}

export default UnifiedNavigation;
