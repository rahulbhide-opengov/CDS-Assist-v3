import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import type { InspectionCapacity } from '../../types/inspection';

interface InspectorCapacityProps {
  capacityData: InspectionCapacity[];
  weekStartDate?: string;
  onAssignInspection?: (inspectorId: string) => void;
  onViewDetails?: (inspectorId: string) => void;
}

export const InspectorCapacity: React.FC<InspectorCapacityProps> = ({
  capacityData,
  weekStartDate,
  onAssignInspection,
  onViewDetails,
}) => {
  const sortedByAvailability = [...capacityData].sort(
    (a, b) => b.availableHours - a.availableHours
  );

  const getUtilizationStatus = (utilization: number) => {
    if (utilization < 50) return { color: 'success', label: 'Low', icon: <CheckCircleIcon /> };
    if (utilization < 80) return { color: 'warning', label: 'Medium', icon: <TrendingUpIcon /> };
    return { color: 'error', label: 'High', icon: <WarningAmberIcon /> };
  };

  const columns: GridColDef[] = [
    {
      field: 'inspectorName',
      headerName: 'Inspector',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar sx={{ width: 24, height: 24 }}>
            <PersonIcon fontSize="small" />
          </Avatar>
          <Typography variant="body2">{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: 'utilization',
      headerName: 'Utilization',
      width: 150,
      renderCell: (params) => {
        const status = getUtilizationStatus(params.value);
        return (
          <Box sx={{ width: '100%' }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
              <Typography variant="caption">{Math.round(params.value)}%</Typography>
              <Chip
                label={status.label}
                size="small"
                color={status.color as any}
                elevation={0}
                sx={{ height: 18 }}
              />
            </Stack>
            <LinearProgress
              variant="determinate"
              value={params.value}
              color={status.color as any}
              sx={{ height: 4 }}
            />
          </Box>
        );
      },
    },
    {
      field: 'availableHours',
      headerName: 'Available',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium" color="success.main">
          {params.value}h
        </Typography>
      ),
    },
    {
      field: 'currentLoad',
      headerName: 'Scheduled',
      width: 100,
      renderCell: (params) => <Typography variant="body2">{params.value}h</Typography>,
    },
    {
      field: 'upcomingInspections',
      headerName: 'Tasks',
      width: 80,
      renderCell: (params) => (
        <Chip label={params.value} size="small" icon={<AssignmentIcon />} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => onAssignInspection?.(params.row.inspectorId)}
          >
            Assign
          </Button>
        </Stack>
      ),
    },
  ];

  // Calculate summary metrics
  const totalCapacity = capacityData.reduce((sum, d) => sum + d.weeklyCapacity, 0);
  const totalScheduled = capacityData.reduce((sum, d) => sum + d.currentLoad, 0);
  const totalAvailable = capacityData.reduce((sum, d) => sum + d.availableHours, 0);
  const averageUtilization =
    capacityData.reduce((sum, d) => sum + d.utilization, 0) / capacityData.length;

  const mostAvailable = sortedByAvailability[0];
  const fullyBooked = capacityData.filter((d) => d.utilization >= 100);

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 2, border: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">Inspector Capacity Summary</Typography>
          {weekStartDate && (
            <Typography variant="body2" color="text.secondary">
              Week of {new Date(weekStartDate).toLocaleDateString()}
            </Typography>
          )}
        </Stack>

        {/* Summary Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, backgroundColor: 'background.default', height: '100%', border: 1, borderColor: 'divider' }}
            >
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Team Utilization
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="h5" fontWeight="medium">
                    {Math.round(averageUtilization)}%
                  </Typography>
                  {averageUtilization > 80 ? (
                    <TrendingUpIcon color="error" fontSize="small" />
                  ) : (
                    <CheckCircleIcon color="success" fontSize="small" />
                  )}
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={averageUtilization}
                  color={averageUtilization > 80 ? 'error' : 'primary'}
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, backgroundColor: 'background.default', height: '100%', border: 1, borderColor: 'divider' }}
            >
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Available Hours
                </Typography>
                <Typography variant="h5" fontWeight="medium" color="success.main">
                  {totalAvailable}h
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of {totalCapacity}h total
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, backgroundColor: 'background.default', height: '100%', border: 1, borderColor: 'divider' }}
            >
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Most Available
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="body1" fontWeight="medium">
                    {mostAvailable?.inspectorName}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="success.main">
                  {mostAvailable?.availableHours}h available
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              elevation={0}
              sx={{ p: 2, backgroundColor: 'background.default', height: '100%', border: 1, borderColor: 'divider' }}
            >
              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary">
                  Fully Booked
                </Typography>
                <Typography variant="h5" fontWeight="medium" color="error.main">
                  {fullyBooked.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  inspectors at capacity
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Alert for high utilization */}
        {averageUtilization > 80 && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              backgroundColor: 'warning.light',
              border: 1,
              borderColor: 'warning.main',
              borderLeft: 4,
              borderLeftColor: 'warning.main',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <WarningAmberIcon color="warning" />
              <Box>
                <Typography variant="subtitle2" fontWeight="medium">
                  High Team Utilization Alert
                </Typography>
                <Typography variant="body2">
                  Team is at {Math.round(averageUtilization)}% capacity. Consider redistributing
                  tasks or scheduling into next week.
                </Typography>
              </Box>
            </Stack>
          </Paper>
        )}

        {/* Data Grid */}
        <DataGrid
          rows={capacityData}
          columns={columns}
          getRowId={(row) => row.inspectorId}
          autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: {
              sortModel: [{ field: 'availableHours', sort: 'desc' }],
            },
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: 'none',
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
          }}
        />

        {/* Recommendations */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <InfoIcon color="info" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="medium">
              Scheduling Recommendations
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {mostAvailable && (
              <Typography variant="body2">
                • Assign new inspections to <strong>{mostAvailable.inspectorName}</strong> ({mostAvailable.availableHours}h available)
              </Typography>
            )}
            {fullyBooked.length > 0 && (
              <Typography variant="body2">
                • Avoid assigning to: {fullyBooked.map(i => i.inspectorName).join(', ')} (at capacity)
              </Typography>
            )}
            <Typography variant="body2">
              • Consider load balancing to maintain team utilization below 80%
            </Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};