---
name: Dashboard Pattern
description: Full production-ready scaffold for CDS dashboard pages with KPIs, charts, tables, and activity sections.
---

# Dashboard Pattern

**Keywords:** dashboard, overview, metrics, analytics, summary, charts, KPI

Use this skill when generating dashboard pages that display KPIs, charts, data tables, and activity feeds.

---

## Scaffold Structure

### PageHeaderComposable
- Title + Description
- Actions: Export, Create New (or suite-specific primary action)
- **Mobile**: Move action buttons below header in a Stack (use `useMediaQuery` to detect)

### KPI Row
- Grid of MetricCard components
- Responsive: 2 cols mobile (`xs`), 4 cols desktop (`md`)
- Each card: label (caption), value (h3/h4), optional trend (Chip or Typography with icon)

### Charts Row
- BarChart + PieChart/DonutChart side by side
- Column layout on mobile, row on desktop
- Use **recharts** with:
  - `capitalDesignTokens.semanticColors.dataVisualization` for series colors
  - `theme.palette.divider` for grid lines
  - `theme.typography` for axis/tooltip text
- Alternative: Highcharts with CDS theme wrapper

### Table Section
- DataGrid or MUI Table
- Status Chips with semantic color mapping
- Link for IDs (navigate to detail)
- Responsive: table on desktop, card stack on mobile

### Upcoming/Activity Section
- Stack with Divider-separated items
- ListItemButton for clickable items

### Containers
- All sections in `Card variant="outlined"`

### Four States
1. **Loading**: Skeleton for cards, charts, table
2. **Error**: Alert severity="error" + Retry button
3. **Empty**: Illustration + CTA (e.g., "Create first item")
4. **Success**: Full content

### Responsive
- `flexDirection: { xs: 'column', md: 'row' }` for charts
- KPI grid: `gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }`

### Mock Data
- `src/data/[suite]Data.ts` with typed interfaces
- Use faker.js for generation

### Accessibility
- `aria-label` on charts describing purpose
- `aria-label` on tables and interactive elements
- Never rely on color alone for status

---

## Complete Code Example

```tsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Grid,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InboxIcon from '@mui/icons-material/Inbox';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

import { dashboardKPIs, dashboardChartData, dashboardStatusData, dashboardTableData } from '../../data/dashboardData';
import type { DashboardKPI, ChartDataPoint, StatusDataPoint, TableRow } from '../../data/dashboardData';

const STATUS_CHIP_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'success',
  Overdue: 'error',
};

function MetricCard({
  label,
  value,
  changePercent,
}: {
  label: string;
  value: string;
  changePercent?: number;
}) {
  const isPositive = (changePercent ?? 0) >= 0;
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" sx={{ my: 1 }}>
          {value}
        </Typography>
        {changePercent !== undefined && (
          <Stack direction="row" spacing={0.5} alignItems="center">
            {isPositive ? (
              <TrendingUpIcon fontSize="small" color="success" />
            ) : (
              <TrendingDownIcon fontSize="small" color="error" />
            )}
            <Typography variant="body2" color={isPositive ? 'success.main' : 'error.main'}>
              {isPositive ? '+' : ''}{changePercent}%
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('success');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleRetry = useCallback(() => {
    setState('loading');
    setTimeout(() => setState('success'), 800);
  }, []);

  const headerActions = [
    <Button
      key="export"
      variant="outlined"
      color="secondary"
      size="medium"
      startIcon={<FileDownloadOutlinedIcon />}
    >
      Export
    </Button>,
    <Button
      key="create"
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<AddIcon />}
      onClick={() => navigate('/suite/items/new')}
    >
      Create New
    </Button>,
  ];

  if (state === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box component="header">
          <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
            <PageHeaderComposable.Header>
              <PageHeaderComposable.Title>Dashboard</PageHeaderComposable.Title>
              <PageHeaderComposable.Description>Overview of key metrics</PageHeaderComposable.Description>
            </PageHeaderComposable.Header>
          </PageHeaderComposable>
        </Box>
        <Box
          component="main"
          sx={{
            maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
            mx: 'auto',
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
          }}
        >
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} md={3} key={i}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
              </Grid>
            ))}
          </Grid>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Skeleton variant="rectangular" height={300} sx={{ flex: 2, borderRadius: 1 }} />
            <Skeleton variant="rectangular" height={300} sx={{ flex: 1, borderRadius: 1 }} />
          </Stack>
        </Box>
      </Box>
    );
  }

  if (state === 'error') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box component="header">
          <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
            <PageHeaderComposable.Header>
              <PageHeaderComposable.Title>Dashboard</PageHeaderComposable.Title>
            </PageHeaderComposable.Header>
          </PageHeaderComposable>
        </Box>
        <Box
          component="main"
          sx={{
            maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
            mx: 'auto',
            px: { xs: 2, sm: 4, md: 6 },
            py: 4,
          }}
        >
          <Alert severity="error" action={<Button size="small" onClick={handleRetry}>Retry</Button>}>
            {errorMessage || 'Failed to load dashboard data. Please try again.'}
          </Alert>
        </Box>
      </Box>
    );
  }

  const chartColors = [
    capitalDesignTokens.semanticColors.dataVisualization.sequence700,
    capitalDesignTokens.semanticColors.dataVisualization.sequence100,
    capitalDesignTokens.semanticColors.dataVisualization.sequence200,
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header actions={isMobile ? undefined : headerActions}>
            <PageHeaderComposable.Title>Dashboard</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Overview of key metrics and recent activity
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {isMobile && (
        <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
          {headerActions}
        </Stack>
      )}

      <Box
        component="main"
        sx={{
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
        }}
      >
        {state === 'empty' ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <InboxIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No data yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Get started by creating your first item.
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/suite/items/new')}>
              Create First Item
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {dashboardKPIs.map((kpi) => (
                <Grid item xs={6} md={3} key={kpi.label}>
                  <MetricCard
                    label={kpi.label}
                    value={kpi.value}
                    changePercent={kpi.change}
                  />
                </Grid>
              ))}
            </Grid>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 3 }}>
              <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '2 1 0' }, minWidth: 0 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Activity Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={280} aria-label="Activity trend over last 12 months">
                    <BarChart data={dashboardChartData} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.divider} />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fontSize: theme.typography.caption.fontSize,
                          fill: theme.palette.text.secondary,
                        }}
                        axisLine={{ stroke: theme.palette.divider }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{
                          fontSize: theme.typography.caption.fontSize,
                          fill: theme.palette.text.secondary,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: theme.shape.borderRadius,
                          fontFamily: theme.typography.fontFamily as string,
                        }}
                      />
                      <Bar
                        dataKey="value"
                        name="Count"
                        fill={chartColors[0]}
                        radius={[2, 2, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={280} aria-label="Status distribution pie chart">
                    <PieChart>
                      <Pie
                        data={dashboardStatusData}
                        dataKey="value"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {dashboardStatusData.map((_, i) => (
                          <Cell key={i} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.palette.background.paper,
                          border: `1px solid ${theme.palette.divider}`,
                          fontFamily: theme.typography.fontFamily as string,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Stack>

            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Items
                </Typography>
                <TableContainer>
                  <Table size="small" aria-label="Recent items table">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardTableData.map((row) => (
                        <TableRow key={row.id} hover sx={{ cursor: 'pointer' }}>
                          <TableCell>
                            <Link
                              variant="body2"
                              color="primary"
                              underline="hover"
                              href={`/suite/items/${row.id}`}
                            >
                              {row.id}
                            </Link>
                          </TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              color={STATUS_CHIP_COLOR[row.status] ?? 'default'}
                            />
                          </TableCell>
                          <TableCell>{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Upcoming
                </Typography>
                <Stack divider={<Divider />} spacing={0}>
                  {dashboardTableData.slice(0, 3).map((item) => (
                    <Box key={item.id} sx={{ py: 1.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{item.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {item.date}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DashboardPage;
```

---

## Mock Data Example (`src/data/dashboardData.ts`)

```ts
import { faker } from '@faker-js/faker';

export interface DashboardKPI {
  label: string;
  value: string;
  change?: number;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}

export interface StatusDataPoint {
  label: string;
  value: number;
}

export interface TableRow {
  id: string;
  title: string;
  status: string;
  date: string;
}

export const dashboardKPIs: DashboardKPI[] = [
  { label: 'Total Items', value: '1,247', change: 12.3 },
  { label: 'Pending', value: '83', change: -5.1 },
  { label: 'Completed', value: '1,089', change: 8.7 },
  { label: 'Revenue', value: '$428.5K', change: 18.2 },
];

export const dashboardChartData: ChartDataPoint[] = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
  value: faker.number.int({ min: 20, max: 100 }),
}));

export const dashboardStatusData: StatusDataPoint[] = [
  { label: 'Active', value: 42 },
  { label: 'Pending', value: 31 },
  { label: 'Completed', value: 27 },
];

export const dashboardTableData: TableRow[] = Array.from({ length: 5 }, () => ({
  id: faker.string.alphanumeric(8).toUpperCase(),
  title: faker.lorem.sentence(3),
  status: faker.helpers.arrayElement(['Active', 'Pending', 'Completed', 'Overdue']),
  date: faker.date.recent({ days: 30 }).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
}));
```
