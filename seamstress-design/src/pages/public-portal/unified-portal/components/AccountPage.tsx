/**
 * Account Page - Unified Portal
 * Wrapper component that uses the UnifiedAccountPage component
 */

import React from 'react';
import { Box } from '@mui/material';
import UnifiedAccountPage from '../../../../components/AccountManagement/UnifiedAccountPage';
import PortalNavigation from './PortalNavigation';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const colors = capitalDesignTokens.foundations.colors;

const AccountPage: React.FC = () => {
  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="account" />
      <UnifiedAccountPage layout="unified" />
    </Box>
  );
};

export default AccountPage;