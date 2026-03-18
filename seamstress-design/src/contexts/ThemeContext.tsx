import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { createSeamstressTheme } from '../theme';
import type { SavedTheme } from '../components/theme-editor/types';
import { getTokenValue } from '../components/theme-editor/tokenUtils';
import { themeStorage } from '../services/themeStorage';
import type { ThemeUpdateEvent } from '../services/themeStorage';

type PaletteMode = 'light' | 'dark';

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
  setThemeMode: (mode: PaletteMode) => void;
  activeCustomThemeId: string | null;
  setActiveCustomThemeId: (id: string | null) => void;
  currentCustomTheme: SavedTheme | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Load saved theme preference from localStorage, default to 'light'
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode === 'dark' || savedMode === 'light') ? savedMode : 'light';
  });

  // Load active custom theme from themeStorage
  const [activeCustomThemeId, setActiveCustomThemeIdState] = useState<string | null>(() => {
    return themeStorage.getActiveThemeId();
  });

  const [currentCustomTheme, setCurrentCustomTheme] = useState<SavedTheme | null>(null);
  const [themeVersion, setThemeVersion] = useState(0);

  // Function to load theme from storage
  const loadActiveTheme = (themeId: string | null) => {
    if (themeId) {
      const theme = themeStorage.getTheme(themeId);
      if (theme) {
        setCurrentCustomTheme(theme);
        setThemeVersion(v => v + 1); // Force theme recreation
      } else {
        // Theme not found, clear active theme
        setActiveCustomThemeIdState(null);
        themeStorage.setActiveThemeId(null);
        setCurrentCustomTheme(null);
      }
    } else {
      setCurrentCustomTheme(null);
    }
  };

  // Load custom theme when activeCustomThemeId changes
  useEffect(() => {
    loadActiveTheme(activeCustomThemeId);
  }, [activeCustomThemeId]);

  // Update CSS custom properties when theme changes
  useEffect(() => {
    const updateCSSCustomProperties = () => {
      const root = document.documentElement;

      if (currentCustomTheme) {
        // Apply custom theme colors as CSS variables
        Object.entries(currentCustomTheme.colors).forEach(([key, mapping]) => {
          const cssVarName = `--theme-${key.replace('.', '-')}`;
          const value = getTokenValue(mapping.tokenPath) || mapping.tokenValue;
          root.style.setProperty(cssVarName, value);
        });
      } else {
        // Clear custom properties when no custom theme
        const root = document.documentElement;
        const styles = root.style;
        for (let i = styles.length - 1; i >= 0; i--) {
          const prop = styles[i];
          if (prop.startsWith('--theme-')) {
            root.style.removeProperty(prop);
          }
        }
      }
    };

    updateCSSCustomProperties();
  }, [currentCustomTheme]);

  // Subscribe to theme updates
  useEffect(() => {
    const unsubscribe = themeStorage.subscribe((event: ThemeUpdateEvent) => {
      // Handle theme updates
      if (event.type === 'update' && activeCustomThemeId === event.themeId) {
        // Active theme was updated, reload it
        loadActiveTheme(activeCustomThemeId);
      }

      // Handle theme deletion
      if (event.type === 'delete' && activeCustomThemeId === event.themeId) {
        // Active theme was deleted, clear it
        setActiveCustomThemeIdState(null);
        setCurrentCustomTheme(null);
      }

      // Handle active theme change from other components/tabs
      if (event.type === 'active-change') {
        setActiveCustomThemeIdState(event.activeThemeId || null);
      }

      // Handle storage events from other tabs
      if (event.type === 'storage') {
        if (event.activeThemeId !== undefined) {
          setActiveCustomThemeIdState(event.activeThemeId);
        } else {
          // Themes were updated in another tab, reload active theme if any
          if (activeCustomThemeId) {
            loadActiveTheme(activeCustomThemeId);
          }
        }
      }
    });

    return unsubscribe;
  }, [activeCustomThemeId]);

  // Save theme preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const setThemeMode = (newMode: PaletteMode) => {
    setMode(newMode);
  };

  const setActiveCustomThemeId = (id: string | null) => {
    setActiveCustomThemeIdState(id);
    themeStorage.setActiveThemeId(id);
  };

  // Create theme based on current mode and custom theme
  const theme = useMemo(() => {
    // If there's a custom theme, use its mode as the base
    const themeMode = currentCustomTheme?.mode || mode;
    const baseTheme = createSeamstressTheme(themeMode);

    // If there's a custom theme, apply its colors
    if (currentCustomTheme) {
      const paletteOverrides: any = {};

      Object.entries(currentCustomTheme.colors).forEach(([key, mapping]) => {
        // Use custom hex if source is 'custom', otherwise use token
        const value = mapping.source === 'custom'
          ? mapping.customHex
          : (getTokenValue(mapping.tokenPath) || mapping.tokenValue);

        // Skip if no value is found
        if (!value) return;

        const [category, subcategory] = key.split('.');

        if (!paletteOverrides[category]) {
          paletteOverrides[category] = {};
        }

        if (subcategory) {
          paletteOverrides[category][subcategory] = value;
        } else {
          paletteOverrides[category] = value;
        }
      });

      // Create a completely fresh theme with palette overrides and border radius
      // This ensures all palette-derived values are recalculated
      return createTheme({
        ...baseTheme,
        palette: createTheme(baseTheme, {
          palette: paletteOverrides,
        }).palette,
        shape: {
          ...baseTheme.shape,
          borderRadius: currentCustomTheme.borderRadius ?? baseTheme.shape?.borderRadius ?? 4,
        },
      });
    }

    return baseTheme;
  }, [mode, currentCustomTheme, themeVersion]);

  // Set CSS custom properties for OpenGov components that use them
  useEffect(() => {
    const root = document.documentElement;

    if (theme) {
      // Set primary color CSS variables
      root.style.setProperty('--theme-primary-main', theme.palette.primary.main);
      root.style.setProperty('--theme-primary-light', theme.palette.primary.light);
      root.style.setProperty('--theme-primary-dark', theme.palette.primary.dark);
      root.style.setProperty('--theme-primary-contrastText', theme.palette.primary.contrastText);

      // Set secondary color CSS variables
      root.style.setProperty('--theme-secondary-main', theme.palette.secondary.main);
      root.style.setProperty('--theme-secondary-contrastText', theme.palette.secondary.contrastText);
    }

    // Cleanup function
    return () => {
      root.style.removeProperty('--theme-primary-main');
      root.style.removeProperty('--theme-primary-light');
      root.style.removeProperty('--theme-primary-dark');
      root.style.removeProperty('--theme-primary-contrastText');
      root.style.removeProperty('--theme-secondary-main');
      root.style.removeProperty('--theme-secondary-contrastText');
    };
  }, [theme]);

  // Generate unique key for ThemeProvider to force complete re-mount
  // This ensures all components get fresh theme values
  const themeKey = useMemo(() => {
    if (currentCustomTheme) {
      return `theme-${currentCustomTheme.id}-${currentCustomTheme.updatedAt}-${themeVersion}`;
    }
    return `base-theme-${mode}-${themeVersion}`;
  }, [currentCustomTheme, mode, themeVersion]);

  const contextValue: ThemeContextType = {
    mode,
    toggleTheme,
    setThemeMode,
    activeCustomThemeId,
    setActiveCustomThemeId,
    currentCustomTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider key={themeKey} theme={theme}>
        <GlobalStyles
          styles={{
            // Force MUI components to use theme colors
            // This ensures checkboxes, radios, and other inputs update immediately
            '.MuiCheckbox-root.Mui-checked': {
              color: `${theme.palette.primary.main} !important`,
            },
            '.MuiRadio-root.Mui-checked': {
              color: `${theme.palette.primary.main} !important`,
            },
            '.MuiSwitch-switchBase.Mui-checked': {
              color: `${theme.palette.primary.main} !important`,
            },
            '.MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: `${theme.palette.primary.main} !important`,
            },
            // NavBar theming - app title
            '[data-test="nav_bar_header"] h1, [data-test="nav_bar_header"] h2, [data-test="nav_bar_header"] h3, [data-test="nav_bar_header"] h4': {
              color: `${theme.palette.primary.main} !important`,
            },
            '[data-test="nav_bar_header"] .MuiTypography-h1, [data-test="nav_bar_header"] .MuiTypography-h2, [data-test="nav_bar_header"] .MuiTypography-h3, [data-test="nav_bar_header"] .MuiTypography-h4': {
              color: `${theme.palette.primary.main} !important`,
            },
            // NavBar theming - badge
            '[data-test="nav_bar_header"] .MuiBadge-badge, [data-test="nav_bar_header"] .MuiBadge-colorPrimary': {
              backgroundColor: `${theme.palette.primary.main} !important`,
            },
            // NavBar theming - active tab using CSS custom properties (from theme overrides)
            '[data-test="nav_bar_header"] .MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.active-nav-link': {
              borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
            },
            '[data-test="nav_bar_header"] .active-nav-link': {
              borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
            },
            '[data-test="nav_bar_header"] a.active-nav-link': {
              borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
            },
          }}
        />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
