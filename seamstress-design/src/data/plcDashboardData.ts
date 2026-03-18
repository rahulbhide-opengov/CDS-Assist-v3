export interface PLCApplication {
  id: string;
  recordType: string;
  applicant: string;
  status: 'In Review' | 'Approved' | 'On Hold' | 'Submitted' | 'Denied';
  submitted: string;
  assigned: string;
}

export interface PLCInspection {
  address: string;
  type: string;
  date: string;
  time: string;
  inspector: string;
}

export interface PLCMonthlyData {
  month: string;
  submitted: number;
  approved: number;
  denied: number;
}

export interface PLCStatusDistribution {
  label: string;
  value: number;
  paletteColor: string;
}

export const plcKPIs = {
  activePermits: { value: 1247, change: 12.3, label: 'Active Permits' },
  pendingReviews: { value: 83, change: -5.1, label: 'Pending Reviews' },
  inspectionsScheduled: { value: 36, change: 8.7, label: 'Inspections Scheduled' },
  revenueThisMonth: { value: 428500, change: 18.2, label: 'Revenue This Month' },
};

export const plcMonthlyData: PLCMonthlyData[] = [
  { month: 'Jan', submitted: 42, approved: 35, denied: 5 },
  { month: 'Feb', submitted: 38, approved: 30, denied: 4 },
  { month: 'Mar', submitted: 55, approved: 45, denied: 6 },
  { month: 'Apr', submitted: 48, approved: 40, denied: 3 },
  { month: 'May', submitted: 62, approved: 52, denied: 7 },
  { month: 'Jun', submitted: 58, approved: 48, denied: 5 },
  { month: 'Jul', submitted: 70, approved: 58, denied: 8 },
  { month: 'Aug', submitted: 65, approved: 55, denied: 6 },
  { month: 'Sep', submitted: 72, approved: 60, denied: 7 },
  { month: 'Oct', submitted: 68, approved: 56, denied: 9 },
  { month: 'Nov', submitted: 75, approved: 62, denied: 8 },
  { month: 'Dec', submitted: 80, approved: 65, denied: 10 },
];

export const plcStatusDistribution: PLCStatusDistribution[] = [
  { label: 'In Review', value: 42, paletteColor: 'info' },
  { label: 'Approved', value: 31, paletteColor: 'success' },
  { label: 'On Hold', value: 15, paletteColor: 'warning' },
  { label: 'Denied', value: 12, paletteColor: 'error' },
];

export const plcRecentApplications: PLCApplication[] = [
  { id: 'PER-2024-1089', recordType: 'Building Permit', applicant: 'Sarah Johnson', status: 'In Review', submitted: 'Mar 10', assigned: 'Mike Chen' },
  { id: 'LIC-2024-0892', recordType: 'Business License', applicant: 'TechCorp LLC', status: 'Approved', submitted: 'Mar 9', assigned: 'Lisa Park' },
  { id: 'PER-2024-1088', recordType: 'Electrical Permit', applicant: 'David Wilson', status: 'On Hold', submitted: 'Mar 8', assigned: 'James Lee' },
  { id: 'PER-2024-1087', recordType: 'Plumbing Permit', applicant: 'Maria Garcia', status: 'Submitted', submitted: 'Mar 7', assigned: 'Unassigned' },
  { id: 'LIC-2024-0891', recordType: 'Contractor License', applicant: 'BuildRight Inc', status: 'Denied', submitted: 'Mar 6', assigned: 'Lisa Park' },
];

export const plcUpcomingInspections: PLCInspection[] = [
  { address: '142 Oak Street', type: 'Electrical Inspection', date: 'Today', time: '2:00 PM', inspector: 'Mike Chen' },
  { address: '89 Elm Avenue', type: 'Final Building Inspection', date: 'Today', time: '4:30 PM', inspector: 'James Lee' },
  { address: '201 Pine Blvd', type: 'Plumbing Rough-In', date: 'Tomorrow', time: '9:00 AM', inspector: 'Mike Chen' },
  { address: '55 Maple Drive', type: 'Fire Safety Inspection', date: 'Tomorrow', time: '11:00 AM', inspector: 'Sarah Kim' },
  { address: '310 Cedar Lane', type: 'Structural Inspection', date: 'Mar 14', time: '10:00 AM', inspector: 'James Lee' },
];
