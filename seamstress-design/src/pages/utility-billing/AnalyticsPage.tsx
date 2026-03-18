import React, { useState, useEffect } from 'react';
import { colorTokens } from '../../theme/cds/tokens';

// OpenGov (Priority 1)
import { PageHeaderComposable } from '@opengov/components-page-header';

// MUI (Priority 2)
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  TableChart,
  Download,
  Refresh,
  FilterList,
  CalendarToday,
} from '@mui/icons-material';

// Recharts
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Local
import { pageStyles } from '../../theme/pageStyles';

// Seamstress Typography Scale
const TYPOGRAPHY_SIZES = {
  H1: '1.5rem',
  H2: '1.25rem',
  H3: '1rem',
  H4: '0.9375rem',
  BODY: '0.875rem',
  CAPTION: '0.75rem',
} as const;

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 45000, target: 50000, expenses: 35000 },
  { month: 'Feb', revenue: 52000, target: 50000, expenses: 38000 },
  { month: 'Mar', revenue: 48000, target: 50000, expenses: 36000 },
  { month: 'Apr', revenue: 61000, target: 55000, expenses: 42000 },
  { month: 'May', revenue: 55000, target: 55000, expenses: 40000 },
  { month: 'Jun', revenue: 67000, target: 60000, expenses: 45000 },
  { month: 'Jul', revenue: 72000, target: 65000, expenses: 48000 },
  { month: 'Aug', revenue: 68000, target: 65000, expenses: 47000 },
  { month: 'Sep', revenue: 75000, target: 70000, expenses: 50000 },
  { month: 'Oct', revenue: 82000, target: 75000, expenses: 55000 },
  { month: 'Nov', revenue: 78000, target: 75000, expenses: 52000 },
  { month: 'Dec', revenue: 89000, target: 80000, expenses: 58000 },
];

const customerGrowthData = [
  { month: 'Jan', residential: 1234, commercial: 456, industrial: 89 },
  { month: 'Feb', residential: 1289, commercial: 478, industrial: 92 },
  { month: 'Mar', residential: 1345, commercial: 495, industrial: 94 },
  { month: 'Apr', residential: 1398, commercial: 512, industrial: 97 },
  { month: 'May', residential: 1456, commercial: 534, industrial: 101 },
  { month: 'Jun', residential: 1523, commercial: 556, industrial: 105 },
];

const categoryData = [
  { name: 'Water', value: 456789, color: colorTokens.primary.main },
  { name: 'Sewer', value: 234567, color: colorTokens.success.main },
  { name: 'Storm Water', value: 123456, color: colorTokens.warning.main },
  { name: 'Solid Waste', value: 89012, color: colorTokens.secondary.main },
];

const usagePatternData = [
  { hour: '12 AM', residential: 45, commercial: 120, industrial: 280 },
  { hour: '3 AM', residential: 35, commercial: 90, industrial: 260 },
  { hour: '6 AM', residential: 89, commercial: 150, industrial: 340 },
  { hour: '9 AM', residential: 156, commercial: 420, industrial: 480 },
  { hour: '12 PM', residential: 178, commercial: 480, industrial: 520 },
  { hour: '3 PM', residential: 198, commercial: 450, industrial: 490 },
  { hour: '6 PM', residential: 234, commercial: 280, industrial: 380 },
  { hour: '9 PM', residential: 145, commercial: 180, industrial: 320 },
];

