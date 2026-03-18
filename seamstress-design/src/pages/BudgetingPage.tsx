import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Alert,
  Skeleton,
  Stack,
  IconButton,
  Divider,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import {
  generateActiveBudget,
  generateBudgetOverview,
  generateRecentWorksheets,
  generateMilestones,
  generateTasks,
  generateCOABreakdown,
  generatePositionRequests,
  generateCalendarMilestones,
  generateFYComparisonData,
} from '../data/budgetingMockData';
import type {
  Budget,
  BudgetOverview,
  Worksheet,
  Milestone,
  Task,
  COABreakdown,
  PositionRequest,
  CalendarMilestone,
} from '../types/budgeting';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

// Budgeting & Performance Dashboard
export const BudgetingPage: React.FC = () => {
  const theme = useTheme();
  const [loading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All periods');
  const [selectedProposalFilter, setSelectedProposalFilter] = useState('All proposals');

  // Generate mock data
  const activeBudget: Budget = useMemo(() => generateActiveBudget(), []);
  const budgetOverview: BudgetOverview = useMemo(() => generateBudgetOverview(activeBudget.id), [activeBudget.id]);
  const recentWorksheets: Worksheet[] = useMemo(() => generateRecentWorksheets(activeBudget.id, 5), [activeBudget.id]);
  const milestones: Milestone[] = useMemo(() => generateMilestones(activeBudget.id, 6), [activeBudget.id]);
  const tasks: Task[] = useMemo(() => generateTasks(activeBudget.id, 3), [activeBudget.id]);
  const positionRequests: PositionRequest[] = useMemo(() => generatePositionRequests(activeBudget.id, 10), [activeBudget.id]);
  const calendarMilestones: CalendarMilestone[] = useMemo(() => generateCalendarMilestones(2024, 2, 3), []);
  const fyComparisonData = useMemo(() => generateFYComparisonData(), []);

  // Calculate position request summary
  const positionRequestSummary = useMemo(() => {
    const summary = {
      active: 0,
      upcoming: 0,
      approved: 0,
      'in-progress': 0,
      'on-hold': 0,
      'in-review': 0,
      'not-approved': 0,
    };
    positionRequests.forEach((req) => {
      if (req.status in summary) {
        summary[req.status as keyof typeof summary]++;
      }
    });
    return summary;
  }, [positionRequests]);

  // Calendar helper functions
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = 2024;
    const month = 2; // March
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the start of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <Box key={`empty-${i}`} sx={{ height: 80 }} />
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayMilestones = calendarMilestones.filter((m) => {
        const milestoneDate = new Date(m.date);
        return milestoneDate.getDate() === day;
      });

      days.push(
        <Paper
          key={day}
          sx={{
            p: 1,
            height: 80,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            cursor: dayMilestones.length > 0 ? 'pointer' : 'default',
            '&:hover': dayMilestones.length > 0 ? { bgcolor: 'action.hover' } : {},
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {day}
          </Typography>
          {dayMilestones.map((milestone) => (
            <Box
              key={milestone.id}
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                px: 0.5,
                py: 0.25,
                borderRadius: 0.5,
                fontSize: '10px',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {milestone.title}
            </Box>
          ))}
        </Paper>
      );
    }

    return days;
  };

  // Format currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'active':
        return theme.palette.success.main;
      case 'in-progress':
      case 'in-review':
        return theme.palette.warning.main;
      case 'on-hold':
      case 'upcoming':
        return theme.palette.info.main;
      case 'not-approved':
      case 'overdue':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Chart colors
  const chartColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    theme.palette.grey[500],
  ];

  if (loading) {
    return (
      <Box>
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <Skeleton variant="text" width={300} height={40} />
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rectangular" height={200} />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button key="help" variant="outlined" size="medium">
              Help
            </Button>,
            <Button key="export" variant="outlined" size="medium">
              Export
            </Button>,
            <Button key="create" variant="contained" size="medium" startIcon={<AddIcon />}>
              Create
            </Button>,
          ]}
        >
          <PageHeaderComposable.Title>{activeBudget.name}</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Current Phase: {activeBudget.phase} • Status: {activeBudget.status}
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Your Work At A Glance */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Your Work At A Glance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The following items are across all your budgets
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              <Card sx={{ border: 1, borderColor: 'divider' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        borderRadius: 1,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <TrendingUpIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Overview
                      </Typography>
                      <Typography variant="body2">
                        Learn how the budget is faring by understanding its value propositions
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <ChevronRightIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ border: 1, borderColor: 'divider' }}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        borderRadius: 1,
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <AssignmentIcon />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Proposals
                      </Typography>
                      <Typography variant="body2">
                        Proposal allows for justifying revenues and funding requests
                      </Typography>
                    </Box>
                    <IconButton size="small">
                      <ChevronRightIcon />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ border: 1, borderColor: 'divider' }}>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          bgcolor: 'success.main',
                          color: 'success.contrastText',
                          borderRadius: 1,
                          p: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <AccountBalanceIcon />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Worksheets
                        </Typography>
                        <Typography variant="body2">
                          Make changes to budget through adjustments in worksheets
                        </Typography>
                      </Box>
                      <IconButton size="small">
                        <ChevronRightIcon />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
            </Box>
          </Box>

          {/* Budget Calendar and Recent Worksheets */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Budget Calendar
                  </Typography>
                  <Button size="small" endIcon={<ChevronRightIcon />}>
                    View All
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  March 2024
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                    <Typography
                      key={day}
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', textAlign: 'center', fontWeight: 600, mb: 1 }}
                    >
                      {day}
                    </Typography>
                  ))}
                  {renderCalendar()}
                </Box>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button variant="outlined" size="small" startIcon={<AddIcon />}>
                    Create New Milestone
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ border: 1, borderColor: 'divider', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Worksheets
                  </Typography>
                  <Button size="small" endIcon={<ChevronRightIcon />}>
                    View All
                  </Button>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Listing the last 5 worksheets viewed by you
                </Typography>
                <List disablePadding>
                  {recentWorksheets.map((worksheet, index) => (
                    <React.Fragment key={worksheet.id}>
                      <ListItem
                        disablePadding
                        sx={{
                          py: 1.5,
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.hover' },
                          borderRadius: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {worksheet.name}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {worksheet.type.charAt(0).toUpperCase() + worksheet.type.slice(1)} • Last edited{' '}
                              {new Date(worksheet.lastEditedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < recentWorksheets.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Budget Overview */}
          <Box>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      Budget Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Learn how the budget is faring by understanding its value propositions
                    </Typography>
                  </Box>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                      <MenuItem value="All periods">All periods</MenuItem>
                      <MenuItem value="Q1FY24">Q1FY24</MenuItem>
                      <MenuItem value="Q2FY24">Q2FY24</MenuItem>
                      <MenuItem value="Q3FY24">Q3FY24</MenuItem>
                      <MenuItem value="Q4FY24">Q4FY24</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                  {/* Revenues */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Revenues
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Approved
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(budgetOverview.revenues.approved.baseAmount)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Unapproved*
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
                          {formatCurrency(budgetOverview.revenues.unapproved.baseAmount)}
                        </Typography>
                      </Box>
                    </Box>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Base Amount</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.approved.baseAmount)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.unapproved.baseAmount)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Adjustments</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.approved.totalAdjustments)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.unapproved.totalAdjustments)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Base Adjustments</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.approved.baseAdjustments)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.unapproved.baseAdjustments)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Itemizations</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.approved.itemizations)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.revenues.unapproved.itemizations)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Proposed Revenues</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(
                                budgetOverview.revenues.approved.baseAmount + budgetOverview.revenues.approved.totalAdjustments
                              )}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(
                                budgetOverview.revenues.unapproved.baseAmount + budgetOverview.revenues.unapproved.totalAdjustments
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Expenses */}
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                      Expenses
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Approved
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatCurrency(budgetOverview.expenses.approved.baseAmount)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Unapproved*
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 600, color: 'warning.main' }}>
                          {formatCurrency(budgetOverview.expenses.unapproved.baseAmount)}
                        </Typography>
                      </Box>
                    </Box>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Base Amount</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.approved.baseAmount)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.unapproved.baseAmount)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Total Adjustments</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.approved.totalAdjustments)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.unapproved.totalAdjustments)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Base Adjustments</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.approved.baseAdjustments)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.unapproved.baseAdjustments)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Itemizations</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.approved.itemizations)}</TableCell>
                            <TableCell align="right">{formatCurrency(budgetOverview.expenses.unapproved.itemizations)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Proposed Expenses</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(
                                budgetOverview.expenses.approved.baseAmount + budgetOverview.expenses.approved.totalAdjustments
                              )}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatCurrency(
                                budgetOverview.expenses.unapproved.baseAmount + budgetOverview.expenses.unapproved.totalAdjustments
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Box>

                <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Surplus/Deficit
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: budgetOverview.surplus > 0 ? 'success.main' : 'error.main',
                      }}
                    >
                      {budgetOverview.surplus > 0 ? '+' : '-'} {formatCurrency(Math.abs(budgetOverview.surplus - budgetOverview.deficit))}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* COA Visualization */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      COA Visualization
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get a granular level understanding of dollar segregation broken down by various metrics
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <Typography variant="body2" color="text.secondary">
                    Showing
                  </Typography>
                  <Chip label="Expenses" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    broken down by
                  </Typography>
                  <Chip label="Departments" size="small" />
                  <Typography variant="body2" color="text.secondary">
                    for
                  </Typography>
                  <Chip label="Period 1" size="small" />
                  <Button size="small">Reset</Button>
                </Box>

                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fyComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="base" fill={theme.palette.primary.main} name="Base - 2023 Adjustments" />
                      <Bar dataKey="proposed" fill={theme.palette.secondary.main} name="Proposed - 2023 Adjustments" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Position Requests
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Approved', value: positionRequestSummary.approved },
                          { name: 'In Progress', value: positionRequestSummary['in-progress'] },
                          { name: 'On Hold', value: positionRequestSummary['on-hold'] },
                          { name: 'In Review', value: positionRequestSummary['in-review'] },
                          { name: 'Not Approved', value: positionRequestSummary['not-approved'] },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {chartColors.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {[
                    { label: 'Active', value: positionRequestSummary.active, color: 'success.main' },
                    { label: 'Upcoming', value: positionRequestSummary.upcoming, color: 'info.main' },
                  ].map((item) => (
                    <Box
                      key={item.label}
                      sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}
                    >
                      <Typography variant="body2">{item.label}</Typography>
                      <Chip label={item.value} size="small" sx={{ bgcolor: item.color, color: 'white' }} />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Milestones */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Milestones
                  </Typography>
                  <Button size="small" endIcon={<ChevronRightIcon />}>
                    See 5 More Active Milestones
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select value={selectedProposalFilter} onChange={(e) => setSelectedProposalFilter(e.target.value)}>
                      <MenuItem value="All proposals">All proposals</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Upcoming">Upcoming</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <Select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                      <MenuItem value="All periods">All periods</MenuItem>
                      <MenuItem value="Q1FY24">Q1FY24</MenuItem>
                      <MenuItem value="Q2FY24">Q2FY24</MenuItem>
                      <MenuItem value="Q3FY24">Q3FY24</MenuItem>
                      <MenuItem value="Q4FY24">Q4FY24</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Stack spacing={2}>
                  {milestones.slice(0, 3).map((milestone) => (
                    <Paper key={milestone.id} sx={{ p: 2, border: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {milestone.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {milestone.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={milestone.status}
                          size="small"
                          sx={{
                            bgcolor: `${getStatusColor(milestone.status)}20`,
                            color: getStatusColor(milestone.status),
                          }}
                        />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {milestone.completedTasks}/{milestone.totalTasks} tasks completed
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(milestone.completedTasks / milestone.totalTasks) * 100}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Ends on {new Date(milestone.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ border: 1, borderColor: 'divider' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    My Tasks
                  </Typography>
                  <Button size="small" endIcon={<ChevronRightIcon />}>
                    View My Tasks
                  </Button>
                </Box>
                {tasks.length === 0 ? (
                  <Alert severity="info" sx={{ border: 1, borderColor: 'divider' }}>
                    No tasks added
                  </Alert>
                ) : (
                  <List disablePadding>
                    {tasks.map((task, index) => (
                      <React.Fragment key={task.id}>
                        <ListItem
                          disablePadding
                          sx={{
                            py: 1.5,
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                            borderRadius: 1,
                          }}
                        >
                          <Box sx={{ mr: 2 }}>
                            <CheckCircleOutlineIcon
                              sx={{
                                color: task.status === 'completed' ? 'success.main' : 'action.disabled',
                              }}
                            />
                          </Box>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {task.title}
                              </Typography>
                            }
                            secondary={
                              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                                <Chip
                                  label={task.priority}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: '10px',
                                    bgcolor: task.priority === 'high' || task.priority === 'critical' ? 'error.main' : 'action.selected',
                                    color: task.priority === 'high' || task.priority === 'critical' ? 'white' : 'text.primary',
                                  }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  Due {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < tasks.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default BudgetingPage;
