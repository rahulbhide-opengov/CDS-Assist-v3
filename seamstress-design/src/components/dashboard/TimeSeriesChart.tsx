import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Time window options for the chart
 */
export type TimeWindow = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

/**
 * Chart variant types
 */
export type ChartVariant = 'line' | 'area';

/**
 * Data point structure for time series
 */
export interface TimeSeriesDataPoint {
  /** Timestamp or date label */
  timestamp: string;
  /** Additional data values (key-value pairs) */
  [key: string]: string | number;
}

/**
 * Series configuration
 */
export interface SeriesConfig {
  /** Data key to use from the data points */
  dataKey: string;
  /** Display name for the series */
  name: string;
  /** Color for the line/area */
  color: string;
  /** Whether to show this series (default: true) */
  visible?: boolean;
}

/**
 * Props for the TimeSeriesChart component
 */
export interface TimeSeriesChartProps {
  /** Title of the chart */
  title: string;
  /** Array of data points */
  data: TimeSeriesDataPoint[];
  /** Configuration for each series to display */
  series: SeriesConfig[];
  /** Chart variant (line or area) */
  variant?: ChartVariant;
  /** Available time windows */
  timeWindows?: TimeWindow[];
  /** Default selected time window */
  defaultTimeWindow?: TimeWindow;
  /** Callback when time window changes */
  onTimeWindowChange?: (window: TimeWindow) => void;
  /** Custom value formatter for tooltip */
  valueFormatter?: (value: number) => string;
  /** Loading state */
  loading?: boolean;
  /** Chart height in pixels */
  height?: number;
}

/**
 * TimeSeriesChart - Line/area chart component for time series data
 *
 * Features:
 * - Multi-line/area support
 * - Responsive design
 * - Time window selector
 * - Custom tooltips with formatted values
 * - Interactive legend
 * - Mobile-friendly
 *
 * @example
 * ```tsx
 * <TimeSeriesChart
 *   title="User Growth"
 *   data={[
 *     { timestamp: '2024-01', users: 100, active: 80 },
 *     { timestamp: '2024-02', users: 150, active: 120 }
 *   ]}
 *   series={[
 *     { dataKey: 'users', name: 'Total Users', color: colorTokens.primary.main },
 *     { dataKey: 'active', name: 'Active Users', color: colorTokens.success.main }
 *   ]}
 *   timeWindows={['daily', 'weekly', 'monthly']}
 * />
 * ```
 */
const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  title,
  data,
  series,
  variant = 'line',
  timeWindows = ['daily', 'weekly', 'monthly'],
  defaultTimeWindow = 'weekly',
  onTimeWindowChange,
  valueFormatter = (value: number) => value.toLocaleString(),
  loading = false,
  height = 300,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedWindow, setSelectedWindow] = useState<TimeWindow>(defaultTimeWindow);

  const handleTimeWindowChange = (
    _event: React.MouseEvent<HTMLElement>,
    newWindow: TimeWindow | null
  ) => {
    if (newWindow !== null) {
      setSelectedWindow(newWindow);
      onTimeWindowChange?.(newWindow);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: theme.shadows[3],
          }}
        >
          <Typography variant="body2" fontWeight="bold" gutterBottom>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Stack key={index} direction="row" alignItems="center" spacing={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {entry.name}:
              </Typography>
              <Typography variant="caption" fontWeight="medium">
                {valueFormatter(entry.value as number)}
              </Typography>
            </Stack>
          ))}
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={32} />
          <Skeleton variant="rectangular" width="100%" height={height} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const ChartComponent = variant === 'area' ? AreaChart : LineChart;

  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Typography variant='h3'>
            {title}
          </Typography>
          {timeWindows.length > 1 && (
            <ToggleButtonGroup
              value={selectedWindow}
              exclusive
              onChange={handleTimeWindowChange}
              size="medium"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'capitalize',
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              {timeWindows.map((window) => (
                <ToggleButton key={window} value={window}>
                  {window}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Stack>

        <ResponsiveContainer width="100%" height={height}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis
              tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
              tickLine={{ stroke: theme.palette.divider }}
              tickFormatter={valueFormatter}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: isMobile ? '11px' : '12px' }}
              iconType="circle"
            />
            {series
              .filter((s) => s.visible !== false)
              .map((s) =>
                variant === 'area' ? (
                  <Area
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={s.color}
                    fill={s.color}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ) : (
                  <Line
                    key={s.dataKey}
                    type="monotone"
                    dataKey={s.dataKey}
                    name={s.name}
                    stroke={s.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )
              )}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesChart;