// Animated KPI Card Component
interface AnimatedKPIProps {
  title: string;
  value: string;
  change: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

const AnimatedKPI: React.FC<AnimatedKPIProps> = ({ title, value, change, subtitle, icon, color }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    const duration = 1500;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setDisplayValue(numericValue);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <Card
      sx={{
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: TYPOGRAPHY_SIZES.BODY }}>
              {title}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: TYPOGRAPHY_SIZES.H1, fontWeight: 700, mb: 0.5 }}>
              {value.includes('$') ? `$${displayValue.toLocaleString()}` : displayValue.toLocaleString()}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {change >= 0 ? (
                <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontSize: TYPOGRAPHY_SIZES.CAPTION,
                  color: change >= 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {change >= 0 ? '+' : ''}{change}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: TYPOGRAPHY_SIZES.CAPTION }}>
                {subtitle}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '4px',
              bgcolor: `${color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AnalyticsPage: React.FC = () => {
  const theme = useTheme();
  const [animateCharts, setAnimateCharts] = useState(false);

  useEffect(() => {
    // Trigger chart animations on mount
    const timer = setTimeout(() => setAnimateCharts(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setAnimateCharts(false);
    setTimeout(() => setAnimateCharts(true), 100);
  };

  return (
    <Box sx={pageStyles.pageWrapper}>
      {/* Page Header */}
      <PageHeaderComposable sx={{ mb: 3 }}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              { label: 'Utility Billing', url: '/billing' },
              { label: 'Analytics & Reports', url: '/billing/analytics' },
            ]}
          />
          <PageHeaderComposable.Title>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              Analytics & Reports
              <Chip label="Live Data" size="small" color="success" />
            </Box>
          </PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={pageStyles.pageContent}>
        {/* Action Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              sx={{ textTransform: 'none', fontSize: TYPOGRAPHY_SIZES.BODY, borderRadius: '4px' }}
            >
              Last 12 Months
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ textTransform: 'none', fontSize: TYPOGRAPHY_SIZES.BODY, borderRadius: '4px' }}
            >
              Filters
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Data">
              <IconButton sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* KPI Section */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3, mb: 3 }}>
          <AnimatedKPI
            title="Total Revenue"
            value="$789,234"
            change={12.5}
            subtitle="vs last year"
            icon={<ShowChart sx={{ fontSize: 28 }} />}
            color={theme.palette.primary.main}
          />
          <AnimatedKPI
            title="Active Customers"
            value="3,456"
            change={8.3}
            subtitle="vs last month"
            icon={<TrendingUp sx={{ fontSize: 28 }} />}
            color={theme.palette.success.main}
          />
          <AnimatedKPI
            title="Average Bill Amount"
            value="$127"
            change={-2.1}
            subtitle="vs last month"
            icon={<BarChartIcon sx={{ fontSize: 28 }} />}
            color={theme.palette.info.main}
          />
          <AnimatedKPI
            title="Collection Rate"
            value="94.7"
            change={1.8}
            subtitle="percentage"
            icon={<PieChartIcon sx={{ fontSize: 28 }} />}
            color={theme.palette.warning.main}
          />
        </Box>

        {/* Revenue Trend Chart */}
        <Card sx={{ mb: 3, borderRadius: '4px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ fontSize: TYPOGRAPHY_SIZES.H2, fontWeight: 600, mb: 0.5 }}>
                  Revenue vs Target
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: TYPOGRAPHY_SIZES.CAPTION }}>
                  Monthly revenue performance compared to targets
                </Typography>
              </Box>
              <Chip label="Interactive" size="small" variant="outlined" />
            </Box>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="month" stroke={theme.palette.text.secondary} style={{ fontSize: '0.75rem' }} />
                <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.75rem' }} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.875rem',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                  animationDuration={animateCharts ? 1500 : 0}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke={theme.palette.success.main}
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  animationDuration={animateCharts ? 1500 : 0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Two Column Charts */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
          {/* Customer Growth Chart */}
          <Card sx={{ borderRadius: '4px' }}>
            <CardContent>
              <Typography variant="h3" sx={{ fontSize: TYPOGRAPHY_SIZES.H2, fontWeight: 600, mb: 0.5 }}>
                Customer Growth
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: TYPOGRAPHY_SIZES.CAPTION, mb: 3 }}>
                By customer type over time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis dataKey="month" stroke={theme.palette.text.secondary} style={{ fontSize: '0.75rem' }} />
                  <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.75rem' }} />
                  <RechartsTooltip
                    contentStyle={{
                      borderRadius: '4px',
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: '0.875rem',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                  <Bar dataKey="residential" fill={theme.palette.primary.main} animationDuration={animateCharts ? 1000 : 0} />
                  <Bar dataKey="commercial" fill={theme.palette.success.main} animationDuration={animateCharts ? 1200 : 0} />
                  <Bar dataKey="industrial" fill={theme.palette.warning.main} animationDuration={animateCharts ? 1400 : 0} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue by Category */}
          <Card sx={{ borderRadius: '4px' }}>
            <CardContent>
              <Typography variant="h3" sx={{ fontSize: TYPOGRAPHY_SIZES.H2, fontWeight: 600, mb: 0.5 }}>
                Revenue by Service
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: TYPOGRAPHY_SIZES.CAPTION, mb: 3 }}>
                Distribution across service categories
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={animateCharts ? 1000 : 0}
                    animationBegin={0}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{
                      borderRadius: '4px',
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: '0.875rem',
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '0.875rem' }}
                    formatter={(value: string, entry: any) => `${value}: $${entry.payload.value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        {/* Usage Pattern Chart */}
        <Card sx={{ borderRadius: '4px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ fontSize: TYPOGRAPHY_SIZES.H2, fontWeight: 600, mb: 0.5 }}>
                  Daily Usage Patterns
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: TYPOGRAPHY_SIZES.CAPTION }}>
                  Hourly consumption by customer type
                </Typography>
              </Box>
              <Chip label="Real-time" size="small" color="success" />
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usagePatternData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="hour" stroke={theme.palette.text.secondary} style={{ fontSize: '0.75rem' }} />
                <YAxis stroke={theme.palette.text.secondary} style={{ fontSize: '0.75rem' }} />
                <RechartsTooltip
                  contentStyle={{
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.875rem',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.875rem' }} />
                <Line
                  type="monotone"
                  dataKey="residential"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={animateCharts ? 1500 : 0}
                />
                <Line
                  type="monotone"
                  dataKey="commercial"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={animateCharts ? 1700 : 0}
                />
                <Line
                  type="monotone"
                  dataKey="industrial"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={animateCharts ? 1900 : 0}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AnalyticsPage;

