import React from 'react';
import { Box, Card, Typography, Stack, LinearProgress, Chip, Avatar, AvatarGroup, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export interface CrewInfo {
  id: string;
  name: string;
  availableHours: number;
  totalHours: number;
  members?: number;
  skills?: string[];
  status: 'available' | 'limited' | 'unavailable';
}

interface CrewCardProps {
  crew: CrewInfo;
  selected?: boolean;
  onSelect?: (crewId: string) => void;
}

const statusConfig = {
  available: {
    color: 'success.main',
    bgcolor: 'success.light',
    label: 'Available',
  },
  limited: {
    color: 'warning.main',
    bgcolor: 'warning.light',
    label: 'Limited',
  },
  unavailable: {
    color: 'error.main',
    bgcolor: 'error.light',
    label: 'At Capacity',
  },
};

export const CrewCard: React.FC<CrewCardProps> = ({ crew, selected = false, onSelect }) => {
  const config = statusConfig[crew.status];
  const utilization = ((crew.totalHours - crew.availableHours) / crew.totalHours) * 100;

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`View crew: ${crew.id}`);
    // Placeholder for navigation
    window.open(`#/crew/${crew.id}`, '_blank');
  };

  return (
    <Card
      sx={{
        p: 2,
        cursor: onSelect && crew.status !== 'unavailable' ? 'pointer' : 'default',
        border: '1px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        bgcolor: selected ? 'rgba(91, 95, 199, 0.04)' : 'background.paper',
        opacity: crew.status === 'unavailable' ? 0.7 : 1,
        transition: 'all 0.2s',
        '&:hover': onSelect && crew.status !== 'unavailable' ? {
          borderColor: 'primary.main',
          bgcolor: 'rgba(91, 95, 199, 0.04)',
        } : {},
      }}
      onClick={() => crew.status !== 'unavailable' && onSelect?.(crew.id)}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
            {crew.name}
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

        {/* Capacity Bar */}
        <Box>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Capacity
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {crew.availableHours}h available
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={utilization}
            sx={{
              height: 6,
              borderRadius: 1,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: utilization > 80 ? 'error.main' : utilization > 60 ? 'warning.main' : 'success.main',
              },
            }}
          />
        </Box>

        {/* Skills */}
        {crew.skills && crew.skills.length > 0 && (
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {crew.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                size="small"
                variant="outlined"
                sx={{
                  height: '20px',
                  fontSize: '10px',
                  borderColor: 'divider',
                }}
              />
            ))}
          </Stack>
        )}

        {/* Team Members */}
        {crew.members && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '10px' } }}>
              {Array.from({ length: crew.members }).map((_, i) => (
                <Avatar key={i} sx={{ bgcolor: 'grey.400' }}>
                  {String.fromCharCode(65 + i)}
                </Avatar>
              ))}
            </AvatarGroup>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {crew.members} members
            </Typography>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};