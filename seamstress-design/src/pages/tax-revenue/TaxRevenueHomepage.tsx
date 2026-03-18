/**
 * Tax & Revenue Homepage
 * Dashboard for tax administrators showing revenue metrics, pending tasks, and analytics
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
  Tabs,
  Tab,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  LinearProgress,
  Avatar,
  Tooltip,
  GlobalStyles,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  InfoOutlined,
  Add,
  Upload,
  FileDownload,
  MoreVert,
  CheckCircle,
  Notifications,
  Edit,
  Close,
  Delete,
  AttachMoney,
  PendingActions,
  Warning,
  Description,
  BarChart,
  Assessment,
  Group,
  Search,
  ViewModule,
  ViewList,
} from '@mui/icons-material';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const colors = capitalDesignTokens.foundations.colors;

// Mock data for metrics
const metricsData = [
  {
    title: 'Total Tax Revenue',
    value: '$2.8M',
    change: '+12.5%',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: AttachMoney,
  },
  {
    title: 'Pending Tax Collections',
    value: '$184.3K',
    change: '+8.3%',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: PendingActions,
  },
  {
    title: 'Delinquent Accounts',
    value: '143',
    change: '-8.7%',
    changeLabel: 'vs last month',
    trend: 'down',
    icon: Warning,
  },
];

// Mock data for quick actions
const quickActions = [
  { label: 'In-Office POS', color: colors.blurple500 },
  { label: 'Balance Sessions', color: colors.blurple500 },
  { label: 'Create Deposit', color: colors.blurple500 },
  { label: 'Create Bulk Charges', color: colors.blurple500 },
  { label: 'Create Bills', color: colors.blurple500 },
  { label: 'Import Data', color: colors.blurple500 },
  { label: 'Admin Dashboard', color: colors.blurple500 },
];

// Mock data for pending tasks
const pendingTasks = [
  {
    id: '1',
    type: 'reminder',
    priority: 'High',
    title: 'PIDN: 2024-TXR-1458',
    description: 'Cashier Station 3 - reconcile daily receipts',
    dueTime: 'Expires in 1h',
    status: 'Complete',
    actions: ['Complete', 'Edit', 'Dismiss'],
  },
  {
    id: '2',
    type: 'reminder',
    priority: 'High',
    title: 'PIDN: -',
    description: 'Prepare for board meeting presentation',
    dueTime: 'Expires in 1h',
    status: 'Reminder',
    actions: ['Complete', 'Edit', 'Dismiss'],
  },
];

// Mock data for quick reports
const quickReports = [
  {
    icon: AttachMoney,
    title: 'Collection Summary',
    description: 'Track collections, recovery rates, and outstanding balances',
  },
  {
    icon: Description,
    title: 'Billing Summary',
    description: 'Detailed list of all current charges across customer accounts',
  },
  {
    icon: Warning,
    title: 'Delinquent Summary',
    description: 'Monitor delinquent accounts with aging analysis',
  },
  {
    icon: Group,
    title: 'Customer Details',
    description: 'Monitor accounts with aging analysis',
  },
];

// Mock data for Collection Status chart
const collectionStatusData = [
  { category: 'Property Tax', collected: 3000000, pending: 1000000 },
  { category: 'Sales Tax', collected: 7000000, pending: 2000000 },
  { category: 'Business License', collected: 2500000, pending: 500000 },
  { category: 'Franchise Tax', collected: 8000000, pending: 4000000 },
  { category: 'Utility Tax', collected: 2000000, pending: 500000 },
];

// Mock data for Payment Method Trends
const paymentMethodData = [
  { month: 'Jan', onlineCC: 150000, creditCard: 100000, cash: 80000, ach: 120000, eCheck: 50000, check: 30000, moneyOrder: 20000 },
  { month: 'Feb', onlineCC: 180000, creditCard: 120000, cash: 90000, ach: 140000, eCheck: 60000, check: 35000, moneyOrder: 25000 },
  { month: 'Mar', onlineCC: 170000, creditCard: 110000, cash: 85000, ach: 150000, eCheck: 70000, check: 40000, moneyOrder: 30000 },
  { month: 'Apr', onlineCC: 160000, creditCard: 100000, cash: 75000, ach: 130000, eCheck: 55000, check: 38000, moneyOrder: 22000 },
  { month: 'May', onlineCC: 140000, creditCard: 95000, cash: 70000, ach: 125000, eCheck: 52000, check: 33000, moneyOrder: 20000 },
  { month: 'Jun', onlineCC: 130000, creditCard: 85000, cash: 65000, ach: 110000, eCheck: 48000, check: 30000, moneyOrder: 18000 },
  { month: 'Jul', onlineCC: 160000, creditCard: 105000, cash: 80000, ach: 135000, eCheck: 60000, check: 35000, moneyOrder: 25000 },
  { month: 'Aug', onlineCC: 170000, creditCard: 115000, cash: 85000, ach: 145000, eCheck: 65000, check: 40000, moneyOrder: 28000 },
  { month: 'Sep', onlineCC: 155000, creditCard: 95000, cash: 70000, ach: 120000, eCheck: 50000, check: 32000, moneyOrder: 22000 },
  { month: 'Oct', onlineCC: 175000, creditCard: 120000, cash: 90000, ach: 150000, eCheck: 68000, check: 42000, moneyOrder: 30000 },
  { month: 'Nov', onlineCC: 180000, creditCard: 125000, cash: 95000, ach: 155000, eCheck: 72000, check: 45000, moneyOrder: 32000 },
  { month: 'Dec', onlineCC: 190000, creditCard: 130000, cash: 100000, ach: 160000, eCheck: 75000, check: 48000, moneyOrder: 35000 },
];

// Mock data for Revenue Trends
const revenueTrendsData = [
  { month: 'Jan', previous: 200000, current: 180000 },
  { month: 'Feb', previous: 160000, current: 180000 },
  { month: 'Mar', previous: 130000, current: 160000 },
  { month: 'Apr', previous: 150000, current: 130000 },
  { month: 'May', previous: 210000, current: 170000 },
  { month: 'Jun', previous: 160000, current: 140000 },
  { month: 'Jul', previous: 200000, current: 170000 },
  { month: 'Aug', previous: 230000, current: 210000 },
  { month: 'Sep', previous: 190000, current: 170000 },
  { month: 'Oct', previous: 190000, current: 100000 },
  { month: 'Nov', previous: 180000, current: 50000 },
  { month: 'Dec', previous: 170000, current: 20000 },
];

const TaxRevenueHomepage: React.FC = () => {
  const [taskTab, setTaskTab] = useState(0);

  return (
    <>
      {/* Global styles for chart legend rounded corners */}
      <GlobalStyles
        styles={{
          '.recharts-legend-item-text': {
            fontSize: '12px !important',
          },
          '.recharts-surface[role="img"]': {
            rx: '2px',
            ry: '2px',
          },
        }}
      />
      <Box sx={{ minHeight: '100vh', bgcolor: colors.gray50 }}>
      {/* Header */}
      <Box sx={{ bgcolor: colors.white, borderBottom: `1px solid ${colors.gray200}`, py: 3, px: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: colors.gray900 }}>
            Welcome Back, Chris
          </Typography>
          <Chip
            label="Tax Administrator"
            size="small"
            sx={{
              bgcolor: colors.blurple100,
              color: colors.blurple700,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide, mx: 'auto', px: 4, py: 4 }}>
        {/* Metrics Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
          {metricsData.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card key={index} elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography sx={{ fontSize: '0.875rem', color: colors.gray600, fontWeight: 500 }}>
                      {metric.title}
                    </Typography>
                    <Tooltip title="More info">
                      <InfoOutlined sx={{ fontSize: 18, color: colors.gray400 }} />
                    </Tooltip>
                  </Box>
                  <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: colors.gray900, mb: 1 }}>
                    {metric.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={metric.change}
                      size="small"
                      icon={metric.trend === 'up' ? <TrendingUp sx={{ fontSize: 14 }} /> : <TrendingDown sx={{ fontSize: 14 }} />}
                      sx={{
                        height: 24,
                        bgcolor: metric.trend === 'up' ? colors.green100 : colors.red100,
                        color: metric.trend === 'up' ? colors.green700 : colors.red700,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        '& .MuiChip-icon': {
                          color: metric.trend === 'up' ? colors.green700 : colors.red700,
                        },
                      }}
                    />
                    <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                      {metric.changeLabel}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 2 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outlined"
                sx={{
                  borderColor: colors.gray200,
                  color: colors.blurple600,
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  '&:hover': {
                    borderColor: colors.blurple500,
                    bgcolor: colors.blurple50,
                  },
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Workspace Section */}
        <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
          Workspace
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
          {/* Pending Tasks */}
          <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900 }}>
                    Pending Tasks
                  </Typography>
                  <Chip
                    label="1"
                    size="small"
                    sx={{
                      height: 20,
                      minWidth: 20,
                      bgcolor: colors.blurple500,
                      color: colors.white,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<FileDownload />}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: colors.gray200,
                      color: colors.gray700,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                    }}
                  >
                    Export
                  </Button>
                  <Button
                    startIcon={<Add />}
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: colors.blurple500,
                      textTransform: 'none',
                      fontSize: '0.875rem',
                      '&:hover': { bgcolor: colors.blurple600 },
                    }}
                  >
                    New Reminder
                  </Button>
                  <IconButton size="small">
                    <ViewModule sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton size="small">
                    <ViewList sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              <Tabs
                value={taskTab}
                onChange={(_, v) => setTaskTab(v)}
                sx={{
                  mb: 3,
                  minHeight: 36,
                  '& .MuiTab-root': {
                    minHeight: 36,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                  },
                }}
              >
                <Tab label="Approvals" />
                <Tab label="Reminders" />
                <Tab label="All" />
              </Tabs>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {pendingTasks.map((task) => (
                  <Card key={task.id} elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '8px' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          <Chip
                            icon={<Notifications sx={{ fontSize: 14 }} />}
                            label={task.type === 'reminder' ? 'Reminder' : 'Approval'}
                            size="small"
                            sx={{
                              height: 22,
                              bgcolor: task.status === 'Complete' ? colors.green100 : colors.cerulean100,
                              color: task.status === 'Complete' ? colors.green700 : colors.cerulean700,
                              fontSize: '0.75rem',
                            }}
                          />
                          <Chip
                            label={task.priority}
                            size="small"
                            sx={{
                              height: 22,
                              bgcolor: colors.red100,
                              color: colors.red700,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                            }}
                          />
                          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                            {task.dueTime}
                          </Typography>
                        </Box>
                        {task.status === 'Complete' && (
                          <Chip
                            icon={<CheckCircle sx={{ fontSize: 14 }} />}
                            label="Complete"
                            size="small"
                            sx={{
                              height: 22,
                              bgcolor: colors.green100,
                              color: colors.green700,
                              fontSize: '0.75rem',
                            }}
                          />
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.blurple600, mb: 0.5 }}>
                        {task.title}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: colors.gray700, mb: 2 }}>
                        {task.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          startIcon={<CheckCircle />}
                          variant="contained"
                          size="small"
                          sx={{
                            bgcolor: colors.blurple500,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                            '&:hover': { bgcolor: colors.blurple600 },
                          }}
                        >
                          Complete
                        </Button>
                        <Button
                          startIcon={<Edit />}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: colors.gray200,
                            color: colors.gray700,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<Close />}
                          variant="text"
                          size="small"
                          sx={{
                            color: colors.gray600,
                            textTransform: 'none',
                            fontSize: '0.75rem',
                          }}
                        >
                          Dismiss
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions to Reports */}
          <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 3 }}>
                Quick Actions to Reports
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quickReports.map((report, index) => {
                  const Icon = report.icon;
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: '8px',
                        border: `1px solid ${colors.gray200}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: colors.gray50,
                          borderColor: colors.blurple300,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '8px',
                          bgcolor: colors.gray100,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon sx={{ fontSize: 20, color: colors.gray600 }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: colors.gray900, mb: 0.5 }}>
                          {report.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                          {report.description}
                        </Typography>
                      </Box>
                      <Button
                        variant="text"
                        size="small"
                        sx={{
                          color: colors.blurple600,
                          textTransform: 'none',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        View →
                      </Button>
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Charts Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
          {/* Collection Status */}
          <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                Collection Status
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
                Track tax collection performance across categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={collectionStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray200} />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: colors.gray600 }} />
                  <YAxis tick={{ fontSize: 12, fill: colors.gray600 }} />
                  <RechartsTooltip />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="square"
                    iconSize={12}
                  />
                  <Bar dataKey="collected" name="Collected (2025)" fill={colors.cerulean500} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="pending" name="Pending (2025)" fill={colors.blurple500} radius={[2, 2, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Method Trends */}
          <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
                Payment Method Trends
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
                Track payment method usage over time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={paymentMethodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray200} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.gray600 }} />
                  <YAxis tick={{ fontSize: 12, fill: colors.gray600 }} />
                  <RechartsTooltip />
                  <Legend
                    wrapperStyle={{ fontSize: '12px' }}
                    iconType="square"
                    iconSize={12}
                  />
                  <Bar dataKey="onlineCC" name="Online Credit Card" stackId="a" fill={colors.cerulean500} />
                  <Bar dataKey="creditCard" name="Credit Card" stackId="a" fill={colors.blurple500} />
                  <Bar dataKey="cash" name="Cash" stackId="a" fill={colors.gray800} />
                  <Bar dataKey="ach" name="ACH" stackId="a" fill={colors.blurple300} />
                  <Bar dataKey="eCheck" name="E-Check" stackId="a" fill={colors.cerulean300} />
                  <Bar dataKey="check" name="Check" stackId="a" fill={colors.gray500} />
                  <Bar dataKey="moneyOrder" name="Money Order" stackId="a" fill={colors.yellow500} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Revenue Trends */}
        <Card elevation={0} sx={{ border: `1px solid ${colors.gray200}`, borderRadius: '12px', mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: colors.gray900, mb: 1 }}>
              Revenue Trends
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: colors.gray500, mb: 3 }}>
              Track receipt collection performance and compare year-over-year growth patterns
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBarChart data={revenueTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.gray200} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: colors.gray600 }} />
                <YAxis tick={{ fontSize: 12, fill: colors.gray600 }} />
                <RechartsTooltip />
                <Legend
                  wrapperStyle={{ fontSize: '12px' }}
                  iconType="square"
                  iconSize={12}
                />
                <Bar dataKey="previous" name="Previous" fill={colors.blurple400} radius={[2, 2, 0, 0]} />
                <Bar dataKey="current" name="Current" fill={colors.cerulean500} radius={[2, 2, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
                Overall Growth:
              </Typography>
              <Chip
                label="8.9%"
                size="small"
                sx={{
                  height: 20,
                  bgcolor: colors.green100,
                  color: colors.green700,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 3, borderTop: `1px solid ${colors.gray200}` }}>
          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
            Terms and Privacy
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: colors.gray500 }}>
            ©2025 - OpenGov Tax & Revenue
          </Typography>
        </Box>
      </Box>
      </Box>
    </>
  );
};

export default TaxRevenueHomepage;
