import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  Stack,
  Button,
  alpha,
  useTheme,
} from '@mui/material';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import DeselectIcon from '@mui/icons-material/Deselect';

interface ListItem {
  id: number;
  name: string;
  category: string;
}

/**
 * SelectableListDemo - Demonstrates multi-select patterns
 *
 * Keyboard patterns:
 * - Up/Down: Navigate list
 * - Space: Toggle selection
 * - Shift+Arrow: Extend selection
 * - Ctrl+A: Select all
 * - Ctrl+Shift+A: Deselect all
 */
export function SelectableListDemo() {
  const theme = useTheme();
  const [items] = useState<ListItem[]>([
    { id: 1, name: 'Document A', category: 'Reports' },
    { id: 2, name: 'Document B', category: 'Invoices' },
    { id: 3, name: 'Document C', category: 'Reports' },
    { id: 4, name: 'Document D', category: 'Contracts' },
    { id: 5, name: 'Document E', category: 'Reports' },
    { id: 6, name: 'Document F', category: 'Invoices' },
  ]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string>('');
  const [anchorIndex, setAnchorIndex] = useState<number | null>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const focusItem = useCallback((index: number) => {
    const item = itemRefs.current.get(index);
    if (item) {
      item.focus();
      setFocusedIndex(index);
    }
  }, []);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        setLastAction('Item deselected');
      } else {
        newSet.add(id);
        setLastAction('Item selected');
      }
      return newSet;
    });
    setAnchorIndex(focusedIndex);
  }, [focusedIndex]);

  const selectRange = useCallback((fromIndex: number, toIndex: number) => {
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    const idsInRange = items.slice(start, end + 1).map(item => item.id);
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      idsInRange.forEach(id => newSet.add(id));
      return newSet;
    });
    setLastAction(`Selected range (${end - start + 1} items)`);
  }, [items]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(item => item.id)));
    setLastAction('All items selected');
  }, [items]);

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set());
    setLastAction('All items deselected');
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number, item: ListItem) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (e.shiftKey) {
          // Extend selection up
          const newIndex = Math.max(0, index - 1);
          if (anchorIndex !== null) {
            selectRange(anchorIndex, newIndex);
          }
          focusItem(newIndex);
        } else {
          focusItem(Math.max(0, index - 1));
          setLastAction('Moved up');
        }
        break;

      case 'ArrowDown':
        e.preventDefault();
        if (e.shiftKey) {
          // Extend selection down
          const newIndex = Math.min(items.length - 1, index + 1);
          if (anchorIndex !== null) {
            selectRange(anchorIndex, newIndex);
          }
          focusItem(newIndex);
        } else {
          focusItem(Math.min(items.length - 1, index + 1));
          setLastAction('Moved down');
        }
        break;

      case ' ':
        e.preventDefault();
        toggleSelection(item.id);
        break;

      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          if (e.shiftKey) {
            deselectAll();
          } else {
            selectAll();
          }
        }
        break;

      case 'Home':
        e.preventDefault();
        focusItem(0);
        setLastAction('Jumped to first');
        break;

      case 'End':
        e.preventDefault();
        focusItem(items.length - 1);
        setLastAction('Jumped to last');
        break;
    }
  }, [items.length, anchorIndex, selectRange, focusItem, toggleSelection, selectAll, deselectAll]);

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: -2,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Up/Down</strong> to navigate, <strong>Space</strong> to toggle selection,{' '}
        <strong>Shift+Arrow</strong> for range selection, <strong>Ctrl+A</strong> to select all,{' '}
        <strong>Ctrl+Shift+A</strong> to deselect all.
      </Typography>

      {/* Selection controls */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2">
          <strong>{selectedIds.size}</strong> of {items.length} selected
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<SelectAllIcon />}
            onClick={selectAll}
            disabled={selectedIds.size === items.length}
          >
            Select All
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DeselectIcon />}
            onClick={deselectAll}
            disabled={selectedIds.size === 0}
          >
            Clear Selection
          </Button>
        </Stack>
      </Box>

      {/* List */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
        role="listbox"
        aria-label="Selectable document list"
        aria-multiselectable="true"
      >
        {items.map((item, index) => {
          const isSelected = selectedIds.has(item.id);
          const isFocused = focusedIndex === index;

          return (
            <Box
              key={item.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) itemRefs.current.set(index, el);
              }}
              role="option"
              tabIndex={isFocused ? 0 : -1}
              aria-selected={isSelected}
              onKeyDown={(e) => handleKeyDown(e, index, item)}
              onFocus={() => setFocusedIndex(index)}
              onClick={() => toggleSelection(item.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                gap: 1.5,
                cursor: 'pointer',
                bgcolor: isSelected
                  ? alpha(theme.palette.primary.main, 0.1)
                  : 'transparent',
                borderBottom: index < items.length - 1
                  ? `1px solid ${theme.palette.divider}`
                  : 'none',
                '&:hover': {
                  bgcolor: isSelected
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.action.hover, 0.1),
                },
                ...focusIndicatorSx,
              }}
            >
              <Checkbox
                checked={isSelected}
                tabIndex={-1}
                inputProps={{ 'aria-hidden': true }}
                sx={{ p: 0 }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.category}
                </Typography>
              </Box>
            </Box>
          );
        })}
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
          <strong>Focused:</strong> {items[focusedIndex]?.name}
          {' | '}
          <strong>Selected:</strong> {selectedIds.size > 0
            ? Array.from(selectedIds).map(id => items.find(i => i.id === id)?.name).join(', ')
            : 'None'}
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

export default SelectableListDemo;

export const selectableListCode = `// Multi-Select List with Keyboard
// Up/Down: Navigate | Space: Toggle | Shift+Arrow: Range
// Ctrl+A: Select all | Ctrl+Shift+A: Deselect all

const handleKeyDown = (e, index, item) => {
  switch (e.key) {
    case 'ArrowUp':
      if (e.shiftKey && anchorIndex !== null) {
        selectRange(anchorIndex, index - 1);
      }
      focusItem(Math.max(0, index - 1));
      break;
    case 'ArrowDown':
      if (e.shiftKey && anchorIndex !== null) {
        selectRange(anchorIndex, index + 1);
      }
      focusItem(Math.min(items.length - 1, index + 1));
      break;
    case ' ':
      toggleSelection(item.id);
      setAnchorIndex(index); // Set anchor for range select
      break;
    case 'a':
      if (e.ctrlKey) {
        if (e.shiftKey) deselectAll();
        else selectAll();
      }
      break;
  }
  e.preventDefault();
};

<Box
  role="listbox"
  aria-multiselectable="true"
>
  {items.map((item, index) => (
    <Box
      role="option"
      tabIndex={isFocused ? 0 : -1}
      aria-selected={isSelected}
      onKeyDown={(e) => handleKeyDown(e, index, item)}
    >
      <Checkbox checked={isSelected} tabIndex={-1} />
      {item.name}
    </Box>
  ))}
</Box>`;
