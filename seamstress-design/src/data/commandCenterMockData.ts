/**
 * Mock Data for Command Center Dashboard
 *
 * This file aggregates the most important metrics from all operational areas:
 * - Permitting & Licensing
 * - Procurement
 * - Financials
 * - Asset & Work Management (EAM)
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface OperationalKPI {
  label: string;
  value: number | string;
  unit?: string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  status: 'success' | 'warning' | 'error' | 'neutral';
  category: 'permitting' | 'procurement' | 'financials' | 'eam';
}

export interface TimeSeriesDataPoint {
  date: string;
  permittingVolume: number;
  procurementVolume: number;
  financialSpend: number;
  eamWorkOrders: number;
}

export interface DepartmentAlert {
  id: string;
  department: string;
  category: 'permitting' | 'procurement' | 'financials' | 'eam';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  metric: string;
  value: string;
  timestamp: string;
}

export interface PerformanceMetric {
  category: string;
  categoryLabel: string;
  metric: string;
  current: number;
  target: number;
  unit: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

export interface DashboardData {
  kpis: {
    // Permitting
    permitApplications: OperationalKPI;
    permitBacklog: OperationalKPI;
    avgPermitDays: OperationalKPI;

    // Procurement
    openSolicitations: OperationalKPI;
    procurementCompliance: OperationalKPI;
    avgAwardDays: OperationalKPI;

    // Financials
    budgetConsumed: OperationalKPI;
    overbudgetAccounts: OperationalKPI;
    monthlySpend: OperationalKPI;

    // EAM
    workOrdersCreated: OperationalKPI;
    workOrderCompletion: OperationalKPI;
    preventiveRatio: OperationalKPI;
  };
  timeSeriesData: TimeSeriesDataPoint[];
  alerts: DepartmentAlert[];
  performanceMetrics: PerformanceMetric[];
}

// ============================================================================
// Mock Data Generation
// ============================================================================

/**
 * Generate time series data for the last 12 weeks
 */
const generateTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));

    data.push({
      date: date.toISOString().split('T')[0],
      permittingVolume: Math.floor(Math.random() * 30) + 40,
      procurementVolume: Math.floor(Math.random() * 8) + 12,
      financialSpend: Math.floor(Math.random() * 500000) + 1800000,
      eamWorkOrders: Math.floor(Math.random() * 20) + 40,
    });
  }

  return data;
};

/**
 * Generate department alerts
 */
