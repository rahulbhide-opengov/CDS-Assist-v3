/**
 * RepoStatsBar Component
 *
 * A compact, dense statistical overview of repository status.
 * Shows key metrics at a glance with minimal visual footprint.
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
  Divider,
  useTheme,
  alpha,
  Button,
  LinearProgress,
} from '@mui/material';
import {
  AccountTree as BranchIcon,
  MergeType as PRIcon,
  TrendingUp as AheadIcon,
  TrendingDown as BehindIcon,
  SwapVert as DivergedIcon,
  CheckCircle as CleanIcon,
  Warning as WarningIcon,
  Schedule as PendingIcon,
  OpenInNew as OpenIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { BranchInfo } from './GitStatusCard';

interface RepoStatsBarProps {
  /** Total number of branches */
  totalBranches: number;
  /** Number of branches ahead of main */
  branchesAhead: number;
  /** Number of branches behind main */
  branchesBehind: number;
  /** Number of diverged branches */
  branchesDiverged: number;
  /** Number of clean branches */
  branchesClean: number;
  /** Number of branches with unknown status */
  branchesUnknown?: number;
  /** Open PR count */
  openPRs: number;
  /** PRs awaiting review */
  prsNeedingReview: number;
  /** PRs approved and ready to merge */
  prsReadyToMerge: number;
  /** Repository name */
  repoName?: string;
  /** Default branch name */
  defaultBranch?: string;
  /** Loading state */
  loading?: boolean;
  /** Refresh callback */
  onRefresh?: () => void;
}

const StatItem: React.FC<{
  icon: React.ReactNode;
  value: number | string;
  label: string;
  color?: 'success' | 'warning' | 'error' | 'info' | 'default';
  onClick?: () => void;
  tooltip?: string;
}> = ({ icon, value, label, color = 'default', onClick, tooltip }) => {
  const theme = useTheme();

  const colorMap = {
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main,
    info: theme.palette.info.main,
    default: theme.palette.text.secondary,
  };

  const content = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      onClick={onClick}
      sx={{
        cursor: onClick ? 'pointer' : 'default',
        px: 1.5,
        py: 0.75,
        borderRadius: 1,
        transition: 'background-color 0.2s',
        '&:hover': onClick ? {
          bgcolor: alpha(colorMap[color], 0.08),
        } : {},
      }}
    >
      <Box sx={{ color: colorMap[color], display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 700,
          color: colorMap[color],
          fontSize: '0.95rem',
        }}
      >
        {value}
      </Typography>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.75rem' }}
      >
        {label}
      </Typography>
    </Stack>
  );

  return tooltip ? (
    <Tooltip title={tooltip} arrow>
      {content}
    </Tooltip>
  ) : content;
};

