import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { Toolbar } from '../components/Toolbar';
import CodeIcon from '@mui/icons-material/Code';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

interface Prototype {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
  status: 'production' | 'beta' | 'concept';
}

const prototypes: Prototype[] = [
  {
    id: 'agent-studio',
    title: 'Agent Studio',
    description: 'Comprehensive agent management interface with CRUD operations, skill management, and workflow configuration.',
    url: '/agent-studio/dashboard',
    image: '/Seamstress-logo.svg',
    tags: ['AI', 'Management', 'Dashboard'],
    status: 'production',
  },
  {
    id: 'agent-studio-agents',
    title: 'Agent Studio - Agents',
    description: 'Agent list and detail views with configuration, capabilities, and performance metrics.',
    url: '/agent-studio/agents',
    image: '/Seamstress-logo.svg',
    tags: ['AI', 'Management', 'Agents'],
    status: 'production',
  },
  {
    id: 'agent-studio-skills',
    title: 'Agent Studio - Skills',
    description: 'Skill management interface for creating and configuring agent capabilities.',
    url: '/agent-studio/skills',
    image: '/Seamstress-logo.svg',
    tags: ['AI', 'Skills', 'Configuration'],
    status: 'production',
  },
  {
    id: 'agent-studio-tools',
    title: 'Agent Studio - Tools',
    description: 'Tools library for managing agent integrations and external capabilities.',
    url: '/agent-studio/tools',
    image: '/Seamstress-logo.svg',
    tags: ['AI', 'Tools', 'Integrations'],
    status: 'production',
  },
  {
    id: 'agent-studio-knowledge',
    title: 'Agent Studio - Knowledge Base',
    description: 'Knowledge base management with document uploads, vector search, and semantic retrieval.',
    url: '/agent-studio/knowledge',
    image: '/Seamstress-logo.svg',
    tags: ['AI', 'Knowledge', 'Search'],
    status: 'production',
  },
  {
    id: 'agent-studio-chat',
    title: 'Agent Studio - Chat Interface',
    description: 'Interactive chat interface for testing and interacting with AI agents.',
    url: '/agent-studio/chat',
    image: '/Seamstress-logo.svg',
    tags: ['AI', 'Chat', 'Testing'],
    status: 'production',
  },
  {
    id: 'eam-dashboard',
    title: 'EAM Dashboard',
    description: 'Enterprise Asset Management dashboard with work orders, maintenance scheduling, and asset tracking.',
    url: '/eam/dashboard',
    image: '/Seamstress-logo.svg',
    tags: ['EAM', 'Analytics', 'Operations'],
    status: 'production',
  },
  {
    id: 'utility-billing-home',
    title: 'Utility Billing - Home',
    description: 'Utility billing home page with account overview, recent activity, and quick actions.',
    url: '/utility-billing/home',
    image: '/Seamstress-logo.svg',
    tags: ['Billing', 'Finance', 'Utilities'],
    status: 'production',
  },
  {
    id: 'utility-billing-cutoff',
    title: 'Utility Billing - Cutoff Workflow',
    description: 'Service cutoff workflow with account selection, notification scheduling, and cutoff processing.',
    url: '/utility-billing/workflows/cutoff',
    image: '/Seamstress-logo.svg',
    tags: ['Billing', 'Workflow', 'Operations'],
    status: 'production',
  },
  {
    id: 'utility-billing-account-format',
    title: 'Utility Billing - Account Number Format',
    description: 'Account number format configuration with validation rules and format preview.',
    url: '/utility-billing/settings/account-number-format',
    image: '/Seamstress-logo.svg',
    tags: ['Billing', 'Settings', 'Configuration'],
    status: 'production',
  },
  {
    id: 'workspace',
    title: 'Agent Workspace Demo',
    description: 'Interactive agent workspace demonstrating real-time collaboration and task management.',
    url: '/workspace',
    image: '/Seamstress-logo.svg',
    tags: ['Workspace', 'Collaboration', 'Real-time'],
    status: 'production',
  },
  {
    id: 'procurement-list',
    title: 'Procurement Projects',
    description: 'Procurement projects list page with advanced filters, search, and three-column layout.',
    url: '/procurement/projects',
    image: '/Seamstress-logo.svg',
    tags: ['Procurement', 'List View', 'Filters'],
    status: 'production',
  },
];

const statusColors = {
  production: 'success',
  beta: 'warning',
  concept: 'default',
} as const;

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: 'Prototype Name',
    flex: 1,
    minWidth: 200,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    minWidth: 300,
    renderCell: (params) => (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: 'tags',
    headerName: 'Tags',
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, py: 0.5 }}>
        {(params.value as string[]).slice(0, 2).map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" />
        ))}
        {(params.value as string[]).length > 2 && (
          <Chip label={`+${(params.value as string[]).length - 2}`} size="small" variant="outlined" />
        )}
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={statusColors[params.value as keyof typeof statusColors]}
        size="small"
        sx={{ textTransform: 'capitalize' }}
      />
    ),
  },
  {
    field: 'actions',
    headerName: '',
    width: 80,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          window.open(params.row.url, '_blank');
        }}
      >
        <OpenInNewIcon fontSize="small" />
      </IconButton>
    ),
  },
];

export const PrototypesIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');

  const filteredPrototypes = prototypes.filter((prototype) =>
    searchValue === '' ||
    prototype.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    prototype.description.toLowerCase().includes(searchValue.toLowerCase()) ||
    prototype.tags.some((tag) => tag.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <Box>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Prototypes Gallery</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Explore interactive prototypes built with Seamstress
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar Level 1 */}
      <Toolbar level="level1">
        <Toolbar.Section grow spacing={2}>
          {/* Search Field */}
          <TextField
            size="medium"
            placeholder="Search prototypes by name, description, or tags..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ width: 400 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchValue && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchValue('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Toolbar.Section>

        <Toolbar.Section>
          <Button
            variant="outlined"
            startIcon={<CodeIcon />}
            onClick={() => navigate('/seamstress')}
          >
            Documentation
          </Button>
        </Toolbar.Section>
      </Toolbar>

      {/* Content */}
      <Box sx={{ px: 3, pb: 3 }}>
        <DataGrid
          rows={filteredPrototypes}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10, page: 0 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          onRowClick={(params) => navigate(params.row.url)}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            },
            '& .MuiDataGrid-cell': {
              py: 2,
              display: 'flex',
              alignItems: 'center',
            },
          }}
        />

        {/* Info Section */}
        <Box sx={{ height: 20 }} />

        <Box
          sx={{
            mt: 6,
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" gutterBottom>
            About These Prototypes
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            All prototypes in this gallery were built using Seamstress, our AI-powered
            design-to-code system. Seamstress converts Figma designs into production-ready
            React components using advanced pattern recognition and code generation.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/seamstress/how-it-works')}
            >
              Learn How It Works
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/seamstress/building-from-figma')}
            >
              Build Your Own
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default PrototypesIndexPage;
