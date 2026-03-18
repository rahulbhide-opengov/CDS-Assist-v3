/**
 * GitHub Service
 *
 * Provides functions to interact with the GitHub API for fetching
 * repository data including branches, pull requests, and status.
 *
 * Supports both environment token (VITE_GITHUB_TOKEN) and user-provided tokens
 * stored in localStorage for deployed previews.
 */

import { Octokit } from '@octokit/rest';
import { cdsColors } from '../theme/cds';

// Environment configuration
const ENV_GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER || 'OpenGov';
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || 'cds-assists';

// LocalStorage key for user-provided token
const USER_TOKEN_KEY = 'github_user_token';

// Check if we should use mock data (explicitly enabled only)
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_GITHUB === 'true';

// Shared log config to suppress expected errors
const octokitLogConfig = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
};

/**
 * Get the current GitHub token (env or user-provided)
 */
function getGitHubToken(): string | null {
  if (ENV_GITHUB_TOKEN) return ENV_GITHUB_TOKEN;
  if (typeof window !== 'undefined') {
    return localStorage.getItem(USER_TOKEN_KEY);
  }
  return null;
}

/**
 * Create an Octokit client with the current token
 */
function createOctokitClient(): Octokit {
  return new Octokit({
    auth: getGitHubToken() || undefined,
    log: octokitLogConfig,
  });
}

// Primary client - recreated when token changes
let octokit = createOctokitClient();

/**
 * Save user-provided GitHub token
 */
export function setUserGitHubToken(token: string): void {
  localStorage.setItem(USER_TOKEN_KEY, token);
  octokit = createOctokitClient();
}

/**
 * Clear user-provided GitHub token
 */
export function clearUserGitHubToken(): void {
  localStorage.removeItem(USER_TOKEN_KEY);
  octokit = createOctokitClient();
}

/**
 * Check if user has provided a token
 */
export function hasUserGitHubToken(): boolean {
  return !!localStorage.getItem(USER_TOKEN_KEY);
}

/**
 * Check if we have any auth (env or user token)
 */
export function hasGitHubAuth(): boolean {
  return !!getGitHubToken();
}

// Types
export type BranchStatus = 'clean' | 'modified' | 'ahead' | 'behind' | 'diverged' | 'unknown';

export interface GitHubBranch {
  name: string;
  sha: string;
  protected: boolean;
  isDefault: boolean;
  isCurrent: boolean;
  status: BranchStatus;
  aheadBy?: number;
  behindBy?: number;
  lastCommitDate: string;
  lastCommitMessage: string;
  lastCommitAuthor: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  status: 'open' | 'merged' | 'closed' | 'draft';
  reviewStatus: 'approved' | 'changes_requested' | 'pending' | 'review_required';
  author: string;
  authorAvatar: string;
  sourceBranch: string;
  targetBranch: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  reviewers: Array<{ name: string; avatar: string }>;
  labels: Array<{ name: string; color: string }>;
  checksStatus: 'passing' | 'failing' | 'pending';
  url: string;
  additions: number;
  deletions: number;
  changedFiles: number;
}

export interface GitHubRepoStatus {
  currentBranch: string;
  status: BranchStatus;
  isClean: boolean;
  repoName: string;
  remoteUrl: string;
  defaultBranch: string;
  openPRCount: number;
  totalBranches: number;
}

export interface GitHubLabel {
  name: string;
  color: string;
  description?: string;
}

// ============ MOCK DATA ============

