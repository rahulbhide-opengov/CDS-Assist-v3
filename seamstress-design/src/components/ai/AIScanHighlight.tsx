/* eslint-disable react-refresh/only-export-components */
/**
 * AIScanHighlight Component
 *
 * Reusable AI scan animation component with state-based transitions.
 * States: idle -> in -> loop -> out -> idle
 *
 * Features:
 * - Sweep gradient animation
 * - SVG stroke-dash outline animation
 * - Box shadow glow effect
 * - Configurable timing
 */

import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';

// =============================================================================
// TYPES
// =============================================================================

export type AnimationState = 'idle' | 'in' | 'loop' | 'out';

export interface ScanConfig {
  sweepIn: number;      // seconds - sweep animation in
  sweepOut: number;     // seconds - sweep animation out
  outlineIn: number;    // seconds - outline/glow fade in
  outlineOut: number;   // seconds - outline/glow fade out
}

export interface AIScanHighlightProps {
  state: AnimationState;
  config?: ScanConfig;
  children: React.ReactNode;
  /** Optional custom color (defaults to primary.main) */
  color?: string;
  /** Whether to take full width (default: false for inline-block) */
  fullWidth?: boolean;
  /** Loop animation duration in seconds (default: 1.5) */
  loopDuration?: number;
}

// =============================================================================
// DEFAULT CONFIG
// =============================================================================

export const DEFAULT_SCAN_CONFIG: ScanConfig = {
  sweepIn: 1,
  sweepOut: 1,
  outlineIn: 1,
  outlineOut: 1,
};

// =============================================================================
// BEACON CONFIG
// =============================================================================

/**
 * Beacon Mode Configuration
 *
 * Use beacon mode when you want to draw user attention to an element.
 * This runs a continuous highlight animation cycle designed to be
 * noticeable but not intrusive.
 *
 * Timing:
 * - Animate in: 1.1s
 * - Loop (sweep): 3s
 * - Animate out: 1.1s
 * - Pause between cycles: 5s
 * - Total cycle: ~10.2s
 */
export const BEACON_CONFIG: ScanConfig = {
  sweepIn: 1.1,
  sweepOut: 1.1,
  outlineIn: 1.1,
  outlineOut: 1.1,
};

/** Default beacon loop duration in seconds */
export const BEACON_LOOP_DURATION = 3;

/** Default pause between beacon cycles in seconds */
export const BEACON_PAUSE_DURATION = 5;

// =============================================================================
// COMPONENT
// =============================================================================

export const AIScanHighlight: React.FC<AIScanHighlightProps> = ({
  state,
  config = DEFAULT_SCAN_CONFIG,
  children,
  color,
  fullWidth = false,
  loopDuration = 1.5,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const isActive = state !== 'idle';

  // Measure the container dimensions
  useEffect(() => {
    if (containerRef.current) {
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
    }
  }, [children]);

  // Calculate perimeter for stroke-dasharray (accounting for border-radius)
  const borderRadius = 4; // matches borderRadius: 1 in MUI (8px * 0.5)
  const offset = 4; // offset from content (like outlineOffset)
  const svgWidth = dimensions.width + offset * 2;
  const svgHeight = dimensions.height + offset * 2;
  const perimeter = 2 * (svgWidth + svgHeight) - 8 * borderRadius + 2 * Math.PI * borderRadius;

  // Determine the target stroke-dashoffset based on state
  const getStrokeDashoffset = () => {
    if (state === 'idle') return perimeter;
    if (state === 'in' || state === 'loop') return 0;
    if (state === 'out') return perimeter;
    return perimeter;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        zIndex: 10,
        display: fullWidth ? 'block' : 'inline-block',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {/* Inner container for content and sweep effect */}
      <Box
        ref={containerRef}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 1,
          boxShadow: isActive
            ? (theme) => `0 0 12px 2px ${color || theme.palette.primary.main}40`
            : 'none',
          transition: state === 'out'
            ? `box-shadow ${config.outlineOut}s ease-out`
            : `box-shadow ${config.outlineIn}s ease-out`,

          // Keyframes for sweep
          '@keyframes sweepIn': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 1 },
          },
          '@keyframes sweepLoop': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 1 },
          },
          '@keyframes sweepOut': {
            '0%': { transform: 'translateX(-100%)', opacity: 1 },
            '100%': { transform: 'translateX(100%)', opacity: 0 },
          },

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              `linear-gradient(90deg, transparent 0%, ${color || theme.palette.primary.main}30 50%, transparent 100%)`,
            opacity: isActive ? 1 : 0,
            pointerEvents: 'none',
            zIndex: 1,
            animation: state === 'in'
              ? `sweepIn ${config.sweepIn}s ease-out forwards`
              : state === 'loop'
              ? `sweepLoop ${loopDuration}s ease-in-out infinite`
              : state === 'out'
              ? `sweepOut ${config.sweepOut}s ease-out forwards`
              : 'none',
          },
        }}
      >
        {children}
      </Box>

      {/* SVG outline that draws in/out - positioned outside overflow:hidden container */}
      {dimensions.width > 0 && (
        <Box
          component="svg"
          sx={{
            position: 'absolute',
            top: -offset,
            left: -offset,
            width: svgWidth,
            height: svgHeight,
            pointerEvents: 'none',
            zIndex: 2,
            overflow: 'visible',
          }}
        >
          <Box
            component="rect"
            x={1}
            y={1}
            width={svgWidth - 2}
            height={svgHeight - 2}
            rx={borderRadius}
            ry={borderRadius}
            sx={{
              fill: 'none',
              stroke: (theme) => color || theme.palette.primary.main,
              strokeWidth: 2,
              strokeDasharray: perimeter,
              strokeDashoffset: getStrokeDashoffset(),
              transition: state === 'out'
                ? `stroke-dashoffset ${config.outlineOut}s ease-out`
                : state === 'in'
                ? `stroke-dashoffset ${config.outlineIn}s ease-out`
                : 'none',
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default AIScanHighlight;
