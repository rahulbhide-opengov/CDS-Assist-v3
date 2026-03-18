import type {
  Inspector,
  InspectionEvent,
  InspectionCapacity,
  DailyInspectionSummary,
  ChecklistItem,
  ChecklistSummary,
  InspectionScheduleSlot,
  InspectionType,
  CommunityInspectionMetrics
} from '../../types/inspection';

// Mock data generators
const mockInspectors: Inspector[] = [
  {
    id: 'ins_1',
    name: 'Carlos Garcia',
    email: 'carlos.garcia@city.gov',
    certifications: ['electrical', 'plumbing', 'mechanical'],
    weeklyCapacity: 40,
    currentLoad: 30,
    status: 'available',
  },
  {
    id: 'ins_2',
    name: 'Sarah Chen',
    email: 'sarah.chen@city.gov',
    certifications: ['building', 'final', 'foundation'],
    weeklyCapacity: 40,
    currentLoad: 36,
    status: 'available',
  },
  {
    id: 'ins_3',
    name: 'Raj Patel',
    email: 'raj.patel@city.gov',
    certifications: ['electrical', 'fire', 'final'],
    weeklyCapacity: 40,
    currentLoad: 40,
    status: 'busy',
  },
  {
    id: 'ins_4',
    name: 'Maria Rodriguez',
    email: 'maria.rodriguez@city.gov',
    certifications: ['plumbing', 'mechanical', 'rough'],
    weeklyCapacity: 40,
    currentLoad: 15,
    status: 'available',
  },
];

const generateMockInspectionEvents = (count: number = 10): InspectionEvent[] => {
  const types: InspectionType[] = ['electrical', 'plumbing', 'building', 'final', 'mechanical'];
  const statuses = ['scheduled', 'completed', 'cancelled'] as const;
  const results = ['pass', 'fail', 'pending'] as const;
  const addresses = [
    '123 Main St',
    '456 Oak Ave',
    '789 Pine Rd',
    '321 Elm Dr',
    '654 Maple Way',
    '987 Cedar Ln',
    '147 Birch Ct',
    '258 Spruce Pl',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `event_${i + 1}`,
    inspectorId: mockInspectors[i % mockInspectors.length].id,
    inspectorName: mockInspectors[i % mockInspectors.length].name,
    type: types[i % types.length],
    address: addresses[i % addresses.length],
    permitNumber: `PRM-2024-${String(i + 1000).padStart(4, '0')}`,
    scheduledDate: new Date(Date.now() + (i - 5) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: `${9 + (i % 8)}:00 AM`,
    duration: 60 + (i % 3) * 30,
    status: statuses[i % 3] as any,
    result: i % 3 === 1 ? results[i % 3] : undefined,
    notes: i % 4 === 0 ? 'Additional work required' : undefined,
  }));
};

const generateMockChecklistItems = (): ChecklistItem[] => [
  {
    id: 'chk_1',
    itemText: 'Smoke detectors installed in all required locations',
    category: 'Fire Safety',
    result: 'Pass',
    isCritical: true,
  },
  {
    id: 'chk_2',
    itemText: 'Electrical panel properly labeled',
    category: 'Electrical',
    result: 'Pass',
    notes: 'All circuits clearly marked',
    isCritical: false,
  },
  {
    id: 'chk_3',
    itemText: 'GFCI protection in wet areas',
    category: 'Electrical',
    result: 'Fail',
    notes: 'Missing GFCI in garage',
    isCritical: true,
  },
  {
    id: 'chk_4',
    itemText: 'Proper ventilation in bathrooms',
    category: 'Mechanical',
    result: 'Pass',
    isCritical: false,
  },
  {
    id: 'chk_5',
    itemText: 'Water heater strapping',
    category: 'Plumbing',
    result: 'Not Started',
    isCritical: true,
  },
  {
    id: 'chk_6',
    itemText: 'Handrails installed on stairs',
    category: 'Building',
    result: 'Pass',
    isCritical: false,
  },
  {
    id: 'chk_7',
    itemText: 'Window egress requirements met',
    category: 'Building',
    result: 'Pass',
    isCritical: true,
  },
  {
    id: 'chk_8',
    itemText: 'Carbon monoxide detectors installed',
    category: 'Fire Safety',
    result: 'Fail',
    notes: 'Missing on second floor',
    isCritical: true,
  },
];

