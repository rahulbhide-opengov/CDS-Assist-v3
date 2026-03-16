/**
 * CDS-Assist typography tokens.
 * Font: DM Sans. Headings 600, buttons 500, body 400.
 */

/** CDS typography configuration. */
export const cdsTypography = {
  fontFamily: '"DM Sans", sans-serif',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  headings: {
    h1: { fontSize: 48, fontWeight: 600 },
    h2: { fontSize: 32, fontWeight: 600 },
    h3: { fontSize: 24, fontWeight: 600 },
    h4: { fontSize: 20, fontWeight: 600 },
    h5: { fontSize: 16, fontWeight: 600 },
    h6: { fontSize: 14, fontWeight: 600 },
  },
  body: {
    body1: { fontSize: 14, fontWeight: 400 },
    body2: { fontSize: 12, fontWeight: 400 },
  },
  button: {
    small: { fontSize: 12, fontWeight: 500 },
    medium: { fontSize: 14, fontWeight: 500 },
    large: { fontSize: 16, fontWeight: 500 },
  },
  caption: { fontSize: 12, fontWeight: 500 },
  overline: { fontSize: 12, fontWeight: 400, textTransform: 'uppercase' as const },
  subtitle: {
    subtitle1: { fontSize: 16, fontWeight: 400 },
    subtitle2: { fontSize: 14, fontWeight: 500 },
  },
} as const;
