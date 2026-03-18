/**
 * ToolsListPage - Custom implementation with Toolbar
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
import type { GridColDef } from '@mui/x-data-grid';
import { PageHeaderComposable } from '@opengov/components-page-header';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { Toolbar } from '../components/Toolbar';
import { createDefaultColumns } from '../templates';
import { useTools } from '../contexts/DataContext';
import type { OGTool } from '../types/opengov';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const ToolsListPageNew: React.FC = () => {
  const navigate = useNavigate();
  const toolsService = useTools();
  const [tools, setTools] = useState<OGTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await toolsService.list();
      setTools(response.data);
    } catch (err) {
      setError('Failed to load tools');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = createDefaultColumns('tool');

  // Filter tools based on search and type
  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchValue ||
      tool.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (tool.description && tool.description.toLowerCase().includes(searchValue.toLowerCase()));

    const matchesType = typeFilter === 'all' || tool.type === typeFilter;

    return matchesSearch && matchesType;
  });

  // Calculate counts
  const allCount = tools.length;
  const apiCount = tools.filter(t => t.type === 'api').length;
  const dbCount = tools.filter(t => t.type === 'database').length;
  const integrationCount = tools.filter(t => t.type === 'integration').length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Tools</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar Level 1 */}
      <Toolbar level="level1">
        <Toolbar.Section grow spacing={2}>
          {/* Search Field */}
          <TextField
            size="medium"
            placeholder="Search tools..."
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
                )
              }
            }}
          />

          {/* Toggle Button Group for Type Filter */}
          <ToggleButtonGroup
            size="small"
            value={typeFilter}
            exclusive
            onChange={(_, value) => value && setTypeFilter(value)}
          >
            <ToggleButton value="all">
              All ({allCount})
            </ToggleButton>
            <ToggleButton value="api">
              API ({apiCount})
            </ToggleButton>
            <ToggleButton value="database">
              Database ({dbCount})
            </ToggleButton>
            <ToggleButton value="integration">
              Integration ({integrationCount})
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar.Section>

        <Toolbar.Section>
          <Button
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tools/new')}
          >
            Add Tool
          </Button>
        </Toolbar.Section>
      </Toolbar>

      {/* Content Area */}
      <Box sx={{ px: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading tools...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredTools.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>
              {searchValue
                ? `No tools found matching "${searchValue}"`
                : typeFilter !== 'all'
                  ? `No ${typeFilter} tools found`
                  : 'No tools yet. Add your first tool to get started.'}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={filteredTools}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25, page: 0 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            onRowClick={(params) => navigate(`/tools/${params.row.id}`)}
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

export default ToolsListPageNew;