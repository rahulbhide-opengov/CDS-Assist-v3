declare module 'virtual:git-info' {
  export interface GitWorktree {
    path: string;
    branch: string;
    commit: string;
    isMain: boolean;
    isBare: boolean;
    isLocked: boolean;
    lockReason?: string;
  }

  export interface LocalGitInfo {
    currentBranch: string;
    repoRoot: string;
    isClean: boolean;
    uncommittedChanges: number;
    untrackedFiles: number;
  }

  export const worktrees: GitWorktree[];
  export const gitInfo: LocalGitInfo;
}
