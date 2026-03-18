import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import { DragIndicator as DragIcon } from '@mui/icons-material';

interface SortableItem {
  id: number;
  name: string;
  priority: string;
}

/**
 * KeyboardSortableListDemo - Demonstrates keyboard drag-and-drop alternative
 *
 * Keyboard patterns:
 * - Up/Down: Navigate items
 * - Space: Grab/drop item
 * - Up/Down (while grabbed): Move item
 * - Enter: Drop item
 * - Esc: Cancel move
 */
export function KeyboardSortableListDemo() {
  const theme = useTheme();
  const [items, setItems] = useState<SortableItem[]>([
    { id: 1, name: 'Review budget proposal', priority: 'High' },
    { id: 2, name: 'Update documentation', priority: 'Medium' },
    { id: 3, name: 'Schedule team meeting', priority: 'Low' },
    { id: 4, name: 'Fix login bug', priority: 'High' },
    { id: 5, name: 'Design new feature', priority: 'Medium' },
  ]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [grabbedIndex, setGrabbedIndex] = useState<number | null>(null);
  const [originalItems, setOriginalItems] = useState<SortableItem[]>([]);
  const [lastAction, setLastAction] = useState<string>('');
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const focusItem = useCallback((index: number) => {
    const item = itemRefs.current.get(index);
    if (item) {
      item.focus();
      setFocusedIndex(index);
    }
  }, []);

  const grabItem = useCallback((index: number) => {
    setGrabbedIndex(index);
    setOriginalItems([...items]);
    setLastAction(`Grabbed "${items[index].name}" - use arrows to move, Space/Enter to drop, Esc to cancel`);
  }, [items]);

  const dropItem = useCallback(() => {
    if (grabbedIndex !== null) {
      setLastAction(`Dropped "${items[focusedIndex].name}" at position ${focusedIndex + 1}`);
      setGrabbedIndex(null);
      setOriginalItems([]);
    }
  }, [grabbedIndex, items, focusedIndex]);

  const cancelMove = useCallback(() => {
    if (grabbedIndex !== null) {
      setItems(originalItems);
      setLastAction('Move cancelled');
      setGrabbedIndex(null);
      setOriginalItems([]);
    }
  }, [grabbedIndex, originalItems]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;

    setItems(prev => {
      const newItems = [...prev];
      const [removed] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, removed);
      return newItems;
    });
    focusItem(toIndex);
    setLastAction(`Moved to position ${toIndex + 1}`);
  }, [items.length, focusItem]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    if (grabbedIndex !== null) {
      // Item is grabbed - handle move/drop/cancel
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveItem(index, index - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveItem(index, index + 1);
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          dropItem();
          break;
        case 'Escape':
          e.preventDefault();
          cancelMove();
          break;
      }
    } else {
      // Normal navigation
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          focusItem(Math.max(0, index - 1));
          setLastAction('Moved up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusItem(Math.min(items.length - 1, index + 1));
          setLastAction('Moved down');
          break;
        case ' ':
          e.preventDefault();
          grabItem(index);
          break;
        case 'Home':
          e.preventDefault();
          focusItem(0);
          break;
        case 'End':
          e.preventDefault();
          focusItem(items.length - 1);
          break;
      }
    }
  }, [grabbedIndex, items.length, focusItem, grabItem, moveItem, dropItem, cancelMove]);

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: -2,
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return theme.palette.error.main;
      case 'Medium': return theme.palette.warning.main;
      case 'Low': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Up/Down</strong> to navigate. Press <strong>Space</strong> to grab an item,
        then <strong>Up/Down</strong> to move it. <strong>Space/Enter</strong> to drop,{' '}
        <strong>Esc</strong> to cancel.
      </Typography>

      {/* Instructions when grabbed */}
      {grabbedIndex !== null && (
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            mb: 2,
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            border: `1px solid ${alpha(theme.palette.warning.main, 0.5)}`,
            borderRadius: 1,
          }}
          role="alert"
        >
          <Typography variant="body2" fontWeight={500}>
            Item grabbed! Use arrows to reposition, Space/Enter to drop, Esc to cancel.
          </Typography>
        </Paper>
      )}

      {/* Sortable List */}
      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
        role="listbox"
        aria-label="Reorderable task list"
      >
        {items.map((item, index) => {
          const isFocused = focusedIndex === index;
          const isGrabbed = grabbedIndex !== null && focusedIndex === index;

          return (
            <Box
              key={item.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) itemRefs.current.set(index, el);
              }}
              role="option"
              tabIndex={isFocused ? 0 : -1}
              aria-grabbed={isGrabbed}
              aria-selected={isFocused}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                gap: 1.5,
                cursor: grabbedIndex !== null ? 'grabbing' : 'grab',
                bgcolor: isGrabbed
                  ? alpha(theme.palette.primary.main, 0.15)
                  : 'transparent',
                borderBottom: index < items.length - 1
                  ? `1px solid ${theme.palette.divider}`
                  : 'none',
                transform: isGrabbed ? 'scale(1.02)' : 'scale(1)',
                boxShadow: isGrabbed ? theme.shadows[4] : 'none',
                transition: 'transform 0.1s, box-shadow 0.1s, background-color 0.1s',
                position: 'relative',
                zIndex: isGrabbed ? 10 : 'auto',
                '&:hover': {
                  bgcolor: isGrabbed
                    ? alpha(theme.palette.primary.main, 0.15)
                    : alpha(theme.palette.action.hover, 0.05),
                },
                ...focusIndicatorSx,
              }}
            >
              <DragIcon
                sx={{
                  color: isGrabbed ? 'primary.main' : 'text.secondary',
                  opacity: 0.5,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight={500}>
                  {item.name}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  bgcolor: alpha(getPriorityColor(item.priority), 0.1),
                  color: getPriorityColor(item.priority),
                  fontWeight: 500,
                }}
              >
                {item.priority}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ minWidth: 24 }}>
                #{index + 1}
              </Typography>
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
          <strong>Mode:</strong> {grabbedIndex !== null ? 'Moving item' : 'Navigation'}
          {' | '}
          <strong>Focused:</strong> {items[focusedIndex]?.name}
          {lastAction && (
            <>
              {' | '}
              <strong>Action:</strong> {lastAction}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

export default KeyboardSortableListDemo;

export const keyboardSortableListCode = `// Keyboard Sortable List (Drag-and-Drop Alternative)
// Space: Grab item | Up/Down: Move | Space/Enter: Drop | Esc: Cancel

const handleKeyDown = (e, index) => {
  if (grabbedIndex !== null) {
    // Item is grabbed - handle move/drop/cancel
    switch (e.key) {
      case 'ArrowUp':
        moveItem(index, index - 1);
        break;
      case 'ArrowDown':
        moveItem(index, index + 1);
        break;
      case ' ':
      case 'Enter':
        dropItem();
        break;
      case 'Escape':
        cancelMove(); // Restore original order
        break;
    }
  } else {
    // Normal navigation
    switch (e.key) {
      case 'ArrowUp':
        focusItem(index - 1);
        break;
      case 'ArrowDown':
        focusItem(index + 1);
        break;
      case ' ':
        grabItem(index);
        break;
    }
  }
  e.preventDefault();
};

<Box role="listbox" aria-label="Reorderable list">
  {items.map((item, index) => (
    <Box
      role="option"
      tabIndex={isFocused ? 0 : -1}
      aria-grabbed={isGrabbed}
      onKeyDown={(e) => handleKeyDown(e, index)}
    >
      <DragIcon />
      {item.name}
    </Box>
  ))}
</Box>`;
