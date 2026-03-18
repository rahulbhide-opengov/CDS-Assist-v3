/**
 * PRCommentThread
 *
 * Scrollable list of PR comments with loading and empty states.
 */

import React, { useRef, useEffect } from 'react';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import { PRCommentItem } from './PRCommentItem';
import type { PRComment } from '../../services/github';

interface PRCommentThreadProps {
  comments: PRComment[];
  isLoading?: boolean;
  deletingCommentId?: number | null;
  onDeleteComment?: (commentId: number) => void;
}

export const PRCommentThread: React.FC<PRCommentThreadProps> = ({
  comments,
  isLoading,
  deletingCommentId,
  onDeleteComment,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new comments are added
  useEffect(() => {
    if (scrollRef.current && comments.length > 0) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments.length]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          py: 4,
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          py: 4,
          color: 'text.secondary',
        }}
      >
        <Typography variant="body2">No comments yet</Typography>
        <Typography variant="caption">
          Be the first to leave feedback on this PR
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      ref={scrollRef}
      sx={{
        flex: 1,
        overflow: 'auto',
        '& > *:not(:last-child)': {
          borderBottom: 1,
          borderColor: 'divider',
        },
      }}
    >
      {comments.map((comment) => (
        <PRCommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDeleteComment}
          isDeleting={deletingCommentId === comment.id}
        />
      ))}
    </Box>
  );
};
