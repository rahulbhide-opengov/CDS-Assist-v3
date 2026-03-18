import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
  useTheme,
  useMediaQuery,
  Chip,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Toolbar } from '../../components/Toolbar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TimerIcon from '@mui/icons-material/Timer';
import BuildIcon from '@mui/icons-material/Build';
import ClearIcon from '@mui/icons-material/Clear';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Import dashboard components
import MetricCard from '../../components/dashboard/MetricCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';
import BarChart from '../../components/dashboard/BarChart';
import PerformanceTable from '../../components/dashboard/PerformanceTable';

// Import mock data
import {
  eamMockData,
  getAssetTypes,
  getCrews,
  getWorkOrderStatuses,
  formatCurrency,
  formatHours,
  type WorkOrder,
} from '../../data/eamMockData';

/**
 * Filter state interface
 */
interface DashboardFilters {
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  assetTypes: string[];
  crews: string[];
  statuses: string[];
}

/**
 * EAMAnalyticsDashboard - Comprehensive dashboard for Asset & Work Management
 *
 * Features:
 * - KPI tracking: Work orders created, completion rate, duration, preventive ratio
 * - Time series visualization of work order trends
 * - Work order distribution by asset type
 * - Detailed work order table with filtering and sorting
 * - Advanced filtering by date range, asset type, crew, and status
 */
const EAMAnalyticsDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get available filter options
  const availableAssetTypes = useMemo(() => getAssetTypes(), []);
  const availableCrews = useMemo(() => getCrews(), []);
  const availableStatuses = useMemo(() => getWorkOrderStatuses(), []);

  // Initialize default date range (last 90 days)
  const defaultEndDate = new Date();
  const defaultStartDate = new Date();
  defaultStartDate.setDate(defaultStartDate.getDate() - 90);

  // Filter state
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      start: defaultStartDate,
      end: defaultEndDate,
    },
    assetTypes: [],
    crews: [],
    statuses: [],
  });

  // Extract raw data from mock
  const { workOrders: allWorkOrders, timeSeriesData: allTimeSeriesData } = eamMockData;

  // Apply filters to work orders
  const filteredWorkOrders = useMemo(() => {
    return allWorkOrders.filter((wo) => {
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const woDate = new Date(wo.workOrderDate);
        if (filters.dateRange.start && woDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && woDate > filters.dateRange.end) return false;
      }

      // Asset type filter
      if (filters.assetTypes.length > 0 && !filters.assetTypes.includes(wo.assetType)) {
        return false;
      }

      // Crew filter
      if (filters.crews.length > 0 && !filters.crews.includes(wo.crewName)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(wo.workOrderStatus)) {
        return false;
      }

      return true;
    });
  }, [allWorkOrders, filters]);

  // Calculate filtered KPIs
  const filteredKPIs = useMemo(() => {
    const workOrdersCount = filteredWorkOrders.length;

    const completedCount = filteredWorkOrders.filter(
      wo => wo.workOrderStatus === 'Completed'
    ).length;
    const completionRate = workOrdersCount > 0 ? (completedCount / workOrdersCount) * 100 : 0;

    const completedWOs = filteredWorkOrders.filter(wo => wo.workOrderStatus === 'Completed' && wo.durationHours > 0);
    const avgDuration = completedWOs.length > 0
      ? completedWOs.reduce((sum, wo) => sum + wo.durationHours, 0) / completedWOs.length
      : 0;

    const preventiveCount = filteredWorkOrders.filter(wo => wo.workOrderType === 'Preventive').length;
    const preventiveRatio = workOrdersCount > 0 ? (preventiveCount / workOrdersCount) * 100 : 0;

    return {
      workOrdersCreated: workOrdersCount,
      completionRate: completionRate.toFixed(1),
      avgWorkOrderDuration: avgDuration.toFixed(1),
      preventiveRatio: preventiveRatio.toFixed(1),
    };
  }, [filteredWorkOrders]);

  // Calculate filtered time series
  const filteredTimeSeriesData = useMemo(() => {
    if (!filters.dateRange.start && !filters.dateRange.end) {
      return allTimeSeriesData;
    }

    return allTimeSeriesData.filter((point) => {
      const pointDate = new Date(point.date);
      if (filters.dateRange.start && pointDate < filters.dateRange.start) return false;
      if (filters.dateRange.end && pointDate > filters.dateRange.end) return false;
      return true;
    });
  }, [allTimeSeriesData, filters.dateRange]);

  // Calculate filtered work orders by asset type
  const filteredAssetTypeData = useMemo(() => {
    const assetGroups = filteredWorkOrders.reduce((acc, wo) => {
      acc[wo.assetType] = (acc[wo.assetType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(assetGroups)
      .map(([assetType, count]) => ({
        assetType,
        workOrderCount: count,
        color: eamMockData.workOrdersByAssetType.find(a => a.assetType === assetType)?.color,
      }))
      .sort((a, b) => b.workOrderCount - a.workOrderCount);
  }, [filteredWorkOrders]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      dateRange: {
        start: defaultStartDate,
        end: defaultEndDate,
      },
      assetTypes: [],
      crews: [],
      statuses: [],
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.assetTypes.length > 0 ||
                          filters.crews.length > 0 ||
                          filters.statuses.length > 0;

  // Prepare time series data for chart
  const timeSeriesChartData = filteredTimeSeriesData.map((point) => ({
    timestamp: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    workOrders: point.workOrders,
  }));

  // Prepare asset type data for bar chart
  const assetTypeChartData = filteredAssetTypeData.slice(0, 10).map((item) => ({
    name: item.assetType,
    value: item.workOrderCount,
    color: item.color,
  }));

  // Prepare work order table data
  const workOrderTableColumns = [
    { id: 'workOrderId', label: 'WO ID', sortable: true, width: '8%' },
    {
      id: 'workOrderStatus',
      label: 'Status',
      sortable: true,
      align: 'left' as const,
      width: '10%',
      render: (value: string) => {
        const statusColors: { [key: string]: string } = {
          'Open': 'default',
          'Scheduled': 'info',
          'In Progress': 'warning',
          'Completed': 'success',
          'Cancelled': 'error',
        };
        return (
          <Chip
            label={value}
            size="small"
            color={statusColors[value] as any || 'default'}
            sx={{ minWidth: 90 }}
          />
        );
      },
    },
    { id: 'workOrderType', label: 'Type', sortable: true, width: '10%' },
    { id: 'assetName', label: 'Asset', sortable: true, width: '20%' },
    { id: 'crewName', label: 'Crew', sortable: true, width: '14%' },
    {
      id: 'workOrderDate',
      label: 'Date',
      sortable: true,
      align: 'right' as const,
      width: '10%',
      render: (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      id: 'durationHours',
      label: 'Duration (hrs)',
      sortable: true,
      align: 'right' as const,
      width: '9%',
      render: (value: number) => formatHours(value),
    },
    {
      id: 'laborCost',
      label: 'Labor Cost',
      sortable: true,
      align: 'right' as const,
      width: '10%',
      render: (value: number) => value > 0 ? formatCurrency(value) : '-',
    },
    {
      id: 'materialCost',
      label: 'Material Cost',
      sortable: true,
      align: 'right' as const,
      width: '9%',
      render: (value: number) => value > 0 ? formatCurrency(value) : '-',
    },
  ];

  const workOrderTableRows = filteredWorkOrders.map((wo) => ({
    id: wo.workOrderId,
    workOrderId: wo.workOrderId,
    workOrderStatus: wo.workOrderStatus,
    workOrderType: wo.workOrderType,
    assetName: wo.assetName,
    crewName: wo.crewName,
    workOrderDate: wo.workOrderDate,
    durationHours: wo.durationHours,
    laborCost: wo.laborCost,
    materialCost: wo.materialCost,
    // Highlight emergency work orders
    status: wo.workOrderType === 'Emergency' ? 'warning' : 'neutral' as const,
    highlight: wo.workOrderType === 'Emergency',
  }));

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
              Asset & Work Management
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Monitor asset condition, maintenance workload, and completion performance for Enterprise Asset Management.
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
              Filters Section
              ================================================================ */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Toolbar level="level1" sx={{ flexWrap: 'wrap', gap: 2, py: 1.5 }}>
              <Toolbar.Section grow spacing={2}>
                <DatePicker
                  label="Start Date"
                  value={filters.dateRange.start}
                  onChange={(newValue) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: newValue },
                    })
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 150 },
                    },
                  }}
                />
                <DatePicker
                  label="End Date"
                  value={filters.dateRange.end}
                  onChange={(newValue) =>
                    setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: newValue },
                    })
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { minWidth: 150 },
                    },
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Asset Type</InputLabel>
                  <Select
                    multiple
                    value={filters.assetTypes}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        assetTypes: e.target.value as string[],
                      })
                    }
                    input={<OutlinedInput label="Asset Type" />}
                    renderValue={(selected) => `${selected.length} selected`}
                  >
                    {availableAssetTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        <Checkbox checked={filters.assetTypes.includes(type)} />
                        <ListItemText primary={type} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Crew</InputLabel>
                  <Select
                    multiple
                    value={filters.crews}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        crews: e.target.value as string[],
                      })
                    }
                    input={<OutlinedInput label="Crew" />}
                    renderValue={(selected) => `${selected.length} selected`}
                  >
                    {availableCrews.map((crew) => (
                      <MenuItem key={crew} value={crew}>
                        <Checkbox checked={filters.crews.includes(crew)} />
                        <ListItemText primary={crew} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Work Order Status</InputLabel>
                  <Select
                    multiple
                    value={filters.statuses}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        statuses: e.target.value as string[],
                      })
                    }
                    input={<OutlinedInput label="Work Order Status" />}
                    renderValue={(selected) => `${selected.length} selected`}
                  >
                    {availableStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        <Checkbox checked={filters.statuses.includes(status)} />
                        <ListItemText primary={status} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Toolbar.Section>
              {hasActiveFilters && (
                <Toolbar.Section>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </Toolbar.Section>
              )}
            </Toolbar>
          </LocalizationProvider>

          {/* ================================================================
              1. Maintenance KPIs
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Maintenance KPIs
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Work Orders Created"
                  value={filteredKPIs.workOrdersCreated}
                  icon={<AssignmentIcon />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Completion Rate"
                  value={`${filteredKPIs.completionRate}%`}
                  icon={<CheckCircleIcon />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Avg Work Order Duration"
                  value={`${filteredKPIs.avgWorkOrderDuration}h`}
                  icon={<TimerIcon />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Preventive vs Reactive Ratio"
                  value={`${filteredKPIs.preventiveRatio}%`}
                  icon={<BuildIcon />}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              2. Workload & Asset Focus
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Workload & Asset Focus
            </Typography>
            <Grid container spacing={3}>
              <Grid sx={{ flex: '1 1 400px', minWidth: isMobile ? '100%' : '400px' }}>
                <TimeSeriesChart
                  title="Work Orders Over Time"
                  data={timeSeriesChartData}
                  series={[
                    {
                      dataKey: 'workOrders',
                      name: 'Weekly Work Orders',
                      color: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
                    },
                  ]}
                  variant="area"
                  timeWindows={['weekly']}
                  defaultTimeWindow="weekly"
                  height={300}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 400px', minWidth: isMobile ? '100%' : '400px' }}>
                <BarChart
                  title="Work Orders by Asset Type"
                  description="Distribution of work orders across asset types"
                  data={assetTypeChartData}
                  limit={10}
                  height={300}
                  valueLabel="Work Orders"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              3. Work Order Detail
              ================================================================ */}
          <Box>
            <Typography variant="h2" gutterBottom>
              Work Order Detail
            </Typography>
            <PerformanceTable
              title="Work Orders"
              columns={workOrderTableColumns}
              rows={workOrderTableRows}
              searchable
              searchPlaceholder="Search work orders..."
              paginated
              defaultRowsPerPage={25}
              rowsPerPageOptions={[10, 25, 50, 100]}
              maxHeight={600}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default EAMAnalyticsDashboard;
