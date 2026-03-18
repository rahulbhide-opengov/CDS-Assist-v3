---
name: Detail View Pattern
description: Full production-ready scaffold for CDS detail view pages with field groups, tabs, and delete confirmation.
---

# Detail View Pattern

**Keywords:** detail, view, show, display, read-only, profile

Use this skill when generating read-only detail/view pages that display a single entity with related items and actions.

---

## Scaffold Structure

### PageHeaderComposable
- Title: Entity name or ID
- Description: Status Chip + metadata (e.g., "Created Mar 12, 2026")
- Actions: Back, Edit, Delete buttons

### Field Groups
- Card variant="outlined" containers
- Stack layout for label + value pairs
- Fields: Typography variant="caption" (label) + variant="body1" (value)

### Status Display
- Chip with semantic color mapping

### Date Formatting
- `Intl.DateTimeFormat` for consistent display

### Related Items
- Table or List for related resources

### Tabbed Layout
- MUI Tabs for multiple sections (Overview, History, Related)

### Delete Confirmation
- Dialog with "Are you sure?" + Cancel/Delete actions

### Four States
1. **Loading**: Skeleton matching layout
2. **Error**: Alert + Retry button
3. **Empty/Not found**: "Resource not found" + Back button
4. **Success**: Full content

### Responsive
- maxWidth 800px for field groups
- Tabs stack on mobile

### Entity-Scoped Routing
- Route: `/suite/items/:id`

---

## Complete Code Example

```tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { getItemById, type ItemDetail } from '../../data/itemsData';

const STATUS_CHIP_COLOR: Record<string, 'info' | 'success' | 'warning' | 'default' | 'error'> = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'success',
  Archived: 'default',
};

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

const ItemDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [state, setState] = useState<'loading' | 'error' | 'empty' | 'success'>('loading');
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadItem = useCallback(() => {
    if (!id) {
      setState('empty');
      return;
    }
    setState('loading');
    setTimeout(() => {
      const data = getItemById(id);
      if (data) {
        setItem(data);
        setState('success');
      } else {
        setItem(null);
        setState('empty');
      }
    }, 500);
  }, [id]);

  useEffect(() => {
    loadItem();
  }, [loadItem]);

  const handleRetry = useCallback(() => {
    loadItem();
  }, [loadItem]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setDeleting(false);
    setDeleteDialogOpen(false);
    navigate('/suite/items');
  }, [navigate]);

  if (state === 'loading') {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box component="header">
          <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
            <PageHeaderComposable.Header>
              <PageHeaderComposable.Title>
                <Skeleton variant="text" width={200} />
              </PageHeaderComposable.Title>
              <PageHeaderComposable.Description>
                <Skeleton variant="text" width={300} />
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
          <Skeleton variant="rectangular" height={200} sx={{ mb: 3, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 1 }} />
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
              <PageHeaderComposable.Title>Item Details</PageHeaderComposable.Title>
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
            Failed to load item. Please try again.
          </Alert>
        </Box>
      </Box>
    );
  }

  if (state === 'empty' || !item) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box component="header">
          <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
            <PageHeaderComposable.Header>
              <PageHeaderComposable.Title>Item Not Found</PageHeaderComposable.Title>
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
          <Alert severity="info" sx={{ mb: 3 }}>
            The item you are looking for does not exist or has been removed.
          </Alert>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
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
              <Button key="back" variant="outlined" color="inherit" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                Back
              </Button>,
              <Button
                key="edit"
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/suite/items/${id}/edit`)}
              >
                Edit
              </Button>,
              <Button
                key="delete"
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>,
            ]}
          >
            <PageHeaderComposable.Title>{item.name}</PageHeaderComposable.Title>
            <PageHeaderComposable.Description>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip label={item.status} size="small" color={STATUS_CHIP_COLOR[item.status] ?? 'default'} />
                <Typography variant="body2" color="text.secondary">
                  Created {formatDate(item.createdAt)}
                </Typography>
              </Stack>
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
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label="Overview" />
            <Tab label="Related Items" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Stack spacing={3} sx={{ maxWidth: 800 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Stack spacing={0}>
                  <DetailRow label="ID" value={item.id} />
                  <DetailRow label="Name" value={item.name} />
                  <DetailRow label="Status" value={<Chip label={item.status} size="small" color={STATUS_CHIP_COLOR[item.status] ?? 'default'} />} />
                  <DetailRow label="Category" value={item.category} />
                  <DetailRow label="Priority" value={item.priority} />
                  <DetailRow label="Created" value={formatDate(item.createdAt)} />
                  <DetailRow label="Last Updated" value={formatDate(item.updatedAt)} />
                </Stack>
              </CardContent>
            </Card>

            {item.description && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Stack>
        )}

        {activeTab === 1 && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Related Items
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(!item.relatedItems || item.relatedItems.length === 0) ? (
                      <TableRow>
                        <TableCell colSpan={3}>
                          <Typography variant="body2" color="text.secondary">
                            No related items
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      item.relatedItems.map((rel) => (
                        <TableRow key={rel.id} hover sx={{ cursor: 'pointer' }}>
                          <TableCell>{rel.id}</TableCell>
                          <TableCell>{rel.name}</TableCell>
                          <TableCell>
                            <Chip label={rel.status} size="small" color={STATUS_CHIP_COLOR[rel.status] ?? 'default'} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={deleteDialogOpen} onClose={() => !deleting && setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. The item will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete} disabled={deleting} variant="contained">
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ItemDetailPage;
```

---

## Mock Data Example (`src/data/itemsData.ts`)

```ts
import { faker } from '@faker-js/faker';

export interface ItemDetail {
  id: string;
  name: string;
  description?: string;
  status: string;
  category: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  relatedItems?: { id: string; name: string; status: string }[];
}

const items: ItemDetail[] = Array.from({ length: 20 }, (_, i) => ({
  id: `ITM-${String(i + 1).padStart(4, '0')}`,
  name: faker.commerce.productName(),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(['Active', 'Pending', 'Completed', 'Archived']),
  category: faker.helpers.arrayElement(['Category A', 'Category B']),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  relatedItems: Array.from({ length: 3 }, (__, j) => ({
    id: `REL-${j + 1}`,
    name: faker.commerce.productName(),
    status: faker.helpers.arrayElement(['Active', 'Pending']),
  })),
}));

export function getItemById(id: string): ItemDetail | undefined {
  return items.find((item) => item.id === id);
}
```
