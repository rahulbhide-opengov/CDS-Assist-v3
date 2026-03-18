/**
 * CDS Design Tokens - FULLY RESPONSIVE
 * Complete token definitions matching Figma design system
 * Supports 3 device sizes: Desktop (1440), Tablet (768), Mobile (390)
 *
 * ALL VALUES ARE CDS BRAND COLORS - NOT MUI DEFAULTS
 *
 * COLOR SYSTEM OVERVIEW:
 * =====================
 * Primary: Blurple scale (50-900) with main at 700 (#4B3FFF)
 * Secondary: Slate scale (50-900) with main at 700 (#546574)
 *
 * RESPONSIVE SYSTEM:
 * =================
 * Breakpoints: Desktop (1440+), Tablet (768-1439), Mobile (390-767)
 * Typography: Device-specific font sizes and line heights
 * Sizing: Device-specific component dimensions
 * Spacing: Large spacing values responsive across devices
 */

/**
 * Device Breakpoint Tokens
 */
export const breakpointTokens = {
  values: {
    xs: 0,      // Mobile start
    sm: 600,    // Small tablets
    md: 900,    // Tablet/Desktop boundary
    lg: 1200,   // Desktop
    xl: 1536,   // Large desktop
  },
  // Figma design system breakpoints
  figma: {
    mobile: 390,   // Mobile design size
    tablet: 768,   // Tablet design size
    desktop: 1440, // Desktop design size
  },
} as const;

/**
 * Helper type for responsive values
 */
export interface ResponsiveValue<T> {
  desktop: T;  // >= 900px
  tablet: T;   // 600-899px
  mobile: T;   // < 600px
}

/**
 * Color Tokens
 * All color values for the CDS system using CDS brand colors
 */
