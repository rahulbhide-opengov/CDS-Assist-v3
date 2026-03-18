/**
 * PRCommentsContainer
 *
 * Root container for PR comments feature. Only renders when a PR context is detected.
 * Manages state for the FAB and panel, and coordinates data fetching/mutations.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePRContext, type PRContext } from '../../hooks/usePRContext';
import { usePRComments, useCreatePRComment, useDeletePRComment } from '../../hooks/usePRComments';
import {
  canWriteToGitHub,
  getCurrentGitHubUser,
  type GitHubUser,
} from '../../services/github';
import { PRCommentsFAB } from './PRCommentsFAB';
import { PRCommentsPanel } from './PRCommentsPanel';

export const PRCommentsContainer: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);
  const [authVersion, setAuthVersion] = useState(0);

  const queryClient = useQueryClient();

  // Get PR context (may be full context, pending, or null)
  const prContextResult = usePRContext();

  // Check if we have a full PR context vs pending
  const isPending = prContextResult?.source === 'pending';
  const prContext = isPending ? null : (prContextResult as PRContext | null);

  // Fetch comments (only if we have a full PR context)
  const { data: comments = [], isLoading, refetch } = usePRComments();

  // Fetch current user on mount and when auth changes
  useEffect(() => {
    getCurrentGitHubUser().then(setCurrentUser);
  }, [authVersion]);

  // Refetch when panel opens to get latest comments
  useEffect(() => {
    if (isPanelOpen && prContext) {
      refetch();
    }
  }, [isPanelOpen, prContext, refetch]);

  // Handle auth changes (sign in/out)
  const handleAuthChange = useCallback(() => {
    setAuthVersion((v) => v + 1);
    // Invalidate all GitHub queries to refetch with new auth
    queryClient.invalidateQueries({ queryKey: ['github'] });
    queryClient.invalidateQueries({ queryKey: ['pr-comments'] });
  }, [queryClient]);

  // Mutations
  const createComment = useCreatePRComment();
  const deleteComment = useDeletePRComment();

  // Don't render if no PR context at all (not even pending)
  if (!prContextResult) {
    return null;
  }

  const handleTogglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleSubmitComment = (body: string) => {
    // Append current page path to comment for context (relative so it works in any environment)
    const pagePath = window.location.pathname + window.location.search + window.location.hash;
    const commentWithPath = `${body}\n\n---\n${pagePath}`;
    createComment.mutate(commentWithPath);
  };

  const handleDeleteComment = (commentId: number) => {
    setDeletingCommentId(commentId);
    deleteComment.mutate(commentId, {
      onSettled: () => {
        setDeletingCommentId(null);
      },
    });
  };

  // For pending state, create a minimal context for display
  const displayContext: PRContext = prContext || {
    prNumber: 0,
    source: 'local',
    prTitle: isPending ? `Branch: ${prContextResult.branch}` : undefined,
  };

  return (
    <>
      <PRCommentsFAB
        commentCount={comments.length}
        onClick={handleTogglePanel}
        isOpen={isPanelOpen}
      />
      <PRCommentsPanel
        open={isPanelOpen}
        onClose={handleClosePanel}
        prContext={displayContext}
        comments={comments}
        isLoading={isLoading}
        isSubmitting={createComment.isPending}
        deletingCommentId={deletingCommentId}
        onSubmitComment={prContext ? handleSubmitComment : undefined}
        onDeleteComment={prContext ? handleDeleteComment : undefined}
        canWrite={canWriteToGitHub()}
        currentUser={currentUser}
        onAuthChange={handleAuthChange}
        needsAuth={isPending}
      />
    </>
  );
};