const generateAlerts = (): DepartmentAlert[] => {
  const now = new Date();

  return [
    {
      id: 'alert-001',
      department: 'Public Works',
      category: 'eam',
      severity: 'critical',
      message: 'Emergency work orders increased 45% this week',
      metric: 'Emergency Work Orders',
      value: '12 open',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-002',
      department: 'Finance',
      category: 'financials',
      severity: 'warning',
      message: 'Department spending at 87% of annual budget',
      metric: 'Budget Consumed',
      value: '87%',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-003',
      department: 'Planning & Development',
      category: 'permitting',
      severity: 'warning',
      message: 'Permit backlog increased by 18 applications',
      metric: 'Open Backlog',
      value: '156 permits',
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-004',
      department: 'Procurement',
      category: 'procurement',
      severity: 'info',
      message: 'Large solicitation awarded under budget',
      metric: 'Contract Value',
      value: '$2.4M savings',
      timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'alert-005',
      department: 'IT Services',
      category: 'eam',
      severity: 'warning',
      message: 'Preventive maintenance ratio below target',
      metric: 'Preventive Ratio',
      value: '22%',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
};

/**
 * Generate performance metrics
 */
const generatePerformanceMetrics = (): PerformanceMetric[] => {
  return [
    {
      category: 'permitting',
      categoryLabel: 'Permitting',
      metric: 'Avg Days to Decision',
      current: 18.5,
      target: 15,
      unit: 'days',
      status: 'at-risk',
    },
    {
      category: 'permitting',
      categoryLabel: 'Permitting',
      metric: 'Application Approval Rate',
      current: 82,
      target: 75,
      unit: '%',
      status: 'on-track',
    },
    {
      category: 'procurement',
      categoryLabel: 'Procurement',
      metric: 'Request to Award Time',
      current: 52,
      target: 45,
      unit: 'days',
      status: 'at-risk',
    },
    {
      category: 'procurement',
      categoryLabel: 'Procurement',
      metric: 'Compliance Rate',
      current: 94,
      target: 95,
      unit: '%',
      status: 'on-track',
    },
    {
      category: 'financials',
      categoryLabel: 'Financials',
      metric: 'Budget Variance',
      current: 3.2,
      target: 5,
      unit: '%',
      status: 'on-track',
    },
    {
      category: 'financials',
      categoryLabel: 'Financials',
      metric: 'Accounts Overbudget',
      current: 8,
      target: 5,
      unit: 'accounts',
      status: 'off-track',
    },
    {
      category: 'eam',
      categoryLabel: 'Asset Management',
      metric: 'Work Order Completion',
      current: 76,
      target: 80,
      unit: '%',
      status: 'at-risk',
    },
    {
      category: 'eam',
      categoryLabel: 'Asset Management',
      metric: 'Preventive Maintenance',
      current: 24,
      target: 30,
      unit: '%',
      status: 'off-track',
    },
  ];
};

// ============================================================================
// Main Dashboard Data
// ============================================================================

const timeSeriesData = generateTimeSeriesData();
const alerts = generateAlerts();
const performanceMetrics = generatePerformanceMetrics();

export const commandCenterMockData: DashboardData = {
  kpis: {
    // Permitting KPIs
    permitApplications: {
      label: 'Permit Applications',
      value: 247,
      changePercent: 8.3,
      trend: 'up',
      status: 'neutral',
      category: 'permitting',
    },
    permitBacklog: {
      label: 'Permit Backlog',
      value: 156,
      changePercent: 12.5,
      trend: 'up',
      status: 'warning',
      category: 'permitting',
    },
    avgPermitDays: {
      label: 'Avg Days to Decision',
      value: '18.5',
      unit: 'days',
      changePercent: -3.2,
      trend: 'down',
      status: 'success',
      category: 'permitting',
    },

    // Procurement KPIs
    openSolicitations: {
      label: 'Open Solicitations',
      value: 34,
      changePercent: 5.1,
      trend: 'up',
      status: 'neutral',
      category: 'procurement',
    },
    procurementCompliance: {
      label: 'Compliance Rate',
      value: '94',
      unit: '%',
      changePercent: 2.3,
      trend: 'up',
      status: 'success',
      category: 'procurement',
    },
    avgAwardDays: {
      label: 'Avg Days to Award',
      value: '52',
      unit: 'days',
      changePercent: -4.8,
      trend: 'down',
      status: 'success',
      category: 'procurement',
    },

    // Financial KPIs
    budgetConsumed: {
      label: 'Budget Consumed',
      value: '68',
      unit: '%',
      changePercent: 4.2,
      trend: 'up',
      status: 'neutral',
      category: 'financials',
    },
    overbudgetAccounts: {
      label: 'Overbudget Accounts',
      value: 8,
      changePercent: 33.3,
      trend: 'up',
      status: 'error',
      category: 'financials',
    },
    monthlySpend: {
      label: 'Monthly Spend',
      value: '$8.4M',
      changePercent: 6.7,
      trend: 'up',
      status: 'neutral',
      category: 'financials',
    },

    // EAM KPIs
    workOrdersCreated: {
      label: 'Work Orders (Monthly)',
      value: 189,
      changePercent: 7.3,
      trend: 'up',
      status: 'neutral',
      category: 'eam',
    },
    workOrderCompletion: {
      label: 'Completion Rate',
      value: '76',
      unit: '%',
      changePercent: -2.5,
      trend: 'down',
      status: 'warning',
      category: 'eam',
    },
    preventiveRatio: {
      label: 'Preventive Ratio',
      value: '24',
      unit: '%',
      changePercent: -8.1,
      trend: 'down',
      status: 'error',
      category: 'eam',
    },
  },
  timeSeriesData,
  alerts,
  performanceMetrics,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get alerts by severity
 */
export const getAlertsBySeverity = (severity: DepartmentAlert['severity']): DepartmentAlert[] => {
  return commandCenterMockData.alerts.filter(alert => alert.severity === severity);
};

/**
 * Get alerts by category
 */
export const getAlertsByCategory = (category: DepartmentAlert['category']): DepartmentAlert[] => {
  return commandCenterMockData.alerts.filter(alert => alert.category === category);
};

/**
 * Get performance metrics by status
 */
export const getMetricsByStatus = (status: PerformanceMetric['status']): PerformanceMetric[] => {
  return commandCenterMockData.performanceMetrics.filter(metric => metric.status === status);
};

/**
 * Format time ago
 */
export const formatTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  if (diffDays === 1) {
    return 'Yesterday';
  }
  return `${diffDays}d ago`;
};

export default commandCenterMockData;
