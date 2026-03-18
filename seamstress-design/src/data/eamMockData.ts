/**
 * Mock Data for Asset & Work Management Dashboard
 *
 * This file contains mock data for monitoring asset condition, maintenance workload,
 * and completion performance for Enterprise Asset Management.
 */

import { cdsColors } from '../theme/cds';

// ============================================================================
// Type Definitions
// ============================================================================

export interface EAMKPI {
  label: string;
  value: number | string;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TimeSeriesDataPoint {
  date: string;
  workOrders: number;
}

export interface WorkOrdersByAssetType {
  assetType: string;
  workOrderCount: number;
  color?: string;
}

export interface WorkOrder {
  workOrderId: string;
  workOrderStatus: 'Open' | 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  workOrderType: 'Preventive' | 'Reactive' | 'Emergency' | 'Inspection';
  assetId: string;
  assetName: string;
  assetType: string;
  crewName: string;
  workOrderDate: string;
  completedDate?: string;
  durationHours: number;
  laborCost: number;
  materialCost: number;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface DashboardData {
  kpis: {
    workOrdersCreated: EAMKPI;
    completionRate: EAMKPI;
    avgWorkOrderDuration: EAMKPI;
    preventiveRatio: EAMKPI;
  };
  timeSeriesData: TimeSeriesDataPoint[];
  workOrdersByAssetType: WorkOrdersByAssetType[];
  workOrders: WorkOrder[];
}

// ============================================================================
// Color Palette for Charts
// ============================================================================

const EAM_COLORS = [
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
 * Generate time series data for the last 90 days (weekly aggregation)
 */
const generateTimeSeriesData = (): TimeSeriesDataPoint[] => {
  const data: TimeSeriesDataPoint[] = [];
  const today = new Date();

  // Generate 13 weeks of data
  for (let i = 12; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - (i * 7));

    const baseCount = 45;
    const variance = Math.random() * 20 - 10;

    data.push({
      date: date.toISOString().split('T')[0],
      workOrders: Math.max(0, Math.round(baseCount + variance)),
    });
  }

  return data;
};

/**
 * Generate work orders by asset type data
 */
const generateWorkOrdersByAssetType = (): WorkOrdersByAssetType[] => {
  const assetTypes = [
    'HVAC Systems',
    'Electrical',
    'Plumbing',
    'Vehicles',
    'Buildings',
    'Grounds/Landscape',
    'Roads & Infrastructure',
    'IT Equipment',
    'Fire Safety',
    'Security Systems',
  ];

  return assetTypes.map((assetType, idx) => ({
    assetType,
    workOrderCount: Math.floor(Math.random() * 120) + 30,
    color: EAM_COLORS[idx % EAM_COLORS.length],
  })).sort((a, b) => b.workOrderCount - a.workOrderCount);
};

/**
 * Generate detailed work order data
 */
const generateWorkOrders = (): WorkOrder[] => {
  const statuses: WorkOrder['workOrderStatus'][] = ['Open', 'Scheduled', 'In Progress', 'Completed', 'Cancelled'];
  const types: WorkOrder['workOrderType'][] = ['Preventive', 'Reactive', 'Emergency', 'Inspection'];
  const priorities: WorkOrder['priority'][] = ['Low', 'Medium', 'High', 'Critical'];

  const assetTypes = [
    'HVAC Systems',
    'Electrical',
    'Plumbing',
    'Vehicles',
    'Buildings',
    'Grounds/Landscape',
    'Roads & Infrastructure',
    'IT Equipment',
    'Fire Safety',
    'Security Systems',
  ];

  const crews = [
    'Maintenance Crew A',
    'Maintenance Crew B',
    'Electrical Team',
    'Plumbing Team',
    'HVAC Specialists',
    'Grounds Crew',
    'Vehicle Maintenance',
    'Building Services',
  ];

  const assetNames = [
    'Boiler #3 - City Hall',
    'Transformer Station 12',
    'Water Main - Oak Street',
    'Fire Truck Engine 5',
    'City Hall Roof',
    'Central Park Irrigation',
    'Bridge #15 - River Crossing',
    'Server Room AC Unit',
    'Fire Alarm Panel - Library',
    'Security Camera System',
    'HVAC Unit B - Police Station',
    'Emergency Generator - Hospital',
    'Elevator #2 - Municipal Building',
    'Street Lighting Circuit 4',
    'Waste Water Pump Station 3',
  ];

  const workOrders: WorkOrder[] = [];
  const today = new Date();

  for (let i = 0; i < 180; i++) {
    const workOrderDate = new Date(today);
    workOrderDate.setDate(workOrderDate.getDate() - Math.floor(Math.random() * 90));

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)];
    const assetName = assetNames[Math.floor(Math.random() * assetNames.length)];
    const crew = crews[Math.floor(Math.random() * crews.length)];

    const durationHours = status === 'Completed' || status === 'Cancelled'
      ? Math.floor(Math.random() * 48) + 2
      : 0;

