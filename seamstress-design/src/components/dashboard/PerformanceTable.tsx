import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Box,
  Stack,
  TableSortLabel,
  Skeleton,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

/**
 * Column configuration for the table
 */
export interface PerformanceTableColumn {
  /** Unique identifier for the column */
  id: string;
  /** Display label for the column header */
  label: string;
  /** Width of the column (CSS value) */
  width?: string;
  /** Alignment of cell content */
  align?: 'left' | 'center' | 'right';
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Custom cell renderer */
  render?: (value: any, row: PerformanceTableRow) => React.ReactNode;
  /** Format function for sorting (converts value to comparable format) */
  sortFormat?: (value: any) => any;
}

/**
 * Row data structure
 */
export interface PerformanceTableRow {
  /** Unique identifier for the row */
  id: string;
  /** Status for row highlighting */
  status?: 'success' | 'warning' | 'error' | 'neutral';
  /** Whether to highlight this row */
  highlight?: boolean;
  /** Data values for each column */
  [key: string]: any;
}

/**
 * Action button configuration
 */
export interface RowAction {
  /** Label for the button */
  label: string;
  /** Icon for the button */
  icon?: React.ReactNode;
  /** Click handler receiving the row data */
  onClick: (row: PerformanceTableRow) => void;
  /** Button color */
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  /** Button variant */
  variant?: 'text' | 'outlined' | 'contained';
}

/**
 * Props for the PerformanceTable component
 */
export interface PerformanceTableProps {
  /** Title of the table */
  title?: string;
  /** Column definitions */
  columns: PerformanceTableColumn[];
  /** Row data */
  rows: PerformanceTableRow[];
  /** Actions available for each row */
  actions?: RowAction[];
  /** Enable search/filter functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Enable pagination */
  paginated?: boolean;
  /** Rows per page options */
  rowsPerPageOptions?: number[];
  /** Default rows per page */
  defaultRowsPerPage?: number;
  /** Loading state */
  loading?: boolean;
  /** Height of the table container */
  maxHeight?: number;
  /** Custom empty state message */
  emptyMessage?: string;
}

type SortOrder = 'asc' | 'desc';

/**
 * PerformanceTable - Enhanced table component with sorting, filtering, and actions
 *
 * Features:
 * - Sortable columns
 * - Row highlighting with status colors
 * - Status indicators
 * - Pagination support
 * - Search/filter functionality
 * - Action buttons per row
 * - Responsive design
 * - Custom cell renderers
 *
 * @example
 * ```tsx
 * <PerformanceTable
 *   title="Agent Performance"
 *   columns={[
 *     { id: 'name', label: 'Agent Name', sortable: true },
 *     { id: 'tasks', label: 'Tasks', align: 'right', sortable: true }
 *   ]}
 *   rows={[
 *     { id: '1', name: 'Research Agent', tasks: 42, status: 'success' }
 *   ]}
 *   actions={[
 *     { label: 'View', onClick: (row) => console.log(row) }
 *   ]}
 *   searchable
 *   paginated
 * />
 * ```
 */
const PerformanceTable: React.FC<PerformanceTableProps> = ({
  title,
  columns,
  rows,
  actions = [],
  searchable = true,
  searchPlaceholder = 'Search...',
  paginated = true,
  rowsPerPageOptions = [5, 10, 25, 50],
  defaultRowsPerPage = 10,
  loading = false,
  maxHeight = 600,
  emptyMessage = 'No data available',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Filter rows based on search query
  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;

    const query = searchQuery.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const value = row[col.id];
        return value?.toString().toLowerCase().includes(query);
      })
    );
  }, [rows, searchQuery, columns]);

  // Sort filtered rows
  const sortedRows = useMemo(() => {
    if (!sortColumn) return filteredRows;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column?.sortable) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Apply sort format if provided
      if (column.sortFormat) {
        aVal = column.sortFormat(aVal);
        bVal = column.sortFormat(bVal);
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortColumn, sortOrder, columns]);

  // Paginate sorted rows
  const paginatedRows = paginated
    ? sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : sortedRows;

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (sortColumn === columnId) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortOrder('asc');
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'rgba(46, 125, 50, 0.12)';
      case 'warning':
        return 'rgba(237, 108, 2, 0.12)';
      case 'error':
        return 'rgba(211, 47, 47, 0.12)';
      default:
        return 'transparent';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          {title && <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />}
          {searchable && <Skeleton variant="rectangular" width="100%" height={40} sx={{ mb: 2 }} />}
          <Skeleton variant="rectangular" width="100%" height={400} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        {(title || searchable) && (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            {title && (
              <Typography variant='h3'>
                {title}
              </Typography>
            )}
            {searchable && (
              <TextField
                size="medium"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                aria-label={`Search ${title || 'table'}`}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" aria-hidden="true" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ minWidth: { xs: '100%', sm: 250 } }}
              />
            )}
          </Stack>
        )}

        <TableContainer
          sx={{
            maxHeight,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Table size="medium" stickyHeader aria-label={title || 'Data table'}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      width: column.width,
                      fontSize: '0.875rem',
                    }}
                  >
                    {column.sortable ? (
                      <TableSortLabel
                        active={sortColumn === column.id}
                        direction={sortColumn === column.id ? sortOrder : 'asc'}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell
                    align="right"
                    sx={{ fontSize: '0.875rem' }}
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (actions.length > 0 ? 1 : 0)} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:hover': { bgcolor: 'action.hover' },
                      bgcolor: row.highlight ? getStatusColor(row.status) : 'transparent',
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id} align={column.align || 'left'}>
                        {column.render ? column.render(row[column.id], row) : row[column.id]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {actions.map((action, idx) => (
                            <Button
                              key={idx}
                              size="small"
                              variant={action.variant || 'text'}
                              color={action.color || 'primary'}
                              startIcon={action.icon}
                              onClick={() => action.onClick(row)}
                              sx={{ minWidth: 'auto' }}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </Stack>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {paginated && rows.length > 0 && (
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceTable;
