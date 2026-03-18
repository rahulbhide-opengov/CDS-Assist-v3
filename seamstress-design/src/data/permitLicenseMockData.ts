/**
 * Mock Data for Permitting & Licensing Dashboard
 *
 * This file contains mock data for the Permitting & Licensing Operations dashboard
 * tracking permit applications, license renewals, inspections, and approvals.
 */

import { cdsColors } from '../theme/cds';

// ============================================================================
// Type Definitions
// ============================================================================

export interface PermitLicenseKPI {
  label: string;
  value: number | string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TimeSeriesDataPoint {
  date: string;
  applications: number;
}

export interface BacklogByType {
  applicationType: string;
  openCount: number;
  color?: string;
}

export interface Application {
  applicationId: string;
  applicationType: string;
  applicationStatus: 'In Review' | 'Submitted' | 'Pending' | 'Approved' | 'Rejected' | 'Closed';
  applicantName: string;
  applicationDate: string;
  assignedReviewer: string;
  daysInStatus: number;
  decisionDate?: string;
}

export interface DashboardData {
  kpis: {
    newApplications: PermitLicenseKPI;
    approvedApplications: PermitLicenseKPI;
    avgDaysToDecision: PermitLicenseKPI;
    openBacklog: PermitLicenseKPI;
  };
  timeSeriesData: TimeSeriesDataPoint[];
  backlogByType: BacklogByType[];
  applications: Application[];
}

// ============================================================================
// Color Palette for Charts
// ============================================================================

const PERMIT_COLORS = [
  cdsColors.blurple700,
  cdsColors.purple600,
  cdsColors.magenta700,
  cdsColors.blue600,
  cdsColors.green600,
  cdsColors.orange600,
  cdsColors.red600,
  cdsColors.violet600,
  cdsColors.magenta500,
  cdsColors.slate700,
  cdsColors.orange500,
  cdsColors.blurple600,
];

// ============================================================================
// Mock Data Generation
// ============================================================================

/**
 * Generate time series data for the last 90 days
 */
const generateTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic application counts with weekly patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseCount = isWeekend ? 8 : 32;
    const variance = Math.random() * 15 - 7;

    data.push({
      date: date.toISOString().split('T')[0],
      applications: Math.max(0, Math.round(baseCount + variance)),
    });
  }

  return data;
};

/**
 * Generate backlog data by application type
 */
const generateBacklogData = (): BacklogByType[] => {
  const types = [
    'Building Permit',
    'Business License',
    'Special Event Permit',
    'Food Service License',
    'Sign Permit',
    'Zoning Variance',
    'Home Occupation',
    'Liquor License',
    'Tree Removal Permit',
    'Encroachment Permit',
    'Demolition Permit',
    'Fire Inspection',
    'Alcohol License',
    'Fence Permit',
    'Pool Permit',
  ];

  return types.map((applicationType, idx) => ({
    applicationType,
    openCount: Math.floor(Math.random() * 120) + 8,
    color: PERMIT_COLORS[idx % PERMIT_COLORS.length],
  })).sort((a, b) => b.openCount - a.openCount);
};

/**
 * Generate detailed application data
 */
const generateApplications = (): Application[] => {
  const types = [
    'Building Permit',
    'Business License',
    'Special Event Permit',
    'Food Service License',
    'Sign Permit',
    'Zoning Variance',
    'Home Occupation',
    'Liquor License',
    'Tree Removal Permit',
    'Encroachment Permit',
  ];

  const statuses: Application['applicationStatus'][] = [
    'In Review',
    'Submitted',
    'Pending',
    'Approved',
    'Rejected',
    'Closed',
  ];

  const reviewers = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Jennifer White',
    'Robert Martinez',
    'Lisa Anderson',
    'James Wilson',
    'Maria Garcia',
    'John Taylor',
  ];

  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'David', 'Barbara', 'William', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

  const applications: Application[] = [];
  const today = new Date();

  for (let i = 0; i < 200; i++) {
    const applicationDate = new Date(today);
    applicationDate.setDate(applicationDate.getDate() - Math.floor(Math.random() * 180));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysInStatus = Math.floor(Math.random() * 45) + 1;

    let decisionDate: string | undefined;
    if (status === 'Approved' || status === 'Rejected' || status === 'Closed') {
      const decisionDateObj = new Date(applicationDate);
      decisionDateObj.setDate(decisionDateObj.getDate() + Math.floor(Math.random() * 30) + 5);
      decisionDate = decisionDateObj.toISOString().split('T')[0];
    }

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    applications.push({
      applicationId: `PLG-${String(10000 + i).slice(1)}`,
      applicationType: types[Math.floor(Math.random() * types.length)],
      applicationStatus: status,
      applicantName: `${firstName} ${lastName}`,
      applicationDate: applicationDate.toISOString().split('T')[0],
      assignedReviewer: reviewers[Math.floor(Math.random() * reviewers.length)],
      daysInStatus,
      decisionDate,
    });
  }

  return applications.sort((a, b) =>
    new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
  );
};

