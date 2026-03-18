/**
 * PRCommentForm
 *
 * Multiline text input with submit button for creating PR comments.
 */

import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

interface PRCommentFormProps {
  onSubmit: (body: string) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export const PRCommentForm: React.FC<PRCommentFormProps> = ({
  onSubmit,
  isSubmitting,
  disabled,
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = comment.trim();
    if (trimmed && !isSubmitting) {
      onSubmit(trimmed);
      setComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Cmd/Ctrl + Enter
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={6}
        placeholder="Leave a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isSubmitting}
        size="small"
        sx={{
          mb: 1.5,
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.default',
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box
          component="span"
          sx={{ fontSize: 12, color: 'text.secondary' }}
        >
          {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
        </Box>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={!comment.trim() || isSubmitting || disabled}
          endIcon={
            isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <SendIcon fontSize="small" />
            )
          }
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </Box>
    </Box>
  );
};
