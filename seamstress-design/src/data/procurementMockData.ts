/**
 * Mock Data for Procurement Pipeline & Performance Dashboard
 *
 * This file contains mock data for tracking procurement pipeline, cycle times,
 * supplier engagement, and compliance across solicitations and contracts.
 */

import { cdsColors } from '../theme/cds';

// ============================================================================
// Type Definitions
// ============================================================================

export interface ProcurementKPI {
  label: string;
  value: number | string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TimeSeriesDataPoint {
  date: string;
  solicitations: number;
}

export interface ResponsesByCategory {
  categoryName: string;
  avgResponses: number;
  color?: string;
}

export interface Solicitation {
  solicitationId: string;
  solicitationName: string;
  solicitationType: 'RFP' | 'RFQ' | 'IFB' | 'RFI' | 'Bid' | 'Quote';
  solicitationStatus: 'Draft' | 'Open' | 'Evaluating' | 'Awarded' | 'Cancelled' | 'Closed';
  buyerName: string;
  createdDate: string;
  awardDate?: string;
  daysOpen: number;
  supplierResponseCount: number;
  categoryName: string;
  estimatedValue: number;
  isCompliant: boolean;
}

export interface DashboardData {
  kpis: {
    solicitationsCreated: ProcurementKPI;
    avgRequestToAwardTime: ProcurementKPI;
    avgSupplierResponses: ProcurementKPI;
    complianceRate: ProcurementKPI;
  };
  timeSeriesData: TimeSeriesDataPoint[];
  responsesByCategory: ResponsesByCategory[];
  solicitations: Solicitation[];
}

// ============================================================================
// Color Palette for Charts
// ============================================================================

const PROCUREMENT_COLORS = [
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
];

// ============================================================================
// Mock Data Generation
// ============================================================================

/**
 * Generate time series data for the last 180 days (monthly aggregation)
 */
const generateTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();

  // Generate 6 months of data
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const baseCount = 25;
    const variance = Math.random() * 15 - 7;

    data.push({
      date: date.toISOString().split('T')[0],
      solicitations: Math.max(0, Math.round(baseCount + variance)),
    });
  }

  return data;
};

/**
 * Generate responses by category data
 */
const generateResponsesByCategory = (): ResponsesByCategory[] => {
  const categories = [
    'IT Services',
    'Construction',
    'Professional Services',
    'Office Supplies',
    'Facilities Maintenance',
    'Engineering Services',
    'Consulting',
    'Software Licenses',
    'Vehicle Maintenance',
    'Medical Supplies',
  ];

  return categories.map((categoryName, idx) => ({
    categoryName,
    avgResponses: Math.floor(Math.random() * 8) + 3, // 3-10 responses
    color: PROCUREMENT_COLORS[idx % PROCUREMENT_COLORS.length],
  })).sort((a, b) => b.avgResponses - a.avgResponses);
};

/**
 * Generate detailed solicitation data
 */
const generateSolicitations = (): Solicitation[] => {
  const types: Solicitation['solicitationType'][] = ['RFP', 'RFQ', 'IFB', 'RFI', 'Bid', 'Quote'];
  const statuses: Solicitation['solicitationStatus'][] = ['Draft', 'Open', 'Evaluating', 'Awarded', 'Cancelled', 'Closed'];

  const buyers = [
    'Sarah Johnson',
    'Michael Chen',
    'Emily Rodriguez',
    'David Kim',
    'Jennifer White',
    'Robert Martinez',
    'Lisa Anderson',
    'James Wilson',
  ];

  const categories = [
    'IT Services',
    'Construction',
    'Professional Services',
    'Office Supplies',
    'Facilities Maintenance',
    'Engineering Services',
    'Consulting',
    'Software Licenses',
    'Vehicle Maintenance',
    'Medical Supplies',
  ];

  const nameTemplates = [
    'Annual {category} Contract',
    '{category} for Fiscal Year 2025',
    'Multi-Year {category} Agreement',
    '{category} - Emergency Procurement',
    'Citywide {category} Services',
    '{category} Upgrade Project',
    'On-Call {category} Provider',
    '{category} Modernization Initiative',
  ];

  const solicitations: Solicitation[] = [];
  const today = new Date();

  for (let i = 0; i < 150; i++) {
    const createdDate = new Date(today);
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 180));

    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    const nameTemplate = nameTemplates[Math.floor(Math.random() * nameTemplates.length)];
    const name = nameTemplate.replace('{category}', category);

    const daysOpen = Math.floor(Math.random() * 120) + 1;
    const supplierResponseCount = status === 'Draft' ? 0 : Math.floor(Math.random() * 12) + 1;

    let awardDate: string | undefined;
    if (status === 'Awarded' || status === 'Closed') {
      const awardDateObj = new Date(createdDate);
      awardDateObj.setDate(awardDateObj.getDate() + Math.floor(Math.random() * 90) + 30);
      awardDate = awardDateObj.toISOString().split('T')[0];
    }

    const estimatedValue = Math.floor(Math.random() * 900000) + 100000; // $100k - $1M
    const isCompliant = Math.random() > 0.15; // 85% compliance rate

    solicitations.push({
      solicitationId: `SOL-${String(10000 + i).slice(1)}`,
      solicitationName: name,
      solicitationType: type,
      solicitationStatus: status,
      buyerName: buyers[Math.floor(Math.random() * buyers.length)],
      createdDate: createdDate.toISOString().split('T')[0],
      awardDate,
      daysOpen,
      supplierResponseCount,
      categoryName: category,
      estimatedValue,
      isCompliant,
    });
  }

  return solicitations.sort((a, b) =>
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
};

