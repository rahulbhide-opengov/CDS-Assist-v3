import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Stack,
  LinearProgress,
  Chip,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { CommunityInspectionMetrics } from '../../types/inspection';

interface CommunityMetricsProps {
  metrics: CommunityInspectionMetrics;
  onViewDetails?: (category: string) => void;
  onExportData?: () => void;
}

export const CommunityMetrics: React.FC<CommunityMetricsProps> = ({
  metrics,
  onViewDetails,
  onExportData,
}) => {
  const theme = useTheme();

  // Chart colors derived from theme palette
  const statusData = [
    { name: 'Passed', value: metrics.totalPassed, color: theme.palette.success.main },
    { name: 'Failed', value: metrics.totalFailed, color: theme.palette.error.main },
    { name: 'Pending', value: metrics.totalPending, color: theme.palette.warning.main },
    { name: 'Cancelled', value: metrics.totalCancelled, color: theme.palette.grey[500] },
  ];

  const typeData = Object.entries(metrics.byType)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
    }));

  // Chart color palette derived from theme
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
  ];

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2, border: 1, borderColor: 'divider' }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <DashboardIcon color="primary" />
            <Typography variant="h6">Community Inspection Dashboard</Typography>
          </Stack>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={onExportData}
          >
            Export Data
          </Button>
        </Stack>

        {/* Key Metrics Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="caption">
                      Total Scheduled
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {metrics.totalScheduled}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                      <TrendingUpIcon fontSize="small" color="success" />
                      <Typography variant="caption" color="success.main">
                        {metrics.today} today
                      </Typography>
                    </Stack>
                  </Box>
                  <AssignmentIcon sx={{ fontSize: 40, color: 'primary.light' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="caption">
                      Completed
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="success.main">
                      {metrics.totalCompleted}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        {Math.round(metrics.averagePassRate * 100)}% pass rate
                      </Typography>
                    </Stack>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 40, color: 'success.light' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="caption">
                      Failed
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="error.main">
                      {metrics.totalFailed}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                      <Typography variant="caption" color="error.main">
                        {Math.round((metrics.totalFailed / metrics.totalCompleted) * 100)}% fail rate
                      </Typography>
                    </Stack>
                  </Box>
                  <ErrorIcon sx={{ fontSize: 40, color: 'error.light' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="text.secondary" gutterBottom variant="caption">
                      This Week
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="primary.main">
                      {metrics.thisWeek}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                      <Typography variant="caption">
                        Inspections
                      </Typography>
                    </Stack>
                  </Box>
                  <PendingIcon sx={{ fontSize: 40, color: 'warning.light' }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          {/* Status Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Inspection Results Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Type Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 2 }}>
                Inspections by Type
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Inspector Performance */}
        <Paper elevation={0} sx={{ p: 2, mt: 3, border: 1, borderColor: 'divider' }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <GroupIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="medium">
              Inspector Workload
            </Typography>
          </Stack>
          <List>
            {Object.entries(metrics.byInspector)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([inspector, count]) => {
                const maxCount = Math.max(...Object.values(metrics.byInspector));
                const percentage = (count / maxCount) * 100;
                return (
                  <ListItem key={inspector} divider>
                    <ListItemText
                      primary={inspector}
                      secondary={
                        <Stack spacing={1} sx={{ mt: 1 }}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption">{count} inspections</Typography>
                            <Typography variant="caption" fontWeight="medium">
                              {Math.round(percentage)}% of max
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={percentage}
                            sx={{ height: 6, borderRadius: 1 }}
                          />
                        </Stack>
                      }
                    />
                  </ListItem>
                );
              })}
          </List>
        </Paper>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => onViewDetails?.('detailed')}
          >
            View Detailed Report
          </Button>
          <Button
            variant="outlined"
            onClick={() => onViewDetails?.('trends')}
          >
            View Trends
          </Button>
          <Button
            variant="outlined"
            onClick={() => onViewDetails?.('alerts')}
          >
            View Alerts
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};