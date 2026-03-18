/**
 * Site Map and Rationale Page
 * Comprehensive documentation of the Cloud City Unified Portal
 * Including site flow, features, user stories, and roadmap
 */

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress,
} from '@mui/material';
import {
  Home,
  AccountBalance,
  Construction,
  Park,
  Receipt,
  History,
  SupportAgent,
  Person,
  Storefront,
  Search,
  ExpandMore,
  CheckCircle,
  RadioButtonUnchecked,
  Warning,
  ArrowForward,
  ArrowDownward,
  People,
  Accessibility,
  Speed,
  Security,
  DeviceHub,
  Code,
  LightbulbOutlined,
} from '@mui/icons-material';
import PortalNavigation from './PortalNavigation';
import { cdsColors, cdsDesignTokens } from '../../../../theme/cds';

const colors = cdsColors;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

// Site structure data
const siteStructure = [
  {
    id: 'home',
    name: 'Home Dashboard',
    path: '/unified-portal',
    icon: Home,
    color: colors.blurple500,
    description: 'Central hub for all resident services',
    status: 'complete',
    children: [],
  },
  {
    id: 'services',
    name: 'Services',
    path: '',
    icon: DeviceHub,
    color: colors.cerulean500,
    description: 'All city services organized by category',
    status: 'complete',
    children: [
      { id: 'utilities', name: 'Utilities', path: '/unified-portal/utilities', status: 'complete' },
      { id: 'taxes', name: 'Taxes', path: '/unified-portal/taxes', status: 'complete' },
      { id: 'permits', name: 'Permits & Licensing', path: '/unified-portal/permits', status: 'complete' },
      { id: 'parks', name: 'Parks & Recreation', path: '/unified-portal/parks', status: 'complete' },
      { id: 'grants', name: 'Grants & Funding', path: '/unified-portal/grants', status: 'planned' },
    ],
  },
  {
    id: 'cityhelp',
    name: 'City Help & 311',
    path: '',
    icon: SupportAgent,
    color: colors.orange500,
    description: 'Report issues and access city resources',
    status: 'partial',
    children: [
      { id: '311', name: 'Report an Issue (311)', path: '/unified-portal/311', status: 'planned' },
      { id: 'transparency', name: 'Transparency Portal', path: '/unified-portal/transparency', status: 'planned' },
      { id: 'bookmarks', name: 'Bookmarks & Saved Items', path: '/unified-portal/bookmarks', status: 'planned' },
      { id: 'faqs', name: 'Help Center & FAQs', path: '/unified-portal/support', status: 'complete' },
    ],
  },
  {
    id: 'history',
    name: 'History',
    path: '/unified-portal/history',
    icon: History,
    color: colors.green500,
    description: 'View all transactions and payments',
    status: 'complete',
    children: [],
  },
  {
    id: 'support',
    name: 'Support',
    path: '/unified-portal/support',
    icon: SupportAgent,
    color: colors.yellow600,
    description: 'Get help and contact support',
    status: 'complete',
    children: [],
  },
  {
    id: 'account',
    name: 'Account',
    path: '/unified-portal/account',
    icon: Person,
    color: colors.purple500,
    description: 'Manage profile, security, and billing',
    status: 'complete',
    children: [],
  },
  {
    id: 'vendor',
    name: 'Vendor Portal',
    path: '/vendor-portal',
    icon: Storefront,
    color: colors.teal500,
    description: 'Business and vendor services',
    status: 'complete',
    children: [],
  },
  {
    id: 'lookup',
    name: 'Property Lookup',
    path: '/unified-portal/permits/lookup',
    icon: Search,
    color: colors.red500,
    description: 'Search and claim property records',
    status: 'complete',
    children: [],
  },
];

