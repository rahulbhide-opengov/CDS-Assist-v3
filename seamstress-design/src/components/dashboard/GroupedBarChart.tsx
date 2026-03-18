import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * Data point structure for grouped bar chart
 */
export interface GroupedBarChartDataPoint {
  /** Category name */
  name: string;
  /** Values for each series */
  [key: string]: string | number;
}

/**
 * Series configuration for grouped bars
 */
export interface BarSeries {
  /** Data key to use from the data points */
  dataKey: string;
  /** Display name for the series */
  name: string;
  /** Color for the bar */
  color: string;
}

/**
 * Props for the GroupedBarChart component
 */
export interface GroupedBarChartProps {
  /** Title of the chart */
  title: string;
  /** Description of the chart */
  description?: string;
  /** Array of data points */
  data: GroupedBarChartDataPoint[];
  /** Series configurations */
  series: BarSeries[];
  /** Custom value formatter for tooltip and axis */
  valueFormatter?: (value: number) => string;
  /** Loading state */
  loading?: boolean;
  /** Chart height in pixels */
  height?: number;
  /** Maximum number of categories to show */
  limit?: number;
  /** Chart layout */
  layout?: 'horizontal' | 'vertical';
}

/**
 * GroupedBarChart - Grouped (side-by-side) bar chart component
 *
 * Features:
 * - Multiple series displayed side by side
 * - Horizontal or vertical layout
 * - Responsive design
 * - Custom tooltips with formatted values
 * - Interactive legend
 * - Mobile-friendly
 *
 * @example
 * ```tsx
 * <GroupedBarChart
 *   title="Budget vs Actual"
 *   data={[
 *     { name: 'Police', budget: 5000000, actual: 4200000 },
 *     { name: 'Fire', budget: 3000000, actual: 2800000 }
 *   ]}
 *   series={[
 *     { dataKey: 'budget', name: 'Budget', color: colorTokens.primary.main },
 *     { dataKey: 'actual', name: 'Actual', color: colorTokens.success.main }
 *   ]}
 * />
 * ```
 */
const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  title,
  description,
  data,
  series,
  valueFormatter = (value: number) => value.toLocaleString(),
  loading = false,
  height = 400,
  limit,
  layout = 'vertical',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Limit data if specified
  const displayData = limit ? data.slice(0, limit) : data;

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
          {payload.map((entry: any, index: number) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 1,
                  backgroundColor: entry.color,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {entry.name}:
              </Typography>
              <Typography variant="caption" fontWeight="medium">
                {valueFormatter(entry.value as number)}
              </Typography>
            </Box>
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
          {description && <Skeleton variant="text" width="60%" height={20} sx={{ mt: 0.5 }} />}
          <Skeleton variant="rectangular" width="100%" height={height} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const isHorizontal = layout === 'horizontal';

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h3" fontWeight="500" fontSize="1rem">
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {description}
            </Typography>
          )}
        </Box>

        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart
            data={displayData}
            layout={isHorizontal ? 'horizontal' : 'vertical'}
            margin={{
              top: 5,
              right: 30,
              left: isHorizontal ? 120 : 20,
              bottom: isHorizontal ? 5 : 60,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme.palette.divider}
              horizontal={!isHorizontal}
              vertical={isHorizontal}
            />
            {isHorizontal ? (
              <>
                <XAxis
                  type="number"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  tickFormatter={valueFormatter}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  width={110}
                />
              </>
            ) : (
              <>
                <XAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  type="number"
                  tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                  tickLine={{ stroke: theme.palette.divider }}
                  tickFormatter={valueFormatter}
                />
              </>
            )}
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
            <Legend
              wrapperStyle={{ fontSize: isMobile ? '11px' : '12px' }}
              iconType="rect"
            />
            {series.map((s) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color}
                radius={isHorizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GroupedBarChart;