const MOCK_BRANCHES: GitHubBranch[] = [
  {
    name: 'main',
    sha: 'abc123def456',
    protected: true,
    isDefault: true,
    isCurrent: false,
    status: 'clean',
    lastCommitDate: '2 hours ago',
    lastCommitMessage: 'feat: Add comprehensive routing',
    lastCommitAuthor: 'developer',
  },
  {
    name: 'GC-PublicPortalDemo',
    sha: 'def456abc789',
    protected: false,
    isDefault: false,
    isCurrent: true,
    status: 'ahead',
    aheadBy: 5,
    lastCommitDate: '30 minutes ago',
    lastCommitMessage: 'fix: Resolve routing issues',
    lastCommitAuthor: 'developer',
  },
  {
    name: 'feature/agent-studio',
    sha: 'ghi789jkl012',
    protected: false,
    isDefault: false,
    isCurrent: false,
    status: 'diverged',
    aheadBy: 3,
    behindBy: 2,
    lastCommitDate: '1 day ago',
    lastCommitMessage: 'feat: Enhance agent capabilities',
    lastCommitAuthor: 'developer',
  },
  {
    name: 'bugfix/routing',
    sha: 'mno345pqr678',
    protected: false,
    isDefault: false,
    isCurrent: false,
    status: 'behind',
    behindBy: 8,
    lastCommitDate: '3 days ago',
    lastCommitMessage: 'fix: Navigation issues',
    lastCommitAuthor: 'developer',
  },
];

const MOCK_PULL_REQUESTS: GitHubPullRequest[] = [
  {
    id: 1,
    number: 42,
    title: 'feat: Add unified portal routing',
    status: 'open',
    reviewStatus: 'pending',
    author: 'developer',
    authorAvatar: '',
    sourceBranch: 'GC-PublicPortalDemo',
    targetBranch: 'main',
    createdAt: '2 days ago',
    updatedAt: '1 hour ago',
    comments: 3,
    reviewers: [],
    labels: [{ name: 'enhancement', color: cdsColors.blue600 }],
    checksStatus: 'passing',
    url: '#',
    additions: 250,
    deletions: 50,
    changedFiles: 12,
  },
  {
    id: 2,
    number: 41,
    title: 'fix: Resolve component imports',
    status: 'merged',
    reviewStatus: 'approved',
    author: 'developer',
    authorAvatar: '',
    sourceBranch: 'bugfix/imports',
    targetBranch: 'main',
    createdAt: '5 days ago',
    updatedAt: '3 days ago',
    comments: 5,
    reviewers: [],
    labels: [{ name: 'bug', color: cdsColors.red600 }],
    checksStatus: 'passing',
    url: '#',
    additions: 45,
    deletions: 30,
    changedFiles: 4,
  },
];

const MOCK_REPO_STATUS: GitHubRepoStatus = {
  currentBranch: 'GC-PublicPortalDemo',
  status: 'ahead',
  isClean: true,
  repoName: 'cds-assists',
  remoteUrl: 'https://github.com/OpenGov/cds-assists',
  defaultBranch: 'main',
  openPRCount: 1,
  totalBranches: 4,
};

/**
 * Get relative time string from date
 */
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

/**
 * Fetch all branches from the repository
 */
export async function getBranches(): Promise<GitHubBranch[]> {
  // Return mock data if no token configured or mock mode enabled
  if (USE_MOCK_DATA) {
    return MOCK_BRANCHES;
  }

  try {
    const [branchesResponse, repoResponse] = await Promise.all([
      octokit.repos.listBranches({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        per_page: 100,
      }),
      octokit.repos.get({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
      }),
    ]);

  const defaultBranch = repoResponse.data.default_branch;

  // Get detailed info for each branch
  const branchesWithDetails = await Promise.all(
    branchesResponse.data.map(async (branch) => {
      try {
        // Get the latest commit for the branch
        const commitResponse = await octokit.repos.getCommit({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          ref: branch.commit.sha,
        });

        // Compare with default branch to get ahead/behind
        let aheadBy = 0;
        let behindBy = 0;
        let status: BranchStatus = 'clean';

        if (branch.name !== defaultBranch) {
          try {
            const compareResponse = await octokit.repos.compareCommits({
              owner: GITHUB_OWNER,
              repo: GITHUB_REPO,
              base: defaultBranch,
              head: branch.name,
            });
            aheadBy = compareResponse.data.ahead_by;
            behindBy = compareResponse.data.behind_by;

            if (aheadBy > 0 && behindBy > 0) {
              status = 'diverged';
            } else if (aheadBy > 0) {
              status = 'ahead';
            } else if (behindBy > 0) {
              status = 'behind';
            } else {
              status = 'clean';
            }
          } catch {
            // Branch may have been deleted or comparison failed - mark as unknown
            status = 'unknown';
          }
        }

        const commit = commitResponse.data.commit;
        const commitDate = new Date(commit.committer?.date || commit.author?.date || '');

        return {
          name: branch.name,
          sha: branch.commit.sha,
          protected: branch.protected,
          isDefault: branch.name === defaultBranch,
          isCurrent: false, // Will be determined client-side or via different mechanism
          status,
          aheadBy: aheadBy > 0 ? aheadBy : undefined,
          behindBy: behindBy > 0 ? behindBy : undefined,
          lastCommitDate: getRelativeTime(commitDate),
          lastCommitMessage: commit.message.split('\n')[0], // First line only
          lastCommitAuthor: commit.author?.name || 'Unknown',
        };
      } catch (error) {
        console.error(`Error fetching details for branch ${branch.name}:`, error);
        return {
          name: branch.name,
          sha: branch.commit.sha,
          protected: branch.protected,
          isDefault: branch.name === defaultBranch,
          isCurrent: false,
          status: 'unknown' as BranchStatus,
          lastCommitDate: 'Unknown',
          lastCommitMessage: '',
          lastCommitAuthor: 'Unknown',
        };
      }
    })
  );

    // Sort: default branch first, then by last commit date (most recent first)
    return branchesWithDetails.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return 0; // Keep API order which is typically alphabetical
    });
  } catch (error) {
    // API failed (404, auth error, etc.) - fall back to mock data
    console.warn('GitHub API unavailable, using mock branch data');
    return MOCK_BRANCHES;
  }
}