// Pages built with features
const pagesBuilt = [
  {
    name: 'Home Dashboard',
    path: '/unified-portal',
    features: [
      'Multi-account management (All Accounts view + individual accounts)',
      'Account selector with visual cards showing bill counts and totals',
      'Shopping cart for bulk bill payment',
      'Pay All Accounts functionality with total calculation',
      'Status chips showing past due alerts and upcoming bills',
      'AutoPay status and management',
      'Explore Services tiles with 5 service categories',
      'Quick Actions for common tasks',
      'Recent Notifications section',
      'Payment History chart with 12-month view',
      'FAQ accordion section',
      'Help card with contact options',
      'New resident onboarding link',
      'Payment plans & assistance link',
    ],
    userStories: [
      'As a resident, I want to see all my bills in one place so I can manage payments efficiently',
      'As a property owner with multiple properties, I want to switch between accounts easily',
      'As a busy parent, I want to pay all bills at once to save time',
      'As a new resident, I want guidance on setting up my city services',
    ],
  },
  {
    name: 'Utilities Page',
    path: '/unified-portal/utilities',
    features: [
      'Quick stats (Total Due, Active Services, Past Due count)',
      'Selectable utility accounts for bulk payment',
      'Usage tracking and trends',
      'Recent payments table',
      'Service status indicators',
    ],
    userStories: [
      'As a homeowner, I want to track my water usage over time',
      'As a resident, I want to see which utility bills are past due',
    ],
  },
  {
    name: 'Taxes Page',
    path: '/unified-portal/taxes',
    features: [
      'Property tax overview with assessment details',
      'Payment history and schedules',
      'Tax bill breakdown',
      'Appeal information',
    ],
    userStories: [
      'As a property owner, I want to understand my tax assessment',
      'As a taxpayer, I want to see my payment history',
    ],
  },
  {
    name: 'Permits & Licensing Page',
    path: '/unified-portal/permits',
    features: [
      'Tabbed navigation (Messages, Applications, Projects, Permits & Docs, Payments, Inspections)',
      'Upcoming renewals sidebar with expiry alerts',
      'Urgent renewal alert banner for permits expiring within 14 days',
      'Quick stats with renewal count',
      'Application status tracking',
      'My Permits & Applications list',
    ],
    userStories: [
      'As a contractor, I want to track my permit applications',
      'As a business owner, I want to renew my license before it expires',
      'As a homeowner, I want to apply for a building permit',
    ],
  },
  {
    name: 'Parks & Recreation Page',
    path: '/unified-portal/parks',
    features: [
      'Park passes overview',
      'Facility reservation options',
      'My Reservations list',
      'Activity programs',
    ],
    userStories: [
      'As a family, I want to reserve a picnic shelter',
      'As a resident, I want to purchase an annual park pass',
    ],
  },
  {
    name: 'History Page',
    path: '/unified-portal/history',
    features: [
      'Comprehensive transaction history across all accounts',
      'Filters by Type (Bills, Payments, Penalties)',
      'Filters by Account with icons',
      'Filters by Property',
      'Filters by Service Category (Utilities, Taxes, Permits, Parks)',
      'Bulk download with checkboxes',
      'Search by month or account name',
      'Pagination (10/25/50 rows)',
      'Quick Actions sidebar',
      'View permit link for permit items',
    ],
    userStories: [
      'As an accountant, I want to download all payment records for tax purposes',
      'As a resident, I want to find a specific payment I made last year',
    ],
  },
  {
    name: 'Support Page',
    path: '/unified-portal/support',
    features: [
      'Search bar for finding help topics',
      'Quick Links cards (Report Issue, Payment Options, Find Permit, Contact Us)',
      'Popular Topics FAQ accordion',
      'Contact Us section with Chat, Call, Email options',
    ],
    userStories: [
      'As a confused resident, I want to quickly find answers to common questions',
      'As someone with an urgent issue, I want to contact support immediately',
    ],
  },
  {
    name: 'Account Page',
    path: '/unified-portal/account',
    features: [
      'Three tabs: Profile Information, Security Settings, Billing Preferences',
      'Profile editing (name, email)',
      'Password change functionality',
      'Two-Factor Authentication toggle',
      'Payment Methods management (cards, bank accounts)',
      'Add Payment Method dialog (Credit/Debit Card, Bank Transfer via Plaid)',
      'AutoPay Settings grouped by account',
      'Default payment method selection',
      'Support sidebar',
    ],
    userStories: [
      'As a security-conscious user, I want to enable 2FA',
      'As a resident, I want to set up autopay for all my bills',
      'As a user, I want to manage my saved payment methods',
    ],
  },
  {
    name: 'Property Lookup Page',
    path: '/unified-portal/permits/lookup',
    features: [
      'Search by Location tab with ESRI GIS map integration',
      'Search by Record Number tab',
      'Address input with "Use My Location" button',
      'Search results table with property details',
      'Claim Record functionality with confirmation dialog',
    ],
    userStories: [
      'As a new homeowner, I want to claim my property to see associated bills',
      'As a real estate agent, I want to look up property records',
    ],
  },
  {
    name: 'Vendor Portal Page',
    path: '/vendor-portal',
    features: [
      'Vendor-specific navigation tabs (Opportunities, Responses, Awards, Checklists, Subscriptions)',
      'Left sidebar with filters (Category Code, Category, State)',
      'Opportunities Table with project details',
      'Switch to Resident Portal button',
      'Vendor user menu with account options',
    ],
    userStories: [
      'As a vendor, I want to browse procurement opportunities',
      'As a business owner, I want to respond to RFPs',
      'As a vendor with a resident account, I want to easily switch between portals',
    ],
  },
];

