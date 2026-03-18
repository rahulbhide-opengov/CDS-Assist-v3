import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  Stack,
  Button,
  Select,
  MenuItem,
  FormControl,
  Box,
  Typography,
  Checkbox
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ScheduleIcon from '@mui/icons-material/Schedule';
import type { EAMTask, TaskPriority, TaskSeverity } from '../../types/opengov/eam';

interface UnscheduledTasksTableProps {
  tasks: EAMTask[];
  onScheduleTasks?: (selectedTasks: string[]) => void;
  onPriorityChange?: (taskId: string, priority: TaskPriority) => void;
}

export const UnscheduledTasksTable: React.FC<UnscheduledTasksTableProps> = ({
  tasks,
  onScheduleTasks,
  onPriorityChange
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [orderBy, setOrderBy] = useState<keyof EAMTask>('dueDate');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState({
    severity: 'all',
    zone: 'all',
    dueSoon: false
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedTasks(tasks.map(t => t.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSort = (property: keyof EAMTask) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePriorityChange = (taskId: string, priority: TaskPriority) => {
    onPriorityChange?.(taskId, priority);
    if (!selectedTasks.includes(taskId)) {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const getSeverityColor = (severity: TaskSeverity): 'error' | 'warning' | 'info' | 'default' => {
    const colors: Record<TaskSeverity, 'error' | 'warning' | 'info' | 'default'> = {
      critical: 'error',
      major: 'warning',
      moderate: 'info',
      minor: 'default'
    };
    return colors[severity];
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.severity !== 'all' && task.severity !== filters.severity) return false;
    if (filters.zone !== 'all' && task.zone !== filters.zone) return false;
    if (filters.dueSoon) {
      const dueDate = new Date(task.dueDate);
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      if (dueDate > threeDaysFromNow) return false;
    }
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const zones = ['all', ...new Set(tasks.map(t => t.zone))];
  const severities = ['all', 'critical', 'major', 'moderate', 'minor'];

  return (
    <Box>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            displayEmpty
          >
            {severities.map(sev => (
              <MenuItem key={sev} value={sev}>
                {sev === 'all' ? 'All Severities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={filters.zone}
            onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
            displayEmpty
          >
            {zones.map(zone => (
              <MenuItem key={zone} value={zone}>
                {zone === 'all' ? 'All Zones' : zone}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Chip
          icon={<FilterListIcon />}
          label="Due Soon"
          onClick={() => setFilters({ ...filters, dueSoon: !filters.dueSoon })}
          color={filters.dueSoon ? 'primary' : 'default'}
          variant={filters.dueSoon ? 'filled' : 'outlined'}
        />

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          color="primary"
          startIcon={<ScheduleIcon />}
          disabled={selectedTasks.length === 0}
          onClick={() => onScheduleTasks?.(selectedTasks)}
        >
          Schedule Tasks ({selectedTasks.length})
        </Button>
      </Stack>

      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={selectedTasks.length > 0 && selectedTasks.length < tasks.length}
                  checked={tasks.length > 0 && selectedTasks.length === tasks.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'taskId'}
                  direction={orderBy === 'taskId' ? order : 'asc'}
                  onClick={() => handleSort('taskId')}
                >
                  Task ID
                </TableSortLabel>
              </TableCell>
              <TableCell>Asset</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'severity'}
                  direction={orderBy === 'severity' ? order : 'asc'}
                  onClick={() => handleSort('severity')}
                >
                  Severity
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'zone'}
                  direction={orderBy === 'zone' ? order : 'asc'}
                  onClick={() => handleSort('zone')}
                >
                  Zone
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'estimatedHours'}
                  direction={orderBy === 'estimatedHours' ? order : 'asc'}
                  onClick={() => handleSort('estimatedHours')}
                >
                  Est. Hours
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'dueDate'}
                  direction={orderBy === 'dueDate' ? order : 'asc'}
                  onClick={() => handleSort('dueDate')}
                >
                  Due Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow
                key={task.id}
                hover
                selected={selectedTasks.includes(task.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => handleTaskSelect(task.id)}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {task.taskId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {task.assetName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {task.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={task.severity}
                    size="small"
                    color={getSeverityColor(task.severity)}
                  />
                </TableCell>
                <TableCell>{task.zone}</TableCell>
                <TableCell align="right">{task.estimatedHours}h</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={task.priority}
                    onChange={(e) => handlePriorityChange(task.id, e.target.value as TaskPriority)}
                    sx={{ minWidth: 100 }}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                    <MenuItem value="urgent">Urgent</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};