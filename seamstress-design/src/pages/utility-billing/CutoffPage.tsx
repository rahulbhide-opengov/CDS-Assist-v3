import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Pagination,
} from '@mui/material';

/**
 * CutoffPage - Service Cutoff Cycles Management
 *
 * Features:
 * - View current and completed cutoff cycles
 * - Filter by status
 * - Start or continue cutoff workflows
 * - Pagination
 */

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cutoff-tabpanel-${index}`}
      aria-labelledby={`cutoff-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

const CutoffPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Mock data for current cutoff cycles
  const currentCycles = [
    {
      id: 1,
      name: 'Cycle 1 - Cutoff',
      status: 'Not Started',
      previousBillingPeriod: 'May 1, 2024 - May 31, 2024',
      dueDate: 'May 17, 2024',
      lastEdited: 'May 17, 2024',
      cutoffAccounts: 142,
    },
    {
      id: 2,
      name: 'Cycle 2 - Cutoff',
      status: 'Not Started',
      previousBillingPeriod: 'May 1, 2024 - May 31, 2024',
      dueDate: 'May 17, 2024',
      lastEdited: 'May 17, 2024',
      cutoffAccounts: 55,
    },
    {
      id: 3,
      name: 'Cycle 3 - Cutoff',
      status: 'In Progress',
      previousBillingPeriod: 'April 1, 2024 - April 30, 2024',
      dueDate: 'May 17, 2024',
      lastEdited: 'May 17, 2024',
      cutoffAccounts: 10,
    },
    {
      id: 4,
      name: 'Cycle 4 - Cutoff',
      status: 'In Progress',
      previousBillingPeriod: 'April 1, 2024 - April 30, 2024',
      dueDate: 'May 17, 2024',
      lastEdited: 'May 17, 2024',
      cutoffAccounts: 40,
    },
    {
      id: 5,
      name: 'Cycle 5 - Cutoff',
      status: 'In Progress',
      previousBillingPeriod: 'April 1, 2024 - April 30, 2024',
      dueDate: 'May 17, 2024',
      lastEdited: 'May 17, 2024',
      cutoffAccounts: 45,
    },
    {
      id: 6,
      name: 'Cycle 6 - Cutoff',
      status: 'In Progress',
      previousBillingPeriod: 'April 1, 2024 - April 30, 2024',
      dueDate: 'May 17, 2024',
      lastEdited: 'May 17, 2024',
      cutoffAccounts: 5,
    },
  ];

  const completedCycles = [
    {
      id: 7,
      name: 'Cycle 7 - Cutoff',
      status: 'Completed',
      previousBillingPeriod: 'March 1, 2024 - March 31, 2024',
      dueDate: 'April 17, 2024',
      lastEdited: 'April 20, 2024',
      cutoffAccounts: 128,
    },
    {
      id: 8,
      name: 'Cycle 8 - Cutoff',
      status: 'Completed',
      previousBillingPeriod: 'March 1, 2024 - March 31, 2024',
      dueDate: 'April 17, 2024',
      lastEdited: 'April 20, 2024',
      cutoffAccounts: 98,
    },
  ];

  const getStatusChip = (status: string) => {
    if (status === 'Not Started') {
      return <Chip label={status} size="small" sx={{ bgcolor: 'grey.200', color: 'text.secondary', fontWeight: 500 }} />;
    }
    if (status === 'In Progress') {
      return <Chip label={status} size="small" sx={{ bgcolor: 'primary.light', color: 'primary.main', fontWeight: 500 }} />;
    }
    if (status === 'Completed') {
      return <Chip label={status} size="small" sx={{ bgcolor: 'success.light', color: 'success.main', fontWeight: 500 }} />;
    }
    return <Chip label={status} size="small" />;
  };

  const getActionButton = (status: string) => {
    if (status === 'Not Started') {
      return (
        <Button variant="contained" size="small" sx={{ borderRadius: '4px', textTransform: 'none', minWidth: 100 }}>
          Start
        </Button>
      );
    }
    if (status === 'In Progress') {
      return (
        <Button variant="outlined" size="small" sx={{ borderRadius: '4px', textTransform: 'none', minWidth: 100 }}>
          Continue
        </Button>
      );
    }
    return null;
  };

  const filteredCurrentCycles = statusFilter === 'all'
    ? currentCycles
    : currentCycles.filter(cycle => cycle.status.toLowerCase().replace(' ', '-') === statusFilter);

  const totalPages = Math.ceil(filteredCurrentCycles.length / rowsPerPage);
  const displayedCycles = filteredCurrentCycles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ px: 3, pt: 3, pb: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h1" sx={{ fontSize: '2rem', fontWeight: 700, mb: 1 }}>
          Cutoff
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Process cutoff for accounts that have a past due balances
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', px: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} aria-label="cutoff tabs">
          <Tab
            label="Current"
            id="cutoff-tab-0"
            aria-controls="cutoff-tabpanel-0"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab
            label="Completed"
            id="cutoff-tab-1"
            aria-controls="cutoff-tabpanel-0"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <TabPanel value={currentTab} index={0}>
          {/* Status Filter */}
          <Box sx={{ mb: 3 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                displayEmpty
                sx={{ borderRadius: '4px' }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="not-started">Not Started</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Current Cycles Table */}
          <TableContainer sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Cycle</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Previous Billing Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Last Edited</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="right">Cutoff Accounts</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCycles.map((cycle) => (
                  <TableRow
                    key={cycle.id}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {cycle.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(cycle.status)}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {cycle.previousBillingPeriod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {cycle.dueDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {cycle.lastEdited}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {cycle.cutoffAccounts}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {getActionButton(cycle.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Rows per page:
              </Typography>
              <Select
                value={rowsPerPage}
                size="small"
                sx={{ minWidth: 70 }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
              <Typography variant="body2" color="text.secondary">
                1-{Math.min(rowsPerPage, filteredCurrentCycles.length)} of {filteredCurrentCycles.length}
              </Typography>
            </Stack>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_e, page) => setCurrentPage(page)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          {/* Completed Cycles Table */}
          <TableContainer sx={{ bgcolor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Cycle</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Previous Billing Period</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Due Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Last Edited</TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="right">Cutoff Accounts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedCycles.map((cycle) => (
                  <TableRow
                    key={cycle.id}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        {cycle.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(cycle.status)}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {cycle.previousBillingPeriod}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {cycle.dueDate}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                        {cycle.lastEdited}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {cycle.cutoffAccounts}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default CutoffPage;
