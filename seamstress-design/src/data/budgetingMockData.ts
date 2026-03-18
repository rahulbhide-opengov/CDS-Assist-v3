/**
 * Mock Data for Budgeting & Performance
 * Generates realistic data for budgets, worksheets, milestones, tasks, and more
 */

import { faker } from '@faker-js/faker';
import type {
  Budget,
  BudgetOverview,
  Worksheet,
  Proposal,
  Milestone,
  Task,
  COABreakdown,
  PositionRequest,
  CalendarMilestone,
  BudgetPhase,
  MilestoneStatus,
  TaskStatus,
  PositionRequestStatus,
} from '../types/budgeting';

faker.seed(456); // Different seed for budgeting data

const departments = [
  'Administrative Department',
  'Public Works',
  'Police Department',
  'Fire Department',
  'Parks & Recreation',
  'Building & Planning',
  'City Clerk',
  'Finance',
  'Human Resources',
  'Information Technology',
];

const fiscalYears = ['FY2024', 'FY2025', 'FY2026'];
const periods = ['Q1FY24', 'Q2FY24', 'Q3FY24', 'Q4FY24', 'All periods'];

/**
 * Generate a single budget
 */
export function generateBudget(overrides?: Partial<Budget>): Budget {
  const fiscalYear = faker.helpers.arrayElement(fiscalYears);
  const type = faker.helpers.arrayElement(['operating', 'capital'] as const);
  const status = faker.helpers.arrayElement(['draft', 'active', 'approved', 'closed'] as const);
  const phase: BudgetPhase = faker.helpers.arrayElement([
    'Setup',
    'Submission',
    'Review',
    'Approval',
    'Execution',
  ]);

  return {
    id: faker.string.uuid(),
    name: `${fiscalYear} ${faker.helpers.arrayElement(departments)} ${type === 'capital' ? 'Capital' : 'Operating'} Budget`,
    fiscalYear,
    type,
    status,
    phase,
    startDate: faker.date.past({ years: 1 }).toISOString(),
    endDate: faker.date.future({ years: 1 }).toISOString(),
    description: faker.lorem.sentence(),
    createdBy: faker.person.fullName(),
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * Generate budget overview with revenues and expenses
 */
export function generateBudgetOverview(budgetId: string): BudgetOverview {
  const revenuesApproved = {
    baseAmount: faker.number.int({ min: 500000, max: 2000000 }),
    totalAdjustments: faker.number.int({ min: 10000, max: 100000 }),
    baseAdjustments: faker.number.int({ min: 5000, max: 50000 }),
    itemizations: faker.number.int({ min: 1000, max: 60000 }),
  };

  const revenuesUnapproved = {
    baseAmount: faker.number.int({ min: 0, max: 50000 }),
    totalAdjustments: faker.number.int({ min: 0, max: 100000 }),
    baseAdjustments: faker.number.int({ min: 0, max: 50000 }),
    itemizations: faker.number.int({ min: 0, max: 60000 }),
  };

  const expensesApproved = {
    baseAmount: faker.number.int({ min: 10000000, max: 20000000 }),
    totalAdjustments: faker.number.int({ min: 1000000, max: 5000000 }),
    baseAdjustments: faker.number.int({ min: 1000000, max: 4000000 }),
    itemizations: faker.number.int({ min: 1000000, max: 5000000 }),
  };

  const expensesUnapproved = {
    baseAmount: faker.number.int({ min: 0, max: 1000000 }),
    totalAdjustments: faker.number.int({ min: 0, max: 5000000 }),
    baseAdjustments: faker.number.int({ min: 0, max: 4000000 }),
    itemizations: faker.number.int({ min: 0, max: 5000000 }),
  };

  const totalRevenues =
    revenuesApproved.baseAmount +
    revenuesApproved.totalAdjustments +
    revenuesUnapproved.baseAmount +
    revenuesUnapproved.totalAdjustments;

  const totalExpenses =
    expensesApproved.baseAmount +
    expensesApproved.totalAdjustments +
    expensesUnapproved.baseAmount +
    expensesUnapproved.totalAdjustments;

  const surplus = Math.max(0, totalRevenues - totalExpenses);
  const deficit = Math.max(0, totalExpenses - totalRevenues);

  return {
    budgetId,
    revenues: {
      approved: revenuesApproved,
      unapproved: revenuesUnapproved,
      total: totalRevenues,
    },
    expenses: {
      approved: expensesApproved,
      unapproved: expensesUnapproved,
      total: totalExpenses,
    },
    surplus,
    deficit,
  };
}

/**
 * Generate a single worksheet
 */
export function generateWorksheet(budgetId: string, overrides?: Partial<Worksheet>): Worksheet {
  const type = faker.helpers.arrayElement([
    'expenses',
    'revenues',
    'fixed-costs',
    'adjustments',
  ] as const);
  const department = faker.helpers.arrayElement(departments);
  const period = faker.helpers.arrayElement(periods);

  return {
    id: faker.string.uuid(),
    budgetId,
    name: `${period} - ${department} ${type === 'fixed-costs' ? 'Fixed Costs' : type.charAt(0).toUpperCase() + type.slice(1)}`,
    type,
    department,
    period,
    lastEditedBy: faker.person.fullName(),
    lastEditedAt: faker.date.recent().toISOString(),
    status: faker.helpers.arrayElement(['draft', 'submitted', 'approved'] as const),
    ...overrides,
  };
}

/**
 * Generate multiple worksheets (last 5 viewed)
 */
export function generateRecentWorksheets(budgetId: string, count = 5): Worksheet[] {
  return Array.from({ length: count }, () => generateWorksheet(budgetId));
}

/**
 * Generate a single milestone
 */
export function generateMilestone(budgetId: string, overrides?: Partial<Milestone>): Milestone {
  const status: MilestoneStatus = faker.helpers.arrayElement([
    'active',
    'upcoming',
    'completed',
    'overdue',
  ]);
  const totalTasks = faker.number.int({ min: 3, max: 10 });
  const completedTasks =
    status === 'completed'
      ? totalTasks
      : status === 'active'
        ? faker.number.int({ min: 0, max: totalTasks })
        : 0;

  const milestones = [
    'Department Submissions Open',
    'Personnel Requests Due',
    'Budget Review Meeting',
    'Final Approval Deadline',
    'Setup Budget Timeline',
    'Capital Project Submissions',
    'Budget Amendments Due',
  ];

  return {
    id: faker.string.uuid(),
    budgetId,
    title: faker.helpers.arrayElement(milestones),
    description: faker.lorem.sentence(),
    status,
    startDate: faker.date.recent().toISOString(),
    endDate: faker.date.future().toISOString(),
    completedTasks,
    totalTasks,
    assignedTo: faker.person.fullName(),
    ...overrides,
  };
}

/**
 * Generate multiple milestones
 */
export function generateMilestones(budgetId: string, count = 5): Milestone[] {
  return Array.from({ length: count }, () => generateMilestone(budgetId));
}

/**
 * Generate calendar milestones for a specific month
 */
export function generateCalendarMilestones(year: number, month: number, count = 3): CalendarMilestone[] {
  return Array.from({ length: count }, () => {
    const day = faker.number.int({ min: 1, max: 28 });
    const date = new Date(year, month, day);
    const status: MilestoneStatus = faker.helpers.arrayElement(['active', 'upcoming', 'completed']);
    const totalTasks = faker.number.int({ min: 3, max: 8 });
    const completedTasks =
      status === 'completed' ? totalTasks : faker.number.int({ min: 0, max: totalTasks });

    return {
      id: faker.string.uuid(),
      date: date.toISOString(),
      title: faker.helpers.arrayElement([
        'Department Submissions Open',
        'Personnel Requests Due',
        'Setup Budget Timeline',
      ]),
      status,
      completedTasks,
      totalTasks,
    };
  });
}

/**
 * Generate a single task
 */
export function generateTask(budgetId: string, milestoneId?: string, overrides?: Partial<Task>): Task {
  const status: TaskStatus = faker.helpers.arrayElement([
    'not-started',
    'in-progress',
    'completed',
    'blocked',
  ]);

  return {
    id: faker.string.uuid(),
    milestoneId,
    budgetId,
    title: faker.helpers.arrayElement([
      'Review departmental submissions',
      'Update budget allocations',
      'Approve personnel requests',
      'Review capital projects',
      'Update forecast models',
      'Prepare board presentation',
    ]),
    description: faker.lorem.sentence(),
    status,
    priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'critical'] as const),
    assignedTo: faker.person.fullName(),
    dueDate: faker.date.future().toISOString(),
    completedAt: status === 'completed' ? faker.date.recent().toISOString() : undefined,
    createdAt: faker.date.past().toISOString(),
    ...overrides,
  };
}

