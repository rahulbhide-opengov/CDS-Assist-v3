/**
 * useDocumentTitle - Hook for managing document title in SPA
 *
 * Updates the browser's document.title when the component mounts or when
 * the title parameter changes. Useful for accessibility and SPA navigation
 * where page titles don't automatically update on route change.
 *
 * @param title - The page title to set
 * @param options - Configuration options
 *
 * @example
 * ```tsx
 * function MyPage() {
 *   useDocumentTitle('Settings');
 *   // Document title becomes "Settings | Seamstress"
 *   return <div>Settings Content</div>;
 * }
 * ```
 */

import { useEffect, useRef } from 'react';

export interface UseDocumentTitleOptions {
  /** App name suffix (default: "Seamstress") */
  appName?: string;
  /** Whether to restore previous title on unmount */
  restoreOnUnmount?: boolean;
}

export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {}
): void {
  const { appName = 'Seamstress', restoreOnUnmount = false } = options;
  const previousTitle = useRef<string | null>(null);

  useEffect(() => {
    // Store previous title if we need to restore it later
    if (restoreOnUnmount && previousTitle.current === null) {
      previousTitle.current = document.title;
    }

    // Set the new title with app name suffix
    document.title = title ? `${title} | ${appName}` : appName;

    // Cleanup: restore previous title if configured
    return () => {
      if (restoreOnUnmount && previousTitle.current) {
        document.title = previousTitle.current;
      }
    };
  }, [title, appName, restoreOnUnmount]);
}

export default useDocumentTitle;
