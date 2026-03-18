/**
 * CDS Theme Configuration
 *
 * Single source of truth for all theme customizations.
 * Built on the CDS Design System (Blurple #4b3fff / Slate #546574 / DM Sans).
 *
 * Architecture:
 * 1. Import CDS design tokens and responsive theme
 * 2. Define CDS-specific component overrides
 * 3. Export unified theme and helper tokens
 * 4. Support light and dark mode palettes
 */

import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import {
  cdsTheme as baseCDSTheme,
  colorTokens,
  typographyTokens,
  borderRadiusTokens,
} from './cds';
import { openGovDarkModeOverrides } from './opengov-overrides';
import { darkThemeComponents } from './dark-theme-components';

type PaletteMode = 'light' | 'dark';

// ============================================================================
// DARK MODE PALETTE — CDS Dark Theme
// ============================================================================

const darkModePalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: {
    main: '#94a8ff',
    light: '#c7d2ff',
    dark: '#4b3fff',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#9cb1c3',
    light: '#cbd2d9',
    dark: '#546574',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
    secondary: '#2a2a2a',
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.87)',
    secondary: 'rgba(255, 255, 255, 0.7)',
    disabled: 'rgba(255, 255, 255, 0.5)',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: 'rgba(255, 255, 255, 0.54)',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.26)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(255, 255, 255, 0.12)',
  },
  error: {
    main: colorTokens.error.main,
    light: colorTokens.error.light,
    dark: colorTokens.error.dark,
    contrastText: '#ffffff',
  },
  warning: {
    main: colorTokens.warning.main,
    light: colorTokens.warning.light,
    dark: colorTokens.warning.dark,
    contrastText: '#ffffff',
  },
  info: {
    main: colorTokens.info.main,
    light: colorTokens.info.light,
    dark: colorTokens.info.dark,
    contrastText: '#ffffff',
  },
  success: {
    main: colorTokens.success.main,
    light: colorTokens.success.light,
    dark: colorTokens.success.dark,
    contrastText: '#ffffff',
  },
};

// ============================================================================
// CDS COMPONENT OVERRIDES
// Additive-only overrides that extend (not conflict with) baseCDSTheme.
// All focus rings, sizing, typography, spacing, and color states are
// already defined in baseCDSTheme (theme.ts). Only add here what is NOT
// covered there: DataGrid theming, table header backgrounds, Chip "strong"
// variant, and Accordion expanded border.
// ============================================================================

const cdsComponents: ThemeOptions['components'] = {
  MuiChip: {
    variants: [
      {
        props: { variant: 'strong' as any },
        style: ({ theme }: any) => ({
          fontWeight: typographyTokens.fontWeightSemiBold,
          '&.MuiChip-colorDefault': {
            backgroundColor: theme.palette.grey[700],
            color: theme.palette.common.white,
          },
          '&.MuiChip-colorPrimary': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
          '&.MuiChip-colorSecondary': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
          },
          '&.MuiChip-colorSuccess': {
            backgroundColor: theme.palette.success.main,
            color: theme.palette.success.contrastText,
          },
          '&.MuiChip-colorError': {
            backgroundColor: theme.palette.error.main,
            color: theme.palette.error.contrastText,
          },
          '&.MuiChip-colorWarning': {
            backgroundColor: theme.palette.warning.main,
            color: theme.palette.warning.contrastText,
          },
          '&.MuiChip-colorInfo': {
            backgroundColor: theme.palette.info.main,
            color: theme.palette.info.contrastText,
          },
        }),
      },
    ],
  },

  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }: any) => ({
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: borderRadiusTokens.small,
        '& .MuiDataGrid-row': {
          backgroundColor: theme.palette.mode === 'light'
            ? colorTokens.background.paper
            : theme.palette.background.paper,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'light'
              ? colorTokens.grey[50]
              : 'rgba(255, 255, 255, 0.08)',
          },
        },
        '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
          borderBottom: 'none',
        },
      }),
      columnHeaders: ({ theme }: any) => ({
        backgroundColor: theme.palette.mode === 'light'
          ? colorTokens.background.tertiary
          : theme.palette.background.paper,
        borderTopLeftRadius: `${borderRadiusTokens.small}px`,
        borderTopRightRadius: `${borderRadiusTokens.small}px`,
      }),
      columnHeader: ({ theme }: any) => ({
        backgroundColor: theme.palette.mode === 'light'
          ? colorTokens.background.tertiary
          : theme.palette.background.paper,
      }),
    },
  },

};

// ============================================================================
// CREATE CDS THEME VARIANTS
// ============================================================================

/**
 * Create a CDS theme with the specified mode (light or dark)
 *
 * Uses the CDS Design System base theme and layers overrides:
 * 1. baseCDSTheme - CDS responsive theme with all tokens
 * 2. cdsComponents - Accessibility and component overrides
 * 3. darkThemeComponents - Dark mode overrides (dark mode only)
 * 4. openGovDarkModeOverrides - OpenGov component CSS fixes (dark mode only)
 */
export const createCDSTheme = (mode: PaletteMode = 'light') => {
  const paletteOptions = mode === 'dark'
    ? darkModePalette
    : {
      ...baseCDSTheme.palette,
      background: {
        ...baseCDSTheme.palette.background,
        secondary: colorTokens.background.tertiary,
      },
    };

  let theme = createTheme(baseCDSTheme, {
    palette: paletteOptions,
    components: cdsComponents,
  });

  if (mode === 'dark') {
    theme = createTheme(theme, {
      components: darkThemeComponents,
    });
    theme = createTheme(theme, {
      components: openGovDarkModeOverrides,
    });
  }

  return theme;
};

/**
 * @deprecated Use createCDSTheme instead
 */
export const createSeamstressTheme = createCDSTheme;

// ============================================================================
// DEFAULT LIGHT THEME
// ============================================================================

export const theme = createCDSTheme('light');

// ============================================================================
// TRANSITIONS
// ============================================================================

export { transitions, durations, easing } from './transitions';