/**
 * Fetch all pull requests from the repository
 */
export async function getPullRequests(state: 'open' | 'closed' | 'all' = 'all'): Promise<GitHubPullRequest[]> {
  // Return mock data if explicitly enabled
  if (USE_MOCK_DATA) {
    return MOCK_PULL_REQUESTS.filter(pr => state === 'all' || pr.status === state);
  }

  const prsResponse = await octokit.pulls.list({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    state,
    per_page: 100,
    sort: 'updated',
    direction: 'desc',
  });

  const prsWithDetails = await Promise.all(
    prsResponse.data.map(async (pr) => {
      // Get reviews to determine review status
      let reviewStatus: GitHubPullRequest['reviewStatus'] = 'pending';
      let checksStatus: GitHubPullRequest['checksStatus'] = 'pending';

      try {
        const reviewsResponse = await octokit.pulls.listReviews({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          pull_number: pr.number,
        });

        const reviews = reviewsResponse.data;
        const latestReviews = new Map<string, string>();

        // Get the latest review from each reviewer
        reviews.forEach((review) => {
          if (review.user && review.state !== 'COMMENTED') {
            latestReviews.set(review.user.login, review.state);
          }
        });

        const reviewStates = Array.from(latestReviews.values());
        if (reviewStates.includes('CHANGES_REQUESTED')) {
          reviewStatus = 'changes_requested';
        } else if (reviewStates.includes('APPROVED')) {
          reviewStatus = 'approved';
        } else if (reviewStates.length > 0) {
          reviewStatus = 'pending';
        } else {
          reviewStatus = pr.requested_reviewers && pr.requested_reviewers.length > 0
            ? 'review_required'
            : 'pending';
        }
      } catch (error) {
        console.error(`Error fetching reviews for PR #${pr.number}:`, error);
      }

      // Get check runs status
      try {
        const checksResponse = await octokit.checks.listForRef({
          owner: GITHUB_OWNER,
          repo: GITHUB_REPO,
          ref: pr.head.sha,
        });

        const checkRuns = checksResponse.data.check_runs;
        if (checkRuns.length === 0) {
          checksStatus = 'pending';
        } else {
          const hasFailure = checkRuns.some(
            (check) => check.conclusion === 'failure' || check.conclusion === 'cancelled'
          );
          const allComplete = checkRuns.every((check) => check.status === 'completed');

          if (hasFailure) {
            checksStatus = 'failing';
          } else if (allComplete) {
            checksStatus = 'passing';
          } else {
            checksStatus = 'pending';
          }
        }
      } catch (error) {
        console.error(`Error fetching checks for PR #${pr.number}:`, error);
      }

      // Determine PR status
      let status: GitHubPullRequest['status'];
      if (pr.draft) {
        status = 'draft';
      } else if (pr.merged_at) {
        status = 'merged';
      } else if (pr.state === 'closed') {
        status = 'closed';
      } else {
        status = 'open';
      }

      // Get reviewers
      const reviewers = (pr.requested_reviewers || []).map((reviewer: any) => ({
        name: reviewer.login,
        avatar: reviewer.avatar_url,
      }));

      return {
        id: pr.id,
        number: pr.number,
        title: pr.title,
        status,
        reviewStatus,
        author: pr.user?.login || 'Unknown',
        authorAvatar: pr.user?.avatar_url || '',
        sourceBranch: pr.head.ref,
        targetBranch: pr.base.ref,
        createdAt: getRelativeTime(new Date(pr.created_at)),
        updatedAt: getRelativeTime(new Date(pr.updated_at)),
        comments: pr.comments + (pr.review_comments || 0),
        reviewers,
        labels: pr.labels.map((label: any) => ({
          name: label.name,
          color: `#${label.color}`,
        })),
        checksStatus,
        url: pr.html_url,
        additions: pr.additions || 0,
        deletions: pr.deletions || 0,
        changedFiles: pr.changed_files || 0,
      };
    })
  );

  return prsWithDetails;
}

