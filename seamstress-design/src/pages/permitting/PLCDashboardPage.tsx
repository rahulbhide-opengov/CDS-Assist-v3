import React, { useEffect, useMemo } from 'react';

import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  Skeleton,
  Alert,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RemoveIcon from '@mui/icons-material/Remove';
import InboxIcon from '@mui/icons-material/Inbox';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { usePLCDashboardStore } from '../../stores/plcDashboardStore';
import { dataFormatters } from '../../utils/dataFormatters';

import type { PLCApplication, PLCApplicationStatus, PLCStatusDistribution } from '../../data/plcDataGenerators';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_CHIP_COLOR: Record<PLCApplicationStatus, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  'In Review': 'info',
  'Approved': 'success',
  'On Hold': 'warning',
  'Submitted': 'default',
  'Denied': 'error',
};

// ---------------------------------------------------------------------------
// MetricCard
// ---------------------------------------------------------------------------

function MetricCard({ label, value, change }: { label: string; value: string; change?: number }) {
  const isPositive = (change ?? 0) > 0;
  const isNegative = (change ?? 0) < 0;
  const TrendIcon = isPositive ? TrendingUpIcon : isNegative ? TrendingDownIcon : RemoveIcon;
  const trendColor = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary';

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h4" sx={{ my: 1 }}>{value}</Typography>
        {change != null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendIcon fontSize="small" color={isPositive ? 'success' : isNegative ? 'error' : 'action'} />
            <Typography variant="body2" color={trendColor}>
              {isPositive ? '+' : ''}{change}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// KPISection
// ---------------------------------------------------------------------------

function KPISection() {
  const kpis = usePLCDashboardStore((s) => s.kpis);
  if (!kpis) return null;

  const cards = [
    { label: 'Active Permits', value: dataFormatters.number(kpis.activePermits.value), change: kpis.activePermits.change },
    { label: 'Pending Reviews', value: dataFormatters.number(kpis.pendingReviews.value), change: kpis.pendingReviews.change },
    { label: 'Inspections Scheduled', value: dataFormatters.number(kpis.inspectionsScheduled.value), change: kpis.inspectionsScheduled.change },
    { label: 'Revenue This Month', value: dataFormatters.currency(kpis.revenueThisMonth.value), change: kpis.revenueThisMonth.change },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
      {cards.map((c) => <MetricCard key={c.label} {...c} />)}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// PermitActivityChart (recharts)
// ---------------------------------------------------------------------------

function PermitActivityChart() {
  const theme = useTheme();
  const monthlyData = usePLCDashboardStore((s) => s.monthlyData);

  const chartColors = useMemo(() => ({
    submitted: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
    approved: capitalDesignTokens.semanticColors.dataVisualization.sequence100,
    denied: capitalDesignTokens.semanticColors.dataVisualization.sequence200,
  }), []);

  return (
    <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Permit Activity</Typography>
          <Typography variant="caption" color="text.secondary">Last 12 months</Typography>
        </Stack>
        <Box aria-label="Bar chart showing permit submissions, approvals, and denials over the last 12 months">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}
                axisLine={{ stroke: theme.palette.divider }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: theme.typography.caption.fontSize, fill: theme.palette.text.secondary }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                  fontFamily: theme.typography.fontFamily as string,
                  fontSize: theme.typography.body2.fontSize,
                }}
              />
              <Legend wrapperStyle={{ fontFamily: theme.typography.fontFamily as string, fontSize: theme.typography.caption.fontSize }} />
              <Bar dataKey="submitted" name="Submitted" fill={chartColors.submitted} radius={[2, 2, 0, 0]} />
              <Bar dataKey="approved" name="Approved" fill={chartColors.approved} radius={[2, 2, 0, 0]} />
              <Bar dataKey="denied" name="Denied" fill={chartColors.denied} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// InspectionTrendChart (Highcharts — demonstrates the new Highcharts integration)
// ---------------------------------------------------------------------------

function InspectionTrendChart() {
  const theme = useTheme();
  const monthlyData = usePLCDashboardStore((s) => s.monthlyData);

  const options: Highcharts.Options = useMemo(() => ({
    chart: {
      type: 'areaspline',
      backgroundColor: 'transparent',
      height: 280,
      style: { fontFamily: theme.typography.fontFamily as string },
    },
    title: { text: undefined },
    xAxis: {
      categories: monthlyData.map((d) => d.month),
      labels: { style: { color: theme.palette.text.secondary, fontSize: theme.typography.caption.fontSize as string } },
      lineColor: theme.palette.divider,
      tickColor: 'transparent',
    },
    yAxis: {
      title: { text: undefined },
      labels: { style: { color: theme.palette.text.secondary, fontSize: theme.typography.caption.fontSize as string } },
      gridLineColor: theme.palette.divider,
    },
    tooltip: {
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      style: { color: theme.palette.text.primary, fontFamily: theme.typography.fontFamily as string },
    },
    legend: {
      itemStyle: { color: theme.palette.text.primary, fontFamily: theme.typography.fontFamily as string },
    },
    plotOptions: {
      areaspline: { fillOpacity: 0.15, marker: { radius: 3 } },
    },
    series: [
      {
        name: 'Submitted',
        type: 'areaspline' as const,
        data: monthlyData.map((d) => d.submitted),
        color: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
      },
      {
        name: 'Approved',
        type: 'areaspline' as const,
        data: monthlyData.map((d) => d.approved),
        color: capitalDesignTokens.semanticColors.dataVisualization.sequence100,
      },
    ],
    credits: { enabled: false },
  }), [monthlyData, theme]);

  return (
    <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Approval Trend</Typography>
        <Box aria-label="Area chart showing permit submission and approval trends">
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// StatusDistributionChart
// ---------------------------------------------------------------------------

function StatusDistributionChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const statusDistribution = usePLCDashboardStore((s) => s.statusDistribution);

  const resolvedColors = useMemo(
    () => statusDistribution.map((item: PLCStatusDistribution) => ({
      ...item,
      color: (theme.palette[item.paletteColor] as { main: string }).main,
    })),
    [statusDistribution, theme.palette],
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Status Distribution</Typography>
        {!isMobile ? (
          <Stack direction="row" spacing={3} alignItems="center">
            <Box aria-label="Donut chart showing permit status distribution">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={resolvedColors} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                    {resolvedColors.map((e) => <Cell key={e.label} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1.5} sx={{ flex: 1 }}>
              {resolvedColors.map((item) => (
                <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="body2">{item.label}</Typography>
                  </Stack>
                  <Typography variant="subtitle2">{item.value}%</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack direction="row" flexWrap="wrap" spacing={2} useFlexGap>
            {resolvedColors.map((item) => (
              <Stack key={item.label} direction="row" spacing={0.5} alignItems="center">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="caption" color="text.secondary">{item.label} {item.value}%</Typography>
              </Stack>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// RecentApplicationsTable
// ---------------------------------------------------------------------------

function RecentApplicationsTable() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const recentApplications = usePLCDashboardStore((s) => s.recentApplications);

  if (isSmall) {
    return (
      <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Recent Applications</Typography>
          <Stack spacing={0} divider={<Divider />}>
            {recentApplications.map((app: PLCApplication) => (
              <Box key={app.id} sx={{ py: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Link variant="body2" color="primary" underline="hover" href="#">{app.id}</Link>
                  <Chip label={app.status} size="small" color={STATUS_CHIP_COLOR[app.status] ?? 'default'} />
                </Stack>
                <Typography variant="body2">{app.recordType}</Typography>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="caption" color="text.secondary">{app.applicant}</Typography>
                  <Typography variant="caption" color="text.secondary">{app.submitted}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0, overflow: 'hidden' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="h6" sx={{ px: 2, pt: 2, pb: 1 }}>Recent Applications</Typography>
        <TableContainer>
          <Table size="small" aria-label="Recent permit applications">
            <TableHead>
              <TableRow>
                <TableCell>Application ID</TableCell>
                <TableCell>Record Type</TableCell>
                <TableCell>Applicant</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Assigned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentApplications.map((app: PLCApplication) => (
                <TableRow key={app.id} hover>
                  <TableCell>
                    <Link variant="body2" color="primary" underline="hover" href="#">{app.id}</Link>
                  </TableCell>
                  <TableCell>{app.recordType}</TableCell>
                  <TableCell>{app.applicant}</TableCell>
                  <TableCell>
                    <Chip label={app.status} size="small" color={STATUS_CHIP_COLOR[app.status] ?? 'default'} />
                  </TableCell>
                  <TableCell>{app.submitted}</TableCell>
                  <TableCell>{app.assigned}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// UpcomingInspections
// ---------------------------------------------------------------------------

function UpcomingInspections() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const upcomingInspections = usePLCDashboardStore((s) => s.upcomingInspections);

  return (
    <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Upcoming Inspections</Typography>
        <Stack spacing={0} divider={<Divider />}>
          {upcomingInspections.map((insp, idx) => (
            <Box key={idx} sx={{ py: 1.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="subtitle2">{insp.address}</Typography>
                  <Typography variant="caption" color="text.secondary">{insp.type}</Typography>
                </Box>
                <Stack alignItems="flex-end" sx={{ flexShrink: 0 }}>
                  <Typography variant="caption" color={insp.date === 'Today' ? 'warning.main' : 'text.secondary'}>
                    {insp.date}, {insp.time}
                  </Typography>
                  {!isMobile && (
                    <Typography variant="caption" color="text.secondary">{insp.inspector}</Typography>
                  )}
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Loading State
// ---------------------------------------------------------------------------

function DashboardSkeleton() {
  return (
    <Box
      component="main"
      sx={{
        maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
        mx: 'auto',
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
      }}
    >
      <Stack spacing={3}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Skeleton variant="rectangular" height={340} sx={{ flex: 2, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={340} sx={{ flex: 1, borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 1 }} />
      </Stack>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// PLCDashboardPage
// ---------------------------------------------------------------------------

const PLCDashboardPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { viewState, errorMessage, retry, fetchDashboard } = usePLCDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const headerActions = [
    <Button key="export" variant="outlined" color="secondary" size="medium" startIcon={<FileDownloadOutlinedIcon />}>
      Export
    </Button>,
    <Button key="new" variant="contained" color="primary" size="medium" startIcon={<AddIcon />}>
      New Permit
    </Button>,
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header actions={isMobile ? undefined : headerActions}>
            <PageHeaderComposable.Title>PLC Dashboard</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Overview of permits, licenses, inspections, and revenue across all record types.
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {isMobile && (
        <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
          <Button variant="outlined" color="secondary" size="small" fullWidth startIcon={<FileDownloadOutlinedIcon />}>
            Export
          </Button>
          <Button variant="contained" color="primary" size="small" fullWidth startIcon={<AddIcon />}>
            New Permit
          </Button>
        </Stack>
      )}

      {viewState === 'loading' && <DashboardSkeleton />}

      {viewState === 'error' && (
        <Box
          component="main"
          sx={{
            maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
          }}
        >
          <Alert
            severity="error"
            action={<Button size="small" onClick={retry}>Retry</Button>}
          >
            {errorMessage ?? 'Failed to load dashboard data. Please try again.'}
          </Alert>
        </Box>
      )}

      {viewState === 'empty' && (
        <Box
          component="main"
          sx={{
            maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
            textAlign: 'center',
          }}
        >
          <InboxIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No permit data yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Get started by creating your first permit application.
          </Typography>
          <Button variant="contained" startIcon={<AddIcon />}>Create First Permit</Button>
        </Box>
      )}

      {viewState === 'success' && (
        <Box
          component="main"
          sx={{
            maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            py: 3,
          }}
        >
          <Stack spacing={3}>
            <KPISection />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <PermitActivityChart />
              <InspectionTrendChart />
            </Box>

            <StatusDistributionChart />

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
              <RecentApplicationsTable />
              <UpcomingInspections />
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default PLCDashboardPage;
