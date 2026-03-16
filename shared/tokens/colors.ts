/**
 * CDS-Assist color tokens.
 * Primary: Blurple #4b3fff (700), scale 50-900.
 * Secondary: Slate #546574 (700), scale 50-900.
 */

/** CDS color palette for light mode. */
export const cdsColors = {
  primary: {
    50: '#f5f3ff',
    100: '#eef1fc',
    200: '#d6d4ff',
    400: '#a098ff',
    700: '#4b3fff',
    900: '#19009b',
    main: '#4b3fff',
    light: '#eef1fc',
    dark: '#19009b',
    contrastText: '#ffffff',
  },
  secondary: {
    50: '#f8f9fa',
    100: '#e9ecef',
    200: '#cbd2d9',
    400: '#8e9ba8',
    700: '#546574',
    900: '#2d3748',
    main: '#546574',
    light: '#e9ecef',
    dark: '#2d3748',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#b71c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  text: {
    primary: 'rgba(0,0,0,0.87)',
    secondary: 'rgba(0,0,0,0.6)',
    disabled: 'rgba(0,0,0,0.38)',
    hint: 'rgba(0,0,0,0.26)',
  },
  background: {
    default: '#fafafa',
    paper: '#ffffff',
    tertiary: '#f2f2f2',
  },
  grey: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  divider: 'rgba(0,0,0,0.12)',
  nav: {
    background: '#ffffff',
    itemHover: 'rgba(0,0,0,0.04)',
    itemActive: 'rgba(75,63,255,0.08)',
    itemText: 'rgba(0,0,0,0.87)',
    itemTextActive: '#4b3fff',
  },
} as const;
