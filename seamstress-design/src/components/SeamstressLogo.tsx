import React from 'react';
import { Box, useTheme } from '@mui/material';
import { cdsColors } from '../theme/cds';

interface SeamstressLogoProps {
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
  onClick?: () => void;
  animated?: boolean;
}

export const SeamstressLogo: React.FC<SeamstressLogoProps> = ({
  size = 48,
  variant = 'auto',
  onClick,
  animated = true,
}) => {
  const theme = useTheme();

  // Determine colors based on variant and theme
  const isDarkMode = theme.palette.mode === 'dark';
  const shouldUseDarkVariant =
    variant === 'dark' || (variant === 'auto' && isDarkMode);

  // Color scheme adapts to theme (CDS tokens)
  const bgColor = shouldUseDarkVariant
    ? theme.palette.background.paper
    : cdsColors.gray900;
  const strokeColor = shouldUseDarkVariant
    ? theme.palette.primary.main
    : cdsColors.white;
  const dashStrokeColor = shouldUseDarkVariant
    ? theme.palette.primary.light
    : cdsColors.white;

  // Original aspect ratio: 232.4 / 240.95 ≈ 0.964
  const aspectRatio = 232.4 / 240.95;
  const width = size * aspectRatio;
  const height = size;

  return (
    <Box
      onClick={onClick}
      sx={{
        width,
        height,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': onClick ? {
          transform: 'scale(1.05)',
        } : {},
      }}
    >
      <svg
        id="seamstress-logo"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 232.4 240.95"
        width={width}
        height={height}
      >
        <defs>
          <style>
            {`
              .seamstress-bg {
                fill: ${bgColor};
                transition: fill 0.3s ease;
              }

              .seamstress-stroke {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                ${animated ? 'animation: stitch-glow 4s ease-in-out infinite;' : ''}
              }

              .seamstress-dash {
                fill: none;
                stroke: ${dashStrokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 2;
                ${animated ? 'animation: dash-weave 6s ease-in-out infinite;' : ''}
              }

              .seamstress-vertical-left {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                ${animated ? 'animation: stitch-glow 4s ease-in-out infinite 0.5s;' : ''}
              }

              .seamstress-vertical-right {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                ${animated ? 'animation: stitch-glow 4s ease-in-out infinite 1s;' : ''}
              }

              .seamstress-polygon-left {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                ${animated ? 'animation: stitch-glow 4s ease-in-out infinite 1.5s;' : ''}
              }

              .seamstress-polygon-right {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                ${animated ? 'animation: stitch-glow 4s ease-in-out infinite 2s;' : ''}
              }

              @keyframes stitch-glow {
                0%, 100% {
                  opacity: 1;
                  filter: drop-shadow(0 0 1px ${strokeColor});
                }
                50% {
                  opacity: 0.7;
                  filter: drop-shadow(0 0 3px ${strokeColor});
                }
              }

              @keyframes dash-weave {
                0%, 100% {
                  opacity: 0.6;
                  stroke-dasharray: 2;
                }
                25% {
                  opacity: 0.8;
                  stroke-dasharray: 4 2;
                }
                50% {
                  opacity: 0.5;
                  stroke-dasharray: 2;
                }
                75% {
                  opacity: 0.7;
                  stroke-dasharray: 3 1;
                }
              }
            `}
          </style>
        </defs>

        {/* Background rectangle with rounded corners */}
        <rect
          className="seamstress-bg"
          x="25.66"
          y="28.51"
          width="182.97"
          height="182.97"
          rx="20"
          ry="20"
        />

        {/* Geometric stitching pattern */}
        <g>
          {/* Solid strokes with staggered animations */}
          <polyline
            className="seamstress-vertical-left"
            points="42.29 193.44 117.29 43.44 117.29 193.44"
          />
          <polyline
            className="seamstress-vertical-right"
            points="192.29 193.44 117.29 43.44 117.29 193.44"
          />
          <polyline
            className="seamstress-stroke"
            points="42.29 118.79 192.29 44.15 42.29 44.15 192.29 118.79"
          />
          <polygon
            className="seamstress-polygon-left"
            points="42.29 193.44 72.79 132.44 117.29 156.12 42.29 193.44"
          />
          <polygon
            className="seamstress-polygon-right"
            points="192.29 193.44 117.29 156.12 162.4 133.67 192.29 193.44"
          />

          {/* Dashed strokes */}
          <polyline
            className="seamstress-dash"
            points="62.39 193.44 192.29 193.44 42.29 118.79 192.29 118.79 42.29 193.44 172.2 193.44"
          />
          <polyline
            className="seamstress-dash"
            points="192.29 43.44 117.29 193.44 117.29 43.44"
          />
          <polyline
            className="seamstress-dash"
            points="42.29 43.44 117.29 193.44 117.29 43.44"
          />
          <rect
            className="seamstress-dash"
            x="42.29"
            y="44.15"
            width="150"
            height="149.3"
          />
          <polygon
            className="seamstress-dash"
            points="42.29 193.44 117.29 43.44 192.29 193.44 117.29 156.12 42.29 193.44"
          />
        </g>
      </svg>
    </Box>
  );
};

export const SeamstressLogoMark: React.FC<SeamstressLogoProps> = ({
  size = 32,
  variant = 'auto',
  onClick,
}) => {
  const theme = useTheme();

  const isDarkMode = theme.palette.mode === 'dark';
  const shouldUseDarkVariant =
    variant === 'dark' || (variant === 'auto' && isDarkMode);

  const strokeColor = shouldUseDarkVariant
    ? theme.palette.primary.main
    : cdsColors.gray900;

  return (
    <Box
      onClick={onClick}
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="42 43 150 151"
        width={size}
        height={size}
      >
        <defs>
          <style>
            {`
              .logo-mark-stroke {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-width: 1.5;
              }

              .logo-mark-dash {
                fill: none;
                stroke: ${strokeColor};
                stroke-linecap: round;
                stroke-linejoin: round;
                stroke-dasharray: 2;
                opacity: 0.6;
              }
            `}
          </style>
        </defs>

        <polyline className="logo-mark-stroke" points="42.29 193.44 117.29 43.44 117.29 193.44"/>
        <polyline className="logo-mark-stroke" points="192.29 193.44 117.29 43.44 117.29 193.44"/>
        <polyline className="logo-mark-dash" points="42.29 43.44 117.29 193.44 117.29 43.44"/>
        <polyline className="logo-mark-dash" points="192.29 43.44 117.29 193.44 117.29 43.44"/>
        <rect className="logo-mark-dash" x="42.29" y="44.15" width="150" height="149.3"/>
      </svg>
    </Box>
  );
};
