/**
 * CDS-Assist spacing tokens.
 * 4px base grid system.
 */

/** CDS spacing scale (4px base). */
export const cdsSpacing = {
  base: 4,
  values: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    3: 12,
    4: 16,
    4.5: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
  },
  responsive: {
    10: 40,
    12: 48,
    16: 64,
    18: 72,
    20: 80,
    22: 88,
    24: 96,
  },
} as const;