/**
 * Get repository status overview
 */
export async function getRepoStatus(): Promise<GitHubRepoStatus> {
  // Return mock data if no token configured or mock mode enabled
  if (USE_MOCK_DATA) {
    return MOCK_REPO_STATUS;
  }

  try {
    const [repoResponse, branchesResponse, prsResponse] = await Promise.all([
    octokit.repos.get({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
    }),
    octokit.repos.listBranches({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      per_page: 100,
    }),
    octokit.pulls.list({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      state: 'open',
      per_page: 1,
    }),
  ]);

  // Get open PR count
  const openPRCount = prsResponse.headers['x-total-count']
    ? parseInt(prsResponse.headers['x-total-count'] as string, 10)
    : prsResponse.data.length;

    return {
      currentBranch: repoResponse.data.default_branch,
      status: 'clean',
      isClean: true,
      repoName: repoResponse.data.full_name,
      remoteUrl: repoResponse.data.html_url,
      defaultBranch: repoResponse.data.default_branch,
      openPRCount,
      totalBranches: branchesResponse.data.length,
    };
  } catch (error) {
    // API failed - fall back to mock data
    console.warn('GitHub API unavailable, using mock repo status');
    return MOCK_REPO_STATUS;
  }
}

/**
 * Get repository labels
 */
export async function getLabels(): Promise<GitHubLabel[]> {
  // Return mock data if no token configured or mock mode enabled
  if (USE_MOCK_DATA) {
    return [
      { name: 'bug', color: cdsColors.red600, description: 'Something isn\'t working' },
      { name: 'enhancement', color: cdsColors.blue600, description: 'New feature or request' },
      { name: 'documentation', color: cdsColors.blue600, description: 'Improvements or additions to documentation' },
    ];
  }

  try {
    const response = await octokit.issues.listLabelsForRepo({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      per_page: 100,
    });

    return response.data.map((label) => ({
      name: label.name,
      color: `#${label.color}`,
      description: label.description || undefined,
    }));
  } catch (error) {
    console.warn('GitHub API unavailable, using mock labels');
    return [
      { name: 'bug', color: cdsColors.red600, description: 'Something isn\'t working' },
      { name: 'enhancement', color: cdsColors.blue600, description: 'New feature or request' },
      { name: 'documentation', color: cdsColors.blue600, description: 'Improvements or additions to documentation' },
    ];
  }
}

/**
 * Check if GitHub API is available (always true for public repos, reads work without auth)
 */
export function isGitHubConfigured(): boolean {
  return !USE_MOCK_DATA;
}

/**
 * Check if GitHub write operations are available (requires token)
 */
export function canWriteToGitHub(): boolean {
  return hasGitHubAuth() && !USE_MOCK_DATA;
}

/**
 * Get GitHub configuration info
 */
