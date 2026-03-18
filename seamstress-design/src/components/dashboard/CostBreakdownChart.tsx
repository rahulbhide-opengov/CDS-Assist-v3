import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell,
} from 'recharts';
import { getAllColors } from '../../constants/dataVizColors';
import { DataVizPatternDefs, getFillWithPattern } from '../../constants/dataVizPatterns';

/**
 * Breakdown view types
 */
export type BreakdownView = 'provider' | 'agent' | 'time';

/**
 * Cost data point structure
 */
export interface CostDataPoint {
  /** Label (provider name, agent name, or time period) */
  label: string;
  /** Cost value */
  cost: number;
  /** Volume/usage count */
  volume: number;
  /** Optional breakdown by category */
  breakdown?: {
    category: string;
    cost: number;
    color?: string;
  }[];
}

/**
 * Props for the CostBreakdownChart component
 */
export interface CostBreakdownChartProps {
  /** Title of the chart */
  title?: string;
  /** Data organized by provider */
  providerData?: CostDataPoint[];
  /** Data organized by agent */
  agentData?: CostDataPoint[];
  /** Data organized by time period */
  timeData?: CostDataPoint[];
  /** Available breakdown views */
  availableViews?: BreakdownView[];
  /** Default view */
  defaultView?: BreakdownView;
  /** Currency symbol */
  currencySymbol?: string;
  /** Volume unit label */
  volumeLabel?: string;
  /** Chart height in pixels */
  height?: number;
  /** Loading state */
  loading?: boolean;
  /** Whether to show dual axis (cost + volume) */
  showDualAxis?: boolean;
}

/**
 * CostBreakdownChart - Stacked chart for cost analysis
 *
 * Features:
 * - Multiple breakdown views (by provider, agent, time)
 * - Stacked bar chart for cost categories
 * - Dual-axis support (cost + volume)
 * - Interactive view switcher
 * - Responsive design
 * - Custom tooltips
 * - Summary statistics
 *
 * @example
 * ```tsx
 * <CostBreakdownChart
 *   title="Cost Analysis"
 *   providerData={[
 *     {
 *       label: 'OpenAI',
 *       cost: 1250,
 *       volume: 50000,
 *       breakdown: [
 *         { category: 'GPT-4', cost: 800, color: colorTokens.primary.main },
 *         { category: 'GPT-3.5', cost: 450, color: colorTokens.secondary.main }
 *       ]
 *     }
 *   ]}
 *   agentData={[...]}
 *   showDualAxis
 * />
 * ```
 */
const CostBreakdownChart: React.FC<CostBreakdownChartProps> = ({
  title = 'Cost Breakdown',
  providerData = [],
  agentData = [],
  timeData = [],
  availableViews = ['provider', 'agent', 'time'],
  defaultView = 'provider',
  currencySymbol = '$',
  volumeLabel = 'API Calls',
  height = 350,
  loading = false,
  showDualAxis = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [view, setView] = useState<BreakdownView>(defaultView);

  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
    newView: BreakdownView | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  // Get data for current view
  const getCurrentData = () => {
    switch (view) {
      case 'provider':
        return providerData;
      case 'agent':
        return agentData;
      case 'time':
        return timeData;
      default:
        return providerData;
    }
  };

  const currentData = getCurrentData();

  // Extract all unique categories from breakdown data
  const getAllCategories = () => {
    const categories = new Set<string>();
    currentData.forEach((item) => {
      item.breakdown?.forEach((b) => categories.add(b.category));
    });
    return Array.from(categories);
  };

  const categories = getAllCategories();

  // Prepare data for stacked bar chart
  const chartData = currentData.map((item) => {
    const row: any = {
      label: item.label,
      volume: item.volume,
      totalCost: item.cost,
    };

    // Add each category as a separate property
    item.breakdown?.forEach((b) => {
      row[b.category] = b.cost;
    });

    return row;
  });

  // Calculate totals
  const totalCost = currentData.reduce((sum, item) => sum + item.cost, 0);
  const totalVolume = currentData.reduce((sum, item) => sum + item.volume, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const volumeData = payload.find((p) => p.dataKey === 'volume');
      const costData = payload.filter((p) => p.dataKey !== 'volume');

      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            p: 1.5,
            boxShadow: theme.shadows[3],
            minWidth: 150,
          }}
        >
          <Typography variant="h3" gutterBottom>
            {label}
          </Typography>
          {costData.map((entry, index) => (
            <Stack key={index} direction="row" justifyContent="space-between" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
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
              </Stack>
              <Typography variant="caption" fontWeight="medium">
                {currencySymbol}
                {(entry.value as number).toLocaleString()}
              </Typography>
            </Stack>
          ))}
          {showDualAxis && volumeData && (
            <>
              <Box sx={{ my: 0.5, borderTop: '1px solid', borderColor: 'divider' }} />
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography variant="caption" color="text.secondary">
                  {volumeLabel}:
                </Typography>
                <Typography variant="caption" fontWeight="medium">
                  {(volumeData.value as number).toLocaleString()}
                </Typography>
              </Stack>
            </>
          )}
        </Box>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="rectangular" width={200} height={32} />
          </Stack>
          <Skeleton variant="rectangular" width="100%" height={height} />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" width="50%" height={60} />
            <Skeleton variant="rectangular" width="50%" height={60} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  // Get color for category
  const getCategoryColor = (category: string) => {
    const item = currentData
      .flatMap((d) => d.breakdown || [])
      .find((b) => b.category === category);
    return item?.color || theme.palette.primary.main;
  };

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
          {availableViews.length > 1 && (
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="medium"
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'capitalize',
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              {availableViews.map((v) => (
                <ToggleButton key={v} value={v}>
                  By {v}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </Stack>

        {/* Summary Stats */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
          <Paper
            variant="outlined"
            sx={{
              flex: 1,
              minWidth: 150,
              p: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block">
              Total Cost
            </Typography>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              {currencySymbol}
              {totalCost.toLocaleString()}
            </Typography>
          </Paper>
          {showDualAxis && (
            <Paper
              variant="outlined"
              sx={{
                flex: 1,
                minWidth: 150,
                p: 1.5,
              }}
            >
              <Typography variant="caption" color="text.secondary" display="block">
                Total {volumeLabel}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary.main">
                {totalVolume.toLocaleString()}
              </Typography>
            </Paper>
          )}
        </Stack>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
              tickLine={{ stroke: theme.palette.divider }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
              tickLine={{ stroke: theme.palette.divider }}
              label={{
                value: `Cost (${currencySymbol})`,
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary },
              }}
            />
            {showDualAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary }}
                tickLine={{ stroke: theme.palette.divider }}
                label={{
                  value: volumeLabel,
                  angle: 90,
                  position: 'insideRight',
                  style: { fontSize: isMobile ? 10 : 12, fill: theme.palette.text.secondary },
                }}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: isMobile ? '11px' : '12px' }}
              iconType="square"
            />

            {/* Stacked bars for categories */}
            {categories.map((category) => (
              <Bar
                key={category}
                yAxisId="left"
                dataKey={category}
                stackId="cost"
                fill={getCategoryColor(category)}
                radius={[4, 4, 0, 0]}
              />
            ))}

            {/* Volume line */}
            {showDualAxis && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="volume"
                stroke={theme.palette.secondary.main}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={volumeLabel}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>

        {/* Category Legend */}
        {categories.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                size="small"
                sx={{
                  backgroundColor: `${getCategoryColor(category)}20`,
                  color: getCategoryColor(category),
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default CostBreakdownChart;
