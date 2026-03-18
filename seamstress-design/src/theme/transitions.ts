/**
 * Seamstress Transition Configuration
 *
 * Centralized transition settings for consistent animations across
 * modals, drawers, dialogs, and page transitions.
 *
 * Based on Material Design motion principles and MUI standards.
 */

// Standard MUI durations (in milliseconds)
export const durations = {
  shortest: 150,
  shorter: 200,
  short: 250,
  standard: 300,
  complex: 375,
  enteringScreen: 225,
  leavingScreen: 195,
} as const;

// Standard MUI easing functions
export const easing = {
  // Most common - smooth acceleration/deceleration
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Entering - decelerating
  easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
  // Exiting - accelerating
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  // Temporary elements (drawers, tooltips)
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
} as const;

// Component-specific transition configurations
export const components = {
  modal: {
    content: {
      timeout: durations.standard,
    },
    backdrop: {
      timeout: 500, // Backdrop fades slower to ensure content completes first
    },
  },
  drawer: {
    timeout: durations.shorter, // 200ms horizontal slide
  },
  dialog: {
    timeout: durations.shorter,
  },
  page: {
    timeout: durations.short,
  },
} as const;

// Utility to check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Helper to get duration with reduced motion support
export const getDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration;
};

// Export everything as a single object for convenience
export const transitions = {
  durations,
  easing,
  components,
  prefersReducedMotion,
  getDuration,
} as const;

export default transitions;
