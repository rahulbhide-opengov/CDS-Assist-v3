// Inspection Types for PLC Suite

export interface Inspector {
  id: string;
  name: string;
  email: string;
  certifications: InspectionType[];
  weeklyCapacity: number; // hours
  currentLoad: number; // hours scheduled this week
  status: 'available' | 'busy' | 'unavailable';
  avatar?: string;
}

export interface InspectionEvent {
  id: string;
  inspectorId: string;
  inspectorName: string;
  type: InspectionType;
  address: string;
  permitNumber?: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'failed';
  result?: 'pass' | 'fail' | 'partial' | 'pending';
  notes?: string;
  checklistId?: string;
}

export interface InspectionResult {
  id: string;
  inspectionEventId: string;
  inspectorId: string;
  address: string;
  type: InspectionType;
  completedDate: string;
  result: 'pass' | 'fail' | 'partial';
  failureReasons?: string[];
  notes?: string;
  photosCount?: number;
  checklistResults?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  itemText: string;
  category?: string;
  result: 'Pass' | 'Fail' | 'Not Started' | 'N/A';
  notes?: string;
  isCritical?: boolean;
}

export interface ChecklistSummary {
  totalItems: number;
  passed: number;
  failed: number;
  notStarted: number;
  notApplicable: number;
  criticalFailures: number;
  completionPercentage: number;
}

export type InspectionType =
  | 'electrical'
  | 'plumbing'
  | 'building'
  | 'mechanical'
  | 'fire'
  | 'rough'
  | 'final'
  | 'foundation'
  | 'framing'
  | 'insulation'
  | 'roofing';

export interface InspectionCapacity {
  inspectorId: string;
  inspectorName: string;
  weeklyCapacity: number;
  currentLoad: number;
  availableHours: number;
  utilization: number; // percentage
  upcomingInspections: number;
  certifications: InspectionType[];
}

export interface InspectionScheduleSlot {
  date: string;
  time: string;
  duration: number;
  inspectorId: string;
  isAvailable: boolean;
}

export interface DailyInspectionSummary {
  date: string;
  inspectorId: string;
  inspectorName: string;
  totalInspections: number;
  completed: number;
  passed: number;
  failed: number;
  cancelled: number;
  averageDuration: number;
  locations: string[];
}

export interface CommunityInspectionMetrics {
  totalScheduled: number;
  totalCompleted: number;
  totalPassed: number;
  totalFailed: number;
  totalPending: number;
  totalCancelled: number;
  byType: Record<InspectionType, number>;
  byInspector: Record<string, number>;
  thisWeek: number;
  today: number;
  averagePassRate: number;
}