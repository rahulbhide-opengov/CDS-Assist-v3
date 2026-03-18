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
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Toolbar } from '../../components/Toolbar';
import BusinessIcon from '@mui/icons-material/Business';
import TimerIcon from '@mui/icons-material/Timer';
import GroupsIcon from '@mui/icons-material/Groups';
import VerifiedIcon from '@mui/icons-material/Verified';
import ClearIcon from '@mui/icons-material/Clear';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Import dashboard components
import MetricCard from '../../components/dashboard/MetricCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';
import BarChart from '../../components/dashboard/BarChart';
import PerformanceTable from '../../components/dashboard/PerformanceTable';

// Import mock data
import {
  procurementMockData,
  getSolicitationTypes,
  getBuyers,
  getSolicitationStatuses,
  formatCurrency,
  type Solicitation,
} from '../../data/procurementMockData';

/**
 * Filter state interface
 */
interface DashboardFilters {
  dateRange: [Dayjs | null, Dayjs | null];
  buyers: string[];
  solicitationTypes: string[];
  statuses: string[];
}

/**
 * ProcurementDashboard - Comprehensive dashboard for Procurement Pipeline & Performance
 *
 * Features:
 * - KPI tracking: Solicitations created, cycle time, supplier responses, compliance
 * - Time series visualization of solicitation trends
 * - Supplier engagement by category
 * - Detailed solicitation table with filtering and sorting
 * - Advanced filtering by date range, buyer, type, and status
 */
const ProcurementDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get available filter options
  const availableTypes = useMemo(() => getSolicitationTypes(), []);
  const availableBuyers = useMemo(() => getBuyers(), []);
  const availableStatuses = useMemo(() => getSolicitationStatuses(), []);

  // Initialize default date range (last 180 days)
  const defaultDateRange: [Dayjs, Dayjs] = [dayjs().subtract(180, 'day'), dayjs()];

  // Filter state
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: defaultDateRange,
    buyers: [],
    solicitationTypes: [],
    statuses: [],
  });

  // Extract raw data from mock
  const { solicitations: allSolicitations, timeSeriesData: allTimeSeriesData } = procurementMockData;

  // Apply filters to solicitations
  const filteredSolicitations = useMemo(() => {
    return allSolicitations.filter((sol) => {
      // Date range filter
      const [startDate, endDate] = filters.dateRange;
      if (startDate || endDate) {
        const solDate = dayjs(sol.createdDate);
        if (startDate && solDate.isBefore(startDate)) return false;
        if (endDate && solDate.isAfter(endDate)) return false;
      }

      // Buyer filter
      if (filters.buyers.length > 0 && !filters.buyers.includes(sol.buyerName)) {
        return false;
      }

      // Solicitation type filter
      if (filters.solicitationTypes.length > 0 && !filters.solicitationTypes.includes(sol.solicitationType)) {
        return false;
      }

      // Status filter
      if (filters.statuses.length > 0 && !filters.statuses.includes(sol.solicitationStatus)) {
        return false;
      }

      return true;
    });
  }, [allSolicitations, filters]);

  // Calculate filtered KPIs
  const filteredKPIs = useMemo(() => {
    const solicitationsCount = filteredSolicitations.length;

    const awardedSols = filteredSolicitations.filter(
      sol => sol.awardDate && (sol.solicitationStatus === 'Awarded' || sol.solicitationStatus === 'Closed')
    );

    const avgDays = awardedSols.length > 0
      ? awardedSols.reduce((sum, sol) => {
        const createdDate = new Date(sol.createdDate);
        const awardDateObj = new Date(sol.awardDate!);
        const days = Math.floor((awardDateObj.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / awardedSols.length
      : 0;

    const solsWithResponses = filteredSolicitations.filter(sol => sol.supplierResponseCount > 0);
    const avgResponses = solsWithResponses.length > 0
      ? solsWithResponses.reduce((sum, sol) => sum + sol.supplierResponseCount, 0) / solsWithResponses.length
      : 0;

    const compliantCount = filteredSolicitations.filter(sol => sol.isCompliant).length;
    const complianceRate = filteredSolicitations.length > 0
      ? (compliantCount / filteredSolicitations.length) * 100
      : 0;

    return {
      solicitationsCreated: solicitationsCount,
      avgRequestToAwardTime: avgDays.toFixed(1),
      avgSupplierResponses: avgResponses.toFixed(1),
      complianceRate: complianceRate.toFixed(1),
    };
  }, [filteredSolicitations]);

  // Calculate filtered time series
  const filteredTimeSeriesData = useMemo(() => {
    const [startDate, endDate] = filters.dateRange;
    if (!startDate && !endDate) {
      return allTimeSeriesData;
    }

    return allTimeSeriesData.filter((point) => {
      const pointDate = dayjs(point.date);
      if (startDate && pointDate.isBefore(startDate)) return false;
      if (endDate && pointDate.isAfter(endDate)) return false;
      return true;
    });
  }, [allTimeSeriesData, filters.dateRange]);

  // Calculate filtered responses by category
  const filteredResponsesByCategory = useMemo(() => {
    const categoryGroups = filteredSolicitations.reduce((acc, sol) => {
      if (sol.supplierResponseCount > 0) {
        if (!acc[sol.categoryName]) {
          acc[sol.categoryName] = { total: 0, count: 0 };
        }
        acc[sol.categoryName].total += sol.supplierResponseCount;
        acc[sol.categoryName].count += 1;
      }
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    return Object.entries(categoryGroups)
      .map(([categoryName, stats]) => ({
        categoryName,
        avgResponses: stats.total / stats.count,
        color: procurementMockData.responsesByCategory.find(c => c.categoryName === categoryName)?.color,
      }))
      .sort((a, b) => b.avgResponses - a.avgResponses);
  }, [filteredSolicitations]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      dateRange: defaultDateRange,
      buyers: [],
      solicitationTypes: [],
      statuses: [],
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.buyers.length > 0 ||
    filters.solicitationTypes.length > 0 ||
    filters.statuses.length > 0;

  // Prepare time series data for chart
  const timeSeriesChartData = filteredTimeSeriesData.map((point) => ({
    timestamp: new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    solicitations: point.solicitations,
  }));

  // Prepare responses by category data for bar chart
  const categoryChartData = filteredResponsesByCategory.slice(0, 10).map((item) => ({
    name: item.categoryName,
    value: parseFloat(item.avgResponses.toFixed(1)),
    color: item.color,
  }));

  // Prepare solicitation table data
  const solicitationTableColumns = [
    { id: 'solicitationId', label: 'ID', sortable: true, width: '10%' },
    { id: 'solicitationName', label: 'Name', sortable: true, width: '25%' },
    { id: 'solicitationType', label: 'Type', sortable: true, width: '8%' },
    {
      id: 'solicitationStatus',
      label: 'Status',
      sortable: true,
      align: 'left' as const,
      width: '10%',
      render: (value: string) => {
        const statusColors: { [key: string]: string } = {
          'Draft': 'default',
          'Open': 'info',
          'Evaluating': 'warning',
          'Awarded': 'success',
          'Cancelled': 'error',
          'Closed': 'default',
        };
        return (
          <Chip
            label={value}
            size="medium"
            color={statusColors[value] as any || 'default'}
            sx={{ minWidth: 90 }}
          />
        );
      },
    },
    { id: 'buyerName', label: 'Buyer', sortable: true, width: '12%' },
    {
      id: 'createdDate',
      label: 'Created',
      sortable: true,
      align: 'right' as const,
      width: '10%',
      render: (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    },
    {
      id: 'awardDate',
      label: 'Awarded',
      sortable: true,
      align: 'right' as const,
      width: '10%',
      render: (value: string | undefined) => value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-',
    },
    {
      id: 'daysOpen',
      label: 'Days Open',
      sortable: true,
      align: 'right' as const,
      width: '8%',
      render: (value: number) => `${value}d`,
    },
    {
      id: 'supplierResponseCount',
      label: 'Responses',
      sortable: true,
      align: 'right' as const,
      width: '7%',
    },
  ];

  const solicitationTableRows = filteredSolicitations.map((sol) => ({
    id: sol.solicitationId,
    solicitationId: sol.solicitationId,
    solicitationName: sol.solicitationName,
    solicitationType: sol.solicitationType,
    solicitationStatus: sol.solicitationStatus,
    buyerName: sol.buyerName,
    createdDate: sol.createdDate,
    awardDate: sol.awardDate,
    daysOpen: sol.daysOpen,
    supplierResponseCount: sol.supplierResponseCount,
    // Highlight solicitations with no responses or low compliance
    status: sol.supplierResponseCount === 0 || !sol.isCompliant ? 'warning' : 'neutral' as const,
    highlight: sol.supplierResponseCount === 0 || !sol.isCompliant,
  }));

  const getChangeType = (trend: 'up' | 'down' | 'stable') => {
    return trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'neutral';
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      {/* Page Header */}
      <Box
        component="header"
        role="banner"
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
              Procurement Pipeline & Performance
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Track procurement pipeline, cycle times, supplier engagement, and compliance across solicitations and contracts.
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content Area */}
      <Box
        component="main"
        role="main"
        sx={{
          backgroundColor: 'background.secondary',
          px: 3,
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Stack spacing={3}>
          {/* ================================================================
              Filters Section
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="filters-section-heading">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Toolbar level="level1" aria-label="Dashboard filters">
                <Toolbar.Section grow spacing={2}>
                  <FormControl size="medium" sx={{ minWidth: 200 }}>
                    <InputLabel id="date-range-filter-label" shrink>Date Range</InputLabel>
                    <DateRangePicker
                      value={filters.dateRange}
                      onChange={(newValue) =>
                        setFilters({
                          ...filters,
                          dateRange: newValue,
                        })
                      }
                      slots={{ field: SingleInputDateRangeField }}
                      slotProps={{
                        textField: {
                          size: 'small',
                          InputLabelProps: { shrink: true },
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl size="medium" sx={{ minWidth: 140 }}>
                    <InputLabel id="buyer-filter-label">Buyer</InputLabel>
                    <Select
                      labelId="buyer-filter-label"
                      multiple
                      value={filters.buyers}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          buyers: e.target.value as string[],
                        })
                      }
                      input={<OutlinedInput label="Buyer" />}
                      renderValue={(selected) => `${selected.length} selected`}
                    >
                      {availableBuyers.map((buyer) => (
                        <MenuItem key={buyer} value={buyer}>
                          <Checkbox checked={filters.buyers.includes(buyer)} />
                          <ListItemText primary={buyer} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="medium" sx={{ minWidth: 160 }}>
                    <InputLabel id="solicitation-type-filter-label">Solicitation Type</InputLabel>
                    <Select
                      labelId="solicitation-type-filter-label"
                      multiple
                      value={filters.solicitationTypes}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          solicitationTypes: e.target.value as string[],
                        })
                      }
                      input={<OutlinedInput label="Solicitation Type" />}
                      renderValue={(selected) => `${selected.length} selected`}
                    >
                      {availableTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          <Checkbox checked={filters.solicitationTypes.includes(type)} />
                          <ListItemText primary={type} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="medium" sx={{ minWidth: 120 }}>
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      multiple
                      value={filters.statuses}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          statuses: e.target.value as string[],
                        })
                      }
                      input={<OutlinedInput label="Status" />}
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
                      size="medium"
                      startIcon={<ClearIcon aria-hidden="true" />}
                      onClick={handleClearFilters}
                    >
                      Clear Filters
                    </Button>
                  </Toolbar.Section>
                )}
              </Toolbar>
            </LocalizationProvider>
          </Box>

          {/* ================================================================
              1. Procurement KPIs
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="procurement-kpis-heading">
            <Typography variant="h2" id="procurement-kpis-heading" gutterBottom>
              Procurement KPIs
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Solicitations Created"
                  value={filteredKPIs.solicitationsCreated}
                  icon={<BusinessIcon aria-hidden="true" />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Avg Request-to-Award Time"
                  value={`${filteredKPIs.avgRequestToAwardTime} days`}
                  icon={<TimerIcon aria-hidden="true" />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Avg Supplier Responses"
                  value={filteredKPIs.avgSupplierResponses}
                  icon={<GroupsIcon aria-hidden="true" />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Compliance Rate"
                  value={`${filteredKPIs.complianceRate}%`}
                  icon={<VerifiedIcon aria-hidden="true" />}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              2. Pipeline & Supplier Engagement
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="pipeline-engagement-heading">
            <Typography variant="h2" id="pipeline-engagement-heading" gutterBottom>
              Pipeline & Supplier Engagement
            </Typography>
            <Grid container spacing={3}>
              <Grid sx={{ flex: '1 1 400px', minWidth: isMobile ? '100%' : '400px' }}>
                <TimeSeriesChart
                  title="Solicitations Over Time"
                  data={timeSeriesChartData}
                  series={[
                    {
                      dataKey: 'solicitations',
                      name: 'Monthly Solicitations',
                      color: capitalDesignTokens.semanticColors.dataVisualization.sequence700,
                    },
                  ]}
                  variant="area"
                  timeWindows={['monthly']}
                  defaultTimeWindow="monthly"
                  height={300}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 400px', minWidth: isMobile ? '100%' : '400px' }}>
                <BarChart
                  title="Responses by Category"
                  description="Average supplier responses by commodity or category"
                  data={categoryChartData}
                  limit={10}
                  height={300}
                  valueLabel="Avg Responses"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              3. Solicitation Detail
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="solicitation-detail-heading">
            <Typography variant="h2" id="solicitation-detail-heading" gutterBottom>
              Solicitation Detail
            </Typography>
            <PerformanceTable
              title="Solicitations"
              columns={solicitationTableColumns}
              rows={solicitationTableRows}
              searchable
              searchPlaceholder="Search solicitations..."
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

export default ProcurementDashboard;
