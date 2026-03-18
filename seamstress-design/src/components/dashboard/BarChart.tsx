import React from 'react';
import { colorTokens } from '../../theme/cds/tokens';
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
  ResponsiveContainer,
  Cell,
} from 'recharts';

/**
 * Data point structure for bar chart
 */
export interface BarChartDataPoint {
  /** Category name */
  name: string;
  /** Value for the bar */
  value: number;
  /** Optional color override for this bar */
  color?: string;
  /** Additional data fields */
  [key: string]: any;
}

/**
 * Props for the BarChart component
 */
export interface BarChartProps {
  /** Title of the chart */
  title: string;
  /** Description of the chart */
  description?: string;
  /** Array of data points */
  data: BarChartDataPoint[];
  /** Default bar color */
  barColor?: string;
  /** Custom value formatter for tooltip and axis */
  valueFormatter?: (value: number) => string;
  /** Loading state */
  loading?: boolean;
  /** Chart height in pixels */
  height?: number;
  /** Maximum number of bars to show */
  limit?: number;
  /** Axis label for values */
  valueLabel?: string;
  /** Axis label for categories */
  categoryLabel?: string;
}

/**
 * BarChart - Horizontal or vertical bar chart component
 *
 * Features:
 * - Customizable colors per bar
 * - Responsive design
 * - Custom tooltips with formatted values
 * - Mobile-friendly
 * - Support for limiting displayed bars
 *
 * @example
 * ```tsx
 * <BarChart
 *   title="Applications by Type"
 *   data={[
 *     { name: 'Building Permit', value: 45, color: colorTokens.primary.main },
 *     { name: 'Business License', value: 32, color: colorTokens.success.main }
 *   ]}
 *   limit={10}
 * />
 * ```
 */
const BarChart: React.FC<BarChartProps> = ({
  title,
  description,
  data,
  barColor = colorTokens.primary.main,
  valueFormatter = (value: number) => value.toLocaleString(),
  loading = false,
  height = 400,
  limit,
  valueLabel,
  categoryLabel,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Limit data if specified
  const displayData = limit ? data.slice(0, limit) : data;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
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
            {dataPoint.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {valueLabel || 'Value'}: {valueFormatter(dataPoint.value)}
          </Typography>
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
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} horizontal />
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
              width={isMobile ? 100 : 150}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || barColor} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarChart;
