/**
 * Marketing MUI Theme
 *
 * Creates an MUI theme extending capitalMuiTheme with marketing palette colors.
 * This enables MUI components to automatically respond to theme changes.
 *
 * Uses CSS custom properties where possible for consistent theming.
 */

import { createTheme } from '@mui/material/styles';
import { capitalMuiTheme } from '@opengov/capital-mui-theme';
import { FOUNDATION, MIDNIGHT, marketingCssVars as css } from './marketing-palette';

/**
 * Creates an MUI theme for marketing pages
 *
 * @param mode - 'light' for FOUNDATION palette, 'dark' for MIDNIGHT palette
 * @returns MUI theme object extending capitalMuiTheme
 */
export const createMarketingTheme = (mode: 'light' | 'dark' = 'light') => {
  const palette = mode === 'light' ? FOUNDATION : MIDNIGHT;

  return createTheme(capitalMuiTheme, {
    palette: {
      mode,
      primary: {
        main: palette.accent,
      },
      background: {
        default: palette.background,
        paper: palette.surface,
      },
      text: {
        primary: palette.foreground,
        secondary: palette.muted,
      },
      divider: palette.border,
      action: {
        hover: palette.hoverBg,
      },
    },
    components: {
      // Button overrides for marketing pages
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          containedPrimary: {
            backgroundColor: css.accent,
            color: css.invertedText,
            '&:hover': {
              backgroundColor: css.accent,
              filter: 'brightness(0.9)',
            },
          },
          outlinedPrimary: {
            borderColor: css.border,
            color: css.foreground,
            '&:hover': {
              borderColor: css.accent,
              backgroundColor: css.hoverBg,
            },
          },
          sizeLarge: {
            padding: '12px 32px',
            fontSize: '1rem',
          },
          sizeMedium: {
            padding: '10px 24px',
            fontSize: '0.9375rem',
          },
          sizeSmall: {
            padding: '8px 20px',
            fontSize: '0.875rem',
          },
        },
      },
      // Card overrides
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: css.surface,
            borderRadius: '12px',
            border: `1px solid ${css.border}`,
            boxShadow: 'none',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: css.accent,
            },
          },
        },
      },
      // Paper overrides
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: css.surface,
            backgroundImage: 'none',
          },
        },
      },
      // Typography overrides
      MuiTypography: {
        styleOverrides: {
          h1: {
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          },
          h2: {
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
          },
          h3: {
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 600,
            lineHeight: 1.3,
          },
        },
      },
      // Link overrides
      MuiLink: {
        styleOverrides: {
          root: {
            color: css.accent,
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
        },
      },
      // Divider overrides
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: css.border,
          },
        },
      },
      // Container defaults
      MuiContainer: {
        defaultProps: {
          maxWidth: 'lg',
        },
      },
      // Tabs overrides for proper dark mode support
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 48,
          },
          indicator: {
            backgroundColor: css.accent,
          },
        },
      },
      // Tab overrides
      MuiTab: {
        styleOverrides: {
          root: {
            color: css.muted,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9375rem',
            minHeight: 48,
            padding: '12px 16px',
            transition: 'color 0.2s ease, background-color 0.2s ease',
            '&:hover': {
              color: css.foreground,
              backgroundColor: css.hoverBg,
            },
            '&.Mui-selected': {
              color: css.accent,
            },
            '&.Mui-focusVisible': {
              backgroundColor: css.hoverBg,
            },
          },
        },
      },
      // Chip overrides for proper dark mode
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
          outlined: {
            borderColor: css.border,
            color: css.foreground,
            '&:hover': {
              backgroundColor: css.hoverBg,
            },
          },
          filled: {
            '&.MuiChip-colorDefault': {
              backgroundColor: css.hoverBg,
              color: css.foreground,
            },
          },
        },
      },
    },
  });
};

/**
 * Pre-created themes for convenience
 */
export const marketingLightTheme = createMarketingTheme('light');
export const marketingDarkTheme = createMarketingTheme('dark');
