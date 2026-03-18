/**
 * Unified Navigation Types
 *
 * TypeScript interfaces for the unified navigation system.
 */

/**
 * Navigation display mode
 * - 'full': Both global nav and suite nav visible
 * - 'suite-only': Only suite nav visible (global nav hidden)
 */
export type NavigationMode = 'full' | 'suite-only';

/**
 * Global nav configuration for BaseLayoutConfig
 */
export interface GlobalNavConfig {
  /** Whether global nav is visible (default: true) */
  visible?: boolean;
  /** Whether to enable scroll-based show/hide behavior (default: true when visible) */
  scrollBehavior?: boolean;
  /** Whether to center and stack the logo/entity dropdown vertically (default: false) */
  centeredBranding?: boolean;
  /** Whether to hide the suite navigation bar (default: false) */
  hideSuiteNav?: boolean;
}

/**
 * Scroll direction for scroll-based visibility
 */
export type ScrollDirection = 'up' | 'down' | null;

/**
 * Navigation visibility state from context
 */
export interface NavigationVisibilityState {
  /** Whether global nav should be visible based on route + scroll */
  isGlobalNavVisible: boolean;
  /** Current scroll direction */
  scrollDirection: ScrollDirection;
  /** Whether current route allows global nav */
  routeAllowsGlobalNav: boolean;
  /** Force show global nav (e.g., on hover) */
  forceShow: () => void;
  /** Reset to automatic visibility */
  resetVisibility: () => void;
}

/**
 * Props for UnifiedNavigation component
 */
export interface UnifiedNavigationProps {
  /** Global nav configuration */
  globalNav?: GlobalNavConfig;
  /** Callback when theme editor should open */
  onThemeEditorOpen?: () => void;
}

/**
 * Props for GlobalNavSection component
 */
export interface GlobalNavSectionProps {
  /** Whether this section is visible */
  isVisible: boolean;
  /** Callback when theme editor should open */
  onThemeEditorOpen?: () => void;
  /** Whether to hide the OpenGov logo */
  hideOpenGovLogo?: boolean;
  /** Whether to center and stack the logo/entity dropdown vertically */
  centeredBranding?: boolean;
}

/**
 * Props for SuiteNavSection component
 */
export interface SuiteNavSectionProps {
  /** App name displayed in the nav */
  appName: string;
  /** Menu items for navigation */
  menuItems: SuiteNavMenuItem[];
  /** Favorites sections */
  favorites?: SuiteNavFavoritesSection[];
}

/**
 * SuiteNav menu item
 */
export interface SuiteNavMenuItem {
  id: string;
  label: string;
  url: string;
}

/**
 * SuiteNav favorite item
 */
export interface SuiteNavFavoriteItem {
  id: string;
  label: string;
  url: string;
}

/**
 * SuiteNav favorites section
 */
export interface SuiteNavFavoritesSection {
  id: string;
  label?: string;
  items: SuiteNavFavoriteItem[];
}

/**
 * Props for SuiteNav component
 */
export interface SuiteNavProps {
  appName: string;
  menuItems: SuiteNavMenuItem[];
  favorites?: SuiteNavFavoritesSection[];
}
