/**
 * PRCommentsPanel
 *
 * Slide-out drawer panel containing the header, comment thread, and form.
 */

import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Link,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { PRCommentThread } from './PRCommentThread';
import { PRCommentForm } from './PRCommentForm';
import { GitHubSignIn } from './GitHubSignIn';
import type { PRComment, GitHubUser } from '../../services/github';
import type { PRContext } from '../../hooks/usePRContext';

interface PRCommentsPanelProps {
  open: boolean;
  onClose: () => void;
  prContext: PRContext;
  comments: PRComment[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  deletingCommentId?: number | null;
  onSubmitComment?: (body: string) => void;
  onDeleteComment?: (commentId: number) => void;
  canWrite?: boolean;
  currentUser?: GitHubUser | null;
  onAuthChange?: () => void;
  needsAuth?: boolean;
}

const PANEL_WIDTH = 400;

export const PRCommentsPanel: React.FC<PRCommentsPanelProps> = ({
  open,
  onClose,
  prContext,
  comments,
  isLoading,
  isSubmitting,
  deletingCommentId,
  onSubmitComment,
  onDeleteComment,
  canWrite = true,
  currentUser,
  onAuthChange,
  needsAuth = false,
}) => {
  // Show sign-in form if auth is needed or if no auth and no comments loaded
  const showSignIn = needsAuth || (!canWrite && comments.length === 0 && !isLoading);
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: PANEL_WIDTH,
            maxWidth: '100vw',
            bgcolor: 'background.secondary',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h6" noWrap>
              {prContext.prNumber > 0 ? `PR #${prContext.prNumber}` : 'PR Comments'}
            </Typography>
            {prContext.prNumber > 0 && (
              <Chip
                label={prContext.source === 'ee' ? 'EE Deploy' : 'Local'}
                size="small"
                color={prContext.source === 'ee' ? 'primary' : 'default'}
                variant="outlined"
              />
            )}
          </Box>
          {prContext.prTitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              title={prContext.prTitle}
            >
              {prContext.prTitle}
            </Typography>
          )}
          {prContext.prUrl && prContext.prUrl !== '#' && (
            <Tooltip title="View on GitHub">
              <Link
                href={prContext.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  fontSize: 12,
                  mt: 0.5,
                }}
              >
                <GitHubIcon sx={{ fontSize: 14 }} />
                View on GitHub
              </Link>
            </Tooltip>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Show sign-in form or comment thread */}
      {showSignIn ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <GitHubSignIn
            currentUser={currentUser}
            onSignIn={onAuthChange || (() => {})}
          />
        </Box>
      ) : (
        <>
          {/* Comment Thread */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <PRCommentThread
              comments={comments}
              isLoading={isLoading}
              deletingCommentId={deletingCommentId}
              onDeleteComment={canWrite ? onDeleteComment : undefined}
            />
          </Box>

          {/* Comment Form - only show if write access is available */}
          {canWrite && onSubmitComment && (
            <PRCommentForm
              onSubmit={onSubmitComment}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}
    </Drawer>
  );
};