export class InspectionAgentService {
  // Check Inspector Availability
  async checkAvailability(
    inspectionType?: InspectionType,
    dateRange?: { start: string; end: string }
  ): Promise<{
    inspectors: Inspector[];
    availableSlots: InspectionScheduleSlot[];
  }> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const filteredInspectors = inspectionType
      ? mockInspectors.filter(i => i.certifications.includes(inspectionType))
      : mockInspectors;

    const availableSlots = filteredInspectors.flatMap(inspector => {
      if (inspector.status !== 'available') return [];

      const slots: InspectionScheduleSlot[] = [];
      for (let day = 0; day < 5; day++) {
        for (let hour = 9; hour < 17; hour += 2) {
          if (Math.random() > 0.3) { // 70% chance of availability
            const date = new Date();
            date.setDate(date.getDate() + day);
            slots.push({
              date: date.toISOString().split('T')[0],
              time: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`,
              duration: 60,
              inspectorId: inspector.id,
              isAvailable: true,
            });
          }
        }
      }
      return slots;
    });

    return {
      inspectors: filteredInspectors,
      availableSlots,
    };
  }

  // Get Inspector Capacity Summary
  async getCapacitySummary(weekStartDate?: string): Promise<InspectionCapacity[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    return mockInspectors.map(inspector => ({
      inspectorId: inspector.id,
      inspectorName: inspector.name,
      weeklyCapacity: inspector.weeklyCapacity,
      currentLoad: inspector.currentLoad,
      availableHours: inspector.weeklyCapacity - inspector.currentLoad,
      utilization: (inspector.currentLoad / inspector.weeklyCapacity) * 100,
      upcomingInspections: Math.floor(inspector.currentLoad / 2),
      certifications: inspector.certifications,
    }));
  }

  // Get Daily Inspection Summary
  async getDailySummary(
    inspectorId: string,
    date: string
  ): Promise<{
    summary: DailyInspectionSummary;
    events: InspectionEvent[];
  }> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const inspector = mockInspectors.find(i => i.id === inspectorId);
    const events = generateMockInspectionEvents(8).filter(
      e => e.inspectorId === inspectorId && e.scheduledDate === date
    );

    const summary: DailyInspectionSummary = {
      date,
      inspectorId,
      inspectorName: inspector?.name || 'Unknown',
      totalInspections: events.length,
      completed: events.filter(e => e.status === 'completed').length,
      passed: events.filter(e => e.result === 'pass').length,
      failed: events.filter(e => e.result === 'fail').length,
      cancelled: events.filter(e => e.status === 'cancelled').length,
      averageDuration: 75,
      locations: [...new Set(events.map(e => e.address))],
    };

    return { summary, events };
  }

  // Get Checklist Status
  async getChecklistStatus(inspectionId: string): Promise<{
    items: ChecklistItem[];
    summary: ChecklistSummary;
  }> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const items = generateMockChecklistItems();

    const summary: ChecklistSummary = {
      totalItems: items.length,
      passed: items.filter(i => i.result === 'Pass').length,
      failed: items.filter(i => i.result === 'Fail').length,
      notStarted: items.filter(i => i.result === 'Not Started').length,
      notApplicable: items.filter(i => i.result === 'N/A').length,
      criticalFailures: items.filter(i => i.isCritical && i.result === 'Fail').length,
      completionPercentage:
        ((items.filter(i => i.result === 'Pass').length /
          items.filter(i => i.result !== 'N/A').length) * 100),
    };

    return { items, summary };
  }

  // Get Inspection History
  async getInspectionHistory(
    address: string,
    dateRange?: { start: string; end: string }
  ): Promise<InspectionEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 400));

    const allEvents = generateMockInspectionEvents(20);
    return allEvents.filter(e => e.address.includes(address));
  }

  // Get Upcoming Inspections
  async getUpcomingInspections(date: string): Promise<InspectionEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));

    const events = generateMockInspectionEvents(15);
    return events.filter(e => e.scheduledDate === date && e.status === 'scheduled');
  }

  // Get Community Metrics
  async getCommunityMetrics(): Promise<CommunityInspectionMetrics> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const events = generateMockInspectionEvents(100);

    const metrics: CommunityInspectionMetrics = {
      totalScheduled: events.filter(e => e.status === 'scheduled').length,
      totalCompleted: events.filter(e => e.status === 'completed').length,
      totalPassed: events.filter(e => e.result === 'pass').length,
      totalFailed: events.filter(e => e.result === 'fail').length,
      totalPending: events.filter(e => e.result === 'pending').length,
      totalCancelled: events.filter(e => e.status === 'cancelled').length,
      byType: {
        electrical: events.filter(e => e.type === 'electrical').length,
        plumbing: events.filter(e => e.type === 'plumbing').length,
        building: events.filter(e => e.type === 'building').length,
        mechanical: events.filter(e => e.type === 'mechanical').length,
        fire: events.filter(e => e.type === 'fire').length,
        rough: events.filter(e => e.type === 'rough').length,
        final: events.filter(e => e.type === 'final').length,
        foundation: events.filter(e => e.type === 'foundation').length,
        framing: events.filter(e => e.type === 'framing').length,
        insulation: events.filter(e => e.type === 'insulation').length,
        roofing: events.filter(e => e.type === 'roofing').length,
      },
      byInspector: mockInspectors.reduce((acc, inspector) => {
        acc[inspector.name] = events.filter(e => e.inspectorId === inspector.id).length;
        return acc;
      }, {} as Record<string, number>),
      thisWeek: events.filter(e => {
        const eventDate = new Date(e.scheduledDate);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return eventDate >= weekAgo && eventDate <= now;
      }).length,
      today: events.filter(e => {
        const today = new Date().toISOString().split('T')[0];
        return e.scheduledDate === today;
      }).length,
      averagePassRate: 0.75,
    };

    return metrics;
  }

  // Process natural language queries
  async processQuery(query: string): Promise<{
    intent: string;
    response: any;
    componentType?: string;
  }> {
    const lowerQuery = query.toLowerCase();

    // Check availability queries
    if (lowerQuery.includes('available') || lowerQuery.includes('availability')) {
      const type = this.extractInspectionType(lowerQuery);
      const result = await this.checkAvailability(type);
      return {
        intent: 'check_availability',
        response: result,
        componentType: 'InspectorAvailability',
      };
    }

    // Capacity queries
    if (lowerQuery.includes('capacity') || lowerQuery.includes('workload')) {
      const capacity = await this.getCapacitySummary();
      return {
        intent: 'capacity_summary',
        response: capacity,
        componentType: 'InspectorCapacity',
      };
    }

    // Daily summary queries
    if (lowerQuery.includes('yesterday') || lowerQuery.includes('today') || lowerQuery.includes('summary')) {
      const date = this.extractDate(lowerQuery);
      const inspectorName = this.extractInspectorName(lowerQuery);
      const inspector = mockInspectors.find(i =>
        i.name.toLowerCase().includes(inspectorName.toLowerCase())
      );

      if (inspector) {
        const result = await this.getDailySummary(inspector.id, date);
        return {
          intent: 'daily_summary',
          response: result,
          componentType: 'DailyInspectionSummary',
        };
      }
    }

    // Checklist queries
    if (lowerQuery.includes('checklist') || lowerQuery.includes('items')) {
      const result = await this.getChecklistStatus('inspection_123');
      return {
        intent: 'checklist_status',
        response: result,
        componentType: 'ChecklistStatusReview',
      };
    }

    // Community metrics
    if (lowerQuery.includes('community') || lowerQuery.includes('status')) {
      const metrics = await this.getCommunityMetrics();
      return {
        intent: 'community_metrics',
        response: metrics,
        componentType: 'CommunityMetrics',
      };
    }

    // Default response
    return {
      intent: 'unknown',
      response: {
        message: 'I can help you with inspection scheduling, availability, capacity, and status. What would you like to know?',
        suggestions: [
          'Who is available for electrical inspections this week?',
          'Show inspector capacity summary',
          'Summarize Garcia\'s inspections from yesterday',
          'Check inspection checklist status',
        ],
      },
    };
  }

  private extractInspectionType(query: string): InspectionType | undefined {
    const types: InspectionType[] = [
      'electrical', 'plumbing', 'building', 'mechanical',
      'fire', 'rough', 'final', 'foundation', 'framing',
      'insulation', 'roofing'
    ];

    for (const type of types) {
      if (query.includes(type)) {
        return type;
      }
    }
    return undefined;
  }

  private extractDate(query: string): string {
    if (query.includes('yesterday')) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    }
    if (query.includes('tomorrow')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0]; // today
  }

  private extractInspectorName(query: string): string {
    for (const inspector of mockInspectors) {
      const names = inspector.name.split(' ');
      for (const name of names) {
        if (query.toLowerCase().includes(name.toLowerCase())) {
          return inspector.name;
        }
      }
    }
    return mockInspectors[0].name; // default to first inspector
  }
}

export const inspectionAgent = new InspectionAgentService();