import { useState, useCallback } from 'react';
import { inspectionAgent } from '../services/agents/inspectionAgent';
import type { Message } from '@opengov/components-ai-patterns';
import { generateMessageId } from '../utils/id';
import { logger } from '../utils/logger';

export function useInspectionAgent() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processInspectionQuery = useCallback(async (query: string): Promise<Message> => {
    setIsProcessing(true);

    try {
      const result = await inspectionAgent.processQuery(query);

      // Format the response based on the intent
      let responseContent = '';

      switch (result.intent) {
        case 'check_availability':
          const { inspectors, availableSlots } = result.response;
          const availableInspectors = inspectors.filter(i => i.status === 'available');
          responseContent = `Found ${availableInspectors.length} available inspectors with ${availableSlots.length} open time slots.`;
          break;

        case 'capacity_summary':
          const capacityData = result.response;
          const avgUtilization = capacityData.reduce((sum: number, d: any) => sum + d.utilization, 0) / capacityData.length;
          responseContent = `Team is at ${Math.round(avgUtilization)}% capacity. Showing detailed breakdown below.`;
          break;

        case 'daily_summary':
          const { summary } = result.response;
          responseContent = `${summary.inspectorName} completed ${summary.completed} inspections on ${summary.date}. ${summary.passed} passed, ${summary.failed} failed.`;
          break;

        case 'checklist_status':
          const { summary: checklistSummary } = result.response;
          responseContent = `Checklist is ${Math.round(checklistSummary.completionPercentage)}% complete. ${checklistSummary.passed} items passed, ${checklistSummary.failed} failed, ${checklistSummary.notStarted} not started.`;
          break;

        case 'community_metrics':
          const metrics = result.response;
          responseContent = `Community has ${metrics.totalScheduled} inspections scheduled, ${metrics.totalCompleted} completed this week with a ${Math.round(metrics.averagePassRate * 100)}% pass rate.`;
          break;

        default:
          responseContent = result.response.message || 'I can help you with inspection scheduling queries.';
      }

      // Create the response message with proper metadata
      const responseMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      };

      // Add metadata for card rendering if we have a component type
      if (result.componentType) {
        responseMessage.metadata = {
          agentType: 'inspection',
          intent: result.intent,
          componentType: result.componentType,
          data: result.response,
        };
      }

      return responseMessage;
    } catch (error) {
      logger.error('Error processing inspection query', error);

      return {
        id: generateMessageId(),
        role: 'assistant',
        content: 'I encountered an error processing your inspection query. Please try again or rephrase your question.',
        timestamp: new Date().toISOString(),
        metadata: {
          agentType: 'inspection',
          error: true,
        },
      };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    processInspectionQuery,
    isProcessing,
  };
}