/**
 * CurrentBranchBanner Component
 *
 * Displays the currently checked out branch prominently at the top of repository pages.
 * Shows branch name, status, and quick actions.
 */

import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import {
  AccountTree as BranchIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Sync as SyncIcon,
  Circle as CircleIcon,
  FolderOpen as WorktreeIcon,
} from '@mui/icons-material';
import type { BranchStatus } from './dashboard';

export interface CurrentBranchBannerProps {
  /** Current branch name */
  branchName?: string;
  /** Branch status relative to main */
  status?: BranchStatus;
  /** Commits ahead of main */
  aheadBy?: number;
  /** Commits behind main */
  behindBy?: number;
  /** Is the working directory clean */
  isClean?: boolean;
  /** Number of uncommitted changes */
  uncommittedChanges?: number;
  /** Loading state */
  loading?: boolean;
  /** Callback when branch name is copied */
  onCopy?: (branchName: string) => void;
  /** Current worktree path (optional) */
  worktreePath?: string;
  /** Number of active worktrees */
  worktreeCount?: number;
  /** Callback when worktrees button is clicked */
  onWorktreesClick?: () => void;
}

const getStatusColor = (status: BranchStatus): 'success' | 'warning' | 'error' | 'info' | 'default' => {
  switch (status) {
    case 'clean':
      return 'success';
    case 'modified':
      return 'warning';
    case 'ahead':
      return 'info';
    case 'behind':
      return 'warning';
    case 'diverged':
      return 'error';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: BranchStatus) => {
  switch (status) {
    case 'clean':
      return <CheckCircleIcon sx={{ fontSize: 16 }} />;
    case 'modified':
      return <WarningIcon sx={{ fontSize: 16 }} />;
    case 'ahead':
      return <SyncIcon sx={{ fontSize: 16 }} />;
    case 'behind':
      return <SyncIcon sx={{ fontSize: 16, transform: 'scaleX(-1)' }} />;
    case 'diverged':
      return <ErrorIcon sx={{ fontSize: 16 }} />;
    default:
      return <CircleIcon sx={{ fontSize: 16 }} />;
  }
};

const getStatusLabel = (status: BranchStatus): string => {
  switch (status) {
    case 'clean':
      return 'Up to date';
    case 'modified':
      return 'Modified';
    case 'ahead':
      return 'Ahead';
    case 'behind':
      return 'Behind';
    case 'diverged':
      return 'Diverged';
    default:
      return 'Unknown';
  }
};

const CurrentBranchBanner: React.FC<CurrentBranchBannerProps> = ({
  branchName,
  status = 'unknown',
  aheadBy,
  behindBy,
  isClean = true,
  uncommittedChanges = 0,
  loading = false,
  onCopy,
  worktreePath,
  worktreeCount,
  onWorktreesClick,
}) => {
  const theme = useTheme();
  const statusColor = getStatusColor(status);

  const handleCopy = () => {
    if (branchName) {
      navigator.clipboard.writeText(branchName);
      onCopy?.(branchName);
    }
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={200} height={28} />
          <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 2 }} />
        </Stack>
      </Paper>
    );
  }

  if (!branchName) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        bgcolor: alpha(theme.palette.primary.main, 0.02),
        borderLeft: `4px solid ${theme.palette.primary.main}`,
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        {/* Left side - Branch info */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          >
            <BranchIcon />
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Current Branch
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                }}
              >
                {branchName}
              </Typography>
              <Tooltip title="Copy branch name">
                <IconButton size="small" onClick={handleCopy} sx={{ p: 0.5 }}>
                  <CopyIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>
        </Stack>

        {/* Right side - Status indicators */}
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" useFlexGap>
          {/* Branch status */}
          <Chip
            icon={getStatusIcon(status)}
            label={getStatusLabel(status)}
            size="small"
            color={statusColor}
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />

          {/* Ahead/Behind indicators */}
          {(aheadBy || behindBy) && (
            <Stack direction="row" spacing={1}>
              {aheadBy && aheadBy > 0 && (
                <Chip
                  label={`+${aheadBy} ahead`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: 'info.dark',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              )}
              {behindBy && behindBy > 0 && (
                <Chip
                  label={`-${behindBy} behind`}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    color: 'warning.dark',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Stack>
          )}

          {/* Uncommitted changes */}
          {!isClean && uncommittedChanges > 0 && (
            <Chip
              icon={<WarningIcon sx={{ fontSize: 14 }} />}
              label={`${uncommittedChanges} uncommitted`}
              size="small"
              color="warning"
              variant="outlined"
              sx={{ fontSize: '0.75rem' }}
            />
          )}

          {/* Worktrees indicator */}
          {worktreeCount && worktreeCount > 1 && (
            <Tooltip title="View worktrees">
              <Chip
                icon={<WorktreeIcon sx={{ fontSize: 14 }} />}
                label={`${worktreeCount} worktrees`}
                size="small"
                variant="outlined"
                onClick={onWorktreesClick}
                sx={{
                  cursor: onWorktreesClick ? 'pointer' : 'default',
                  fontSize: '0.75rem',
                  '&:hover': onWorktreesClick ? {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  } : {},
                }}
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CurrentBranchBanner;
