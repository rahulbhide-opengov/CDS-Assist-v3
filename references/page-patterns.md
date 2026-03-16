# CDS Page Patterns — Reference

Canonical page patterns for every type of OpenGov page. When the agent detects a pattern keyword, use the matching skeleton.

---

## Pattern Detection

| Keywords in prompt | Pattern | Key features |
|-------------------|---------|--------------|
| dashboard, metrics, overview, home, summary | **Dashboard** | KPI cards, charts, activity feed, quick actions |
| list, table, grid, items, browse, manage | **List View** | Search, filters, data table/cards, pagination, bulk actions |
| detail, view, show, profile, record | **Detail View** | Tabbed sections, metadata sidebar, related items, actions |
| form, create, edit, new, add, configure | **Form** | Grouped fields, validation, stepper (multi-step), save/cancel |
| settings, preferences, configuration | **Settings** | Grouped sections, toggles, save at bottom |

---

## 1. Dashboard Pattern

```typescript
import React from 'react';
import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import type { MetricData } from '../types';

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Page Header */}
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Button key="export" variant="outlined" size="small">Export</Button>,
              <Button key="customize" variant="contained" size="small">Customize</Button>,
            ]}
          >
            <PageHeaderComposable.Title>Dashboard</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Overview of key metrics and recent activity
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content */}
      <Box component="main" sx={{
        maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
        mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4,
      }}>
        {/* KPI Row */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          gap: 3, mb: 4,
        }}>
          {metrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">{metric.label}</Typography>
                <Typography variant="h4" sx={{ my: 1 }}>{metric.value}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <TrendingUpIcon fontSize="small" color="success" />
                  <Typography variant="body2" color="success.main">
                    {metric.changePercent}% from last period
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Two-column layout: Chart + Activity */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Trend</Typography>
              {/* Chart component here */}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Activity</Typography>
              {/* Activity list here */}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
```

### Dashboard rules:
- KPI cards: 4-column grid on desktop, 2 on tablet, 1 on mobile
- Each KPI: label (caption), value (h4), trend indicator with color
- Charts section: 2:1 ratio with activity feed
- Quick actions in page header
- Use `Card` (elevation 0, border from theme) for all sections

---

## 2. List View Pattern

```typescript
import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField,
  InputAdornment, Chip, IconButton, Menu, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const ListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Page Header */}
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Button key="create" variant="contained" startIcon={<AddIcon />}>Create New</Button>,
            ]}
          >
            <PageHeaderComposable.Title>Items</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              {filteredItems.length} items total
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content */}
      <Box component="main" sx={{
        maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
        mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4,
      }}>
        {/* Search + Filter Bar */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: 400 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                ),
              },
            }}
          />
          <Button variant="outlined" size="small" startIcon={<FilterListIcon />}>
            Filters
          </Button>
        </Box>

        {/* Active Filters */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label="Status: Active" size="small" onDelete={() => {}} />
          <Chip label="Priority: High" size="small" onDelete={() => {}} />
        </Box>

        {/* Data Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assignee</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item.id} hover sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Typography variant="body1">{item.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      size="small"
                      color={item.status === 'active' ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{item.priority}</TableCell>
                  <TableCell>{item.assignee}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(item.updatedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" aria-label="More actions">
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredItems.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Box>
    </Box>
  );
};

export default ListPage;
```

### List View rules:
- Search + filter bar below page header
- Active filters shown as dismissable Chips
- Standard MUI Table with themed header (secondary bg, bold text)
- Row hover state, cursor: pointer for clickable rows
- Status Chips with semantic colors (success/error/warning/default)
- Actions column aligned right with IconButton + MoreVert
- Pagination below table
- On mobile: consider switching to Card view

---

## 3. Detail View Pattern

```typescript
const DetailPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Page Header with breadcrumb feel */}
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Button key="edit" variant="outlined" startIcon={<EditIcon />}>Edit</Button>,
              <Button key="delete" variant="outlined" color="error">Delete</Button>,
            ]}
          >
            <PageHeaderComposable.Title>{item.name}</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              <Chip label={item.status} size="small" color="success" sx={{ mr: 1 }} />
              Created {formatDate(item.createdAt)}
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      {/* Content: tabs + sidebar layout */}
      <Box component="main" sx={{
        maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
        mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4,
      }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 3,
        }}>
          {/* Main content with tabs */}
          <Box>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
              <Tab label="Overview" />
              <Tab label="History" />
              <Tab label="Related" />
            </Tabs>
            <Card sx={{ mt: 2 }}>
              <CardContent>
                {/* Tab panels here */}
              </CardContent>
            </Card>
          </Box>

          {/* Sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Details</Typography>
                <DetailRow label="Priority" value={item.priority} />
                <DetailRow label="Assignee" value={item.assignee} />
                <DetailRow label="Due Date" value={formatDate(item.dueDate)} />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Related Items</Typography>
                {/* Related items list */}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
```

