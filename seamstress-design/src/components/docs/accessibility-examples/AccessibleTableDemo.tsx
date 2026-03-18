import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as SortAscIcon,
  ArrowDownward as SortDescIcon,
} from '@mui/icons-material';

interface TableRow {
  id: number;
  name: string;
  department: string;
  status: string;
}

/**
 * AccessibleTableDemo - Demonstrates table navigation with keyboard
 *
 * Keyboard patterns:
 * - Up/Down: Navigate between rows
 * - Enter: Activate row action or sort column
 * - Space: Toggle row selection
 * - Ctrl+A: Select all rows
 */
export function AccessibleTableDemo() {
  const theme = useTheme();
  const [data] = useState<TableRow[]>([
    { id: 1, name: 'Alice Johnson', department: 'Engineering', status: 'Active' },
    { id: 2, name: 'Bob Smith', department: 'Marketing', status: 'Active' },
    { id: 3, name: 'Carol Williams', department: 'Finance', status: 'Inactive' },
    { id: 4, name: 'David Brown', department: 'Engineering', status: 'Active' },
    { id: 5, name: 'Eva Martinez', department: 'HR', status: 'Active' },
  ]);

  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [focusedRow, setFocusedRow] = useState<number>(0);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [lastAction, setLastAction] = useState<string>('');
  const rowRefs = useRef<Map<number, HTMLTableRowElement>>(new Map());

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortColumn as keyof TableRow];
    const bVal = b[sortColumn as keyof TableRow];
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const toggleRowSelection = useCallback((id: number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    setLastAction(`Row ${selectedRows.has(id) ? 'deselected' : 'selected'}`);
  }, [selectedRows]);

  const selectAllRows = useCallback(() => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      setLastAction('All rows deselected');
    } else {
      setSelectedRows(new Set(data.map(d => d.id)));
      setLastAction('All rows selected');
    }
  }, [data.length, selectedRows.size]);

  const focusRow = useCallback((index: number) => {
    const row = rowRefs.current.get(index);
    if (row) {
      row.focus();
      setFocusedRow(index);
    }
  }, []);

  const handleRowKeyDown = useCallback((e: React.KeyboardEvent, index: number, row: TableRow) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        focusRow(Math.max(0, index - 1));
        setLastAction('Moved up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        focusRow(Math.min(sortedData.length - 1, index + 1));
        setLastAction('Moved down');
        break;
      case ' ':
        e.preventDefault();
        toggleRowSelection(row.id);
        break;
      case 'Enter':
        e.preventDefault();
        setLastAction(`Edit action on ${row.name}`);
        break;
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          selectAllRows();
        }
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        setLastAction(`Delete action on ${row.name}`);
        break;
    }
  }, [focusRow, sortedData.length, toggleRowSelection, selectAllRows]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setLastAction(`Sorted by ${column}`);
  };

  const handleHeaderKeyDown = (e: React.KeyboardEvent, column: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSort(column);
    }
  };

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: -2,
    },
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Up/Down</strong> arrows to navigate rows, <strong>Space</strong> to select,{' '}
        <strong>Enter</strong> for row action, <strong>Ctrl+A</strong> to select all.
        <strong>Tab</strong> to headers, <strong>Enter</strong> to sort.
      </Typography>

      {/* Selection info */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>{selectedRows.size}</strong> of {data.length} selected
        </Typography>
      </Box>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Box
          component="table"
          role="grid"
          aria-label="Employee data table"
          aria-rowcount={sortedData.length + 1}
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& th, & td': {
              p: 1.5,
              textAlign: 'left',
              borderBottom: `1px solid ${theme.palette.divider}`,
            },
            '& th': {
              bgcolor: alpha(theme.palette.grey[500], 0.1),
              fontWeight: 600,
            },
          }}
        >
          <thead>
            <tr role="row">
              <th style={{ width: 48 }}>
                <Checkbox
                  checked={selectedRows.size === data.length && data.length > 0}
                  indeterminate={selectedRows.size > 0 && selectedRows.size < data.length}
                  onChange={selectAllRows}
                  inputProps={{ 'aria-label': 'Select all rows' }}
                  sx={focusIndicatorSx}
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  role="columnheader"
                  tabIndex={0}
                  onClick={() => handleSort(col.key)}
                  onKeyDown={(e) => handleHeaderKeyDown(e, col.key)}
                  aria-sort={sortColumn === col.key ? sortDirection === 'asc' ? 'ascending' : 'descending' : undefined}
                  style={{ cursor: 'pointer' }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.5} sx={focusIndicatorSx}>
                    <span>{col.label}</span>
                    {sortColumn === col.key && (
                      sortDirection === 'asc' ? <SortAscIcon fontSize="small" /> : <SortDescIcon fontSize="small" />
                    )}
                  </Stack>
                </th>
              ))}
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => {
              const isSelected = selectedRows.has(row.id);
              const isFocused = focusedRow === index;

              return (
                <Box
                  component="tr"
                  key={row.id}
                  ref={(el: HTMLTableRowElement | null) => {
                    if (el) rowRefs.current.set(index, el);
                  }}
                  role="row"
                  tabIndex={isFocused ? 0 : -1}
                  aria-selected={isSelected}
                  aria-rowindex={index + 2}
                  onKeyDown={(e) => handleRowKeyDown(e, index, row)}
                  onFocus={() => setFocusedRow(index)}
                  sx={{
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.1)
                      : 'transparent',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.action.hover, 0.1),
                    },
                    ...focusIndicatorSx,
                  }}
                >
                  <td>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRowSelection(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      inputProps={{ 'aria-label': `Select ${row.name}` }}
                      tabIndex={-1}
                    />
                  </td>
                  <td>{row.name}</td>
                  <td>{row.department}</td>
                  <td>
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        bgcolor: row.status === 'Active'
                          ? alpha(theme.palette.success.main, 0.1)
                          : alpha(theme.palette.grey[500], 0.1),
                        color: row.status === 'Active'
                          ? theme.palette.success.main
                          : theme.palette.text.secondary,
                      }}
                    >
                      {row.status}
                    </Box>
                  </td>
                  <td>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        aria-label={`Edit ${row.name}`}
                        tabIndex={-1}
                        onClick={() => setLastAction(`Edit ${row.name}`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        aria-label={`Delete ${row.name}`}
                        tabIndex={-1}
                        onClick={() => setLastAction(`Delete ${row.name}`)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </td>
                </Box>
              );
            })}
          </tbody>
        </Box>
      </Paper>

      {/* Status */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2">
          <strong>Focused row:</strong> {sortedData[focusedRow]?.name || 'None'}
          {' | '}
          <strong>Sort:</strong> {sortColumn} ({sortDirection})
          {lastAction && (
            <>
              {' | '}
              <strong>Last action:</strong> {lastAction}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

export default AccessibleTableDemo;

export const accessibleTableCode = `// Table Navigation with Keyboard
// Up/Down: Navigate rows | Space: Select | Enter: Action
// Ctrl+A: Select all | Tab to headers, Enter to sort

const handleRowKeyDown = (e, index, row) => {
  switch (e.key) {
    case 'ArrowUp':
      focusRow(Math.max(0, index - 1));
      break;
    case 'ArrowDown':
      focusRow(Math.min(data.length - 1, index + 1));
      break;
    case ' ':
      toggleRowSelection(row.id);
      break;
    case 'Enter':
      triggerRowAction(row);
      break;
    case 'a':
      if (e.ctrlKey) selectAllRows();
      break;
  }
  e.preventDefault();
};

<table role="grid" aria-label="Data table">
  <thead>
    <tr>
      <th
        tabIndex={0}
        onClick={() => handleSort(column)}
        onKeyDown={handleHeaderKeyDown}
        aria-sort={sortDirection}
      >
        {column.label}
      </th>
    </tr>
  </thead>
  <tbody>
    {data.map((row, index) => (
      <tr
        tabIndex={isFocused ? 0 : -1}
        aria-selected={isSelected}
        onKeyDown={(e) => handleRowKeyDown(e, index, row)}
      >
        {/* cells */}
      </tr>
    ))}
  </tbody>
</table>`;
