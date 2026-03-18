import type { Message } from '@opengov/components-ai-patterns';
import { mockEAMTasks, mockEAMCrews, mockScheduleDraft } from '../data/mockEAMData';
import type { TaskInfo } from '../components/OGAssist/cards/TaskCard';
import type { CrewInfo } from '../components/OGAssist/cards/CrewCard';
import type { ScheduleEntry } from '../components/OGAssist/cards/ScheduleCard';

export type EAMStep = 'intro' | 'tasks' | 'workers' | 'schedule' | 'publish' | 'complete';

interface EAMChatState {
  currentStep: EAMStep;
  selectedTasks: string[];
  messageCount: number;
}

class EAMSchedulerChatService {
  private state: EAMChatState = {
    currentStep: 'intro',
    selectedTasks: [],
    messageCount: 0,
  };

  private stepResponses: Record<EAMStep, () => Message> = {
    intro: () => ({
      role: 'assistant',
      content: `## Welcome to Work Scheduler

I'll help you schedule this week's maintenance tasks efficiently. I've found **10 unscheduled tasks** that need attention.

Let me show you the high-priority items that need to be scheduled...`,
      metadata: {
        agentName: 'Work Scheduler',
        skillName: 'Task Analysis',
        step: 'intro',
        agentType: 'eamScheduler',
      },
    }),

    tasks: () => ({
      role: 'assistant',
      content: `## Unscheduled Maintenance Tasks

I've prioritized the most urgent work for this week. Select the tasks you'd like to schedule:`,
      metadata: {
        agentName: 'Work Scheduler',
        skillName: 'Task Prioritization',
        step: 'tasks',
        agentType: 'eamScheduler',
        cardType: 'tasks',
        cards: {
          tasks: [
            {
              id: 'task-1',
              title: 'Traffic Signal Repair',
              location: 'Main & 5th',
              estimatedHours: 3,
              priority: 'critical' as const,
              type: 'Electrical',
            },
            {
              id: 'task-2',
              title: 'Emergency Tree Removal',
              location: 'Memorial Park',
              estimatedHours: 5,
              priority: 'critical' as const,
              type: 'Parks',
            },
            {
              id: 'task-3',
              title: 'Pothole Repair',
              location: 'Oak Street',
              estimatedHours: 8,
              priority: 'high' as const,
              type: 'Roads',
            },
            {
              id: 'task-4',
              title: 'Water Pump Maintenance',
              location: 'Station #1',
              estimatedHours: 4,
              priority: 'high' as const,
              type: 'Utilities',
            },
            {
              id: 'task-5',
              title: 'Storm Drain Clearing',
              location: 'Industrial Ave',
              estimatedHours: 6,
              priority: 'high' as const,
              type: 'Drainage',
            },
            {
              id: 'task-6',
              title: 'Bridge Inspection',
              location: 'River Street',
              estimatedHours: 10,
              priority: 'medium' as const,
              type: 'Infrastructure',
            },
            {
              id: 'task-7',
              title: 'Stop Sign Installation',
              location: 'School Zone',
              estimatedHours: 4,
              priority: 'medium' as const,
              type: 'Traffic',
            },
          ] as TaskInfo[],
        },
        prompt: '*Type anything to review crew availability* →',
      },
    }),

    workers: () => ({
      role: 'assistant',
      content: `## Crew Availability Analysis

Here's who's available for assignments:`,
      metadata: {
        agentName: 'Work Scheduler',
        skillName: 'Capacity Analysis',
        step: 'workers',
        agentType: 'eamScheduler',
        cardType: 'crews',
        cards: {
          crews: [
            {
              id: 'crew-1',
              name: 'Utilities Team',
              availableHours: 22,
              totalHours: 40,
              members: 4,
              skills: ['Electrical', 'Water', 'Sewer'],
              status: 'available' as const,
            },
            {
              id: 'crew-2',
              name: 'Facilities Maintenance',
              availableHours: 28,
              totalHours: 40,
              members: 5,
              skills: ['HVAC', 'Plumbing', 'General'],
              status: 'available' as const,
            },
            {
              id: 'crew-3',
              name: 'Parks & Recreation',
              availableHours: 18,
              totalHours: 40,
              members: 3,
              skills: ['Landscaping', 'Trees', 'Equipment'],
              status: 'available' as const,
            },
            {
              id: 'crew-4',
              name: 'Alpha Team',
              availableHours: 14,
              totalHours: 40,
              members: 6,
              skills: ['Emergency', 'Multi-trade'],
              status: 'limited' as const,
            },
            {
              id: 'crew-5',
              name: 'Road Maintenance',
              availableHours: 8,
              totalHours: 40,
              members: 4,
              skills: ['Asphalt', 'Concrete', 'Signs'],
              status: 'limited' as const,
            },
            {
              id: 'crew-6',
              name: 'Bridge & Structure Team',
              availableHours: 0,
              totalHours: 40,
              members: 4,
              skills: ['Structural', 'Inspection'],
              status: 'unavailable' as const,
            },
          ] as CrewInfo[],
        },
        prompt: '*Type anything to see the proposed schedule* →',
      },
    }),

    schedule: () => ({
      role: 'assistant',
      content: `## Optimized Schedule Proposal

I've created an efficient schedule that balances workload:`,
      metadata: {
        agentName: 'Work Scheduler',
        skillName: 'Schedule Optimization',
        step: 'schedule',
        agentType: 'eamScheduler',
        cardType: 'schedule',
        cards: {
          schedules: [
            {
              id: 'mon',
              day: 'Monday',
              date: 'Nov 11',
              tasks: [
                {
                  id: 'mon-1',
                  title: 'Traffic Signal Repair',
                  time: '10:00 PM',
                  duration: '3 hours',
                  crew: 'Utilities Team',
                  priority: 'critical' as const,
                },
                {
                  id: 'mon-2',
                  title: 'Emergency Tree Removal',
                  time: '8:00 AM',
                  duration: '5 hours',
                  crew: 'Parks & Recreation',
                  priority: 'critical' as const,
                },
              ],
            },
            {
              id: 'tue',
              day: 'Tuesday',
              date: 'Nov 12',
              tasks: [
                {
                  id: 'tue-1',
                  title: 'Pothole Repair',
                  time: '7:00 AM',
                  duration: '8 hours',
                  crew: 'Road Maintenance',
                  priority: 'high' as const,
                },
                {
                  id: 'tue-2',
                  title: 'Water Pump Maintenance',
                  time: '9:00 AM',
                  duration: '4 hours',
                  crew: 'Alpha Team',
                  priority: 'high' as const,
                },
              ],
            },
            {
              id: 'wed',
              day: 'Wednesday',
              date: 'Nov 13',
              tasks: [
                {
                  id: 'wed-1',
                  title: 'Storm Drain Clearing',
                  time: '8:00 AM',
                  duration: '6 hours',
                  crew: 'Utilities Team',
                  priority: 'high' as const,
                },
                {
                  id: 'wed-2',
                  title: 'Stop Sign Installation',
                  time: '10:00 AM',
                  duration: '4 hours',
                  crew: 'Road Maintenance',
                  priority: 'medium' as const,
                },
              ],
            },
            {
              id: 'thu',
              day: 'Thursday',
              date: 'Nov 14',
              tasks: [
                {
                  id: 'thu-1',
                  title: 'Bridge Inspection',
                  time: '8:00 AM',
                  duration: '10 hours',
                  crew: 'Contractor + Bridge Team',
                  priority: 'medium' as const,
                },
              ],
            },
          ] as ScheduleEntry[],
          summary: {
            totalTasks: 7,
            totalHours: 40,
            crewsAssigned: 6,
            utilization: 72,
          },
        },
        prompt: '*Review the schedule above and choose an action*',
        showActions: true,
      },
    }),

    publish: () => ({
      role: 'assistant',
      content: `## Schedule Published Successfully!

Your maintenance schedule is now active and crews have been notified:`,
      metadata: {
        agentName: 'Work Scheduler',
        skillName: 'Schedule Publishing',
        step: 'publish',
        agentType: 'eamScheduler',
        cardType: 'publish',
        cards: {
          publishStatus: {
            statuses: [
              { step: 'Creating work orders', status: 'completed' as const, details: '7 work orders generated' },
              { step: 'Assigning crews', status: 'completed' as const, details: '6 crews assigned' },
              { step: 'Sending notifications', status: 'completed' as const, details: '18 notifications sent' },
              { step: 'Generating documents', status: 'completed' as const, details: 'Work permits created' },
              { step: 'Activating tracking', status: 'completed' as const, details: 'GPS tracking enabled' },
            ],
            summary: {
              workOrders: 7,
              crewsNotified: 6,
              notifications: 18,
              documents: 4,
            },
          },
          notifications: [
            {
              title: 'Crew Notifications',
              channels: [
                { type: 'email' as const, count: 6 },
                { type: 'sms' as const, count: 6 },
                { type: 'app' as const, count: 6 },
              ],
              recipients: ['Utilities Team', 'Parks & Rec', 'Road Maint.', 'Alpha Team'],
            },
            {
              title: 'Resident Alerts',
              channels: [
                { type: 'email' as const, count: 250 },
                { type: 'document' as const, count: 4 },
              ],
              recipients: ['Main St. residents', 'Memorial Park visitors', 'Oak St. businesses'],
            },
          ],
        },
        prompt: '*Type "new" to schedule more tasks or "done" to finish* →',
      },
    }),

    complete: () => ({
      role: 'assistant',
      content: `## Scheduling Complete!

Perfect! Your maintenance schedule is now active. Crews are mobilized and work has begun.

Feel free to ask me to:
• Schedule additional tasks
• Review crew performance
• Adjust existing schedules
• Handle emergency repairs

Thanks for using the Work Scheduler! 👷‍♂️`,
      metadata: {
        agentName: 'Work Scheduler',
        skillName: 'Complete',
        step: 'complete',
        agentType: 'eamScheduler',
        isFinalMessage: true,
      },
    }),
  };

