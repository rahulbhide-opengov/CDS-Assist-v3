/**
 * CDS-Assist user personas.
 * Defines OpenGov suite users for design and development guidance.
 */

export interface Persona {
  name: string;
  role: string;
  suite: string;
  techFluency: 'low' | 'medium' | 'high';
  primaryTasks: string[];
}

export const personas: Persona[] = [
  {
    name: 'Budget Director',
    role: 'Director of Budget & Finance',
    suite: 'budgeting',
    techFluency: 'medium',
    primaryTasks: ['Review budget proposals', 'Approve line items', 'Generate fiscal reports'],
  },
  {
    name: 'Maintenance Worker',
    role: 'Field Maintenance Technician',
    suite: 'eam',
    techFluency: 'low',
    primaryTasks: ['View work orders', 'Update task status', 'Log inspection results'],
  },
  {
    name: 'Permit Reviewer',
    role: 'Senior Permit Analyst',
    suite: 'permitting',
    techFluency: 'medium',
    primaryTasks: ['Review applications', 'Schedule inspections', 'Issue permits'],
  },
  {
    name: 'Procurement Agent',
    role: 'Procurement Specialist',
    suite: 'procurement',
    techFluency: 'medium',
    primaryTasks: ['Create RFPs', 'Evaluate bids', 'Manage contracts'],
  },
  {
    name: 'City Manager',
    role: 'City Manager',
    suite: 'command-center',
    techFluency: 'low',
    primaryTasks: ['View city-wide metrics', 'Monitor department KPIs', 'Review reports'],
  },
  {
    name: 'IT Director',
    role: 'Chief Information Officer',
    suite: 'agent-studio',
    techFluency: 'high',
    primaryTasks: ['Configure AI agents', 'Manage integrations', 'Monitor system health'],
  },
];
