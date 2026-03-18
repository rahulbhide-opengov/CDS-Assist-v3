import { faker } from '@faker-js/faker';

faker.seed(42);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PLCKPIs {
  activePermits: { value: number; change: number };
  pendingReviews: { value: number; change: number };
  inspectionsScheduled: { value: number; change: number };
  revenueThisMonth: { value: number; change: number };
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
  paletteColor: 'info' | 'success' | 'warning' | 'error';
}

export type PLCApplicationStatus = 'In Review' | 'Approved' | 'On Hold' | 'Submitted' | 'Denied';

export interface PLCApplication {
  id: string;
  recordType: string;
  applicant: string;
  status: PLCApplicationStatus;
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

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

const RECORD_TYPES = ['Building Permit', 'Business License', 'Electrical Permit', 'Plumbing Permit', 'Contractor License', 'Land Use Permit'];
const INSPECTION_TYPES = ['Electrical Inspection', 'Final Building Inspection', 'Plumbing Rough-In', 'Fire Safety Inspection', 'Structural Inspection', 'Foundation Inspection'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const STATUSES: PLCApplicationStatus[] = ['In Review', 'Approved', 'On Hold', 'Submitted', 'Denied'];

export function generatePLCKPIs(): PLCKPIs {
  return {
    activePermits: { value: faker.number.int({ min: 900, max: 1500 }), change: faker.number.float({ min: -8, max: 20, fractionDigits: 1 }) },
    pendingReviews: { value: faker.number.int({ min: 40, max: 120 }), change: faker.number.float({ min: -15, max: 10, fractionDigits: 1 }) },
    inspectionsScheduled: { value: faker.number.int({ min: 20, max: 60 }), change: faker.number.float({ min: -5, max: 15, fractionDigits: 1 }) },
    revenueThisMonth: { value: faker.number.int({ min: 300000, max: 600000 }), change: faker.number.float({ min: 5, max: 25, fractionDigits: 1 }) },
  };
}

export function generateMonthlyPermitData(): PLCMonthlyData[] {
  return MONTHS.map((month) => ({
    month,
    submitted: faker.number.int({ min: 30, max: 85 }),
    approved: faker.number.int({ min: 25, max: 70 }),
    denied: faker.number.int({ min: 2, max: 12 }),
  }));
}

export function generateStatusDistribution(): PLCStatusDistribution[] {
  return [
    { label: 'In Review', value: faker.number.int({ min: 35, max: 50 }), paletteColor: 'info' },
    { label: 'Approved', value: faker.number.int({ min: 25, max: 40 }), paletteColor: 'success' },
    { label: 'On Hold', value: faker.number.int({ min: 10, max: 20 }), paletteColor: 'warning' },
    { label: 'Denied', value: faker.number.int({ min: 5, max: 15 }), paletteColor: 'error' },
  ];
}

export function generateRecentApplications(count: number): PLCApplication[] {
  return Array.from({ length: count }, () => ({
    id: `${faker.helpers.arrayElement(['PER', 'LIC'])}-${faker.date.recent().getFullYear()}-${faker.string.numeric(4)}`,
    recordType: faker.helpers.arrayElement(RECORD_TYPES),
    applicant: faker.person.fullName(),
    status: faker.helpers.arrayElement(STATUSES),
    submitted: faker.date.recent({ days: 14 }).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    assigned: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.8 }) ?? 'Unassigned',
  }));
}

export function generateUpcomingInspections(count: number): PLCInspection[] {
  const dates = ['Today', 'Today', 'Tomorrow', 'Tomorrow', 'Mar 14', 'Mar 15', 'Mar 16'];
  return Array.from({ length: count }, (_, i) => ({
    address: `${faker.number.int({ min: 10, max: 999 })} ${faker.location.street()}`,
    type: faker.helpers.arrayElement(INSPECTION_TYPES),
    date: dates[i % dates.length],
    time: faker.helpers.arrayElement(['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:30 PM', '4:30 PM']),
    inspector: faker.person.fullName(),
  }));
}
