/**
 * Unified Navigation Animation Configuration
 *
 * Framer-motion animation variants for the unified navigation system.
 * Uses timing from /src/theme/transitions.ts for consistency.
 */

import type { Variants, Transition } from 'framer-motion';
import { durations, easing } from '../../theme/transitions';

/**
 * Easing curves as number arrays for framer-motion
 * These correspond to the cubic-bezier values in transitions.ts
 */
export const easingArrays = {
  // easeInOut: cubic-bezier(0.4, 0, 0.2, 1)
  easeInOut: [0.4, 0, 0.2, 1] as const,
  // easeOut: cubic-bezier(0.0, 0, 0.2, 1) - entering/decelerating
  easeOut: [0, 0, 0.2, 1] as const,
  // easeIn: cubic-bezier(0.4, 0, 1, 1) - exiting/accelerating
  easeIn: [0.4, 0, 1, 1] as const,
} as const;

/**
 * Global nav section animation variants
 *
 * Animates:
 * - Height: 48px <-> 0
 * - Opacity: 1 <-> 0
 * - Y position: 0 <-> -10px (slight upward movement when hiding)
 */
export const globalNavVariants: Variants = {
  visible: {
    height: 'auto',
    opacity: 1,
    y: 0,
  },
  hidden: {
    height: 0,
    opacity: 0,
    y: -10,
  },
};

/**
 * Transition for showing global nav (entering)
 */
export const globalNavShowTransition: Transition = {
  duration: durations.standard / 1000, // 300ms -> 0.3s
  ease: easingArrays.easeOut,
};

/**
 * Transition for hiding global nav (exiting)
 */
export const globalNavHideTransition: Transition = {
  duration: durations.shorter / 1000, // 200ms -> 0.2s
  ease: easingArrays.easeIn,
};

/**
 * Reduced motion variants - instant transitions
 */
export const globalNavReducedMotionVariants: Variants = {
  visible: {
    height: 'auto',
    opacity: 1,
    y: 0,
  },
  hidden: {
    height: 0,
    opacity: 0,
    y: 0,
  },
};

/**
 * Instant transition for reduced motion
 */
export const instantTransition: Transition = {
  duration: 0,
};

/**
 * Get appropriate variants based on reduced motion preference
 */
export const getGlobalNavVariants = (prefersReducedMotion: boolean): Variants => {
  return prefersReducedMotion ? globalNavReducedMotionVariants : globalNavVariants;
};

/**
 * Get appropriate transition based on state and reduced motion preference
 */
export const getGlobalNavTransition = (
  isVisible: boolean,
  prefersReducedMotion: boolean
): Transition => {
  if (prefersReducedMotion) {
    return instantTransition;
  }
  return isVisible ? globalNavShowTransition : globalNavHideTransition;
};
