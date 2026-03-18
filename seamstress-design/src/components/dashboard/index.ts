/**
 * Dashboard Components
 *
 * Reusable visualization components for the Agent Studio observability dashboard.
 * All components follow MUI theming, are fully responsive, and include TypeScript types.
 */

export { default as MetricCard } from './MetricCard';
export type { MetricCardProps } from './MetricCard';

export { default as GoalProgressCard } from './GoalProgressCard';
export type { GoalProgressCardProps, GoalStatus } from './GoalProgressCard';

export { default as TimeSeriesChart } from './TimeSeriesChart';
export type {
  TimeSeriesChartProps,
  TimeSeriesDataPoint,
  SeriesConfig,
  TimeWindow,
  ChartVariant,
} from './TimeSeriesChart';

export { default as PerformanceTable } from './PerformanceTable';
export type {
  PerformanceTableProps,
  PerformanceTableColumn,
  PerformanceTableRow,
  RowAction,
} from './PerformanceTable';

export { default as SatisfactionGauge } from './SatisfactionGauge';
export type { SatisfactionGaugeProps } from './SatisfactionGauge';

export { default as LatencyDistributionChart } from './LatencyDistributionChart';
export type {
  LatencyDistributionChartProps,
  PercentileData,
  HistogramBin,
  ThresholdConfig,
} from './LatencyDistributionChart';

export { default as FeedbackTimelineCard } from './FeedbackTimelineCard';
export type { FeedbackTimelineCardProps, FeedbackItem } from './FeedbackTimelineCard';

export { default as CostBreakdownChart } from './CostBreakdownChart';
export type {
  CostBreakdownChartProps,
  CostDataPoint,
  BreakdownView,
} from './CostBreakdownChart';

export { default as GitStatusCard } from './GitStatusCard';
export type {
  GitStatusCardProps,
  GitStatusInfo,
  BranchInfo,
  BranchStatus,
  GitLabel,
} from './GitStatusCard';

export { default as BranchCompareChart } from './BranchCompareChart';
export type { BranchCompareChartProps } from './BranchCompareChart';

export { default as RepoStatsBar } from './RepoStatsBar';
