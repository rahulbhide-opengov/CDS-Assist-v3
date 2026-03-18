/**
 * GitStatusCard Component
 *
 * Displays git repository status information including:
 * - Current branch and status
 * - Branch list with statuses
 * - Labels/tags
 * - Link to branches table
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
  Divider,
  Button,
  Skeleton,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
  Grid,
  Paper,
} from '@mui/material';
import {
  AccountTree as BranchIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Sync as SyncIcon,
  LocalOffer as LabelIcon,
  OpenInNew as OpenInNewIcon,
  ContentCopy as CopyIcon,
  TableChart as TableIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  SwapVert as SwapVertIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Branch status types
 */
export type BranchStatus = 'clean' | 'modified' | 'ahead' | 'behind' | 'diverged' | 'unknown';

/**
 * Branch information
 */
export interface BranchInfo {
  name: string;
  status: BranchStatus;
  isDefault?: boolean;
  isCurrent?: boolean;
  lastCommit?: string;
  lastCommitDate?: string;
  aheadBy?: number;
  behindBy?: number;
}

/**
 * Label/tag information
 */
export interface GitLabel {
  name: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
  description?: string;
}

/**
 * Git status information
 */
export interface GitStatusInfo {
  currentBranch: string;
  status: BranchStatus;
  isClean: boolean;
  uncommittedChanges?: number;
  untrackedFiles?: number;
  repoName?: string;
  remoteUrl?: string;
}

/**
 * Props for the GitStatusCard component
 */
export interface GitStatusCardProps {
  /** Current git status information */
  gitStatus: GitStatusInfo;
  /** List of branches to display */
  branches: BranchInfo[];
  /** Labels/tags to display */
  labels?: GitLabel[];
  /** Maximum number of branches to show (default: 5) */
  maxBranches?: number;
  /** URL or path to branches table */
  branchesTablePath?: string;
  /** Loading state */
  loading?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Callback when copy branch name */
  onCopyBranch?: (branchName: string) => void;
}

/**
 * Get status color based on branch status
 */
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
    case 'unknown':
    default:
      return 'default';
  }
};

/**
 * Get status icon based on branch status
 */
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
    case 'unknown':
    default:
      return <CircleIcon sx={{ fontSize: 16 }} />;
  }
};

/**
 * Get status label based on branch status
 */
const getStatusLabel = (status: BranchStatus): string => {
  switch (status) {
    case 'clean':
      return 'Clean';
    case 'modified':
      return 'Modified';
    case 'ahead':
      return 'Ahead';
    case 'behind':
      return 'Behind';
    case 'diverged':
      return 'Diverged';
    case 'unknown':
    default:
      return 'Unknown';
  }
};

/**
 * GitStatusCard - Displays git repository status and branch information
 *
 * Features:
 * - Shows current branch with status indicator
 * - Lists recent branches with their statuses
 * - Displays labels/tags
 * - Links to full branches table
 * - Copy branch name functionality
 * - Responsive design with MUI theming
 *
 * @example
 * ```tsx
 * <GitStatusCard
 *   gitStatus={{
 *     currentBranch: 'feature/new-feature',
 *     status: 'modified',
 *     isClean: false,
 *     uncommittedChanges: 3,
 *   }}
 *   branches={[
 *     { name: 'main', status: 'clean', isDefault: true },
 *     { name: 'develop', status: 'ahead', aheadBy: 5 },
 *   ]}
 *   labels={[
 *     { name: 'v1.0.0', color: 'success' },
 *     { name: 'beta', color: 'warning' },
 *   ]}
 *   branchesTablePath="/branches"
 * />
 * ```
 */
