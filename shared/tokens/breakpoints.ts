/**
 * CDS-Assist breakpoint tokens.
 * Desktop 1440, Tablet 768, Mobile 390.
 */

/** CDS breakpoint definitions. */
export const cdsBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
  figma: {
    mobile: 390,
    tablet: 768,
    desktop: 1440,
  },
} as const;
