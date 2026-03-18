/**
 * Theme Defaults Extractor
 *
 * Extracts default theme values from Seamstress theme
 */

import { createSeamstressTheme } from '../../theme';
import type { ThemeColorConfig, ColorMapping, ThemeColorKey } from './types';

/**
 * Extracts all default theme color values for a given mode
 */
export function extractDefaultThemeColors(mode: 'light' | 'dark'): Partial<ThemeColorConfig> {
  const theme = createSeamstressTheme(mode);
  const colors: Partial<ThemeColorConfig> = {};

  // Helper to create a color mapping from a theme color value
  const createMapping = (value: string, category: string, subcategory?: string): ColorMapping => ({
    tokenPath: 'default', // Mark as default value
    tokenValue: value,
    category,
    subcategory,
    source: 'token', // Default to token source
  });

  // Extract Primary colors
  if (theme.palette.primary) {
    colors['primary.main'] = createMapping(
      theme.palette.primary.main,
      'Primary',
      'main'
    );
    colors['primary.light'] = createMapping(
      theme.palette.primary.light || theme.palette.primary.main,
      'Primary',
      'light'
    );
    colors['primary.dark'] = createMapping(
      theme.palette.primary.dark || theme.palette.primary.main,
      'Primary',
      'dark'
    );
    colors['primary.contrastText'] = createMapping(
      theme.palette.primary.contrastText || '#ffffff',
      'Primary',
      'contrastText'
    );
  }

  // Extract Secondary colors
  if (theme.palette.secondary) {
    colors['secondary.main'] = createMapping(
      theme.palette.secondary.main,
      'Secondary',
      'main'
    );
    colors['secondary.light'] = createMapping(
      theme.palette.secondary.light || theme.palette.secondary.main,
      'Secondary',
      'light'
    );
    colors['secondary.dark'] = createMapping(
      theme.palette.secondary.dark || theme.palette.secondary.main,
      'Secondary',
      'dark'
    );
    colors['secondary.contrastText'] = createMapping(
      theme.palette.secondary.contrastText || '#ffffff',
      'Secondary',
      'contrastText'
    );
  }

  // Extract Error colors
  if (theme.palette.error) {
    colors['error.main'] = createMapping(theme.palette.error.main, 'Error', 'main');
    colors['error.light'] = createMapping(
      theme.palette.error.light || theme.palette.error.main,
      'Error',
      'light'
    );
    colors['error.dark'] = createMapping(
      theme.palette.error.dark || theme.palette.error.main,
      'Error',
      'dark'
    );
    colors['error.contrastText'] = createMapping(
      theme.palette.error.contrastText || '#ffffff',
      'Error',
      'contrastText'
    );
  }

  // Extract Warning colors
  if (theme.palette.warning) {
    colors['warning.main'] = createMapping(theme.palette.warning.main, 'Warning', 'main');
    colors['warning.light'] = createMapping(
      theme.palette.warning.light || theme.palette.warning.main,
      'Warning',
      'light'
    );
    colors['warning.dark'] = createMapping(
      theme.palette.warning.dark || theme.palette.warning.main,
      'Warning',
      'dark'
    );
    colors['warning.contrastText'] = createMapping(
      theme.palette.warning.contrastText || '#000000',
      'Warning',
      'contrastText'
    );
  }

  // Extract Info colors
  if (theme.palette.info) {
    colors['info.main'] = createMapping(theme.palette.info.main, 'Info', 'main');
    colors['info.light'] = createMapping(
      theme.palette.info.light || theme.palette.info.main,
      'Info',
      'light'
    );
    colors['info.dark'] = createMapping(
      theme.palette.info.dark || theme.palette.info.main,
      'Info',
      'dark'
    );
    colors['info.contrastText'] = createMapping(
      theme.palette.info.contrastText || '#ffffff',
      'Info',
      'contrastText'
    );
  }

  // Extract Success colors
  if (theme.palette.success) {
    colors['success.main'] = createMapping(theme.palette.success.main, 'Success', 'main');
    colors['success.light'] = createMapping(
      theme.palette.success.light || theme.palette.success.main,
      'Success',
      'light'
    );
    colors['success.dark'] = createMapping(
      theme.palette.success.dark || theme.palette.success.main,
      'Success',
      'dark'
    );
    colors['success.contrastText'] = createMapping(
      theme.palette.success.contrastText || '#ffffff',
      'Success',
      'contrastText'
    );
  }

  // Extract Text colors
  if (theme.palette.text) {
    colors['text.primary'] = createMapping(
      theme.palette.text.primary,
      'Text',
      'primary'
    );
    colors['text.secondary'] = createMapping(
      theme.palette.text.secondary,
      'Text',
      'secondary'
    );
    colors['text.disabled'] = createMapping(
      theme.palette.text.disabled,
      'Text',
      'disabled'
    );
  }

  // Extract Background colors
  if (theme.palette.background) {
    colors['background.default'] = createMapping(
      theme.palette.background.default,
      'Background',
      'default'
    );
    colors['background.paper'] = createMapping(
      theme.palette.background.paper,
      'Background',
      'paper'
    );
    // @ts-ignore - secondary is a custom property
    if (theme.palette.background.secondary) {
      colors['background.secondary'] = createMapping(
        // @ts-ignore
        theme.palette.background.secondary,
        'Background',
        'secondary'
      );
    }
  }

  // Extract Divider
  if (theme.palette.divider) {
    colors['divider'] = createMapping(theme.palette.divider, 'Divider');
  }

  // Extract Action colors
  if (theme.palette.action) {
    colors['action.active'] = createMapping(
      theme.palette.action.active,
      'Action',
      'active'
    );
    colors['action.hover'] = createMapping(
      theme.palette.action.hover,
      'Action',
      'hover'
    );
    colors['action.selected'] = createMapping(
      theme.palette.action.selected,
      'Action',
      'selected'
    );
    colors['action.disabled'] = createMapping(
      theme.palette.action.disabled,
      'Action',
      'disabled'
    );
    colors['action.disabledBackground'] = createMapping(
      theme.palette.action.disabledBackground,
      'Action',
      'disabledBackground'
    );
    colors['action.focus'] = createMapping(
      theme.palette.action.focus,
      'Action',
      'focus'
    );
  }

  return colors;
}

/**
 * Gets a display name for a color value
 */
export function getColorDisplayName(colorKey: ThemeColorKey): string {
  const parts = colorKey.split('.');
  if (parts.length === 2) {
    return `${parts[0].charAt(0).toUpperCase() + parts[0].slice(1)} - ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
  }
  return colorKey.charAt(0).toUpperCase() + colorKey.slice(1);
}
