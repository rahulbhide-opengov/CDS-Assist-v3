import type { Message } from '@opengov/components-ai-patterns';
import { inspectionAgent } from './agents/inspectionAgent';

export type InspectionStep = 'intro' | 'availability' | 'capacity' | 'daily' | 'checklist' | 'metrics' | 'complete';

interface InspectionChatState {
  currentStep: InspectionStep;
  messageCount: number;
}

class InspectionChatService {
  private state: InspectionChatState = {
    currentStep: 'intro',
    messageCount: 0,
  };

  private stepResponses: Record<InspectionStep, () => Promise<Message>> = {
    intro: async () => ({
      role: 'assistant',
      content: `## Welcome to Inspection Scheduler

I'll guide you through our inspection management system, demonstrating how to monitor inspector workloads and schedules.

Let me start by checking current inspector availability...`,
      metadata: {
        agentName: 'Inspection Scheduler',
        skillName: 'Overview',
        step: 'intro',
        agentType: 'inspection',
      },
    }),

    availability: async () => {
      const data = await inspectionAgent.checkAvailability();
      const availableCount = data.inspectors.filter(i => i.status === 'available').length;

      return {
        role: 'assistant',
        content: `## Inspector Availability

I found **${availableCount} available inspectors** out of ${data.inspectors.length} total team members. Here's the current availability status:`,
        metadata: {
          agentName: 'Inspection Scheduler',
          skillName: 'Availability Check',
          step: 'availability',
          agentType: 'inspection',
          componentType: 'InspectorAvailability',
          data: data,
          prompt: '*Type anything to review capacity metrics* →',
        },
      };
    },

    capacity: async () => {
      const data = await inspectionAgent.getCapacitySummary();
      const avgUtilization = data.reduce((sum, d) => sum + d.utilization, 0) / data.length;

      return {
        role: 'assistant',
        content: `## Team Capacity Analysis

The team is operating at **${Math.round(avgUtilization)}% capacity** this week. Let me show you the detailed breakdown by inspector:`,
        metadata: {
          agentName: 'Inspection Scheduler',
          skillName: 'Capacity Analysis',
          step: 'capacity',
          agentType: 'inspection',
          componentType: 'InspectorCapacity',
          data: data,
          prompt: '*Type anything to see daily inspection summaries* →',
        },
      };
    },

    daily: async () => {
      // Get Carlos Garcia's summary as an example
      const data = await inspectionAgent.getDailySummary('ins_1', new Date().toISOString().split('T')[0]);

      return {
        role: 'assistant',
        content: `## Daily Inspection Summary

Here's **Carlos Garcia's** inspection summary for today. He completed ${data.summary.completed} inspections with a ${Math.round((data.summary.passed / data.summary.completed) * 100)}% pass rate:`,
        metadata: {
          agentName: 'Inspection Scheduler',
          skillName: 'Daily Summary',
          step: 'daily',
          agentType: 'inspection',
          componentType: 'DailyInspectionSummary',
          data: data,
          prompt: '*Type anything to review checklist compliance* →',
        },
      };
    },

    checklist: async () => {
      const data = await inspectionAgent.getChecklistStatus('inspection_123');

      return {
        role: 'assistant',
        content: `## Inspection Checklist Status

The current inspection is **${Math.round(data.summary.completionPercentage)}% complete** with ${data.summary.failed} items requiring attention:`,
        metadata: {
          agentName: 'Inspection Scheduler',
          skillName: 'Checklist Review',
          step: 'checklist',
          agentType: 'inspection',
          componentType: 'ChecklistStatusReview',
          data: data,
          prompt: '*Type anything to view community-wide metrics* →',
        },
      };
    },

    metrics: async () => {
      const data = await inspectionAgent.getCommunityMetrics();

      return {
        role: 'assistant',
        content: `## Community Inspection Metrics

This week, we've completed **${data.totalCompleted} inspections** across the community with a **${Math.round(data.averagePassRate * 100)}% pass rate**:`,
        metadata: {
          agentName: 'Inspection Scheduler',
          skillName: 'Community Metrics',
          step: 'metrics',
          agentType: 'inspection',
          componentType: 'CommunityMetrics',
          data: data,
          prompt: '*Type "restart" to begin again or "done" to finish* →',
        },
      };
    },

    complete: async () => ({
      role: 'assistant',
      content: `## Inspection Demo Complete!

Great job exploring the inspection management system! You've learned how to:

✅ Check inspector availability and schedules
✅ Monitor team capacity and workload
✅ Review daily inspection summaries
✅ Track checklist compliance
✅ Analyze community-wide metrics

Feel free to ask me about any specific inspection queries, or type "restart" to see the demo again.`,
      metadata: {
        agentName: 'Inspection Scheduler',
        skillName: 'Complete',
        step: 'complete',
        agentType: 'inspection',
        isFinalMessage: true,
      },
    }),
  };

  reset(): void {
    this.state = {
      currentStep: 'intro',
      messageCount: 0,
    };
  }

  async processMessage(userMessage: string): Promise<Message> {
    // Special handling for initial empty message
    if (userMessage === '' && this.state.messageCount === 0) {
      this.state.messageCount++;
      return this.stepResponses.intro();
    }

    this.state.messageCount++;

    // Handle reset commands
    if (userMessage.toLowerCase().includes('restart') ||
        userMessage.toLowerCase().includes('reset') ||
        userMessage.toLowerCase().includes('new')) {
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

    // Progress through steps normally
    const stepOrder: InspectionStep[] = ['intro', 'availability', 'capacity', 'daily', 'checklist', 'metrics', 'complete'];
    const currentIndex = stepOrder.indexOf(this.state.currentStep);

    if (currentIndex < stepOrder.length - 1) {
      this.state.currentStep = stepOrder[currentIndex + 1];
    }

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));

    return this.stepResponses[this.state.currentStep]();
  }

  getCurrentStep(): InspectionStep {
    return this.state.currentStep;
  }

  isComplete(): boolean {
    return this.state.currentStep === 'complete';
  }
}

export const inspectionChatService = new InspectionChatService();