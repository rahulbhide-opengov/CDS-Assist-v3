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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { PageHeaderComposable } from '@opengov/components-page-header';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PercentIcon from '@mui/icons-material/Percent';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { cdsDesignTokens } from '../../theme/cds';

// Import dashboard components
import MetricCard from '../../components/dashboard/MetricCard';
import TimeSeriesChart from '../../components/dashboard/TimeSeriesChart';
import GroupedBarChart from '../../components/dashboard/GroupedBarChart';
import PerformanceTable from '../../components/dashboard/PerformanceTable';

// Import mock data
import {
  financialsMockData,
  getFunds,
  getDepartments,
  getAccountTypes,
  formatCurrency,
  formatCurrencyShort,
  type Account,
} from '../../data/financialsMockData';

/**
 * Filter state interface
 */
interface DashboardFilters {
  fiscalPeriod: {
    start: Date | null;
    end: Date | null;
  };
  funds: string[];
  departments: string[];
  accountTypes: string[];
}

/**
 * FinancialsDashboard - Comprehensive dashboard for Financials & Budget Execution
 *
 * Features:
 * - KPI tracking: Total budget, actuals, budget consumed %, open encumbrances
 * - Time series visualization of monthly spending
 * - Budget vs Actual comparison by department
 * - Detailed accounts table with filtering and sorting
 * - Advanced filtering by fiscal period, fund, department, and account type
 */
const FinancialsDashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get available filter options
  const availableFunds = useMemo(() => getFunds(), []);
  const availableDepartments = useMemo(() => getDepartments(), []);
  const availableAccountTypes = useMemo(() => getAccountTypes(), []);

  // Initialize default fiscal year (July 1 - June 30)
  const fiscalYearStart = new Date(new Date().getFullYear(), 6, 1); // July 1
  const fiscalYearEnd = new Date(new Date().getFullYear() + 1, 5, 30); // June 30

  // Filter state
  const [filters, setFilters] = useState<DashboardFilters>({
    fiscalPeriod: {
      start: fiscalYearStart,
      end: fiscalYearEnd,
    },
    funds: [],
    departments: [],
    accountTypes: [],
  });

  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Extract raw data from mock
  const { accounts: allAccounts, timeSeriesData: allTimeSeriesData } = financialsMockData;

  // Apply filters to accounts
  const filteredAccounts = useMemo(() => {
    return allAccounts.filter((acc) => {
      // Fiscal period filter
      if (filters.fiscalPeriod.start || filters.fiscalPeriod.end) {
        const accDate = new Date(acc.fiscalPeriodDate);
        if (filters.fiscalPeriod.start && accDate < filters.fiscalPeriod.start) return false;
        if (filters.fiscalPeriod.end && accDate > filters.fiscalPeriod.end) return false;
      }

      // Fund filter
      if (filters.funds.length > 0 && !filters.funds.includes(acc.fundName)) {
        return false;
      }

      // Department filter
      if (filters.departments.length > 0 && !filters.departments.includes(acc.departmentName)) {
        return false;
      }

      // Account type filter
      if (filters.accountTypes.length > 0 && !filters.accountTypes.includes(acc.accountType)) {
        return false;
      }

      return true;
    });
  }, [allAccounts, filters]);

  // Calculate filtered KPIs
  const filteredKPIs = useMemo(() => {
    const expenseAccounts = filteredAccounts.filter(acc => acc.accountType === 'Expense');

    const totalBudget = expenseAccounts.reduce((sum, acc) => sum + acc.budgetAmount, 0);
    const totalActuals = expenseAccounts.reduce((sum, acc) => sum + acc.actualAmount, 0);
    const budgetConsumed = totalBudget > 0 ? (totalActuals / totalBudget) * 100 : 0;

    const totalRemaining = expenseAccounts.reduce((sum, acc) => sum + acc.remainingAmount, 0);
    const openEncumbrances = totalRemaining * 0.17; // ~17% of remaining budget

    return {
      totalBudget,
      totalActuals,
      budgetConsumed: budgetConsumed.toFixed(1),
      openEncumbrances,
    };
  }, [filteredAccounts]);

  // Calculate filtered time series
  const filteredTimeSeriesData = useMemo(() => {
    if (!filters.fiscalPeriod.start && !filters.fiscalPeriod.end) {
      return allTimeSeriesData;
    }

    return allTimeSeriesData.filter((point) => {
      const pointDate = new Date(point.date);
      if (filters.fiscalPeriod.start && pointDate < filters.fiscalPeriod.start) return false;
      if (filters.fiscalPeriod.end && pointDate > filters.fiscalPeriod.end) return false;
      return true;
    });
  }, [allTimeSeriesData, filters.fiscalPeriod]);

  // Calculate filtered department budget vs actuals
  const filteredDepartmentData = useMemo(() => {
    const deptGroups = filteredAccounts
      .filter(acc => acc.accountType === 'Expense')
      .reduce((acc, account) => {
        if (!acc[account.departmentName]) {
          acc[account.departmentName] = { budget: 0, actual: 0 };
        }
        acc[account.departmentName].budget += account.budgetAmount;
        acc[account.departmentName].actual += account.actualAmount;
        return acc;
      }, {} as Record<string, { budget: number; actual: number }>);

    return Object.entries(deptGroups)
      .map(([name, amounts]) => ({
        name,
        budget: amounts.budget,
        actual: amounts.actual,
      }))
      .sort((a, b) => b.budget - a.budget)
      .slice(0, 15);
  }, [filteredAccounts]);

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      fiscalPeriod: {
        start: fiscalYearStart,
        end: fiscalYearEnd,
      },
      funds: [],
      departments: [],
      accountTypes: [],
    });
  };

  // Check if any filters are active
  const hasActiveFilters = filters.funds.length > 0 ||
                          filters.departments.length > 0 ||
                          filters.accountTypes.length > 0;

  // Prepare time series data for chart
  const timeSeriesChartData = filteredTimeSeriesData.map((point) => ({
    timestamp: new Date(point.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    spend: point.actualAmount,
  }));

  // Prepare accounts table data
  const accountTableColumns = [
    { id: 'fundName', label: 'Fund', sortable: true, width: '15%' },
    { id: 'departmentName', label: 'Department', sortable: true, width: '15%' },
    { id: 'accountNumber', label: 'Account #', sortable: true, width: '10%' },
    { id: 'accountName', label: 'Account Name', sortable: true, width: '20%' },
    {
      id: 'budgetAmount',
      label: 'Budget',
      sortable: true,
      align: 'right' as const,
      width: '13%',
      render: (value: number) => formatCurrency(value),
    },
    {
      id: 'actualAmount',
      label: 'Actuals',
      sortable: true,
      align: 'right' as const,
      width: '13%',
      render: (value: number) => formatCurrency(value),
    },
    {
      id: 'remainingAmount',
      label: 'Remaining',
      sortable: true,
      align: 'right' as const,
      width: '14%',
      render: (value: number, row: any) => {
        const isOverBudget = value < 0;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
            <span style={{ color: isOverBudget ? theme.palette.error.main : 'inherit' }}>
              {formatCurrency(value)}
            </span>
          </Box>
        );
      },
    },
  ];

  const accountTableRows = filteredAccounts.map((acc) => ({
    id: `${acc.fundName}-${acc.departmentName}-${acc.accountNumber}`,
    fundName: acc.fundName,
    departmentName: acc.departmentName,
    accountNumber: acc.accountNumber,
    accountName: acc.accountName,
    budgetAmount: acc.budgetAmount,
    actualAmount: acc.actualAmount,
    remainingAmount: acc.remainingAmount,
    // Highlight overbudget accounts
    status: acc.remainingAmount < 0 ? 'error' : acc.remainingAmount < acc.budgetAmount * 0.1 ? 'warning' : 'neutral' as const,
    highlight: acc.remainingAmount < acc.budgetAmount * 0.1,
  }));

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
      }}
    >
      {/* Page Header */}
      <Box component="header" sx={{ px: 3, py: 2.5 }}>
        <PageHeaderComposable maxContentWidth={cdsDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>
              Financials & Budget Execution
            </PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Track budget vs. actuals, spending trends, and key financial health indicators.
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content Area */}
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.secondary',
          padding: 3,
          maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Stack spacing={3}>
          {/* ================================================================
              Filters Section
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="filters-section-heading">
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Accordion
                expanded={filtersExpanded}
                onChange={() => setFiltersExpanded(!filtersExpanded)}
                sx={{
                  boxShadow: 1,
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon aria-hidden="true" />}
                  aria-controls="filters-panel-content"
                  id="filters-panel-header"
                  sx={{
                    backgroundColor: 'background.paper',
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2,
                    },
                  }}
                >
                  <FilterListIcon aria-hidden="true" />
                  <Typography variant="h3" fontWeight="500" id="filters-section-heading">
                    Filters
                  </Typography>
                  {hasActiveFilters && (
                    <Chip
                      label={`${
                        filters.funds.length +
                        filters.departments.length +
                        filters.accountTypes.length
                      } active`}
                      size="small"
                      color="primary"
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails id="filters-panel-content">
                  <Stack spacing={2}>
                    <Grid container spacing={2}>
                      {/* Fiscal Period Filters */}
                      <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <DatePicker
                          label="Fiscal Period Start"
                          value={filters.fiscalPeriod.start}
                          onChange={(newValue) =>
                            setFilters({
                              ...filters,
                              fiscalPeriod: { ...filters.fiscalPeriod, start: newValue },
                            })
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                            },
                          }}
                        />
                      </Grid>
                      <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <DatePicker
                          label="Fiscal Period End"
                          value={filters.fiscalPeriod.end}
                          onChange={(newValue) =>
                            setFilters({
                              ...filters,
                              fiscalPeriod: { ...filters.fiscalPeriod, end: newValue },
                            })
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: 'small',
                            },
                          }}
                        />
                      </Grid>

                      {/* Fund Filter */}
                      <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="fund-filter-label">Fund</InputLabel>
                          <Select
                            labelId="fund-filter-label"
                            multiple
                            value={filters.funds}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                funds: e.target.value as string[],
                              })
                            }
                            input={<OutlinedInput label="Fund" />}
                            renderValue={(selected) => `${selected.length} selected`}
                          >
                            {availableFunds.map((fund) => (
                              <MenuItem key={fund} value={fund}>
                                <Checkbox checked={filters.funds.includes(fund)} />
                                <ListItemText primary={fund} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Department Filter */}
                      <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="department-filter-label">Department</InputLabel>
                          <Select
                            labelId="department-filter-label"
                            multiple
                            value={filters.departments}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                departments: e.target.value as string[],
                              })
                            }
                            input={<OutlinedInput label="Department" />}
                            renderValue={(selected) => `${selected.length} selected`}
                          >
                            {availableDepartments.map((dept) => (
                              <MenuItem key={dept} value={dept}>
                                <Checkbox checked={filters.departments.includes(dept)} />
                                <ListItemText primary={dept} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Account Type Filter */}
                      <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="account-type-filter-label">Account Type</InputLabel>
                          <Select
                            labelId="account-type-filter-label"
                            multiple
                            value={filters.accountTypes}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                accountTypes: e.target.value as string[],
                              })
                            }
                            input={<OutlinedInput label="Account Type" />}
                            renderValue={(selected) => `${selected.length} selected`}
                          >
                            {availableAccountTypes.map((type) => (
                              <MenuItem key={type} value={type}>
                                <Checkbox checked={filters.accountTypes.includes(type)} />
                                <ListItemText primary={type} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ClearIcon aria-hidden="true" />}
                          onClick={handleClearFilters}
                        >
                          Clear Filters
                        </Button>
                      </Box>
                    )}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </LocalizationProvider>
          </Box>

          {/* ================================================================
              1. Financial KPIs
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="financial-kpis-heading">
            <Typography variant="h2" gutterBottom id="financial-kpis-heading">
              Financial KPIs
            </Typography>
            <Grid container spacing={2}>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Total Budget"
                  value={formatCurrencyShort(filteredKPIs.totalBudget)}
                  icon={<AccountBalanceIcon aria-hidden="true" />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Total Actuals"
                  value={formatCurrencyShort(filteredKPIs.totalActuals)}
                  icon={<TrendingUpIcon aria-hidden="true" />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Budget Consumed"
                  value={`${filteredKPIs.budgetConsumed}%`}
                  icon={<PercentIcon aria-hidden="true" />}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <MetricCard
                  label="Open Encumbrances/POs"
                  value={formatCurrencyShort(filteredKPIs.openEncumbrances)}
                  icon={<ReceiptIcon aria-hidden="true" />}
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              2. Spending & Revenue Trends
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="spending-trends-heading">
            <Typography variant="h2" gutterBottom id="spending-trends-heading">
              Spending & Revenue Trends
            </Typography>
            <Grid container spacing={3}>
              <Grid sx={{ flex: '1 1 400px', minWidth: isMobile ? '100%' : '400px' }}>
                <TimeSeriesChart
                  title="Monthly Spend"
                  data={timeSeriesChartData}
                  series={[
                    {
                      dataKey: 'spend',
                      name: 'Actual Expenditures',
                      color: 'primary.main',
                    },
                  ]}
                  variant="area"
                  timeWindows={['monthly']}
                  defaultTimeWindow="monthly"
                  height={300}
                  valueFormatter={(value) => formatCurrencyShort(value)}
                />
              </Grid>
              <Grid sx={{ flex: '1 1 400px', minWidth: isMobile ? '100%' : '400px' }}>
                <GroupedBarChart
                  title="Budget vs Actual by Department"
                  description="Budget and actuals by department for the selected period"
                  data={filteredDepartmentData}
                  series={[
                    {
                      dataKey: 'budget',
                      name: 'Budget',
                      color: 'primary.main',
                    },
                    {
                      dataKey: 'actual',
                      name: 'Actual',
                      color: 'success.main',
                    },
                  ]}
                  limit={15}
                  height={300}
                  valueFormatter={(value) => formatCurrencyShort(value)}
                  layout="horizontal"
                />
              </Grid>
            </Grid>
          </Box>

          {/* ================================================================
              3. Accounts Detail
              ================================================================ */}
          <Box component="section" role="region" aria-labelledby="accounts-detail-heading">
            <Typography variant="h2" gutterBottom id="accounts-detail-heading">
              Accounts Detail
            </Typography>
            <PerformanceTable
              title="Budget vs Actual by Account"
              columns={accountTableColumns}
              rows={accountTableRows}
              searchable
              searchPlaceholder="Search accounts..."
              paginated
              defaultRowsPerPage={50}
              rowsPerPageOptions={[25, 50, 100, 200]}
              maxHeight={600}
              aria-label="Accounts detail table showing budget vs actual by account"
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default FinancialsDashboard;
