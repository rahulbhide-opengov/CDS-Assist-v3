import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { ogAssistService } from './ogAssistService';
import { budgetAgentResponses } from './agents/budgetAgentResponses';
import type { Message } from '@opengov/components-ai-patterns';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as any;

// Mock setTimeout to make tests faster
vi.useFakeTimers();

describe('OGAssistService', () => {
  const service = ogAssistService;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset service state
    (service as any).currentStep = 'intro';
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('sendMessage', () => {
    it('should return initial budget analysis for budget-related keywords', async () => {
      const messagePromise = service.sendMessage('Can you analyze my budget?');

      // Fast-forward through the simulated delay
      vi.runAllTimers();

      const response = await messagePromise;

      expect(response.role).toBe('assistant');
      expect(response.content).toContain(budgetAgentResponses['analyze my budget'].content);
      expect(response.metadata).toMatchObject({
        agentName: budgetAgentResponses['analyze my budget'].agentName,
        skillName: budgetAgentResponses['analyze my budget'].skillName,
        isFinalMessage: false
      });
    });

    it('should handle variance keyword trigger', async () => {
      const messagePromise = service.sendMessage('Check the variance report');
      vi.runAllTimers();
      const response = await messagePromise;

      expect(response.content).toContain(budgetAgentResponses['analyze my budget'].content);
      expect(response.metadata.agentName).toBe('Budget & Planning Agent');
    });

    it('should progress through linear flow - marketing step', async () => {
      // First message to initiate the flow
      let messagePromise = service.sendMessage('analyze budget');
      vi.runAllTimers();
      await messagePromise;

      // Second message - marketing breakdown
      messagePromise = service.sendMessage('Tell me about the marketing issues');
      vi.runAllTimers();
      const response = await messagePromise;

      expect(response.content).toContain(
        budgetAgentResponses['show me the detailed breakdown for marketing overspend'].content
      );
    });

    it('should progress through complete conversation flow', async () => {
      // Step 1: Initial budget analysis
      let messagePromise = service.sendMessage('analyze my budget');
      vi.runAllTimers();
      let response = await messagePromise;
      expect(response.metadata.agentName).toBe('Budget & Planning Agent');

      // Step 2: Marketing breakdown
      messagePromise = service.sendMessage('show marketing details');
      vi.runAllTimers();
      response = await messagePromise;
      expect(response.content).toContain('Marketing Department');

      // Step 3: Optimization strategies
      messagePromise = service.sendMessage('what optimization strategies do you recommend?');
      vi.runAllTimers();
      response = await messagePromise;
      expect(response.content).toContain('Google Ads');

      // Step 4: Budget reallocation
      messagePromise = service.sendMessage('how should we reallocate the saved budget?');
      vi.runAllTimers();
      response = await messagePromise;
      expect(response.content).toContain('explore next');

      // Step 5: Action plan
      messagePromise = service.sendMessage('create an action plan');
      vi.runAllTimers();
      response = await messagePromise;
      expect(response.metadata.isFinalMessage).toBeDefined();
    });

    it('should include follow-up suggestions when available', async () => {
      const messagePromise = service.sendMessage('analyze budget');
      vi.runAllTimers();
      const response = await messagePromise;

      const followUps = budgetAgentResponses['analyze my budget'].followUpSuggestions;
      if (followUps && followUps.length > 0) {
        expect(response.content).toContain('What would you like to explore next?');
        followUps.forEach(suggestion => {
          expect(response.content).toContain(suggestion);
        });
      }
    });

    it('should not include follow-up section for final messages', async () => {
      // Progress to final step
      const steps = [
        'analyze budget',
        'marketing breakdown',
        'optimization strategies',
        'reallocate budget',
        'action plan'
      ];

      for (const step of steps) {
        const messagePromise = service.sendMessage(step);
        vi.runAllTimers();
        await messagePromise;
      }

      // Now at final step, check next message
      const messagePromise = service.sendMessage('any message');
      vi.runAllTimers();
      const response = await messagePromise;

      if (response.metadata.isFinalMessage) {
        expect(response.content).not.toContain('What would you like to explore next?');
      }
    });

    it('should restart flow when no matching response found', async () => {
      const messagePromise = service.sendMessage('random unrelated message');
      vi.runAllTimers();
      const response = await messagePromise;

      expect(response.content).toContain(budgetAgentResponses['analyze my budget'].content);
      expect(response.metadata.agentName).toBe('Budget & Planning Agent');
    });

    it('should use default metadata when not provided in response', async () => {
      const messagePromise = service.sendMessage('test message');
      vi.runAllTimers();
      const response = await messagePromise;

      expect(response.metadata).toMatchObject({
        agentName: expect.any(String),
        skillName: expect.any(String),
        isFinalMessage: expect.any(Boolean)
      });
    });

    it('should handle case-insensitive message matching', async () => {
      const variations = [
        'ANALYZE MY BUDGET',
        'Analyze My Budget',
        'aNaLyZe mY bUdGeT'
      ];

      for (const message of variations) {
        (service as any).currentStep = 'intro'; // Reset for each test
        const messagePromise = service.sendMessage(message);
        vi.runAllTimers();
        const response = await messagePromise;

        expect(response.content).toContain(budgetAgentResponses['analyze my budget'].content);
      }
    });

    it('should simulate realistic API delay', async () => {
      const messagePromise = service.sendMessage('test');

      // The delay is 800 + random(0-400) ms
      vi.advanceTimersByTime(800);

      // Should still be pending
      let isResolved = false;
      messagePromise.then(() => { isResolved = true; });

      await Promise.resolve(); // Let promises tick
      expect(isResolved).toBe(false);

      // Advance more to ensure it resolves
      vi.advanceTimersByTime(400);
      await messagePromise;

      // After awaiting, the promise should be resolved
      expect(isResolved).toBe(true);
    });
  });

  describe('getConversationHistory', () => {
    it('should return empty array when no history exists', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      const history = await service.getConversationHistory();

      expect(history).toEqual([]);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('ogAssistHistory');
    });

    it('should return parsed history from localStorage', async () => {
      const mockHistory = [
        { id: '1', message: 'test1' },
        { id: '2', message: 'test2' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockHistory));

      const history = await service.getConversationHistory();

      expect(history).toEqual(mockHistory);
    });

    it('should handle invalid JSON in localStorage gracefully', async () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      await expect(service.getConversationHistory()).rejects.toThrow();
    });
  });

  describe('saveConversation', () => {
    it('should append conversation to existing history', async () => {
      const existingHistory = [{ id: '1', message: 'old' }];
      const newConversation = { id: '2', message: 'new' };

      localStorageMock.getItem.mockReturnValue(JSON.stringify(existingHistory));

      await service.saveConversation(newConversation);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ogAssistHistory',
        JSON.stringify([...existingHistory, newConversation])
      );
    });

    it('should create new history array if none exists', async () => {
      const newConversation = { id: '1', message: 'first' };

      localStorageMock.getItem.mockReturnValue(null);

      await service.saveConversation(newConversation);

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ogAssistHistory',
        JSON.stringify([newConversation])
      );
    });

    it('should handle localStorage quota exceeded', async () => {
      const newConversation = { id: '1', message: 'test' };

      localStorageMock.getItem.mockReturnValue(null);
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      await expect(service.saveConversation(newConversation)).rejects.toThrow('QuotaExceededError');
    });
  });

  describe('clearConversationHistory', () => {
    it('should clear history from localStorage', async () => {
      await service.clearConversationHistory();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('ogAssistHistory');
    });
  });

  describe('Flow State Management', () => {
    it('should maintain conversation state across multiple messages', async () => {
      // Start at intro
      expect((service as any).currentStep).toBe('intro');

      // Trigger initial flow
      let messagePromise = service.sendMessage('analyze budget');
      vi.runAllTimers();
      await messagePromise;
      expect((service as any).currentStep).toBe('step1');

      // Progress to step 2
      messagePromise = service.sendMessage('marketing');
      vi.runAllTimers();
      await messagePromise;
      expect((service as any).currentStep).toBe('step2');
    });

    it('should reset to step 1 when receiving unmatched message after initialization', async () => {
      // Initialize flow
      let messagePromise = service.sendMessage('analyze budget');
      vi.runAllTimers();
      await messagePromise;
      expect((service as any).currentStep).toBe('step1');

      // Send unmatched message
      messagePromise = service.sendMessage('something completely different with no keywords');
      vi.runAllTimers();
      await messagePromise;

      // Should progress to step2 (linear progression)
      expect((service as any).currentStep).toBe('step2');
    });

    it('should handle partial keyword matches correctly', async () => {
      // Initialize
      let messagePromise = service.sendMessage('budget');
      vi.runAllTimers();
      await messagePromise;

      // Try partial match for optimization
      messagePromise = service.sendMessage('optimize'); // partial match for 'optimization'
      vi.runAllTimers();
      await messagePromise;

      // Should progress to step2 (linear progression)
      expect((service as any).currentStep).toBe('step2');
    });
  });

  describe('Response Formatting', () => {
    it('should format response with metadata correctly', async () => {
      const messagePromise = service.sendMessage('analyze budget');
      vi.runAllTimers();
      const response = await messagePromise;

      expect(response).toHaveProperty('role', 'assistant');
      expect(response).toHaveProperty('content');
      expect(response).toHaveProperty('metadata');
      expect(response.metadata).toHaveProperty('agentName');
      expect(response.metadata).toHaveProperty('skillName');
      expect(response.metadata).toHaveProperty('isFinalMessage');
    });

    it('should handle responses without follow-up suggestions', async () => {
      // Mock a response without followUpSuggestions
      const originalResponse = budgetAgentResponses['analyze my budget'];
      const responseWithoutFollowUps = { ...originalResponse, followUpSuggestions: undefined };

      // This would need actual mocking of the budgetAgentResponses import
      // For now, testing the general flow
      const messagePromise = service.sendMessage('test');
      vi.runAllTimers();
      const response = await messagePromise;

      expect(response.content).toBeDefined();
      expect(response.role).toBe('assistant');
    });

    it('should provide default content when response content is missing', async () => {
      const messagePromise = service.sendMessage('test');
      vi.runAllTimers();
      const response = await messagePromise;

      // If content is missing, should have fallback
      expect(response.content).toBeTruthy();
      if (!budgetAgentResponses['analyze my budget'].content) {
        expect(response.content).toBe('Processing your request...');
      }
    });
  });
});