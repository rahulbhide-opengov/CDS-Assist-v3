import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Chip,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TableChartIcon from '@mui/icons-material/TableChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import type { EAMScheduleDraft, EAMTask, EAMCrew, EAMConflict } from '../../types/opengov/eam';

interface ScheduleProposalProps {
  schedule: EAMScheduleDraft;
  tasks: EAMTask[];
  crews: EAMCrew[];
  onAcceptSchedule?: () => void;
  onRejectSchedule?: () => void;
  onReschedule?: () => void;
  onEditAssignment?: (slotId: string, crewId: string) => void;
  onResolveConflict?: (conflictId: string, fixOptionId: string) => void;
}

export const ScheduleProposal: React.FC<ScheduleProposalProps> = ({
  schedule,
  tasks,
  crews,
  onAcceptSchedule,
  onRejectSchedule,
  onReschedule,
  onEditAssignment,
  onResolveConflict
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [expandedConflicts, setExpandedConflicts] = useState<Set<string>>(new Set());

  const toggleConflictExpansion = (conflictId: string) => {
    const newExpanded = new Set(expandedConflicts);
    if (newExpanded.has(conflictId)) {
      newExpanded.delete(conflictId);
    } else {
      newExpanded.add(conflictId);
    }
    setExpandedConflicts(newExpanded);
  };

  const getTaskById = (taskId: string) => tasks.find(t => t.id === taskId);
  const getCrewById = (crewId: string) => crews.find(c => c.id === crewId);

  const ConflictBanner = ({ conflict }: { conflict: EAMConflict }) => {
    const task = getTaskById(conflict.taskId);
    const isExpanded = expandedConflicts.has(conflict.id);

    return (
      <Alert
        severity={conflict.severity}
        sx={{ mb: 2 }}
        icon={conflict.severity === 'error' ? <ErrorIcon /> : <WarningAmberIcon />}
        action={
          <IconButton
            size="small"
            onClick={() => toggleConflictExpansion(conflict.id)}
          >
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      >
        <AlertTitle>
          {conflict.conflictType.charAt(0).toUpperCase() + conflict.conflictType.slice(1)} Conflict - {task?.taskId}
        </AlertTitle>
        {conflict.description}

        <Collapse in={isExpanded}>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Fix Options:
            </Typography>
            <List dense>
              {conflict.fixOptions.map(option => (
                <ListItem key={option.id}>
                  <ListItemIcon>
                    <CheckCircleIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={option.action}
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography variant="caption">{option.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Impact: {option.impact}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption">
                            Confidence: {Math.round(option.confidence * 100)}%
                          </Typography>
                          <Button
                            size="small"
                            onClick={() => onResolveConflict?.(conflict.id, option.id)}
                          >
                            Apply Fix
                          </Button>
                        </Stack>
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Collapse>
      </Alert>
    );
  };

  const ScheduleTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Task</TableCell>
            <TableCell>Asset</TableCell>
            <TableCell>Assigned Crew</TableCell>
            <TableCell>Equipment</TableCell>
            <TableCell>Time Slot</TableCell>
            <TableCell>Zone</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedule.slots.map(slot => {
            const task = getTaskById(slot.taskId);
            getCrewById(slot.crewId);

            return (
              <TableRow key={slot.id}>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {task?.taskId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{task?.assetName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task?.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select
                      value={slot.crewId}
                      onChange={(e) => onEditAssignment?.(slot.id, e.target.value)}
                    >
                      {crews.map(c => (
                        <MenuItem key={c.id} value={c.id}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {slot.equipmentIds.length > 0 ? (
                    <Stack direction="row" spacing={0.5}>
                      {slot.equipmentIds.map(id => (
                        <Chip key={id} label={id} size="small" />
                      ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">None</Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography variant="body2">
                      {new Date(slot.startTime).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{slot.zone}</TableCell>
                <TableCell align="center">
                  <IconButton size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const CalendarView = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <Paper sx={{ p: 2, overflow: 'auto' }}>
        <Grid container>
          <Grid size={{ xs: 1 }}>
            <Box sx={{ height: 40 }} />
            {hours.map(hour => (
              <Box key={hour} sx={{ height: 60, borderTop: 1, borderColor: 'divider', pt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {hour}:00
                </Typography>
              </Box>
            ))}
          </Grid>
          {days.map((day) => (
            <Grid size={{ xs: 1.5 }} key={day}>
              <Box sx={{ height: 40, borderLeft: 1, borderColor: 'divider', pl: 1 }}>
                <Typography variant="subtitle2">{day}</Typography>
              </Box>
              {hours.map(hour => (
                <Box
                  key={hour}
                  sx={{
                    height: 60,
                    borderTop: 1,
                    borderLeft: 1,
                    borderColor: 'divider',
                    position: 'relative'
                  }}
                >
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  return (
    <Box>
      {schedule.conflicts.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            <WarningAmberIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Conflicts Detected ({schedule.conflicts.length})
          </Typography>
          {schedule.conflicts.map(conflict => (
            <ConflictBanner key={conflict.id} conflict={conflict} />
          ))}
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h6">
            {viewMode === 'table' ? 'Assignment Table' : 'Calendar View'}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<TableChartIcon />}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
              size="small"
              startIcon={<CalendarTodayIcon />}
              onClick={() => setViewMode('calendar')}
            >
              Calendar
            </Button>
          </Stack>
        </Stack>

        {viewMode === 'table' ? <ScheduleTable /> : <CalendarView />}
      </Box>

      <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Tasks Scheduled</Typography>
            <Typography variant="h4">{schedule.metrics.tasksScheduled}</Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Total Hours</Typography>
            <Typography variant="h4">{schedule.metrics.totalHours}h</Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Crew Utilization</Typography>
            <Typography variant="h4">{schedule.metrics.crewUtilization}%</Typography>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Equipment Utilization</Typography>
            <Typography variant="h4">{schedule.metrics.equipmentUtilization}%</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onReschedule}
          startIcon={<BuildIcon />}
        >
          Reschedule
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onRejectSchedule}
        >
          Reject Schedule
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onAcceptSchedule}
          startIcon={<CheckCircleIcon />}
        >
          Accept Schedule
        </Button>
      </Stack>
    </Box>
  );
};