export const colorTokens = {
  // Primary Colors - Blurple Scale
  primary: {
    50: '#f5f3ff',        // Blurple 50 (Lightest)
    100: '#eef1fc',       // Blurple 100 (Very Light Surface)
    200: '#d6d4ff',       // Blurple 200 (Light Surface)
    400: '#a098ff',       // Blurple 400 (Medium Light)
    700: '#4b3fff',       // Blurple 700 (CDS Primary Main)
    900: '#19009b',       // Blurple 900 (Darkest)
    main: '#4b3fff',      // Blurple 700 (CDS Primary)
    light: '#eef1fc',     // Blurple 100 (Light Surface)
    dark: '#19009b',      // Blurple 900 (Dark)
    contrastText: '#ffffff',  // Light theme
    contrastTextDark: 'rgba(0, 0, 0, 0.87)',  // Dark theme
  },

  // Secondary Colors - Slate Scale
  secondary: {
    50: '#f8f9fa',        // Slate 50 (Lightest)
    100: '#e9ecef',       // Slate 100 (Very Light)
    200: '#cbd2d9',       // Slate 200 (Light)
    400: '#8e9ba8',       // Slate 400 (Medium)
    700: '#546574',       // Slate 700 (CDS Secondary Main)
    900: '#2d3748',       // Slate 900 (Darkest)
    main: '#546574',      // Slate 700 (CDS Secondary Gray)
    light: '#e9ecef',     // Slate 100
    dark: '#2d3748',      // Slate 900
    contrastText: '#ffffff',  // Light theme
    contrastTextDark: 'rgba(0, 0, 0, 0.87)',  // Dark theme
  },

  // Secondary Text Gray (for backward compatibility)
  secondaryGray: {
    main: '#546574',      // CDS Secondary Gray (Descriptive text)
  },

  // Semantic Colors
  error: {
    main: '#d32f2f',      // CDS Error Red
    alternate: '#d33423', // CDS Error Alternate (Forms)
    light: '#ef5350',     // CDS Error Light
    dark: '#b71c1c',      // CDS Error Dark (Hover)
    darkText: '#5f2120',  // CDS Error Dark Text
    contrastText: '#ffffff',
  },

  success: {
    main: '#2e7d32',      // CDS Success Green
    light: '#4caf50',     // CDS Success Light
    dark: '#1b5e20',      // CDS Success Dark (Hover)
    darkText: '#1e4620',  // CDS Success Dark Text
    contrastText: '#ffffff',
  },

  warning: {
    main: '#ed6c02',      // CDS Warning Orange
    alternate: '#f5a300', // CDS Warning Alternate
    light: '#faaf00',     // CDS Warning Light
    dark: '#e65100',      // CDS Warning Dark (Hover)
    darkText: '#663c00',  // CDS Warning Dark Text
    contrastText: '#ffffff',
  },

  info: {
    main: '#0288d1',      // CDS Info Blue
    alternate: '#1976d2', // CDS Info Alternate
    light: '#42a5f5',     // CDS Info Light
    medium: '#1565c0',    // CDS Info Medium
    dark: '#01579b',      // CDS Info Dark (Hover)
    darkText: '#014361',  // CDS Info Dark Text
    contrastText: '#ffffff',
  },

  // Grey Scale
  grey: {
    50: '#fafafa',        // Light backgrounds
    100: '#f2f2f2',       // Disabled backgrounds
    200: '#eeeeee',       // Very light grey
    300: '#e0e0e0',       // Default button backgrounds
    400: '#d5d5d5',       // Hover states
    500: '#bdbdbd',       // Borders
    600: '#adafb1',       // Secondary borders
    700: '#616161',       // Dark text/backgrounds
    800: '#424242',       // Darker backgrounds
    900: '#212121',       // Darkest backgrounds
    A100: '#f5f5f5',
    A200: '#eeeeee',
    A400: '#bdbdbd',
    A700: '#616161',
  },

  // Text Colors
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',    // 87% opacity - Main text
    secondary: 'rgba(0, 0, 0, 0.6)',   // 60% opacity - Secondary text
    tertiary: 'rgba(0, 0, 0, 0.54)',   // 54% opacity - Tertiary text, icons
    disabled: 'rgba(0, 0, 0, 0.38)',   // 38% opacity - Disabled text
    hint: 'rgba(0, 0, 0, 0.26)',       // 26% opacity - Placeholder text
  },

  // Background Colors
  background: {
    default: '#fafafa',   // Page background
    paper: '#ffffff',     // Component backgrounds
    tertiary: '#f2f2f2',  // Disabled/inactive backgrounds
  },

  // Action Colors - CDS opacity values
  action: {
    active: 'rgba(0, 0, 0, 0.54)',           // Active states - 54%
    hover: 'rgba(0, 0, 0, 0.04)',            // Hover backgrounds - 4%
    hoverOpacity: 0.04,
    subtle: 'rgba(0, 0, 0, 0.02)',           // Subtle interactions - 2%
    selected: 'rgba(0, 0, 0, 0.08)',         // Selected backgrounds - 8%
    selectedOpacity: 0.08,
    disabled: 'rgba(0, 0, 0, 0.26)',         // Disabled elements - 26%
    disabledBackground: 'rgba(0, 0, 0, 0.12)', // Disabled button backgrounds - 12%
    disabledOpacity: 0.38,
    focus: 'rgba(0, 0, 0, 0.12)',            // Focus rings - 12%
    focusOpacity: 0.12,
    track: 'rgba(0, 0, 0, 0.11)',            // Progress track - 11%
    activatedOpacity: 0.12,
  },

  // Divider
  divider: 'rgba(0, 0, 0, 0.12)',  // Borders, dividers - 12%

  // Backdrop/Overlay Colors
  backdrop: {
    light: 'rgba(0, 0, 0, 0.3)',   // Light backdrop - 30%
    standard: 'rgba(0, 0, 0, 0.5)', // Standard backdrop - 50%
    dark: 'rgba(0, 0, 0, 0.7)',     // Dark backdrop - 70%
    heavy: 'rgba(0, 0, 0, 0.8)',    // Heavy backdrop - 80%
  },

  // White Overlays (for dark backgrounds)
  whiteOverlay: {
    hover: 'rgba(255, 255, 255, 0.12)',    // White hover - 12%
    selected: 'rgba(255, 255, 255, 0.15)', // White selected - 15%
    active: 'rgba(255, 255, 255, 0.54)',   // White active - 54%
  },

  // Primary State Colors - Light Theme (Blurple 700 based)
  primaryStates: {
    light: {
      hover: 'rgba(75, 63, 255, 0.04)',        // Blurple 700 @ 4%
      selected: 'rgba(75, 63, 255, 0.08)',     // Blurple 700 @ 8%
      focus: 'rgba(75, 63, 255, 0.12)',        // Blurple 700 @ 12%
      focusVisible: 'rgba(75, 63, 255, 0.30)', // Blurple 700 @ 30%
      outlinedBorder: 'rgba(75, 63, 255, 0.50)', // Blurple 700 @ 50%
    },
    dark: {
      hover: 'rgba(148, 168, 255, 0.08)',      // #94A8FF @ 8%
      selected: 'rgba(148, 168, 255, 0.16)',   // #94A8FF @ 16%
      focus: 'rgba(148, 168, 255, 0.12)',      // #94A8FF @ 12%
      focusVisible: 'rgba(148, 168, 255, 0.30)', // #94A8FF @ 30%
      outlinedBorder: 'rgba(148, 168, 255, 0.50)', // #94A8FF @ 50%
    },
  },

  // Secondary State Colors - Light Theme (Slate 700 based)
  secondaryStates: {
    light: {
      hover: 'rgba(84, 101, 116, 0.04)',       // #546574 @ 4%
      selected: 'rgba(84, 101, 116, 0.08)',    // #546574 @ 8%
      focus: 'rgba(84, 101, 116, 0.12)',       // #546574 @ 12%
      focusVisible: 'rgba(84, 101, 116, 0.30)', // #546574 @ 30%
      outlinedBorder: 'rgba(84, 101, 116, 0.50)', // #546574 @ 50%
    },
    dark: {
      hover: 'rgba(156, 177, 195, 0.08)',      // #9CB1C3 @ 8%
      selected: 'rgba(156, 177, 195, 0.16)',   // #9CB1C3 @ 16%
      focus: 'rgba(156, 177, 195, 0.12)',      // #9CB1C3 @ 12%
      focusVisible: 'rgba(156, 177, 195, 0.30)', // #9CB1C3 @ 30%
      outlinedBorder: 'rgba(156, 177, 195, 0.50)', // #9CB1C3 @ 50%
    },
  },

  // Opacity Variants (for backward compatibility)
  primaryOpacity: {
    4: 'rgba(75, 63, 255, 0.04)',
    8: 'rgba(75, 63, 255, 0.08)',
    12: 'rgba(75, 63, 255, 0.12)',
    20: 'rgba(75, 63, 255, 0.2)',
    30: 'rgba(75, 63, 255, 0.3)',
    38: 'rgba(75, 63, 255, 0.38)',
    50: 'rgba(75, 63, 255, 0.5)',
    70: 'rgba(75, 63, 255, 0.7)',
    100: 'rgba(75, 63, 255, 1)',
  },

  secondaryOpacity: {
    4: 'rgba(84, 101, 116, 0.04)',
    8: 'rgba(84, 101, 116, 0.08)',
    12: 'rgba(84, 101, 116, 0.12)',
    30: 'rgba(84, 101, 116, 0.3)',
    50: 'rgba(84, 101, 116, 0.5)',
    70: 'rgba(84, 101, 116, 0.7)',
  },

  errorOpacity: {
    4: 'rgba(211, 47, 47, 0.04)',
    8: 'rgba(211, 47, 47, 0.08)',
    12: 'rgba(211, 47, 47, 0.12)',
    30: 'rgba(211, 47, 47, 0.3)',
    50: 'rgba(211, 47, 47, 0.5)',
    70: 'rgba(211, 47, 47, 0.7)',
  },

  successOpacity: {
    4: 'rgba(46, 125, 50, 0.04)',
    8: 'rgba(46, 125, 50, 0.08)',
    12: 'rgba(46, 125, 50, 0.12)',
    30: 'rgba(46, 125, 50, 0.3)',
    50: 'rgba(46, 125, 50, 0.5)',
    70: 'rgba(46, 125, 50, 0.7)',
  },

  warningOpacity: {
    4: 'rgba(237, 108, 2, 0.04)',
    8: 'rgba(237, 108, 2, 0.08)',
    12: 'rgba(237, 108, 2, 0.12)',
    30: 'rgba(237, 108, 2, 0.3)',
    50: 'rgba(237, 108, 2, 0.5)',
    70: 'rgba(237, 108, 2, 0.7)',
  },

  infoOpacity: {
    4: 'rgba(2, 136, 209, 0.04)',
    8: 'rgba(2, 136, 209, 0.08)',
    12: 'rgba(2, 136, 209, 0.12)',
    30: 'rgba(2, 136, 209, 0.3)',
    50: 'rgba(2, 136, 209, 0.5)',
    70: 'rgba(2, 136, 209, 0.7)',
  },

  // Semantic State Colors (same pattern as primaryStates/secondaryStates)
  errorStates: {
    light: {
      hover: 'rgba(211, 47, 47, 0.04)',
      selected: 'rgba(211, 47, 47, 0.08)',
      focus: 'rgba(211, 47, 47, 0.12)',
      focusVisible: 'rgba(211, 47, 47, 0.30)',
      outlinedBorder: 'rgba(211, 47, 47, 0.50)',
    },
  },
  successStates: {
    light: {
      hover: 'rgba(46, 125, 50, 0.04)',
      selected: 'rgba(46, 125, 50, 0.08)',
      focus: 'rgba(46, 125, 50, 0.12)',
      focusVisible: 'rgba(46, 125, 50, 0.30)',
      outlinedBorder: 'rgba(46, 125, 50, 0.50)',
    },
  },
  warningStates: {
    light: {
      hover: 'rgba(237, 108, 2, 0.04)',
      selected: 'rgba(237, 108, 2, 0.08)',
      focus: 'rgba(237, 108, 2, 0.12)',
      focusVisible: 'rgba(237, 108, 2, 0.30)',
      outlinedBorder: 'rgba(237, 108, 2, 0.50)',
    },
  },
  infoStates: {
    light: {
      hover: 'rgba(2, 136, 209, 0.04)',
      selected: 'rgba(2, 136, 209, 0.08)',
      focus: 'rgba(2, 136, 209, 0.12)',
      focusVisible: 'rgba(2, 136, 209, 0.30)',
      outlinedBorder: 'rgba(2, 136, 209, 0.50)',
    },
  },
} as const;

