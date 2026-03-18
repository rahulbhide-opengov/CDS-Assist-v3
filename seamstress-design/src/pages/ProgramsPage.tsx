import React from 'react';
import { Box, Typography, Card, CardContent, Grid } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

export const ProgramsPage: React.FC = () => {
  return (
    <Box>
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Programs & Projects</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Manage programs, projects, and strategic initiatives
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Programs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and manage ongoing programs
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Portfolio
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track all projects across your organization
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Strategic Initiatives
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Monitor high-level organizational goals
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProgramsPage;