// What still needs to be done
const roadmap = [
  {
    category: 'Core Functionality',
    items: [
      { task: 'Implement actual payment processing integration', status: 'planned', priority: 'high' },
      { task: 'Connect to real billing system APIs', status: 'planned', priority: 'high' },
      { task: 'Implement user authentication (login/logout)', status: 'planned', priority: 'high' },
      { task: 'Add session management and security', status: 'planned', priority: 'high' },
      { task: 'Implement actual AutoPay enrollment', status: 'planned', priority: 'medium' },
    ],
  },
  {
    category: 'New Pages',
    items: [
      { task: 'Grants & Funding page', status: 'planned', priority: 'medium' },
      { task: '311 Service Request page', status: 'planned', priority: 'medium' },
      { task: 'Transparency Portal / Open Data page', status: 'planned', priority: 'low' },
      { task: 'Bookmarks & Saved Items page', status: 'planned', priority: 'low' },
      { task: 'Payment confirmation/receipt page', status: 'planned', priority: 'high' },
      { task: 'Checkout/payment flow pages', status: 'planned', priority: 'high' },
    ],
  },
  {
    category: 'Enhancements',
    items: [
      { task: 'Real-time notifications system', status: 'planned', priority: 'medium' },
      { task: 'Email/SMS notification preferences', status: 'planned', priority: 'medium' },
      { task: 'Document upload for permit applications', status: 'planned', priority: 'medium' },
      { task: 'Inspection scheduling integration', status: 'planned', priority: 'medium' },
      { task: 'Payment plan setup flow', status: 'planned', priority: 'medium' },
      { task: 'Assistance program eligibility checker', status: 'planned', priority: 'low' },
    ],
  },
  {
    category: 'Accessibility & Compliance',
    items: [
      { task: 'Complete WCAG 2.1 AA audit', status: 'in-progress', priority: 'high' },
      { task: 'Screen reader testing', status: 'in-progress', priority: 'high' },
      { task: 'Keyboard navigation testing', status: 'in-progress', priority: 'high' },
      { task: 'Color contrast verification', status: 'planned', priority: 'medium' },
      { task: 'Focus management improvements', status: 'planned', priority: 'medium' },
    ],
  },
  {
    category: 'Testing & QA',
    items: [
      { task: 'Unit tests for all components', status: 'planned', priority: 'high' },
      { task: 'Integration tests for user flows', status: 'planned', priority: 'high' },
      { task: 'End-to-end tests with Cypress', status: 'planned', priority: 'medium' },
      { task: 'Performance testing and optimization', status: 'planned', priority: 'medium' },
      { task: 'Cross-browser testing', status: 'planned', priority: 'medium' },
    ],
  },
];

