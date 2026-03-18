/**
 * GitHub React Query Hooks
 *
 * Provides hooks for fetching GitHub data with caching,
 * automatic refetching, and loading states.
 */

import { useQuery } from '@tanstack/react-query';
import {
  getBranches,
  getPullRequests,
  getRepoStatus,
  getLabels,
  isGitHubConfigured,
  type GitHubBranch,
  type GitHubPullRequest,
  type GitHubRepoStatus,
  type GitHubLabel,
} from '../services/github';

// Query keys
export const githubKeys = {
  all: ['github'] as const,
  branches: () => [...githubKeys.all, 'branches'] as const,
  pullRequests: (state?: string) => [...githubKeys.all, 'pull-requests', state] as const,
  repoStatus: () => [...githubKeys.all, 'repo-status'] as const,
  labels: () => [...githubKeys.all, 'labels'] as const,
};

// Default stale time: 30 seconds
const DEFAULT_STALE_TIME = 30 * 1000;

// Default refetch interval: 60 seconds
const DEFAULT_REFETCH_INTERVAL = 60 * 1000;

/**
 * Hook to fetch branches
 */
export function useGitHubBranches(options?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery<GitHubBranch[], Error>({
    queryKey: githubKeys.branches(),
    queryFn: getBranches,
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
    enabled: options?.enabled !== false && isGitHubConfigured(),
    retry: 2,
  });
}

/**
 * Hook to fetch pull requests
 */
export function useGitHubPullRequests(
  state: 'open' | 'closed' | 'all' = 'all',
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  return useQuery<GitHubPullRequest[], Error>({
    queryKey: githubKeys.pullRequests(state),
    queryFn: () => getPullRequests(state),
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
    enabled: options?.enabled !== false && isGitHubConfigured(),
    retry: 2,
  });
}

/**
 * Hook to fetch repository status
 */
export function useGitHubRepoStatus(options?: { enabled?: boolean; refetchInterval?: number }) {
  return useQuery<GitHubRepoStatus, Error>({
    queryKey: githubKeys.repoStatus(),
    queryFn: getRepoStatus,
    staleTime: DEFAULT_STALE_TIME,
    refetchInterval: options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
    enabled: options?.enabled !== false && isGitHubConfigured(),
    retry: 2,
  });
}

/**
 * Hook to fetch repository labels
 */
export function useGitHubLabels(options?: { enabled?: boolean }) {
  return useQuery<GitHubLabel[], Error>({
    queryKey: githubKeys.labels(),
    queryFn: getLabels,
    staleTime: 5 * 60 * 1000, // Labels don't change often, 5 min stale time
    enabled: options?.enabled !== false && isGitHubConfigured(),
    retry: 2,
  });
}

/**
 * Check if GitHub is configured
 */
export function useIsGitHubConfigured() {
  return isGitHubConfigured();
}
