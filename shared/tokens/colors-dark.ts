/**
 * CDS-Assist dark mode color overrides.
 * Extends or overrides cdsColors for dark theme.
 */

/** CDS color overrides for dark mode. */
export const cdsDarkColors = {
  background: {
    default: '#121212',
    paper: '#1e1e1e',
    tertiary: '#2c2c2c',
  },
  text: {
    primary: 'rgba(255,255,255,0.87)',
    secondary: 'rgba(255,255,255,0.6)',
    disabled: 'rgba(255,255,255,0.38)',
  },
  divider: 'rgba(255,255,255,0.12)',
  nav: {
    background: '#1e1e1e',
    itemHover: 'rgba(255,255,255,0.08)',
    itemActive: 'rgba(75,63,255,0.16)',
    itemText: 'rgba(255,255,255,0.87)',
    itemTextActive: '#a098ff',
  },
} as const;