/**
 * Spacing Tokens - RESPONSIVE
 * 4px base unit spacing scale with responsive large values
 */
export const spacingTokens = {
  base: 4, // 4px base unit

  // Fixed spacing values (same across all devices)
  values: {
    0: 0,      // 0px
    0.5: 2,    // 2px
    1: 4,      // 4px
    1.5: 6,    // 6px
    2: 8,      // 8px
    3: 12,     // 12px
    4: 16,     // 16px
    4.5: 18,   // 18px
    5: 20,     // 20px
    6: 24,     // 24px
    7: 28,     // 28px
    7.5: 30,   // 30px
    8: 32,     // 32px
  },

  // Responsive spacing values (vary by device)
  responsive: {
    40: { desktop: 40, tablet: 40, mobile: 36 },
    48: { desktop: 48, tablet: 48, mobile: 40 },
    64: { desktop: 64, tablet: 56, mobile: 44 },
    72: { desktop: 72, tablet: 64, mobile: 48 },
    80: { desktop: 80, tablet: 72, mobile: 52 },
    88: { desktop: 88, tablet: 80, mobile: 56 },
    96: { desktop: 96, tablet: 88, mobile: 60 },
  },
} as const;

/**
 * Typography Tokens - FULLY RESPONSIVE
 * CDS BRAND TYPOGRAPHY - DM Sans with device-specific sizes
 */
