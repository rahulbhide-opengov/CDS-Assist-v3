/**
 * Vite Plugin for Git Information
 *
 * Runs git commands at build/dev time and exposes the data
 * to the app via virtual modules.
 */

import { execSync } from 'child_process';
import type { Plugin } from 'vite';

interface GitWorktree {
  path: string;
  branch: string;
  commit: string;
  isMain: boolean;
  isBare: boolean;
  isLocked: boolean;
  lockReason?: string;
}

interface LocalGitInfo {
  currentBranch: string;
  repoRoot: string;
  isClean: boolean;
  uncommittedChanges: number;
  untrackedFiles: number;
}

function runGitCommand(command: string): string {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function parseWorktreeList(): GitWorktree[] {
  const output = runGitCommand('git worktree list --porcelain');
  if (!output) return [];

  const worktrees: GitWorktree[] = [];
  const blocks = output.split('\n\n').filter(Boolean);

  for (const block of blocks) {
    const lines = block.split('\n');
    let path = '';
    let commit = '';
    let branch = '';
    let isBare = false;
    let isLocked = false;
    let lockReason: string | undefined;

    for (const line of lines) {
      if (line.startsWith('worktree ')) {
        path = line.substring(9);
      } else if (line.startsWith('HEAD ')) {
        commit = line.substring(5, 12); // Short SHA
      } else if (line.startsWith('branch ')) {
        // refs/heads/branch-name -> branch-name
        branch = line.substring(7).replace('refs/heads/', '');
      } else if (line === 'bare') {
        isBare = true;
      } else if (line === 'locked') {
        isLocked = true;
      } else if (line.startsWith('locked ')) {
        isLocked = true;
        lockReason = line.substring(7);
      } else if (line === 'detached') {
        branch = `detached @ ${commit}`;
      }
    }

    if (path) {
      // Determine if this is the main worktree (the original clone location)
      const isMain = blocks.indexOf(block) === 0;

      worktrees.push({
        path,
        branch: branch || 'detached',
        commit,
        isMain,
        isBare,
        isLocked,
        lockReason,
      });
    }
  }

  return worktrees;
}

function getLocalGitInfo(): LocalGitInfo {
  // Try git command first, then fall back to environment variable (set during CI builds)
  const currentBranch =
    runGitCommand('git branch --show-current') ||
    process.env.VITE_GIT_BRANCH ||
    'unknown';
  const repoRoot = runGitCommand('git rev-parse --show-toplevel') || '';

  // Check for uncommitted changes
  const statusOutput = runGitCommand('git status --porcelain');
  const statusLines = statusOutput ? statusOutput.split('\n').filter(Boolean) : [];

  const uncommittedChanges = statusLines.filter(l => !l.startsWith('??')).length;
  const untrackedFiles = statusLines.filter(l => l.startsWith('??')).length;
  const isClean = statusLines.length === 0;

  return {
    currentBranch,
    repoRoot,
    isClean,
    uncommittedChanges,
    untrackedFiles,
  };
}

export function viteGitPlugin(): Plugin {
  const virtualModuleId = 'virtual:git-info';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  return {
    name: 'vite-git-plugin',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const worktrees = parseWorktreeList();
        const gitInfo = getLocalGitInfo();

        return `
          export const worktrees = ${JSON.stringify(worktrees, null, 2)};
          export const gitInfo = ${JSON.stringify(gitInfo, null, 2)};
        `;
      }
    },
    // Re-fetch git info on HMR
    handleHotUpdate({ file, server }) {
      // Only refresh if .git directory changes (commits, branch switches, etc.)
      if (file.includes('.git')) {
        const module = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
        if (module) {
          server.moduleGraph.invalidateModule(module);
          return [module];
        }
      }
    },
  };
}
