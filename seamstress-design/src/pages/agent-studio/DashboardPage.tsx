import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { getSequentialColors, statusColors, getAllColors } from '../../constants/dataVizColors';
import { DataVizPatternDefs, getFillWithPattern } from '../../constants/dataVizPatterns';

// Import dashboard components
import MetricCard from '../../components/dashboard/MetricCard';
import GoalProgressCard from '../../components/dashboard/GoalProgressCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';
import PerformanceTable from '../../components/dashboard/PerformanceTable';
import SatisfactionGauge from '../../components/dashboard/SatisfactionGauge';
import LatencyDistributionChart from '../../components/dashboard/LatencyDistributionChart';
import FeedbackTimelineCard from '../../components/dashboard/FeedbackTimelineCard';
import CostBreakdownChart from '../../components/dashboard/CostBreakdownChart';

// Import mock data
import {
  dashboardMockData,
  getTopAgentsBySatisfaction,
  getTopSkills,
  getRecentFeedback,
  getUnresolvedViolations,
  calculateOverallSatisfaction,
  getTotalModelCost,
} from '../../data/dashboardMockData';

// Time window type
type TimeWindow = 'daily' | 'weekly' | 'monthly';

/**
 * DashboardPageV2 - Comprehensive observability dashboard
 *
 * Features all visualization components with real-time metrics,
 * agent performance tracking, feedback analysis, cost management,
 * and system health monitoring.
 */
