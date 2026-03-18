/**
 * PersistentNavigation Component
 *
 * A top-level navigation component that stays mounted across all routes
 * and animates transitions between different navigation states.
 *
 * This component:
 * - Lives at the App level, outside of route-specific layouts
 * - Uses useLocation to detect the current route
 * - Determines the appropriate nav configuration based on the route
 * - Passes the config to UnifiedNavigation which handles animations
 *
 * Example transitions:
 * - Command Center (centeredBranding: true, hideSuiteNav: true)
 *   -> Agent Studio (default layout with suite nav)
 */

import React, { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UnifiedNavigation } from './UnifiedNavigation';
import { useNavigationRendered } from '../../contexts/NavigationRenderedContext';
import type { GlobalNavConfig, SuiteNavMenuItem, SuiteNavFavoritesSection } from './types';

// Import nav configs
import { menuOptions, favoritesData } from '../../config/navBarConfig';
import {
  commandCenterMenuOptions,
  commandCenterFavoritesData,
} from '../../config/commandCenterNavConfig';

// Route patterns that use specific nav configurations
const COMMAND_CENTER_ROUTES = ['/command-center'];
const AGENT_STUDIO_ROUTES = ['/agent-studio'];

// Routes that should NOT show the persistent navigation
// (they have their own navigation or none at all)
const EXCLUDED_ROUTES = [
  '/marketing',
  '/unified-portal',
  '/public-portal',
  '/vendor-portal',
];

interface NavConfig {
  appName: string;
  menuItems: SuiteNavMenuItem[];
  favorites?: SuiteNavFavoritesSection[];
  globalNav?: GlobalNavConfig;
}

/**
 * Get the navigation configuration based on the current route
 */
function getNavConfig(pathname: string): NavConfig | null {
  // Check if this route should be excluded from persistent nav
  for (const route of EXCLUDED_ROUTES) {
    if (pathname.startsWith(route)) {
      return null;
    }
  }

  // Command Center - centered branding, no suite nav
  for (const route of COMMAND_CENTER_ROUTES) {
    if (pathname.startsWith(route)) {
      return {
        appName: 'Command Center',
        menuItems: commandCenterMenuOptions.map((opt) => ({
          id: opt.id,
          label: opt.label,
          url: opt.url || '#',
        })),
        favorites: commandCenterFavoritesData.map((section) => ({
          id: section.id,
          label: section.label,
          items: (section.items || []).map((item: any) => ({
            id: item.id,
            label: item.label,
            url: item.url || '#',
          })),
        })),
        globalNav: {
          centeredBranding: true,
          hideSuiteNav: true,
        },
      };
    }
  }

  // Agent Studio - default layout with suite nav
  for (const route of AGENT_STUDIO_ROUTES) {
    if (pathname.startsWith(route)) {
      return {
        appName: 'Agent Studio',
        menuItems: menuOptions.map((opt) => ({
          id: opt.id,
          label: opt.label,
          url: opt.url || '#',
        })),
        favorites: favoritesData.map((section) => ({
          id: section.id,
          label: section.label,
          items: (section.items || []).map((item: any) => ({
            id: item.id,
            label: item.label,
            url: item.url || '#',
          })),
        })),
        globalNav: {
          centeredBranding: false,
          hideSuiteNav: false,
        },
      };
    }
  }

  // Default - return null to let individual layouts handle their own nav
  // This maintains backward compatibility with other suite layouts
  return null;
}

interface PersistentNavigationProps {
  onThemeEditorOpen?: () => void;
  children: React.ReactNode;
}

/**
 * PersistentNavigation wraps children and provides a persistent navigation
 * that animates between different configurations based on the current route.
 */
export function PersistentNavigation({
  onThemeEditorOpen,
  children,
}: PersistentNavigationProps) {
  const location = useLocation();
  const { setNavigationRendered } = useNavigationRendered();

  const navConfig = useMemo(() => {
    return getNavConfig(location.pathname);
  }, [location.pathname]);

  // Update context when navigation state changes
  useEffect(() => {
    setNavigationRendered(!!navConfig);
    return () => {
      setNavigationRendered(false);
    };
  }, [navConfig, setNavigationRendered]);

  const handleThemeEditorOpen = () => {
    if (onThemeEditorOpen) {
      onThemeEditorOpen();
    } else if ((window as any).openThemeEditor) {
      (window as any).openThemeEditor();
    }
  };

  // If no persistent nav config for this route, just render children
  // (the route's own layout will provide navigation)
  if (!navConfig) {
    return <>{children}</>;
  }

  return (
    <>
      <UnifiedNavigation
        globalNav={navConfig.globalNav}
        onThemeEditorOpen={handleThemeEditorOpen}
        appName={navConfig.appName}
        menuItems={navConfig.menuItems}
        favorites={navConfig.favorites}
      />
      {children}
    </>
  );
}

export default PersistentNavigation;
