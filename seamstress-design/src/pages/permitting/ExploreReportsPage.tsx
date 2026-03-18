import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';

import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from '@mdi/react';
import {
  mdiFileDocumentMultiple,
  mdiCheckboxMarkedOutline,
  mdiCashMultiple,
  mdiClipboardTextOutline,
  mdiFolder,
  mdiFilterPlusOutline,
  mdiTableEdit,
  mdiDotsHorizontal,
  mdiDotsVertical,
  mdiCalendar,
  mdiCalendarSync,
  mdiAccountGroupOutline,
  mdiLock,
  mdiChevronLeft,
  mdiChevronDown,
  mdiChevronUp,
  mdiMagnify,
  mdiPlus,
  mdiMenuDown,
  mdiTableLarge,
  mdiChartBar,
  mdiMapOutline,
  mdiAccount,
  mdiTrendingUp,
  mdiTrendingDown,
} from '@mdi/js';

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Typography,
  Stack,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Tooltip,
  useTheme,
  useMediaQuery,
  alpha,
  Skeleton,
  LinearProgress,
  SvgIcon,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PlaceIcon from '@mui/icons-material/Place';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  generateReportRecords,
  REPORT_CATEGORIES,
  TRANSACTION_TYPE_COLORS,
} from '../../data/plcExploreReportsData';
import type {
  ReportRecord,
  ReportGroup,
} from '../../data/plcExploreReportsData';

type ViewMode = 'table' | 'analytics' | 'map';

function MdiIcon({ path, size = 0.75, color }: { path: string; size?: number; color?: string }) {
  return <Icon path={path} size={size} color={color} />;
}

const CATEGORY_ICONS: Record<string, string> = {
  Records: mdiFileDocumentMultiple,
  Approvals: mdiCheckboxMarkedOutline,
  Payments: mdiCashMultiple,
  Documents: mdiFileDocumentMultiple,
  Inspections: mdiClipboardTextOutline,
  Projects: mdiFolder,
};

// ---------------------------------------------------------------------------
// Side Navbar — Figma spec: 250px, bg #F8F8F8, border #DDDEDE
// ---------------------------------------------------------------------------

