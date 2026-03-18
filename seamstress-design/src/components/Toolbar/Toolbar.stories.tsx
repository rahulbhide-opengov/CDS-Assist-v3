import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Box,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import Toolbar from './Toolbar';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';

const meta: Meta<typeof Toolbar> = {
  title: 'Components/Toolbar',
  component: Toolbar,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper' }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Toolbar>;

// Level 1 - Full featured toolbar
export const Level1Full: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('all');
    const [viewMode, setViewMode] = useState('grid');

    return (
      <Toolbar level="level1">
        <Toolbar.Section grow>
          <IconButton size="medium">
            <MenuIcon />
          </IconButton>

          <TextField
            size="medium"
            placeholder="Search for items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 320 }}
          />

          <Select
            size="medium"
            value={department}
            onChange={(e) => setDepartment(e.target.value as string)}
            displayEmpty
          >
            <MenuItem value="all">All Departments</MenuItem>
            <MenuItem value="finance">Finance</MenuItem>
            <MenuItem value="hr">Human Resources</MenuItem>
            <MenuItem value="it">IT</MenuItem>
          </Select>

          <Toolbar.Divider />

          <ToggleButtonGroup
            size="medium"
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar.Section>

        <Toolbar.Section>
          <Button size="medium" variant="text" startIcon={<UploadIcon />}>
            Import
          </Button>
          <Button size="medium" variant="text" startIcon={<DownloadIcon />}>
            Export
          </Button>
          <Button size="medium" variant="contained" startIcon={<AddIcon />}>
            Create New
          </Button>
        </Toolbar.Section>
      </Toolbar>
    );
  },
};

// Level 2 - Secondary toolbar
export const Level2Filters: Story = {
  render: () => {
    const [status, setStatus] = useState('all');
    const [sort, setSort] = useState('name');
    const [view, setView] = useState('grid');

    return (
      <Toolbar level="level2">
        <Toolbar.Section grow>
          <ToggleButtonGroup
            size="medium"
            value={view}
            exclusive
            onChange={(_, value) => value && setView(value)}
          >
            <ToggleButton value="grid">
              <ViewModuleIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="list">
              <ViewListIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          <ToggleButtonGroup
            size="medium"
            value={status}
            exclusive
            onChange={(_, value) => value && setStatus(value)}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="active">Active</ToggleButton>
            <ToggleButton value="inactive">Inactive</ToggleButton>
            <ToggleButton value="archived">Archived</ToggleButton>
          </ToggleButtonGroup>

          <Select
            size="medium"
            value={sort}
            onChange={(e) => setSort(e.target.value as string)}
            displayEmpty
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="status">Status</MenuItem>
          </Select>
        </Toolbar.Section>

        <Toolbar.Section>
          <Button size="medium" variant="outlined" startIcon={<FilterListIcon />}>
            Add Filter
          </Button>
          <IconButton size="medium">
            <RefreshIcon />
          </IconButton>
        </Toolbar.Section>
      </Toolbar>
    );
  },
};

// With drawer controls
export const WithDrawerControls: Story = {
  render: () => {
    const [leftDrawer, setLeftDrawer] = useState(false);
    const [rightDrawer, setRightDrawer] = useState(false);
    const [search, setSearch] = useState('');

    return (
      <>
        <Toolbar level="level1">
          <Toolbar.Section>
            <Button
              size="medium"
              variant="outlined"
              startIcon={leftDrawer ? <CloseIcon /> : <FilterListIcon />}
              onClick={() => setLeftDrawer(!leftDrawer)}
            >
              {leftDrawer ? 'Hide Filters' : 'Filters'}
            </Button>
          </Toolbar.Section>

          <Toolbar.Section grow>
            <TextField
              size="medium"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar.Section>

          <Toolbar.Section>
            <Button
              size="medium"
              variant="text"
              startIcon={rightDrawer ? <CloseIcon /> : <MenuIcon />}
              onClick={() => setRightDrawer(!rightDrawer)}
            >
              {rightDrawer ? 'Hide Details' : 'Details'}
            </Button>
            <IconButton size="medium">
              <SettingsIcon />
            </IconButton>
          </Toolbar.Section>
        </Toolbar>

        {/* Mock drawer panels */}
        <Box sx={{ display: 'flex', height: 400, bgcolor: 'background.default' }}>
          {leftDrawer && (
            <Box
              sx={{
                width: 240,
                bgcolor: 'background.paper',
                borderRight: 1,
                borderColor: 'divider',
                p: 2,
              }}
            >
              <Box sx={{ fontWeight: 500, mb: 2 }}>Filter Panel</Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Filter controls would go here
              </Box>
            </Box>
          )}

          <Box sx={{ flex: 1, p: 3 }}>
            <Box sx={{ color: 'text.secondary' }}>Main content area</Box>
          </Box>

          {rightDrawer && (
            <Box
              sx={{
                width: 320,
                bgcolor: 'background.paper',
                borderLeft: 1,
                borderColor: 'divider',
                p: 2,
              }}
            >
              <Box sx={{ fontWeight: 500, mb: 2 }}>Details Panel</Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Detail information would go here
              </Box>
            </Box>
          )}
        </Box>
      </>
    );
  },
};

