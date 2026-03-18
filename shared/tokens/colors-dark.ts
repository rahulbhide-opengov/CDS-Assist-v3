/**
 * CDS-Assist dark mode color overrides.
 * Extends or overrides cdsColors for dark theme.
 * Use theme tokens only — no hardcoded colors in components.
 */

/** Complete dark mode palette for MUI theme. */
export const darkPalette = {
  primary: { main: '#6956ff', light: '#9b8dff', dark: '#3a2db3' },
  secondary: { main: '#90a4ae', light: '#c1d5e0', dark: '#62757f' },
  error: { main: '#f44336', light: '#e57373', dark: '#d32f2f' },
  warning: { main: '#ffa726', light: '#ffb74d', dark: '#f57c00' },
  info: { main: '#29b6f6', light: '#4fc3f7', dark: '#0288d1' },
  success: { main: '#66bb6a', light: '#81c784', dark: '#388e3c' },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
    secondary: '#2a2a2a',
  },
  text: {
    primary: '#f5f5f5',
    secondary: '#b0bec5',
    disabled: '#616161',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
  action: {
    active: 'rgba(255, 255, 255, 0.56)',
    hover: 'rgba(255, 255, 255, 0.08)',
    selected: 'rgba(255, 255, 255, 0.16)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    disabledBackground: 'rgba(255, 255, 255, 0.12)',
  },
} as const;

/** @deprecated Use darkPalette. CDS color overrides for dark mode (legacy). */
export const cdsDarkColors = {
  background: darkPalette.background,
  text: darkPalette.text,
  divider: darkPalette.divider,
  nav: {
    background: darkPalette.background.paper,
    itemHover: darkPalette.action.hover,
    itemActive: 'rgba(105, 86, 255, 0.16)',
    itemText: darkPalette.text.primary,
    itemTextActive: darkPalette.primary.light,
  },
} as const;
