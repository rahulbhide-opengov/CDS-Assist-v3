/**
 * Mock data for Component Patterns documentation page examples.
 * Realistic sample data for government application contexts.
 */

export interface ListItem {
  id: number;
  name: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  department: string;
  date: string;
  amount?: number;
}

export const sampleListItems: ListItem[] = [
  {
    id: 1,
    name: 'FY2025 Infrastructure Budget',
    status: 'approved',
    department: 'Public Works',
    date: '2025-01-15',
    amount: 2450000,
  },
  {
    id: 2,
    name: 'Park Renovation Permit #2847',
    status: 'in_review',
    department: 'Parks & Recreation',
    date: '2025-01-12',
    amount: 185000,
  },
  {
    id: 3,
    name: 'Water Treatment Facility Upgrade',
    status: 'pending',
    department: 'Utilities',
    date: '2025-01-10',
    amount: 890000,
  },
  {
    id: 4,
    name: 'Downtown Streetlight Replacement',
    status: 'approved',
    department: 'Public Works',
    date: '2025-01-08',
    amount: 125000,
  },
  {
    id: 5,
    name: 'Community Center HVAC System',
    status: 'rejected',
    department: 'Facilities',
    date: '2025-01-05',
    amount: 75000,
  },
];

export interface MetricData {
  id: string;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
}

export const sampleMetrics: MetricData[] = [
  {
    id: 'total-requests',
    label: 'Total Requests',
    value: '1,247',
    change: 12,
    changeLabel: 'from last month',
  },
  {
    id: 'pending-approval',
    label: 'Pending Approval',
    value: '38',
    change: -5,
    changeLabel: 'from last week',
  },
  {
    id: 'budget-utilized',
    label: 'Budget Utilized',
    value: '67%',
    change: 8,
    changeLabel: 'from Q3',
  },
  {
    id: 'avg-processing',
    label: 'Avg. Processing Time',
    value: '4.2 days',
    change: -15,
    changeLabel: 'improvement',
  },
];

export interface FormDefaults {
  title: string;
  description: string;
  category: string;
  department: string;
  priority: string;
  estimatedAmount: string;
}

export const sampleFormDefaults: FormDefaults = {
  title: '',
  description: '',
  category: '',
  department: '',
  priority: 'medium',
  estimatedAmount: '',
};

export const formCategories = [
  { value: 'budget', label: 'Budget Request' },
  { value: 'permit', label: 'Permit Application' },
  { value: 'procurement', label: 'Procurement' },
  { value: 'maintenance', label: 'Maintenance Request' },
];

export const formDepartments = [
  { value: 'public-works', label: 'Public Works' },
  { value: 'parks', label: 'Parks & Recreation' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'admin', label: 'Administration' },
];

export const formPriorities = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export interface DetailData {
  id: string;
  title: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_review';
  description: string;
  department: string;
  requestedBy: string;
  createdDate: string;
  lastUpdated: string;
  estimatedAmount: number;
  attachments: number;
  comments: number;
}

export const sampleDetailData: DetailData = {
  id: 'REQ-2025-0142',
  title: 'Downtown Infrastructure Improvement Project',
  status: 'in_review',
  description:
    'Comprehensive infrastructure improvement project covering sidewalk repairs, streetlight upgrades, and drainage system improvements in the downtown commercial district. This project aims to enhance pedestrian safety and improve the overall aesthetic appeal of the area.',
  department: 'Public Works',
  requestedBy: 'Sarah Johnson',
  createdDate: '2025-01-10',
  lastUpdated: '2025-01-15',
  estimatedAmount: 1250000,
  attachments: 5,
  comments: 12,
};

// Status color mapping for consistency
export const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error',
  in_review: 'info',
};

export const statusLabels: Record<string, string> = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  in_review: 'In Review',
};