// ============================================================================
// Main Dashboard Data
// ============================================================================

const solicitations = generateSolicitations();
const timeSeriesData = generateTimeSeriesData();
const responsesByCategory = generateResponsesByCategory();

// Calculate KPIs from generated data
const last180Days = new Date();
last180Days.setDate(last180Days.getDate() - 180);

const solicitationsCreatedCount = solicitations.filter(sol => {
  const solDate = new Date(sol.createdDate);
  return solDate >= last180Days;
}).length;

// Calculate average request to award time for awarded solicitations
const awardedSolicitations = solicitations.filter(sol =>
  sol.awardDate && (sol.solicitationStatus === 'Awarded' || sol.solicitationStatus === 'Closed')
);
const avgRequestToAwardTime = awardedSolicitations.length > 0
  ? awardedSolicitations.reduce((sum, sol) => {
      const createdDate = new Date(sol.createdDate);
      const awardDateObj = new Date(sol.awardDate!);
      const days = Math.floor((awardDateObj.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0) / awardedSolicitations.length
  : 0;

// Calculate average supplier responses
const solicitationsWithResponses = solicitations.filter(sol => sol.supplierResponseCount > 0);
const avgSupplierResponses = solicitationsWithResponses.length > 0
  ? solicitationsWithResponses.reduce((sum, sol) => sum + sol.supplierResponseCount, 0) / solicitationsWithResponses.length
  : 0;

// Calculate compliance rate
const compliantCount = solicitations.filter(sol => sol.isCompliant).length;
const complianceRate = solicitations.length > 0
  ? (compliantCount / solicitations.length) * 100
  : 0;

export const procurementMockData: DashboardData = {
  kpis: {
    solicitationsCreated: {
      label: 'Solicitations Created',
      value: solicitationsCreatedCount,
      changePercent: 8.3,
      trend: 'up',
    },
    avgRequestToAwardTime: {
      label: 'Avg Request-to-Award Time',
      value: avgRequestToAwardTime.toFixed(1),
      changePercent: -12.5,
      trend: 'down', // Down is good
    },
    avgSupplierResponses: {
      label: 'Avg Supplier Responses',
      value: avgSupplierResponses.toFixed(1),
      changePercent: 15.2,
      trend: 'up',
    },
    complianceRate: {
      label: 'Compliance Rate',
      value: complianceRate.toFixed(1),
      changePercent: 3.7,
      trend: 'up',
    },
  },
  timeSeriesData,
  responsesByCategory,
  solicitations,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get solicitations by status
 */
export const getSolicitationsByStatus = (status: Solicitation['solicitationStatus']): Solicitation[] => {
  return procurementMockData.solicitations.filter(sol => sol.solicitationStatus === status);
};

/**
 * Get solicitations by type
 */
export const getSolicitationsByType = (type: Solicitation['solicitationType']): Solicitation[] => {
  return procurementMockData.solicitations.filter(sol => sol.solicitationType === type);
};

/**
 * Get solicitations by buyer
 */
export const getSolicitationsByBuyer = (buyer: string): Solicitation[] => {
  return procurementMockData.solicitations.filter(sol => sol.buyerName === buyer);
};

/**
 * Get unique solicitation types
 */
export const getSolicitationTypes = (): string[] => {
  return [...new Set(procurementMockData.solicitations.map(sol => sol.solicitationType))].sort();
};

/**
 * Get unique buyers
 */
export const getBuyers = (): string[] => {
  return [...new Set(procurementMockData.solicitations.map(sol => sol.buyerName))].sort();
};

/**
 * Get all unique statuses
 */
export const getSolicitationStatuses = (): string[] => {
  return [...new Set(procurementMockData.solicitations.map(sol => sol.solicitationStatus))];
};

/**
 * Get unique categories
 */
export const getCategories = (): string[] => {
  return [...new Set(procurementMockData.solicitations.map(sol => sol.categoryName))].sort();
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
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default procurementMockData;
