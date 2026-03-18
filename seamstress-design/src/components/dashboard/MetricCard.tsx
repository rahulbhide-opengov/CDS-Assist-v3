import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Stack,
  Box,
  Skeleton,
  useTheme,
} from '@mui/material';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

/**
 * Props for the MetricCard component
 */
export interface MetricCardProps {
  /** Label displayed in the card header */
  label: string;
  /** Main value to display (string or number - numbers will be converted) */
  value: string | number;
  /** Percentage change from previous period - auto-formats with +/- prefix and determines color */
  changePercentage?: number | null;
  /**
   * @deprecated Use changePercentage instead. Kept for backwards compatibility.
   * Percentage change as a number (e.g., 12.5 for +12.5%)
   */
  changePercent?: number;
  /**
   * @deprecated Use changePercentage instead. Kept for backwards compatibility.
   * Trend direction to determine chip color when using changePercent
   */
  trend?: 'up' | 'down' | 'stable';
  /** Status indicator for the card (affects border/background) */
  status?: 'success' | 'warning' | 'error';
  /** Optional icon to display next to the label */
  icon?: React.ReactNode;
  /** Optional sparkline data for mini chart */
  sparklineData?: Array<{ value: number }>;
  /** Loading state - shows skeleton when true */
  loading?: boolean;
  /** Optional click handler for drill-down interactions */
  onClick?: () => void;
}

/**
 * MetricCard - Card component for displaying key metrics
 *
 * Matches production Agent Studio dashboard structure with:
 * - CardHeader for the label
 * - Auto-formatted percentage change with color based on value sign
 * - Clean Stack-based layout
 *
 * Supports two API patterns:
 * 1. Production pattern (preferred): `changePercentage` prop that auto-formats and determines color
 * 2. Legacy pattern: `changePercent` + `trend` props (backwards compatible)
 *
 * Optional enhanced features:
 * - Status indicator (border color)
 * - Sparkline mini chart
 * - Loading skeleton
 * - Click handler for drill-down
 *
 * @example
 * ```tsx
 * // Production pattern (preferred) - color derived from sign
 * <MetricCard
 *   label="Total Tasks"
 *   value="1,234"
 *   changePercentage={12.5}  // Shows "+12.5%" in green
 * />
 *
 * <MetricCard
 *   label="Errors"
 *   value={42}  // Numbers are auto-formatted with toLocaleString()
 *   changePercentage={-5.2}  // Shows "-5.2%" in red
 * />
 *
 * // Legacy pattern (backwards compatible)
 * <MetricCard
 *   label="Backlog"
 *   value={150}
 *   changePercent={8.5}
 *   trend="down"  // Forces red color even though value is positive
 *   status="warning"  // Adds warning border
 * />
 *
 * // With optional features
 * <MetricCard
 *   label="Revenue"
 *   value="$42,500"
 *   changePercentage={15.3}
 *   icon={<AttachMoneyIcon />}
 *   sparklineData={[{value: 10}, {value: 20}, {value: 15}]}
 *   onClick={() => console.log('Drill down')}
 * />
 * ```
 */
const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  changePercentage,
  changePercent,
  trend,
  status,
  icon,
  sparklineData,
  loading = false,
  onClick,
}) => {
  const theme = useTheme();

  // Convert value to string if it's a number
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value;

  // Resolve the effective percentage change (prefer changePercentage, fall back to changePercent)
  const effectiveChange = changePercentage ?? changePercent ?? null;

  // Determine chip color from percentage value (matches production pattern)
  // If using legacy trend prop with changePercent, use that for color determination
  const getChipColor = (): 'default' | 'success' | 'error' => {
    if (effectiveChange === null) return 'default';

    // If trend is explicitly provided (legacy pattern), use it
    if (trend !== undefined && changePercent !== undefined) {
      return trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'default';
    }

    // Otherwise, derive from the sign of the value (production pattern)
    return effectiveChange > 0 ? 'success' : effectiveChange < 0 ? 'error' : 'default';
  };

  const chipColor = getChipColor();

  // Auto-format the chip label with +/- prefix
  const chipLabel =
    effectiveChange !== null ? `${effectiveChange > 0 ? '+' : ''}${effectiveChange}%` : '';

  // Handle keyboard interaction for clickable cards
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick();
    }
  };

  // Get color for sparkline based on change direction
  const getSparklineColor = () => {
    if (effectiveChange === null) {
      return theme.palette.grey[500];
    }
    return effectiveChange > 0
      ? theme.palette.success.main
      : effectiveChange < 0
        ? theme.palette.error.main
        : theme.palette.grey[500];
  };

  // Get status-based border color
  const getStatusBorderColor = () => {
    if (!status) return undefined;
    switch (status) {
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'error':
        return theme.palette.error.main;
      default:
        return undefined;
    }
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%' }} aria-busy="true" aria-label={`Loading ${label}`}>
        <CardHeader title={<Skeleton variant="text" width="60%" />} />
        <CardContent sx={{ py: 0 }}>
          <Skeleton variant="text" width="80%" height={48} />
          <Skeleton variant="rectangular" width="30%" height={24} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  // Determine trend description for sparkline accessibility
  const getTrendDescription = () => {
    if (!sparklineData || sparklineData.length < 2) return '';
    const first = sparklineData[0].value;
    const last = sparklineData[sparklineData.length - 1].value;
    if (last > first) return 'trending upward';
    if (last < first) return 'trending downward';
    return 'stable';
  };

  const statusBorderColor = getStatusBorderColor();

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        ...(statusBorderColor && {
          borderLeft: `4px solid ${statusBorderColor}`,
        }),
        '&:hover': onClick
          ? {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
          }
          : {},
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={
        onClick
          ? `${label}: ${displayValue}${effectiveChange !== null ? `, ${chipLabel}` : ''}. Click for details.`
          : undefined
      }
    >
      <CardHeader
        title={label}
        avatar={icon}
        titleTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ py: 0, pb: 2, }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="d6">{displayValue}</Typography>
          {effectiveChange !== null && <Chip label={chipLabel} size="small" color={chipColor} />}
        </Stack>

        {sparklineData && sparklineData.length > 0 && (
          <Box
            sx={{ width: '100%', height: 32, mt: 1 }}
            role="img"
            aria-label={`Sparkline chart for ${label}, ${getTrendDescription()}`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData} aria-hidden="true">
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={getSparklineColor()}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
