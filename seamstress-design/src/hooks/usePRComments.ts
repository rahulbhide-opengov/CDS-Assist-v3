/**
 * usePRComments Hook
 *
 * React Query hooks for PR comment operations.
 * Uses the current PR context to automatically scope operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPRComments,
  createPRComment,
  deletePRComment,
  isGitHubConfigured,
} from '../services/github';
import { usePRContext } from './usePRContext';

// Query keys
export const prCommentsKeys = {
  all: ['pr-comments'] as const,
  list: (prNumber: number) => [...prCommentsKeys.all, 'list', prNumber] as const,
};

/**
 * Hook to fetch comments for the current PR
 */
export function usePRComments() {
  const prContext = usePRContext();
  const prNumber = prContext?.prNumber;

  return useQuery({
    queryKey: prNumber ? prCommentsKeys.list(prNumber) : ['pr-comments', 'disabled'],
    queryFn: () => getPRComments(prNumber!),
    enabled: !!prNumber && isGitHubConfigured(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Poll every 30 seconds for external changes
  });
}

/**
 * Hook to create a comment on the current PR
 */
export function useCreatePRComment() {
  const queryClient = useQueryClient();
  const prContext = usePRContext();
  const prNumber = prContext?.prNumber;

  return useMutation({
    mutationFn: (body: string) => {
      if (!prNumber) {
        throw new Error('No PR context available');
      }
      return createPRComment(prNumber, body);
    },
    onSuccess: async () => {
      if (prNumber) {
        // Reset clears cache and triggers refetch for active queries
        await queryClient.resetQueries({ queryKey: prCommentsKeys.list(prNumber), exact: true });
      }
    },
  });
}

/**
 * Hook to delete a comment from the current PR
 */
export function useDeletePRComment() {
  const queryClient = useQueryClient();
  const prContext = usePRContext();
  const prNumber = prContext?.prNumber;

  return useMutation({
    mutationFn: (commentId: number) => deletePRComment(commentId),
    onSuccess: async () => {
      if (prNumber) {
        // Reset clears cache and triggers refetch for active queries
        await queryClient.resetQueries({ queryKey: prCommentsKeys.list(prNumber), exact: true });
      }
    },
  });
}
