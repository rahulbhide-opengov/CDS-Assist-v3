import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { GenerativeResponse } from '../../../components/GenerativeUI/GenerativeResponse';
import type { EAMAgentResponse } from '../../../types/opengov/eam';

// Mock child components
vi.mock('../../../components/GenerativeUI/ToolCallChips', () => ({
  ToolCallChips: ({ tools }: { tools: string[] }) => (
    <div data-testid="tool-chips">
      {tools.map(tool => <span key={tool}>{tool}</span>)}
    </div>
  ),
}));

vi.mock('../../../components/GenerativeUI/FeedbackControls', () => ({
  FeedbackControls: ({ responseId, onFeedback, onAccept, onReject, showAcceptReject }: any) => (
    <div data-testid="feedback-controls">
      <button onClick={() => onFeedback('up', 'Great!')}>Thumbs Up</button>
      <button onClick={() => onAccept()}>Accept</button>
      <button onClick={() => onReject('Not good')}>Reject</button>
      {showAcceptReject && <span>Accept/Reject Visible</span>}
    </div>
  ),
}));

describe('GenerativeResponse', () => {
  const mockResponse: EAMAgentResponse = {
    id: 'response-123',
    timestamp: '2024-03-15T10:00:00Z',
    step: 'tasks',
    toolCalls: ['fetch_tasks', 'analyze_priority'],
    title: 'Test Response Title',
    body: 'This is the test response body text.',
    content: { data: 'test' },
  };

  const mockProps = {
    response: mockResponse,
    children: <div>Test Content</div>,
    onFeedback: vi.fn(),
    onAccept: vi.fn(),
    onReject: vi.fn(),
    showFeedback: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the response title', () => {
      render(<GenerativeResponse {...mockProps} />);

      expect(screen.getByText('Test Response Title')).toBeInTheDocument();
    });

    it('should render the response body text', () => {
      render(<GenerativeResponse {...mockProps} />);

      expect(screen.getByText('This is the test response body text.')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(<GenerativeResponse {...mockProps} />);

      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render tool call chips when tools are present', () => {
      render(<GenerativeResponse {...mockProps} />);

      expect(screen.getByTestId('tool-chips')).toBeInTheDocument();
      expect(screen.getByText('fetch_tasks')).toBeInTheDocument();
      expect(screen.getByText('analyze_priority')).toBeInTheDocument();
    });

    it('should not render tool chips when no tools present', () => {
      const responseWithoutTools = { ...mockResponse, toolCalls: [] };
      render(<GenerativeResponse {...mockProps} response={responseWithoutTools} />);

      expect(screen.queryByTestId('tool-chips')).not.toBeInTheDocument();
    });

    it('should render feedback controls when showFeedback is true', () => {
      render(<GenerativeResponse {...mockProps} />);

      expect(screen.getByTestId('feedback-controls')).toBeInTheDocument();
    });

    it('should not render feedback controls when showFeedback is false', () => {
      render(<GenerativeResponse {...mockProps} showFeedback={false} />);

      expect(screen.queryByTestId('feedback-controls')).not.toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply paper styling with left border indicator', () => {
      const { container } = render(<GenerativeResponse {...mockProps} />);

      const paper = container.querySelector('.MuiPaper-root');
      expect(paper).toBeInTheDocument();
    });

    it('should apply correct typography variants', () => {
      render(<GenerativeResponse {...mockProps} />);

      const title = screen.getByText('Test Response Title');
      const body = screen.getByText('This is the test response body text.');

      expect(title.tagName).toBe('H1');
      expect(body).toHaveClass('MuiTypography-body1');
    });
  });

  describe('Feedback Interactions', () => {
    it('should call onFeedback with correct parameters', () => {
      render(<GenerativeResponse {...mockProps} />);

      const thumbsUpButton = screen.getByText('Thumbs Up');
      fireEvent.click(thumbsUpButton);

      expect(mockProps.onFeedback).toHaveBeenCalledWith('response-123', 'up', 'Great!');
    });

    it('should call onAccept with response ID', () => {
      render(<GenerativeResponse {...mockProps} />);

      const acceptButton = screen.getByText('Accept');
      fireEvent.click(acceptButton);

      expect(mockProps.onAccept).toHaveBeenCalledWith('response-123');
    });

    it('should call onReject with response ID and reason', () => {
      render(<GenerativeResponse {...mockProps} />);

      const rejectButton = screen.getByText('Reject');
      fireEvent.click(rejectButton);

      expect(mockProps.onReject).toHaveBeenCalledWith('response-123', 'Not good');
    });

    it('should show Accept/Reject controls for schedule step', () => {
      const scheduleResponse = { ...mockResponse, step: 'schedule' as const };
      render(<GenerativeResponse {...mockProps} response={scheduleResponse} />);

      expect(screen.getByText('Accept/Reject Visible')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle response with minimal data', () => {
      const minimalResponse: EAMAgentResponse = {
        id: 'min-123',
        timestamp: '2024-03-15T10:00:00Z',
        step: 'tasks',
        title: '',
        body: '',
        toolCalls: [],
        content: null,
      };

      render(<GenerativeResponse {...mockProps} response={minimalResponse} />);

      // Should render without errors even with empty strings
      expect(screen.getByTestId('feedback-controls')).toBeInTheDocument();
    });

    it('should handle undefined callbacks gracefully', () => {
      const propsWithoutCallbacks = {
        response: mockResponse,
        children: <div>Content</div>,
      };

      // Should not throw errors
      expect(() => render(<GenerativeResponse {...propsWithoutCallbacks} />)).not.toThrow();
    });

    it('should render multiple children elements', () => {
      const multipleChildren = (
        <>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </>
      );

      render(<GenerativeResponse {...mockProps}>{multipleChildren}</GenerativeResponse>);

      expect(screen.getByText('Child 1')).toBeInTheDocument();
      expect(screen.getByText('Child 2')).toBeInTheDocument();
      expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('should handle complex nested content', () => {
      const complexContent = (
        <div>
          <table>
            <tbody>
              <tr>
                <td>Cell 1</td>
                <td>Cell 2</td>
              </tr>
            </tbody>
          </table>
          <button>Nested Button</button>
        </div>
      );

      render(<GenerativeResponse {...mockProps}>{complexContent}</GenerativeResponse>);

      expect(screen.getByText('Cell 1')).toBeInTheDocument();
      expect(screen.getByText('Cell 2')).toBeInTheDocument();
      expect(screen.getByText('Nested Button')).toBeInTheDocument();
    });
  });
});