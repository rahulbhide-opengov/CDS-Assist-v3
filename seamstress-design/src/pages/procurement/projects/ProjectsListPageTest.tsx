/**
 * Test version of ProjectsListPage to debug rendering issues
 */

import React from 'react';
import { Box, Typography } from '@mui/material';
import { mockProjects } from '../../../data/procurementProjectMockData';
import { ProjectCard } from '../../../components/procurement/project/ProjectCard';

const ProjectsListPageTest: React.FC = () => {
  const firstProject = mockProjects[0];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>ProjectCard Test</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Testing ProjectCard component with first project
      </Typography>

      <Box sx={{ maxWidth: 400 }}>
        <ProjectCard project={firstProject} />
      </Box>
    </Box>
  );
};

export default ProjectsListPageTest;