export const typographyTokens = {
  fontFamily: '"DM Sans", "DM_Sans:Regular", "DM_Sans:Medium", sans-serif',
  fontSize: 14, // Base font size in px

  // Font weights - DM Sans weights
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 600,
  fontWeightBold: 700,

  // CDS text transform convention — never uppercase
  textTransform: 'none' as const,

  // ========================================
  // DISPLAY STYLES (Responsive)
  // ========================================
  display1: {
    desktop: { fontSize: 60, lineHeight: 72, fontWeight: 600, letterSpacing: -0.4 },
    tablet: { fontSize: 72, lineHeight: 88, fontWeight: 600, letterSpacing: -0.4 },
    mobile: { fontSize: 64, lineHeight: 76, fontWeight: 600, letterSpacing: -0.4 },
  },

  display2: {
    desktop: { fontSize: 56, lineHeight: 68, fontWeight: 600, letterSpacing: -0.4 },
    tablet: { fontSize: 64, lineHeight: 76, fontWeight: 600, letterSpacing: -0.4 },
    mobile: { fontSize: 56, lineHeight: 68, fontWeight: 600, letterSpacing: -0.4 },
  },

  display3: {
    desktop: { fontSize: 48, lineHeight: 56, fontWeight: 600, letterSpacing: -0.4 },
    tablet: { fontSize: 56, lineHeight: 68, fontWeight: 600, letterSpacing: -0.4 },
    mobile: { fontSize: 48, lineHeight: 56, fontWeight: 600, letterSpacing: -0.4 },
  },

  display4: {
    desktop: { fontSize: 40, lineHeight: 48, fontWeight: 600, letterSpacing: -0.4 },
    tablet: { fontSize: 48, lineHeight: 56, fontWeight: 600, letterSpacing: -0.4 },
    mobile: { fontSize: 40, lineHeight: 48, fontWeight: 600, letterSpacing: -0.4 },
  },

  display5: {
    desktop: { fontSize: 32, lineHeight: 40, fontWeight: 600, letterSpacing: -0.4 },
    tablet: { fontSize: 40, lineHeight: 48, fontWeight: 600, letterSpacing: -0.4 },
    mobile: { fontSize: 32, lineHeight: 40, fontWeight: 600, letterSpacing: -0.4 },
  },

  // ========================================
  // HEADINGS (H1-H6) - Responsive
  // ========================================
  h1: {
    desktop: { fontSize: 48, lineHeight: 56, fontWeight: 600, letterSpacing: -0.5 },
    tablet: { fontSize: 48, lineHeight: 56, fontWeight: 600, letterSpacing: -0.5 },
    mobile: { fontSize: 48, lineHeight: 56, fontWeight: 600, letterSpacing: -0.5 },
  },

  h2: {
    desktop: { fontSize: 32, lineHeight: 40, fontWeight: 600, letterSpacing: -0.3 },
    tablet: { fontSize: 32, lineHeight: 40, fontWeight: 600, letterSpacing: -0.3 },
    mobile: { fontSize: 32, lineHeight: 40, fontWeight: 600, letterSpacing: -0.3 },
  },

  h3: {
    desktop: { fontSize: 24, lineHeight: 32, fontWeight: 600, letterSpacing: -0.2 },
    tablet: { fontSize: 24, lineHeight: 32, fontWeight: 600, letterSpacing: -0.2 },
    mobile: { fontSize: 24, lineHeight: 32, fontWeight: 600, letterSpacing: -0.2 },
  },

  h4: {
    desktop: { fontSize: 20, lineHeight: 28, fontWeight: 600, letterSpacing: -0.2 },
    tablet: { fontSize: 20, lineHeight: 28, fontWeight: 600, letterSpacing: -0.2 },
    mobile: { fontSize: 20, lineHeight: 28, fontWeight: 600, letterSpacing: -0.2 },
  },

  h5: {
    desktop: { fontSize: 16, lineHeight: 24, fontWeight: 600, letterSpacing: 0 },
    tablet: { fontSize: 18, lineHeight: 24, fontWeight: 600, letterSpacing: 0 },
    mobile: { fontSize: 18, lineHeight: 24, fontWeight: 600, letterSpacing: 0 },
  },

  h6: {
    desktop: { fontSize: 14, lineHeight: 20, fontWeight: 600, letterSpacing: 0 },
    tablet: { fontSize: 16, lineHeight: 24, fontWeight: 600, letterSpacing: 0 },
    mobile: { fontSize: 14, lineHeight: 20, fontWeight: 600, letterSpacing: 0 },
  },

  // ========================================
  // BODY STYLES - Responsive
  // ========================================
  body1: {
    desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
    tablet: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
    mobile: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
  },

  body2: {
    desktop: { fontSize: 12, lineHeight: 18, fontWeight: 400, letterSpacing: 0.17 },
    tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.17 },
    mobile: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.17 },
  },

  body3: {
    desktop: { fontSize: 12, lineHeight: 16, fontWeight: 400, letterSpacing: 0.17 },
    tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.17 },
    mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.17 },
  },

  body4: {
    desktop: { fontSize: 12, lineHeight: 16, fontWeight: 400, letterSpacing: 0.17 },
    tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.17 },
    mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.17 },
  },

  // ========================================
  // SUBTITLES - Responsive
  // ========================================
  subtitle1: {
    desktop: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
    tablet: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
    mobile: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
  },

  subtitle2: {
    desktop: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0.1 },
    tablet: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0.1 },
    mobile: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0.1 },
  },

  // ========================================
  // BUTTON TYPOGRAPHY - Responsive
  // ========================================
  button: {
    large: {
      desktop: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0 },
      tablet: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0 },
      mobile: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0 },
    },
    medium: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0 },
      mobile: { fontSize: 14, lineHeight: 14, fontWeight: 500, letterSpacing: 0 },
    },
    small: {
      desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0 },
    },
  },

  // ========================================
  // INPUT TYPOGRAPHY - Responsive
  // ========================================
  input: {
    labelSm: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 10, lineHeight: 14, fontWeight: 400, letterSpacing: 0.15 },
    },
    labelMd: {
      desktop: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
    },
    labelLg: {
      desktop: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 22, lineHeight: 32, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 24, lineHeight: 32, fontWeight: 400, letterSpacing: 0.15 },
    },
    valueSm: {
      desktop: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0.25 },
      tablet: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0.25 },
      mobile: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0.25 },
    },
    valueMd: {
      desktop: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0.25 },
      tablet: { fontSize: 18, lineHeight: 26, fontWeight: 500, letterSpacing: 0.25 },
      mobile: { fontSize: 20, lineHeight: 28, fontWeight: 500, letterSpacing: 0.25 },
    },
    valueLg: {
      desktop: { fontSize: 20, lineHeight: 28, fontWeight: 500, letterSpacing: 0.25 },
      tablet: { fontSize: 22, lineHeight: 32, fontWeight: 500, letterSpacing: 0.25 },
      mobile: { fontSize: 26, lineHeight: 36, fontWeight: 500, letterSpacing: 0.25 },
    },
    helper: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
    },
    description: {
      desktop: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
    },
  },

  // ========================================
  // CHIP TYPOGRAPHY - Responsive
  // ========================================
  chip: {
    large: {
      desktop: { fontSize: 16, lineHeight: 20, fontWeight: 500, letterSpacing: 0.16 },
      tablet: { fontSize: 16, lineHeight: 20, fontWeight: 500, letterSpacing: 0.16 },
      mobile: { fontSize: 16, lineHeight: 20, fontWeight: 500, letterSpacing: 0.16 },
    },
    medium: {
      desktop: { fontSize: 14, lineHeight: 18, fontWeight: 500, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 18, fontWeight: 500, letterSpacing: 0.16 },
      mobile: { fontSize: 14, lineHeight: 18, fontWeight: 500, letterSpacing: 0.16 },
    },
    small: {
      desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 18, fontWeight: 500, letterSpacing: 0.16 },
      mobile: { fontSize: 16, lineHeight: 20, fontWeight: 500, letterSpacing: 0.16 },
    },
  },

  // ========================================
  // AVATAR TYPOGRAPHY - Responsive
  // ========================================
  avatar: {
    initialsLg: {
      desktop: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.16 },
      tablet: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.16 },
      mobile: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.16 },
    },
    initialsMd: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      mobile: { fontSize: 18, lineHeight: 24, fontWeight: 400, letterSpacing: 0.16 },
    },
    initialsSm: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      mobile: { fontSize: 16, lineHeight: 24, fontWeight: 400, letterSpacing: 0.16 },
    },
  },

  // ========================================
  // TABLE TYPOGRAPHY - Fixed
  // ========================================
  table: {
    header: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 600, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 600, letterSpacing: 0.16 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 600, letterSpacing: 0.16 },
    },
    cell: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
    },
    footer: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.16 },
    },
  },

  // ========================================
  // ALERT TYPOGRAPHY - Fixed
  // ========================================
  alert: {
    title: {
      desktop: { fontSize: 18, lineHeight: 24, fontWeight: 600, letterSpacing: 0.15 },
      tablet: { fontSize: 18, lineHeight: 24, fontWeight: 600, letterSpacing: 0.15 },
      mobile: { fontSize: 18, lineHeight: 24, fontWeight: 600, letterSpacing: 0.15 },
    },
    description: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
    },
  },

  // ========================================
  // BOTTOM NAVIGATION - Responsive
  // ========================================
  bottomNavigation: {
    actionsLabel: {
      desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.15 },
      tablet: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.15 },
      mobile: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.15 },
    },
    defaultLabel: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0.15 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 500, letterSpacing: 0.15 },
      mobile: { fontSize: 16, lineHeight: 24, fontWeight: 500, letterSpacing: 0.15 },
    },
  },

  // ========================================
  // MENU ITEM - Responsive
  // ========================================
  menuItem: {
    default: {
      desktop: { fontSize: 24, lineHeight: 32, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 24, lineHeight: 32, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 18, lineHeight: 24, fontWeight: 400, letterSpacing: 0.15 },
    },
    dense: {
      desktop: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 20, lineHeight: 28, fontWeight: 400, letterSpacing: 0.15 },
    },
  },

  // ========================================
  // BADGE TYPOGRAPHY - Fixed
  // ========================================
  badge: {
    default: {
      desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
      tablet: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
      mobile: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
    },
  },

  // ========================================
  // TOOLTIP TYPOGRAPHY - Fixed
  // ========================================
  tooltip: {
    default: {
      desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
      tablet: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
      mobile: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
    },
  },

  // ========================================
  // DIALOG TYPOGRAPHY - Fixed
  // ========================================
  dialog: {
    title: {
      desktop: { fontSize: 20, lineHeight: 28, fontWeight: 600, letterSpacing: 0.15 },
      tablet: { fontSize: 20, lineHeight: 28, fontWeight: 600, letterSpacing: 0.15 },
      mobile: { fontSize: 20, lineHeight: 28, fontWeight: 600, letterSpacing: 0.15 },
    },
    content: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
    },
  },

  // ========================================
  // SLIDER TYPOGRAPHY - Fixed
  // ========================================
  slider: {
    valueLabel: {
      desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
      tablet: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
      mobile: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.14 },
    },
  },

  // ========================================
  // RATING TYPOGRAPHY - Fixed
  // ========================================
  rating: {
    icon: {
      desktop: { fontSize: 24, lineHeight: 24, fontWeight: 400, letterSpacing: 0 },
      tablet: { fontSize: 24, lineHeight: 24, fontWeight: 400, letterSpacing: 0 },
      mobile: { fontSize: 24, lineHeight: 24, fontWeight: 400, letterSpacing: 0 },
    },
  },

  // ========================================
  // STEPPER TYPOGRAPHY - Fixed
  // ========================================
  stepper: {
    label: {
      desktop: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      tablet: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
      mobile: { fontSize: 14, lineHeight: 20, fontWeight: 400, letterSpacing: 0.15 },
    },
  },

  // ========================================
  // LEGACY STYLES (for backward compatibility)
  // ========================================
  caption: {
    desktop: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.4 },
    tablet: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.4 },
    mobile: { fontSize: 12, lineHeight: 16, fontWeight: 500, letterSpacing: 0.4 },
  },

  overline: {
    desktop: { fontSize: 12, lineHeight: 32, fontWeight: 400, letterSpacing: 1 },
    tablet: { fontSize: 12, lineHeight: 32, fontWeight: 400, letterSpacing: 1 },
    mobile: { fontSize: 12, lineHeight: 32, fontWeight: 400, letterSpacing: 1 },
  },
} as const;

