/**
 * Mock Data for Reports & Data Organization
 */

import { faker } from '@faker-js/faker';
import type { Folder, Report, ReportType, ReportStatus, ReportCategory } from '../types/reports';

faker.seed(789); // Different seed for reports data

const reportTypes: ReportType[] = ['standard', 'custom', 'scheduled', 'dashboard', 'analytics'];
const reportStatuses: ReportStatus[] = ['draft', 'published', 'archived'];
const reportCategories: ReportCategory[] = [
  'financial-statements',
  'inspections',
  'payroll',
  'asset-management-audits',
  'checks',
  'other',
];

const reportTitles = [
  'Monthly Financial Summary',
  'Budget vs Actuals Analysis',
  'Department Performance Dashboard',
  'Quarterly Revenue Report',
  'Asset Utilization Report',
  'Work Order Completion Metrics',
  'Vendor Performance Scorecard',
  'Project Status Overview',
  'Expense Breakdown by Category',
  'Year-over-Year Comparison',
  'Customer Satisfaction Analysis',
  'Inventory Status Report',
  'Employee Performance Metrics',
  'Sales Pipeline Dashboard',
  'Operational Efficiency Report',
];

const reportTags = [
  'finance',
  'operations',
  'hr',
  'sales',
  'marketing',
  'executive',
  'monthly',
  'quarterly',
  'annual',
  'real-time',
];

/**
 * Generate a single folder
 */
export function generateFolder(overrides?: Partial<Folder>): Folder {
  return {
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement([
      'Financial Reports',
      'Operations',
      'Executive Summaries',
      'Department Reports',
      'Quarterly Reviews',
      'Compliance',
      'Analytics',
      'Custom Reports',
      'Archived Reports',
      'Shared Reports',
    ]),
    reportCount: faker.number.int({ min: 0, max: 25 }),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides,
  };
}

/**
 * Generate multiple folders
 */
export function generateFolders(count = 8): Folder[] {
  const folders: Folder[] = [];

  // Add default folders
  folders.push(
    generateFolder({ name: 'All Reports', reportCount: 45 }),
    generateFolder({ name: 'My Reports', reportCount: 12 }),
    generateFolder({ name: 'Shared with Me', reportCount: 8 }),
    generateFolder({ name: 'Recent', reportCount: 10 }),
    generateFolder({ name: 'Starred', reportCount: 5 })
  );

  // Add custom folders
  for (let i = folders.length; i < count; i++) {
    folders.push(generateFolder());
  }

  return folders;
}

/**
 * Generate a single report
 */
export function generateReport(overrides?: Partial<Report>): Report {
  const type = faker.helpers.arrayElement(reportTypes);
  const category = faker.helpers.arrayElement(reportCategories);
  const status = faker.helpers.arrayElement(reportStatuses);
  const createdAt = faker.date.past();
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

  return {
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement(reportTitles),
    description: faker.lorem.sentence(),
    type,
    category,
    status,
    createdBy: faker.person.fullName(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    lastViewedAt: faker.datatype.boolean() ? faker.date.recent().toISOString() : undefined,
    tags: faker.helpers.arrayElements(reportTags, { min: 1, max: 3 }),
    isStarred: faker.datatype.boolean({ probability: 0.2 }),
    viewCount: faker.number.int({ min: 0, max: 500 }),
    shareCount: faker.number.int({ min: 0, max: 50 }),
    ...overrides,
  };
}

/**
 * Generate multiple reports
 */
export function generateReports(count = 20): Report[] {
  return Array.from({ length: count }, () => generateReport());
}

/**
 * Generate reports for a specific folder
 */
export function generateReportsForFolder(folderId: string, count = 10): Report[] {
  return Array.from({ length: count }, () => generateReport({ folderId }));
}

/**
 * Get report type icon and color
 */
export function getReportTypeInfo(type: ReportType): { color: string; label: string } {
  const typeMap: Record<ReportType, { color: string; label: string }> = {
    standard: { color: 'primary.main', label: 'Standard Report' },
    custom: { color: 'secondary.main', label: 'Custom Report' },
    scheduled: { color: 'info.main', label: 'Scheduled Report' },
    dashboard: { color: 'success.main', label: 'Dashboard' },
    analytics: { color: 'warning.main', label: 'Analytics' },
  };
  return typeMap[type];
}

/**
 * Get report category label
 */
export function getReportCategoryLabel(category: ReportCategory): string {
  const categoryMap: Record<ReportCategory, string> = {
    'financial-statements': 'Financial Statements',
    'inspections': 'Lists of Inspections',
    'payroll': 'Payroll Reports',
    'asset-management-audits': 'Asset Management Audits',
    'checks': 'Checks',
    'other': 'Other Reports',
  };
  return categoryMap[category];
}