const GitStatusCard: React.FC<GitStatusCardProps> = ({
  gitStatus,
  branches,
  labels = [],
  maxBranches = 5,
  branchesTablePath,
  loading = false,
  onClick,
  onCopyBranch,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const statusColor = getStatusColor(gitStatus.status);
  const displayBranches = branches.slice(0, maxBranches);
  const hasMoreBranches = branches.length > maxBranches;

  const handleCopyBranch = (branchName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(branchName);
    onCopyBranch?.(branchName);
  };

  const handleViewAllBranches = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (branchesTablePath) {
      navigate(branchesTablePath);
    }
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          height: '100%',
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Skeleton variant="circular" width={40} height={40} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Stack>
            <Skeleton variant="rectangular" width="100%" height={1} />
            <Stack spacing={1}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rectangular" width="100%" height={36} />
              ))}
            </Stack>
            <Skeleton variant="rectangular" width="100%" height={32} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: theme.shadows[8],
              borderColor: theme.palette.primary.main,
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Header - Current Branch */}
          <Box>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette[statusColor === 'default' ? 'grey' : statusColor].main, 0.1),
                  color: statusColor === 'default' ? 'grey.600' : `${statusColor}.main`,
                  flexShrink: 0,
                }}
              >
                <BranchIcon />
              </Box>
              <Box flex={1} minWidth={0}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography
                    variant="h6"
                    component="div"
                    fontWeight={600}
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {gitStatus.currentBranch}
                  </Typography>
                  <Tooltip title="Copy branch name">
                    <IconButton
                      size="small"
                      onClick={(e) => handleCopyBranch(gitStatus.currentBranch, e)}
                      sx={{ p: 0.5 }}
                    >
                      <CopyIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Chip
                    icon={getStatusIcon(gitStatus.status)}
                    label={getStatusLabel(gitStatus.status)}
                    size="small"
                    color={statusColor}
                    sx={{ fontWeight: 500 }}
                  />
                  {!gitStatus.isClean && gitStatus.uncommittedChanges !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      {gitStatus.uncommittedChanges} uncommitted {gitStatus.uncommittedChanges === 1 ? 'change' : 'changes'}
                    </Typography>
                  )}
                  {gitStatus.untrackedFiles !== undefined && gitStatus.untrackedFiles > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      {gitStatus.untrackedFiles} untracked
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>

          {gitStatus.repoName && (
            <Typography variant="body2" color="text.secondary">
              Repository: <strong>{gitStatus.repoName}</strong>
            </Typography>
          )}

          <Divider />

          {/* Branches Grid */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Branches ({branches.length})
              </Typography>
              <Stack direction="row" spacing={1}>
                {/* Status summary chips */}
                {branches.filter(b => b.status === 'clean').length > 0 && (
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                    label={branches.filter(b => b.status === 'clean').length}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ height: 24 }}
                  />
                )}
                {branches.filter(b => b.status === 'modified').length > 0 && (
                  <Chip
                    icon={<WarningIcon sx={{ fontSize: 14 }} />}
                    label={branches.filter(b => b.status === 'modified').length}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ height: 24 }}
                  />
                )}
                {branches.filter(b => b.status === 'ahead').length > 0 && (
                  <Chip
                    icon={<ArrowUpIcon sx={{ fontSize: 14 }} />}
                    label={branches.filter(b => b.status === 'ahead').length}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ height: 24 }}
                  />
                )}
                {branches.filter(b => b.status === 'behind').length > 0 && (
                  <Chip
                    icon={<ArrowDownIcon sx={{ fontSize: 14 }} />}
                    label={branches.filter(b => b.status === 'behind').length}
                    size="small"
                    color="warning"
                    variant="outlined"
                    sx={{ height: 24 }}
                  />
                )}
                {branches.filter(b => b.status === 'diverged').length > 0 && (
                  <Chip
                    icon={<SwapVertIcon sx={{ fontSize: 14 }} />}
                    label={branches.filter(b => b.status === 'diverged').length}
                    size="small"
                    color="error"
                    variant="outlined"
                    sx={{ height: 24 }}
                  />
                )}
              </Stack>
            </Stack>

            <Grid container spacing={1.5}>
              {displayBranches.map((branch) => {
                const branchStatusColor = getStatusColor(branch.status);
                return (
                  <Grid key={branch.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        borderRadius: 1.5,
                        border: `1px solid ${theme.palette.divider}`,
                        bgcolor: branch.isCurrent
                          ? alpha(theme.palette.primary.main, 0.04)
                          : 'background.paper',
                        borderLeft: `3px solid ${
                          branchStatusColor === 'default'
                            ? theme.palette.grey[400]
                            : theme.palette[branchStatusColor].main
                        }`,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.action.hover, 0.5),
                          borderColor: theme.palette.primary.light,
                        },
                      }}
                    >
                      <Stack spacing={1}>
                        {/* Branch name and copy */}
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="body2"
                            fontWeight={branch.isCurrent ? 600 : 500}
                            fontFamily="monospace"
                            fontSize="0.8rem"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            flex={1}
                          >
                            {branch.name}
                          </Typography>
                          <Tooltip title="Copy branch name">
                            <IconButton
                              size="small"
                              onClick={(e) => handleCopyBranch(branch.name, e)}
                              sx={{ p: 0.25, ml: 0.5 }}
                            >
                              <CopyIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        {/* Status and badges */}
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap alignItems="center">
                          <Chip
                            icon={getStatusIcon(branch.status)}
                            label={getStatusLabel(branch.status)}
                            size="small"
                            color={branchStatusColor}
                            sx={{
                              height: 20,
                              fontSize: '0.65rem',
                              '& .MuiChip-icon': { fontSize: 12, ml: 0.5 },
                            }}
                          />
                          {branch.isDefault && (
                            <Chip
                              label="default"
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.6rem' }}
                            />
                          )}
                          {branch.isCurrent && (
                            <Chip
                              label="HEAD"
                              size="small"
                              color="primary"
                              sx={{ height: 20, fontSize: '0.6rem' }}
                            />
                          )}
                        </Stack>

                        {/* Sync status (ahead/behind) */}
                        {(branch.aheadBy || branch.behindBy) && (
                          <Stack direction="row" spacing={1} alignItems="center">
                            {branch.aheadBy && (
                              <Stack direction="row" alignItems="center" spacing={0.25}>
                                <ArrowUpIcon sx={{ fontSize: 12, color: 'info.main' }} />
                                <Typography variant="caption" color="info.main" fontWeight={500}>
                                  {branch.aheadBy}
                                </Typography>
                              </Stack>
                            )}
                            {branch.behindBy && (
                              <Stack direction="row" alignItems="center" spacing={0.25}>
                                <ArrowDownIcon sx={{ fontSize: 12, color: 'warning.main' }} />
                                <Typography variant="caption" color="warning.main" fontWeight={500}>
                                  {branch.behindBy}
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        )}

                        {/* Last commit date */}
                        {branch.lastCommitDate && (
                          <Typography variant="caption" color="text.secondary" fontSize="0.7rem">
                            {branch.lastCommitDate}
                          </Typography>
                        )}
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {hasMoreBranches && (
              <Typography
                variant="caption"
                color="text.secondary"
                mt={1.5}
                display="block"
              >
                +{branches.length - maxBranches} more branches
              </Typography>
            )}
          </Box>

          {/* Labels */}
          {labels.length > 0 && (
            <>
              <Divider />
              <Box>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <LabelIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant="subtitle2" fontWeight={600}>
                    Labels
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                  {labels.map((label) => (
                    <Tooltip key={label.name} title={label.description || ''}>
                      <Chip
                        label={label.name}
                        size="small"
                        color={label.color || 'default'}
                        variant="outlined"
                        sx={{ fontFamily: 'monospace' }}
                      />
                    </Tooltip>
                  ))}
                </Stack>
              </Box>
            </>
          )}

          {/* View All Branches Button */}
          {branchesTablePath && (
            <>
              <Divider />
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TableIcon />}
                endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                onClick={handleViewAllBranches}
                sx={{
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                View All Branches
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default GitStatusCard;