/**
 * Sizing Tokens - FULLY RESPONSIVE
 * Component sizes and dimensions with device-specific values
 */
export const sizingTokens = {
  // Touch Targets (WCAG AA)
  touchTarget: {
    min: 48, // Minimum touch target size in px
  },

  // ========================================
  // ICON SIZES - Fixed
  // ========================================
  icon: {
    inherit: 16,
    small: 20,
    medium: 24,
    large: 32,
  },

  // ========================================
  // BUTTON SIZES - Responsive
  // ========================================
  button: {
    small: { desktop: 28, tablet: 32, mobile: 32 },
    medium: { desktop: 32, tablet: 36, mobile: 36 },
    large: { desktop: 40, tablet: 44, mobile: 44 },
  },

  // ========================================
  // FLOATING ACTION BUTTON - Fixed
  // ========================================
  fab: {
    small: 32,
    medium: 40,
    large: 50,
  },

  // ========================================
  // INPUT SIZES - Responsive
  // ========================================
  input: {
    small: { desktop: 28, tablet: 32, mobile: 32 },
    medium: { desktop: 32, tablet: 36, mobile: 40 },
    large: { desktop: 40, tablet: 44, mobile: 48 },
  },

  // ========================================
  // TABLE SIZES - Responsive
  // ========================================
  table: {
    header: { desktop: 50, tablet: 56, mobile: 64 },
    cell: { desktop: 50, tablet: 56, mobile: 64 },
  },

  // ========================================
  // CHIP SIZES - Responsive
  // ========================================
  chip: {
    small: { desktop: 28, tablet: 32, mobile: 32 },
    medium: { desktop: 32, tablet: 36, mobile: 36 },
    large: { desktop: 40, tablet: 44, mobile: 44 },
  },

  // ========================================
  // CHIP IN FIELDS - Responsive
  // ========================================
  chipInField: {
    small: { desktop: 24, tablet: 28, mobile: 28 },
    medium: { desktop: 28, tablet: 32, mobile: 32 },
    large: { desktop: 32, tablet: 36, mobile: 36 },
  },

  // ========================================
  // AVATAR SIZES - Fixed (from previous implementation)
  // ========================================
  avatar: {
    small: 24,
    medium: 40,
    large: 56,
  },

  // ========================================
  // APP BAR HEIGHT - Responsive
  // ========================================
  appBar: {
    mobile: 56,
    desktop: 64,
  },

  // ========================================
  // DRAWER WIDTH - Fixed
  // ========================================
  drawer: {
    standard: 240,
    wide: 320,
  },

  // ========================================
  // FOCUS RING - CDS accessibility standard
  // ========================================
  focusRing: {
    width: 3,          // 3px ring for buttons, inputs, interactive elements
    sliderSpread: 8,   // 8px spread for slider thumb
    outlineOffset: {
      default: 0,      // 0px — inputs, buttons (ring hugs the element)
      link: 2,         // 2px — links (ring offset from text)
    },
  },

  // ========================================
  // BORDER - CDS standard
  // ========================================
  border: {
    thin: 1,           // 1px — standard border width (inputs, cards, dividers)
  },

  // ========================================
  // BUTTON PADDING - CDS internal padding
  // ========================================
  buttonPadding: {
    small: { vertical: 6, horizontal: 16 },
    medium: { vertical: 8, horizontal: 22 },
    large: { vertical: 11, horizontal: 26 },
  },

  // ========================================
  // PROGRESS - CDS sizing
  // ========================================
  progress: {
    circularThickness: 3.6,
  },
} as const;

