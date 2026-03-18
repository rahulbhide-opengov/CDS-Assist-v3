/**
 * NavigationRenderedContext
 *
 * A context that tracks whether the persistent navigation has been rendered.
 * This allows BaseLayout to skip rendering its own navigation when
 * PersistentNavigation is handling it at the App level.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface NavigationRenderedContextValue {
  isNavigationRendered: boolean;
  setNavigationRendered: (rendered: boolean) => void;
}

const NavigationRenderedContext = createContext<NavigationRenderedContextValue>({
  isNavigationRendered: false,
  setNavigationRendered: () => {},
});

export function NavigationRenderedProvider({ children }: { children: React.ReactNode }) {
  const [isNavigationRendered, setIsRendered] = useState(false);

  const setNavigationRendered = useCallback((rendered: boolean) => {
    setIsRendered(rendered);
  }, []);

  const value = useMemo(
    () => ({
      isNavigationRendered,
      setNavigationRendered,
    }),
    [isNavigationRendered, setNavigationRendered]
  );

  return (
    <NavigationRenderedContext.Provider value={value}>
      {children}
    </NavigationRenderedContext.Provider>
  );
}

export function useNavigationRendered() {
  return useContext(NavigationRenderedContext);
}
