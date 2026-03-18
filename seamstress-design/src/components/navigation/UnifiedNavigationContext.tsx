/**
 * Unified Navigation Context
 *
 * Provides navigation visibility state to child components.
 * This allows other components to react to nav visibility changes
 * (e.g., for ARIA announcements or focus management).
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useNavigationVisibility } from './useNavigationVisibility';
import type { GlobalNavConfig, NavigationVisibilityState } from './types';

/**
 * Default context value (used when outside provider)
 */
const defaultContextValue: NavigationVisibilityState = {
  isGlobalNavVisible: true,
  scrollDirection: null,
  routeAllowsGlobalNav: true,
  forceShow: () => {},
  resetVisibility: () => {},
};

const NavigationContext = createContext<NavigationVisibilityState>(defaultContextValue);

interface UnifiedNavigationProviderProps {
  children: React.ReactNode;
  globalNav?: GlobalNavConfig;
}

/**
 * Provider component for navigation visibility state
 */
export function UnifiedNavigationProvider({
  children,
  globalNav,
}: UnifiedNavigationProviderProps) {
  const visibilityState = useNavigationVisibility({ globalNav });

  const value = useMemo(() => visibilityState, [visibilityState]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

/**
 * Hook to access navigation visibility state
 */
export function useNavigationContext(): NavigationVisibilityState {
  return useContext(NavigationContext);
}

export default NavigationContext;
