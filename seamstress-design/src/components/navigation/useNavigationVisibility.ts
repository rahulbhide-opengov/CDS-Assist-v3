/**
 * useNavigationVisibility Hook
 *
 * Combines route-based and scroll-based visibility logic for the global nav.
 * - Route-based: Hide on Action Hub pages (Command Center, Tasks, Programs, Reports)
 * - Scroll-based: Hide when scrolling down, show when scrolling up
 */

import { useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollDirection } from './useScrollDirection';
import type { GlobalNavConfig, NavigationVisibilityState } from './types';

/**
 * Routes configuration (kept for potential future use)
 * Note: Global nav is now always visible on all platform pages
 */
export const SUITE_ONLY_ROUTES: string[] = [];

interface UseNavigationVisibilityOptions {
  /** Global nav configuration from layout config */
  globalNav?: GlobalNavConfig;
}

/**
 * Hook to determine global nav visibility based on route and scroll
 */
export function useNavigationVisibility(
  options: UseNavigationVisibilityOptions = {}
): NavigationVisibilityState {
  const { globalNav } = options;
  const location = useLocation();

  // Determine if route allows global nav
  // Global nav is now always visible on all platform pages
  const routeAllowsGlobalNav = useMemo(() => {
    // Explicit config can still hide it if needed
    if (globalNav?.visible === false) {
      return false;
    }
    // Always show global nav on all routes
    return true;
  }, [globalNav?.visible]);

  // Determine if scroll behavior is enabled
  const scrollBehaviorEnabled = useMemo(() => {
    // If global nav is not allowed by route, no scroll behavior needed
    if (!routeAllowsGlobalNav) {
      return false;
    }

    // Explicit config
    if (globalNav?.scrollBehavior !== undefined) {
      return globalNav.scrollBehavior;
    }

    // Default: scroll behavior enabled when global nav is visible
    return true;
  }, [routeAllowsGlobalNav, globalNav?.scrollBehavior]);

  // Track scroll direction
  const { scrollDirection, isAtTop } = useScrollDirection({
    enabled: scrollBehaviorEnabled,
    threshold: 10,
  });

  // Force show state (e.g., when hovering over nav area)
  const [forceShowState, setForceShowState] = useState(false);

  // Calculate final visibility
  const isGlobalNavVisible = useMemo(() => {
    // Route doesn't allow global nav
    if (!routeAllowsGlobalNav) {
      return false;
    }

    // Force show is active
    if (forceShowState) {
      return true;
    }

    // At top of page - always show
    if (isAtTop) {
      return true;
    }

    // Scroll behavior not enabled - always show
    if (!scrollBehaviorEnabled) {
      return true;
    }

    // Scrolling up - show
    if (scrollDirection === 'up') {
      return true;
    }

    // Scrolling down - hide
    if (scrollDirection === 'down') {
      return false;
    }

    // Default - show
    return true;
  }, [routeAllowsGlobalNav, forceShowState, isAtTop, scrollBehaviorEnabled, scrollDirection]);

  const forceShow = useCallback(() => {
    setForceShowState(true);
  }, []);

  const resetVisibility = useCallback(() => {
    setForceShowState(false);
  }, []);

  return {
    isGlobalNavVisible,
    scrollDirection,
    routeAllowsGlobalNav,
    forceShow,
    resetVisibility,
  };
}

export default useNavigationVisibility;
