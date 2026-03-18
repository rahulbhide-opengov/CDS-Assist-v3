/**
 * Seamstress Theme Constants
 * 
 * Unified design tokens for the public portal.
 * Based on CDS Design System with portal-specific extensions.
 */

// Seamstress color palette - aligned with CDS Design System
export const seamstressTheme = {
  // Primary - CDS Blurple
  primary: '#4b3fff',
  primaryHover: '#19009b',
  primaryLight: '#eef1fc',
  primaryMuted: '#d6d4ff',
  
  // Secondary - CDS Slate
  secondary: '#546574',
  secondaryHover: '#2d3748',
  secondaryLight: '#e9ecef',
  secondaryMuted: '#cbd2d9',
  
  // Status colors - CDS
  warning: '#ed6c02',
  warningLight: '#fff3e0',
  warningMuted: '#ffe0b2',
  
  success: '#2e7d32',
  successLight: '#e8f5e9',
  successMuted: '#a5d6a7',
  
  error: '#d32f2f',
  errorLight: '#ffebee',
  errorMuted: '#ffcdd2',
  
  info: '#0288d1',
  infoLight: '#e3f2fd',
  infoMuted: '#90caf9',
  
  // Neutral grays - CDS Grey scale
  gray50: '#fafafa',
  gray100: '#f2f2f2',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#d5d5d5',
  gray500: '#bdbdbd',
  gray600: '#adafb1',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Base
  white: '#FFFFFF',
  black: '#000000',
  
  // Transparent overlays - CDS
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.12)',

  // Shadow overlays for consistent box-shadows
  shadowLight: 'rgba(0, 0, 0, 0.06)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.12)',
  shadowPrimary: 'rgba(75, 63, 255, 0.3)',
};

// Responsive layout constants
// Note: maxWidth aligned with CDS breakpoints (desktop 1440)
export const layout = {
  maxWidth: 1400,
  containerPadding: { xs: 2, sm: 3, md: 4 },
  sectionSpacing: { xs: 4, sm: 5 },
  cardSpacing: { xs: 2, sm: 2.5 },
  headerHeight: { xs: 56, sm: 64 },
};

// Border radius - CDS default 4px
export const radius = {
  sm: '4px',
  md: '4px',
  lg: '4px',
  xl: '8px',
  full: '9999px',
};

// Typography presets
export const typography = {
  h1: {
    fontSize: { xs: '1.5rem', sm: '2rem' },
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    fontWeight: 600,
    letterSpacing: '-0.02em',
  },
  h3: {
    fontSize: { xs: '1.125rem', sm: '1.25rem' },
    fontWeight: 600,
  },
  body: {
    fontSize: { xs: '0.875rem', sm: '0.9375rem' },
  },
  small: {
    fontSize: '0.8125rem',
  },
  caption: {
    fontSize: '0.75rem',
  },
  tiny: {
    fontSize: '0.6875rem',
  },
};

// Common component styles
export const componentStyles = {
  card: {
    borderRadius: radius.lg,
    border: `1px solid ${seamstressTheme.gray200}`,
    boxShadow: 'none',
  },
  button: {
    primary: {
      bgcolor: seamstressTheme.primary,
      color: seamstressTheme.white,
      textTransform: 'none' as const,
      fontWeight: 500,
      borderRadius: radius.md,
      '&:hover': { bgcolor: seamstressTheme.primaryHover },
    },
    secondary: {
      bgcolor: seamstressTheme.gray100,
      color: seamstressTheme.gray700,
      textTransform: 'none' as const,
      fontWeight: 500,
      borderRadius: radius.md,
      '&:hover': { bgcolor: seamstressTheme.gray200 },
    },
    outlined: {
      borderColor: seamstressTheme.gray300,
      color: seamstressTheme.gray700,
      textTransform: 'none' as const,
      fontWeight: 500,
      borderRadius: radius.md,
      '&:hover': { borderColor: seamstressTheme.gray400, bgcolor: seamstressTheme.gray50 },
    },
    text: {
      color: seamstressTheme.primary,
      textTransform: 'none' as const,
      fontWeight: 500,
      '&:hover': { bgcolor: seamstressTheme.primaryLight },
    },
  },
  chip: {
    height: 28,
    fontSize: typography.tiny.fontSize,
    fontWeight: 600,
    borderRadius: radius.sm,
  },
  input: {
    borderRadius: radius.md,
    '& .MuiOutlinedInput-root': {
      borderRadius: radius.md,
    },
  },
};

