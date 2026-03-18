/**
 * useScrollDirection Hook
 *
 * Tracks scroll direction to enable scroll-based navigation visibility.
 * Shows global nav when scrolling up, hides when scrolling down.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ScrollDirection } from './types';

interface UseScrollDirectionOptions {
  /** Minimum scroll distance before triggering direction change (default: 10px) */
  threshold?: number;
  /** Debounce delay in ms (default: 50ms) */
  debounceMs?: number;
  /** Whether scroll tracking is enabled (default: true) */
  enabled?: boolean;
}

interface UseScrollDirectionReturn {
  /** Current scroll direction: 'up', 'down', or null (at top/not scrolled) */
  scrollDirection: ScrollDirection;
  /** Whether user is at the top of the page */
  isAtTop: boolean;
  /** Current scroll position */
  scrollY: number;
}

/**
 * Hook to track scroll direction with threshold and debouncing
 */
export function useScrollDirection(
  options: UseScrollDirectionOptions = {}
): UseScrollDirectionReturn {
  const { threshold = 10, debounceMs = 50, enabled = true } = options;

  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const updateScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Update scroll position
    setScrollY(currentScrollY);

    // Check if at top
    const atTop = currentScrollY < threshold;
    setIsAtTop(atTop);

    // If at top, reset direction
    if (atTop) {
      setScrollDirection(null);
      lastScrollY.current = currentScrollY;
      ticking.current = false;
      return;
    }

    // Calculate scroll delta
    const delta = currentScrollY - lastScrollY.current;

    // Only update direction if scroll exceeds threshold
    if (Math.abs(delta) >= threshold) {
      const newDirection: ScrollDirection = delta > 0 ? 'down' : 'up';
      setScrollDirection(newDirection);
      lastScrollY.current = currentScrollY;
    }

    ticking.current = false;
  }, [threshold]);

  const handleScroll = useCallback(() => {
    if (!enabled) return;

    // Clear any pending debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the scroll handler
    timeoutRef.current = setTimeout(() => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScrollDirection);
      }
    }, debounceMs);
  }, [enabled, debounceMs, updateScrollDirection]);

  useEffect(() => {
    if (!enabled) {
      setScrollDirection(null);
      setIsAtTop(true);
      return;
    }

    // Set initial state
    lastScrollY.current = window.scrollY;
    setScrollY(window.scrollY);
    setIsAtTop(window.scrollY < threshold);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, handleScroll, threshold]);

  return {
    scrollDirection,
    isAtTop,
    scrollY,
  };
}

export default useScrollDirection;