function ReportsSidebar({
  categories,
  selectedReport,
  onSelectReport,
  searchQuery,
  onSearchChange,
  collapsed,
  onToggleCollapse,
}: {
  categories: ReportGroup[];
  selectedReport: string;
  onSelectReport: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const theme = useTheme();
  const [expandedCat, setExpandedCat] = useState<string>('Payments');

  const toggleCategory = (name: string) => {
    setExpandedCat(prev => (prev === name ? '' : name));
  };

  if (collapsed) {
    return (
      <Box
        sx={{
          width: 48,
          minWidth: 48,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: 1.5,
        }}
      >
        <Tooltip title="Expand sidebar" placement="right">
          <IconButton size="small" onClick={onToggleCollapse}>
            <MdiIcon path={mdiChevronLeft} size={0.8} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 250,
        minWidth: 250,
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'grey.50',
      }}
    >
      {/* Header: "Reports" + collapse chevron */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Reports</Typography>
          <Tooltip title="Collapse sidebar">
            <IconButton size="small" onClick={onToggleCollapse}>
              <MdiIcon path={mdiChevronLeft} size={0.75} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Divider />

      {/* Department Selector — Figma: label 14px/500, button with account-group-outline */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">Department</Typography>
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 0.5, justifyContent: 'flex-start', textTransform: 'none', gap: 1 }}
          startIcon={<MdiIcon path={mdiAccountGroupOutline} size={0.7} />}
          endIcon={<MdiIcon path={mdiMenuDown} size={0.7} />}
        >
          <Typography variant="body2" sx={{ flex: 1, textAlign: 'left' }}>Building Services</Typography>
        </Button>
      </Box>

      {/* Report Categories — Figma: label 14px/600, search with magnify icon */}
      <Box sx={{ px: 2, pb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Report Categories</Typography>
        <TextField
          size="small"
          placeholder="Search Reports..."
          fullWidth
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          sx={{ mt: 0.5 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <MdiIcon path={mdiMagnify} size={0.7} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Categories — Figma: expand/collapse with MDI icons */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List dense disablePadding>
          {categories.map(cat => {
            const filtered = searchQuery
              ? cat.items.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))
              : cat.items;
            if (searchQuery && filtered.length === 0) return null;

            return (
              <React.Fragment key={cat.name}>
                <ListItemButton onClick={() => toggleCategory(cat.name)} sx={{ py: 0.75, px: 2 }}>
                  <ListItemIcon sx={{ minWidth: 28, color: 'text.secondary' }}>
                    <MdiIcon path={CATEGORY_ICONS[cat.name] || mdiFolder} size={0.75} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="body1">{cat.name}</Typography>
                        <Typography variant="caption" color="text.disabled">({cat.count})</Typography>
                      </Stack>
                    }
                  />
                  <MdiIcon
                    path={expandedCat === cat.name ? mdiChevronUp : mdiChevronDown}
                    size={0.7}
                  />
                </ListItemButton>
                <Collapse in={expandedCat === cat.name}>
                  <List dense disablePadding>
                    {(searchQuery ? filtered : cat.items).map(item => {
                      const isSelected = selectedReport === item.id;
                      const isLocked = item.id === 'test';
                      return (
                        <ListItemButton
                          key={item.id}
                          selected={isSelected}
                          onClick={() => onSelectReport(item.id)}
                          sx={{
                            pl: 6,
                            py: 0.5,
                            ...(isSelected && {
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              '&.Mui-selected': {
                                bgcolor: alpha(theme.palette.primary.main, 0.08),
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.12) },
                              },
                            }),
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography
                                variant={isSelected ? 'subtitle2' : 'body2'}
                                color={isSelected ? 'primary' : 'text.primary'}
                              >
                                {item.name}
                              </Typography>
                            }
                          />
                          {isLocked && (
                            <MdiIcon path={mdiLock} size={0.55} color={theme.palette.text.disabled} />
                          )}
                        </ListItemButton>
                      );
                    })}
                    {!searchQuery && cat.count > cat.items.length && (
                      <ListItemButton sx={{ pl: 6, py: 0.5 }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="caption" color="primary">
                            Load {cat.count - cat.items.length} more
                          </Typography>
                          <MdiIcon path={mdiMenuDown} size={0.55} color={theme.palette.primary.main} />
                        </Stack>
                      </ListItemButton>
                    )}
                  </List>
                </Collapse>
              </React.Fragment>
            );
          })}
        </List>
      </Box>

      {/* New Report CTA */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          size="small"
          startIcon={<MdiIcon path={mdiPlus} size={0.65} />}
        >
          New Report
        </Button>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Table View — Figma column widths, 50px rows, dots-horizontal actions
// ---------------------------------------------------------------------------

function TableView({
  records,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: {
  records: ReportRecord[];
  page: number;
  rowsPerPage: number;
  onPageChange: (p: number) => void;
  onRowsPerPageChange: (r: number) => void;
}) {
  const theme = useTheme();
  const [selected, setSelected] = useState<number[]>([]);

  const paged = records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const allSelected = paged.length > 0 && paged.every(r => selected.includes(r.id));

  const toggleAll = () => {
    if (allSelected) setSelected(prev => prev.filter(id => !paged.some(r => r.id === id)));
    else setSelected(prev => [...new Set([...prev, ...paged.map(r => r.id)])]);
  };

  const toggleOne = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const columns = [
    { label: 'Record', width: 128 },
    { label: 'Record Type', width: 162 },
    { label: 'Label', width: 114 },
    { label: 'Date Paid', width: 141 },
    { label: 'Inspector', width: 170 },
    { label: 'Amount', width: 143, align: 'right' as const },
    { label: 'Transaction Type', width: 170 },
    { label: 'Payment Method', width: 173 },
    { label: 'Payment Note', width: 261 },
    { label: 'Applicant', width: 153 },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TableContainer sx={{ flex: 1 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ '& .MuiTableCell-head': { height: 50, py: 0 } }}>
              <TableCell padding="checkbox" sx={{ bgcolor: 'grey.50', width: 50 }}>
                <Checkbox size="small" checked={allSelected} onChange={toggleAll} />
              </TableCell>
              {columns.map(col => (
                <TableCell
                  key={col.label}
                  align={col.align}
                  sx={{ bgcolor: 'grey.50', width: col.width, whiteSpace: 'nowrap' }}
                >
                  <Stack direction="row" alignItems="center" justifyContent={col.align === 'right' ? 'flex-end' : 'flex-start'} spacing={0.5}>
                    <Typography variant="subtitle2">{col.label}</Typography>
                    <IconButton size="small" sx={{ p: 0.25, opacity: 0.5 }}>
                      <MdiIcon path={mdiDotsVertical} size={0.6} color={theme.palette.text.secondary} />
                    </IconButton>
                  </Stack>
                </TableCell>
              ))}
              <TableCell
                align="center"
                sx={{
                  bgcolor: 'grey.50',
                  width: 87,
                  position: 'sticky',
                  right: 0,
                  zIndex: 2,
                  borderLeft: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="subtitle2">Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map(row => (
              <TableRow
                key={row.id}
                hover
                selected={selected.includes(row.id)}
                sx={{ '& .MuiTableCell-root': { height: 50, py: 0.75 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox size="small" checked={selected.includes(row.id)} onChange={() => toggleOne(row.id)} />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="primary">{row.recordId}</Typography>
                </TableCell>
                <TableCell><Typography variant="body2">{row.recordType}</Typography></TableCell>
                <TableCell><Typography variant="body2">{row.label}</Typography></TableCell>
                <TableCell><Typography variant="body2">{row.datePaid}</Typography></TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: 'primary.main' }}>
                      {row.inspector.initials}
                    </Avatar>
                    <Typography variant="body2">{row.inspector.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                </TableCell>
                <TableCell>
                  <Chip label={row.transactionType} size="small" color={TRANSACTION_TYPE_COLORS[row.transactionType]} />
                </TableCell>
                <TableCell>
                  <Chip label={row.paymentMethod} size="small" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 240 }}>
                    {row.paymentNote || '—'}
                  </Typography>
                </TableCell>
                <TableCell><Typography variant="body2">{row.applicant}</Typography></TableCell>
                <TableCell
                  align="center"
                  sx={{ position: 'sticky', right: 0, bgcolor: 'background.paper', borderLeft: 1, borderColor: 'divider' }}
                >
                  <IconButton size="small">
                    <MdiIcon path={mdiDotsHorizontal} size={0.7} color={theme.palette.text.secondary} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={records.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={e => onRowsPerPageChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 25, 50, 100]}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
        }}
      />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Analytics View — CDS data visualization tokens
// ---------------------------------------------------------------------------

function AnalyticsView({ records }: { records: ReportRecord[] }) {
  const theme = useTheme();

  const dataVizColors = useMemo(() => [
    capitalDesignTokens.semanticColors.dataVisualization.sequence700,
    capitalDesignTokens.semanticColors.dataVisualization.sequence200,
    capitalDesignTokens.semanticColors.dataVisualization.sequence400,
    capitalDesignTokens.semanticColors.dataVisualization.sequence100,
    capitalDesignTokens.semanticColors.dataVisualization.sequence600,
    capitalDesignTokens.semanticColors.dataVisualization.sequence900,
  ], []);

  const totalAmount = useMemo(() => records.reduce((s, r) => s + r.amount, 0), [records]);
  const avgAmount = records.length > 0 ? totalAmount / records.length : 0;
  const paymentCount = records.filter(r => r.transactionType === 'Payment').length;
  const refundCount = records.filter(r => r.transactionType === 'Refund').length;

  const txBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => { map[r.transactionType] = (map[r.transactionType] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [records]);

  const monthlyTrend = useMemo(() => {
    const months: Record<string, { payments: number; refunds: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    monthNames.forEach(m => { months[m] = { payments: 0, refunds: 0 }; });
    records.forEach(r => {
      const monthIdx = parseInt(r.datePaid.split('-')[0], 10) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        const m = monthNames[monthIdx];
        if (r.transactionType === 'Payment') months[m].payments += r.amount;
        if (r.transactionType === 'Refund') months[m].refunds += r.amount;
      }
    });
    return monthNames.map(m => ({ month: m, payments: Math.round(months[m].payments), refunds: Math.round(months[m].refunds) }));
  }, [records]);

  const topInspectors = useMemo(() => {
    const map: Record<string, { name: string; initials: string; count: number; amount: number }> = {};
    records.forEach(r => {
      if (!map[r.inspector.name]) map[r.inspector.name] = { ...r.inspector, count: 0, amount: 0 };
      map[r.inspector.name].count++;
      map[r.inspector.name].amount += r.amount;
    });
    return Object.values(map).sort((a, b) => b.amount - a.amount).slice(0, 6);
  }, [records]);

  const statusDist = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => { map[r.status] = (map[r.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [records]);

  const deptBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach(r => { map[r.department] = (map[r.department] || 0) + r.amount; });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value);
  }, [records]);

  const chartTooltipStyle = {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 4,
    fontFamily: theme.typography.fontFamily as string,
    fontSize: Number(theme.typography.caption.fontSize),
  };
  const axisTick = { fontSize: Number(theme.typography.caption.fontSize), fill: theme.palette.text.secondary, fontFamily: theme.typography.fontFamily as string };
  const legendStyle = { fontFamily: theme.typography.fontFamily as string, fontSize: Number(theme.typography.caption.fontSize) };

  const STATUS_PIE: Record<string, string> = { Active: theme.palette.success.main, Pending: theme.palette.warning.main, Completed: theme.palette.info.main, Rejected: theme.palette.error.main, 'On Hold': theme.palette.grey[500] };
  const TX_PIE: Record<string, string> = { Payment: theme.palette.success.main, Refund: theme.palette.warning.main, Hold: theme.palette.info.main, Rejected: theme.palette.error.main };

  const kpis = [
    { label: 'Total Records', value: records.length.toLocaleString(), iconPath: mdiFileDocumentMultiple, color: 'primary' as const },
    { label: 'Total Amount', value: `$${totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, iconPath: mdiCashMultiple, color: 'success' as const },
    { label: 'Avg Amount', value: `$${avgAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, iconPath: mdiTrendingUp, color: 'info' as const },
    { label: 'Payments / Refunds', value: `${paymentCount} / ${refundCount}`, iconPath: mdiTrendingDown, color: 'warning' as const },
  ];

  return (
    <Box sx={{ p: 3, overflow: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
        {kpis.map(kpi => (
          <Card key={kpi.label} variant="outlined" sx={{ flex: 1 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: alpha(theme.palette[kpi.color].main, 0.1), color: `${kpi.color}.main`, width: 40, height: 40 }}>
                  <MdiIcon path={kpi.iconPath} size={0.85} />
                </Avatar>
                <Box>
                  <Typography variant="caption" color="text.secondary">{kpi.label}</Typography>
                  <Typography variant="h6">{kpi.value}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 2 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Monthly Payment Trends</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis dataKey="month" tick={axisTick} />
                <YAxis tick={axisTick} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <RechartsTooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, '']} />
                <Area type="monotone" dataKey="payments" stackId="1" stroke={theme.palette.success.main} fill={alpha(theme.palette.success.main, 0.25)} name="Payments" />
                <Area type="monotone" dataKey="refunds" stackId="1" stroke={theme.palette.warning.main} fill={alpha(theme.palette.warning.main, 0.25)} name="Refunds" />
                <Legend wrapperStyle={legendStyle} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Transaction Breakdown</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={txBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                  {txBreakdown.map(e => <Cell key={e.name} fill={TX_PIE[e.name] ?? theme.palette.grey[400]} />)}
                </Pie>
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Department Breakdown</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis type="number" tick={axisTick} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={axisTick} width={120} />
                <RechartsTooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="value" radius={[0, 2, 2, 0]}>
                  {deptBreakdown.map((_, i) => <Cell key={i} fill={dataVizColors[i % dataVizColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card variant="outlined" sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>Status Distribution</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                  {statusDist.map(e => <Cell key={e.name} fill={STATUS_PIE[e.name] ?? theme.palette.grey[400]} />)}
                </Pie>
                <RechartsTooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>Top Inspectors by Volume</Typography>
          <Stack spacing={1} sx={{ mt: 1 }}>
            {topInspectors.map((insp, i) => {
              const maxAmt = topInspectors[0]?.amount ?? 1;
              return (
                <Box key={insp.name}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: 'primary.main' }}>{insp.initials}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">{insp.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{insp.count} records</Typography>
                    </Box>
                    <Typography variant="subtitle2">${insp.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={(insp.amount / maxAmt) * 100} sx={{ height: 4, borderRadius: 2, bgcolor: alpha(dataVizColors[i % dataVizColors.length], 0.12), '& .MuiLinearProgress-bar': { bgcolor: dataVizColors[i % dataVizColors.length], borderRadius: 2 } }} />
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Map View (Leaflet + OpenStreetMap)
// ---------------------------------------------------------------------------

function createCircleIcon(color: string, size: number) {
  return L.divIcon({ className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2], html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>` });
}

function createClusterIcon(color: string, count: number) {
  const size = Math.min(48, 28 + count / 3);
  return L.divIcon({ className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2], html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:600;font-size:12px;font-family:DM Sans,sans-serif;">${count}</div>` });
}

function MapView({ records }: { records: ReportRecord[] }) {
  const theme = useTheme();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  const zoneHexColors = useMemo(() => [
    capitalDesignTokens.semanticColors.dataVisualization.sequence700,
    capitalDesignTokens.semanticColors.dataVisualization.sequence200,
    capitalDesignTokens.semanticColors.dataVisualization.sequence400,
    capitalDesignTokens.semanticColors.dataVisualization.sequence100,
    capitalDesignTokens.semanticColors.dataVisualization.sequence600,
  ], []);

  const zoneStats = useMemo(() => {
    const map: Record<string, { count: number; amount: number; records: ReportRecord[]; center: [number, number] }> = {};
    records.forEach(r => {
      const zone = r.location.zone;
      if (!map[zone]) map[zone] = { count: 0, amount: 0, records: [], center: [0, 0] };
      map[zone].count++; map[zone].amount += r.amount; map[zone].records.push(r);
    });
    Object.values(map).forEach(z => {
      z.center = [z.records.reduce((s, r) => s + r.location.lat, 0) / z.records.length, z.records.reduce((s, r) => s + r.location.lng, 0) / z.records.length];
    });
    return Object.entries(map).map(([zone, data]) => ({ zone, ...data })).sort((a, b) => b.count - a.count);
  }, [records]);

  const zoneColorMap = useMemo(() => {
    const m: Record<string, string> = {};
    zoneStats.forEach((z, i) => { m[z.zone] = zoneHexColors[i % zoneHexColors.length]; });
    return m;
  }, [zoneStats, zoneHexColors]);

  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<'clusters' | 'markers'>('clusters');
  const zoneRecords = selectedZone ? zoneStats.find(z => z.zone === selectedZone)?.records ?? [] : [];

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;
    const map = L.map(mapRef.current, { center: [33.749, -84.388], zoom: 12, zoomControl: true, attributionControl: true });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map);
    leafletMap.current = map;
    markersRef.current = L.layerGroup().addTo(map);
    map.on('zoomend', () => setZoomLevel(map.getZoom() >= 14 ? 'markers' : 'clusters'));
    return () => { map.remove(); leafletMap.current = null; markersRef.current = null; };
  }, []);

  useEffect(() => {
    if (!markersRef.current || !leafletMap.current) return;
    markersRef.current.clearLayers();
    if (zoomLevel === 'clusters') {
      zoneStats.forEach(zone => {
        const color = zoneColorMap[zone.zone];
        const marker = L.marker(zone.center, { icon: createClusterIcon(color, zone.count) });
        marker.bindTooltip(`<strong>${zone.zone}</strong><br/>${zone.count} records<br/>$${zone.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, { direction: 'top', offset: [0, -10] });
        marker.on('click', () => { setSelectedZone(prev => prev === zone.zone ? null : zone.zone); leafletMap.current?.flyTo(zone.center, 14, { duration: 0.8 }); });
        markersRef.current!.addLayer(marker);
      });
    } else {
      const vis = selectedZone ? records.filter(r => r.location.zone === selectedZone) : records;
      vis.forEach(r => {
        const color = zoneColorMap[r.location.zone];
        const marker = L.marker([r.location.lat, r.location.lng], { icon: createCircleIcon(color, 14) });
        marker.bindTooltip(`<strong>#${r.recordId}</strong><br/>${r.location.address}<br/>$${r.amount.toFixed(2)} · ${r.transactionType}`, { direction: 'top', offset: [0, -8] });
        marker.on('click', () => setSelectedZone(r.location.zone));
        markersRef.current!.addLayer(marker);
      });
    }
  }, [records, zoneStats, zoneColorMap, zoomLevel, selectedZone]);

  useEffect(() => {
    if (!leafletMap.current || !selectedZone) return;
    const zone = zoneStats.find(z => z.zone === selectedZone);
    if (zone) leafletMap.current.flyTo(zone.center, 14, { duration: 0.8 });
  }, [selectedZone, zoneStats]);

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1000, bgcolor: 'background.paper', borderRadius: 1, p: 1.5, boxShadow: 2, minWidth: 180 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Zones</Typography>
          {zoneStats.map(zone => (
            <Stack key={zone.zone} direction="row" spacing={1} alignItems="center" onClick={() => setSelectedZone(prev => prev === zone.zone ? null : zone.zone)} sx={{ cursor: 'pointer', py: 0.25, px: 0.5, borderRadius: 0.5, bgcolor: selectedZone === zone.zone ? 'action.selected' : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: zoneColorMap[zone.zone], flexShrink: 0 }} />
              <Typography variant="caption" sx={{ flex: 1 }}>{zone.zone}</Typography>
              <Typography variant="caption" color="text.secondary">{zone.count}</Typography>
            </Stack>
          ))}
          {selectedZone && (
            <Button size="small" color="primary" onClick={() => { setSelectedZone(null); leafletMap.current?.flyTo([33.749, -84.388], 12, { duration: 0.8 }); }} sx={{ mt: 1, textTransform: 'none' }} fullWidth>
              Reset View
            </Button>
          )}
        </Box>
        <Box ref={mapRef} sx={{ flex: 1, minHeight: 400, '& .leaflet-container': { height: '100%', width: '100%', fontFamily: theme.typography.fontFamily }, '& .leaflet-tooltip': { fontFamily: theme.typography.fontFamily, fontSize: 12 } }} />
      </Box>
      <Box sx={{ width: 320, minWidth: 320, borderLeft: 1, borderColor: 'divider', overflow: 'auto', bgcolor: 'background.paper', p: 2 }}>
        {selectedZone ? (
          <>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: zoneColorMap[selectedZone], flexShrink: 0 }} />
              <Typography variant="subtitle1">{selectedZone}</Typography>
            </Stack>
            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
              <Box><Typography variant="caption" color="text.secondary">Records</Typography><Typography variant="h6">{zoneRecords.length}</Typography></Box>
              <Box><Typography variant="caption" color="text.secondary">Total</Typography><Typography variant="h6">${zoneRecords.reduce((s, r) => s + r.amount, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}</Typography></Box>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <Stack spacing={1}>
              {zoneRecords.slice(0, 20).map(r => (
                <Card key={r.id} variant="outlined" sx={{ p: 1.5 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box><Typography variant="body2" color="primary">#{r.recordId}</Typography><Typography variant="caption" color="text.secondary">{r.location.address}</Typography></Box>
                    <Stack alignItems="flex-end"><Typography variant="subtitle2">${r.amount.toFixed(2)}</Typography><Chip label={r.transactionType} size="small" color={TRANSACTION_TYPE_COLORS[r.transactionType]} /></Stack>
                  </Stack>
                </Card>
              ))}
              {zoneRecords.length > 20 && <Typography variant="caption" color="text.secondary" align="center">+{zoneRecords.length - 20} more</Typography>}
            </Stack>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
            <PlaceIcon sx={{ fontSize: 48, mb: 1, color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary" align="center">Click a zone cluster on the map to view its records</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>{[1, 2, 3, 4].map(i => <Skeleton key={i} variant="rounded" height={80} sx={{ flex: 1 }} />)}</Stack>
      <Skeleton variant="rounded" height={320} sx={{ mb: 2 }} />
      <Skeleton variant="rounded" height={200} />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

const ExploreReportsPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSidebarSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState('ledger-fy24');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const allRecords = useMemo(() => generateReportRecords(200), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = useCallback((_: React.SyntheticEvent, newValue: ViewMode) => {
    setViewMode(newValue);
    setPage(0);
  }, []);

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 96px)', bgcolor: 'background.default' }}>
      {/* Sidebar — starts at top, spans full height below GlobalNav */}
      {!isMobile && (
        <ReportsSidebar
          categories={REPORT_CATEGORIES}
          selectedReport={selectedReport}
          onSelectReport={setSelectedReport}
          searchQuery={searchQuery}
          onSearchChange={setSidebarSearch}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        />
      )}

      {/* Right side: PageHeader + filters + content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Page Header */}
        <Box component="header" sx={{ bgcolor: 'grey.50', flexShrink: 0 }}>
          <PageHeaderComposable maxContentWidth="none" condensed>
            <PageHeaderComposable.Header
              actions={[
                <ButtonGroup key="split" variant="contained" color="primary" size="medium" disableElevation>
                  <Button>Action</Button>
                  <Button size="small" aria-label="Action options" sx={{ minWidth: 32 }}>
                    <ArrowDropDownIcon />
                  </Button>
                </ButtonGroup>,
              ]}
            >
              <PageHeaderComposable.Title>
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>Ledger - FY&apos;25</span>
                  <MdiIcon path={mdiLock} size={0.6} color={theme.palette.text.disabled} />
                </Stack>
              </PageHeaderComposable.Title>
              <PageHeaderComposable.Description>
                Comprehensive payment analysis for fiscal year 2024 including all transaction types, methods, and amounts processed through the system.
              </PageHeaderComposable.Description>
            </PageHeaderComposable.Header>
          </PageHeaderComposable>

          {/* Metadata row */}
          <Stack direction="row" spacing={1.5} sx={{ px: 3, pb: 1.5 }} flexWrap="wrap" useFlexGap>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MdiIcon path={mdiCalendar} size={0.6} color={theme.palette.grey[500]} />
              <Typography variant="caption" sx={{ color: 'grey.500' }}>Created on: 15 Jan 2025</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MdiIcon path={mdiAccount} size={0.5} color={theme.palette.grey[500]} />
              <Typography variant="caption" sx={{ color: 'grey.500' }}>Created by: John Smith</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MdiIcon path={mdiCalendar} size={0.6} color={theme.palette.grey[500]} />
              <Typography variant="caption" sx={{ color: 'grey.500' }}>Modified on: 23 May 2025</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <MdiIcon path={mdiCalendarSync} size={0.6} color={theme.palette.text.disabled} />
              <Typography variant="caption" color="text.disabled">Schedules: 3</Typography>
            </Stack>
          </Stack>
        </Box>

        {/* View Toggle + Filters */}
        <Box sx={{ px: 3, pt: 1.5, pb: 1, bgcolor: 'background.paper', flexShrink: 0 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
            <Tabs value={viewMode} onChange={handleViewChange} sx={{ minHeight: 36, '& .MuiTab-root': { minHeight: 36, py: 0.5 } }}>
              <Tab icon={<SvgIcon sx={{ fontSize: 18 }}><path d={mdiTableLarge} /></SvgIcon>} iconPosition="start" label="Table" value="table" />
              <Tab icon={<SvgIcon sx={{ fontSize: 18 }}><path d={mdiChartBar} /></SvgIcon>} iconPosition="start" label="Analytics" value="analytics" />
              <Tab icon={<SvgIcon sx={{ fontSize: 18 }}><path d={mdiMapOutline} /></SvgIcon>} iconPosition="start" label="Map" value="map" />
            </Tabs>
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" color="secondary" startIcon={<MdiIcon path={mdiFilterPlusOutline} size={0.65} />}>Advance Filters</Button>
              <Button size="small" variant="outlined" color="secondary" startIcon={<MdiIcon path={mdiTableEdit} size={0.65} />}>Columns</Button>
            </Stack>
          </Stack>

          {/* Filter chips */}
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap" useFlexGap>
            <Typography variant="caption" color="text.disabled" sx={{ lineHeight: '24px' }}>Config:</Typography>
            <Chip label={<>Status equals to <strong>Rejected, Hold</strong></>} size="small" sx={{ bgcolor: 'grey.100', border: 'none' }} />
            <Chip label={<>Date is between <strong>11 Jan&apos;25 – 31 May&apos;25</strong></>} size="small" sx={{ bgcolor: 'grey.100', border: 'none' }} />
            <Chip label="+4" size="small" sx={{ bgcolor: 'grey.100', border: 'none' }} />
          </Stack>
        </Box>

        <Divider />

        {/* View content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {viewMode === 'table' && (
                <TableView
                  records={allRecords}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setPage}
                  onRowsPerPageChange={r => { setRowsPerPage(r); setPage(0); }}
                />
              )}
              {viewMode === 'analytics' && <AnalyticsView records={allRecords} />}
              {viewMode === 'map' && <MapView records={allRecords} />}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ExploreReportsPage;
