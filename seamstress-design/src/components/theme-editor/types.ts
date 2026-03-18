/**
 * Theme Editor Types
 *
 * Type definitions for the theme editor system
 */

import type { PaletteOptions } from '@mui/material/styles';

export interface ColorMapping {
  tokenPath?: string;      // Optional - for design system tokens
  tokenValue?: string;     // Optional - for design system tokens
  customHex?: string;      // Custom hex color value (e.g., "#1976D2")
  category: string;
  subcategory?: string;
  source: 'token' | 'custom';  // Track the color source
}

export interface ThemeColorConfig {
  // Primary colors
  'primary.main': ColorMapping;
  'primary.light': ColorMapping;
  'primary.dark': ColorMapping;
  'primary.contrastText': ColorMapping;

  // Secondary colors
  'secondary.main': ColorMapping;
  'secondary.light': ColorMapping;
  'secondary.dark': ColorMapping;
  'secondary.contrastText': ColorMapping;

  // Error colors
  'error.main': ColorMapping;
  'error.light': ColorMapping;
  'error.dark': ColorMapping;
  'error.contrastText': ColorMapping;

  // Warning colors
  'warning.main': ColorMapping;
  'warning.light': ColorMapping;
  'warning.dark': ColorMapping;
  'warning.contrastText': ColorMapping;

  // Info colors
  'info.main': ColorMapping;
  'info.light': ColorMapping;
  'info.dark': ColorMapping;
  'info.contrastText': ColorMapping;

  // Success colors
  'success.main': ColorMapping;
  'success.light': ColorMapping;
  'success.dark': ColorMapping;
  'success.contrastText': ColorMapping;

  // Text colors
  'text.primary': ColorMapping;
  'text.secondary': ColorMapping;
  'text.disabled': ColorMapping;

  // Background colors
  'background.default': ColorMapping;
  'background.paper': ColorMapping;
  'background.secondary': ColorMapping;

  // Divider
  'divider': ColorMapping;

  // Action colors
  'action.active': ColorMapping;
  'action.hover': ColorMapping;
  'action.selected': ColorMapping;
  'action.disabled': ColorMapping;
  'action.disabledBackground': ColorMapping;
  'action.focus': ColorMapping;
}

export interface SavedTheme {
  id: string;
  name: string;
  description?: string;
  mode: 'light' | 'dark';
  colors: Partial<ThemeColorConfig>;
  borderRadius?: number; // Border radius in pixels (default: 4)
  createdAt: string;
  updatedAt: string;
}

export interface ThemeEditorState {
  currentTheme: SavedTheme | null;
  savedThemes: SavedTheme[];
  isEditing: boolean;
  editingColor: keyof ThemeColorConfig | null;
}

export interface ColorToken {
  path: string;
  value: string;
  category: string;
  subcategory?: string;
  displayName: string;
}

export type ThemeColorKey = keyof ThemeColorConfig;

export const COLOR_CATEGORIES = {
  PRIMARY: 'Primary',
  SECONDARY: 'Secondary',
  ERROR: 'Error',
  WARNING: 'Warning',
  INFO: 'Info',
  SUCCESS: 'Success',
  TEXT: 'Text',
  BACKGROUND: 'Background',
  DIVIDER: 'Divider',
  ACTION: 'Action',
} as const;

export const COLOR_KEYS_BY_CATEGORY: Record<string, ThemeColorKey[]> = {
  [COLOR_CATEGORIES.PRIMARY]: [
    'primary.main',
    'primary.light',
    'primary.dark',
    'primary.contrastText',
  ],
  [COLOR_CATEGORIES.SECONDARY]: [
    'secondary.main',
    'secondary.light',
    'secondary.dark',
    'secondary.contrastText',
  ],
  [COLOR_CATEGORIES.ERROR]: [
    'error.main',
    'error.light',
    'error.dark',
    'error.contrastText',
  ],
  [COLOR_CATEGORIES.WARNING]: [
    'warning.main',
    'warning.light',
    'warning.dark',
    'warning.contrastText',
  ],
  [COLOR_CATEGORIES.INFO]: [
    'info.main',
    'info.light',
    'info.dark',
    'info.contrastText',
  ],
  [COLOR_CATEGORIES.SUCCESS]: [
    'success.main',
    'success.light',
    'success.dark',
    'success.contrastText',
  ],
  [COLOR_CATEGORIES.TEXT]: [
    'text.primary',
    'text.secondary',
    'text.disabled',
  ],
  [COLOR_CATEGORIES.BACKGROUND]: [
    'background.default',
    'background.paper',
    'background.secondary',
  ],
  [COLOR_CATEGORIES.DIVIDER]: ['divider'],
  [COLOR_CATEGORIES.ACTION]: [
    'action.active',
    'action.hover',
    'action.selected',
    'action.disabled',
    'action.disabledBackground',
    'action.focus',
  ],
};