/**
 * Generate multiple tasks
 */
export function generateTasks(budgetId: string, count = 5): Task[] {
  return Array.from({ length: count }, () => generateTask(budgetId));
}

/**
 * Generate COA (Chart of Accounts) breakdown data
 */
export function generateCOABreakdown(count = 7): COABreakdown[] {
  const categories = [
    'Salaries & Wages',
    'Benefits',
    'Supplies',
    'Equipment',
    'Utilities',
    'Maintenance',
    'Professional Services',
    'Insurance',
    'Training',
  ];

  return faker.helpers
    .arrayElements(categories, count)
    .map((category) => ({
      category,
      value: faker.number.int({ min: 100000, max: 5000000 }),
      subcategories: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => ({
        name: faker.commerce.department(),
        value: faker.number.int({ min: 10000, max: 500000 }),
      })),
    }));
}

/**
 * Generate position requests
 */
export function generatePositionRequest(budgetId: string, overrides?: Partial<PositionRequest>): PositionRequest {
  const status: PositionRequestStatus = faker.helpers.arrayElement([
    'approved',
    'in-progress',
    'on-hold',
    'in-review',
    'not-approved',
  ]);

  return {
    id: faker.string.uuid(),
    budgetId,
    department: faker.helpers.arrayElement(departments),
    positionTitle: faker.person.jobTitle(),
    status,
    salary: faker.number.int({ min: 45000, max: 150000 }),
    benefits: faker.number.int({ min: 15000, max: 40000 }),
    requestedBy: faker.person.fullName(),
    requestedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * Generate multiple position requests
 */
export function generatePositionRequests(budgetId: string, count = 10): PositionRequest[] {
  return Array.from({ length: count }, () => generatePositionRequest(budgetId));
}

/**
 * Generate proposal
 */
export function generateProposal(budgetId: string, overrides?: Partial<Proposal>): Proposal {
  return {
    id: faker.string.uuid(),
    budgetId,
    title: faker.helpers.arrayElement([
      'New Equipment Purchase',
      'Staff Training Initiative',
      'Facility Improvement',
      'Technology Upgrade',
      'Community Program Expansion',
    ]),
    description: faker.lorem.paragraph(),
    department: faker.helpers.arrayElement(departments),
    requestedAmount: faker.number.int({ min: 10000, max: 500000 }),
    status: faker.helpers.arrayElement(['draft', 'in-review', 'approved', 'rejected'] as const),
    submittedBy: faker.person.fullName(),
    submittedAt: faker.date.recent().toISOString(),
    reviewedBy: faker.datatype.boolean() ? faker.person.fullName() : undefined,
    reviewedAt: faker.datatype.boolean() ? faker.date.recent().toISOString() : undefined,
    ...overrides,
  };
}

/**
 * Generate multiple proposals
 */
export function generateProposals(budgetId: string, count = 15): Proposal[] {
  return Array.from({ length: count }, () => generateProposal(budgetId));
}

/**
 * Generate chart data for FY comparison
 */
export function generateFYComparisonData() {
  return [
    { name: 'FY 2017 Budget', base: 450, proposed: 420 },
    { name: 'FY 2018 Budget', base: 380, proposed: 400 },
    { name: 'FY 2019 Budget', base: 520, proposed: 490 },
    { name: 'FY 2020 Budget', base: 300, proposed: 340 },
    { name: 'FY 2021 Budget', base: 280, proposed: 320 },
    { name: 'Base - 2023 Adjustments', base: 150, proposed: 180 },
    { name: 'Proposed - 2023 Adjustments', base: 120, proposed: 160 },
  ];
}

/**
 * Generate the active budget (FY2026)
 */
export function generateActiveBudget(): Budget {
  return generateBudget({
    name: 'FY2026 Department Submission Budget',
    fiscalYear: 'FY2026',
    type: 'operating',
    status: 'active',
    phase: 'Submission',
  });
}
