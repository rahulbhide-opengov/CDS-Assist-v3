/**
 * SkillsListPage - Custom implementation with Toolbar
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
import { useSkills } from '../contexts/DataContext';
import type { OGSkill } from '../types/opengov';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const SkillsListPageNew: React.FC = () => {
  const navigate = useNavigate();
  const skillsService = useSkills();
  const [skills, setSkills] = useState<OGSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillsService.list();
      setSkills(response.data);
    } catch (err) {
      setError('Failed to load skills');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = createDefaultColumns('skill');

  // Filter skills based on search and status
  const filteredSkills = skills.filter(skill => {
    const matchesSearch = !searchValue ||
      skill.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (skill.description && skill.description.toLowerCase().includes(searchValue.toLowerCase()));

    let matchesStatus = false;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'published') {
      matchesStatus = skill.status === 'published';
    } else if (statusFilter === 'draft') {
      matchesStatus = skill.status === 'draft';
    } else if (statusFilter === 'high-performance') {
      matchesStatus = skill.usage && skill.usage.successRate && skill.usage.successRate >= 95;
    }

    return matchesSearch && matchesStatus;
  });

  // Calculate counts
  const allCount = skills.length;
  const activeCount = skills.filter(s => s.status === 'published').length;
  const draftCount = skills.filter(s => s.status === 'draft').length;
  const highPerformanceCount = skills.filter(s =>
    s.usage && s.usage.successRate && s.usage.successRate >= 95
  ).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Skills</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Toolbar Level 1 */}
      <Toolbar level="level1">
        <Toolbar.Section grow spacing={2}>
          {/* Search Field */}
          <TextField
            size="medium"
            placeholder="Search skills by name or description..."
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
              Active ({activeCount})
            </ToggleButton>
            <ToggleButton value="draft">
              Draft ({draftCount})
            </ToggleButton>
            <ToggleButton value="high-performance">
              High Performance ({highPerformanceCount})
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar.Section>

        <Toolbar.Section>
          <Button
            variant="contained"
            size="medium"
            startIcon={<AddIcon />}
            onClick={() => navigate('/skills/new')}
          >
            Create Skill
          </Button>
        </Toolbar.Section>
      </Toolbar>

      {/* Content Area */}
      <Box sx={{ px: 3, pb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>Loading skills...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : filteredSkills.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <Typography>
              {searchValue
                ? `No skills found matching "${searchValue}"`
                : statusFilter !== 'all'
                  ? `No ${statusFilter} skills found`
                  : 'No skills defined. Create your first skill to enable agent capabilities.'}
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={filteredSkills}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 50, page: 0 },
              },
            }}
            pageSizeOptions={[25, 50, 100]}
            onRowClick={(params) => navigate(`/skills/${params.row.id}`)}
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

export default SkillsListPageNew;