---
name: List View Pattern
description: Full production-ready scaffold for CDS list view pages with search, filters, DataGrid, and pagination.
---

# List View Pattern

**Keywords:** list, table, grid, search, index, browse, filter

Use this skill when generating list/index pages that display tabular data with search, filters, and sorting.

---

## Scaffold Structure

### PageHeaderComposable
- Title + Description
- Actions: Create button with AddIcon

### Search
- TextField with InputAdornment SearchIcon
- 300ms debounce (use `useDebouncedCallback` or custom hook)

### Filter Row
- Select dropdowns for status, category, etc.
- Active filters shown as Chips with onDelete

### DataGrid
- `@mui/x-data-grid` with:
  - `GridColDef[]` with `flex`, `minWidth`, `renderCell` for Chips/Links
  - Row click navigation to detail view
  - Pagination
  - Sorting

### Status Chip Color Mapping
- Standard pattern: `Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'>`

### Four States
1. **Loading**: Skeleton rows or CircularProgress
2. **Error**: Alert + Retry button
3. **Empty**: Typography + CTA (e.g., "Create first item")
4. **Success**: DataGrid

### Responsive
- DataGrid on desktop
- Card stack on mobile (table-to-card pattern)

### Form Validation
- react-hook-form + yup for create/edit modals

### Mock Data
- faker.js generators in `src/data/`

### Entity-Scoped Routing
- Routes: `/suite/items`, `/suite/items/:id`, `/suite/items/new`

---

## Complete Code Example

```tsx
import React, { useState, useCallback, useMemo } from 'react';
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
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
  useTheme,
  useMediaQuery,
  Link,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowParams } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import InboxIcon from '@mui/icons-material/Inbox';

import { useDebounce } from 'react-use';

import { itemsListData, type ListItem } from '../../data/itemsData';

const STATUS_CHIP_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'success',
  Draft: 'default',
  Archived: 'default',
};

const ItemsListPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('success');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch] = useDebounce(searchInput, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const handleRetry = useCallback(() => {
    setState('loading');
    setTimeout(() => setState('success'), 800);
  }, []);

  const filteredItems = useMemo(() => {
    let result = itemsListData;
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.id.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }
    if (categoryFilter !== 'all') {
      result = result.filter((item) => item.category === categoryFilter);
    }
    return result;
  }, [debouncedSearch, statusFilter, categoryFilter]);

  const clearFilters = useCallback(() => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearchInput('');
  }, []);

  const hasActiveFilters = statusFilter !== 'all' || categoryFilter !== 'all' || debouncedSearch !== '';

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Link
            variant="body2"
            color="primary"
            underline="hover"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(`/suite/items/${params.row.id}`);
            }}
          >
            {params.value}
          </Link>
        ),
      },
      {
        field: 'name',
        headerName: 'Name',
        flex: 2,
        minWidth: 200,
      },
      {
        field: 'status',
        headerName: 'Status',
        flex: 1,
        minWidth: 120,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={STATUS_CHIP_COLOR[params.value as string] ?? 'default'}
          />
        ),
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
        minWidth: 120,
      },
      {
        field: 'updatedAt',
        headerName: 'Updated',
        flex: 1,
        minWidth: 120,
      },
    ],
    [navigate]
  );

  if (state === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box component="header">
          <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
            <PageHeaderComposable.Header>
              <PageHeaderComposable.Title>Items</PageHeaderComposable.Title>
              <PageHeaderComposable.Description>Manage all items</PageHeaderComposable.Description>
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
          <Skeleton variant="rectangular" height={40} sx={{ mb: 2, maxWidth: 400 }} />
          <Skeleton variant="rectangular" height={400} />
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
              <PageHeaderComposable.Title>Items</PageHeaderComposable.Title>
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
            Failed to load items. Please try again.
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Button
                key="create"
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/suite/items/new')}
              >
                Create
              </Button>,
            ]}
          >
            <PageHeaderComposable.Title>Items</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              {filteredItems.length} items total
            </PageHeaderComposable.Description>
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
        <Stack spacing={2} sx={{ mb: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
            <TextField
              size="small"
              placeholder="Search items..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={{ flexGrow: 1, minWidth: 200, maxWidth: 400 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="Category A">Category A</MenuItem>
                <MenuItem value="Category B">Category B</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          {hasActiveFilters && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {statusFilter !== 'all' && (
                <Chip
                  label={`Status: ${statusFilter}`}
                  size="small"
                  onDelete={() => setStatusFilter('all')}
                />
              )}
              {categoryFilter !== 'all' && (
                <Chip
                  label={`Category: ${categoryFilter}`}
                  size="small"
                  onDelete={() => setCategoryFilter('all')}
                />
              )}
              {debouncedSearch && (
                <Chip
                  label={`Search: ${debouncedSearch}`}
                  size="small"
                  onDelete={() => setSearchInput('')}
                />
              )}
              <Button variant="text" size="small" onClick={clearFilters}>
                Clear all
              </Button>
            </Stack>
          )}
        </Stack>

        {filteredItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <InboxIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {itemsListData.length === 0 ? 'No items yet' : 'No results match your filters'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {itemsListData.length === 0
                ? 'Get started by creating your first item.'
                : 'Try adjusting your search or filters.'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                itemsListData.length === 0
                  ? navigate('/suite/items/new')
                  : clearFilters()
              }
            >
              {itemsListData.length === 0 ? 'Create First Item' : 'Clear Filters'}
            </Button>
          </Box>
        ) : isMobile ? (
          <Stack spacing={2}>
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                variant="outlined"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(`/suite/items/${item.id}`)}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Link
                      variant="subtitle2"
                      color="primary"
                      underline="hover"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/suite/items/${item.id}`);
                      }}
                    >
                      {item.id}
                    </Link>
                    <Chip
                      label={item.status}
                      size="small"
                      color={STATUS_CHIP_COLOR[item.status] ?? 'default'}
                    />
                  </Stack>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {item.name}
                  </Typography>
                  <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {item.category}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.updatedAt}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <Box sx={{ height: 500 }}>
            <DataGrid
              rows={filteredItems}
              columns={columns}
              pagination
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
              onRowClick={(params: GridRowParams) => navigate(`/suite/items/${params.id}`)}
              sx={{
                '& .MuiDataGrid-cell': { cursor: 'pointer' },
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ItemsListPage;
```

---

## Mock Data Example (`src/data/itemsData.ts`)

```ts
import { faker } from '@faker-js/faker';

export interface ListItem {
  id: string;
  name: string;
  status: string;
  category: string;
  updatedAt: string;
}

export const itemsListData: ListItem[] = Array.from({ length: 50 }, (_, i) => ({
  id: `ITM-${String(i + 1).padStart(4, '0')}`,
  name: faker.commerce.productName(),
  status: faker.helpers.arrayElement(['Active', 'Pending', 'Completed', 'Draft']),
  category: faker.helpers.arrayElement(['Category A', 'Category B']),
  updatedAt: faker.date.recent({ days: 30 }).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
}));
```
