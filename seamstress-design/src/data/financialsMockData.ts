/**
 * Mock Data for Financials & Budget Execution Dashboard
 *
 * This file contains mock data for tracking budget vs. actuals,
 * spending trends, and key financial health indicators.
 */

import { cdsColors } from '../theme/cds';

// ============================================================================
// Type Definitions
// ============================================================================

export interface FinancialKPI {
  label: string;
  value: number | string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TimeSeriesDataPoint {
  date: string;
  actualAmount: number;
}

export interface DepartmentBudgetActual {
  departmentName: string;
  budgetAmount: number;
  actualAmount: number;
  color?: string;
}

export interface Account {
  fundName: string;
  departmentName: string;
  accountNumber: string;
  accountName: string;
  accountType: 'Revenue' | 'Expense' | 'Asset' | 'Liability';
  budgetAmount: number;
  actualAmount: number;
  remainingAmount: number;
  fiscalYear: number;
  fiscalPeriodDate: string;
}

export interface DashboardData {
  kpis: {
    totalBudget: FinancialKPI;
    totalActuals: FinancialKPI;
    budgetConsumed: FinancialKPI;
    openEncumbrances: FinancialKPI;
  };
  timeSeriesData: TimeSeriesDataPoint[];
  departmentBudgetActuals: DepartmentBudgetActual[];
  accounts: Account[];
}

// ============================================================================
// Color Palette for Charts
// ============================================================================

const FINANCIAL_COLORS = [
  cdsColors.blurple700,
  cdsColors.green600,
  cdsColors.purple600,
  cdsColors.blue600,
  cdsColors.orange600,
  cdsColors.red600,
  cdsColors.violet600,
  cdsColors.magenta500,
  cdsColors.slate700,
  cdsColors.orange500,
];

// ============================================================================
// Mock Data Generation
// ============================================================================

/**
 * Generate time series data for current fiscal year (12 months)
 */
const generateTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();
  const fiscalYearStart = new Date(today.getFullYear(), 6, 1); // July 1

  // Generate 12 months of data
  for (let i = 0; i < 12; i++) {
    const date = new Date(fiscalYearStart);
    date.setMonth(date.getMonth() + i);

    // Spending increases throughout the year
    const baseAmount = 2500000;
    const monthlyVariance = Math.random() * 500000 - 250000;
    const seasonalFactor = 1 + (i / 12) * 0.3; // 30% increase over the year

    data.push({
      date: date.toISOString().split('T')[0],
      actualAmount: Math.max(0, Math.round(baseAmount * seasonalFactor + monthlyVariance)),
    });
  }

  return data;
};

/**
 * Generate department budget vs actuals data
 */
const generateDepartmentBudgetActuals = (): DepartmentBudgetActual[] => {
  const departments = [
    'Public Works',
    'Police',
    'Fire',
    'Parks & Recreation',
    'Finance',
    'Human Resources',
    'IT Services',
    'City Manager',
    'Planning & Development',
    'Community Services',
    'Library',
    'Public Health',
    'Transportation',
    'Water & Sewer',
    'Economic Development',
  ];

  return departments.map((departmentName, idx) => {
    const budgetAmount = Math.floor(Math.random() * 8000000) + 2000000; // $2M - $10M
    const consumedPct = 0.5 + Math.random() * 0.4; // 50-90% consumed
    const actualAmount = Math.floor(budgetAmount * consumedPct);

    return {
      departmentName,
      budgetAmount,
      actualAmount,
      color: FINANCIAL_COLORS[idx % FINANCIAL_COLORS.length],
    };
  }).sort((a, b) => b.budgetAmount - a.budgetAmount);
};

/**
 * Generate detailed account data
 */
