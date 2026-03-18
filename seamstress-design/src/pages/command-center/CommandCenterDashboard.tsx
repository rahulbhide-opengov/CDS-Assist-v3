import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  AlertTitle,
  Divider,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BuildIcon from '@mui/icons-material/Build';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Import dashboard components
import MetricCard from '../../components/dashboard/MetricCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';
import PerformanceTable from '../../components/dashboard/PerformanceTable';

// Import mock data
import {
  commandCenterMockData,
  formatTimeAgo,
  type DepartmentAlert,
  type PerformanceMetric,
} from '../../data/commandCenterMockData';

/**
 * CommandCenterDashboard - Executive overview of all operational areas
 *
 * Features:
 * - Cross-functional KPIs from Permitting, Procurement, Financials, and EAM
 * - Real-time department alerts with severity levels
 * - Multi-metric time series trends
 * - Performance tracking against targets
 * - Quick navigation to detailed dashboards
 */
const CommandCenterDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Extract data from mock
  const { kpis, timeSeriesData, alerts, performanceMetrics } = commandCenterMockData;

  // Prepare time series data for chart
  const timeSeriesChartData = timeSeriesData.map((point) => ({
    timestamp: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    permits: point.permittingVolume,
    solicitations: point.procurementVolume,
    spend: point.financialSpend / 100000, // Convert to hundreds of thousands for scale
    workOrders: point.eamWorkOrders,
  }));

  // Prepare performance table data
  const performanceTableColumns = [
    { id: 'categoryLabel', label: 'Area', sortable: true, width: '20%' },
    { id: 'metric', label: 'Metric', sortable: true, width: '30%' },
    {
      id: 'current',
      label: 'Current',
      sortable: true,
      align: 'right' as const,
      width: '15%',
      render: (value: number, row: any) => `${value}${row.unit}`,
    },
    {
      id: 'target',
      label: 'Target',
      sortable: true,
      align: 'right' as const,
      width: '15%',
      render: (value: number, row: any) => `${value}${row.unit}`,
    },
    {
      id: 'status',
      label: 'Status',
      sortable: true,
      align: 'center' as const,
      width: '20%',
      render: (value: string) => {
        const statusColors: { [key: string]: 'success' | 'warning' | 'error' | 'default' } = {
          'on-track': 'success',
          'at-risk': 'warning',
          'off-track': 'error',
        };
        const statusLabels: { [key: string]: string } = {
          'on-track': 'On Track',
          'at-risk': 'At Risk',
          'off-track': 'Off Track',
        };
        return (
          <Chip
            label={statusLabels[value] || value}
            size="small"
            color={statusColors[value] || 'default'}
            sx={{ minWidth: 80 }}
          />
        );
      },
    },
  ];

  const performanceTableRows = performanceMetrics.map((metric, idx) => ({
    id: `metric-${idx}`,
    categoryLabel: metric.categoryLabel,
    metric: metric.metric,
    current: metric.current,
    target: metric.target,
    unit: metric.unit,
    status: metric.status,
    // Highlight off-track metrics
    highlight: metric.status === 'off-track',
    highlightStatus: metric.status === 'off-track' ? 'error' : (metric.status === 'at-risk' ? 'warning' : 'neutral') as const,
  }));

  // Get severity icon and color
  const getSeverityConfig = (severity: DepartmentAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <ErrorIcon />,
          color: theme.palette.error.main,
          bgColor: theme.palette.error.light + '20',
        };
      case 'warning':
        return {
          icon: <WarningIcon />,
          color: theme.palette.warning.main,
          bgColor: theme.palette.warning.light + '20',
        };
      case 'info':
        return {
          icon: <InfoIcon />,
          color: theme.palette.info.main,
          bgColor: theme.palette.info.light + '20',
        };
    }
  };

  // Get category navigation path
  const getCategoryPath = (category: string) => {
    switch (category) {
      case 'permitting':
        return '/permitting/dashboard';
      case 'procurement':
        return '/procurement/dashboard';
      case 'financials':
        return '/financials/dashboard';
      case 'eam':
        return '/eam/analytics';
      default:
        return '/';
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          '& > div': {
            px: 3,
            py: 2.5,
          },
          '& > div > div': {
            px: 0,
          },
        }}
      >
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>
              Command Center
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Executive overview of operations across Permitting, Procurement, Financials, and Asset Management.
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          backgroundColor: 'background.secondary',
          padding: 3,
        }}
      >
        <Stack spacing={3}>
          {/* ================================================================
              Department Alerts
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Department Alerts
            </Typography>
            <Grid container spacing={2}>
              {alerts.map((alert) => {
                const config = getSeverityConfig(alert.severity);
                return (
                  <Grid key={alert.id} sx={{ flex: '1 1 300px', minWidth: isMobile ? '100%' : '300px' }}>
                    <Card
                      sx={{
                        height: '100%',
                        borderLeft: `4px solid ${config.color}`,
                        backgroundColor: config.bgColor,
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1.5}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: config.color }}>
                              {config.icon}
                              <Typography variant="subtitle2" fontWeight="600">
                                {alert.department}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(alert.timestamp)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight="500">
                            {alert.message}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="caption" color="text.secondary" display="block">
                                {alert.metric}
                              </Typography>
                              <Typography variant="body2" fontWeight="600">
                                {alert.value}
                              </Typography>
                            </Box>
                            <Button
                              size="small"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() => navigate(getCategoryPath(alert.category))}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* ================================================================
              Permitting & Licensing KPIs
              ================================================================ */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AssignmentIcon sx={{ color: capitalDesignTokens.semanticColors.dataVisualization.sequence300 }} />
              <Typography variant="h2">
                Permitting & Licensing
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.permitApplications.label}
                  value={kpis.permitApplications.value}
                  icon={<AssignmentIcon />}
                  trend={kpis.permitApplications.trend}
                  changePercent={kpis.permitApplications.changePercent}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.permitBacklog.label}
                  value={kpis.permitBacklog.value}
                  icon={<WarningIcon />}
                  trend={kpis.permitBacklog.trend}
                  changePercent={kpis.permitBacklog.changePercent}
                  status="warning"
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.avgPermitDays.label}
                  value={`${kpis.avgPermitDays.value}${kpis.avgPermitDays.unit}`}
                  icon={<TrendingDownIcon />}
                  trend={kpis.avgPermitDays.trend}
                  changePercent={kpis.avgPermitDays.changePercent}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              Procurement KPIs
              ================================================================ */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ShoppingCartIcon sx={{ color: capitalDesignTokens.semanticColors.dataVisualization.sequence500 }} />
              <Typography variant="h2">
                Procurement
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.openSolicitations.label}
                  value={kpis.openSolicitations.value}
                  icon={<ShoppingCartIcon />}
                  trend={kpis.openSolicitations.trend}
                  changePercent={kpis.openSolicitations.changePercent}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.procurementCompliance.label}
                  value={`${kpis.procurementCompliance.value}${kpis.procurementCompliance.unit}`}
                  icon={<DashboardIcon />}
                  trend={kpis.procurementCompliance.trend}
                  changePercent={kpis.procurementCompliance.changePercent}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.avgAwardDays.label}
                  value={`${kpis.avgAwardDays.value}${kpis.avgAwardDays.unit}`}
                  icon={<TrendingDownIcon />}
                  trend={kpis.avgAwardDays.trend}
                  changePercent={kpis.avgAwardDays.changePercent}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              Financials KPIs
              ================================================================ */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccountBalanceIcon sx={{ color: capitalDesignTokens.semanticColors.dataVisualization.sequence700 }} />
              <Typography variant="h2">
                Financials
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.budgetConsumed.label}
                  value={`${kpis.budgetConsumed.value}${kpis.budgetConsumed.unit}`}
                  icon={<AccountBalanceIcon />}
                  trend={kpis.budgetConsumed.trend}
                  changePercent={kpis.budgetConsumed.changePercent}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.overbudgetAccounts.label}
                  value={kpis.overbudgetAccounts.value}
                  icon={<ErrorIcon />}
                  trend={kpis.overbudgetAccounts.trend}
                  changePercent={kpis.overbudgetAccounts.changePercent}
                  status="error"
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.monthlySpend.label}
                  value={kpis.monthlySpend.value}
                  icon={<TrendingUpIcon />}
                  trend={kpis.monthlySpend.trend}
                  changePercent={kpis.monthlySpend.changePercent}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              Asset & Work Management KPIs
              ================================================================ */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <BuildIcon sx={{ color: capitalDesignTokens.semanticColors.dataVisualization.sequence900 }} />
              <Typography variant="h2">
                Asset & Work Management
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.workOrdersCreated.label}
                  value={kpis.workOrdersCreated.value}
                  icon={<BuildIcon />}
                  trend={kpis.workOrdersCreated.trend}
                  changePercent={kpis.workOrdersCreated.changePercent}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.workOrderCompletion.label}
                  value={`${kpis.workOrderCompletion.value}${kpis.workOrderCompletion.unit}`}
                  icon={<WarningIcon />}
                  trend={kpis.workOrderCompletion.trend}
                  changePercent={kpis.workOrderCompletion.changePercent}
                  status="warning"
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label={kpis.preventiveRatio.label}
                  value={`${kpis.preventiveRatio.value}${kpis.preventiveRatio.unit}`}
                  icon={<ErrorIcon />}
                  trend={kpis.preventiveRatio.trend}
                  changePercent={kpis.preventiveRatio.changePercent}
                  status="error"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              Cross-Functional Trends
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Cross-Functional Activity Trends
            </Typography>
            <TimeSeriesChart
              title="Weekly Activity Across All Operations"
              description="Normalized view of operational volume across departments"
              data={timeSeriesChartData}
              series={[
                {
                  dataKey: 'permits',
                  name: 'Permit Applications',
                  color: capitalDesignTokens.semanticColors.dataVisualization.sequence300,
                },
                {
                  dataKey: 'solicitations',
                  name: 'Solicitations',
                  color: capitalDesignTokens.semanticColors.dataVisualization.sequence500,
                },
                {
                  dataKey: 'spend',
                  name: 'Spend ($100K)',
                  color: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
                },
                {
                  dataKey: 'workOrders',
                  name: 'Work Orders',
                  color: capitalDesignTokens.semanticColors.dataVisualization.sequence900,
                },
              ]}
              variant="line"
              timeWindows={['weekly']}
              defaultTimeWindow="weekly"
              height={350}
            />
          </Box>

          {/* ================================================================
              Performance Against Targets
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Performance Against Targets
            </Typography>
            <PerformanceTable
              title="Key Performance Indicators"
              description="Track progress against organizational targets across all operational areas"
              columns={performanceTableColumns}
              rows={performanceTableRows}
              searchable
              searchPlaceholder="Search metrics..."
              defaultRowsPerPage={10}
              rowsPerPageOptions={[10, 25, 50]}
              maxHeight={500}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CommandCenterDashboard;