const RepoStatsBar: React.FC<RepoStatsBarProps> = ({
  totalBranches,
  branchesAhead,
  branchesBehind,
  branchesDiverged,
  branchesClean,
  branchesUnknown = 0,
  openPRs,
  prsNeedingReview,
  prsReadyToMerge,
  repoName,
  defaultBranch = 'main',
  loading = false,
  onRefresh,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Calculate health score (simple metric)
  const healthScore = totalBranches > 0
    ? Math.round((branchesClean / totalBranches) * 100)
    : 100;

  const healthColor = healthScore >= 80 ? 'success' : healthScore >= 50 ? 'warning' : 'error';

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
        }}
      >
        <LinearProgress />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Main stats row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Left - Repository info */}
        <Stack direction="row" alignItems="center" spacing={2}>
          {repoName && (
            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
              {repoName}
            </Typography>
          )}
          <Chip
            label={defaultBranch}
            size="small"
            variant="outlined"
            sx={{ fontFamily: 'monospace', fontSize: '0.75rem', height: 22 }}
          />
        </Stack>

        {/* Center - Key metrics */}
        <Stack
          direction="row"
          alignItems="center"
          divider={<Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />}
          sx={{ flexWrap: 'wrap' }}
        >
          <StatItem
            icon={<BranchIcon sx={{ fontSize: 18 }} />}
            value={totalBranches}
            label="branches"
            onClick={() => navigate('/repo/branches')}
            tooltip="View all branches"
          />

          <StatItem
            icon={<CleanIcon sx={{ fontSize: 18 }} />}
            value={branchesClean}
            label="clean"
            color="success"
            onClick={() => navigate('/repo/branches')}
            tooltip="Branches up to date with main"
          />

          {branchesAhead > 0 && (
            <StatItem
              icon={<AheadIcon sx={{ fontSize: 18 }} />}
              value={branchesAhead}
              label="ahead"
              color="info"
              onClick={() => navigate('/repo/branches')}
              tooltip="Branches with commits to merge"
            />
          )}

          {branchesBehind > 0 && (
            <StatItem
              icon={<BehindIcon sx={{ fontSize: 18 }} />}
              value={branchesBehind}
              label="behind"
              color="warning"
              onClick={() => navigate('/repo/branches')}
              tooltip="Branches needing rebase"
            />
          )}

          {branchesDiverged > 0 && (
            <StatItem
              icon={<DivergedIcon sx={{ fontSize: 18 }} />}
              value={branchesDiverged}
              label="diverged"
              color="error"
              onClick={() => navigate('/repo/branches')}
              tooltip="Branches that need attention"
            />
          )}

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <StatItem
            icon={<PRIcon sx={{ fontSize: 18 }} />}
            value={openPRs}
            label="open PRs"
            color={openPRs > 0 ? 'info' : 'default'}
            onClick={() => navigate('/repo/pull-requests')}
            tooltip="View pull requests"
          />

          {prsReadyToMerge > 0 && (
            <StatItem
              icon={<CleanIcon sx={{ fontSize: 18 }} />}
              value={prsReadyToMerge}
              label="ready"
              color="success"
              onClick={() => navigate('/repo/pull-requests')}
              tooltip="PRs approved and ready to merge"
            />
          )}

          {prsNeedingReview > 0 && (
            <StatItem
              icon={<PendingIcon sx={{ fontSize: 18 }} />}
              value={prsNeedingReview}
              label="need review"
              color="warning"
              onClick={() => navigate('/repo/pull-requests')}
              tooltip="PRs awaiting review"
            />
          )}
        </Stack>

        {/* Right - Health & Actions */}
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {/* Health indicator */}
          <Tooltip title={`${healthScore}% of branches are clean`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: `${healthColor}.main`,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {healthScore}% healthy
              </Typography>
            </Box>
          </Tooltip>

          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}

          <Button
            size="small"
            endIcon={<OpenIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate('/repo/branches')}
            sx={{ textTransform: 'none', fontSize: '0.75rem' }}
          >
            View All
          </Button>
        </Stack>
      </Box>

      {/* Progress bar showing branch health distribution */}
      {totalBranches > 0 && (
        <Box sx={{ display: 'flex', height: 4 }}>
          <Box
            sx={{
              width: `${(branchesClean / totalBranches) * 100}%`,
              bgcolor: 'success.main',
              transition: 'width 0.3s ease',
            }}
          />
          <Box
            sx={{
              width: `${(branchesAhead / totalBranches) * 100}%`,
              bgcolor: 'info.main',
              transition: 'width 0.3s ease',
            }}
          />
          <Box
            sx={{
              width: `${(branchesBehind / totalBranches) * 100}%`,
              bgcolor: 'warning.main',
              transition: 'width 0.3s ease',
            }}
          />
          <Box
            sx={{
              width: `${(branchesDiverged / totalBranches) * 100}%`,
              bgcolor: 'error.main',
              transition: 'width 0.3s ease',
            }}
          />
          {branchesUnknown > 0 && (
            <Box
              sx={{
                width: `${(branchesUnknown / totalBranches) * 100}%`,
                bgcolor: 'grey.400',
                transition: 'width 0.3s ease',
              }}
            />
          )}
        </Box>
      )}
    </Paper>
  );
};

export default RepoStatsBar;
