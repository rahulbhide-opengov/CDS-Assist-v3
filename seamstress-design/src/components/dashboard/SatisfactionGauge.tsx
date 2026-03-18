import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Skeleton,
  useTheme,
} from '@mui/material';
import { cdsColors } from '../../theme/cds';

/**
 * Props for the SatisfactionGauge component
 */
export interface SatisfactionGaugeProps {
  /** Main label for the gauge */
  label: string;
  /** Percentage value (0-100) */
  value: number;
  /** Optional subtitle/description */
  sublabel?: string;
  /** Optional custom color zones (overrides defaults) */
  colorZones?: {
    red: [number, number];
    yellow: [number, number];
    green: [number, number];
  };
  /** Size of the gauge */
  size?: 'small' | 'medium' | 'large';
  /** Loading state */
  loading?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

/**
 * SatisfactionGauge - Semi-circle gauge for displaying satisfaction metrics
 *
 * Features:
 * - Semi-circle progress indicator
 * - Color zones (red/yellow/green) based on value
 * - Customizable thresholds
 * - Multiple sizes
 * - Responsive design
 * - Animated transitions
 *
 * @example
 * ```tsx
 * <SatisfactionGauge
 *   label="Customer Satisfaction"
 *   value={87}
 *   sublabel="Based on 234 responses"
 * />
 * ```
 */
const SatisfactionGauge: React.FC<SatisfactionGaugeProps> = ({
  label,
  value,
  sublabel,
  colorZones = {
    red: [0, 40],
    yellow: [40, 70],
    green: [70, 100],
  },
  size = 'medium',
  loading = false,
  onClick,
}) => {
  const theme = useTheme();

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  // Determine color based on zones using CDS semantic colors
  const getColor = () => {
    if (clampedValue >= colorZones.green[0] && clampedValue <= colorZones.green[1]) {
      return cdsColors.green600; // CDS success green
    }
    if (clampedValue >= colorZones.yellow[0] && clampedValue <= colorZones.yellow[1]) {
      return cdsColors.orange600; // CDS warning orange
    }
    return cdsColors.red600; // CDS error red for low values
  };

  // Size configurations - increased stroke width for better visual impact
  const sizeConfig = {
    small: { diameter: 120, strokeWidth: 20, fontSize: '1.5rem' },
    medium: { diameter: 160, strokeWidth: 28, fontSize: '2rem' },
    large: { diameter: 200, strokeWidth: 36, fontSize: '2.5rem' },
  };

  const { diameter, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = Math.PI * radius; // Half circle
  const offset = circumference - (clampedValue / 100) * circumference;

  const color = getColor();

  if (loading) {
    return (
      <Card sx={{ height: '100%', p: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={28} sx={{ mb: 2 }} />
          <Skeleton variant="circular" width={diameter} height={diameter / 2} sx={{ mx: 'auto' }} />
          <Skeleton variant="text" width="40%" height={24} sx={{ mx: 'auto', mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        height: '100%',
        p: 2,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick
          ? {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-2px)',
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack alignItems="center" spacing={2}>
          {/* Title */}
          <Typography variant="h3" fontSize={"1rem"} fontWeight="500" textAlign="center">
            {label}
          </Typography>

          {/* Gauge SVG */}
          <Box
            sx={{
              position: 'relative',
              width: diameter,
              height: diameter / 2 + strokeWidth / 2,
              overflow: 'visible',
            }}
          >
            <svg
              width={diameter}
              height={diameter / 2 + strokeWidth / 2}
              style={{ overflow: 'visible' }}
            >
              {/* Background arc */}
              <path
                d={`M ${strokeWidth / 2} ${diameter / 2} A ${radius} ${radius} 0 0 1 ${
                  diameter - strokeWidth / 2
                } ${diameter / 2}`}
                fill="none"
                stroke={theme.palette.grey[200]}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              {/* Value arc - solid color based on value */}
              <path
                d={`M ${strokeWidth / 2} ${diameter / 2} A ${radius} ${radius} 0 0 1 ${
                  diameter - strokeWidth / 2
                } ${diameter / 2}`}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.3s ease-in-out',
                }}
              />
            </svg>

            {/* Center value */}
            <Box
              sx={{
                position: 'absolute',
                top: '60%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <Typography
                variant="h2"
                component="div"
                fontWeight="600"
                sx={{ fontSize, color, lineHeight: 1 }}
              >
                {Math.round(clampedValue)}%
              </Typography>
            </Box>
          </Box>

          {/* Sublabel */}
          {sublabel && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              {sublabel}
            </Typography>
          )}

          {/* Color legend */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ pt: 1 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: cdsColors.red600,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                0-{colorZones.red[1]}%
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: cdsColors.orange600,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {colorZones.yellow[0]}-{colorZones.yellow[1]}%
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: cdsColors.green600,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {colorZones.green[0]}-100%
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SatisfactionGauge;
