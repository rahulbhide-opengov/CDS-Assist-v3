/**
 * CDS Design System - Central Export
 *
 * Re-exports all CDS tokens and theme for use across the application.
 * Provides a compatibility layer mapping Capital Design System token names
 * to CDS Design System values.
 */

export { cdsTheme, colorTokens, spacingTokens, typographyTokens, sizingTokens, borderRadiusTokens, elevationTokens, zIndexTokens, transitionTokens, breakpointTokens, createResponsiveTypography, createResponsiveSize, createResponsiveSizeObject, createResponsiveSpacing } from './theme';
export type { CDSTheme } from './theme';
export type { ResponsiveValue } from './tokens';

import { colorTokens } from './tokens';

/**
 * CDS color constants mapped to Capital Design System color names
 * for backward compatibility with existing code.
 *
 * Primary: Blurple (#4b3fff)
 * Secondary: Slate (#546574)
 */
export const cdsColors = {
  // Blurple (Primary) scale
  blurple50: colorTokens.primary[50],       // #f5f3ff
  blurple100: colorTokens.primary[100],     // #eef1fc
  blurple200: colorTokens.primary[200],     // #d6d4ff
  blurple300: '#b5b0ff',                     // Interpolated
  blurple400: colorTokens.primary[400],     // #a098ff
  blurple500: '#6d63ff',                     // Interpolated mid-blurple
  blurple600: '#5a4fff',                     // Interpolated
  blurple700: colorTokens.primary[700],     // #4b3fff (CDS Primary)
  blurple800: '#3228cc',                     // Interpolated
  blurple900: colorTokens.primary[900],     // #19009b
  blurple1000: '#0f0066',                    // Extra dark

  // Slate (Secondary) scale
  slate50: colorTokens.secondary[50],       // #f8f9fa
  slate100: colorTokens.secondary[100],     // #e9ecef
  slate200: colorTokens.secondary[200],     // #cbd2d9
  slate300: '#adb5bd',                       // Interpolated
  slate400: colorTokens.secondary[400],     // #8e9ba8
  slate500: '#6f7f8c',                       // Interpolated
  slate600: '#617280',                       // Interpolated
  slate700: colorTokens.secondary[700],     // #546574 (CDS Secondary)
  slate800: '#3f4c58',                       // Interpolated
  slate900: colorTokens.secondary[900],     // #2d3748
  slate1000: '#1a2332',                      // Extra dark

  // Grey scale
  gray50: colorTokens.grey[50],             // #fafafa
  gray100: colorTokens.grey[100],           // #f2f2f2
  gray200: colorTokens.grey[200],           // #eeeeee
  gray300: colorTokens.grey[300],           // #e0e0e0
  gray400: colorTokens.grey[400],           // #d5d5d5
  gray500: colorTokens.grey[500],           // #bdbdbd
  gray600: colorTokens.grey[600],           // #adafb1
  gray700: colorTokens.grey[700],           // #616161
  gray800: colorTokens.grey[800],           // #424242
  gray900: colorTokens.grey[900],           // #212121

  // Semantic colors
  red50: '#ffebee',
  red100: '#ffcdd2',
  red200: '#ef9a9a',
  red500: colorTokens.error.light,          // #ef5350
  red600: colorTokens.error.main,           // #d32f2f
  red700: colorTokens.error.dark,           // #b71c1c

  green50: '#e8f5e9',
  green100: '#c8e6c9',
  green200: '#a5d6a7',
  green500: colorTokens.success.light,      // #4caf50
  green600: colorTokens.success.main,       // #2e7d32
  green700: colorTokens.success.dark,       // #1b5e20

  orange50: '#fff3e0',
  orange100: '#ffe0b2',
  orange200: '#ffcc80',
  orange500: colorTokens.warning.light,     // #faaf00
  orange600: colorTokens.warning.main,      // #ed6c02
  orange700: colorTokens.warning.dark,      // #e65100

  blue50: '#e3f2fd',
  blue100: '#bbdefb',
  blue200: '#90caf9',
  blue500: colorTokens.info.light,          // #42a5f5
  blue600: colorTokens.info.main,           // #0288d1
  blue700: colorTokens.info.dark,           // #01579b

  yellow50: '#fffde7',
  yellow100: '#fff9c4',
  yellow200: '#fff59d',
  yellow500: '#ffeb3b',
  yellow600: '#fdd835',
  yellow700: '#fbc02d',

  // Extended palette for data viz
  purple500: '#9c27b0',
  purple600: '#7b1fa2',
  violet500: '#7c4dff',
  violet600: '#651fff',
  turquoise500: '#009688',
  turquoise600: '#00897b',
  magenta500: '#e91e63',
  magenta700: '#c2185b',
  terracotta500: '#bf360c',
  scarlet500: colorTokens.error.main,
  scarlet50: '#ffebee',
  cerulean500: colorTokens.info.main,
  cerulean600: colorTokens.info.main,
  cerulean700: colorTokens.info.dark,
  cerulean100: '#e1f5fe',
  cerulean50: '#e1f5fe',
  emerald500: colorTokens.success.main,
  emerald50: '#e8f5e9',

  // Neutrals
  neutral50: colorTokens.grey[50],
  neutral100: colorTokens.grey[100],
  neutral200: colorTokens.grey[200],
  neutral300: colorTokens.grey[300],
  neutral400: colorTokens.grey[400],
  neutral500: colorTokens.grey[500],
  neutral600: colorTokens.grey[600],
  neutral700: colorTokens.grey[700],
  neutral800: colorTokens.grey[800],
  neutral900: colorTokens.grey[900],

  // Base
  white: '#ffffff',
  black: '#000000',
} as const;

/**
 * Drop-in replacement for capitalDesignTokens
 * Use this import instead of @opengov/capital-mui-theme
 */
export const cdsDesignTokens = {
  foundations: {
    colors: cdsColors,
    layout: {
      breakpoints: {
        desktop: {
          wide: 1440, // CDS Desktop breakpoint
        },
      },
    },
  },
} as const;
