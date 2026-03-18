import { Box, Chip, useTheme, alpha } from '@mui/material';

export type SpacingType = 'padding' | 'margin' | 'gap';

export interface SpacingCalloutProps {
  type: SpacingType;
  direction: 'horizontal' | 'vertical';
  value: number; // MUI spacing multiplier
  label: string; // e.g., "px: 3"
  position: {
    top?: number | string;
    left?: number | string;
    right?: number | string;
    bottom?: number | string;
    transform?: string;
  };
  length?: number | string; // Length of the dimension line
  labelPosition?: 'start' | 'center' | 'end'; // Where to position the label along the line
}

export function SpacingCallout({
  type,
  direction,
  value,
  label,
  position,
  length = 'auto',
  labelPosition = 'center',
}: SpacingCalloutProps) {
  const theme = useTheme();
  const color = theme.palette[type === 'padding' ? 'info' : type === 'margin' ? 'warning' : 'success'].main;
  const pixelValue = value * 8;

  const isHorizontal = direction === 'horizontal';

  // End marker dimensions
  const markerSize = 6;
  const lineThickness = 2;

  // Calculate label position offset
  const getLabelStyle = () => {
    if (isHorizontal) {
      // For horizontal lines, label goes below
      const horizontalAlign = labelPosition === 'start' ? { left: 0 }
        : labelPosition === 'end' ? { right: 0 }
          : { left: '50%', transform: 'translateX(-50%)' };
      return {
        position: 'absolute' as const,
        top: markerSize * 2 + 4, // Below the dimension line
        ...horizontalAlign,
      };
    } else {
      // For vertical lines, label goes to the right
      const verticalAlign = labelPosition === 'start' ? { top: 0 }
        : labelPosition === 'end' ? { bottom: 0 }
          : { top: '50%', transform: 'translateY(-50%)' };
      return {
        position: 'absolute' as const,
        left: markerSize * 2 + 4, // To the right of the dimension line
        ...verticalAlign,
      };
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        ...position,
        // Size the container to exactly match the dimension line
        width: isHorizontal ? (length === 'auto' ? pixelValue : length) : markerSize * 2,
        height: isHorizontal ? markerSize * 2 : (length === 'auto' ? pixelValue : length),
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      {/* Dimension line container - fills the parent exactly */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: isHorizontal ? 'row' : 'column',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Start marker (perpendicular line) */}
        <Box
          sx={{
            width: isHorizontal ? lineThickness : '100%',
            height: isHorizontal ? '100%' : lineThickness,
            bgcolor: color,
            flexShrink: 0,
          }}
        />

        {/* Main line */}
        <Box
          sx={{
            flex: 1,
            height: isHorizontal ? lineThickness : 'auto',
            width: isHorizontal ? 'auto' : lineThickness,
            bgcolor: color,
            alignSelf: 'center',
          }}
        />

        {/* End marker (perpendicular line) */}
        <Box
          sx={{
            width: isHorizontal ? lineThickness : '100%',
            height: isHorizontal ? '100%' : lineThickness,
            bgcolor: color,
            flexShrink: 0,
          }}
        />
      </Box>

      {/* Label chip - absolutely positioned relative to dimension line */}
      <Chip
        label={`${label} = ${pixelValue}px`}
        size="small"
        sx={{
          ...getLabelStyle(),
          bgcolor: alpha(color, 0.95),
          color: 'white',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          fontWeight: 600,
          height: 22,
          maxWidth: 160,
          position: 'absolute',
          '& .MuiChip-label': {
            px: 1,
          },
          boxShadow: `0 2px 4px ${alpha(color, 0.4)}`,
          whiteSpace: 'nowrap',
        }}
      />
    </Box>
  );
}

export default SpacingCallout;
