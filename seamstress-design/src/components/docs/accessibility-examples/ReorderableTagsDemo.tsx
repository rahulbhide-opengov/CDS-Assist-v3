import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';

interface Tag {
  id: number;
  label: string;
  color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

/**
 * ReorderableTagsDemo - Demonstrates reordering items within a container
 *
 * Keyboard patterns:
 * - Left/Right: Navigate between tags
 * - Ctrl+Left/Right: Reorder tag
 * - Delete/Backspace: Remove tag
 * - Home/End: Jump to first/last
 */
export function ReorderableTagsDemo() {
  const theme = useTheme();
  const [tags, setTags] = useState<Tag[]>([
    { id: 1, label: 'React', color: 'primary' },
    { id: 2, label: 'TypeScript', color: 'info' },
    { id: 3, label: 'MUI', color: 'secondary' },
    { id: 4, label: 'Accessibility', color: 'success' },
    { id: 5, label: 'Keyboard', color: 'warning' },
  ]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [lastAction, setLastAction] = useState<string>('');
  const tagRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const focusTag = useCallback((index: number) => {
    // Clamp index to valid range
    const clampedIndex = Math.max(0, Math.min(tags.length - 1, index));
    const tag = tagRefs.current.get(clampedIndex);
    if (tag) {
      tag.focus();
      setFocusedIndex(clampedIndex);
    }
  }, [tags.length]);

  const reorderTag = useCallback((fromIndex: number, direction: 'left' | 'right') => {
    const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= tags.length) return;

    setTags(prev => {
      const newTags = [...prev];
      const [removed] = newTags.splice(fromIndex, 1);
      newTags.splice(toIndex, 0, removed);
      return newTags;
    });

    // Update focus to follow the moved item
    setTimeout(() => focusTag(toIndex), 0);
    setLastAction(`Moved "${tags[fromIndex].label}" ${direction}`);
  }, [tags, focusTag]);

  const removeTag = useCallback((index: number) => {
    const removedTag = tags[index];
    setTags(prev => prev.filter((_, i) => i !== index));
    setLastAction(`Removed "${removedTag.label}"`);

    // Focus next tag or previous if at end
    setTimeout(() => {
      if (index >= tags.length - 1) {
        focusTag(Math.max(0, index - 1));
      } else {
        focusTag(index);
      }
    }, 0);
  }, [tags, focusTag]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          reorderTag(index, 'left');
        } else {
          focusTag(index - 1);
          setLastAction('Moved focus left');
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          reorderTag(index, 'right');
        } else {
          focusTag(index + 1);
          setLastAction('Moved focus right');
        }
        break;

      case 'Home':
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Move to start
          if (index > 0) {
            setTags(prev => {
              const newTags = [...prev];
              const [removed] = newTags.splice(index, 1);
              newTags.unshift(removed);
              return newTags;
            });
            setTimeout(() => focusTag(0), 0);
            setLastAction(`Moved "${tags[index].label}" to start`);
          }
        } else {
          focusTag(0);
          setLastAction('Jumped to first');
        }
        break;

