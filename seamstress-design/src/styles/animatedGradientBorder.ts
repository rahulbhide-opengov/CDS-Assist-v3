import type { SxProps, Theme } from '@mui/material';

/**
 * Creates an animated gradient border effect
 * Similar to AI chat input border animation
 */
export const animatedGradientBorder = (
  options?: {
    borderWidth?: number;
    borderRadius?: string;
    animationDuration?: number;
    colors?: string[];
  }
): SxProps<Theme> => {
  const {
    borderWidth = 3,
    borderRadius = '4px',
    animationDuration = 4,
    colors = ['#4b3fff', '#0288d1', '#2e7d32', '#e91e63', '#ed6c02', '#4b3fff'],
  } = options || {};

  return {
    position: 'relative',
    borderRadius: borderRadius,
    overflow: 'hidden',
    padding: 0,
    // Create animated border with pseudo-element
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '200%',
      height: '200%',
      background: `conic-gradient(${colors.join(', ')})`,
      animation: `spin-border ${animationDuration}s linear infinite`,
      transformOrigin: 'center',
      transform: 'translate(-50%, -50%)',
      zIndex: 0,
    },
    '@keyframes spin-border': {
      '0%': {
        transform: 'translate(-50%, -50%) rotate(0deg)',
      },
      '100%': {
        transform: 'translate(-50%, -50%) rotate(360deg)',
      },
    },
    // Inner content with padding to create border effect
    '& > .MuiCard-root': {
      position: 'relative',
      margin: `${borderWidth}px`,
      borderRadius: borderRadius,
      bgcolor: 'background.paper',
      border: 'none',
      boxShadow: 'none',
      zIndex: 1,
    },
  };
};

/**
 * Preset for cards with animated gradient border
 */
export const animatedGradientCard = animatedGradientBorder({
  borderWidth: 3,
  borderRadius: '4px',
  animationDuration: 4,
  colors: ['#4b3fff', '#0288d1', '#2e7d32', '#e91e63', '#ed6c02', '#4b3fff'],
});

/**
 * Preset for buttons with animated gradient border
 */
export const animatedGradientButton = animatedGradientBorder({
  borderWidth: 2,
  borderRadius: '4px',
  animationDuration: 3,
});

/**
 * Preset for focus/attention state
 */
export const animatedGradientFocus = animatedGradientBorder({
  borderWidth: 3,
  borderRadius: '4px',
  animationDuration: 2,
  colors: ['#2e7d32', '#0288d1', '#4b3fff', '#e91e63', '#ed6c02', '#2e7d32'],
});