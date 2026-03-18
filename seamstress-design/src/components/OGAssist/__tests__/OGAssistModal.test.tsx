import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, beforeAll, vi, Mock } from 'vitest';
import '@testing-library/jest-dom';
import { OGAssistModal } from '../OGAssistModal';
import { useOGAssist } from '../../../hooks/useOGAssist';
import type { Conversation } from '@opengov/components-ai-patterns';

// Mock the hooks and external dependencies
vi.mock('../../../hooks/useOGAssist');
vi.mock('../../../services/agents/agentTypes', () => ({
  AGENT_TYPES: {
    budget: {
      id: 'budget',
      name: 'Budget & Planning Agent',
      color: '#4b3fff',
    },
    eamScheduler: {
      id: 'eamScheduler',
      name: 'EAM Work Scheduler',
      color: '#546574',
    },
  },
}));

// Mock scrollTo function for jsdom
beforeAll(() => {
  Element.prototype.scrollTo = vi.fn();
});

vi.mock('@opengov/components-ai-patterns', () => ({
  AIPromptInput: ({ value, onChange, onSubmit, placeholder, isLoading, disabled, dataTest, ariaLabels, thinkingMessage }: any) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit(value);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    return (
      <div data-testid="ai-prompt-input">
        {thinkingMessage && <div data-testid="thinking-message">{thinkingMessage}</div>}
        <textarea
          data-test={dataTest}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          aria-label={ariaLabels?.input}
        />
        <button
          onClick={() => onSubmit(value)}
          disabled={disabled || isLoading || !value?.trim()}
          aria-label={isLoading ? ariaLabels?.stopButton : ariaLabels?.sendButton}
        >
          {isLoading ? 'Stop' : 'Send'}
        </button>
      </div>
    );
  },
  AIDisclaimer: () => <div>AI can make mistakes. Please carefully check all outputs.</div>,
}));

describe('OGAssistModal - Text Input and Submission', () => {
  const mockSendMessage = vi.fn();
  const mockSetSelectedAgent = vi.fn();
  const mockCreateNewConversation = vi.fn();
  const mockSetActiveConversation = vi.fn();
  const mockOnClose = vi.fn();

  const defaultMockOGAssist = {
    conversation: { messages: [] } as Conversation,
    isLoading: false,
    thinkingMessage: undefined,
    selectedAgent: 'budget',
    setSelectedAgent: mockSetSelectedAgent,
    sendMessage: mockSendMessage,
    createNewConversation: mockCreateNewConversation,
    conversationHistory: [],
    activeConversationId: 'default',
    setActiveConversation: mockSetActiveConversation,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useOGAssist as Mock).mockReturnValue(defaultMockOGAssist);

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
      configurable: true,
    });
  });

  describe('Basic Rendering', () => {
    it('should render the modal with input field when open', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('ai-prompt-input')).toBeInTheDocument();
      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...');
      expect(input).toBeInTheDocument();
    });

    it('should not render when modal is closed', () => {
      render(<OGAssistModal open={false} onClose={mockOnClose} />);

      expect(screen.queryByTestId('ai-prompt-input')).not.toBeInTheDocument();
    });
  });

  describe('Text Input', () => {
    it('should allow typing text in the input field', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;

      fireEvent.change(input, { target: { value: 'What is the current budget status?' } });

      expect(input.value).toBe('What is the current budget status?');
    });

    it('should maintain input value across multiple character inputs', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;

      // Type character by character
      fireEvent.change(input, { target: { value: 'H' } });
      expect(input.value).toBe('H');

      fireEvent.change(input, { target: { value: 'He' } });
      expect(input.value).toBe('He');

      fireEvent.change(input, { target: { value: 'Hello' } });
      expect(input.value).toBe('Hello');
    });

    it('should handle paste events', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;
      const longText = 'This is a long text that was pasted from clipboard';

      fireEvent.change(input, { target: { value: longText } });

      expect(input.value).toBe(longText);
    });

    it('should handle backspace/deletion', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;

      fireEvent.change(input, { target: { value: 'Test message' } });
      expect(input.value).toBe('Test message');

      fireEvent.change(input, { target: { value: 'Test messag' } });
      expect(input.value).toBe('Test messag');

      fireEvent.change(input, { target: { value: '' } });
      expect(input.value).toBe('');
    });
  });

  describe('Message Submission', () => {
    it('should submit message via Send button', async () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      fireEvent.change(input, { target: { value: 'What is the current budget status?' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('What is the current budget status?');
      });
    });

    it('should clear input after submission', async () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      fireEvent.change(input, { target: { value: 'Test message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should submit message when pressing Enter key', async () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;

      fireEvent.change(input, { target: { value: 'Show me budget trends' } });
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Show me budget trends');
      });
    });

    it('should not submit when pressing Shift+Enter', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;

      fireEvent.change(input, { target: { value: 'First line' } });
      fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should not submit empty messages', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const sendButton = screen.getByRole('button', { name: 'Send message' });

      // Button should be disabled when input is empty
      expect(sendButton).toBeDisabled();
    });

    it('should not submit whitespace-only messages', () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      fireEvent.change(input, { target: { value: '   ' } });

      // Button should be disabled for whitespace-only input
      expect(sendButton).toBeDisabled();
    });

    it('should handle multiple submissions in sequence', async () => {
      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      // First submission
      fireEvent.change(input, { target: { value: 'First message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('First message');
        expect(input.value).toBe('');
      });

      // Second submission
      fireEvent.change(input, { target: { value: 'Second message' } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith('Second message');
        expect(mockSendMessage).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Loading State', () => {
    it('should disable input while loading', () => {
      (useOGAssist as Mock).mockReturnValue({
        ...defaultMockOGAssist,
        isLoading: true,
      });

      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...');
      expect(input).toBeDisabled();
    });

    it('should show Stop button instead of Send when loading', () => {
      (useOGAssist as Mock).mockReturnValue({
        ...defaultMockOGAssist,
        isLoading: true,
      });

      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: 'Stop generating response' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
    });

  });

  describe('Error Handling', () => {
    it('should restore message on send error', async () => {
      mockSendMessage.mockRejectedValueOnce(new Error('Network error'));

      render(<OGAssistModal open={true} onClose={mockOnClose} />);

      const input = screen.getByPlaceholderText('Ask Budget & Planning Agent a question...') as HTMLTextAreaElement;
      const sendButton = screen.getByRole('button', { name: 'Send message' });

      fireEvent.change(input, { target: { value: 'Important message' } });
      fireEvent.click(sendButton);

      // Wait for the error to be handled
      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalled();
      });

      // Message should be restored after error
      await waitFor(() => {
        expect(input.value).toBe('Important message');
      });
    });

  });
});