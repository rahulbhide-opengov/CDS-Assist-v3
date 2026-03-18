/**
 * BranchesPage Component
 *
 * Displays a comprehensive table view of all git branches with status,
 * filtering, and management capabilities.
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
  ContentCopy as CopyIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Sync as SyncIcon,
  Circle as CircleIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type { BranchStatus, BranchInfo } from '../components/dashboard';
import { BranchCompareChart } from '../components/dashboard';
import { useGitHubBranches, useIsGitHubConfigured } from '../hooks/useGitHub';
import { useQueryClient } from '@tanstack/react-query';
import { githubKeys } from '../hooks/useGitHub';
import { useLocalGitInfo, useGitWorktrees } from '../hooks/useLocalGit';
import CurrentBranchBanner from '../components/CurrentBranchBanner';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Branch table row interface
interface BranchTableRow {
  id: string;
  name: string;
  status: BranchStatus;
  isDefault?: boolean;
  isCurrent?: boolean;
  aheadBy?: number;
  behindBy?: number;
  lastCommitDate: string;
  author: string;
  commitMessage: string;
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

const columns: GridColDef<BranchTableRow>[] = [
  {
    field: 'name',
    headerName: 'Branch Name',
    flex: 1.5,
    minWidth: 250,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography
          variant="body2"
          fontWeight={params.row.isCurrent ? 600 : 400}
          sx={{ fontFamily: 'monospace' }}
        >
          {params.value}
        </Typography>
        {params.row.isDefault && (
          <Chip
            label="default"
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        )}
        {params.row.isCurrent && (
          <Chip
            label="current"
            size="small"
            color="primary"
            sx={{ height: 20, fontSize: '0.7rem' }}
          />
        )}
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => {
      const status = params.value as BranchStatus;
      const color = getStatusColor(status);
      return (
        <Chip
          icon={getStatusIcon(status)}
          label={getStatusLabel(status)}
          size="small"
          color={color}
          sx={{ fontWeight: 500 }}
        />
      );
    },
  },
  {
    field: 'sync',
    headerName: 'Sync Status',
    width: 140,
    valueGetter: (value, row) => {
      if (row.aheadBy && row.behindBy) {
        return `+${row.aheadBy}/-${row.behindBy}`;
      } else if (row.aheadBy) {
        return `+${row.aheadBy} ahead`;
      } else if (row.behindBy) {
        return `-${row.behindBy} behind`;
      }
      return 'Up to date';
    },
    renderCell: (params) => (
      <Typography variant="body2" color="text.secondary">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'author',
    headerName: 'Author',
    width: 120,
    renderCell: (params) => (
      <Typography variant="body2">{params.value}</Typography>
    ),
  },
  {
    field: 'commitMessage',
    headerName: 'Last Commit',
    flex: 2,
    minWidth: 300,
    renderCell: (params) => (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'lastCommitDate',
    headerName: 'Date',
    width: 120,
    renderCell: (params) => (
      <Typography variant="body2" color="text.secondary">
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'actions',
    headerName: '',
    width: 60,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Tooltip title="Copy branch name">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(params.row.name);
          }}
        >
          <CopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ),
  },
];

export const BranchesPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<BranchStatus | 'all'>('all');

  // Check if GitHub is configured
  const isGitHubConfigured = useIsGitHubConfigured();

  // Fetch branches from GitHub
  const {
    data: githubBranches,
    isLoading,
    isError,
    error,
    isFetching,
  } = useGitHubBranches({ enabled: isGitHubConfigured });

  // Fetch local git info for current branch
  const { data: localGitInfo } = useLocalGitInfo();
  const { data: worktrees } = useGitWorktrees();

  // Transform GitHub branches to table rows (no mock fallback)
  const branchesData: BranchTableRow[] = React.useMemo(() => {
    if (githubBranches && githubBranches.length > 0) {
      return githubBranches.map((branch, index) => ({
        id: branch.sha || String(index),
        name: branch.name,
        status: branch.status,
        isDefault: branch.isDefault,
        isCurrent: localGitInfo?.currentBranch === branch.name,
        aheadBy: branch.aheadBy,
        behindBy: branch.behindBy,
        lastCommitDate: branch.lastCommitDate,
        author: branch.lastCommitAuthor,
        commitMessage: branch.lastCommitMessage,
      }));
    }
    return [];
  }, [githubBranches, localGitInfo?.currentBranch]);

  // Get current branch data for banner
  const currentBranchData = branchesData.find((b) => b.isCurrent);

  const filteredBranches = branchesData.filter((branch) => {
    const matchesSearch =
      searchValue === '' ||
      branch.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      branch.author?.toLowerCase().includes(searchValue.toLowerCase()) ||
      branch.commitMessage?.toLowerCase().includes(searchValue.toLowerCase());

    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = branchesData.reduce(
    (acc, branch) => {
      acc[branch.status] = (acc[branch.status] || 0) + 1;
      return acc;
    },
    {} as Record<BranchStatus, number>
  );

  // Handle refresh
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: githubKeys.branches() });
  };

  return (
    <Box>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="home"
              variant="outlined"
              size="medium"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              Back to Home
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
          <PageHeaderComposable.Title>Branches</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            View and manage all repository branches
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar */}
      <Toolbar level="level1">
        <Toolbar.Section grow spacing={2}>
          {/* Search Field */}
          <TextField
            size="medium"
            placeholder="Search branches by name, author, or commit..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ width: 400 }}
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
          {/* Status filter chips */}
          <Chip
            label={`All (${branchesData.length})`}
            onClick={() => setStatusFilter('all')}
            color={statusFilter === 'all' ? 'primary' : 'default'}
            variant={statusFilter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Clean (${statusCounts.clean || 0})`}
            onClick={() => setStatusFilter('clean')}
            color={statusFilter === 'clean' ? 'success' : 'default'}
            variant={statusFilter === 'clean' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Modified (${statusCounts.modified || 0})`}
            onClick={() => setStatusFilter('modified')}
            color={statusFilter === 'modified' ? 'warning' : 'default'}
            variant={statusFilter === 'modified' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Ahead (${statusCounts.ahead || 0})`}
            onClick={() => setStatusFilter('ahead')}
            color={statusFilter === 'ahead' ? 'info' : 'default'}
            variant={statusFilter === 'ahead' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Behind (${statusCounts.behind || 0})`}
            onClick={() => setStatusFilter('behind')}
            color={statusFilter === 'behind' ? 'warning' : 'default'}
            variant={statusFilter === 'behind' ? 'filled' : 'outlined'}
          />
        </Toolbar.Section>

        <Toolbar.Section>
          <Tooltip title={isFetching ? 'Refreshing...' : 'Refresh'}>
            <span>
              <IconButton onClick={handleRefresh} disabled={isFetching}>
                {isFetching ? <CircularProgress size={20} /> : <RefreshIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Toolbar.Section>
      </Toolbar>

      {isError && (
        <Alert severity="error" sx={{ mx: 3, mt: 2 }}>
          Failed to fetch branches: {error?.message || 'Unknown error'}
        </Alert>
      )}

      {/* Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        {/* Current Branch Banner */}
        <Box sx={{ mt: 2 }}>
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
        {/* Summary Cards */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, minWidth: 120 }}>
            <Typography variant="body1" fontWeight={700} fontSize="1.5rem">
              {isLoading ? <Skeleton width={40} /> : branchesData.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Branches
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 120 }}>
            <Typography variant="body1" fontWeight={700} fontSize="1.5rem" color="success.main">
              {statusCounts.clean || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clean
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 120 }}>
            <Typography variant="body1" fontWeight={700} fontSize="1.5rem" color="warning.main">
              {(statusCounts.modified || 0) + (statusCounts.behind || 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Need Attention
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, minWidth: 120 }}>
            <Typography variant="body1" fontWeight={700} fontSize="1.5rem" color="error.main">
              {statusCounts.diverged || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Diverged
            </Typography>
          </Paper>
        </Stack>

        {/* Branch Comparison Chart */}
        {!isLoading && branchesData.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <BranchCompareChart
              branches={branchesData.map((b): BranchInfo => ({
                name: b.name,
                status: b.status,
                isDefault: b.isDefault,
                isCurrent: b.isCurrent,
                aheadBy: b.aheadBy,
                behindBy: b.behindBy,
                lastCommitDate: b.lastCommitDate,
              }))}
              showOnlyDiverged={false}
              maxBranches={8}
            />
          </Box>
        )}

        {/* Data Grid */}
        {isLoading ? (
          <Paper sx={{ p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <Stack alignItems="center" spacing={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Loading branches...
              </Typography>
            </Stack>
          </Paper>
        ) : (
          <DataGrid
            rows={filteredBranches}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
              sorting: {
                sortModel: [{ field: 'lastCommitDate', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
              '& .MuiDataGrid-cell': {
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default BranchesPage;
