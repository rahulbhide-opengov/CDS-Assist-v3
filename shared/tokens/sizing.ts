/**
 * CDS-Assist sizing tokens.
 * Responsive sizes for desktop (1440), tablet (768), mobile (390).
 */

import type { ResponsiveValue } from '../types';

/** CDS component sizing tokens. */
export const cdsSizing = {
  button: {
    small: { desktop: 28, tablet: 32, mobile: 32 } as ResponsiveValue<number>,
    medium: { desktop: 32, tablet: 36, mobile: 36 } as ResponsiveValue<number>,
    large: { desktop: 40, tablet: 44, mobile: 44 } as ResponsiveValue<number>,
  },
  input: {
    small: { desktop: 28, tablet: 32, mobile: 32 } as ResponsiveValue<number>,
    medium: { desktop: 32, tablet: 36, mobile: 40 } as ResponsiveValue<number>,
    large: { desktop: 40, tablet: 44, mobile: 48 } as ResponsiveValue<number>,
  },
  chip: {
    small: { desktop: 28, tablet: 32, mobile: 32 } as ResponsiveValue<number>,
    medium: { desktop: 32, tablet: 36, mobile: 36 } as ResponsiveValue<number>,
    large: { desktop: 40, tablet: 44, mobile: 44 } as ResponsiveValue<number>,
  },
  table: {
    header: { desktop: 50, tablet: 56, mobile: 64 } as ResponsiveValue<number>,
    cell: { desktop: 50, tablet: 56, mobile: 64 } as ResponsiveValue<number>,
  },
  appBar: {
    desktop: 64,
    tablet: 56,
    mobile: 56,
  },
  avatar: {
    small: 24,
    medium: 40,
    large: 56,
  },
  icon: {
    small: 20,
    medium: 24,
    large: 32,
  },
  drawer: {
    standard: 240,
    wide: 320,
    slim: 64,
  },
  nav: {
    width: 240,
    itemHeight: 48,
    iconSize: 24,
    iconSpacing: 16,
  },
} as const;
