import React from 'react';
import { Box } from '@mui/material';

interface SeamstressAnimatedIconProps {
  size?: number;
  color?: string;
}

export const SeamstressAnimatedIcon: React.FC<SeamstressAnimatedIconProps> = ({
  size = 32,
  color = 'currentColor'
}) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            @keyframes thread-weave {
              0% {
                d: path("M 6 16 C 12 10, 20 22, 26 16");
              }
              50% {
                d: path("M 6 16 C 12 22, 20 10, 26 16");
              }
              100% {
                d: path("M 6 16 C 12 10, 20 22, 26 16");
              }
            }

            @keyframes dot-fade {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.3;
              }
            }

            .thread-path {
              animation: thread-weave 4s ease-in-out infinite;
              stroke: ${color};
              stroke-width: 6;
              stroke-linecap: round;
            }

            .dot-pulse {
              fill: ${color};
              animation: dot-fade 2s ease-in-out infinite;
              animation-delay: 1s;
            }
          `}
        </style>

        {/* Simple weaving thread */}
        <path
          className="thread-path"
          d="M 6 16 C 12 10, 20 22, 26 16"
          fill="none"
        />

        {/* Static thread for contrast */}
        <path
          d="M 6 16 L 26 16"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Simple dot accent */}
        <circle
          className="dot-pulse"
          cx="16"
          cy="16"
          r="3"
        />
      </svg>
    </Box>
  );
};

export const SeamstressStaticIcon: React.FC<SeamstressAnimatedIconProps> = ({
  size = 32,
  color = 'currentColor'
}) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple weaving thread */}
        <path
          d="M 6 16 C 12 10, 20 22, 26 16"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Static base thread */}
        <path
          d="M 6 16 L 26 16"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Center dot */}
        <circle cx="16" cy="16" r="3" fill={color} />
      </svg>
    </Box>
  );
};