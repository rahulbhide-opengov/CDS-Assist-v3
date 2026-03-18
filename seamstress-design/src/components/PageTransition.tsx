import React, { ReactNode } from 'react';
import { Fade, Slide, Zoom, Grow, Box } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import { transitions } from '../theme';

export type TransitionType = 'fade' | 'slide' | 'zoom' | 'grow' | 'none';

export interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  timeout?: number;
  in?: boolean;
}

/**
 * PageTransition - Wrapper component for page-level transitions
 *
 * Usage:
 * ```tsx
 * <PageTransition type="fade">
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  timeout = transitions.components.page.timeout,
  in: inProp = true,
}) => {
  // Respect user's motion preferences
  const duration = transitions.getDuration(timeout);

  // No transition wrapper
  if (type === 'none' || duration === 0) {
    return <Box sx={{ width: '100%' }}>{children}</Box>;
  }

  const transitionProps: Partial<TransitionProps> = {
    in: inProp,
    timeout: duration,
  };

  const boxStyle = { width: '100%' };

  // Render appropriate transition component
  switch (type) {
    case 'slide':
      return (
        <Slide direction="up" {...transitionProps}>
          <Box sx={boxStyle}>{children}</Box>
        </Slide>
      );
    case 'zoom':
      return (
        <Zoom {...transitionProps}>
          <Box sx={boxStyle}>{children}</Box>
        </Zoom>
      );
    case 'grow':
      return (
        <Grow {...transitionProps}>
          <Box sx={boxStyle}>{children}</Box>
        </Grow>
      );
    case 'fade':
    default:
      return (
        <Fade {...transitionProps}>
          <Box sx={boxStyle}>{children}</Box>
        </Fade>
      );
  }
};

export default PageTransition;