export function getGitHubConfig() {
  return {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    isConfigured: isGitHubConfigured(),
  };
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}

/**
 * Validate a GitHub token and return user info
 */
export async function validateGitHubToken(token: string): Promise<GitHubUser> {
  const testClient = new Octokit({
    auth: token,
    log: octokitLogConfig,
  });

  const { data } = await testClient.users.getAuthenticated();
  return {
    login: data.login,
    avatar_url: data.avatar_url,
    name: data.name,
  };
}

/**
 * Get the currently authenticated user (if any)
 */
export async function getCurrentGitHubUser(): Promise<GitHubUser | null> {
  const token = getGitHubToken();
  if (!token) return null;

  try {
    return await validateGitHubToken(token);
  } catch {
    return null;
  }
}

// ============ PR COMMENTS ============

export interface PRComment {
  id: number;
  body: string;
  user: { login: string; avatar_url: string; type: string };
  created_at: string;
  html_url: string;
}

const MOCK_PR_COMMENTS: PRComment[] = [
  {
    id: 1,
    body: 'Looking good! Just a few minor suggestions.',
    user: { login: 'reviewer1', avatar_url: '', type: 'User' },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    html_url: '#',
  },
  {
    id: 2,
    body: 'The new component styling matches the design specs nicely.',
    user: { login: 'designer', avatar_url: '', type: 'User' },
    created_at: new Date(Date.now() - 1800000).toISOString(),
    html_url: '#',
  },
];

/**
 * Get comments for a pull request
 * Uses unauthenticated requests for public repos (works without token)
 */
export async function getPRComments(prNumber: number): Promise<PRComment[]> {
  if (USE_MOCK_DATA) {
    return MOCK_PR_COMMENTS;
  }

  // Use unauthenticated client - works for public repos without token
  const response = await octokit.issues.listComments({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    issue_number: prNumber,
    per_page: 100,
  });

  // Filter out bot comments and map to PRComment interface
  return response.data
    .filter((comment) => {
      const userType = comment.user?.type || 'User';
      const login = comment.user?.login || '';
      // Exclude bots: type is 'Bot' or login ends with '[bot]'
      return userType !== 'Bot' && !login.endsWith('[bot]');
    })
    .map((comment) => ({
      id: comment.id,
      body: comment.body || '',
      user: {
        login: comment.user?.login || 'Unknown',
        avatar_url: comment.user?.avatar_url || '',
        type: comment.user?.type || 'User',
      },
      created_at: comment.created_at,
      html_url: comment.html_url,
    }));
}

/**
 * Create a comment on a pull request
 * Requires authentication (VITE_GITHUB_TOKEN must be set)
 */
export async function createPRComment(prNumber: number, body: string): Promise<PRComment> {
  if (USE_MOCK_DATA) {
    const newComment: PRComment = {
      id: Date.now(),
      body,
      user: { login: 'current-user', avatar_url: '', type: 'User' },
      created_at: new Date().toISOString(),
      html_url: '#',
    };
    MOCK_PR_COMMENTS.push(newComment);
    return newComment;
  }

  if (!hasGitHubAuth()) {
    throw new Error('GitHub token required to create comments. Please sign in.');
  }

  const response = await octokit.issues.createComment({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    issue_number: prNumber,
    body,
  });

  return {
    id: response.data.id,
    body: response.data.body || '',
    user: {
      login: response.data.user?.login || 'Unknown',
      avatar_url: response.data.user?.avatar_url || '',
      type: response.data.user?.type || 'User',
    },
    created_at: response.data.created_at,
    html_url: response.data.html_url,
  };
}

/**
 * Delete a comment from a pull request
 * Requires authentication (VITE_GITHUB_TOKEN must be set)
 */
export async function deletePRComment(commentId: number): Promise<void> {
  if (USE_MOCK_DATA) {
    const index = MOCK_PR_COMMENTS.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      MOCK_PR_COMMENTS.splice(index, 1);
    }
    return;
  }

  if (!hasGitHubAuth()) {
    throw new Error('GitHub token required to delete comments. Please sign in.');
  }

  await octokit.issues.deleteComment({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    comment_id: commentId,
  });
}