### Detail View rules:
- Page header shows item name + status chip + metadata
- 2:1 grid: main content (tabs) + sidebar (metadata cards)
- Tabs for content sections (Overview, History, Related, etc.)
- Sidebar cards for quick metadata reference
- Action buttons in header (Edit, Delete, etc.)
- On mobile: sidebar moves below main content (grid collapses to 1fr)

---

## 4. Form Pattern

```typescript
const FormPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', description: '', priority: 'medium' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>Create New Item</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              Fill in the details below to create a new item.
            </PageHeaderComposable.Description>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      <Box component="main" sx={{
        maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4,
      }}>
        <form onSubmit={handleSubmit}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                <TextField
                  label="Item Name"
                  required
                  fullWidth
                  size="small"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
                <TextField
                  label="Priority"
                  select
                  fullWidth
                  size="small"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </TextField>
              </Box>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                size="small"
                sx={{ mt: 3 }}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </CardContent>
          </Card>

          {/* Sticky action bar */}
          <Box sx={{
            display: 'flex', justifyContent: 'flex-end', gap: 2,
            position: 'sticky', bottom: 0, py: 2, bgcolor: 'background.default',
            borderTop: 1, borderColor: 'divider',
          }}>
            <Button variant="outlined" color="secondary">Cancel</Button>
            <Button variant="contained" type="submit">Create Item</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};
```

### Form rules:
- Narrower `maxWidth` (720px) for forms — easier to scan
- Group related fields in Cards with section headings (h6)
- 2-column grid for related field pairs, 1 column for wide fields
- All TextFields use `size="small"`, `fullWidth`, and have labels
- Select fields use TextField with `select` prop + MenuItem children
- Sticky action bar at bottom with Cancel + Submit
- Required fields marked with `required` prop
- Validation errors shown via `error` + `helperText` props

---

## 5. Settings Pattern

```typescript
const SettingsPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header>
            <PageHeaderComposable.Title>Settings</PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      <Box component="main" sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 4, md: 6 }, py: 4 }}>
        {/* Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notifications</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Configure how you receive notifications.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
              <FormControlLabel control={<Switch />} label="Push notifications" />
              <FormControlLabel control={<Switch defaultChecked />} label="Weekly digest" />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Display</Typography>
            <TextField label="Items per page" select fullWidth size="small" defaultValue="25">
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="25">25</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </TextField>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained">Save Changes</Button>
        </Box>
      </Box>
    </Box>
  );
};
```

### Settings rules:
- Narrow max-width (720px)
- Each section in its own Card
- Section title (h6) + description (body2, text.secondary)
- Toggles use Switch + FormControlLabel
- Save button at bottom, right-aligned

---

## Common Sub-Patterns

### Metric Card
```typescript
<Card>
  <CardContent>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="h4" sx={{ my: 1 }}>{value}</Typography>
    <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
      {trend > 0 ? '+' : ''}{trend}% from last period
    </Typography>
  </CardContent>
</Card>
```

### Status Chip mapping
```typescript
const statusColorMap: Record<string, 'success' | 'error' | 'warning' | 'info' | 'default'> = {
  active: 'success',
  completed: 'success',
  approved: 'success',
  pending: 'warning',
  in_progress: 'info',
  draft: 'default',
  failed: 'error',
  rejected: 'error',
  cancelled: 'default',
  overdue: 'error',
};

<Chip label={status} size="small" color={statusColorMap[status] || 'default'} />
```

### Detail Row (key-value pair)
```typescript
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: 1, borderColor: 'divider' }}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);
```

### Empty State
```typescript
<Box sx={{ textAlign: 'center', py: 8 }}>
  <Box sx={{ mb: 2, color: 'text.secondary' }}>
    <InboxIcon sx={{ fontSize: 48, opacity: 0.5 }} />
  </Box>
  <Typography variant="h6" color="text.secondary" gutterBottom>
    No items found
  </Typography>
  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
    Get started by creating your first item.
  </Typography>
  <Button variant="contained" startIcon={<AddIcon />}>Create Item</Button>
</Box>
```

---

## Page Composition Rules

1. Every page exports as `default` (for lazy loading)
2. Every page renders three layers: header wrapper → PageHeaderComposable → content
3. Never use `<h1>` directly — always `PageHeaderComposable.Title`
4. Content uses `capitalDesignTokens.foundations.layout.breakpoints.desktop.wide` for max-width
5. Forms use narrower max-width (720px)
6. All spacing on 4px grid (MUI spacing shorthand: `p: 1` = 8px, `p: 2` = 16px, etc.)
7. Cards use `elevation={0}` with border (theme default)
8. Data tables use MUI Table components (theme applies header bg + hover)
9. Status indicators use Chip with semantic color mapping