    const laborCost = durationHours > 0
      ? Math.floor((Math.random() * 1500 + 500) * (durationHours / 8))
      : 0;

    const materialCost = durationHours > 0
      ? Math.floor(Math.random() * 3000)
      : 0;

    let completedDate: string | undefined;
    if (status === 'Completed') {
      const completed = new Date(workOrderDate);
      completed.setHours(completed.getHours() + durationHours);
      completedDate = completed.toISOString().split('T')[0];
    }

    workOrders.push({
      workOrderId: `WO-${String(10000 + i).slice(1)}`,
      workOrderStatus: status,
      workOrderType: type,
      assetId: `ASSET-${String(1000 + (i % 50)).slice(1)}`,
      assetName,
      assetType,
      crewName: crew,
      workOrderDate: workOrderDate.toISOString().split('T')[0],
      completedDate,
      durationHours,
      laborCost,
      materialCost,
      priority,
    });
  }

  return workOrders.sort((a, b) =>
    new Date(b.workOrderDate).getTime() - new Date(a.workOrderDate).getTime()
  );
};

// ============================================================================
// Main Dashboard Data
// ============================================================================

const workOrders = generateWorkOrders();
const timeSeriesData = generateTimeSeriesData();
const workOrdersByAssetType = generateWorkOrdersByAssetType();

// Calculate KPIs from generated data
const last90Days = new Date();
last90Days.setDate(last90Days.getDate() - 90);

const workOrdersCreatedCount = workOrders.filter(wo => {
  const woDate = new Date(wo.workOrderDate);
  return woDate >= last90Days;
}).length;

// Calculate completion rate
const completedCount = workOrders.filter(wo =>
  wo.workOrderStatus === 'Completed'
).length;
const completionRate = workOrdersCreatedCount > 0
  ? (completedCount / workOrdersCreatedCount) * 100
  : 0;

// Calculate average work order duration
const completedWOs = workOrders.filter(wo => wo.workOrderStatus === 'Completed' && wo.durationHours > 0);
const avgDuration = completedWOs.length > 0
  ? completedWOs.reduce((sum, wo) => sum + wo.durationHours, 0) / completedWOs.length
  : 0;

// Calculate preventive vs reactive ratio
const preventiveCount = workOrders.filter(wo => wo.workOrderType === 'Preventive').length;
const preventiveRatio = workOrders.length > 0
  ? (preventiveCount / workOrders.length) * 100
  : 0;

export const eamMockData: DashboardData = {
  kpis: {
    workOrdersCreated: {
      label: 'Work Orders Created',
      value: workOrdersCreatedCount,
      changePercent: 7.3,
      trend: 'up',
    },
    completionRate: {
      label: 'Completion Rate',
      value: completionRate.toFixed(1),
      changePercent: 5.1,
      trend: 'up',
    },
    avgWorkOrderDuration: {
      label: 'Avg Work Order Duration',
      value: avgDuration.toFixed(1),
      changePercent: -8.4,
      trend: 'down', // Down is good
    },
    preventiveRatio: {
      label: 'Preventive vs Reactive Ratio',
      value: preventiveRatio.toFixed(1),
      changePercent: 12.6,
      trend: 'up',
    },
  },
  timeSeriesData,
  workOrdersByAssetType,
  workOrders,
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get work orders by status
 */
export const getWorkOrdersByStatus = (status: WorkOrder['workOrderStatus']): WorkOrder[] => {
  return eamMockData.workOrders.filter(wo => wo.workOrderStatus === status);
};

/**
 * Get work orders by type
 */
export const getWorkOrdersByType = (type: WorkOrder['workOrderType']): WorkOrder[] => {
  return eamMockData.workOrders.filter(wo => wo.workOrderType === type);
};

/**
 * Get work orders by asset type
 */
export const getWorkOrdersByAsset = (assetType: string): WorkOrder[] => {
  return eamMockData.workOrders.filter(wo => wo.assetType === assetType);
};

/**
 * Get work orders by crew
 */
export const getWorkOrdersByCrew = (crew: string): WorkOrder[] => {
  return eamMockData.workOrders.filter(wo => wo.crewName === crew);
};

/**
 * Get unique asset types
 */
export const getAssetTypes = (): string[] => {
  return [...new Set(eamMockData.workOrders.map(wo => wo.assetType))].sort();
};

/**
 * Get unique crews
 */
export const getCrews = (): string[] => {
  return [...new Set(eamMockData.workOrders.map(wo => wo.crewName))].sort();
};

/**
 * Get all unique statuses
 */
export const getWorkOrderStatuses = (): string[] => {
  return [...new Set(eamMockData.workOrders.map(wo => wo.workOrderStatus))];
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
 * Format hours for display
 */
export const formatHours = (hours: number): string => {
  if (hours === 0) return '-';
  if (hours < 1) return `${(hours * 60).toFixed(0)}m`;
  return `${hours.toFixed(1)}h`;
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default eamMockData;
