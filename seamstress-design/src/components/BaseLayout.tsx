/**
 * BaseLayout - Unified layout component for all OpenGov suite layouts
 *
 * This component consolidates the common layout logic shared across 16+ suite-specific
 * layouts (EAM, Procurement, Utility Billing, Budgeting, etc.) into a single reusable component.
 *
 * Features:
 * - Unified navigation with animated global nav (hides on Action Hub pages)
 * - Suite-specific navigation bar with configurable menus
 * - Optional search functionality (full-text search with filters)
 * - Theme editor utility
 *
 * Usage:
 * ```typescript
 * // Full layout with search
 * <BaseLayout config={eamLayoutConfig}>{children}</BaseLayout>
 *
 * // Layout with global nav hidden (Action Hub pages)
 * <BaseLayout config={commandCenterLayoutConfig}>{children}</BaseLayout>
 * ```
 */

import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { cdsDesignTokens } from '../theme/cds';
import { ThemeEditorUtility } from './theme-editor/ThemeEditorUtility';
import {
  SearchDialog,
  SearchResults,
  SearchSuggestions,
  SearchTable,
  SelectableTableItem,
  SelectableTableRow,
  FocusedPreview
} from '@opengov/components-nav-bar';
import { useDebounce } from 'react-use';
import type { IMenuItem } from '../config/navBarTypes';
import { UnifiedNavigation } from './navigation';
import type { GlobalNavConfig, SuiteNavMenuItem, SuiteNavFavoritesSection } from './navigation';
import { useNavigationRendered } from '../contexts/NavigationRenderedContext';

// Types
export interface SearchFilterOption {
  value: string;
  label: string;
  Icon: any;
}

export interface SearchSuggestion {
  title: string;
  type: string;
  id: string;
  url: string;
}

export interface SearchConfig {
  filterOptions: SearchFilterOption[];
  suggestions: SearchSuggestion[];
}

export interface BaseLayoutConfig {
  appName: string;
  menuOptions: IMenuItem[];
  favoritesData?: any[];
  searchConfig?: SearchConfig; // Optional - if omitted, no search functionality
  /** Global nav configuration - controls visibility and scroll behavior */
  globalNav?: GlobalNavConfig;
}

export interface BaseLayoutProps {
  children: React.ReactNode;
  config: BaseLayoutConfig;
  /** Override the max content width. Use 'none' for full width, or a number/string value. */
  maxContentWidth?: number | string | 'none';
}

type SearchResult = SearchSuggestion;

