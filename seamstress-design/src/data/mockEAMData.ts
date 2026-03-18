import type {
  EAMTask,
  EAMCrew,
  EAMEquipment,
  EAMScheduleSlot,
  EAMConflict,
  EAMFixOption,
  EAMScheduleDraft,
  EAMPublishResult
} from '../types/opengov/eam';

export const mockEAMTasks: EAMTask[] = [
  {
    id: 'task-001',
    taskId: 'WO-2024-1001',
    assetId: 'PUMP-001',
    assetName: 'Main Water Pump Station #1',
    description: 'Quarterly maintenance and inspection of main water pump',
    severity: 'moderate',
    priority: 'high',
    zone: 'North District',
    estimatedHours: 4,
    dueDate: '2024-03-20',
    status: 'unscheduled',
    requiredSkills: ['plumbing', 'electrical'],
    requiredEquipment: ['pump-tools', 'electrical-kit']
  },
  {
    id: 'task-002',
    taskId: 'WO-2024-1002',
    assetId: 'ROAD-047',
    assetName: 'Oak Street (100-200 block)',
    description: 'Pothole repair and road resurfacing',
    severity: 'major',
    priority: 'urgent',
    zone: 'Downtown',
    estimatedHours: 8,
    dueDate: '2024-03-18',
    status: 'unscheduled',
    requiredSkills: ['paving', 'heavy-equipment'],
    requiredEquipment: ['paver', 'roller', 'dump-truck']
  },
  {
    id: 'task-003',
    taskId: 'WO-2024-1003',
    assetId: 'SIGNAL-023',
    assetName: 'Traffic Signal - Main & 5th',
    description: 'Replace malfunctioning traffic light controller',
    severity: 'critical',
    priority: 'urgent',
    zone: 'Downtown',
    estimatedHours: 3,
    dueDate: '2024-03-17',
    status: 'unscheduled',
    requiredSkills: ['electrical', 'traffic-systems'],
    requiredEquipment: ['bucket-truck', 'electrical-kit']
  },
  {
    id: 'task-004',
    taskId: 'WO-2024-1004',
    assetId: 'PARK-012',
    assetName: 'Central Park Playground',
    description: 'Safety inspection and equipment maintenance',
    severity: 'minor',
    priority: 'medium',
    zone: 'Central',
    estimatedHours: 2,
    dueDate: '2024-03-22',
    status: 'unscheduled',
    requiredSkills: ['general-maintenance'],
    requiredEquipment: ['basic-tools']
  },
  {
    id: 'task-005',
    taskId: 'WO-2024-1005',
    assetId: 'SEWER-089',
    assetName: 'Storm Drain - Industrial Ave',
    description: 'Clear blockage and inspect storm drain system',
    severity: 'moderate',
    priority: 'high',
    zone: 'Industrial District',
    estimatedHours: 6,
    dueDate: '2024-03-19',
    status: 'unscheduled',
    requiredSkills: ['sewer-maintenance', 'confined-space'],
    requiredEquipment: ['vac-truck', 'camera-inspection']
  },
  {
    id: 'task-006',
    taskId: 'WO-2024-1006',
    assetId: 'LIGHT-156',
    assetName: 'Street Lights - Elm Avenue',
    description: 'Replace 5 burned-out street light bulbs',
    severity: 'minor',
    priority: 'low',
    zone: 'Residential East',
    estimatedHours: 2,
    dueDate: '2024-03-25',
    status: 'unscheduled',
    requiredSkills: ['electrical'],
    requiredEquipment: ['bucket-truck']
  },
  {
    id: 'task-007',
    taskId: 'WO-2024-1007',
    assetId: 'BRIDGE-004',
    assetName: 'River Street Bridge',
    description: 'Annual structural inspection and minor repairs',
    severity: 'moderate',
    priority: 'medium',
    zone: 'River District',
    estimatedHours: 10,
    dueDate: '2024-03-21',
    status: 'unscheduled',
    requiredSkills: ['structural', 'welding', 'concrete'],
    requiredEquipment: ['inspection-equipment', 'welding-kit', 'concrete-tools']
  },
  {
    id: 'task-008',
    taskId: 'WO-2024-1008',
    assetId: 'HVAC-034',
    assetName: 'City Hall HVAC System',
    description: 'Seasonal filter replacement and system check',
    severity: 'minor',
    priority: 'medium',
    zone: 'Downtown',
    estimatedHours: 3,
    dueDate: '2024-03-23',
    status: 'unscheduled',
    requiredSkills: ['hvac'],
    requiredEquipment: ['hvac-tools']
  },
  {
    id: 'task-009',
    taskId: 'WO-2024-1009',
    assetId: 'SIGN-234',
    assetName: 'Stop Signs - School Zone',
    description: 'Install new reflective stop signs near elementary school',
    severity: 'major',
    priority: 'high',
    zone: 'School District',
    estimatedHours: 4,
    dueDate: '2024-03-18',
    status: 'unscheduled',
    requiredSkills: ['signage', 'general-maintenance'],
    requiredEquipment: ['drill', 'basic-tools']
  },
  {
    id: 'task-010',
    taskId: 'WO-2024-1010',
    assetId: 'TREE-567',
    assetName: 'Oak Trees - Memorial Park',
    description: 'Emergency tree removal after storm damage',
    severity: 'critical',
    priority: 'urgent',
    zone: 'Central',
    estimatedHours: 5,
    dueDate: '2024-03-17',
    status: 'unscheduled',
    requiredSkills: ['tree-service', 'chainsaw-certified'],
    requiredEquipment: ['chipper', 'chainsaw', 'bucket-truck']
  }
];