// Combined Level 1 and Level 2
export const CombinedLevels: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [status, setStatus] = useState('all');
    const [filterDrawer, setFilterDrawer] = useState(false);

    return (
      <>
        {/* Level 1 */}
        <Toolbar level="level1">
          <Toolbar.Section grow>
            <Button
              size="medium"
              variant="outlined"
              startIcon={filterDrawer ? <CloseIcon /> : <FilterListIcon />}
              onClick={() => setFilterDrawer(!filterDrawer)}
            >
              {filterDrawer ? 'Hide' : 'Filters'}
            </Button>

            <TextField
              size="medium"
              placeholder="Search everything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Toolbar.Section>

          <Toolbar.Section>
            <Button size="medium" variant="text" startIcon={<UploadIcon />}>
              Import
            </Button>
            <Button size="medium" variant="contained" startIcon={<AddIcon />}>
              Create New
            </Button>
          </Toolbar.Section>
        </Toolbar>

        {/* Level 2 */}
        <Toolbar level="level2">
          <Toolbar.Section grow>
            <ToggleButtonGroup
              size="medium"
              value={viewMode}
              exclusive
              onChange={(_, value) => value && setViewMode(value)}
            >
              <ToggleButton value="grid">
                <ViewModuleIcon/>
              </ToggleButton>
              <ToggleButton value="list">
                <ViewListIcon/>
              </ToggleButton>
            </ToggleButtonGroup>

            <Toolbar.Divider />

            <ToggleButtonGroup
              size="medium"
              value={status}
              exclusive
              onChange={(_, value) => value && setStatus(value)}
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="active">Active</ToggleButton>
              <ToggleButton value="archived">Archived</ToggleButton>
            </ToggleButtonGroup>

            <IconButton size="medium">
              <MenuIcon/>
            </IconButton>
          </Toolbar.Section>
        </Toolbar>

        {/* Content area with optional drawer */}
        <Box sx={{ display: 'flex', height: 400, bgcolor: 'background.default' }}>
          {filterDrawer && (
            <Box
              sx={{
                width: 280,
                bgcolor: 'background.paper',
                borderRight: 1,
                borderColor: 'divider',
                p: 2,
              }}
            >
              <Box sx={{ fontWeight: 500, mb: 2 }}>Advanced Filters</Box>
              <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                Additional filter controls
              </Box>
            </Box>
          )}

          <Box sx={{ flex: 1, p: 3 }}>
            <Box sx={{ color: 'text.secondary' }}>
              Main content area with view mode: {viewMode}, status filter: {status}
            </Box>
          </Box>
        </Box>
      </>
    );
  },
};

// Minimal toolbar
export const Minimal: Story = {
  render: () => {
    const [search, setSearch] = useState('');

    return (
      <Toolbar level="level2">
        <Toolbar.Section grow>
          <TextField
            size="medium"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, maxWidth: 600 }}
          />
        </Toolbar.Section>
      </Toolbar>
    );
  },
};

// With Autocomplete
export const WithAutocomplete: Story = {
  render: () => {
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const users = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];

    return (
      <Toolbar level="level1">
        <Toolbar.Section grow>
          <Autocomplete
            size="medium"
            options={users}
            value={selectedUser}
            onChange={(_, value) => setSelectedUser(value)}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select user..." />
            )}
            sx={{ width: 250 }}
          />

          <Select
            size="medium"
            value="all"
            displayEmpty
          >
            <MenuItem value="all">All Projects</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </Toolbar.Section>

        <Toolbar.Section>
          <Button size="medium" variant="contained">Apply Filters</Button>
        </Toolbar.Section>
      </Toolbar>
    );
  },
};