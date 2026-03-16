/**
 * CDS-Assist transition tokens.
 * Includes duration, easing, and reduced-motion support.
 */

/** CDS transition durations (ms). */
export const cdsTransitions = {
  durations: {
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
  /**
   * Returns duration respecting prefers-reduced-motion.
   * When reduced motion is preferred, returns 0.
   */
  getDuration: (durationMs: number): number => {
    if (typeof window === 'undefined') return durationMs;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReduced ? 0 : durationMs;
  },
  /**
   * Returns true if user prefers reduced motion.
   */
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
} as const;
