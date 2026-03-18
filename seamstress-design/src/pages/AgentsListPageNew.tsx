/**
 * AgentsListPage - Custom implementation with Toolbar
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Typography
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PageHeaderComposable } from '@opengov/components-page-header';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { Toolbar } from '../components/Toolbar';
import { agentsColumns, columnVisibilityModel } from '../config/columns/agentsColumns';
import { useAgents } from '../contexts/DataContext';
import type { OGAgent } from '../types/opengov';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const AgentsListPageNew: React.FC = () => {
  const navigate = useNavigate();
  const agentsService = useAgents();
  const [agents, setAgents] = useState<OGAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load agents on mount
  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await agentsService.list();
      setAgents(response.data);
    } catch (err) {
      setError('Failed to load agents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter agents based on search and status
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = !searchValue ||
      agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (agent.description && agent.description.toLowerCase().includes(searchValue.toLowerCase())) ||
      (agent.summary && agent.summary.toLowerCase().includes(searchValue.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate counts for toggle buttons
  const allCount = agents.length;
  const publishedCount = agents.filter(a => a.status === 'published').length;
  const draftCount = agents.filter(a => a.status === 'draft').length;

  return (
    <Box>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Assistants</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar Level 1 */}
      <Toolbar level="level1">
        <Toolbar.Section grow spacing={2}>
          {/* Search Field */}
          <TextField
            size="medium"
            placeholder="Search agents by name or description..."
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

          {/* Toggle Button Group for Status Filter */}
          <ToggleButtonGroup
            size="small"
            value={statusFilter}
            exclusive
            onChange={(_, value) => value && setStatusFilter(value)}
          >
            <ToggleButton value="all">
              All ({allCount})
            </ToggleButton>
            <ToggleButton value="published">
              Published ({publishedCount})
            </ToggleButton>
            <ToggleButton value="draft">
              Draft ({draftCount})
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar.Section>

        <Toolbar.Section>
          <Button
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            onClick={() => navigate('/agents/new/edit')}
          >
            Create Agent
          </Button>
        </Toolbar.Section>
      </Toolbar>

      {/* Content Area */}
      <Box sx={{ px: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading agents...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredAgents.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>
              {searchValue
                ? `No agents found matching "${searchValue}"`
                : statusFilter !== 'all'
                  ? `No ${statusFilter} agents found`
                  : 'No agents yet. Create your first agent to get started.'}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={filteredAgents}
            columns={agentsColumns}
            columnVisibilityModel={columnVisibilityModel}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            onRowClick={(params) => navigate(`/agents/${params.row.id}/edit`)}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default AgentsListPageNew;