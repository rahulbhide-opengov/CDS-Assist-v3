/**
 * Mock Data: Capital Design System Patterns
 *
 * Comprehensive mock data for pattern library showcasing various design patterns
 * with realistic usage metrics, accessibility information, and metadata.
 */

export interface PatternExample {
  id: string;
  name: string;
  description: string;
  category: 'component' | 'layout' | 'navigation' | 'form' | 'data-display' | 'feedback';
  complexity: 'simple' | 'moderate' | 'complex';
  tags: string[];
  status: 'stable' | 'beta' | 'experimental';
  usageCount: number;
  lastUpdated: string;
  previewImage?: string;
  codeSnippet: string;
  figmaUrl?: string;
  documentation?: string;
  accessibility: {
    wcagLevel: 'A' | 'AA' | 'AAA';
    keyboardNavigable: boolean;
    screenReaderSupport: boolean;
  };
  author?: string;
  dependencies?: string[];
  relatedPatterns?: string[];
}

/**
 * Generate comprehensive mock patterns data
 */
export const mockPatterns: PatternExample[] = [
  {
    id: '1',
    name: 'List View with Filters',
    description: 'DataGrid-based list view with search, filters, and pagination. Ideal for displaying tabular data with CRUD operations.',
    category: 'data-display',
    complexity: 'moderate',
    tags: ['datagrid', 'search', 'filters', 'pagination', 'crud'],
    status: 'stable',
    usageCount: 247,
    lastUpdated: '2025-10-15',
    codeSnippet: `<DataGrid
  rows={data}
  columns={columns}
  pageSizeOptions={[10, 25, 50]}
  onRowClick={handleRowClick}
/>`,
    figmaUrl: 'https://figma.com/design/cds-37/list-pattern',
    documentation: '/docs/patterns/list-view',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/x-data-grid', '@opengov/components-page-header'],
    relatedPatterns: ['2', '3', '8'],
  },
  {
    id: '2',
    name: 'Form with Validation',
    description: 'Controlled form with field validation, error handling, and unsaved changes warning. Supports create and edit modes.',
    category: 'form',
    complexity: 'moderate',
    tags: ['form', 'validation', 'crud', 'controlled-inputs'],
    status: 'stable',
    usageCount: 189,
    lastUpdated: '2025-10-10',
    codeSnippet: `<TextField
  error={!!errors.name}
  helperText={errors.name}
  value={formData.name}
  onChange={handleChange}
/>`,
    figmaUrl: 'https://figma.com/design/cds-37/form-pattern',
    documentation: '/docs/patterns/form',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material', '@opengov/components-page-header'],
    relatedPatterns: ['1', '12'],
  },
  {
    id: '3',
    name: 'Detail View Layout',
    description: 'Read-only detail view with sections, metadata display, and action buttons. Includes edit and delete capabilities.',
    category: 'layout',
    complexity: 'simple',
    tags: ['detail', 'read-only', 'metadata', 'actions'],
    status: 'stable',
    usageCount: 156,
    lastUpdated: '2025-10-12',
    codeSnippet: `<Card sx={{ p: 2 }}>
  <Typography variant="h6">{title}</Typography>
  <Typography variant="body2">{description}</Typography>
</Card>`,
    figmaUrl: 'https://figma.com/design/cds-37/detail-pattern',
    documentation: '/docs/patterns/detail-view',
    accessibility: {
      wcagLevel: 'AAA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material', '@opengov/components-page-header'],
    relatedPatterns: ['1', '2'],
  },
  {
    id: '4',
    name: 'Dashboard with Metrics',
    description: 'Grid-based dashboard with metric cards, charts, and real-time updates. Responsive and accessible.',
    category: 'layout',
    complexity: 'complex',
    tags: ['dashboard', 'metrics', 'charts', 'grid', 'real-time'],
    status: 'stable',
    usageCount: 98,
    lastUpdated: '2025-10-08',
    codeSnippet: `<Grid container spacing={2}>
  <Grid item xs={12} md={6}>
    <MetricCard title="Total" value={100} />
  </Grid>
</Grid>`,
    figmaUrl: 'https://figma.com/design/cds-37/dashboard-pattern',
    documentation: '/docs/patterns/dashboard',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material', 'recharts'],
    relatedPatterns: ['7', '11'],
  },
  {
    id: '5',
    name: 'Navigation with Breadcrumbs',
    description: 'Entity-scoped navigation with breadcrumbs and active state management. Supports nested routing.',
    category: 'navigation',
    complexity: 'simple',
    tags: ['navigation', 'breadcrumbs', 'routing', 'entity-scoped'],
    status: 'stable',
    usageCount: 312,
    lastUpdated: '2025-10-18',
    codeSnippet: `<Breadcrumbs>
  <Link to="/entity/123">Entity</Link>
  <Link to="/entity/123/skills">Skills</Link>
  <Typography>Detail</Typography>
</Breadcrumbs>`,
    figmaUrl: 'https://figma.com/design/cds-37/nav-pattern',
    documentation: '/docs/patterns/navigation',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material', 'react-router-dom'],
    relatedPatterns: ['1', '3'],
  },
  {
    id: '6',
    name: 'Modal Dialog Pattern',
    description: 'Accessible modal dialog with backdrop, close button, and action buttons. Includes focus trap.',
    category: 'feedback',
    complexity: 'moderate',
    tags: ['modal', 'dialog', 'overlay', 'focus-trap'],
    status: 'stable',
    usageCount: 234,
    lastUpdated: '2025-10-14',
    codeSnippet: `<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Confirm Action</DialogTitle>
  <DialogContent>Are you sure?</DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>`,
    figmaUrl: 'https://figma.com/design/cds-37/modal-pattern',
    documentation: '/docs/patterns/modal',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material', '@opengov/components-modal'],
    relatedPatterns: ['9'],
  },
  {
    id: '7',
    name: 'Card Grid Layout',
    description: 'Responsive card grid with hover states and consistent spacing. Perfect for galleries and collections.',
    category: 'layout',
    complexity: 'simple',
    tags: ['card', 'grid', 'responsive', 'gallery'],
    status: 'stable',
    usageCount: 178,
    lastUpdated: '2025-10-11',
    codeSnippet: `<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ p: 2 }}>
      <CardContent>{content}</CardContent>
    </Card>
  </Grid>
</Grid>`,
    figmaUrl: 'https://figma.com/design/cds-37/card-grid',
    documentation: '/docs/patterns/card-grid',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material'],
    relatedPatterns: ['4'],
  },
  {
    id: '8',
    name: 'Toolbar with Actions',
    description: 'Two-level toolbar system with search, filters, and action buttons. Supports grouping and dividers.',
    category: 'component',
    complexity: 'moderate',
    tags: ['toolbar', 'search', 'filters', 'actions'],
    status: 'stable',
    usageCount: 203,
    lastUpdated: '2025-10-16',
    codeSnippet: `<Toolbar level="level1">
  <Toolbar.Section>
    <TextField placeholder="Search..." />
  </Toolbar.Section>
  <Toolbar.Section>
    <Button>Action</Button>
  </Toolbar.Section>
</Toolbar>`,
    figmaUrl: 'https://figma.com/design/cds-37/toolbar-pattern',
    documentation: '/docs/patterns/toolbar',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material'],
    relatedPatterns: ['1'],
  },
  {
    id: '9',
    name: 'Empty State Component',
    description: 'Friendly empty state with icon, message, and call-to-action. Contextual based on user action.',
    category: 'feedback',
    complexity: 'simple',
    tags: ['empty-state', 'feedback', 'cta', 'messaging'],
    status: 'stable',
    usageCount: 267,
    lastUpdated: '2025-10-13',
    codeSnippet: `<Box sx={{ textAlign: 'center', py: 8 }}>
  <Typography variant="h6" color="text.secondary">
    No items found
  </Typography>
  <Button startIcon={<Plus />}>Create Item</Button>
</Box>`,
    figmaUrl: 'https://figma.com/design/cds-37/empty-state',
    documentation: '/docs/patterns/empty-state',
    accessibility: {
      wcagLevel: 'AAA',
      keyboardNavigable: false,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material', '@opengov/react-capital-assets'],
    relatedPatterns: ['11'],
  },
  {
    id: '10',
    name: 'Status Indicator Chip',
    description: 'Semantic color-coded status chips for active, draft, published, archived states.',
    category: 'component',
    complexity: 'simple',
    tags: ['chip', 'status', 'badge', 'indicator'],
    status: 'stable',
    usageCount: 421,
    lastUpdated: '2025-10-20',
    codeSnippet: `<Chip
  label={status}
  color={status === 'active' ? 'success' : 'default'}
  size="small"
/>`,
    figmaUrl: 'https://figma.com/design/cds-37/chip-pattern',
    documentation: '/docs/patterns/status-chip',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: false,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material'],
    relatedPatterns: ['1'],
  },
  {
    id: '11',
    name: 'Loading State Skeleton',
    description: 'Skeleton loading pattern that maintains layout while content loads. Reduces perceived loading time.',
    category: 'feedback',
    complexity: 'simple',
    tags: ['loading', 'skeleton', 'placeholder', 'progressive'],
    status: 'stable',
    usageCount: 189,
    lastUpdated: '2025-10-09',
    codeSnippet: `<Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
  <CircularProgress size={48} />
</Box>`,
    figmaUrl: 'https://figma.com/design/cds-37/loading-pattern',
    documentation: '/docs/patterns/loading',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: false,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material'],
    relatedPatterns: ['9'],
  },
  {
    id: '12',
    name: 'Multi-Step Form Wizard',
    description: 'Step-by-step form wizard with progress indicator, validation, and back/next navigation.',
    category: 'form',
    complexity: 'complex',
    tags: ['wizard', 'multi-step', 'stepper', 'form', 'validation'],
    status: 'beta',
    usageCount: 67,
    lastUpdated: '2025-10-07',
    codeSnippet: `<Stepper activeStep={step}>
  <Step><StepLabel>Step 1</StepLabel></Step>
  <Step><StepLabel>Step 2</StepLabel></Step>
</Stepper>`,
    figmaUrl: 'https://figma.com/design/cds-37/wizard-pattern',
    documentation: '/docs/patterns/wizard',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/material'],
    relatedPatterns: ['2'],
  },
  {
    id: '13',
    name: 'Expandable Table Rows',
    description: 'DataGrid with expandable rows for nested data. Supports lazy loading of nested content.',
    category: 'data-display',
    complexity: 'complex',
    tags: ['table', 'expandable', 'nested', 'lazy-loading'],
    status: 'beta',
    usageCount: 45,
    lastUpdated: '2025-10-05',
    codeSnippet: `<DataGrid
  rows={data}
  detailPanel={(row) => <Details {...row} />}
  getDetailPanelHeight={() => 'auto'}
/>`,
    figmaUrl: 'https://figma.com/design/cds-37/expandable-table',
    documentation: '/docs/patterns/expandable-table',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Design System Team',
    dependencies: ['@mui/x-data-grid'],
    relatedPatterns: ['1'],
  },
  {
    id: '14',
    name: 'Drag and Drop List',
    description: 'Sortable list with drag-and-drop reordering. Includes visual feedback and accessibility support.',
    category: 'component',
    complexity: 'complex',
    tags: ['drag-drop', 'sortable', 'reorder', 'interactive'],
    status: 'experimental',
    usageCount: 23,
    lastUpdated: '2025-10-03',
    codeSnippet: `<DraggableList
  items={items}
  onReorder={handleReorder}
  renderItem={(item) => <ListItem>{item.name}</ListItem>}
/>`,
    figmaUrl: 'https://figma.com/design/cds-37/drag-drop',
    documentation: '/docs/patterns/drag-drop',
    accessibility: {
      wcagLevel: 'A',
      keyboardNavigable: true,
      screenReaderSupport: false,
    },
    author: 'Experimental Team',
    dependencies: ['@dnd-kit/core', '@mui/material'],
    relatedPatterns: ['1'],
  },
  {
    id: '15',
    name: 'Infinite Scroll List',
    description: 'Performance-optimized infinite scroll with virtualization and load-more trigger.',
    category: 'data-display',
    complexity: 'complex',
    tags: ['infinite-scroll', 'virtualization', 'performance', 'lazy-loading'],
    status: 'experimental',
    usageCount: 34,
    lastUpdated: '2025-10-02',
    codeSnippet: `<VirtualScroller
  items={items}
  onLoadMore={loadMore}
  renderItem={(item) => <ListItem>{item.name}</ListItem>}
/>`,
    figmaUrl: 'https://figma.com/design/cds-37/infinite-scroll',
    documentation: '/docs/patterns/infinite-scroll',
    accessibility: {
      wcagLevel: 'AA',
      keyboardNavigable: true,
      screenReaderSupport: true,
    },
    author: 'Experimental Team',
    dependencies: ['react-virtual', '@mui/material'],
    relatedPatterns: ['1', '13'],
  },
];

/**
 * Get pattern by ID
 */
export const getPatternById = (id: string): PatternExample | undefined => {
  return mockPatterns.find(pattern => pattern.id === id);
};

/**
 * Get patterns by category
 */
export const getPatternsByCategory = (category: PatternExample['category']): PatternExample[] => {
  return mockPatterns.filter(pattern => pattern.category === category);
};

/**
 * Get patterns by complexity
 */
export const getPatternsByComplexity = (complexity: PatternExample['complexity']): PatternExample[] => {
  return mockPatterns.filter(pattern => pattern.complexity === complexity);
};

/**
 * Get patterns by status
 */
export const getPatternsByStatus = (status: PatternExample['status']): PatternExample[] => {
  return mockPatterns.filter(pattern => pattern.status === status);
};

/**
 * Search patterns by query
 */
export const searchPatterns = (query: string): PatternExample[] => {
  const lowerQuery = query.toLowerCase();
  return mockPatterns.filter(pattern =>
    pattern.name.toLowerCase().includes(lowerQuery) ||
    pattern.description.toLowerCase().includes(lowerQuery) ||
    pattern.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};
