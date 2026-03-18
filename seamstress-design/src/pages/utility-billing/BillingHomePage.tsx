import React, { useState } from 'react';

// OpenGov (Priority 1)
import { PageHeaderComposable } from '@opengov/components-page-header';
import { cdsDesignTokens } from '../../theme/cds';

// MUI (Priority 2)
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  useTheme,
} from '@mui/material';
import {
  Description,
  People,
  Warning,
  Payment,
  AccountBalance,
  AttachMoney,
  Receipt,
  CreditCard,
  Money,
  AccountBalanceWallet,
} from '@mui/icons-material';

// Recharts
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Local
import { pageStyles } from '../../theme/pageStyles';

// Quick Action Card Component
interface QuickActionCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, label, onClick }) => (
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s',
      height: '100%',
      borderRadius: '4px',
                '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3,
      },
      '&:focus-within': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: '2px',
                },
              }}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-label={label}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.();
      }
    }}
  >
    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
      <Box sx={{ color: 'primary.main', display: 'flex', alignItems: 'center' }}>{icon}</Box>
      <Typography variant="body1" fontWeight={500}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

// KPI Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badge?: { text: string; color: 'success' | 'error' | 'warning' | 'info' };
  info?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, badge, info }) => (
  <Card sx={{ height: '100%', borderRadius: '4px' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
        <Typography variant="h3" component="div" fontWeight={600}>
          {value}
        </Typography>
        {badge && (
          <Chip
            label={badge.text}
            size="small"
            color={badge.color}
            sx={{ height: 20, fontSize: '0.75rem' }}
          />
        )}
      </Box>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
      {info && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {info}
                </Typography>
      )}
    </CardContent>
            </Card>
);

// Workflow Progress Card Component
interface WorkflowCardProps {
  title: string;
  cycle: string;
  status: string;
  currentStep: number;
  progress: number;
  startedBy: string;
  totalBalance: string;
  totalUsage: string;
  accounts: number;
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  title,
  cycle,
  status,
  currentStep,
  progress,
  startedBy,
  totalBalance,
  totalUsage,
  accounts,
}) => (
            <Card
              sx={{
      mb: 2, 
      borderRadius: '4px',
                '&:hover': {
                  boxShadow: 2,
        cursor: 'pointer',
      },
      '&:focus-within': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: '2px',
      },
      transition: 'box-shadow 0.3s ease',
    }}
    tabIndex={0}
    role="button"
    aria-label={`${title} ${cycle} - ${status}`}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Handle workflow card click action
      }
    }}
  >
    <CardContent sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Left section - Title and Progress */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Typography variant="body1" color="primary.main" fontWeight={600} sx={{ cursor: 'pointer' }}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {cycle}
                </Typography>
          </Box>
          
          {/* Progress bar with segments */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 12,
                  borderRadius: 1,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    background: 'linear-gradient(90deg, #546574 0%, #4b3fff 50%, #6d63ff 100%)',
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: 'primary.main',
                color: 'white',
                px: 1.5,
                py: 0.5,
                borderRadius: '4px',
                minWidth: 'fit-content',
              }}
            >
              <Typography variant="caption" fontWeight={600}>
                Current:
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                {currentStep}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={500} sx={{ minWidth: 'fit-content' }}>
              {status}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            Started by: {startedBy}
          </Typography>
        </Box>

        {/* Right section - Metrics */}
        <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Total Balance
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {totalBalance}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Total Usage
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {totalUsage}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Accounts
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {accounts}
                </Typography>
          </Box>
        </Box>
      </Box>
    </CardContent>
            </Card>
);

// Session Card Component
interface SessionCardProps {
  title: string;
  sessionId: string;
  status: string;
  amount: string;
  receipts: number;
  payments: Array<{ method: string; amount: string }>;
}

