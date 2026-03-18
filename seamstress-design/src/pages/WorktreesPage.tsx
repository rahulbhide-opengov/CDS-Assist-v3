/**
 * WorktreesPage Component
 *
 * Displays git worktrees with their status, branches, and paths.
 * Allows users to see all active working directories for the repository.
 */

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Grid,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Toolbar } from '../components/Toolbar';
import {
  FolderOpen as FolderIcon,
  AccountTree as BranchIcon,
  ContentCopy as CopyIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenIcon,
  Refresh as RefreshIcon,
  Terminal as TerminalIcon,
  Commit as CommitIcon,
} from '@mui/icons-material';
import { useGitWorktrees, useLocalGitInfo } from '../hooks/useLocalGit';
import type { GitWorktree } from '../hooks/useLocalGit';
import CurrentBranchBanner from '../components/CurrentBranchBanner';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const WorktreeCard: React.FC<{
  worktree: GitWorktree;
  isCurrentWorktree: boolean;
  onCopyPath: (path: string) => void;
  onCopyBranch: (branch: string) => void;
}> = ({ worktree, isCurrentWorktree, onCopyPath, onCopyBranch }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderLeft: isCurrentWorktree
          ? `4px solid ${theme.palette.primary.main}`
          : `4px solid ${theme.palette.grey[300]}`,
        bgcolor: isCurrentWorktree
          ? alpha(theme.palette.primary.main, 0.02)
          : 'background.paper',
        transition: 'all 0.2s ease',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.light,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          {/* Header with main/current indicators */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: isCurrentWorktree
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.grey[500], 0.1),
                  color: isCurrentWorktree ? 'primary.main' : 'grey.600',
                }}
              >
                <FolderIcon />
              </Box>
              <Box>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {worktree.isMain && (
                    <Chip
                      icon={<HomeIcon sx={{ fontSize: 12 }} />}
                      label="Main"
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  )}
                  {isCurrentWorktree && !worktree.isMain && (
                    <Chip
                      label="Current"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.65rem' }}
                    />
                  )}
                  {worktree.isLocked && (
                    <Tooltip title={worktree.lockReason || 'Locked'}>
                      <Chip
                        icon={<LockIcon sx={{ fontSize: 12 }} />}
                        label="Locked"
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.65rem' }}
                      />
                    </Tooltip>
                  )}
                </Stack>
              </Box>
            </Stack>

            {/* Actions */}
            <Stack direction="row" spacing={0.5}>
              <Tooltip title="Open in terminal">
                <IconButton size="small">
                  <TerminalIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Open folder">
                <IconButton size="small">
                  <OpenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              {!worktree.isMain && (
                <Tooltip title="Remove worktree">
                  <IconButton size="small" color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {/* Branch info */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Branch
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <BranchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              >
                {worktree.branch}
              </Typography>
              <Tooltip title="Copy branch name">
                <IconButton size="small" onClick={() => onCopyBranch(worktree.branch)} sx={{ p: 0.25 }}>
                  <CopyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Path info */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Path
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}
              >
                {worktree.path}
              </Typography>
              <Tooltip title="Copy path">
                <IconButton size="small" onClick={() => onCopyPath(worktree.path)} sx={{ p: 0.25 }}>
                  <CopyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Commit info */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <CommitIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                {worktree.commit}
              </Typography>
            </Stack>
            {worktree.lastAccessed && (
              <Typography variant="caption" color="text.secondary">
                Last accessed: {worktree.lastAccessed}
              </Typography>
            )}
          </Stack>

          {/* Lock reason if locked */}
          {worktree.isLocked && worktree.lockReason && (
            <Alert
              severity="info"
              icon={<LockIcon sx={{ fontSize: 16 }} />}
              sx={{
                py: 0.5,
                '& .MuiAlert-message': { fontSize: '0.75rem' },
              }}
            >
              {worktree.lockReason}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function WorktreesPage() {
  const theme = useTheme();

  // Fetch local git info and worktrees
  const { data: localGitInfo, isLoading: gitLoading } = useLocalGitInfo();
  const { data: worktrees, isLoading: worktreesLoading, isFetching } = useGitWorktrees();

  const isLoading = gitLoading || worktreesLoading;

  const handleCopyPath = (path: string) => {
    navigator.clipboard.writeText(path);
  };

  const handleCopyBranch = (branch: string) => {
    navigator.clipboard.writeText(branch);
  };

  // Find current branch's worktree info
  const currentBranchWorktree = worktrees?.find(
    (w) => w.branch === localGitInfo?.currentBranch
  );
  const currentBranchAhead = 0; // Would come from comparing with main
  const currentBranchBehind = 0;

  return (
    <Box>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="add"
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => {/* Add worktree */}}
            >
              Add Worktree
            </Button>,
            <Button
              key="refresh"
              variant="outlined"
              size="medium"
              startIcon={isFetching ? <CircularProgress size={18} /> : <RefreshIcon />}
              disabled={isFetching}
            >
              Refresh
            </Button>,
          ]}
        >
          <PageHeaderComposable.Title>Worktrees</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Manage multiple working directories for parallel development
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar */}
      <Toolbar level="level1">
        <Toolbar.Section grow>
          <Typography variant="body2" color="text.secondary">
            {worktrees?.length || 0} worktree{(worktrees?.length || 0) !== 1 ? 's' : ''} active
          </Typography>
        </Toolbar.Section>
      </Toolbar>

      {/* Current Branch Banner */}
      <Box sx={{ px: 3, pt: 2 }}>
        <CurrentBranchBanner
          branchName={localGitInfo?.currentBranch}
          status={currentBranchAhead > 0 && currentBranchBehind > 0 ? 'diverged' : currentBranchAhead > 0 ? 'ahead' : currentBranchBehind > 0 ? 'behind' : 'clean'}
          aheadBy={currentBranchAhead}
          behindBy={currentBranchBehind}
          isClean={localGitInfo?.isClean}
          uncommittedChanges={localGitInfo?.uncommittedChanges}
          loading={isLoading}
          worktreeCount={worktrees?.length}
        />
      </Box>

      {/* Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        {/* Info about worktrees */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Git worktrees</strong> allow you to have multiple working directories attached to the same repository.
            Each worktree can have a different branch checked out, enabling parallel development without stashing or committing incomplete work.
          </Typography>
        </Alert>

        {isLoading ? (
          <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading worktrees...
              </Typography>
            </Stack>
          </Paper>
        ) : worktrees && worktrees.length > 0 ? (
          <Grid container spacing={2}>
            {worktrees.map((worktree) => (
              <Grid key={worktree.path} size={{ xs: 12, md: 6, lg: 4 }}>
                <WorktreeCard
                  worktree={worktree}
                  isCurrentWorktree={worktree.branch === localGitInfo?.currentBranch}
                  onCopyPath={handleCopyPath}
                  onCopyBranch={handleCopyBranch}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <FolderIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Additional Worktrees
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You're working in the main repository directory. Add a worktree to work on multiple branches simultaneously.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Add Your First Worktree
            </Button>
          </Paper>
        )}

        {/* Quick guide */}
        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: 2,
            bgcolor: alpha(theme.palette.grey[500], 0.05),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Quick Commands
          </Typography>
          <Stack spacing={1}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="Add" size="small" sx={{ minWidth: 60 }} />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                git worktree add ../my-feature feature/my-feature
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="List" size="small" sx={{ minWidth: 60 }} />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                git worktree list
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="Remove" size="small" sx={{ minWidth: 60 }} />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                git worktree remove ../my-feature
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip label="Lock" size="small" sx={{ minWidth: 60 }} />
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                git worktree lock ../my-feature --reason "In progress"
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
}
