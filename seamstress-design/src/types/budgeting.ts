/**
 * Budgeting & Performance Type Definitions
 */

export type BudgetStatus = 'draft' | 'active' | 'approved' | 'closed';
export type BudgetPhase = 'Setup' | 'Submission' | 'Review' | 'Approval' | 'Execution' | 'Closed';
export type WorksheetType = 'expenses' | 'revenues' | 'fixed-costs' | 'adjustments';
export type ProposalStatus = 'draft' | 'in-review' | 'approved' | 'rejected';
export type MilestoneStatus = 'active' | 'upcoming' | 'completed' | 'overdue';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';
export type PositionRequestStatus = 'approved' | 'in-progress' | 'on-hold' | 'in-review' | 'not-approved';

export interface Budget {
  id: string;
  name: string;
  fiscalYear: string;
  type: 'operating' | 'capital';
  status: BudgetStatus;
  phase: BudgetPhase;
  startDate: string;
  endDate: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAmount {
  baseAmount: number;
  totalAdjustments: number;
  baseAdjustments: number;
  itemizations: number;
}

export interface BudgetOverview {
  budgetId: string;
  revenues: {
    approved: BudgetAmount;
    unapproved: BudgetAmount;
    total: number;
  };
  expenses: {
    approved: BudgetAmount;
    unapproved: BudgetAmount;
    total: number;
  };
  surplus: number;
  deficit: number;
}

export interface Worksheet {
  id: string;
  budgetId: string;
  name: string;
  type: WorksheetType;
  department: string;
  period: string;
  lastEditedBy: string;
  lastEditedAt: string;
  status: 'draft' | 'submitted' | 'approved';
}

export interface Proposal {
  id: string;
  budgetId: string;
  title: string;
  description: string;
  department: string;
  requestedAmount: number;
  status: ProposalStatus;
  submittedBy: string;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface Milestone {
  id: string;
  budgetId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  startDate: string;
  endDate: string;
  completedTasks: number;
  totalTasks: number;
  assignedTo?: string;
}

export interface Task {
  id: string;
  milestoneId?: string;
  budgetId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
}

export interface COABreakdown {
  category: string;
  value: number;
  subcategories?: {
    name: string;
    value: number;
  }[];
}

export interface PositionRequest {
  id: string;
  budgetId: string;
  department: string;
  positionTitle: string;
  status: PositionRequestStatus;
  salary: number;
  benefits: number;
  requestedBy: string;
  requestedAt: string;
}

export interface CalendarMilestone {
  id: string;
  date: string;
  title: string;
  status: MilestoneStatus;
  completedTasks: number;
  totalTasks: number;
}