// Status chip styles
export const statusStyles = {
  success: {
    bgcolor: seamstressTheme.successLight,
    color: seamstressTheme.success,
  },
  warning: {
    bgcolor: seamstressTheme.warningLight,
    color: seamstressTheme.warning,
  },
  error: {
    bgcolor: seamstressTheme.errorLight,
    color: seamstressTheme.error,
  },
  info: {
    bgcolor: seamstressTheme.primaryLight,
    color: seamstressTheme.primary,
  },
  neutral: {
    bgcolor: seamstressTheme.gray100,
    color: seamstressTheme.gray600,
  },
};

// CDS Design System color name mappings for backward compatibility
export const colors = {
  // Blurple (Primary) - CDS
  blurple700: '#19009b',
  blurple600: '#5a4fff',
  blurple500: '#6d63ff',
  blurple400: '#a098ff',
  blurple300: '#b5b0ff',
  blurple200: '#d6d4ff',
  blurple100: '#eef1fc',
  blurple50: '#f5f3ff',
  
  // Cerulean (Info/Secondary Blue) - CDS
  cerulean700: '#01579b',
  cerulean600: '#0288d1',
  cerulean500: '#0288d1',
  cerulean400: '#42a5f5',
  cerulean100: seamstressTheme.infoLight,
  cerulean50: seamstressTheme.infoLight,
  
  // Yellow/Amber (Warning) - CDS
  yellow700: '#ed6c02',
  yellow600: '#ed6c02',
  yellow500: '#ed6c02',
  yellow400: '#faaf00',
  yellow100: '#fff3e0',
  yellow50: '#fff3e0',
  
  // Orange - CDS
  orange500: '#ed6c02',
  orange100: '#fff3e0',
  
  // Green/Emerald (Success) - CDS
  green700: '#1b5e20',
  green600: seamstressTheme.success,
  green500: seamstressTheme.success,
  green400: '#4caf50',
  green100: seamstressTheme.successLight,
  green50: seamstressTheme.successLight,
  emerald500: seamstressTheme.success,
  emerald50: seamstressTheme.successLight,
  
  // Red/Scarlet (Error) - CDS
  red700: '#d32f2f',
  red100: '#ffebee',
  scarlet500: seamstressTheme.error,
  scarlet50: seamstressTheme.errorLight,
  
  // Magenta - CDS
  magenta500: '#e91e63',
  magenta400: '#ec407a',
  magenta50: '#fce4ec',
  
  // Gray/Neutral
  gray900: seamstressTheme.gray900,
  gray800: seamstressTheme.gray800,
  gray700: seamstressTheme.gray700,
  gray600: seamstressTheme.gray600,
  gray500: seamstressTheme.gray500,
  gray400: seamstressTheme.gray400,
  gray300: seamstressTheme.gray300,
  gray200: seamstressTheme.gray200,
  gray100: seamstressTheme.gray100,
  gray50: seamstressTheme.gray50,
  neutral900: seamstressTheme.gray900,
  neutral800: seamstressTheme.gray800,
  neutral700: seamstressTheme.gray700,
  neutral600: seamstressTheme.gray600,
  neutral500: seamstressTheme.gray500,
  neutral400: seamstressTheme.gray400,
  neutral300: seamstressTheme.gray300,
  neutral200: seamstressTheme.gray200,
  neutral100: seamstressTheme.gray100,
  neutral50: seamstressTheme.gray50,
  
  // Base
  white: seamstressTheme.white,
  black: seamstressTheme.black,
};

// Export the theme as default for convenience
export default seamstressTheme;

// Type export
export type SeamstressTheme = typeof seamstressTheme;

