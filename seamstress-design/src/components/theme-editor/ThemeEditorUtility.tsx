/**
 * Theme Editor Utility Component
 *
 * Wrapper component for integrating theme editor into utility tray
 */

import React, { useState } from 'react';
import { ThemeEditorDrawer } from './ThemeEditorDrawer';

export function ThemeEditorUtility() {
  const [open, setOpen] = useState(false);

  // Expose the open function globally so the utility tray can trigger it
  React.useEffect(() => {
    (window as any).openThemeEditor = () => setOpen(true);
    return () => {
      delete (window as any).openThemeEditor;
    };
  }, []);

  return (
    <ThemeEditorDrawer
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
