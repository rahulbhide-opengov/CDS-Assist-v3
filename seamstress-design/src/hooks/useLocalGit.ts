/**
 * useLocalGit Hook
 *
 * Provides local git repository information that can't be obtained from GitHub API,
 * such as current branch and worktrees.
 *
 * Data is injected at build/dev time via the viteGitPlugin.
 */

import { useQuery } from '@tanstack/react-query';
import { gitInfo, worktrees as gitWorktrees } from 'virtual:git-info';

export interface LocalGitInfo {
  currentBranch: string;
  repoRoot: string;
  isClean: boolean;
  uncommittedChanges: number;
  untrackedFiles: number;
}

export interface GitWorktree {
  path: string;
  branch: string;
  commit: string;
  isMain: boolean;
  isBare: boolean;
  isLocked: boolean;
  lockReason?: string;
  lastAccessed?: string;
}

/**
 * Get local git information from the virtual module
 */
async function getLocalGitInfo(): Promise<LocalGitInfo> {
  return gitInfo;
}

/**
 * Get git worktrees from the virtual module
 */
async function getWorktrees(): Promise<GitWorktree[]> {
  return gitWorktrees;
}

/**
 * Hook to get local git information
 */
export function useLocalGitInfo(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['localGit', 'info'],
    queryFn: getLocalGitInfo,
    enabled: options?.enabled ?? true,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to get git worktrees
 */
export function useGitWorktrees(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['localGit', 'worktrees'],
    queryFn: getWorktrees,
    enabled: options?.enabled ?? true,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}

export const localGitKeys = {
  all: ['localGit'] as const,
  info: () => [...localGitKeys.all, 'info'] as const,
  worktrees: () => [...localGitKeys.all, 'worktrees'] as const,
};
