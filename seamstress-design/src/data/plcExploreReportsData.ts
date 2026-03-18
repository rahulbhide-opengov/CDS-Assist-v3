export type TransactionType = 'Payment' | 'Refund' | 'Hold' | 'Rejected';
export type RecordStatus = 'Active' | 'Pending' | 'Completed' | 'Rejected' | 'On Hold';
export type ReportCategory = 'Records' | 'Approvals' | 'Payments' | 'Documents' | 'Inspections' | 'Projects';

export interface Inspector {
  name: string;
  initials: string;
}

export interface RecordLocation {
  lat: number;
  lng: number;
  address: string;
  zone: string;
}

export type PaymentMethod = 'Credit Card' | 'Check' | 'Wire' | 'Cash' | 'ACH';

export interface ReportRecord {
  id: number;
  recordId: string;
  recordType: string;
  label: string;
  datePaid: string;
  inspector: Inspector;
  amount: number;
  transactionType: TransactionType;
  status: RecordStatus;
  department: string;
  category: ReportCategory;
  location: RecordLocation;
  paymentMethod: PaymentMethod;
  paymentNote: string;
  applicant: string;
}

export interface ReportGroup {
  name: string;
  count: number;
  items: { name: string; id: string }[];
}

const INSPECTORS: Inspector[] = [
  { name: 'Allison Lee', initials: 'AL' },
  { name: 'Michael Chen', initials: 'MC' },
  { name: 'Sarah Johnson', initials: 'SJ' },
  { name: 'David Park', initials: 'DP' },
  { name: 'Emily Torres', initials: 'ET' },
  { name: 'James Wilson', initials: 'JW' },
  { name: 'Rachel Green', initials: 'RG' },
  { name: 'Kevin Brown', initials: 'KB' },
];

const RECORD_TYPES = [
  "Sydney's Test", 'Building Permit', 'Electrical Permit', 'Plumbing Permit',
  'Mechanical Permit', 'Demolition Permit', 'Grading Permit', 'Fire Permit',
  'Sign Permit', 'Encroachment Permit',
];

const DEPARTMENTS = ['Building Services', 'Planning', 'Public Works', 'Fire Prevention', 'Environmental'];

const PAYMENT_METHODS: PaymentMethod[] = ['Credit Card', 'Check', 'Wire', 'Cash', 'ACH'];

const PAYMENT_NOTES = [
  'Annual fee renewal', 'Inspection fee', 'Permit application', 'Late penalty',
  'Plan review charge', 'Re-inspection', 'Technology surcharge', 'Bond deposit',
  'Impact fee', 'Utility connection', '', '', '',
];

const APPLICANTS = [
  'Smith Construction LLC', 'Metro Electric Inc', 'Johnson & Associates',
  'Pacific Plumbing Co', 'Summit Builders', 'Golden Gate Mechanical',
  'Riverside Development', 'Heritage Properties', 'Valley Engineering',
  'Peak Construction Group', 'Sunrise Contractors',
];

const ZONES = ['Zone A - Downtown', 'Zone B - Residential', 'Zone C - Industrial', 'Zone D - Commercial', 'Zone E - Mixed Use'];

const ZONE_CENTERS: Record<string, [number, number]> = {
  'Zone A - Downtown': [33.753, -84.390],
  'Zone B - Residential': [33.770, -84.365],
  'Zone C - Industrial': [33.730, -84.410],
  'Zone D - Commercial': [33.760, -84.350],
  'Zone E - Mixed Use': [33.740, -84.375],
};