export function BaseLayout({ children, config, maxContentWidth }: BaseLayoutProps) {
  // Check if navigation is already rendered by PersistentNavigation
  const { isNavigationRendered } = useNavigationRendered();

  // Search state (only used if searchConfig is provided)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchInputDebounced, setSearchInputDebounced] = useState('');
  const [searchFilterValue, setSearchFilterValue] = useState('all');
  const [searchResults, setSearchResults] = useState<undefined | SearchResult[]>(undefined);
  const [searchIsLoading, setSearchIsLoading] = useState(false);

  // Debounce the search input to prevent excessive API calls
  useDebounce(() => setSearchInputDebounced(searchInput), 200, [searchInput]);

  // Subscribe to the debounced search input to trigger the API call
  React.useEffect(() => {
    if (!config.searchConfig) return; // Skip if no search config

    if (searchInputDebounced.length === 0) {
      setSearchResults(undefined);
      return;
    }
    setSearchIsLoading(true);

    // Replace with your API call
    setTimeout(() => {
      const filtered = config.searchConfig!.suggestions.filter(item =>
        item.title.toLowerCase().includes(searchInputDebounced.toLowerCase()) ||
        (searchFilterValue !== 'all' && item.type === searchFilterValue)
      );
      setSearchResults(filtered);
      setSearchIsLoading(false);
    }, 500);
  }, [searchInputDebounced, searchFilterValue, config.searchConfig]);

  const handleSearchSelection = useCallback((result: SearchResult) => {
    setSearchOpen(false);
    if (result.url) {
      window.location.href = result.url;
    }
  }, []);

  const handleThemeEditorOpen = () => {
    if ((window as any).openThemeEditor) {
      (window as any).openThemeEditor();
    }
  };

  // Transform menu options to SuiteNav format
  const menuItems: SuiteNavMenuItem[] = config.menuOptions.map((option) => ({
    id: option.id,
    label: option.label,
    url: option.url || '#',
  }));

  // Transform favorites data to SuiteNav format
  const favorites: SuiteNavFavoritesSection[] | undefined = config.favoritesData?.map((section) => ({
    id: section.id,
    label: section.label,
    items: (section.items || []).map((item: any) => ({
      id: item.id,
      label: item.label,
      url: item.url || '#',
    })),
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Skip to main content link for keyboard/screen reader users */}
      <Box
        component="a"
        href="#main-content"
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
        sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 9999,
          '&:focus': {
            position: 'fixed',
            top: 8,
            left: 8,
            p: 1.5,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
            borderRadius: 1,
            fontWeight: 600,
            textDecoration: 'none',
          },
        }}
      >
        Skip to main content
      </Box>

      {/* Only render navigation if not already rendered by PersistentNavigation */}
      {!isNavigationRendered && (
        <UnifiedNavigation
          globalNav={config.globalNav}
          onThemeEditorOpen={handleThemeEditorOpen}
          appName={config.appName}
          menuItems={menuItems}
          favorites={favorites}
        />
      )}

      {/* Theme Editor */}
      <ThemeEditorUtility />

      {/* Search Dialog - Only render if searchConfig is provided */}
      {config.searchConfig && (
        <SearchDialog
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          searchInput={searchInput}
          onSearchInputChange={setSearchInput}
          searchFilterOptions={config.searchConfig.filterOptions}
          activeSearchFilter={searchFilterValue}
          onActiveSearchFilterChange={setSearchFilterValue}
          searchResults={searchResults}
          searchSuggestions={config.searchConfig.suggestions}
          onSelectSearchResult={handleSearchSelection}
          onSelectSearchSuggestion={handleSearchSelection}
          isLoading={searchIsLoading}
        >
          <SearchSuggestions>
            <SearchTable title="Recently Viewed">
              {({ rowData }: { rowData: SearchResult }) => (
                <SelectableTableRow key={rowData.id}>
                  <SelectableTableItem>{rowData.type}</SelectableTableItem>
                  <SelectableTableItem>{rowData.title}</SelectableTableItem>
                </SelectableTableRow>
              )}
            </SearchTable>
            <FocusedPreview>
              {({ rowData }: { rowData: SearchResult }) => (
                <Box sx={{ border: '1px dashed', borderColor: 'grey.500', width: 1, height: 1, p: 2 }}>
                  <Box>Preview: {rowData.title}</Box>
                  <Box fontSize="12px" color="text.secondary">Type: {rowData.type}</Box>
                </Box>
              )}
            </FocusedPreview>
          </SearchSuggestions>
          <SearchResults>
            <SearchTable title="Results">
              {({ rowData }: { rowData: SearchResult }) => (
                <SelectableTableRow key={rowData.id}>
                  <SelectableTableItem>{rowData.type}</SelectableTableItem>
                  <SelectableTableItem>{rowData.title}</SelectableTableItem>
                </SelectableTableRow>
              )}
            </SearchTable>
            <FocusedPreview>
              {({ rowData }: { rowData: SearchResult }) => (
                <Box sx={{ border: '1px dashed', borderColor: 'grey.500', width: 1, height: 1, p: 2 }}>
                  <Box fontWeight="bold">{rowData.title}</Box>
                  <Box fontSize="14px" mt={1}>Navigate to: {rowData.url}</Box>
                </Box>
              )}
            </FocusedPreview>
          </SearchResults>
        </SearchDialog>
      )}

      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          maxWidth: maxContentWidth === 'none' ? 'none' : (maxContentWidth ?? cdsDesignTokens.foundations.layout.breakpoints.desktop.wide),
          mx: 'auto',
          '&:focus': { outline: 'none' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