export const mockEAMCrews: EAMCrew[] = [
  {
    id: 'crew-001',
    name: 'Alpha Team',
    status: 'available',
    skills: ['plumbing', 'electrical', 'general-maintenance'],
    currentCapacity: 65,
    maxCapacity: 40,
    availableHours: 14,
    currentAssignments: ['WO-2024-0998'],
    zone: 'North District'
  },
  {
    id: 'crew-002',
    name: 'Road Maintenance Crew',
    status: 'available',
    skills: ['paving', 'heavy-equipment', 'concrete', 'signage'],
    currentCapacity: 80,
    maxCapacity: 40,
    availableHours: 8,
    currentAssignments: ['WO-2024-0995', 'WO-2024-0996'],
    zone: 'Downtown'
  },
  {
    id: 'crew-003',
    name: 'Utilities Team',
    status: 'available',
    skills: ['electrical', 'traffic-systems', 'sewer-maintenance', 'confined-space'],
    currentCapacity: 45,
    maxCapacity: 40,
    availableHours: 22,
    currentAssignments: [],
    zone: 'Industrial District'
  },
  {
    id: 'crew-004',
    name: 'Facilities Maintenance',
    status: 'available',
    skills: ['hvac', 'electrical', 'plumbing', 'general-maintenance'],
    currentCapacity: 30,
    maxCapacity: 40,
    availableHours: 28,
    currentAssignments: [],
    zone: 'Downtown'
  },
  {
    id: 'crew-005',
    name: 'Parks & Recreation',
    status: 'available',
    skills: ['general-maintenance', 'tree-service', 'chainsaw-certified'],
    currentCapacity: 55,
    maxCapacity: 40,
    availableHours: 18,
    currentAssignments: ['WO-2024-0999'],
    zone: 'Central'
  },
  {
    id: 'crew-006',
    name: 'Bridge & Structure Team',
    status: 'busy',
    skills: ['structural', 'welding', 'concrete', 'heavy-equipment'],
    currentCapacity: 90,
    maxCapacity: 40,
    availableHours: 4,
    currentAssignments: ['WO-2024-0991', 'WO-2024-0992', 'WO-2024-0993'],
    zone: 'River District'
  }
];

export const mockEAMEquipment: EAMEquipment[] = [
  {
    id: 'equip-001',
    name: 'Bucket Truck #1',
    type: 'bucket-truck',
    status: 'available'
  },
  {
    id: 'equip-002',
    name: 'Bucket Truck #2',
    type: 'bucket-truck',
    status: 'in_use',
    currentAssignment: 'crew-002'
  },
  {
    id: 'equip-003',
    name: 'Asphalt Paver',
    type: 'paver',
    status: 'available'
  },
  {
    id: 'equip-004',
    name: 'Road Roller',
    type: 'roller',
    status: 'available'
  },
  {
    id: 'equip-005',
    name: 'Dump Truck #1',
    type: 'dump-truck',
    status: 'available'
  },
  {
    id: 'equip-006',
    name: 'Vac Truck',
    type: 'vac-truck',
    status: 'available'
  },
  {
    id: 'equip-007',
    name: 'Camera Inspection Unit',
    type: 'camera-inspection',
    status: 'available'
  },
  {
    id: 'equip-008',
    name: 'Wood Chipper',
    type: 'chipper',
    status: 'maintenance',
    maintenanceSchedule: '2024-03-16'
  },
  {
    id: 'equip-009',
    name: 'Welding Kit Mobile',
    type: 'welding-kit',
    status: 'available'
  },
  {
    id: 'equip-010',
    name: 'HVAC Service Kit',
    type: 'hvac-tools',
    status: 'available'
  }
];