const SessionCard: React.FC<SessionCardProps> = ({
  title,
  sessionId,
  status,
  amount,
  receipts,
  payments,
}) => (
            <Card
              sx={{
      mb: 2, 
      borderRadius: '4px',
                '&:hover': {
                  boxShadow: 2,
        cursor: 'pointer',
      },
      '&:focus-within': {
        outline: '2px solid',
        outlineColor: 'primary.main',
        outlineOffset: '2px',
      },
      transition: 'box-shadow 0.3s ease',
    }}
    tabIndex={0}
    role="article"
    aria-label={`${title} session - ${status}`}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // Handle session card click action
      }
    }}
  >
    <CardContent sx={{ py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        {/* Left section - Title and Session ID */}
        <Box sx={{ minWidth: 180 }}>
          <Typography variant="body1" color="primary.main" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {sessionId}
          </Typography>
        </Box>

        {/* Status Badge */}
        <Box>
          <Chip 
            label={status} 
            size="small" 
            color="secondary"
            sx={{ 
              fontWeight: 600,
              fontSize: '0.75rem',
            }} 
          />
        </Box>

        {/* Amount */}
        <Box sx={{ minWidth: 100 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Amount
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {amount}
          </Typography>
        </Box>

        {/* Receipts */}
        <Box sx={{ minWidth: 80 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Receipts
          </Typography>
          <Typography variant="body1" fontWeight={600}>
            {receipts}
          </Typography>
        </Box>

        {/* Payment Methods */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
          {payments.map((payment, idx) => (
            <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney fontSize="small" sx={{ color: 'text.secondary' }} />
              <Typography variant="body2" fontWeight={500}>
                {payment.method}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {payment.amount}
                </Typography>
            </Box>
          ))}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
          <Button 
            variant="contained" 
            size="small"
            startIcon={<Payment />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
            }}
          >
            Process Payment
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            startIcon={<AccountBalance />}
            sx={{ 
              textTransform: 'none',
              fontWeight: 600,
              px: 2,
            }}
          >
            Balance
          </Button>
        </Box>
      </Box>
    </CardContent>
            </Card>
);

const BillingHomePage: React.FC = () => {
  const theme = useTheme();
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  // Get icon for payment method
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Cash':
        return <AttachMoney fontSize="small" />;
      case 'Check':
        return <Receipt fontSize="small" />;
      case 'Credit/Debit':
        return <CreditCard fontSize="small" />;
      case 'Money Order':
        return <Money fontSize="small" />;
      case 'ACH':
        return <AccountBalanceWallet fontSize="small" />;
      case 'ACV':
        return <Payment fontSize="small" />;
      default:
        return <Payment fontSize="small" />;
    }
  };

  // Service breakdown data for pie chart
  const serviceData = [
    { name: 'Water', value: 26.38, amount: 558000, color: theme.palette.primary.main },
    { name: 'Sewer', value: 23.46, amount: 510000, color: theme.palette.primary.dark },
    { name: 'Gas', value: 19.03, amount: 421000, color: theme.palette.secondary.main },
    { name: 'Storm Water', value: 10.53, amount: 233000, color: theme.palette.error.main },
    { name: 'Trash', value: 20.62, amount: 426000, color: theme.palette.secondary.dark },
  ];

  // Payment method data
  const paymentMethods = [
    { method: 'Cash', amount: '$121,680.25', percentage: 37.3 },
    { method: 'Check', amount: '$70,680.25', percentage: 21.7 },
    { method: 'Credit/Debit', amount: '$98,303.23', percentage: 30.1 },
    { method: 'Money Order', amount: '$13,303.23', percentage: 4.1 },
    { method: 'ACH', amount: '$15,303.23', percentage: 4.7 },
    { method: 'ACV', amount: '$0.00', percentage: 0.0 },
  ];

  return (
    <Box sx={pageStyles.formView.pageContainer}>
      {/* Skip to main content link */}
      <Box
        component="a"
        href="#main-content"
              sx={{
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: '1rem',
          backgroundColor: 'primary.main',
          color: 'white',
          textDecoration: 'none',
          '&:focus': {
            left: '1rem',
            top: '1rem',
                },
              }}
            >
        Skip to main content
      </Box>

      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={cdsDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Cloud City</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Utility Billing Operations Dashboard
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Main Content */}
      <Box
        id="main-content"
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'grey.50',
          p: 3,
          maxWidth: cdsDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          width: '100%',
        }}
        role="main"
        aria-label="Dashboard content"
      >
        {/* Quick Actions */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(5, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          <QuickActionCard icon={<Description />} label="Prepare Bill Run" />
          <QuickActionCard icon={<People />} label="View Accounts" />
          <QuickActionCard icon={<Warning />} label="Apply Penalty Charges" />
          <QuickActionCard icon={<Payment />} label="Process Payments" />
          <QuickActionCard icon={<AccountBalance />} label="Create a Deposit" />
        </Box>

        {/* Workspace Section */}
        <Typography variant="h2" fontWeight={600} sx={{ mb: 2 }} id="workspace-section">
          Workspace
        </Typography>

        {/* Screen reader announcements for chart interactions */}
        <Box
          role="status"
          aria-live="polite"
          aria-atomic="true"
          sx={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          {hoveredSegment && `Selected: ${hoveredSegment}`}
        </Box>

        {/* KPI Metrics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          <MetricCard
            title="Days Sales Outstanding"
            value="52"
            badge={{ text: '↓ 32 last month', color: 'success' }}
            subtitle="Target: <30 days"
          />
          <MetricCard
            title="Total Amount Owed"
            value="$52,300"
            subtitle="352 Past Due Accounts"
          />
          <MetricCard
            title="Total Payments Taken Today"
            value="32"
            subtitle="As of April 3, 2025 12:25 pm"
          />
        </Box>

        {/* Charts Section */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Total Billed by Service */}
          <Card sx={{ borderRadius: '4px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                  Total Billed by Service
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Cycle 1
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Billing Period 02/01/25 - 02/28/25
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'space-between' }}>
                {/* Pie Chart */}
                <Box sx={{ width: 280, height: 280, flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                        data={serviceData}
                      cx="50%"
                      cy="50%"
                        innerRadius={70}
                        outerRadius={130}
                        paddingAngle={3}
                      dataKey="value"
                        animationBegin={0}
                        animationDuration={800}
                        animationEasing="ease-out"
                        onMouseEnter={(data: any) => setHoveredSegment(data.name)}
                        onMouseLeave={() => setHoveredSegment(null)}
                    >
                        {serviceData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.color}
                            opacity={hoveredSegment === null || hoveredSegment === entry.name ? 1 : 0.3}
                            style={{ 
                              transition: 'opacity 0.3s ease',
                              cursor: 'pointer'
                            }}
                          />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Box>
                {/* Legend */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {serviceData.map((entry, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1.5,
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        transition: 'all 0.3s ease',
                        opacity: hoveredSegment === null || hoveredSegment === entry.name ? 1 : 0.5,
                        backgroundColor: hoveredSegment === entry.name ? 'action.hover' : 'transparent',
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        '&:focus': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                          backgroundColor: 'action.hover',
                        }
                      }}
                      onMouseEnter={() => setHoveredSegment(entry.name)}
                      onMouseLeave={() => setHoveredSegment(null)}
                      tabIndex={0}
                      role="button"
                      aria-label={`${entry.name} - ${entry.value}% - $${(entry.amount / 1000).toFixed(0)}k`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setHoveredSegment(entry.name);
                        }
                        if (e.key === 'Escape') {
                          setHoveredSegment(null);
                        }
                      }}
                      onBlur={() => setHoveredSegment(null)}
                    >
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '2px',
                          backgroundColor: entry.color,
                          flexShrink: 0,
                          transition: 'transform 0.3s ease',
                          transform: hoveredSegment === entry.name ? 'scale(1.2)' : 'scale(1)',
                        }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 100 }}>
                        {entry.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                        {entry.value}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mx: 0.5 }}>
                        •
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        ${(entry.amount / 1000).toFixed(0)}k
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Billed
                </Typography>
                  <Typography variant="h3" fontWeight={600}>
                    $2,212,000.12
                  </Typography>
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
                  +2.1% vs. last period • Avg Bill $245
                </Typography>
              </Box>
            </CardContent>
            </Card>

          {/* Receipts by Payment Method */}
          <Card sx={{ borderRadius: '4px' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight={600}>
                    Receipts by Payment Method
                  </Typography>
                <Typography variant="caption" color="text.secondary">
                  March 2025
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                {paymentMethods.map((method, index) => (
                  <Box key={index} sx={{ mb: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                          {getPaymentIcon(method.method)}
                        </Box>
                        <Typography variant="body2" fontWeight={500}>
                          {method.method}
                        </Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600} sx={{ ml: '16px' }}>
                        {method.amount}
                        </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                        {method.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={method.percentage}
                      sx={{
                        height: 6,
                        borderRadius: 1,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main',
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Total Receipt
                </Typography>
                  <Typography variant="h3" fontWeight={600}>
                    $319,270.19
                  </Typography>
                </Box>
                <Typography variant="caption" color="success.main" sx={{ mt: 0.5, display: 'block' }}>
                  +98.2% vs. last month • Avg Payment: $245
                </Typography>
              </Box>
            </CardContent>
            </Card>
        </Box>

        {/* Workflows In Progress */}
        <Box 
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          component="section"
          aria-labelledby="workflows-heading"
        >
          <Typography variant="h2" fontWeight={600} id="workflows-heading">
            Workflows In Progress
          </Typography>
          <Button variant="text" size="small" aria-label="View all bill runs">
            View all Bill Runs
          </Button>
        </Box>
        <WorkflowCard
          title="Bill Run"
          cycle="Cycle 1"
          status="Review Bill Charges"
          currentStep={3}
          progress={40}
          startedBy="Jenny Jackson"
          totalBalance="$5,544,230"
          totalUsage="1,202,305"
          accounts={142}
        />
        <WorkflowCard
          title="Bill Run"
          cycle="Cycle 2"
          status="Review Usage"
          currentStep={2}
          progress={25}
          startedBy="Michael Chen"
          totalBalance="$4,892,156"
          totalUsage="987,543"
          accounts={128}
        />
        <WorkflowCard
          title="Bill Run"
          cycle="Cycle 3"
          status="Review Bill Charges"
          currentStep={1}
          progress={15}
          startedBy="Sarah Martinez"
          totalBalance="$3,217,890"
          totalUsage="756,219"
          accounts={95}
        />

        {/* Sessions */}
        <Box 
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 4 }}
          component="section"
          aria-labelledby="sessions-heading"
        >
          <Typography variant="h2" fontWeight={600} id="sessions-heading">
            Sessions
          </Typography>
          <Button variant="text" size="small" aria-label="View all sessions">
            View all Sessions
          </Button>
        </Box>
        <SessionCard
          title="Afternoon Wednesday"
          sessionId="Session # 23-4325324"
          status="In Progress"
          amount="$24,999.00"
          receipts={45}
          payments={[
            { method: 'Cash', amount: '$900' },
            { method: 'Credit/DebitCard', amount: '$1,390.00' },
          ]}
        />
        <SessionCard
          title="Checks Session"
          sessionId="Session # 23-4325342"
          status="In Progress"
          amount="$1,390.00"
          receipts={23}
          payments={[{ method: 'Cash', amount: '$1,390' }]}
        />
      </Box>
    </Box>
  );
};

export default BillingHomePage;
