/**
 * MarketingThemeContext
 *
 * Context for managing marketing-specific light/dark mode.
 * Separate from the main app theme - only affects marketing pages.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import {
  getMarketingPalette,
  MARKETING_CSS_VARS,
  marketingCssVars,
  type MarketingColorPalette,
  type MarketingCssVars,
} from '../theme/marketing-palette';
import { createMarketingTheme } from '../theme/marketing-theme';

type MarketingMode = 'light' | 'dark';

interface MarketingThemeContextType {
  /** Current marketing theme mode */
  marketingMode: MarketingMode;
  /** Toggle between light and dark modes */
  toggleMarketingTheme: () => void;
  /** Set specific mode */
  setMarketingMode: (mode: MarketingMode) => void;
  /** Current color palette values (actual color strings for JS calculations) */
  marketingColors: MarketingColorPalette;
  /** CSS variable references for sx props (auto-responds to theme) */
  cssVars: MarketingCssVars;
  /** Check if dark mode is active */
  isDark: boolean;
}

const MarketingThemeContext = createContext<MarketingThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'marketingThemeMode';

/**
 * Hook to access marketing theme context
 */
export const useMarketingTheme = (): MarketingThemeContextType => {
  const context = useContext(MarketingThemeContext);
  if (!context) {
    throw new Error('useMarketingTheme must be used within MarketingThemeProvider');
  }
  return context;
};

interface MarketingThemeProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for marketing theme
 */
export const MarketingThemeProvider: React.FC<MarketingThemeProviderProps> = ({ children }) => {
  // Load saved preference from localStorage, default to 'light'
  const [marketingMode, setMarketingModeState] = useState<MarketingMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Get current color palette
  const marketingColors = useMemo(() => getMarketingPalette(marketingMode), [marketingMode]);

  // Inject CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    const palette = marketingColors;

    // Set CSS custom properties for all palette tokens
    Object.entries(MARKETING_CSS_VARS).forEach(([key, cssVar]) => {
      const value = palette[key as keyof MarketingColorPalette];
      if (value) {
        root.style.setProperty(cssVar, value);
      }
    });

    // Cleanup on unmount
    return () => {
      Object.values(MARKETING_CSS_VARS).forEach((cssVar) => {
        root.style.removeProperty(cssVar);
      });
    };
  }, [marketingColors]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, marketingMode);
    } catch {
      // Ignore storage errors
    }
  }, [marketingMode]);

  const toggleMarketingTheme = useCallback(() => {
    setMarketingModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setMarketingMode = useCallback((mode: MarketingMode) => {
    setMarketingModeState(mode);
  }, []);

  // Create MUI theme based on current mode
  const muiTheme = useMemo(() => createMarketingTheme(marketingMode), [marketingMode]);

  const contextValue = useMemo<MarketingThemeContextType>(
    () => ({
      marketingMode,
      toggleMarketingTheme,
      setMarketingMode,
      marketingColors,
      cssVars: marketingCssVars,
      isDark: marketingMode === 'dark',
    }),
    [marketingMode, toggleMarketingTheme, setMarketingMode, marketingColors]
  );

  return (
    <MarketingThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </MarketingThemeContext.Provider>
  );
};

export default MarketingThemeProvider;
