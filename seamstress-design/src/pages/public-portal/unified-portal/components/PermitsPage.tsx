/**
 * Permits Page
 * Dedicated page for permit management in the unified portal
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Badge,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ArrowBack,
  East,
  Construction,
  ElectricalServices,
  Plumbing,
  Storefront,
  CheckCircle,
  AccessTime,
  Description,
  Add,
  Message,
  FolderOpen,
  Payment,
  Search,
  CalendarToday,
  Warning,
  Refresh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PortalNavigation from './PortalNavigation';
import { cdsColors, cdsDesignTokens } from '../../../../theme/cds';
import { portalTheme, portalStyles, serviceConfig } from '../../../../config/portalTheme';

const colors = cdsColors;

const permitTypes = [
  { id: 'building', title: 'Building Permit', desc: 'New construction & renovations', icon: <Construction aria-hidden="true" />, color: colors.blurple500, fee: 'From $150' },
  { id: 'electrical', title: 'Electrical Permit', desc: 'Wiring & panel upgrades', icon: <ElectricalServices aria-hidden="true" />, color: colors.blurple500, fee: 'From $75' },
  { id: 'plumbing', title: 'Plumbing Permit', desc: 'Pipes & fixtures', icon: <Plumbing aria-hidden="true" />, color: colors.blurple500, fee: 'From $75' },
  { id: 'business', title: 'Business License', desc: 'New business registration', icon: <Storefront aria-hidden="true" />, color: colors.blurple500, fee: 'From $100' },
];

const myPermits = [
  // 123 Main Street - has multiple permits and licenses
  { id: 'BP-2025-0189', type: 'Building Permit', status: 'In Review', progress: 60, address: '123 Main Street', submitted: 'Mar 10, 2025', fee: '$425.00' },
  { id: 'PL-2025-1234', type: 'Pet License', status: 'Active', progress: 100, address: '123 Main Street', submitted: 'Jan 1, 2025', fee: '$45.00' },

  // Other addresses
  { id: 'SP-2025-0042', type: 'Signage Permit', status: 'Pending Payment', progress: 80, address: '456 Commerce Ave', submitted: 'Mar 1, 2025', fee: '$125.00' },
  { id: 'BP-2025-0342', type: 'Building Permit', status: 'In Review', progress: 45, address: '789 Oak Avenue', submitted: 'Mar 5, 2025', fee: '$350.00' },
  { id: 'BL-2024-5678', type: 'Business License', status: 'Active', progress: 100, address: '456 Commerce Ave', submitted: 'Jan 1, 2025', fee: '$175.00' },
];

// Upcoming renewals data
const upcomingRenewals = [
  {
    id: 'PL-2026-1234',
    type: 'Pet License',
    name: '123 Main Street',
    expiresIn: 45,
    expiryDate: 'May 10, 2025',
    fee: '$45.00',
    status: 'upcoming'
  },
  {
    id: 'EP-2024-0892',
    type: 'Electrical Contractor License',
    name: 'Main Street Property',
    expiresIn: 30,
    expiryDate: 'May 1, 2025',
    fee: '$250.00',
    status: 'upcoming'
  },
  {
    id: 'BP-2024-0156',
    type: 'Building Permit - Extension',
    name: 'Deck Construction',
    expiresIn: 45,
    expiryDate: 'May 16, 2025',
    fee: '$100.00',
    status: 'upcoming'
  },
];

const PermitsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const getRenewalStatusStyle = (status: string, expiresIn: number) => {
    if (expiresIn <= 14) {
      return { bgcolor: colors.red100, color: colors.red700, label: 'Renew Now' };
    } else if (expiresIn <= 30) {
      return { bgcolor: colors.yellow50, color: colors.yellow600, label: 'Due Soon' };
    }
    return { bgcolor: colors.gray100, color: colors.gray600, label: 'Upcoming' };
  };

  const handlePermitTypeClick = (permitId: string) => {
    // Navigate to permit application
    navigate(`/portal/permits/apply/${permitId}`);
  };

  const handlePermitClick = (permitId: string) => {
    // Navigate to permit details
    navigate(`/portal/permits/${permitId}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        // Permits & Docs content
        return (
          <>
            {/* Quick Stats */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.blurple500 }}>3</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Active Permits</Typography>
                </CardContent>
              </Card>
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.yellow600 }}>1</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Pending Review</Typography>
                </CardContent>
              </Card>
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.red700 }}>3</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Upcoming Renewals</Typography>
                </CardContent>
              </Card>
              <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                  <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray600 }}>$650</Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500 }}>Total Fees Paid</Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Two Column Layout */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
              {/* Left Column - Main Content */}
              <Box>
                {/* Apply for New Permit */}
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                  Apply for a New Permit
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 4 }}>
                  {permitTypes.map((permit) => (
                    <Card
                      key={permit.id}
                      elevation={0}
                      sx={{
                        borderRadius: '8px',
                        border: `1px solid ${colors.gray200}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: permit.color, bgcolor: `${permit.color}08` },
                        '&:focus-visible': { outline: `2px solid ${permit.color}`, outlineOffset: '2px' },
                      }}
                      onClick={() => handlePermitTypeClick(permit.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePermitTypeClick(permit.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Apply for ${permit.title}, ${permit.desc}, ${permit.fee}`}
                    >
                      <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: '10px', bgcolor: `${permit.color}15`, color: permit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {permit.icon}
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 0.25 }}>{permit.title}</Typography>
                          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{permit.desc}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.6875rem', color: colors.gray400, whiteSpace: 'nowrap' }}>{permit.fee}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>

                {/* My Permits */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>
                    My Permits & Applications
                  </Typography>
                  <Button sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8125rem', color: colors.blurple500 }}>
                    View All
                  </Button>
                </Box>
                <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                  {myPermits.map((permit, i) => (
                    <Box
                      key={permit.id}
                      sx={{
                        p: 2.5,
                        borderBottom: i < myPermits.length - 1 ? `1px solid ${colors.gray100}` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        cursor: 'pointer',
                        '&:hover': { bgcolor: colors.gray50 },
                        '&:focus-visible': { outline: `2px solid ${colors.blurple500}`, outlineOffset: '-2px' },
                      }}
                      onClick={() => handlePermitClick(permit.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handlePermitClick(permit.id);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={`${permit.type}, ${permit.id}, ${permit.address}, Status: ${permit.status}, Fee: ${permit.fee}`}
                    >
                      <Box sx={{ width: 40, height: 40, borderRadius: '8px', bgcolor: colors.blurple50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Description aria-hidden="true" sx={{ fontSize: 20, color: colors.blurple500 }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>{permit.type}</Typography>
                          <Chip
                            label={permit.status}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              bgcolor: permit.status === 'Approved' ? colors.green50 : permit.status === 'Pending Payment' ? colors.yellow50 : colors.blurple50,
                              color: permit.status === 'Approved' ? colors.green600 : permit.status === 'Pending Payment' ? colors.yellow600 : colors.blurple500,
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                          {permit.id} · {permit.address}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900 }}>{permit.fee}</Typography>
                        {permit.status === 'Pending Payment' && (
                          <Button size="small" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.6875rem', bgcolor: colors.blurple500, color: colors.white, px: 1.5, mt: 0.5, '&:hover': { bgcolor: colors.blurple500 } }}>
                            Pay
                          </Button>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Card>
              </Box>

              {/* Right Column - Renewals */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>
                    Upcoming Renewals
                  </Typography>
                  <Chip
                    label={`${upcomingRenewals.length} due`}
                    size="small"
                    sx={{ height: 22, fontSize: '0.6875rem', fontWeight: 600, bgcolor: colors.yellow50, color: colors.yellow600 }}
                  />
                </Box>
                <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
                  {upcomingRenewals.map((renewal, i) => {
                    const statusStyle = getRenewalStatusStyle(renewal.status, renewal.expiresIn);
                    return (
                      <Box
                        key={renewal.id}
                        sx={{
                          p: 2.5,
                          borderBottom: i < upcomingRenewals.length - 1 ? `1px solid ${colors.gray100}` : 'none',
                          '&:hover': { bgcolor: colors.gray50 },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 0.25 }}>{renewal.type}</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>{renewal.name}</Typography>
                          </Box>
                          <Chip
                            label={statusStyle.label}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              bgcolor: statusStyle.bgcolor,
                              color: statusStyle.color,
                            }}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                          <CalendarToday aria-hidden="true" sx={{ fontSize: 14, color: colors.gray400 }} />
                          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                            Expires {renewal.expiryDate} ({renewal.expiresIn} days)
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900 }}>{renewal.fee}</Typography>
                          <Button
                            size="small"
                            startIcon={<Refresh aria-hidden="true" sx={{ fontSize: 14 }} />}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              color: renewal.expiresIn <= 14 ? colors.red700 : colors.blurple500,
                              bgcolor: renewal.expiresIn <= 14 ? colors.red100 : colors.blurple50,
                              px: 1.5,
                              '&:hover': { bgcolor: renewal.expiresIn <= 14 ? colors.red100 : colors.blurple100 },
                            }}
                          >
                            Renew
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                </Card>

                {/* Help Card */}
                <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, mt: 3 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>Need Help?</Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: colors.gray500, mb: 2, lineHeight: 1.5 }}>
                      Questions about permits or applications? Our team is here to help.
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          borderColor: colors.gray200,
                          color: colors.gray600,
                          borderRadius: '4px',
                          '&:hover': { borderColor: colors.gray300, bgcolor: colors.gray50 },
                        }}
                      >
                        View FAQ
                      </Button>
                      <Button
                        size="small"
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          bgcolor: colors.blurple500,
                          color: colors.white,
                          borderRadius: '4px',
                          '&:hover': { bgcolor: colors.blurple600 },
                        }}
                      >
                        Contact Support
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </>
        );
      case 1:
        // Messages tab
        return (
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}` }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Messages (2)
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ p: 2, border: `1px solid ${colors.gray200}`, borderRadius: '8px', bgcolor: colors.blurple50, borderLeft: `4px solid ${colors.blurple500}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                      Building Permit BP-2025-0189 - Additional Information Required
                    </Typography>
                    <Chip label="New" size="small" color="primary" sx={{ height: 20, fontSize: '0.625rem' }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray600, mb: 1 }}>
                    Please provide updated architectural drawings showing the revised deck dimensions...
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    Received 2 hours ago · From: Building Department
                  </Typography>
                  <Button size="small" sx={{ mt: 1.5, textTransform: 'none', fontWeight: 600 }} endIcon={<East aria-hidden="true" />}>
                    View Full Message
                  </Button>
                </Box>
                <Box sx={{ p: 2, border: `1px solid ${colors.gray200}`, borderRadius: '8px', bgcolor: colors.blurple50, borderLeft: `4px solid ${colors.blurple500}` }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>
                      Pet License PL-2025-1234 - Renewal Reminder
                    </Typography>
                    <Chip label="New" size="small" color="primary" sx={{ height: 20, fontSize: '0.625rem' }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray600, mb: 1 }}>
                    Your pet license for 2 dogs will expire on May 10, 2025. Renew early to avoid late fees...
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                    Received 1 day ago · From: Animal Services
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                    <Button size="small" variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 600 }}>
                      Renew Now
                    </Button>
                    <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }} endIcon={<East aria-hidden="true" />}>
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      case 2:
        // Applications tab
        return (
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, p: 3 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
              Applications in Progress
            </Typography>
            {myPermits.filter(p => p.status === 'In Review' || p.status === 'Pending Payment').map((permit, i, arr) => (
              <Box
                key={permit.id}
                sx={{
                  p: 2.5,
                  borderBottom: i < arr.length - 1 ? `1px solid ${colors.gray100}` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>{permit.type}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray500 }}>
                    {permit.id} · {permit.address}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={permit.progress}
                    aria-label={`${permit.type} progress: ${permit.progress}%`}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
                <Chip
                  label={permit.status}
                  size="small"
                  color={permit.status === 'Pending Payment' ? 'warning' : 'primary'}
                />
              </Box>
            ))}
          </Card>
        );
      case 3:
        // Projects tab
        return (
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, p: 3 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
              Active Projects
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <FolderOpen aria-hidden="true" sx={{ fontSize: 48, color: colors.gray300, mb: 2 }} />
              <Typography sx={{ color: colors.gray500 }}>
                No active projects at this time
              </Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                Start New Project
              </Button>
            </Box>
          </Card>
        );
      case 4:
        // Payments tab
        return (
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, p: 3 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
              Payment History
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Chip label="1 Payment Due" color="warning" size="small" />
            </Box>
            {myPermits.filter(p => p.status === 'Pending Payment').map((permit) => (
              <Box
                key={permit.id}
                sx={{
                  p: 2.5,
                  border: `1px solid ${colors.gray200}`,
                  borderRadius: '8px',
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>{permit.type}</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: colors.gray500 }}>
                    {permit.id} · Due Now
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: colors.gray900 }}>
                    {permit.fee}
                  </Typography>
                  <Button variant="contained" size="small" color="primary" sx={{ mt: 1 }}>
                    Pay Now
                  </Button>
                </Box>
              </Box>
            ))}
          </Card>
        );
      case 5:
        // Inspections tab
        return (
          <Card elevation={0} sx={{ borderRadius: '8px', border: `1px solid ${colors.gray200}`, p: 3 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
              Scheduled Inspections
            </Typography>
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Search aria-hidden="true" sx={{ fontSize: 48, color: colors.gray300, mb: 2 }} />
              <Typography sx={{ color: colors.gray500 }}>
                No inspections scheduled
              </Typography>
              <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                Schedule Inspection
              </Button>
            </Box>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Navigation */}
      <PortalNavigation />

      {/* Main Content Container - Properly centered */}
      <Box sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
            Permits & Licenses
          </Typography>
          <Typography sx={{ color: colors.gray500, fontSize: '0.9375rem' }}>
            Apply for new permits, track applications, and manage your licenses
          </Typography>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          aria-label="Permits and licenses navigation"
          sx={{
            borderBottom: `1px solid ${colors.gray200}`,
            mb: 3,
          }}
        >
          <Tab label="Permits & Docs" />
          <Tab label="Messages" />
          <Tab label="Applications" />
          <Tab label="Projects" />
          <Tab label="Payments" />
          <Tab label="Inspections" />
        </Tabs>

        {/* Tab Content */}
        {renderTabContent()}
      </Box>
    </Box>
  );
};

export default PermitsPage;
