import type { Message } from '@opengov/components-ai-patterns';
import { budgetAgentResponses } from './agents/budgetAgentResponses';
import type { BudgetResponse } from './agents/budgetAgentResponses';
import { buildingCodeResponses } from './agents/buildingCodeAgentResponses';
import type { BuildingCodeResponse } from './agents/buildingCodeAgentResponses';
import { buildingCodeGenUXResponses } from './agents/buildingCodeGenUXResponses';
import type { GenUXResponse } from './agents/buildingCodeGenUXResponses';
import { eamDashboardResponses } from './agents/eamDashboardAgentResponses';
import type { EAMDashboardResponse } from './agents/eamDashboardAgentResponses';
import { documentBuilderResponses } from './agents/documentBuilderAgentResponses';
import type { DocumentBuilderResponse } from './agents/documentBuilderAgentResponses';
import { documentBuilderSimpleResponses } from './agents/documentBuilderSimpleResponses';
import type { DocumentBuilderSimpleResponse } from './agents/documentBuilderSimpleResponses';

type BudgetStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'complete';
type BuildingCodeStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'complete';
type EAMDashboardStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'complete';
type DocumentBuilderStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'complete';
type DocumentBuilderSimpleStep = 'intro' | 'step1' | 'step2' | 'step3' | 'step4' | 'step5' | 'step6' | 'complete';
type AgentType = 'budget' | 'buildingCode' | 'buildingCodeGenUX' | 'eamDashboard' | 'documentBuilder' | 'documentBuilderSimple';

class OGAssistService {
  private currentAgent: AgentType = 'budget';
  private currentStep: BudgetStep | BuildingCodeStep | EAMDashboardStep | DocumentBuilderStep | DocumentBuilderSimpleStep = 'intro';
  private messageCount = 0;
  private pendingApproval: BuildingCodeResponse | null = null;

  private budgetStepKeys = [
    "analyze my budget",
    "show me the detailed breakdown for marketing overspend",
    "what optimization strategies do you recommend for google ads?",
    "how should we reallocate the saved budget?",
    "create an action plan with specific deadlines and owners"
  ];

  setAgent(agentType: AgentType) {
    this.currentAgent = agentType;
    this.resetDemo();
  }

  async sendMessage(message: string): Promise<Message & { metadata?: any }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