export const mockScheduleConflicts: EAMConflict[] = [
  {
    id: 'conflict-001',
    taskId: 'task-002',
    conflictType: 'equipment',
    description: 'Paver and roller are needed but scheduled for maintenance',
    severity: 'warning',
    fixOptions: [
      {
        id: 'fix-001-a',
        action: 'Reschedule task',
        description: 'Move pothole repair to Thursday when equipment is available',
        impact: 'Delays repair by 2 days',
        confidence: 0.9
      },
      {
        id: 'fix-001-b',
        action: 'Rent equipment',
        description: 'Rent paver and roller from external vendor',
        impact: 'Additional cost of $2,500',
        confidence: 0.7
      }
    ]
  },
  {
    id: 'conflict-002',
    taskId: 'task-003',
    conflictType: 'quiet_hours',
    description: 'Traffic signal work scheduled during morning rush hour',
    severity: 'error',
    fixOptions: [
      {
        id: 'fix-002-a',
        action: 'Schedule for night work',
        description: 'Move to 10 PM - 5 AM window',
        impact: 'Requires night crew premium pay',
        confidence: 0.95
      },
      {
        id: 'fix-002-b',
        action: 'Weekend scheduling',
        description: 'Schedule for Saturday morning',
        impact: 'Weekend rates apply',
        confidence: 0.85
      }
    ]
  },
  {
    id: 'conflict-003',
    taskId: 'task-007',
    conflictType: 'capacity',
    description: 'Bridge team is already at 90% capacity',
    severity: 'warning',
    fixOptions: [
      {
        id: 'fix-003-a',
        action: 'Split across weeks',
        description: 'Complete inspection this week, repairs next week',
        impact: 'Extends timeline but ensures quality',
        confidence: 0.8
      },
      {
        id: 'fix-003-b',
        action: 'Bring in contractor',
        description: 'Hire specialized bridge contractor',
        impact: 'Higher cost but maintains schedule',
        confidence: 0.75
      }
    ]
  }
];

export const mockScheduleDraft: EAMScheduleDraft = {
  id: 'schedule-draft-001',
  name: 'Week of March 17-23, 2024',
  weekStarting: '2024-03-17',
  slots: [
    {
      id: 'slot-001',
      taskId: 'task-003',
      crewId: 'crew-003',
      equipmentIds: ['equip-001'],
      startTime: '2024-03-17T22:00:00',
      endTime: '2024-03-18T01:00:00',
      zone: 'Downtown',
      notes: 'Night work to avoid traffic'
    },
    {
      id: 'slot-002',
      taskId: 'task-010',
      crewId: 'crew-005',
      equipmentIds: ['equip-001'],
      startTime: '2024-03-17T08:00:00',
      endTime: '2024-03-17T13:00:00',
      zone: 'Central'
    },
    {
      id: 'slot-003',
      taskId: 'task-002',
      crewId: 'crew-002',
      equipmentIds: ['equip-003', 'equip-004', 'equip-005'],
      startTime: '2024-03-19T07:00:00',
      endTime: '2024-03-19T15:00:00',
      zone: 'Downtown'
    },
    {
      id: 'slot-004',
      taskId: 'task-001',
      crewId: 'crew-001',
      equipmentIds: [],
      startTime: '2024-03-20T08:00:00',
      endTime: '2024-03-20T12:00:00',
      zone: 'North District'
    },
    {
      id: 'slot-005',
      taskId: 'task-005',
      crewId: 'crew-003',
      equipmentIds: ['equip-006', 'equip-007'],
      startTime: '2024-03-19T13:00:00',
      endTime: '2024-03-19T19:00:00',
      zone: 'Industrial District'
    }
  ],
  conflicts: mockScheduleConflicts,
  metrics: {
    tasksScheduled: 5,
    totalHours: 26,
    crewUtilization: 72,
    equipmentUtilization: 65
  },
  status: 'draft'
};

export const mockPublishResult: EAMPublishResult = {
  planId: 'plan-2024-03-17',
  publishedAt: '2024-03-15T14:30:00Z',
  crewsNotified: 6,
  mobileSync: true,
  residentNoticeGenerated: true,
  workOrdersCreated: 10,
  notificationsSent: {
    email: 12,
    sms: 6,
    mobile: 6
  }
};