// Challenges and considerations
const challenges = [
  {
    title: 'Data Integration Complexity',
    description: 'Connecting to multiple backend systems (billing, permits, taxes, parks) with different data formats and APIs.',
    mitigation: 'Design a unified data layer with adapters for each system. Use TypeScript interfaces to ensure type safety.',
    icon: DeviceHub,
  },
  {
    title: 'Multi-Account Management',
    description: 'Handling users with multiple properties, businesses, and account types while maintaining clear UX.',
    mitigation: 'Visual account selector with clear indicators. "All Accounts" view for aggregate operations.',
    icon: People,
  },
  {
    title: 'Accessibility Compliance',
    description: 'Meeting Section 508 and WCAG 2.1 AA standards across all interactive elements and complex components.',
    mitigation: 'Implementing ARIA landmarks, keyboard navigation, screen reader support, and focus management from the start.',
    icon: Accessibility,
  },
  {
    title: 'Performance at Scale',
    description: 'Ensuring fast load times with potentially large datasets (many bills, long history, multiple accounts).',
    mitigation: 'Pagination, virtual scrolling for long lists, lazy loading of components, and optimized API calls.',
    icon: Speed,
  },
  {
    title: 'Security & Privacy',
    description: 'Protecting sensitive financial and personal data while maintaining usability.',
    mitigation: 'Session management, secure payment tokenization, role-based access, and audit logging.',
    icon: Security,
  },
  {
    title: 'Responsive Design Complexity',
    description: 'Maintaining functionality and usability across mobile, tablet, and desktop viewports.',
    mitigation: 'Mobile-first approach with MUI responsive breakpoints. Hamburger menu for mobile navigation.',
    icon: Code,
  },
];

const SiteMapPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return colors.green500;
      case 'partial': return colors.yellow600;
      case 'in-progress': return colors.cerulean500;
      case 'planned': return colors.gray400;
      default: return colors.gray400;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'complete': return 'Complete';
      case 'partial': return 'Partial';
      case 'in-progress': return 'In Progress';
      case 'planned': return 'Planned';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.red500;
      case 'medium': return colors.yellow600;
      case 'low': return colors.green500;
      default: return colors.gray400;
    }
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: colors.gray50 }}>
      <PortalNavigation activeTab="support" />

      <Box 
        component="main" 
        role="main"
        aria-label="Site Map and Rationale"
        sx={{ maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: '2rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
            Site Map & Rationale
          </Typography>
          <Typography variant="body1" sx={{ color: colors.gray600, maxWidth: 800 }}>
            Comprehensive documentation of the Cloud City Unified Portal architecture, features, and development roadmap.
          </Typography>
        </Box>

        {/* Tabs */}
        <Paper elevation={0} sx={{ borderRadius: '4px', border: `1px solid ${colors.gray200}`, mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="Site documentation tabs"
            sx={{ 
              borderBottom: `1px solid ${colors.gray200}`,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.9375rem' },
            }}
          >
            <Tab label="Site Flow" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Pages & Features" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Rationale" id="tab-2" aria-controls="tabpanel-2" />
            <Tab label="Roadmap" id="tab-3" aria-controls="tabpanel-3" />
            <Tab label="Challenges" id="tab-4" aria-controls="tabpanel-4" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Site Flow Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h2" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Portal Site Flow
              </Typography>
              
              {/* LucidChart-style flow diagram */}
              <Box 
                sx={{ 
                  bgcolor: colors.white, 
                  border: `1px solid ${colors.gray200}`, 
                  borderRadius: '4px', 
                  p: 4,
                  overflowX: 'auto',
                }}
              >
                {/* Top Level - Home */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      px: 3, 
                      py: 2, 
                      borderRadius: '4px', 
                      bgcolor: colors.blurple500, 
                      color: colors.white,
                      minWidth: 200,
                      textAlign: 'center',
                    }}
                  >
                    <Home sx={{ fontSize: 32, mb: 1 }} />
                    <Typography sx={{ fontWeight: 600 }}>Home Dashboard</Typography>
                    <Typography sx={{ fontSize: '0.75rem', opacity: 0.9 }}>/unified-portal</Typography>
                  </Paper>
                </Box>

                {/* Arrow down */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ArrowDownward sx={{ fontSize: 32, color: colors.gray400 }} />
                </Box>

                {/* Second Level - Main Sections */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                  {[
                    { name: 'Services', icon: DeviceHub, color: colors.cerulean500, hasChildren: true },
                    { name: 'City Help', icon: SupportAgent, color: colors.orange500, hasChildren: true },
                    { name: 'History', icon: History, color: colors.green500, path: '/history' },
                    { name: 'Support', icon: SupportAgent, color: colors.yellow600, path: '/support' },
                    { name: 'Account', icon: Person, color: colors.purple500, path: '/account' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Paper 
                        key={item.name}
                        elevation={1} 
                        sx={{ 
                          px: 2, 
                          py: 1.5, 
                          borderRadius: '8px', 
                          bgcolor: colors.white,
                          border: `2px solid ${item.color}`,
                          minWidth: 120,
                          textAlign: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 24, color: item.color, mb: 0.5 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.gray900 }}>{item.name}</Typography>
                        {item.hasChildren && (
                          <Chip label="▼" size="small" sx={{ mt: 0.5, height: 16, fontSize: '0.625rem' }} />
                        )}
                      </Paper>
                    );
                  })}
                </Box>

                {/* Arrow down */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <ArrowDownward sx={{ fontSize: 32, color: colors.gray400 }} />
                </Box>

                {/* Third Level - Services Submenu */}
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ textAlign: 'center', fontWeight: 600, color: colors.gray600, mb: 2, fontSize: '0.875rem' }}>
                    SERVICES SUBMENU
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                    {[
                      { name: 'Utilities', icon: Receipt, color: colors.cerulean500, status: '✓' },
                      { name: 'Taxes', icon: AccountBalance, color: colors.green600, status: '✓' },
                      { name: 'Permits', icon: Construction, color: colors.orange500, status: '✓' },
                      { name: 'Parks', icon: Park, color: colors.teal500, status: '✓' },
                      { name: 'Grants', icon: LightbulbOutlined, color: colors.purple500, status: '○' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Paper 
                          key={item.name}
                          elevation={0} 
                          sx={{ 
                            px: 1.5, 
                            py: 1, 
                            borderRadius: '4px', 
                            bgcolor: `${item.color}15`,
                            border: `1px solid ${item.color}40`,
                            minWidth: 100,
                            textAlign: 'center',
                          }}
                        >
                          <Icon sx={{ fontSize: 20, color: item.color }} />
                          <Typography sx={{ fontWeight: 500, fontSize: '0.75rem', color: colors.gray800 }}>{item.name}</Typography>
                          <Typography sx={{ fontSize: '0.625rem', color: item.status === '✓' ? colors.green600 : colors.gray400 }}>
                            {item.status === '✓' ? 'Complete' : 'Planned'}
                          </Typography>
                        </Paper>
                      );
                    })}
                  </Box>
                </Box>

                {/* Additional Pages */}
                <Divider sx={{ my: 3 }} />
                <Typography sx={{ textAlign: 'center', fontWeight: 600, color: colors.gray600, mb: 2, fontSize: '0.875rem' }}>
                  ADDITIONAL PORTALS & PAGES
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                  {[
                    { name: 'Vendor Portal', icon: Storefront, color: colors.teal600, path: '/vendor-portal' },
                    { name: 'Property Lookup', icon: Search, color: colors.red500, path: '/permits/lookup' },
                    { name: 'Site Map', icon: DeviceHub, color: colors.gray600, path: '/sitemap' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Paper 
                        key={item.name}
                        elevation={0} 
                        sx={{ 
                          px: 2, 
                          py: 1.5, 
                          borderRadius: '8px', 
                          bgcolor: colors.gray100,
                          border: `1px dashed ${colors.gray300}`,
                          minWidth: 130,
                          textAlign: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 24, color: item.color, mb: 0.5 }} />
                        <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem', color: colors.gray700 }}>{item.name}</Typography>
                      </Paper>
                    );
                  })}
                </Box>

                {/* Legend */}
                <Box sx={{ mt: 4, pt: 3, borderTop: `1px solid ${colors.gray200}` }}>
                  <Typography sx={{ fontWeight: 600, color: colors.gray600, mb: 1.5, fontSize: '0.75rem' }}>LEGEND</Typography>
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: colors.blurple500, borderRadius: '4px' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray600 }}>Main Entry Point</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, border: `2px solid ${colors.cerulean500}`, borderRadius: '4px' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray600 }}>Navigation Tab</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: `${colors.green500}20`, border: `1px solid ${colors.green500}40`, borderRadius: '4px' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray600 }}>Complete Page</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: colors.gray100, border: `1px dashed ${colors.gray300}`, borderRadius: '4px' }} />
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray600 }}>Standalone Page</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Site Structure List */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h3" component="h3" sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
                  Complete Site Structure
                </Typography>
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '8px' }}>
                  <List>
                    {siteStructure.map((page, index) => {
                      const Icon = page.icon;
                      return (
                        <React.Fragment key={page.id}>
                          {index > 0 && <Divider />}
                          <ListItem sx={{ py: 2 }}>
                            <ListItemIcon>
                              <Box sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: '8px', 
                                bgcolor: `${page.color}20`, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}>
                                <Icon sx={{ color: page.color }} />
                              </Box>
                            </ListItemIcon>
                            <ListItemText 
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography sx={{ fontWeight: 600 }}>{page.name}</Typography>
                                  <Chip 
                                    label={getStatusLabel(page.status)} 
                                    size="small"
                                    sx={{ 
                                      bgcolor: `${getStatusColor(page.status)}20`, 
                                      color: getStatusColor(page.status),
                                      fontWeight: 600,
                                      fontSize: '0.6875rem',
                                    }} 
                                  />
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography variant="body2" sx={{ color: colors.gray600 }}>{page.description}</Typography>
                                  {page.path && (
                                    <Typography variant="caption" sx={{ color: colors.gray400, fontFamily: 'monospace' }}>{page.path}</Typography>
                                  )}
                                  {page.children.length > 0 && (
                                    <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                      {page.children.map((child) => (
                                        <Chip 
                                          key={child.id}
                                          label={child.name}
                                          size="small"
                                          icon={child.status === 'complete' ? <CheckCircle sx={{ fontSize: 14 }} /> : <RadioButtonUnchecked sx={{ fontSize: 14 }} />}
                                          sx={{ 
                                            bgcolor: child.status === 'complete' ? colors.green50 : colors.gray100,
                                            color: child.status === 'complete' ? colors.green700 : colors.gray600,
                                            '& .MuiChip-icon': { color: child.status === 'complete' ? colors.green500 : colors.gray400 },
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                        </React.Fragment>
                      );
                    })}
                  </List>
                </Card>
              </Box>
            </TabPanel>

            {/* Pages & Features Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h2" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Pages Built with Features & User Stories
              </Typography>
              
              {pagesBuilt.map((page) => (
                <Accordion 
                  key={page.path}
                  defaultExpanded={page.path === '/unified-portal'}
                  sx={{ 
                    mb: 2, 
                    border: `1px solid ${colors.gray200}`, 
                    borderRadius: '8px !important',
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                    bgcolor: colors.white,
                  }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMore sx={{ color: colors.gray500 }} />}
                    sx={{
                      '&:hover': { bgcolor: colors.gray50 },
                      borderRadius: '8px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>{page.name}</Typography>
                      <Chip 
                        label={`${page.features.length} features`} 
                        size="small" 
                        sx={{ bgcolor: colors.blurple100, color: colors.blurple700 }} 
                      />
                      <Typography sx={{ fontSize: '0.75rem', color: colors.gray400, fontFamily: 'monospace' }}>{page.path}</Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                      {/* Features */}
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: colors.gray700, mb: 1.5, fontSize: '0.875rem' }}>
                          Features Implemented
                        </Typography>
                        <List dense>
                          {page.features.map((feature, index) => (
                            <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 28 }}>
                                <CheckCircle sx={{ fontSize: 16, color: colors.green500 }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature} 
                                primaryTypographyProps={{ fontSize: '0.8125rem', color: colors.gray700 }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                      
                      {/* User Stories */}
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: colors.gray700, mb: 1.5, fontSize: '0.875rem' }}>
                          User Stories Addressed
                        </Typography>
                        <List dense>
                          {page.userStories.map((story, index) => (
                            <ListItem key={index} sx={{ py: 0.5, px: 0, alignItems: 'flex-start' }}>
                              <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                                <People sx={{ fontSize: 16, color: colors.blurple500 }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={story} 
                                primaryTypographyProps={{ fontSize: '0.8125rem', color: colors.gray700, fontStyle: 'italic' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </TabPanel>

            {/* Rationale Tab */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h2" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Design Rationale & Principles
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {/* Design Principles */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2 }}>Design Principles</Typography>
                    <List dense>
                      {[
                        { title: 'Unified Experience', desc: 'Single portal for all city services - utilities, taxes, permits, parks' },
                        { title: 'Multi-Account Support', desc: 'Residents can manage multiple properties and business accounts' },
                        { title: 'Mobile-First Responsive', desc: 'Works seamlessly on phones, tablets, and desktops' },
                        { title: 'Accessibility First', desc: 'Section 508 compliant with WCAG 2.1 AA standards' },
                        { title: 'Progressive Disclosure', desc: 'Show summary first, details on demand' },
                        { title: 'Consistent Patterns', desc: 'Same interactions across all service types' },
                      ].map((item, index) => (
                        <ListItem key={index} sx={{ py: 1, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircle sx={{ fontSize: 18, color: colors.blurple500 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.title}
                            secondary={item.desc}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8125rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Technology Stack */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2 }}>Technology Stack</Typography>
                    <List dense>
                      {[
                        { title: 'React 18', desc: 'Modern React with hooks and functional components' },
                        { title: 'TypeScript', desc: 'Type-safe development with full IntelliSense' },
                        { title: 'Material-UI (MUI)', desc: 'Comprehensive component library with theming' },
                        { title: 'Capital Design System', desc: 'OpenGov design tokens for consistent styling' },
                        { title: 'React Router', desc: 'Client-side routing with nested routes' },
                        { title: 'Vite', desc: 'Fast build tool with hot module replacement' },
                      ].map((item, index) => (
                        <ListItem key={index} sx={{ py: 1, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Code sx={{ fontSize: 18, color: colors.cerulean500 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.title}
                            secondary={item.desc}
                            primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                            secondaryTypographyProps={{ fontSize: '0.8125rem' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                {/* Key Decisions */}
                <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '4px', gridColumn: { md: 'span 2' } }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2 }}>Key Architecture Decisions</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
                      {[
                        { 
                          title: 'Shared Navigation Component', 
                          reason: 'Consistent navigation across all pages with role-based variations (resident vs vendor)',
                        },
                        { 
                          title: 'Visual Account Selector', 
                          reason: 'Cards instead of dropdown for better discoverability and at-a-glance information',
                        },
                        { 
                          title: 'Shopping Cart Pattern', 
                          reason: 'Familiar e-commerce pattern for bulk bill payment',
                        },
                        { 
                          title: 'Services Flyout Menu', 
                          reason: 'Group related services while keeping navigation clean',
                        },
                        { 
                          title: 'History with Multi-Filter', 
                          reason: 'Allow filtering by multiple dimensions (type, account, property, service)',
                        },
                        { 
                          title: 'Inline AutoPay Management', 
                          reason: 'Configure autopay per-account without leaving the context',
                        },
                      ].map((item, index) => (
                        <Paper 
                          key={index}
                          elevation={0}
                          sx={{ 
                            p: 2, 
                            bgcolor: colors.gray50, 
                            borderRadius: '8px',
                            border: `1px solid ${colors.gray100}`,
                          }}
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: colors.gray900, mb: 0.5 }}>
                            {item.title}
                          </Typography>
                          <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>
                            {item.reason}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            {/* Roadmap Tab */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h2" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                Development Roadmap
              </Typography>
              <Typography sx={{ color: colors.gray600, mb: 3 }}>
                What still needs to be done to complete the portal
              </Typography>

              {/* Progress Overview */}
              <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '4px', mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ fontWeight: 600 }}>Overall Progress</Typography>
                    <Typography sx={{ fontWeight: 600, color: colors.blurple500 }}>65%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={65} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6,
                      bgcolor: colors.gray200,
                      '& .MuiLinearProgress-bar': { bgcolor: colors.blurple500, borderRadius: 6 },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircle sx={{ fontSize: 16, color: colors.green500 }} />
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>10 pages complete</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Warning sx={{ fontSize: 16, color: colors.yellow600 }} />
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>2 in progress</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RadioButtonUnchecked sx={{ fontSize: 16, color: colors.gray400 }} />
                      <Typography sx={{ fontSize: '0.8125rem', color: colors.gray600 }}>6 planned</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Roadmap Categories */}
              {roadmap.map((category) => (
                <Card 
                  key={category.category}
                  elevation={0} 
                  sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '4px', mb: 3 }}
                >
                  <CardContent>
                    <Typography sx={{ fontWeight: 600, color: colors.gray900, mb: 2 }}>{category.category}</Typography>
                    <List>
                      {category.items.map((item, index) => (
                        <ListItem 
                          key={index}
                          sx={{ 
                            py: 1.5, 
                            px: 2, 
                            bgcolor: index % 2 === 0 ? colors.gray50 : 'transparent',
                            borderRadius: '8px',
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.status === 'in-progress' ? (
                              <Warning sx={{ color: colors.yellow600 }} />
                            ) : (
                              <RadioButtonUnchecked sx={{ color: colors.gray400 }} />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.task}
                            primaryTypographyProps={{ fontSize: '0.9375rem' }}
                          />
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Chip 
                              label={item.status === 'in-progress' ? 'In Progress' : 'Planned'}
                              size="small"
                              sx={{ 
                                bgcolor: item.status === 'in-progress' ? colors.yellow100 : colors.gray100,
                                color: item.status === 'in-progress' ? colors.yellow700 : colors.gray600,
                                fontWeight: 500,
                              }}
                            />
                            <Chip 
                              label={item.priority.toUpperCase()}
                              size="small"
                              sx={{ 
                                bgcolor: `${getPriorityColor(item.priority)}20`,
                                color: getPriorityColor(item.priority),
                                fontWeight: 600,
                                fontSize: '0.6875rem',
                              }}
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))}
            </TabPanel>

            {/* Challenges Tab */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h2" component="h2" sx={{ fontSize: '1.25rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                Challenges & Considerations
              </Typography>
              <Typography sx={{ color: colors.gray600, mb: 3 }}>
                Key challenges identified and mitigation strategies
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                {challenges.map((challenge) => {
                  const Icon = challenge.icon;
                  return (
                    <Card 
                      key={challenge.title}
                      elevation={0} 
                      sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Box sx={{ 
                            width: 48, 
                            height: 48, 
                            borderRadius: '4px', 
                            bgcolor: colors.red50, 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center' 
                          }}>
                            <Icon sx={{ color: colors.red500 }} />
                          </Box>
                          <Typography sx={{ fontWeight: 600, color: colors.gray900 }}>{challenge.title}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 2 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: colors.red600, mb: 0.5 }}>
                            CHALLENGE
                          </Typography>
                          <Typography sx={{ fontSize: '0.875rem', color: colors.gray700 }}>
                            {challenge.description}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                          <ArrowForward sx={{ fontSize: 16, color: colors.green500, mt: 0.5 }} />
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: colors.green600, mb: 0.5 }}>
                              MITIGATION
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', color: colors.gray700 }}>
                              {challenge.mitigation}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </TabPanel>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', py: 4, color: colors.gray500 }}>
          <Typography sx={{ fontSize: '0.8125rem' }}>
            Cloud City Unified Portal • Last Updated: December 2024
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SiteMapPage;

