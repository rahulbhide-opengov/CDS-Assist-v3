/**
 * Account Management Page - Public Portal
 * Wrapper component that uses the UnifiedAccountPage component
 * Note: Legacy PublicPortalLayout removed - UnifiedAccountPage handles its own layout
 */

import React from 'react';
import UnifiedAccountPage from '../../components/AccountManagement/UnifiedAccountPage';

const AccountManagementPage: React.FC = () => {
  return <UnifiedAccountPage layout="public" />;
};

export default AccountManagementPage;