const DashboardPageV2: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Time window state
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('weekly');

  // Handle time window change
  const handleTimeWindowChange = (
    _event: React.MouseEvent<HTMLElement>,
    newWindow: TimeWindow | null
  ) => {
    if (newWindow !== null) {
      setTimeWindow(newWindow);
    }
  };

  // Prepare data from mock
  const { heroKPIs, goalMetrics, agentPerformance, skillUsage, toolCallStats, feedbackData, modelProviderStats, guardrailViolations, feedbackFlywheel } = dashboardMockData;

  const topAgents = getTopAgentsBySatisfaction(6);
  const topSkills = getTopSkills(10);
  const recentFeedback = getRecentFeedback(10);
  const unresolvedViolations = getUnresolvedViolations();
  const overallSatisfaction = calculateOverallSatisfaction();
  const totalCost = getTotalModelCost();

  // Prepare latency distribution data (histogram bins)
  const latencyDistributionData = [
    { range: '0-0.5', count: 1234, start: 0, end: 0.5 },
    { range: '0.5-1', count: 2456, start: 0.5, end: 1 },
    { range: '1-1.5', count: 3421, start: 1, end: 1.5 },
    { range: '1.5-2', count: 2890, start: 1.5, end: 2 },
    { range: '2-3', count: 1678, start: 2, end: 3 },
    { range: '3-5', count: 891, start: 3, end: 5 },
    { range: '5+', count: 234, start: 5, end: 10 },
  ];

  // Prepare feedback timeline items
  const feedbackTimelineItems = recentFeedback.map(f => ({
    id: f.id,
    rating: f.rating === 'positive' ? 5 : 2,
    comment: f.comment || 'No comment provided',
    userName: f.userId.replace('user-', 'User '),
    agentName: f.agentId.replace('agent-', 'Agent '),
    timestamp: new Date(f.timestamp).toLocaleString(),
    category: f.category,
  }));

  // Prepare cost breakdown data with varied colors for each model
  const costProviderData = modelProviderStats.map((provider, idx) => {
    // Use our new comprehensive color palette
    const colorPalette = getSequentialColors(6);

    return {
      label: provider.model,
      cost: provider.cost,
      volume: provider.callCount,
      breakdown: [
        {
          category: provider.provider,
          cost: provider.cost,
          color: colorPalette[idx % colorPalette.length],
        },
      ],
    };
  });

  // Prepare agent performance table data
  const agentTableColumns = [
    { id: 'name', label: 'Agent Name', sortable: true, width: '25%' },
    { id: 'tasksCount', label: 'Tasks', align: 'right' as const, sortable: true },
    { id: 'satisfactionRate', label: 'Satisfaction', align: 'right' as const, sortable: true, render: (value: number) => `${value.toFixed(1)}%` },
    { id: 'successRate', label: 'Success Rate', align: 'right' as const, sortable: true, render: (value: number) => `${value.toFixed(1)}%` },
    { id: 'avgResponseTime', label: 'Avg Response', align: 'right' as const, sortable: true, render: (value: number) => `${value.toFixed(1)}s` },
  ];

  const agentTableRows = topAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    tasksCount: agent.tasksCount,
    satisfactionRate: agent.satisfactionRate,
    successRate: agent.successRate,
    avgResponseTime: agent.avgResponseTime,
    status: agent.status === 'active' ? 'success' : 'warning' as const,
    highlight: agent.satisfactionRate >= 95,
  }));

  // Prepare skill performance table data
  const skillTableColumns = [
    { id: 'name', label: 'Skill Name', sortable: true, width: '30%' },
    { id: 'executionsCount', label: 'Executions', align: 'right' as const, sortable: true },
    { id: 'successRate', label: 'Success Rate', align: 'right' as const, sortable: true, render: (value: number) => `${value.toFixed(1)}%` },
    { id: 'avgExecutionTime', label: 'Avg Time', align: 'right' as const, sortable: true, render: (value: number) => `${value.toFixed(1)}s` },
  ];

  const skillTableRows = topSkills.map(skill => ({
    id: skill.id,
    name: skill.name,
    executionsCount: skill.executionsCount,
    successRate: skill.successRate,
    avgExecutionTime: skill.avgExecutionTime,
    status: skill.successRate >= 95 ? 'success' : (skill.successRate >= 90 ? 'warning' : 'error') as const,
  }));

  // Prepare tool performance table data
  const toolTableColumns = [
    { id: 'name', label: 'Tool Name', sortable: true, width: '30%' },
    { id: 'callCount', label: 'Calls', align: 'right' as const, sortable: true },
    { id: 'avgLatency', label: 'Latency', align: 'right' as const, sortable: true, render: (value: number) => `${value}ms` },
    { id: 'errorRate', label: 'Error Rate', align: 'right' as const, sortable: true, render: (value: number) => `${value.toFixed(1)}%` },
  ];

  const toolTableRows = toolCallStats.slice(0, 10).map(tool => ({
    id: tool.id,
    name: tool.name,
    callCount: tool.callCount,
    avgLatency: tool.avgLatency,
    errorRate: tool.errorRate,
    status: tool.errorRate < 1 ? 'success' : (tool.errorRate < 3 ? 'warning' : 'error') as const,
  }));

  // Prepare time series data for agent usage
  const agentUsageSeriesData = agentPerformance.slice(0, 3).map((agent, idx) => {
    const colors = getSequentialColors(3);
    return {
      dataKey: agent.id,
      name: agent.name,
      color: colors[idx],
    };
  });

  // Combine time series data from multiple agents
  const combinedTimeSeriesData = agentPerformance[0].timeSeriesData.map((point, idx) => {
    const dataPoint: any = {
      timestamp: new Date(point.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    agentPerformance.slice(0, 3).forEach(agent => {
      dataPoint[agent.id] = agent.timeSeriesData[idx]?.value || 0;
    });
    return dataPoint;
  });

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <ToggleButtonGroup
              key="time-window"
              value={timeWindow}
              exclusive
              onChange={handleTimeWindowChange}
              size="medium"
              aria-label="Select time period"
            >
              <ToggleButton value="daily">Daily</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
          ]}
        >
          <PageHeaderComposable.Title>Agent Studio Dashboard</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Real-time observability, usage analytics, and performance metrics
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Content Area */}
      <Box
        sx={{
          backgroundColor: 'background.secondary',
          py: 3,
          px: 3,
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          marginX: 'auto',
        }}
      >
        <Stack spacing={6}>
          {/* ================================================================
              1. Hero Metrics Row (KPI Cards)
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="kpi-heading">
            <Typography variant="h2" id="kpi-heading" gutterBottom>
              Key Performance Indicators
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  label: heroKPIs.totalTasks.label,
                  value: heroKPIs.totalTasks.value.toLocaleString(),
                  changePercentage: heroKPIs.totalTasks.changePercent,
                },
                {
                  label: heroKPIs.activeAgents.label,
                  value: heroKPIs.activeAgents.value.toLocaleString(),
                  changePercentage: heroKPIs.activeAgents.changePercent,
                },
                {
                  label: heroKPIs.satisfactionRate.label,
                  value: `${heroKPIs.satisfactionRate.value}%`,
                  changePercentage: heroKPIs.satisfactionRate.changePercent,
                },
                {
                  label: heroKPIs.activeUsers.label,
                  value: heroKPIs.activeUsers.value.toLocaleString(),
                  changePercentage: heroKPIs.activeUsers.changePercent,
                },
                {
                  label: heroKPIs.successRate.label,
                  value: `${heroKPIs.successRate.value}%`,
                  changePercentage: heroKPIs.successRate.changePercent,
                },
                {
                  label: heroKPIs.totalMessages.label,
                  value: heroKPIs.totalMessages.value.toLocaleString(),
                  changePercentage: heroKPIs.totalMessages.changePercent,
                },
              ].map(({ label, value, changePercentage, icon }) => (
                <Grid key={label} sx={{ flex: '1 1 200px' }} minWidth="200px">
                  <MetricCard
                    label={label}
                    value={value}
                    changePercentage={changePercentage}
                    icon={icon}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* ================================================================
              2. Agent Performance Section
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="agent-performance-heading">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
              // alignItems={{ xs: 'stretch', sm: 'center' }}
              spacing={{ xs: 1.5, sm: 0 }}
              mb={1}
            >
              <Typography variant="h2" id="agent-performance-heading" gutterBottom>
                Agent Performance
              </Typography>
              <Button
                variant="outlined"
                size="medium"
                onClick={() => navigate('/agent-studio/agents')}
                startIcon={<TrendingUpIcon />}
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                View All Agents
              </Button>
            </Stack>

            <Stack spacing={2}>
              <TimeSeriesChart
                title="Agent Usage Over Time (Last 30 Days)"
                data={combinedTimeSeriesData}
                series={agentUsageSeriesData}
                variant="area"
                timeWindows={['daily', 'weekly', 'monthly']}
                defaultTimeWindow="daily"
                height={300}
              />

              <PerformanceTable
                title="Top Performing Agents"
                columns={agentTableColumns}
                rows={agentTableRows}
                searchable
                paginated
                defaultRowsPerPage={5}
                maxHeight={500}
              />
            </Stack>
          </Box>

          {/* ================================================================
              3. Goal Tracking Section
              ================================================================ */}


          {/* ================================================================
              4. System Health Overview (2-column grid)
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="system-health-heading">
            <Typography variant="h2" id="system-health-heading" gutterBottom>
              System Health Overview
            </Typography>
            <Grid container spacing={3}>
              {/* Left column: Satisfaction Gauge + Summary */}
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <Stack spacing={2}>
                  <SatisfactionGauge
                    label="Overall Satisfaction"
                    value={overallSatisfaction}
                    sublabel={`Based on ${feedbackData.length} feedback entries`}
                    size="medium"
                  />
                  <Card>
                    <CardContent>
                      <Typography variant="h3" gutterBottom>
                        Agent Performance Summary
                      </Typography>
                      <Stack spacing={1.5}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Total Agents
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {agentPerformance.length}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Active Agents
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {agentPerformance.filter(a => a.status === 'active').length}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Avg Response Time
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {heroKPIs.avgResponseTime.value}s
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Agents with 95%+ Satisfaction
                          </Typography>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            {agentPerformance.filter(a => a.satisfactionRate >= 95).length}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>

              {/* Right column: Latency Distribution */}
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <LatencyDistributionChart
                  title="Response Time Distribution"
                  data={latencyDistributionData}
                  percentiles={{ p50: 1.2, p90: 2.1, p95: 2.8, p99: 4.3 }}
                  thresholds={[
                    { value: 3, label: 'Target SLA', color: statusColors.error },
                  ]}
                  unit="s"
                  height={400}
                  valueFormatter={(value) => `${value.toFixed(1)}s`}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              5. Feedback & Sentiment Section
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="feedback-heading">
            <Typography variant="h2" id="feedback-heading" gutterBottom>
              Feedback & Sentiment Analysis
            </Typography>
            <Grid container spacing={3}>
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <FeedbackTimelineCard
                  title="Recent Feedback"
                  feedbackItems={feedbackTimelineItems}
                  maxHeight={500}
                />
              </Grid>
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <Card>
                  <CardContent>
                    <Typography variant="h3" gutterBottom>
                      Feedback Processing Flywheel
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Queue Status
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          <Chip
                            label={`${feedbackFlywheel.feedbackQueue.pending} Pending`}
                            size="small"
                            color="warning"
                          />
                          <Chip
                            label={`${feedbackFlywheel.feedbackQueue.processing} Processing`}
                            size="small"
                            color="info"
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          Avg wait time: {feedbackFlywheel.feedbackQueue.avgWaitTime}h
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Assessments
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={`${feedbackFlywheel.assessments.completed} Completed`}
                            size="small"
                            color="success"
                          />
                          <Chip
                            label={`${feedbackFlywheel.assessments.pending} Pending`}
                            size="small"
                            color="default"
                          />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                          Avg completion: {feedbackFlywheel.assessments.avgCompletionTime}h
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Suggested Changes
                        </Typography>
                        <Stack spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Pending OG Review:</Typography>
                            <Typography variant="caption" fontWeight="bold">
                              {feedbackFlywheel.suggestedChanges.pendingOGReview}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Approved:</Typography>
                            <Typography variant="caption" fontWeight="bold" color="success.main">
                              {feedbackFlywheel.suggestedChanges.approved}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Rejected:</Typography>
                            <Typography variant="caption" fontWeight="bold" color="error.main">
                              {feedbackFlywheel.suggestedChanges.rejected}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Implementation
                        </Typography>
                        <Stack spacing={0.5}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Changes Implemented:</Typography>
                            <Typography variant="caption" fontWeight="bold">
                              {feedbackFlywheel.implementation.changesImplemented}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Success Rate:</Typography>
                            <Typography variant="caption" fontWeight="bold" color="success.main">
                              {feedbackFlywheel.implementation.successRate.toFixed(1)}%
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">Avg Implementation Time:</Typography>
                            <Typography variant="caption" fontWeight="bold">
                              {feedbackFlywheel.implementation.avgImplementationTime} days
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              6. Skill & Tool Analytics (2-column layout)
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="skill-analytics-heading">
            <Typography variant="h2" id="skill-analytics-heading" gutterBottom>
              Skill & Tool Analytics
            </Typography>
            <Grid container spacing={3}>
              {/* Left: Skill usage */}
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <Stack spacing={2}>
                  <PerformanceTable
                    title="Top Skills by Execution Count"
                    columns={skillTableColumns}
                    rows={skillTableRows}
                    searchable
                    paginated
                    defaultRowsPerPage={5}
                    maxHeight={500}
                    actions={[
                      {
                        label: 'View',
                        onClick: () => navigate('/agent-studio/skills'),
                        variant: 'text',
                        color: 'primary',
                      },
                    ]}
                  />
                </Stack>
              </Grid>

              {/* Right: Tool call stats */}
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <Stack spacing={2}>
                  <PerformanceTable
                    title="Tool Performance Metrics"
                    columns={toolTableColumns}
                    rows={toolTableRows}
                    searchable
                    paginated
                    defaultRowsPerPage={5}
                    maxHeight={500}
                    actions={[
                      {
                        label: 'View',
                        onClick: () => navigate('/agent-studio/tools'),
                        variant: 'text',
                        color: 'primary',
                      },
                    ]}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              7. Cost & Resource Management
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="cost-management-heading">
            <Typography variant="h2" id="cost-management-heading" gutterBottom>
              Cost & Resource Management
            </Typography>
            <Grid container spacing={3}>
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <CostBreakdownChart
                  title="Cost Breakdown by Model Provider"
                  providerData={costProviderData}
                  availableViews={['provider']}
                  defaultView="provider"
                  currencySymbol="$"
                  volumeLabel="API Calls"
                  height={350}
                  showDualAxis
                />
              </Grid>
              <Grid sx={{ flex: { xs: '1 1 100%', md: '1 1 200px' }, minWidth: { xs: '100%', md: '200px' } }}>
                <Stack spacing={2}>
                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Cost
                      </Typography>
                      <Typography variant="h3" color="primary.main">
                        ${totalCost.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Current period
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Total Token Usage
                      </Typography>
                      <Typography variant="h3" color="secondary.main">
                        {(modelProviderStats.reduce((sum, p) => sum + p.tokenCount.total, 0) / 1000000).toFixed(1)}M
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Input + Output tokens
                      </Typography>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Cost Efficiency
                      </Typography>
                      <Typography variant="h3" color="success.main">
                        ${(totalCost / heroKPIs.totalTasks.value).toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Cost per task
                      </Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              8. Observability Deep Dive (expandable section)
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="observability-heading">
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="h2" id="observability-heading">
                    Observability Deep Dive
                  </Typography>
                  {unresolvedViolations.length > 0 && (
                    <Chip
                      label={`${unresolvedViolations.length} Unresolved Issues`}
                      size="small"
                      color="error"
                    />
                  )}
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={3}>
                  {/* Guardrail Violations Summary */}
                  <Box>
                    <Typography variant="h3" gutterBottom>
                      Guardrail Violations
                    </Typography>
                    {unresolvedViolations.length > 0 ? (
                      <Stack spacing={1}>
                        {unresolvedViolations.map(violation => (
                          <Alert
                            key={violation.id}
                            severity={
                              violation.severity === 'critical' || violation.severity === 'high'
                                ? 'error'
                                : violation.severity === 'medium'
                                  ? 'warning'
                                  : 'info'
                            }
                          >
                            <Typography variant="subtitle2">
                              {violation.violationType.replace(/_/g, ' ').toUpperCase()}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {violation.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Agent: {violation.agentId} | Action: {violation.action}
                            </Typography>
                          </Alert>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="success">No unresolved guardrail violations</Alert>
                    )}
                  </Box>

                  {/* Model Provider Health Status */}
                  <Box>
                    <Typography variant="h3" gutterBottom>
                      Model Provider Health Status
                    </Typography>
                    <Grid container spacing={2}>
                      {modelProviderStats.map(provider => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`${provider.provider}-${provider.model}`}>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" gutterBottom noWrap>
                                {provider.model}
                              </Typography>
                              <Stack spacing={1}>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    Calls:
                                  </Typography>
                                  <Typography variant="caption" fontWeight="bold">
                                    {provider.callCount.toLocaleString()}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    Avg Latency:
                                  </Typography>
                                  <Typography variant="caption" fontWeight="bold">
                                    {provider.avgLatency}ms
                                  </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                  <Typography variant="caption" color="text.secondary">
                                    Error Rate:
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    fontWeight="bold"
                                    color={provider.errorRate < 1 ? 'success.main' : 'error.main'}
                                  >
                                    {provider.errorRate.toFixed(1)}%
                                  </Typography>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Recent Errors/Warnings */}
                  <Box>
                    <Typography variant="h3" gutterBottom>
                      Recent Errors & Warnings
                    </Typography>
                    <Alert severity="info">
                      No recent errors or warnings. All systems operational.
                    </Alert>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default DashboardPageV2;
