/**
 * Reports & Data Organization Type Definitions
 */

export type ReportType = 'standard' | 'custom' | 'scheduled' | 'dashboard' | 'analytics';
export type ReportStatus = 'draft' | 'published' | 'archived';
export type ReportCategory =
  | 'financial-statements'
  | 'inspections'
  | 'payroll'
  | 'asset-management-audits'
  | 'checks'
  | 'other';

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  icon?: string;
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  category: ReportCategory;
  status: ReportStatus;
  folderId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastViewedAt?: string;
  thumbnailUrl?: string;
  tags?: string[];
  isStarred: boolean;
  viewCount: number;
  shareCount: number;
}

export interface ReportTemplate {
  id: string;
  title: string;
  description: string;
  type: ReportType;
  icon: React.ReactElement;
  color: string;
  category: string;
}
