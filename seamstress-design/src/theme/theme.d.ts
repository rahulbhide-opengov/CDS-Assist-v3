/**
 * Module augmentation for MUI theme
 * Extends the default MUI theme types with Seamstress-specific properties
 */

import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypeBackground {
    secondary?: string;
  }
}