/**
 * Elevation Tokens
 * Box shadow values for depth/elevation
 */
export const elevationTokens = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
] as const;

/**
 * Named Elevation Tokens
 * Semantic elevation levels for components (indexes into elevationTokens array)
 */
export const componentElevationTokens = {
  none: 0,             // Flat — accordion, inline elements
  card: 1,             // Subtle lift — cards
  appBar: 4,           // Medium lift — app bars, toolbars
  bottomNavigation: 8, // High lift — bottom navigation, floating elements
} as const;

/**
 * Z-Index Tokens
 * Stacking order for layered components
 */
export const zIndexTokens = {
  mobileStepper: 1000,
  fab: 1050,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
} as const;

/**
 * Border Radius Tokens
 * Corner radius values
 */
export const borderRadiusTokens = {
  none: 0,
  extraSmall: 2,   // 2px - chips, text skeletons
  small: 4,        // 4px - DEFAULT - buttons, inputs, cards
  medium: 8,       // 8px - rounded containers
  large: 12,       // 12px - prominent cards
  circular: '50%', // Circular - avatars, FABs
} as const;

/**
 * Transition Tokens
 * Animation duration and easing
 */
export const transitionTokens = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },

  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

/**
 * Component Default Prop Tokens
 * CDS standard prop values for MUI components
 */
export const componentDefaultsTokens = {
  textField: { variant: 'outlined' as const },
  select: { variant: 'outlined' as const },
  link: { underline: 'hover' as const },
  skeleton: { animation: 'wave' as const },
  container: { maxWidth: 'lg' as const },
  snackbar: {
    anchorOrigin: { vertical: 'bottom' as const, horizontal: 'center' as const },
  },
  accordion: { disableGutters: true as const },
} as const;

/**
 * Helper function to get responsive value based on breakpoint
 */
export const getResponsiveValue = <T,>(
  responsive: ResponsiveValue<T>,
  breakpoint: 'desktop' | 'tablet' | 'mobile'
): T => {
  return responsive[breakpoint];
};