      case 'End':
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          // Move to end
          if (index < tags.length - 1) {
            setTags(prev => {
              const newTags = [...prev];
              const [removed] = newTags.splice(index, 1);
              newTags.push(removed);
              return newTags;
            });
            setTimeout(() => focusTag(tags.length - 1), 0);
            setLastAction(`Moved "${tags[index].label}" to end`);
          }
        } else {
          focusTag(tags.length - 1);
          setLastAction('Jumped to last');
        }
        break;

      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        if (tags.length > 1) {
          removeTag(index);
        } else {
          setLastAction('Cannot remove last tag');
        }
        break;
    }
  }, [tags, focusTag, reorderTag, removeTag]);

  const resetTags = () => {
    setTags([
      { id: 1, label: 'React', color: 'primary' },
      { id: 2, label: 'TypeScript', color: 'info' },
      { id: 3, label: 'MUI', color: 'secondary' },
      { id: 4, label: 'Accessibility', color: 'success' },
      { id: 5, label: 'Keyboard', color: 'warning' },
    ]);
    setFocusedIndex(0);
    setLastAction('Tags reset');
  };

  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: 2,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Left/Right</strong> to navigate between tags. <strong>Ctrl+Left/Right</strong>{' '}
        to reorder. <strong>Ctrl+Home/End</strong> to move to start/end. <strong>Delete</strong> to remove.
      </Typography>

      {/* Tag container */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          Skills (reorderable)
        </Typography>
        <Stack
          direction="row"
          spacing={1}
          flexWrap="wrap"
          useFlexGap
          role="listbox"
          aria-label="Reorderable skill tags"
          aria-orientation="horizontal"
        >
          {tags.map((tag, index) => {
            const isFocused = focusedIndex === index;

            return (
              <Chip
                key={tag.id}
                ref={(el: HTMLDivElement | null) => {
                  if (el) tagRefs.current.set(index, el);
                }}
                label={tag.label}
                color={tag.color}
                role="option"
                tabIndex={isFocused ? 0 : -1}
                aria-selected={isFocused}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onClick={() => focusTag(index)}
                sx={{
                  cursor: 'pointer',
                  '& .MuiChip-label': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  },
                  ...focusIndicatorSx,
                }}
              />
            );
          })}
        </Stack>
      </Paper>

      {/* Reset button */}
      <Box sx={{ mb: 2 }}>
        <Chip
          label="Reset Tags"
          variant="outlined"
          onClick={resetTags}
          sx={{ cursor: 'pointer', ...focusIndicatorSx }}
        />
      </Box>

      {/* Order display */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.grey[500], 0.05),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Current Order
        </Typography>
        <Typography variant="body2" fontFamily="monospace">
          {tags.map((tag, i) => `${i + 1}. ${tag.label}`).join('  |  ')}
        </Typography>
      </Paper>

      {/* Status */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.info.main, 0.1),
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          borderRadius: 1,
        }}
        role="status"
        aria-live="polite"
      >
        <Typography variant="body2">
          <strong>Focused:</strong> {tags[focusedIndex]?.label || 'None'}
          {' | '}
          <strong>Position:</strong> {focusedIndex + 1} of {tags.length}
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

export default ReorderableTagsDemo;

export const reorderableTagsCode = `// Reorderable Tags with Ctrl+Arrow
// Left/Right: Navigate | Ctrl+Left/Right: Reorder
// Ctrl+Home/End: Move to start/end | Delete: Remove

const handleKeyDown = (e, index) => {
  switch (e.key) {
    case 'ArrowLeft':
      if (e.ctrlKey) {
        reorderTag(index, 'left');
      } else {
        focusTag(index - 1);
      }
      break;
    case 'ArrowRight':
      if (e.ctrlKey) {
        reorderTag(index, 'right');
      } else {
        focusTag(index + 1);
      }
      break;
    case 'Home':
      if (e.ctrlKey) moveToStart(index);
      else focusTag(0);
      break;
    case 'End':
      if (e.ctrlKey) moveToEnd(index);
      else focusTag(tags.length - 1);
      break;
    case 'Delete':
      removeTag(index);
      break;
  }
  e.preventDefault();
};

const reorderTag = (fromIndex, direction) => {
  const toIndex = direction === 'left' ? fromIndex - 1 : fromIndex + 1;
  setTags(prev => {
    const newTags = [...prev];
    const [removed] = newTags.splice(fromIndex, 1);
    newTags.splice(toIndex, 0, removed);
    return newTags;
  });
  focusTag(toIndex);
};

<Stack role="listbox" aria-orientation="horizontal">
  {tags.map((tag, index) => (
    <Chip
      role="option"
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={(e) => handleKeyDown(e, index)}
      label={tag.label}
    />
  ))}
</Stack>`;
