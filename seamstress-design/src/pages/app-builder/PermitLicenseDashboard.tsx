import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { PageHeaderComposable } from '@opengov/components-page-header';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Import dashboard components
import MetricCard from '../../components/dashboard/MetricCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';
import PerformanceTable from '../../components/dashboard/PerformanceTable';

// Import mock data
import {
  permitLicenseMockData,
  getApplicationTypes,
  getReviewers,
  getStatuses,
} from '../../data/permitLicenseMockData';

/**
 * PermitLicenseDashboard - App Builder Operations Dashboard
 *
 * Tracks adoption, throughput, and performance of solutions built with
 * Government App Builder (e.g., permit applications, license forms, inspections).
 *
 * Monitors form submissions processed by App Builder apps across departments.
 *
 * Features:
 * - Key performance indicators (submissions, processing time, completion rate)
 * - Time series visualization of submission trends
 * - Backlog analysis by application
 * - Detailed record table with filtering and sorting
 * - Multi-select filters for apps, departments, and statuses
 */
const PermitLicenseDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Filter states
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Available filter options
  const availableApps = getApplicationTypes();
  const availableReviewers = getReviewers();
  const availableStatuses = getStatuses();

  // Handle filter changes
  const handleAppChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedApps(typeof value === 'string' ? value.split(',') : value);
  };

  const handleReviewerChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedReviewers(typeof value === 'string' ? value.split(',') : value);
  };

  const handleStatusChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedStatuses(typeof value === 'string' ? value.split(',') : value);
  };

  // Prepare data from mock
  const { kpis, timeSeriesData, backlogByType, applications } = permitLicenseMockData;

  // Filter applications based on selected filters
  const filteredRecords = applications.filter(app => {
    const appMatch = selectedApps.length === 0 || selectedApps.includes(app.applicationType);
    const reviewerMatch = selectedReviewers.length === 0 || selectedReviewers.includes(app.assignedReviewer);
    const statusMatch = selectedStatuses.length === 0 || selectedStatuses.includes(app.applicationStatus);
    return appMatch && reviewerMatch && statusMatch;
  });

  // Prepare time series chart data
  const timeSeriesChartData = timeSeriesData.map(point => ({
    timestamp: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    applications: point.applications,
  }));

  const timeSeriesSeries = [
    {
      dataKey: 'applications',
      name: 'Daily Submissions',
      color: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
    },
  ];

  // Prepare backlog bar chart data (top 15)
  const backlogChartData = backlogByType.slice(0, 15).map(item => ({
    appName: item.applicationType,
    openCount: item.openCount,
    color: item.color,
  }));

  // Helper function to format days
  const formatDays = (days: number): string => {
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  // Prepare records table configuration
  const recordTableColumns = [
    { id: 'applicationId', label: 'Application ID', sortable: true, width: '12%' },
    { id: 'applicationType', label: 'Application Type', sortable: true, width: '18%' },
    { id: 'applicantName', label: 'Applicant', sortable: true, width: '18%' },
    {
      id: 'applicationDate',
      label: 'Submitted',
      sortable: true,
      width: '12%',
      render: (value: string) => new Date(value).toLocaleDateString('en-US'),
    },
    {
      id: 'applicationStatus',
      label: 'Status',
      sortable: true,
      width: '14%',
      render: (value: string) => {
        const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
          Submitted: 'default',
          'In Review': 'info',
          Pending: 'warning',
          Approved: 'success',
          Rejected: 'error',
          Closed: 'default',
        };
        return (
          <Chip
            label={value}
            color={statusColors[value] || 'default'}
            size="small"
          />
        );
      },
    },
    { id: 'assignedReviewer', label: 'Reviewer', sortable: true, width: '14%' },
    {
      id: 'daysInStatus',
      label: 'Days in Status',
      sortable: true,
      width: '12%',
      align: 'right' as const,
      render: (value: number) => formatDays(value),
    },
  ];

  const recordTableRows = filteredRecords.map(app => ({
    id: app.applicationId,
    applicationId: app.applicationId,
    applicationType: app.applicationType,
    applicantName: app.applicantName,
    applicationDate: app.applicationDate,
    applicationStatus: app.applicationStatus,
    assignedReviewer: app.assignedReviewer,
    daysInStatus: app.daysInStatus,
    status: (app.applicationStatus === 'Approved' || app.applicationStatus === 'Closed'
      ? 'success'
      : app.applicationStatus === 'Rejected'
      ? 'error'
      : 'neutral') as const,
  }));

  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 1 }}>
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Typography variant="body2" fontWeight="bold">
              {payload[0].payload.appName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Open Records: {payload[0].value}
            </Typography>
          </CardContent>
        </Card>
      );
    }
    return null;
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
              App Builder Operations
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Track adoption, throughput, and performance of solutions built with App Builder
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Filters Section */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          px: 3,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Application</InputLabel>
            <Select
              multiple
              value={selectedApps}
              onChange={handleAppChange}
              input={<OutlinedInput label="Application" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableApps.map((app) => (
                <MenuItem key={app} value={app}>
                  {app}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Reviewer</InputLabel>
            <Select
              multiple
              value={selectedReviewers}
              onChange={handleReviewerChange}
              input={<OutlinedInput label="Reviewer" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableReviewers.map((reviewer) => (
                <MenuItem key={reviewer} value={reviewer}>
                  {reviewer}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={selectedStatuses}
              onChange={handleStatusChange}
              input={<OutlinedInput label="Status" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {availableStatuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
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
              1. Key Metrics Section
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Key Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <MetricCard
                  label={kpis.newApplications.label}
                  value={kpis.newApplications.value.toLocaleString()}
                  change={`${kpis.newApplications.changePercent > 0 ? '+' : ''}${kpis.newApplications.changePercent}%`}
                  changeType={kpis.newApplications.trend === 'up' ? 'positive' : 'negative'}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <MetricCard
                  label={kpis.avgDaysToDecision.label}
                  value={`${kpis.avgDaysToDecision.value} days`}
                  change={`${kpis.avgDaysToDecision.changePercent > 0 ? '+' : ''}${kpis.avgDaysToDecision.changePercent}%`}
                  changeType={kpis.avgDaysToDecision.trend === 'down' ? 'positive' : 'negative'}
                  icon={<AccessTimeIcon />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 250px', minWidth: '250px' }}>
                <MetricCard
                  label={kpis.approvedApplications.label}
                  value={kpis.approvedApplications.value.toLocaleString()}
                  change={`${kpis.approvedApplications.changePercent > 0 ? '+' : ''}${kpis.approvedApplications.changePercent}%`}
                  changeType={kpis.approvedApplications.trend === 'up' ? 'positive' : 'negative'}
                  icon={<CheckCircleIcon />}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              2. Workload & SLAs Section
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Workload & SLAs
            </Typography>
            <Grid container spacing={3}>
              {/* Records Over Time */}
              <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                <TimeSeriesChart
                  title="Records Over Time"
                  data={timeSeriesChartData}
                  series={timeSeriesSeries}
                  variant="area"
                  height={350}
                  valueFormatter={(value) => `${value} submissions`}
                />
              </Grid>

              {/* Open Backlog by App */}
              <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Open Backlog by Application
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Open applications grouped by permit or license type
                    </Typography>
                    <Box sx={{ mt: 2, height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={backlogChartData}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis
                            dataKey="appName"
                            type="category"
                            width={110}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip content={<CustomBarTooltip />} />
                          <Bar dataKey="openCount" radius={[0, 4, 4, 0]}>
                            {backlogChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              3. Record Detail Section
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Record Detail
            </Typography>
            <PerformanceTable
              title="Applications"
              columns={recordTableColumns}
              rows={recordTableRows}
              searchable
              paginated
              defaultRowsPerPage={25}
              maxHeight={600}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default PermitLicenseDashboard;
