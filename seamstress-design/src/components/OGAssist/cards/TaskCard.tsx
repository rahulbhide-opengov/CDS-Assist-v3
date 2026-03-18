import React from 'react';
import { Box, Card, Typography, Chip, Stack, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface TaskInfo {
  id: string;
  title: string;
  location?: string;
  estimatedHours: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type?: string;
  status?: string;
}

interface TaskCardProps {
  task: TaskInfo;
  selected?: boolean;
  onSelect?: (taskId: string) => void;
}

const priorityConfig = {
  critical: {
    color: 'error.main',
    bgcolor: 'error.light',
    label: 'Critical',
  },
  high: {
    color: 'warning.main',
    bgcolor: 'warning.light',
    label: 'High Priority',
  },
  medium: {
    color: 'info.main',
    bgcolor: 'info.light',
    label: 'Medium Priority',
  },
  low: {
    color: 'success.main',
    bgcolor: 'success.light',
    label: 'Low Priority',
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, selected = false, onSelect }) => {
  const config = priorityConfig[task.priority];

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`View task: ${task.id}`);
    // Placeholder for navigation
    window.open(`#/task/${task.id}`, '_blank');
  };

  return (
    <Card
      sx={{
        p: 2,
        cursor: onSelect ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: selected ? config.color : 'divider',
        bgcolor: selected ? config.bgcolor : 'background.paper',
        transition: 'all 0.2s',
        '&:hover': onSelect ? {
          borderColor: config.color,
          bgcolor: config.bgcolor,
          transform: 'translateX(4px)',
        } : {},
      }}
      onClick={() => onSelect?.(task.id)}
    >
      <Stack spacing={1.5}>
        {/* Header with Priority */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
            {task.title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip
              label={config.label}
              size="small"
              sx={{
                bgcolor: config.bgcolor,
                color: config.color,
                fontWeight: 500,
                fontSize: '11px',
              }}
            />
            <IconButton
              size="small"
              onClick={handleViewClick}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Details */}
        <Stack direction="row" spacing={2}>
          {task.location && (
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
              {task.location}
            </Typography>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
            {task.estimatedHours} hours
          </Typography>
        </Stack>

        {/* Type Badge */}
        {task.type && (
          <Box>
            <Chip
              label={task.type}
              size="small"
              variant="outlined"
              sx={{
                height: '20px',
                fontSize: '11px',
                borderColor: 'divider',
              }}
            />
          </Box>
        )}
      </Stack>
    </Card>
  );
};