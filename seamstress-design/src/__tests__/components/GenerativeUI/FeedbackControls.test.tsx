import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { FeedbackControls } from '../../../components/GenerativeUI/FeedbackControls';

describe('FeedbackControls', () => {
  const mockProps = {
    responseId: 'test-response-123',
    onCopy: vi.fn(),
    onFeedback: vi.fn(),
    onAccept: vi.fn(),
    onReject: vi.fn(),
    showAcceptReject: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  describe('Rendering', () => {
    it('should render all feedback control buttons', () => {
      render(<FeedbackControls {...mockProps} />);

      expect(screen.getByLabelText('Copy response')).toBeInTheDocument();
      expect(screen.getByLabelText('Helpful')).toBeInTheDocument();
      expect(screen.getByLabelText('Not helpful')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Accept/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reject/i })).toBeInTheDocument();
    });

    it('should hide Accept/Reject buttons when showAcceptReject is false', () => {
      render(<FeedbackControls {...mockProps} showAcceptReject={false} />);

      expect(screen.queryByRole('button', { name: /Accept/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Reject/i })).not.toBeInTheDocument();
    });
  });

  describe('Copy Functionality', () => {
    it('should call onCopy and copy to clipboard when copy button is clicked', async () => {
      render(<FeedbackControls {...mockProps} />);

      const copyButton = screen.getByLabelText('Copy response');
      fireEvent.click(copyButton);

      expect(mockProps.onCopy).toHaveBeenCalled();
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Response test-response-123');
    });

    it('should show "Copied!" tooltip after copying', async () => {
      render(<FeedbackControls {...mockProps} />);

      const copyButton = screen.getByLabelText('Copy response');
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByLabelText('Copied!')).toBeInTheDocument();
      });
    });
  });

  describe('Thumbs Up/Down Functionality', () => {
    it('should toggle thumbs up state when clicked', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsUpButton = screen.getByLabelText('Helpful');

      // Click thumbs up
      fireEvent.click(thumbsUpButton);

      // Should open feedback dialog
      expect(screen.getByText('What was helpful?')).toBeInTheDocument();
    });

    it('should toggle thumbs down state when clicked', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsDownButton = screen.getByLabelText('Not helpful');

      // Click thumbs down
      fireEvent.click(thumbsDownButton);

      // Should open feedback dialog
      expect(screen.getByText('What could be improved?')).toBeInTheDocument();
    });

    it('should deselect thumbs up when thumbs down is clicked', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsUpButton = screen.getByLabelText('Helpful');
      const thumbsDownButton = screen.getByLabelText('Not helpful');

      // Click thumbs up first
      fireEvent.click(thumbsUpButton);

      // Close dialog
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      // Click thumbs down
      fireEvent.click(thumbsDownButton);

      // Should show thumbs down dialog
      expect(screen.getByText('What could be improved?')).toBeInTheDocument();
    });
  });

  describe('Feedback Dialog', () => {
    it('should display feedback tags in the dialog', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsUpButton = screen.getByLabelText('Helpful');
      fireEvent.click(thumbsUpButton);

      expect(screen.getByText('Clarity')).toBeInTheDocument();
      expect(screen.getByText('Usefulness')).toBeInTheDocument();
      expect(screen.getByText('Accuracy')).toBeInTheDocument();
      expect(screen.getByText('Other')).toBeInTheDocument();
    });

    it('should allow selecting and deselecting tags', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsUpButton = screen.getByLabelText('Helpful');
      fireEvent.click(thumbsUpButton);

      const clarityTag = screen.getByText('Clarity');
      const usefulnessTag = screen.getByText('Usefulness');

      // Click to select
      fireEvent.click(clarityTag);
      fireEvent.click(usefulnessTag);

      // Tags should be selected (will have different styling)
      expect(clarityTag.closest('.MuiChip-root')).toHaveClass('MuiChip-filled');
      expect(usefulnessTag.closest('.MuiChip-root')).toHaveClass('MuiChip-filled');

      // Click to deselect
      fireEvent.click(clarityTag);
      expect(clarityTag.closest('.MuiChip-root')).toHaveClass('MuiChip-outlined');
    });

    it('should allow entering feedback comment', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsUpButton = screen.getByLabelText('Helpful');
      fireEvent.click(thumbsUpButton);

      const textField = screen.getByPlaceholderText('Additional comments (optional)');
      fireEvent.change(textField, { target: { value: 'This was very helpful!' } });

      expect(textField).toHaveValue('This was very helpful!');
    });

    it('should submit feedback with selected tags and comment', () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsUpButton = screen.getByLabelText('Helpful');
      fireEvent.click(thumbsUpButton);

      // Select tags
      const clarityTag = screen.getByText('Clarity');
      fireEvent.click(clarityTag);

      // Add comment
      const textField = screen.getByPlaceholderText('Additional comments (optional)');
      fireEvent.change(textField, { target: { value: 'Great response!' } });

      // Submit
      const submitButton = screen.getByRole('button', { name: /Submit Feedback/i });
      fireEvent.click(submitButton);

      expect(mockProps.onFeedback).toHaveBeenCalledWith(
        'up',
        'Great response!',
        ['Clarity']
      );
    });

    it('should close dialog when Cancel is clicked', async () => {
      render(<FeedbackControls {...mockProps} />);

      const thumbsDownButton = screen.getByLabelText('Not helpful');
      fireEvent.click(thumbsDownButton);

      expect(screen.getByText('What could be improved?')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText('What could be improved?')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accept/Reject Functionality', () => {
    it('should call onAccept when Accept button is clicked', () => {
      render(<FeedbackControls {...mockProps} />);

      const acceptButton = screen.getByRole('button', { name: /Accept/i });
      fireEvent.click(acceptButton);

      expect(mockProps.onAccept).toHaveBeenCalled();
    });

    it('should call onReject when Reject button is clicked', () => {
      render(<FeedbackControls {...mockProps} />);

      const rejectButton = screen.getByRole('button', { name: /Reject/i });
      fireEvent.click(rejectButton);

      expect(mockProps.onReject).toHaveBeenCalledWith();
    });
  });
});