const generateAccounts = (): Account[] => {
  const funds = [
    'General Fund',
    'Capital Projects Fund',
    'Special Revenue Fund',
    'Debt Service Fund',
    'Enterprise Fund',
    'Internal Service Fund',
  ];

  const departments = [
    'Public Works',
    'Police',
    'Fire',
    'Parks & Recreation',
    'Finance',
    'Human Resources',
    'IT Services',
    'City Manager',
    'Planning & Development',
    'Community Services',
    'Library',
    'Public Health',
    'Transportation',
    'Water & Sewer',
    'Economic Development',
  ];

  const accountTypes: Account['accountType'][] = ['Revenue', 'Expense', 'Asset', 'Liability'];

  const expenseAccounts = [
    'Salaries & Wages',
    'Employee Benefits',
    'Professional Services',
    'Supplies & Materials',
    'Contractual Services',
    'Utilities',
    'Maintenance & Repairs',
    'Equipment',
    'Travel & Training',
    'Insurance',
    'Rent & Leases',
    'Software Licenses',
    'Telecommunications',
    'Office Supplies',
    'Fuel & Lubricants',
  ];

  const revenueAccounts = [
    'Property Tax',
    'Sales Tax',
    'License & Permits',
    'Charges for Services',
    'Intergovernmental',
    'Fines & Forfeitures',
    'Investment Income',
    'Grants',
  ];

  const accounts: Account[] = [];
  const fiscalYear = new Date().getFullYear();
  const fiscalYearStart = new Date(fiscalYear, 6, 1); // July 1

  // Generate 200 accounts
  for (let i = 0; i < 200; i++) {
    const fund = funds[Math.floor(Math.random() * funds.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    const accountType = i < 30 ? 'Revenue' : 'Expense'; // 15% revenue, 85% expense

    const accountNames = accountType === 'Revenue' ? revenueAccounts : expenseAccounts;
    const accountName = accountNames[Math.floor(Math.random() * accountNames.length)];

    const budgetAmount = accountType === 'Revenue'
      ? Math.floor(Math.random() * 1500000) + 100000 // $100k - $1.6M
      : Math.floor(Math.random() * 800000) + 50000; // $50k - $850k

    const consumedPct = 0.4 + Math.random() * 0.5; // 40-90% consumed
    const actualAmount = Math.floor(budgetAmount * consumedPct);
    const remainingAmount = budgetAmount - actualAmount;

    // Generate fiscal period (random month in current FY)
    const periodMonth = Math.floor(Math.random() * 12);
    const fiscalPeriodDate = new Date(fiscalYearStart);
    fiscalPeriodDate.setMonth(fiscalPeriodDate.getMonth() + periodMonth);

    accounts.push({
      fundName: fund,
      departmentName: department,
      accountNumber: `${String(1000 + Math.floor(i / 10)).padStart(4, '0')}-${String(100 + (i % 10) * 10).padStart(3, '0')}`,
      accountName,
      accountType,
      budgetAmount,
      actualAmount,
      remainingAmount,
      fiscalYear,
      fiscalPeriodDate: fiscalPeriodDate.toISOString().split('T')[0],
    });
  }

  return accounts.sort((a, b) => {
    if (a.fundName !== b.fundName) return a.fundName.localeCompare(b.fundName);
    if (a.departmentName !== b.departmentName) return a.departmentName.localeCompare(b.departmentName);
    return a.accountNumber.localeCompare(b.accountNumber);
  });
};

// ============================================================================
// Main Dashboard Data
// ============================================================================

const accounts = generateAccounts();
const timeSeriesData = generateTimeSeriesData();
const departmentBudgetActuals = generateDepartmentBudgetActuals();

// Calculate KPIs from generated data
const totalBudgetAmount = accounts
  .filter(acc => acc.accountType === 'Expense')
  .reduce((sum, acc) => sum + acc.budgetAmount, 0);

const totalActualAmount = accounts
  .filter(acc => acc.accountType === 'Expense')
  .reduce((sum, acc) => sum + acc.actualAmount, 0);

const budgetConsumedPct = totalBudgetAmount > 0
  ? (totalActualAmount / totalBudgetAmount) * 100
  : 0;

// Encumbrances (15-20% of remaining budget)
const totalRemainingAmount = accounts
  .filter(acc => acc.accountType === 'Expense')
  .reduce((sum, acc) => sum + acc.remainingAmount, 0);
const openEncumbrancesAmount = totalRemainingAmount * (0.15 + Math.random() * 0.05);

export const financialsMockData: DashboardData = {
  kpis: {
    totalBudget: {
      label: 'Total Budget',
      value: totalBudgetAmount,
      changePercent: 5.2,
      trend: 'up',
    },
    totalActuals: {
      label: 'Total Actuals',
      value: totalActualAmount,
      changePercent: 8.1,
      trend: 'up',
    },
    budgetConsumed: {
      label: 'Budget Consumed',
      value: budgetConsumedPct.toFixed(1),
      changePercent: 3.4,
      trend: 'up',
    },
    openEncumbrances: {
      label: 'Open Encumbrances/POs',
      value: openEncumbrancesAmount,
      changePercent: -5.7,
      trend: 'down',
    },
  },
  timeSeriesData,
  departmentBudgetActuals,
  accounts,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get accounts by fund
 */
export const getAccountsByFund = (fund: string): Account[] => {
  return financialsMockData.accounts.filter(acc => acc.fundName === fund);
};

/**
 * Get accounts by department
 */
export const getAccountsByDepartment = (department: string): Account[] => {
  return financialsMockData.accounts.filter(acc => acc.departmentName === department);
};

/**
 * Get accounts by account type
 */
export const getAccountsByType = (accountType: Account['accountType']): Account[] => {
  return financialsMockData.accounts.filter(acc => acc.accountType === accountType);
};

/**
 * Get unique funds
 */
export const getFunds = (): string[] => {
  return [...new Set(financialsMockData.accounts.map(acc => acc.fundName))].sort();
};

/**
 * Get unique departments
 */
export const getDepartments = (): string[] => {
  return [...new Set(financialsMockData.accounts.map(acc => acc.departmentName))].sort();
};

/**
 * Get unique account types
 */
export const getAccountTypes = (): string[] => {
  return [...new Set(financialsMockData.accounts.map(acc => acc.accountType))];
};

/**
 * Format currency for display
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format large currency (millions/thousands)
 */
export const formatCurrencyShort = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return formatCurrency(value);
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default financialsMockData;
