/**
 * ProjectCard Component
 *
 * Displays a project summary card with status, metadata, and contacts
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Avatar,
  AvatarGroup,
  useTheme,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Project, ProjectStatus } from '../../../types/procurement';

export interface ProjectCardProps {
  project: Project;
}

/**
 * Get color for project status
 */
const getStatusColor = (status: ProjectStatus): 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' => {
  switch (status) {
    case 'Draft':
      return 'default';
    case 'Review':
      return 'info';
    case 'Final':
      return 'primary';
    case 'Open':
      return 'success';
    case 'Evaluation':
      return 'secondary';
    case 'Award Pending':
      return 'warning';
    case 'Closed':
      return 'default';
    default:
      return 'default';
  }
};

/**
 * Format date for display
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const statusColor = getStatusColor(project.status);

  const handleClick = () => {
    navigate(`/procurement/projects/${project.projectId}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      elevation={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`${project.title || 'Untitled'}, ${project.status} status, ${project.department.name} department, Project ID ${project.projectId}. Press Enter to view details.`}
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        transition: 'all 0.2s ease-in-out',
        cursor: 'pointer',
        '&:hover, &:focus': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: theme.palette.primary.main,
        },
        '&:focus': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Status Badge */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip
            label={project.status}
            color={statusColor}
            size="small"
            sx={{ fontWeight: 500 }}
          />
          {project.isEmergency && (
            <Chip
              label="Emergency"
              color="error"
              size="small"
              variant="outlined"
            />
          )}
        </Stack>

        {/* Title */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {project.title || 'Untitled'}
        </Typography>

        {/* Metadata Row */}
        <Stack
          direction="row"
          spacing={2}
          divider={<Box sx={{ width: 1, height: 16, bgcolor: theme.palette.divider }} />}
          sx={{ mb: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            {project.template.type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {project.department.name}
          </Typography>
        </Stack>

        {/* Contacts and Date */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          justifyContent="space-between"
        >
          <AvatarGroup
            max={2}
            sx={{
              '& .MuiAvatar-root': {
                width: 28,
                height: 28,
                fontSize: '0.875rem',
                border: `2px solid ${theme.palette.background.paper}`,
              },
            }}
          >
            <Avatar
              alt={`${project.projectContact.firstName} ${project.projectContact.lastName}`}
              src={project.projectContact.avatarUrl}
              sx={{ bgcolor: theme.palette.primary.main }}
            >
              {project.projectContact.firstName[0]}{project.projectContact.lastName[0]}
            </Avatar>
            {project.procurementContact && (
              <Avatar
                alt={`${project.procurementContact.firstName} ${project.procurementContact.lastName}`}
                src={project.procurementContact.avatarUrl}
                sx={{ bgcolor: theme.palette.secondary.main }}
              >
                {project.procurementContact.firstName[0]}{project.procurementContact.lastName[0]}
              </Avatar>
            )}
          </AvatarGroup>

          <Typography variant="caption" color="text.secondary">
            {formatDate(project.lastUpdate)}
          </Typography>
        </Stack>

        {/* Project ID */}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Project ID: {project.projectId}
        </Typography>
      </CardContent>
    </Card>
  );
};
