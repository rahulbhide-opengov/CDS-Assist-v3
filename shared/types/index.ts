/**
 * CDS-Assist shared type definitions.
 * Common types used across the CDS Design System.
 */

/**
 * Responsive value that varies by device breakpoint.
 */
export type ResponsiveValue<T> = {
  desktop: T;
  tablet: T;
  mobile: T;
};

/**
 * Theme mode for light/dark appearance.
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Device mode based on viewport breakpoints.
 */
export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

/**
 * CDS color scale with standard palette steps.
 */
export type CDSColorScale = {
  50: string;
  100: string;
  200: string;
  400: string;
  700: string;
  900: string;
  main: string;
  light: string;
  dark: string;
  contrastText: string;
};

/**
 * Menu option for navigation.
 */
export interface MenuOption {
  id: string;
  label: string;
  path: string;
  submenu?: SubmenuOption[];
}

/**
 * Submenu option for nested navigation items.
 */
export interface SubmenuOption {
  id: string;
  label: string;
  path: string;
}

/**
 * Favorite item for quick access.
 */
export interface FavoriteItem {
  label: string;
  path: string;
}

/**
 * Search configuration for global search.
 */
export interface SearchConfig {
  filters: string[];
}

/**
 * Profile configuration for user display.
 */
export interface ProfileConfig {
  initials: string;
}

/**
 * Utility tray option.
 */
export interface UtilityTrayOption {
  id: string;
  label: string;
  icon?: string;
}

/**
 * Global navigation configuration options.
 */
export interface GlobalNavConfig {
  centeredBranding?: boolean;
  hideSuiteNav?: boolean;
}

/**
 * Navigation configuration for CDS applications.
 */
export interface NavConfig {
  appName: string;
  menuOptions: MenuOption[];
  favoritesData?: FavoriteItem[];
  utilityTrayOptions?: UtilityTrayOption[];
  searchConfig?: SearchConfig;
  profile?: ProfileConfig;
  globalNav?: GlobalNavConfig;
}
