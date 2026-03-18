/**
 * usePRContext Hook
 *
 * Determines the current PR context from:
 * 1. EE deployment hostname: seamstress-design-pr-{N}.development.opengov.zone
 * 2. Local development: matches current branch to open PRs via sourceBranch
 *
 * Returns null if no PR context can be determined.
 */

import { useMemo } from 'react';
import { useLocalGitInfo } from './useLocalGit';
import { useGitHubPullRequests } from './useGitHub';

export interface PRContext {
  prNumber: number;
  source: 'ee' | 'local';
  prTitle?: string;
  prUrl?: string;
}

export interface PendingPRContext {
  source: 'pending';
  branch: string;
}

/**
 * Parse PR number from EE deployment hostname
 * Format: seamstress-design-pr-{N}.development.opengov.zone
 */
function parseEEHostname(): number | null {
  if (typeof window === 'undefined') return null;

  const match = window.location.hostname.match(
    /^seamstress-design-pr-(\d+)\.development\.opengov\.zone$/
  );

  if (match) {
    return parseInt(match[1], 10);
  }

  return null;
}

/**
 * Hook to get current PR context
 * Returns PRContext if PR is detected, PendingPRContext if branch exists but PR not yet fetched, or null
 */
export function usePRContext(): PRContext | PendingPRContext | null {
  const { data: gitInfo } = useLocalGitInfo();
  const { data: pullRequests, isError: prFetchError } = useGitHubPullRequests('open');

  return useMemo(() => {
    // Check EE deployment first (most specific)
    const eePRNumber = parseEEHostname();
    if (eePRNumber) {
      const matchedPR = pullRequests?.find((pr) => pr.number === eePRNumber);
      return {
        prNumber: eePRNumber,
        source: 'ee' as const,
        prTitle: matchedPR?.title,
        prUrl: matchedPR?.url,
      };
    }

    // Check local branch against open PRs
    if (gitInfo?.currentBranch && pullRequests) {
      const matchedPR = pullRequests.find(
        (pr) => pr.sourceBranch === gitInfo.currentBranch
      );

      if (matchedPR) {
        return {
          prNumber: matchedPR.number,
          source: 'local' as const,
          prTitle: matchedPR.title,
          prUrl: matchedPR.url,
        };
      }
    }

    // If we have branch info but PR fetch failed (likely auth issue), return pending state
    if (gitInfo?.currentBranch && (prFetchError || !pullRequests)) {
      return {
        source: 'pending' as const,
        branch: gitInfo.currentBranch,
      };
    }

    return null;
  }, [gitInfo?.currentBranch, pullRequests, prFetchError]);
}

/**
 * Check if we're in a PR context (EE or local with open PR)
 */
export function useHasPRContext(): boolean {
  const prContext = usePRContext();
  return prContext !== null;
}
