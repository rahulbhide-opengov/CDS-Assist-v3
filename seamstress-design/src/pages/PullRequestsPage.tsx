/**
 * PullRequestsPage Component
 *
 * Displays a table of pull requests with filtering, search, and status management.
 *
 * Uses real GitHub data when VITE_GITHUB_TOKEN is configured,
 * otherwise falls back to mock data.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Tooltip,
  Paper,
  Avatar,
  AvatarGroup,
  Alert,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Toolbar } from '../components/Toolbar';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  MergeType as MergeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Comment as CommentIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  AccountTree as BranchIcon,
} from '@mui/icons-material';
import { useGitHubPullRequests, useIsGitHubConfigured, githubKeys, useGitHubBranches } from '../hooks/useGitHub';
import { useQueryClient } from '@tanstack/react-query';
import { useLocalGitInfo, useGitWorktrees } from '../hooks/useLocalGit';
import CurrentBranchBanner from '../components/CurrentBranchBanner';
import { cdsDesignTokens } from '../theme/cds';

// PR status types
type PRStatus = 'open' | 'merged' | 'closed' | 'draft';

// PR review status
type ReviewStatus = 'approved' | 'changes_requested' | 'pending' | 'review_required';

// Pull request data interface
interface PullRequest {
  id: number;
  number: number;
  title: string;
  status: PRStatus;
  reviewStatus: ReviewStatus;
  author: string;
  authorAvatar?: string;
  sourceBranch: string;
  targetBranch: string;
  createdAt: string;
  updatedAt: string;
  comments: number;
  reviewers: Array<{ name: string; avatar?: string }>;
  labels: Array<{ name: string; color: string }>;
  checksStatus: 'passing' | 'failing' | 'pending';
}


// Get status color
const getStatusColor = (status: PRStatus): 'success' | 'error' | 'default' | 'warning' => {
  switch (status) {
    case 'open':
      return 'success';
    case 'merged':
      return 'default';
    case 'closed':
      return 'error';
    case 'draft':
      return 'warning';
    default:
      return 'default';
  }
};

// Get status icon
const getStatusIcon = (status: PRStatus) => {
  switch (status) {
    case 'open':
      return <BranchIcon sx={{ fontSize: 16 }} />;
    case 'merged':
      return <MergeIcon sx={{ fontSize: 16 }} />;
    case 'closed':
      return <CancelIcon sx={{ fontSize: 16 }} />;
    case 'draft':
      return <ScheduleIcon sx={{ fontSize: 16 }} />;
    default:
      return null;
  }
};

// Get review status chip
const getReviewStatusChip = (status: ReviewStatus) => {
  switch (status) {
    case 'approved':
      return <Chip icon={<CheckCircleIcon sx={{ fontSize: 14 }} />} label="Approved" size="small" color="success" variant="outlined" sx={{ height: 22 }} />;
    case 'changes_requested':
      return <Chip icon={<CancelIcon sx={{ fontSize: 14 }} />} label="Changes requested" size="small" color="warning" variant="outlined" sx={{ height: 22 }} />;
    case 'review_required':
      return <Chip label="Review required" size="small" color="info" variant="outlined" sx={{ height: 22 }} />;
    case 'pending':
    default:
      return <Chip label="Pending" size="small" variant="outlined" sx={{ height: 22 }} />;
  }
};

// Get checks status indicator
const getChecksIndicator = (status: 'passing' | 'failing' | 'pending') => {
  switch (status) {
    case 'passing':
      return <Tooltip title="All checks passing"><CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} /></Tooltip>;
    case 'failing':
      return <Tooltip title="Some checks failing"><CancelIcon sx={{ fontSize: 18, color: 'error.main' }} /></Tooltip>;
    case 'pending':
      return <Tooltip title="Checks pending"><ScheduleIcon sx={{ fontSize: 18, color: 'warning.main' }} /></Tooltip>;
  }
};

export default function PullRequestsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PRStatus | 'all'>('all');

  // Check if GitHub is configured
  const isGitHubConfigured = useIsGitHubConfigured();

  // Fetch PRs from GitHub
  const {
    data: githubPRs,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGitHubPullRequests('all', { enabled: isGitHubConfigured });

  // Fetch local git info for current branch banner
  const { data: localGitInfo } = useLocalGitInfo();
  const { data: worktrees } = useGitWorktrees();
  const { data: githubBranches } = useGitHubBranches({ enabled: isGitHubConfigured });

  // Get current branch data for banner
  const currentBranchData = githubBranches?.find(
    (b) => b.name === localGitInfo?.currentBranch
  );

  // Transform GitHub PRs to table rows (no mock fallback)
  const prsData: PullRequest[] = React.useMemo(() => {
    if (githubPRs && githubPRs.length > 0) {
      return githubPRs.map((pr) => ({
        id: pr.id,
        number: pr.number,
        title: pr.title,
        status: pr.status,
        reviewStatus: pr.reviewStatus,
        author: pr.author,
        authorAvatar: pr.authorAvatar,
        sourceBranch: pr.sourceBranch,
        targetBranch: pr.targetBranch,
        createdAt: pr.createdAt,
        updatedAt: pr.updatedAt,
        comments: pr.comments,
        reviewers: pr.reviewers.map((r) => ({ name: r.name, avatar: r.avatar })),
        labels: pr.labels,
        checksStatus: pr.checksStatus,
      }));
    }
    return [];
  }, [githubPRs]);

  // Handle refresh
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: githubKeys.pullRequests('all') });
  };

  // Filter PRs based on search and status
  const filteredPRs = prsData.filter((pr) => {
    const matchesSearch =
      searchValue === '' ||
      pr.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      pr.author.toLowerCase().includes(searchValue.toLowerCase()) ||
      pr.sourceBranch.toLowerCase().includes(searchValue.toLowerCase()) ||
      `#${pr.number}`.includes(searchValue);

    const matchesStatus = statusFilter === 'all' || pr.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Count by status
  const statusCounts = prsData.reduce(
    (acc, pr) => {
      acc[pr.status] = (acc[pr.status] || 0) + 1;
      return acc;
    },
    {} as Record<PRStatus, number>
  );

  const columns: GridColDef[] = [
    {
      field: 'status',
      headerName: '',
      width: 50,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Chip
            icon={getStatusIcon(params.value)}
            label=""
            size="small"
            color={getStatusColor(params.value)}
            sx={{
              width: 28,
              height: 28,
              '& .MuiChip-label': { display: 'none' },
              '& .MuiChip-icon': { margin: 0 },
            }}
          />
        </Box>
      ),
    },
    {
      field: 'title',
      headerName: 'Pull Request',
      flex: 1,
      minWidth: 300,
      renderCell: (params) => (
        <Stack spacing={0.5} sx={{ py: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                cursor: 'pointer',
                '&:hover': { color: 'primary.main', textDecoration: 'underline' },
              }}
            >
              {params.row.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              #{params.row.number}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
            {params.row.labels.map((label: { name: string; color: string }) => (
              <Chip
                key={label.name}
                label={label.name}
                size="small"
                sx={{
                  height: 18,
                  fontSize: '0.65rem',
                  bgcolor: label.color,
                  color: 'white',
                }}
              />
            ))}
          </Stack>
        </Stack>
      ),
    },
    {
      field: 'branches',
      headerName: 'Branches',
      width: 320,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Chip
            label={params.row.sourceBranch}
            size="small"
            variant="outlined"
            sx={{ height: 22, fontFamily: 'monospace', fontSize: '0.7rem' }}
          />
          <Typography variant="caption" color="text.secondary">→</Typography>
          <Chip
            label={params.row.targetBranch}
            size="small"
            sx={{ height: 22, fontFamily: 'monospace', fontSize: '0.7rem' }}
          />
        </Stack>
      ),
    },
    {
      field: 'reviewStatus',
      headerName: 'Review',
      width: 160,
      renderCell: (params) => getReviewStatusChip(params.value),
    },
    {
      field: 'checksStatus',
      headerName: 'Checks',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => getChecksIndicator(params.value),
    },
    {
      field: 'author',
      headerName: 'Author',
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
            {params.value.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: 'reviewers',
      headerName: 'Reviewers',
      width: 120,
      renderCell: (params) => (
        params.value.length > 0 ? (
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.7rem' } }}>
            {params.value.map((reviewer: { name: string }) => (
              <Tooltip key={reviewer.name} title={reviewer.name}>
                <Avatar>{reviewer.name.charAt(0)}</Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
        ) : (
          <Typography variant="caption" color="text.secondary">None</Typography>
        )
      ),
    },
    {
      field: 'comments',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        params.value > 0 && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">{params.value}</Typography>
          </Stack>
        )
      ),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      width: 120,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary">
          {params.value}
        </Typography>
      ),
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={cdsDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="new-pr"
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => {/* Create new PR */}}
            >
              New Pull Request
            </Button>,
            <Button
              key="refresh"
              variant="outlined"
              size="medium"
              startIcon={isFetching ? <CircularProgress size={18} /> : <RefreshIcon />}
              onClick={handleRefresh}
              disabled={isFetching}
            >
              {isFetching ? 'Refreshing...' : 'Refresh'}
            </Button>,
          ]}
        >
          <PageHeaderComposable.Title>Pull Requests</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Review and manage pull requests for the repository
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar */}
      <Toolbar level="level1">
        <Toolbar.Section grow spacing={2}>
          <TextField
            size="medium"
            placeholder="Search pull requests..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ width: 350 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchValue('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Toolbar.Section>

        <Toolbar.Section spacing={1}>
          <Chip
            label={`All (${prsData.length})`}
            onClick={() => setStatusFilter('all')}
            color={statusFilter === 'all' ? 'primary' : 'default'}
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<BranchIcon sx={{ fontSize: 16 }} />}
            label={`Open (${statusCounts.open || 0})`}
            onClick={() => setStatusFilter('open')}
            color={statusFilter === 'open' ? 'success' : 'default'}
            variant={statusFilter === 'open' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<MergeIcon sx={{ fontSize: 16 }} />}
            label={`Merged (${statusCounts.merged || 0})`}
            onClick={() => setStatusFilter('merged')}
            color={statusFilter === 'merged' ? 'default' : 'default'}
            variant={statusFilter === 'merged' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<CancelIcon sx={{ fontSize: 16 }} />}
            label={`Closed (${statusCounts.closed || 0})`}
            onClick={() => setStatusFilter('closed')}
            color={statusFilter === 'closed' ? 'error' : 'default'}
            variant={statusFilter === 'closed' ? 'filled' : 'outlined'}
          />
          <Chip
            icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
            label={`Draft (${statusCounts.draft || 0})`}
            onClick={() => setStatusFilter('draft')}
            color={statusFilter === 'draft' ? 'warning' : 'default'}
            variant={statusFilter === 'draft' ? 'filled' : 'outlined'}
          />
        </Toolbar.Section>
      </Toolbar>

      {isError && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          Failed to fetch pull requests: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Current Branch Banner */}
      <Box sx={{ px: 3, pt: 2 }}>
        <CurrentBranchBanner
          branchName={localGitInfo?.currentBranch}
          status={currentBranchData?.status}
          aheadBy={currentBranchData?.aheadBy}
          behindBy={currentBranchData?.behindBy}
          isClean={localGitInfo?.isClean}
          uncommittedChanges={localGitInfo?.uncommittedChanges}
          loading={isLoading}
          worktreeCount={worktrees?.length}
          onWorktreesClick={() => navigate('/repo/worktrees')}
        />
      </Box>

      {/* Summary Stats */}
      <Box sx={{ px: 3, py: 2 }}>
        <Stack direction="row" spacing={2}>
          <Paper elevation={0} sx={{ px: 2, py: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Open</Typography>
            <Typography variant="h6" fontWeight={600} color="success.main">
              {isLoading ? <Skeleton width={30} /> : statusCounts.open || 0}
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ px: 2, py: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Ready to merge</Typography>
            <Typography variant="h6" fontWeight={600} color="info.main">
              {isLoading ? <Skeleton width={30} /> : prsData.filter(pr => pr.status === 'open' && pr.reviewStatus === 'approved' && pr.checksStatus === 'passing').length}
            </Typography>
          </Paper>
          <Paper elevation={0} sx={{ px: 2, py: 1.5, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">Needs review</Typography>
            <Typography variant="h6" fontWeight={600} color="warning.main">
              {isLoading ? <Skeleton width={30} /> : prsData.filter(pr => pr.status === 'open' && (pr.reviewStatus === 'pending' || pr.reviewStatus === 'review_required')).length}
            </Typography>
          </Paper>
        </Stack>
      </Box>

      {/* Data Grid */}
      <Box sx={{ px: 3, pb: 3 }}>
        {isLoading ? (
          <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading pull requests...
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <DataGrid
              rows={filteredPRs}
              columns={columns}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              sx={{
                border: 'none',
                '& .MuiDataGrid-cell': {
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                },
                '& .MuiDataGrid-columnHeaders': {
                  bgcolor: 'background.default',
                  borderBottom: 1,
                  borderColor: 'divider',
                },
                '& .MuiDataGrid-row:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              getRowHeight={() => 'auto'}
            />
          </Paper>
        )}
      </Box>
    </Box>
  );
}