  private thinkingMessages: Record<EAMStep, string> = {
    intro: 'Analyzing unscheduled maintenance tasks...',
    tasks: 'Evaluating crew availability and capacity...',
    workers: 'Optimizing schedule based on priorities...',
    schedule: 'Publishing schedule and notifying crews...',
    publish: 'Finalizing work orders...',
    complete: 'Wrapping up...',
  };

  reset(): void {
    this.state = {
      currentStep: 'intro',
      selectedTasks: [],
      messageCount: 0,
    };
  }

  getThinkingMessage(): string {
    return this.thinkingMessages[this.state.currentStep] || 'Processing...';
  }

  getThinkingDuration(): number {
    // Vary thinking time by step for realism
    const durations: Record<EAMStep, number> = {
      intro: 1500,
      tasks: 2000,
      workers: 1800,
      schedule: 2500,
      publish: 2200,
      complete: 1000,
    };
    return durations[this.state.currentStep] || 1500;
  }

  async processMessage(userMessage: string): Promise<Message> {
    // Special handling for initial empty message
    if (userMessage === '' && this.state.messageCount === 0) {
      this.state.messageCount++;
      return this.stepResponses.intro();
    }

    this.state.messageCount++;

    // Handle reset commands
    if (userMessage.toLowerCase().includes('new') ||
        userMessage.toLowerCase().includes('restart') ||
        userMessage.toLowerCase().includes('reset')) {
      this.reset();
      return this.stepResponses.intro();
    }

    // Handle completion
    if (userMessage.toLowerCase().includes('done') ||
        userMessage.toLowerCase().includes('finish') ||
        userMessage.toLowerCase().includes('exit')) {
      this.state.currentStep = 'complete';
      return this.stepResponses.complete();
    }

    // Handle schedule acceptance/rejection in schedule step
    if (this.state.currentStep === 'schedule') {
      if (userMessage.toLowerCase().includes('accept') ||
          userMessage.toLowerCase().includes('publish')) {
        // Move to publish step
        this.state.currentStep = 'publish';
        await new Promise(resolve => setTimeout(resolve, this.getThinkingDuration()));
        return this.stepResponses.publish();
      } else if (userMessage.toLowerCase().includes('reject') ||
                 userMessage.toLowerCase().includes('modify')) {
        // Handle rejection - go back to tasks
        const rejectResponse: Message = {
          role: 'assistant',
          content: `## Schedule Modification

I understand you'd like to modify the schedule. Let me help you adjust it.

What changes would you like to make?
• Reschedule specific tasks to different days
• Change crew assignments
• Adjust task priorities
• Add or remove tasks from the schedule

*Please describe your changes, or type "restart" to begin fresh* →`,
          metadata: {
            agentName: 'Work Scheduler',
            skillName: 'Schedule Modification',
            step: 'schedule',
            agentType: 'eamScheduler',
          },
        };
        return rejectResponse;
      }
    }

    // Only progress through steps if we're not at intro (intro was shown when agent selected)
    if (this.state.currentStep === 'intro') {
      this.state.currentStep = 'tasks';
    } else {
      // Progress through steps normally
      const stepOrder: EAMStep[] = ['intro', 'tasks', 'workers', 'schedule', 'publish', 'complete'];
      const currentIndex = stepOrder.indexOf(this.state.currentStep);

      if (currentIndex < stepOrder.length - 1) {
        this.state.currentStep = stepOrder[currentIndex + 1];
      }
    }

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, this.getThinkingDuration()));

    return this.stepResponses[this.state.currentStep]();
  }

  getCurrentStep(): EAMStep {
    return this.state.currentStep;
  }

  isComplete(): boolean {
    return this.state.currentStep === 'complete';
  }
}

export const eamSchedulerChatService = new EAMSchedulerChatService();