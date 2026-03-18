export interface Agent {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  permissions: string[];
  agency: string;
  created: string;
  avatar?: string;
  phone?: string;
  title?: string;
}

export const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@springfield.gov',
    role: 'City Manager',
    department: 'Executive',
    status: 'active',
    lastActive: '2024-01-10T10:30:00Z',
    permissions: ['all_access', 'budget_approve', 'contract_approve', 'audit_view'],
    agency: 'City of Springfield',
    created: '2023-01-15T08:00:00Z',
    title: 'City Manager / Administrator',
    phone: '(555) 123-4567'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@springfield.gov',
    role: 'Finance Director',
    department: 'Finance',
    status: 'active',
    lastActive: '2024-01-10T09:15:00Z',
    permissions: ['finance_full', 'budget_edit', 'payroll_manage', 'reporting_full'],
    agency: 'City of Springfield',
    created: '2022-06-20T08:00:00Z',
    title: 'Finance Director / CFO',
    phone: '(555) 123-4568'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@springfield.gov',
    role: 'Procurement Leader',
    department: 'Procurement',
    status: 'active',
    lastActive: '2024-01-10T11:45:00Z',
    permissions: ['procurement_full', 'vendor_manage', 'contract_create', 'solicitation_publish'],
    agency: 'City of Springfield',
    created: '2023-03-10T08:00:00Z',
    title: 'Procurement Manager',
    phone: '(555) 123-4569'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@springfield.gov',
    role: 'Public Works Director',
    department: 'Public Works',
    status: 'active',
    lastActive: '2024-01-10T08:30:00Z',
    permissions: ['asset_manage', 'work_order_full', 'inspection_manage', 'compliance_report'],
    agency: 'City of Springfield',
    created: '2021-11-05T08:00:00Z',
    title: 'Public Works Director',
    phone: '(555) 123-4570'
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@springfield.gov',
    role: 'Budget Analyst',
    department: 'Finance',
    status: 'active',
    lastActive: '2024-01-09T16:20:00Z',
    permissions: ['budget_view', 'budget_edit', 'reporting_view', 'performance_measure_edit'],
    agency: 'City of Springfield',
    created: '2023-07-12T08:00:00Z',
    title: 'Senior Budget Analyst',
    phone: '(555) 123-4571'
  },
  {
    id: '6',
    name: 'Robert Taylor',
    email: 'robert.taylor@springfield.gov',
    role: 'Inspector',
    department: 'Community Development',
    status: 'active',
    lastActive: '2024-01-10T07:00:00Z',
    permissions: ['permit_view', 'inspection_create', 'inspection_complete', 'mobile_access'],
    agency: 'City of Springfield',
    created: '2022-02-28T08:00:00Z',
    title: 'Building Inspector',
    phone: '(555) 123-4572'
  },
  {
    id: '7',
    name: 'Amanda White',
    email: 'amanda.white@springfield.gov',
    role: 'Permit Technician',
    department: 'Community Development',
    status: 'active',
    lastActive: '2024-01-10T10:00:00Z',
    permissions: ['permit_process', 'fee_collect', 'application_review', 'document_manage'],
    agency: 'City of Springfield',
    created: '2023-09-01T08:00:00Z',
    title: 'Permit Technician',
    phone: '(555) 123-4573'
  },
  {
    id: '8',
    name: 'James Wilson',
    email: 'james.wilson@springfield.gov',
    role: 'IT Administrator',
    department: 'Information Technology',
    status: 'inactive',
    lastActive: '2024-01-05T14:30:00Z',
    permissions: ['system_admin', 'user_manage', 'integration_manage', 'security_audit'],
    agency: 'City of Springfield',
    created: '2021-05-15T08:00:00Z',
    title: 'IT Administrator',
    phone: '(555) 123-4574'
  },
  {
    id: '9',
    name: 'Maria Garcia',
    email: 'maria.garcia@springfield.gov',
    role: 'Utility Manager',
    department: 'Utilities',
    status: 'active',
    lastActive: '2024-01-10T09:45:00Z',
    permissions: ['utility_billing_full', 'meter_manage', 'service_order_manage', 'customer_account_manage'],
    agency: 'City of Springfield',
    created: '2022-08-10T08:00:00Z',
    title: 'Utility Billing Manager',
    phone: '(555) 123-4575'
  },
  {
    id: '10',
    name: 'Thomas Brown',
    email: 'thomas.brown@springfield.gov',
    role: 'Field Worker',
    department: 'Public Works',
    status: 'pending',
    lastActive: '2024-01-08T15:00:00Z',
    permissions: ['work_order_view', 'work_order_update', 'mobile_access', 'inspection_create'],
    agency: 'City of Springfield',
    created: '2024-01-02T08:00:00Z',
    title: 'Field Technician',
    phone: '(555) 123-4576'
  }
];

export const departments = [
  'Executive',
  'Finance',
  'Procurement',
  'Public Works',
  'Community Development',
  'Information Technology',
  'Utilities'
];

export const roles = [
  'City Manager',
  'Finance Director',
  'Procurement Leader',
  'Public Works Director',
  'Budget Analyst',
  'Inspector',
  'Permit Technician',
  'IT Administrator',
  'Utility Manager',
  'Field Worker'
];

export const permissionCategories = {
  'System': ['all_access', 'system_admin', 'user_manage', 'integration_manage', 'security_audit'],
  'Finance': ['finance_full', 'budget_view', 'budget_edit', 'budget_approve', 'payroll_manage', 'reporting_full', 'reporting_view'],
  'Procurement': ['procurement_full', 'vendor_manage', 'contract_create', 'contract_approve', 'solicitation_publish'],
  'Assets': ['asset_manage', 'work_order_full', 'work_order_view', 'work_order_update', 'inspection_manage', 'inspection_create', 'inspection_complete'],
  'Permitting': ['permit_view', 'permit_process', 'fee_collect', 'application_review', 'document_manage'],
  'Utilities': ['utility_billing_full', 'meter_manage', 'service_order_manage', 'customer_account_manage'],
  'Performance': ['performance_measure_edit', 'compliance_report', 'audit_view'],
  'Access': ['mobile_access']
};