const ADDRESSES = [
  '123 Main St', '456 Oak Ave', '789 Elm Blvd', '321 Pine Rd', '654 Maple Dr',
  '987 Cedar Ln', '147 Birch Way', '258 Spruce Ct', '369 Willow Pl', '741 Ash St',
  '852 Poplar Ave', '963 Hickory Blvd', '159 Walnut Rd', '267 Cherry Dr', '378 Sycamore Ln',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateReportRecords(count: number = 100): ReportRecord[] {
  const rng = seededRandom(42);
  const records: ReportRecord[] = [];
  const txTypes: TransactionType[] = ['Payment', 'Refund', 'Payment', 'Payment', 'Hold', 'Payment', 'Rejected', 'Payment'];
  const statuses: RecordStatus[] = ['Active', 'Pending', 'Completed', 'Completed', 'Rejected', 'On Hold', 'Active', 'Completed'];
  const categories: ReportCategory[] = ['Records', 'Approvals', 'Payments', 'Payments', 'Documents', 'Inspections', 'Projects', 'Payments'];

  for (let i = 0; i < count; i++) {
    const inspectorIdx = Math.floor(rng() * INSPECTORS.length);
    const typeIdx = Math.floor(rng() * RECORD_TYPES.length);
    const deptIdx = Math.floor(rng() * DEPARTMENTS.length);
    const txIdx = Math.floor(rng() * txTypes.length);
    const statusIdx = Math.floor(rng() * statuses.length);
    const catIdx = Math.floor(rng() * categories.length);
    const addrIdx = Math.floor(rng() * ADDRESSES.length);
    const zoneIdx = Math.floor(rng() * ZONES.length);

    const month = Math.floor(rng() * 12) + 1;
    const day = Math.floor(rng() * 28) + 1;
    const amount = Math.round((rng() * 4500 + 100) * 100) / 100;
    const label = Math.floor(rng() * 900 + 100).toString();

    const pmIdx = Math.floor(rng() * PAYMENT_METHODS.length);
    const pnIdx = Math.floor(rng() * PAYMENT_NOTES.length);
    const apIdx = Math.floor(rng() * APPLICANTS.length);

    records.push({
      id: i + 1,
      recordId: (1100 + Math.floor(rng() * 200)).toString(),
      recordType: RECORD_TYPES[typeIdx],
      label,
      datePaid: `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-2025`,
      inspector: INSPECTORS[inspectorIdx],
      amount,
      transactionType: txTypes[txIdx],
      status: statuses[statusIdx],
      department: DEPARTMENTS[deptIdx],
      category: categories[catIdx],
      paymentMethod: PAYMENT_METHODS[pmIdx],
      paymentNote: PAYMENT_NOTES[pnIdx],
      applicant: APPLICANTS[apIdx],
      location: {
        lat: ZONE_CENTERS[ZONES[zoneIdx]][0] + (rng() - 0.5) * 0.015,
        lng: ZONE_CENTERS[ZONES[zoneIdx]][1] + (rng() - 0.5) * 0.015,
        address: ADDRESSES[addrIdx],
        zone: ZONES[zoneIdx],
      },
    });
  }
  return records;
}

export const REPORT_CATEGORIES: ReportGroup[] = [
  { name: 'Records', count: 7, items: [
    { name: 'All Records', id: 'all-records' },
    { name: 'Active Permits', id: 'active-permits' },
    { name: 'Expired Permits', id: 'expired-permits' },
  ]},
  { name: 'Approvals', count: 3, items: [
    { name: 'Pending Approvals', id: 'pending-approvals' },
    { name: 'Approved FY25', id: 'approved-fy25' },
  ]},
  { name: 'Payments', count: 8, items: [
    { name: "Ledger — FY'24", id: 'ledger-fy24' },
    { name: "Ledger — FY'25", id: 'ledger-fy25' },
    { name: 'Test', id: 'test' },
    { name: "Payment Refund Budgets'24", id: 'payment-refund-24' },
  ]},
  { name: 'Documents', count: 12, items: [
    { name: 'Uploaded Documents', id: 'uploaded-docs' },
    { name: 'Compliance Reports', id: 'compliance-reports' },
  ]},
  { name: 'Inspections', count: 4, items: [
    { name: 'Scheduled Inspections', id: 'scheduled-inspections' },
    { name: 'Completed Inspections', id: 'completed-inspections' },
  ]},
  { name: 'Projects', count: 5, items: [
    { name: 'Active Projects', id: 'active-projects' },
    { name: 'Archived Projects', id: 'archived-projects' },
  ]},
];

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, 'success' | 'warning' | 'info' | 'error'> = {
  Payment: 'success',
  Refund: 'warning',
  Hold: 'info',
  Rejected: 'error',
};

export const STATUS_COLORS: Record<RecordStatus, 'success' | 'warning' | 'info' | 'error' | 'default'> = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'info',
  Rejected: 'error',
  'On Hold': 'default',
};
