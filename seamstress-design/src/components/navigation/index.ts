/**
 * Unified Navigation Module
 *
 * Exports all navigation components and utilities.
 */

// Main component
export { UnifiedNavigation } from './UnifiedNavigation';
export type { UnifiedNavigationComponentProps } from './UnifiedNavigation';

// Persistent navigation (App-level)
export { PersistentNavigation } from './PersistentNavigation';

// Section components
export { GlobalNavSection } from './GlobalNavSection';
export { SuiteNavSection } from './SuiteNavSection';

// Context and hooks
export {
  UnifiedNavigationProvider,
  useNavigationContext,
} from './UnifiedNavigationContext';
export { useNavigationVisibility, SUITE_ONLY_ROUTES } from './useNavigationVisibility';
export { useScrollDirection } from './useScrollDirection';

// Animations
export {
  globalNavVariants,
  globalNavShowTransition,
  globalNavHideTransition,
  getGlobalNavVariants,
  getGlobalNavTransition,
} from './animations';

// Types
export type {
  NavigationMode,
  GlobalNavConfig,
  ScrollDirection,
  NavigationVisibilityState,
  UnifiedNavigationProps,
  GlobalNavSectionProps,
  SuiteNavSectionProps,
  SuiteNavMenuItem,
  SuiteNavFavoriteItem,
  SuiteNavFavoritesSection,
  SuiteNavProps,
} from './types';

// SuiteNav components
export { SuiteNav, SuiteNavMenuItem as SuiteNavMenuItemComponent, FavoritesDropdown } from './SuiteNav';
