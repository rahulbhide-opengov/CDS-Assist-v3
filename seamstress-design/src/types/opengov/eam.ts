export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskSeverity = 'minor' | 'moderate' | 'major' | 'critical';
export type TaskStatus = 'unscheduled' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type CrewStatus = 'available' | 'busy' | 'unavailable';
export type EquipmentStatus = 'available' | 'in_use' | 'maintenance' | 'unavailable';
export type ConflictType = 'capacity' | 'equipment' | 'time' | 'skill' | 'quiet_hours' | 'weather';

export interface EAMTask {
  id: string;
  taskId: string;
  assetId: string;
  assetName: string;
  description: string;
  severity: TaskSeverity;
  priority: TaskPriority;
  zone: string;
  estimatedHours: number;
  dueDate: string;
  status: TaskStatus;
  requiredSkills?: string[];
  requiredEquipment?: string[];
  notes?: string;
}

export interface EAMCrew {
  id: string;
  name: string;
  status: CrewStatus;
  skills: string[];
  currentCapacity: number;
  maxCapacity: number;
  availableHours: number;
  currentAssignments: string[];
  excluded?: boolean;
  zone?: string;
}

export interface EAMEquipment {
  id: string;
  name: string;
  type: string;
  status: EquipmentStatus;
  currentAssignment?: string;
  maintenanceSchedule?: string;
}

export interface EAMScheduleSlot {
  id: string;
  taskId: string;
  crewId: string;
  equipmentIds: string[];
  startTime: string;
  endTime: string;
  zone: string;
  notes?: string;
}

export interface EAMConflict {
  id: string;
  taskId: string;
  conflictType: ConflictType;
  description: string;
  severity: 'warning' | 'error';
  fixOptions: EAMFixOption[];
}

export interface EAMFixOption {
  id: string;
  action: string;
  description: string;
  impact: string;
  confidence: number;
}

export interface EAMScheduleDraft {
  id: string;
  name: string;
  weekStarting: string;
  slots: EAMScheduleSlot[];
  conflicts: EAMConflict[];
  metrics: {
    tasksScheduled: number;
    totalHours: number;
    crewUtilization: number;
    equipmentUtilization: number;
  };
  status: 'draft' | 'review' | 'approved' | 'published';
}

export interface EAMPublishResult {
  planId: string;
  publishedAt: string;
  crewsNotified: number;
  mobileSync: boolean;
  residentNoticeGenerated: boolean;
  workOrdersCreated: number;
  notificationsSent: {
    email: number;
    sms: number;
    mobile: number;
  };
}

export interface EAMAgentResponse {
  id: string;
  timestamp: string;
  step: 'tasks' | 'workers' | 'schedule' | 'publish' | 'complete';
  toolCalls: string[];
  title: string;
  body: string;
  content: any;
  actions?: {
    primary?: { label: string; action: string };
    secondary?: { label: string; action: string }[];
  };
  feedback?: {
    rating?: 'up' | 'down';
    accepted?: boolean;
    comment?: string;
  };
}

export interface EAMSchedulerContext {
  tasks: EAMTask[];
  crews: EAMCrew[];
  equipment: EAMEquipment[];
  currentSchedule?: EAMScheduleDraft;
  publishResult?: EAMPublishResult;
  responses: EAMAgentResponse[];
  currentStep: EAMAgentResponse['step'];
}