// ============================================================================
// Main Dashboard Data
// ============================================================================

const applications = generateApplications();
const timeSeriesData = generateTimeSeriesData();
const backlogByType = generateBacklogData();

// Calculate KPIs from generated data
const last90Days = new Date();
last90Days.setDate(last90Days.getDate() - 90);

const newApplicationsCount = applications.filter(app => {
  const appDate = new Date(app.applicationDate);
  return appDate >= last90Days;
}).length;

const approvedApplicationsCount = applications.filter(app => {
  const appDate = new Date(app.applicationDate);
  return appDate >= last90Days && app.applicationStatus === 'Approved';
}).length;

// Calculate average days to decision for closed applications
const closedApplications = applications.filter(app =>
  app.decisionDate && (app.applicationStatus === 'Approved' || app.applicationStatus === 'Rejected')
);
const avgDaysToDecision = closedApplications.length > 0
  ? closedApplications.reduce((sum, app) => {
      const appDate = new Date(app.applicationDate);
      const decDate = new Date(app.decisionDate!);
      const days = Math.floor((decDate.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / closedApplications.length
  : 0;

const openBacklogCount = applications.filter(app =>
  app.applicationStatus === 'In Review' ||
  app.applicationStatus === 'Submitted' ||
  app.applicationStatus === 'Pending'
).length;

export const permitLicenseMockData: DashboardData = {
  kpis: {
    newApplications: {
      label: 'New Applications',
      value: newApplicationsCount,
      changePercent: 12.3,
      trend: 'up',
    },
    approvedApplications: {
      label: 'Approved Applications',
      value: approvedApplicationsCount,
      changePercent: 8.7,
      trend: 'up',
    },
    avgDaysToDecision: {
      label: 'Avg Days to Decision',
      value: avgDaysToDecision.toFixed(1),
      changePercent: -5.4,
      trend: 'down', // Down is good for processing time
    },
    openBacklog: {
      label: 'Open Backlog',
      value: openBacklogCount,
      changePercent: -3.2,
      trend: 'down', // Down is good for backlog
    },
  },
  timeSeriesData,
  backlogByType,
  applications,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get applications by status
 */
export const getApplicationsByStatus = (status: Application['applicationStatus']): Application[] => {
  return permitLicenseMockData.applications.filter(app => app.applicationStatus === status);
};

/**
 * Get open applications count
 */
export const getOpenApplicationsCount = (): number => {
  return permitLicenseMockData.applications.filter(
    app => app.applicationStatus === 'In Review' ||
           app.applicationStatus === 'Submitted' ||
           app.applicationStatus === 'Pending'
  ).length;
};

/**
 * Get applications by type
 */
export const getApplicationsByType = (applicationType: string): Application[] => {
  return permitLicenseMockData.applications.filter(app => app.applicationType === applicationType);
};

/**
 * Get applications by reviewer
 */
export const getApplicationsByReviewer = (reviewer: string): Application[] => {
  return permitLicenseMockData.applications.filter(app => app.assignedReviewer === reviewer);
};

/**
 * Get unique application types
 */
export const getApplicationTypes = (): string[] => {
  return [...new Set(permitLicenseMockData.applications.map(app => app.applicationType))].sort();
};

/**
 * Get unique reviewers
 */
export const getReviewers = (): string[] => {
  return [...new Set(permitLicenseMockData.applications.map(app => app.assignedReviewer))].sort();
};

/**
 * Get all unique statuses
 */
export const getStatuses = (): string[] => {
  return [...new Set(permitLicenseMockData.applications.map(app => app.applicationStatus))];
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default permitLicenseMockData;
