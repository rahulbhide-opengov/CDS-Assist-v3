import React from 'react';
import { Box, Card, Typography, Stack, Chip, Divider, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface ScheduleEntry {
  id: string;
  day: string;
  date?: string;
  tasks: {
    id: string;
    title: string;
    time: string;
    duration: string;
    crew: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }[];
}

interface ScheduleCardProps {
  schedule: ScheduleEntry;
  onEdit?: (scheduleId: string) => void;
  onConfirm?: (scheduleId: string) => void;
  interactive?: boolean;
}

const priorityColors = {
  critical: 'error.main',
  high: 'warning.main',
  medium: 'info.main',
  low: 'success.main',
};

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  onEdit,
  onConfirm,
  interactive = true
}) => {
  return (
    <Card
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'all 0.2s',
        '&:hover': interactive ? {
          borderColor: 'primary.main',
          boxShadow: 2,
        } : {},
      }}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600 }}>
              {schedule.day}
            </Typography>
            {schedule.date && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({schedule.date})
              </Typography>
            )}
          </Stack>
          {interactive && (
            <Stack direction="row" spacing={0.5}>
              {onEdit && (
                <IconButton size="small" onClick={() => onEdit(schedule.id)}>
                  <EditIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
              {onConfirm && (
                <IconButton
                  size="small"
                  onClick={() => onConfirm(schedule.id)}
                  sx={{
                    color: 'success.main',
                    '&:hover': { bgcolor: 'success.light' }
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Stack>
          )}
        </Stack>

        <Divider />

        {/* Tasks */}
        <Stack spacing={1.5}>
          {schedule.tasks.map((task, index) => (
            <Box
              key={task.id}
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
                borderLeft: '3px solid',
                borderLeftColor: priorityColors[task.priority],
              }}
            >
              <Stack spacing={1}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {task.title}
                  </Typography>
                  <Chip
                    label={task.priority}
                    size="small"
                    sx={{
                      height: '18px',
                      fontSize: '10px',
                      bgcolor: `${priorityColors[task.priority]}20`,
                      color: priorityColors[task.priority],
                      fontWeight: 600,
                    }}
                  />
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                  <Stack direction="row" spacing={2}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {task.time}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {task.duration}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      {task.crew}
                    </Typography>
                  </Stack>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(`View task: ${task.id}`);
                      window.open(`#/task/${task.id}`, '_blank');
                    }}
                    sx={{
                      padding: 0.5,
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export const ScheduleSummaryCard: React.FC<{
  totalTasks: number;
  totalHours: number;
  crewsAssigned: number;
  utilization: number;
  onPublish?: () => void;
}> = ({ totalTasks, totalHours, crewsAssigned, utilization, onPublish }) => {
  return (
    <Card
      sx={{
        p: 3,
        bgcolor: 'background.secondary',
        color: 'text.primary',
      }}
    >
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'inherit' }}>
          Schedule Summary
        </Typography>

        <Stack direction="row" spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'inherit' }}>
              {totalTasks}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Tasks Scheduled
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'inherit' }}>
              {totalHours}h
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Work Hours
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'inherit' }}>
              {crewsAssigned}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Crews Assigned
            </Typography>
          </Box>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, color: 'inherit' }}>
              {utilization}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Utilization
            </Typography>
          </Box>
        </Stack>

        {onPublish && (
          <Box sx={{ pt: 1 }}>
            <Box
              onClick={onPublish}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                p: 1.5,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                borderRadius: 1,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  bgcolor: 'primary.dark',
                },
              }}
            >
              Publish Schedule
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
        )}
      </Stack>
    </Card>
  );
};