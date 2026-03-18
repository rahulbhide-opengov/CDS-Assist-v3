/**
 * Theme Editor Hook
 *
 * Manages theme creation, editing, storage, and application
 */

import { useState, useEffect, useCallback } from 'react';
import { createTheme } from '@mui/material/styles';
import { capitalMuiTheme } from '@opengov/capital-mui-theme';
import type { SavedTheme, ThemeColorConfig, ThemeColorKey, ColorMapping } from '../components/theme-editor/types';
import { getTokenValue } from '../components/theme-editor/tokenUtils';
import { extractDefaultThemeColors } from '../components/theme-editor/themeDefaults';
import { generatePrimaryPalette } from '../components/theme-editor/colorUtils';
import { useThemeMode } from '../contexts/ThemeContext';
import { themeStorage } from '../services/themeStorage';
import type { ThemeUpdateEvent } from '../services/themeStorage';

export function useThemeEditor() {
  const { activeCustomThemeId, setActiveCustomThemeId } = useThemeMode();
  const [savedThemes, setSavedThemes] = useState<SavedTheme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<SavedTheme | null>(null);

  // Load saved themes from themeStorage on mount
  useEffect(() => {
    setSavedThemes(themeStorage.getAllThemes());
  }, []);

  // Subscribe to theme updates from other components/tabs
  useEffect(() => {
    const unsubscribe = themeStorage.subscribe((event: ThemeUpdateEvent) => {
      // Reload themes when any theme is updated or deleted
      if (event.type === 'update' || event.type === 'delete' || event.type === 'storage') {
        setSavedThemes(themeStorage.getAllThemes());

        // If currently editing theme was updated externally, reload it
        if (currentTheme && event.themeId === currentTheme.id && event.type === 'update') {
          const updatedTheme = themeStorage.getTheme(currentTheme.id);
          if (updatedTheme) {
            setCurrentTheme(updatedTheme);
          }
        }

        // If currently editing theme was deleted, clear it
        if (currentTheme && event.themeId === currentTheme.id && event.type === 'delete') {
          setCurrentTheme(null);
        }
      }
    });

    return unsubscribe;
  }, [currentTheme]);

  // Create a new theme
  const createNewTheme = useCallback((name: string, mode: 'light' | 'dark', description?: string): SavedTheme => {
    // Extract default theme colors for the selected mode
    const defaultColors = extractDefaultThemeColors(mode);

    const newTheme: SavedTheme = {
      id: `theme_${Date.now()}`,
      name,
      description,
      mode,
      colors: defaultColors,
      borderRadius: 4, // Default border radius
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const savedTheme = themeStorage.saveTheme(newTheme);
    setSavedThemes(themeStorage.getAllThemes());
    setCurrentTheme(savedTheme);
    return savedTheme;
  }, []);

  // Update current theme colors
  const updateThemeColor = useCallback(
    (colorKey: ThemeColorKey, mapping: ColorMapping) => {
      if (!currentTheme) return;

      const updatedTheme: SavedTheme = {
        ...currentTheme,
        colors: {
          ...currentTheme.colors,
          [colorKey]: mapping,
        },
        updatedAt: new Date().toISOString(),
      };

      const savedTheme = themeStorage.saveTheme(updatedTheme);
      setCurrentTheme(savedTheme);
      setSavedThemes(themeStorage.getAllThemes());
    },
    [currentTheme]
  );

  // Update current theme border radius
  const updateThemeBorderRadius = useCallback(
    (borderRadius: number) => {
      if (!currentTheme) return;

      const updatedTheme: SavedTheme = {
        ...currentTheme,
        borderRadius,
        updatedAt: new Date().toISOString(),
      };

      const savedTheme = themeStorage.saveTheme(updatedTheme);
      setCurrentTheme(savedTheme);
      setSavedThemes(themeStorage.getAllThemes());
    },
    [currentTheme]
  );

  // Save/update theme
  const saveTheme = useCallback(
    (theme: SavedTheme) => {
      const savedTheme = themeStorage.saveTheme(theme);
      setCurrentTheme(savedTheme);
      setSavedThemes(themeStorage.getAllThemes());
      return savedTheme;
    },
    []
  );

  // Delete theme
  const deleteTheme = useCallback((themeId: string) => {
    themeStorage.deleteTheme(themeId);
    setSavedThemes(themeStorage.getAllThemes());

    if (currentTheme?.id === themeId) {
      setCurrentTheme(null);
    }
  }, [currentTheme]);

  // Apply theme (set as active)
  const applyTheme = useCallback((themeId: string | null) => {
    // Always set the active theme ID (even if it's the same)
    // This ensures the theme is reloaded with latest changes
    themeStorage.setActiveThemeId(themeId);

    // Force update by setting to null first if it's the same ID
    if (activeCustomThemeId === themeId && themeId !== null) {
      setActiveCustomThemeId(null);
      // Use setTimeout to ensure the null state is processed before setting the new value
      setTimeout(() => {
        setActiveCustomThemeId(themeId);
      }, 0);
    } else {
      setActiveCustomThemeId(themeId);
    }
  }, [activeCustomThemeId, setActiveCustomThemeId]);

  // Convert SavedTheme to MUI theme
  const convertToMuiTheme = useCallback((theme: SavedTheme) => {
    const paletteOverrides: any = {};

    Object.entries(theme.colors).forEach(([key, mapping]) => {
      // Use custom hex if source is 'custom', otherwise use token
      const value = mapping.source === 'custom'
        ? mapping.customHex
        : (getTokenValue(mapping.tokenPath) || mapping.tokenValue);

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

    return createTheme(capitalMuiTheme, {
      palette: paletteOverrides,
      shape: {
        borderRadius: theme.borderRadius ?? 4, // Use theme's borderRadius or default to 4
      },
    });
  }, []);

  // Export theme to JSON
  const exportTheme = useCallback((theme: SavedTheme) => {
    themeStorage.exportTheme(theme);
  }, []);

  // Import theme from JSON
  const importTheme = useCallback((jsonString: string): SavedTheme | null => {
    const imported = themeStorage.importTheme(jsonString);
    if (imported) {
      setSavedThemes(themeStorage.getAllThemes());
    }
    return imported;
  }, []);

  // Load theme for editing
  const loadTheme = useCallback((themeId: string) => {
    const theme = savedThemes.find((t) => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [savedThemes]);

  // Get active theme
  const getActiveTheme = useCallback(() => {
    if (!activeCustomThemeId) return null;
    return savedThemes.find((t) => t.id === activeCustomThemeId) || null;
  }, [activeCustomThemeId, savedThemes]);

  // Set custom primary color with auto-generated variants
  const setCustomPrimaryColor = useCallback(
    (hexColor: string) => {
      if (!currentTheme) return;

      const palette = generatePrimaryPalette(hexColor);

      const updatedTheme: SavedTheme = {
        ...currentTheme,
        colors: {
          ...currentTheme.colors,
          'primary.main': {
            customHex: palette.main,
            category: 'primary',
            subcategory: 'main',
            source: 'custom',
          },
          'primary.light': {
            customHex: palette.light,
            category: 'primary',
            subcategory: 'light',
            source: 'custom',
          },
          'primary.dark': {
            customHex: palette.dark,
            category: 'primary',
            subcategory: 'dark',
            source: 'custom',
          },
          'primary.contrastText': {
            customHex: palette.contrastText,
            category: 'primary',
            subcategory: 'contrastText',
            source: 'custom',
          },
        },
        updatedAt: new Date().toISOString(),
      };

      const savedTheme = themeStorage.saveTheme(updatedTheme);
      setCurrentTheme(savedTheme);
      setSavedThemes(themeStorage.getAllThemes());
    },
    [currentTheme]
  );

  return {
    savedThemes,
    currentTheme,
    activeThemeId: activeCustomThemeId,
    createNewTheme,
    updateThemeColor,
    updateThemeBorderRadius,
    setCustomPrimaryColor,
    saveTheme,
    deleteTheme,
    applyTheme,
    exportTheme,
    importTheme,
    loadTheme,
    setCurrentTheme,
    convertToMuiTheme,
    getActiveTheme,
  };
}