    if (this.currentAgent === 'buildingCode' || this.currentAgent === 'buildingCodeGenUX') {
      return this.handleBuildingCodeMessage(message);
    } else if (this.currentAgent === 'eamDashboard') {
      return this.handleEAMDashboardMessage(message);
    } else if (this.currentAgent === 'documentBuilder') {
      return this.handleDocumentBuilderMessage(message);
    } else if (this.currentAgent === 'documentBuilderSimple') {
      return this.handleDocumentBuilderSimpleMessage(message);
    } else {
      return this.handleBudgetMessage(message);
    }
  }

  private async handleBuildingCodeMessage(message: string): Promise<Message & { metadata?: any }> {
    const lowerMessage = message.toLowerCase();
    let response: BuildingCodeResponse | GenUXResponse | undefined;
    const useGenUX = this.currentAgent === 'buildingCodeGenUX';
    const responses = useGenUX ? buildingCodeGenUXResponses : buildingCodeResponses;

    // Handle reset commands
    if (lowerMessage.includes('restart') || lowerMessage.includes('reset') || lowerMessage.includes('new')) {
      this.resetDemo();
      this.currentStep = 'step1';
      response = responses.step1;
    }
    // Initial message - start the flow
    else if (this.currentStep === 'intro') {
      this.currentStep = 'step1';
      response = responses.step1;
    }
    // Progress linearly through steps regardless of input
    else {
      const stepOrder: BuildingCodeStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'complete'];
      const currentIndex = stepOrder.indexOf(this.currentStep as BuildingCodeStep);

      if (currentIndex < stepOrder.length - 1 && this.currentStep !== 'complete') {
        this.currentStep = stepOrder[currentIndex + 1] as BuildingCodeStep;

        // Map step to response
        switch (this.currentStep) {
          case 'step1':
            response = responses.step1;
            break;
          case 'step2':
            response = responses.step2;
            break;
          case 'step3':
            response = responses.step3;
            break;
          case 'step4':
            response = responses.step4;
            this.pendingApproval = response; // Store for approval handling
            break;
          case 'step5':
            response = responses.step5;
            break;
          case 'step6':
            response = responses.step6;
            break;
          default:
            response = responses.step1;
        }
      } else if (this.currentStep === 'complete') {
        // Stay on complete message
        response = responses.step6;
        response = {
          ...response,
          isFinalMessage: true
        };
      }
    }

    // Fallback to first step if no response
    if (!response) {
      this.currentStep = 'step1';
      response = responses.step1;
    }

    this.messageCount++;

    // Format the response
    const followUps = response.followUpSuggestions || [];
    const content = response.content || 'Processing your request...';
    const enhancedContent = followUps.length > 0 && !response.isFinalMessage
      ? `${content}\n\n### What would you like to do next?\n${followUps.map(f => `- ${f}`).join('\n')}`
      : content;

    return {
      role: 'assistant',
      content: enhancedContent,
      metadata: {
        agentName: response.agentName || 'Building Code Assistant',
        skillName: response.skillName || 'Building Code Lookup',
        isFinalMessage: response.isFinalMessage || false,
        requiresApproval: response.requiresApproval || false,
        approvalAction: response.approvalAction,
        approvalData: response.approvalData,
        uiComponents: (response as GenUXResponse).uiComponents, // Include Gen UX components
      },
    };
  }

  async handleApproval(approved: boolean): Promise<Message & { metadata?: any }> {
    if (!this.pendingApproval) {
      throw new Error('No pending approval');
    }

    if (approved) {
      // Move to next step after approval
      this.currentStep = 'step5';
      this.pendingApproval = null;

      const response = buildingCodeResponses.step5;
      const followUps = response.followUpSuggestions || [];
      const content = response.content || 'Action completed successfully.';
      const enhancedContent = followUps.length > 0
        ? `${content}\n\n### What would you like to do next?\n${followUps.map(f => `- ${f}`).join('\n')}`
        : content;

      return {
        role: 'assistant',
        content: enhancedContent,
        metadata: {
          agentName: response.agentName || 'Building Code Assistant',
          skillName: response.skillName || 'Permit Application Assistance',
          isFinalMessage: response.isFinalMessage || false,
        },
      };
    } else {
      // Rejection - stay on current step
      this.pendingApproval = null;
      return {
        role: 'assistant',
        content: 'No problem! Let me know if you\'d like to modify the details or if you have any questions.',
        metadata: {
          agentName: 'Building Code Assistant',
          skillName: 'Building Code Lookup',
        },
      };
    }
  }

  private async handleBudgetMessage(message: string): Promise<Message & { metadata?: any }> {
    const lowerMessage = message.toLowerCase();
    let response: BudgetResponse | undefined;

    // Handle reset commands
    if (lowerMessage.includes('restart') || lowerMessage.includes('reset') || lowerMessage.includes('new')) {
      this.resetDemo();
      this.currentStep = 'step1';
      response = budgetAgentResponses[this.budgetStepKeys[0]];
    }
    // Handle completion
    else if (this.currentStep === 'step5' || lowerMessage.includes('done') || lowerMessage.includes('finish')) {
      this.currentStep = 'complete';
      response = budgetAgentResponses[this.budgetStepKeys[4]]; // Show final step
      response = {
        ...response,
        isFinalMessage: true
      };
    }
    // Initial message - start the flow
    else if (this.currentStep === 'intro') {
      this.currentStep = 'step1';
      response = budgetAgentResponses[this.budgetStepKeys[0]];
    }
    // Progress linearly through steps regardless of input
    else {
      const stepOrder: BudgetStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'complete'];
      const currentIndex = stepOrder.indexOf(this.currentStep as BudgetStep);

      if (currentIndex < stepOrder.length - 1 && this.currentStep !== 'complete') {
        this.currentStep = stepOrder[currentIndex + 1] as BudgetStep;

        // Map step to response
        const responseIndex = Math.min(parseInt((this.currentStep as string).replace('step', '')) - 1, this.budgetStepKeys.length - 1);
        if (!isNaN(responseIndex) && responseIndex >= 0) {
          response = budgetAgentResponses[this.budgetStepKeys[responseIndex]];
        }
      } else if (this.currentStep === 'complete') {
        // Stay on complete message
        response = budgetAgentResponses[this.budgetStepKeys[4]];
        response = {
          ...response,
          isFinalMessage: true
        };
      }
    }

    // Fallback to first step if no response
    if (!response) {
      this.currentStep = 'step1';
      response = budgetAgentResponses[this.budgetStepKeys[0]];
    }

    this.messageCount++;

    // Format the response
    const followUps = response.followUpSuggestions || [];
    const content = response.content || 'Processing your request...';
    const enhancedContent = followUps.length > 0 && !response.isFinalMessage
      ? `${content}\n\n### What would you like to explore next?\n${followUps.map(f => `- ${f}`).join('\n')}`
      : content;

    return {
      role: 'assistant',
      content: enhancedContent,
      metadata: {
        agentName: response.agentName || 'Budget & Planning Agent',
        skillName: response.skillName || 'Analysis',
        isFinalMessage: response.isFinalMessage || false,
      },
    };
  }

  private async handleEAMDashboardMessage(message: string): Promise<Message & { metadata?: any }> {
    const lowerMessage = message.toLowerCase();
    let response: EAMDashboardResponse | undefined;

    // Handle reset commands
    if (lowerMessage.includes('restart') || lowerMessage.includes('reset') || lowerMessage.includes('new')) {
      this.resetDemo();
      this.currentStep = 'step1';
      response = eamDashboardResponses.step1;
    }
    // Initial message - start the flow
    else if (this.currentStep === 'intro') {
      this.currentStep = 'step1';
      response = eamDashboardResponses.step1;
    }
    // Progress linearly through steps regardless of input
    else {
      const stepOrder: EAMDashboardStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'complete'];
      const currentIndex = stepOrder.indexOf(this.currentStep as EAMDashboardStep);

      if (currentIndex < stepOrder.length - 1 && this.currentStep !== 'complete') {
        this.currentStep = stepOrder[currentIndex + 1] as EAMDashboardStep;

        // Map step to response
        switch (this.currentStep) {
          case 'step1':
            response = eamDashboardResponses.step1;
            break;
          case 'step2':
            response = eamDashboardResponses.step2;
            break;
          case 'step3':
            response = eamDashboardResponses.step3;
            break;
          case 'step4':
            response = eamDashboardResponses.step4;
            break;
          case 'step5':
            response = eamDashboardResponses.step5;
            break;
          default:
            response = eamDashboardResponses.step1;
        }
      } else if (this.currentStep === 'complete') {
        // Stay on complete message
        response = eamDashboardResponses.step5;
        response = {
          ...response,
          isFinalMessage: true
        };
      }
    }

    // Fallback to first step if no response
    if (!response) {
      this.currentStep = 'step1';
      response = eamDashboardResponses.step1;
    }

    this.messageCount++;

    // Format the response
    const followUps = response.followUpSuggestions || [];
    const content = response.content || 'Processing your request...';
    const enhancedContent = followUps.length > 0 && !response.isFinalMessage
      ? `${content}\n\n### What would you like to do next?\n${followUps.map(f => `- ${f}`).join('\n')}`
      : content;

    return {
      role: 'assistant',
      content: enhancedContent,
      metadata: {
        agentName: response.agentName || 'EAM Dashboard Assistant',
        skillName: response.skillName || 'Dashboard Analysis',
        isFinalMessage: response.isFinalMessage || false,
        suggestedWidget: response.suggestedWidget, // Pass widget suggestion for action button
      },
    };
  }

  private async handleDocumentBuilderMessage(message: string): Promise<Message & { metadata?: any }> {
    const lowerMessage = message.toLowerCase();
    let response: DocumentBuilderResponse | undefined;

    // Handle reset commands
    if (lowerMessage.includes('restart') || lowerMessage.includes('reset') || lowerMessage.includes('new')) {
      this.resetDemo();
      this.currentStep = 'step1';
      response = documentBuilderResponses.step1;
    }
    // Initial message - start the flow
    else if (this.currentStep === 'intro') {
      this.currentStep = 'step1';
      response = documentBuilderResponses.step1;
    }
    // Progress linearly through steps regardless of input
    else {
      const stepOrder: DocumentBuilderStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'complete'];
      const currentIndex = stepOrder.indexOf(this.currentStep as DocumentBuilderStep);

      if (currentIndex < stepOrder.length - 1 && this.currentStep !== 'complete') {
        this.currentStep = stepOrder[currentIndex + 1] as DocumentBuilderStep;

        // Map step to response
        switch (this.currentStep) {
          case 'step1':
            response = documentBuilderResponses.step1;
            break;
          case 'step2':
            response = documentBuilderResponses.step2;
            break;
          case 'step3':
            response = documentBuilderResponses.step3;
            break;
          case 'step4':
            response = documentBuilderResponses.step4;
            break;
          case 'step5':
            response = documentBuilderResponses.step5;
            break;
          case 'step6':
            response = documentBuilderResponses.step6;
            break;
          default:
            response = documentBuilderResponses.step1;
        }
      } else if (this.currentStep === 'complete') {
        // Stay on complete message
        response = documentBuilderResponses.step6;
        response = {
          ...response,
          isFinalMessage: true
        };
      }
    }

    // Fallback to first step if no response
    if (!response) {
      this.currentStep = 'step1';
      response = documentBuilderResponses.step1;
    }

    this.messageCount++;

    // Format the response - followUpSuggestions now passed in metadata, not embedded in content
    const content = response.content || 'Processing your request...';

    return {
      role: 'assistant',
      content: content,
      metadata: {
        agentName: response.agentName || 'Document Builder Assistant',
        skillName: response.skillName || 'Document Analysis',
        isFinalMessage: response.isFinalMessage || false,
        documentAction: response.documentAction,
        highlightTargets: response.highlightTargets,
        previewContent: response.previewContent,
        // Pass followUpSuggestions in metadata for SuggestedActionsBar
        followUpSuggestions: response.isFinalMessage ? [] : (response.followUpSuggestions || []),
        // Track demo step for action relationships
        demoStep: this.currentStep,
        // Pass approval and relationship metadata for Gen UX audit workspace
        requiresApproval: response.requiresApproval,
        actionRelationship: response.actionRelationship,
      },
    };
  }

  private async handleDocumentBuilderSimpleMessage(message: string): Promise<Message & { metadata?: any }> {
    const lowerMessage = message.toLowerCase();
    let response: DocumentBuilderSimpleResponse | undefined;

    // Handle reset commands
    if (lowerMessage.includes('restart') || lowerMessage.includes('reset') || lowerMessage.includes('new')) {
      this.resetDemo();
      this.currentStep = 'step1';
      response = documentBuilderSimpleResponses.step1;
    }
    // Initial message - start the flow
    else if (this.currentStep === 'intro') {
      this.currentStep = 'step1';
      response = documentBuilderSimpleResponses.step1;
    }
    // Progress linearly through steps regardless of input
    else {
      const stepOrder: DocumentBuilderSimpleStep[] = ['intro', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'complete'];
      const currentIndex = stepOrder.indexOf(this.currentStep as DocumentBuilderSimpleStep);

      if (currentIndex < stepOrder.length - 1 && this.currentStep !== 'complete') {
        this.currentStep = stepOrder[currentIndex + 1] as DocumentBuilderSimpleStep;

        // Map step to response
        switch (this.currentStep) {
          case 'step1':
            response = documentBuilderSimpleResponses.step1;
            break;
          case 'step2':
            response = documentBuilderSimpleResponses.step2;
            break;
          case 'step3':
            response = documentBuilderSimpleResponses.step3;
            break;
          case 'step4':
            response = documentBuilderSimpleResponses.step4;
            break;
          case 'step5':
            response = documentBuilderSimpleResponses.step5;
            break;
          case 'step6':
            response = documentBuilderSimpleResponses.step6;
            break;
          default:
            response = documentBuilderSimpleResponses.step1;
        }
      } else if (this.currentStep === 'complete') {
        // Stay on complete message
        response = documentBuilderSimpleResponses.step6;
        response = {
          ...response,
          isFinalMessage: true
        };
      }
    }

    // Fallback to first step if no response
    if (!response) {
      this.currentStep = 'step1';
      response = documentBuilderSimpleResponses.step1;
    }

    this.messageCount++;

    // Simple responses - just plain content, no GenUX metadata
    const content = response.content || 'Processing your request...';

    return {
      role: 'assistant',
      content: content,
      metadata: {
        agentName: response.agentName || 'Document Builder Assistant',
        skillName: response.skillName || 'Document Analysis',
        isFinalMessage: response.isFinalMessage || false,
        // No documentAction, previewContent, or followUpSuggestions for simple agent
      },
    };
  }

  async getConversationHistory() {
    // In a real implementation, this would fetch from an API
    const saved = localStorage.getItem('ogAssistHistory');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  }

  async saveConversation(conversation: any) {
    // In a real implementation, this would save to an API
    const history = await this.getConversationHistory();
    history.push(conversation);
    localStorage.setItem('ogAssistHistory', JSON.stringify(history));
  }

  async deleteConversation(id: string) {
    const history = await this.getConversationHistory();
    const filtered = history.filter((c: any) => c.id !== id);
    localStorage.setItem('ogAssistHistory', JSON.stringify(filtered));
  }

  async clearConversationHistory() {
    localStorage.removeItem('ogAssistHistory');
  }

  // Reset the demo when starting a new conversation
  resetDemo() {
    this.currentStep = 'intro';
    this.messageCount = 0;
  }
}

export const ogAssistService = new OGAssistService();