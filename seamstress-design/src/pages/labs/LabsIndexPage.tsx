import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Science as ScienceIcon,
  AutoAwesome as AIIcon,
  Animation as AnimationIcon,
  Highlight as HighlightIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BaseLayout } from '../../components/BaseLayout';
import { labsLayoutConfig } from '../../config/labsNavConfig';

interface Experiment {
  id: string;
  name: string;
  description: string;
  path: string;
  status: 'active' | 'planned' | 'archived';
  tags: string[];
  icon: React.ReactNode;
}

const experiments: Experiment[] = [
  {
    id: 'ai-animations',
    name: 'AI Animations',
    description: 'Explore animation patterns for AI features including button animations, page highlights, and cohesive visual language',
    path: '/labs/ai-animations',
    status: 'active',
    tags: ['AI', 'Animation', 'UX'],
    icon: <AIIcon />,
  },
  {
    id: 'theme-editor',
    name: 'Theme Editor',
    description: 'Interactive theme customization and live preview',
    path: '/seamstress/theme-editor',
    status: 'active',
    tags: ['Theming', 'Design System'],
    icon: <AnimationIcon />,
  },
];

const getStatusColor = (status: Experiment['status']) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'planned':
      return 'warning';
    case 'archived':
      return 'default';
  }
};

export const LabsIndexPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <BaseLayout config={labsLayoutConfig}>
      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <ScienceIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight={600}>
              Labs
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Experimental features and design explorations
            </Typography>
          </Box>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 600, width: 48 }}></TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Experiment</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Tags</TableCell>
                <TableCell sx={{ fontWeight: 600, width: 80 }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {experiments.map((experiment) => (
                <TableRow
                  key={experiment.id}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                  onClick={() => navigate(experiment.path)}
                >
                  <TableCell>
                    <Box sx={{ color: 'primary.main', display: 'flex' }}>
                      {experiment.icon}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={500}>{experiment.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {experiment.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={experiment.status}
                      size="small"
                      color={getStatusColor(experiment.status)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {experiment.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '11px' }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(experiment.path);
                      }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </BaseLayout>
  );
};

export default LabsIndexPage;
