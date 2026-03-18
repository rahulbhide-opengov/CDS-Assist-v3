import React, { useState, useCallback, useRef } from 'react';
import { Box, Typography, Paper, alpha, useTheme } from '@mui/material';

/**
 * GridNavigationDemo - Demonstrates grid/cell navigation with arrow keys
 *
 * Keyboard patterns:
 * - Arrow keys: Move between cells
 * - Home: First cell in row
 * - End: Last cell in row
 * - Ctrl+Home: First cell in grid
 * - Ctrl+End: Last cell in grid
 * - Enter: Select/activate cell
 */
export function GridNavigationDemo() {
  const theme = useTheme();
  const ROWS = 4;
  const COLS = 5;
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [lastKey, setLastKey] = useState<string>('');
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Generate cell data
  const getCellContent = (row: number, col: number) => {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return `${letters[col]}${row + 1}`;
  };

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const focusCell = useCallback((row: number, col: number) => {
    const key = getCellKey(row, col);
    const cell = cellRefs.current.get(key);
    if (cell) {
      cell.focus();
      setFocusedCell({ row, col });
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    let newRow = row;
    let newCol = col;
    let handled = true;

    switch (e.key) {
      case 'ArrowUp':
        newRow = Math.max(0, row - 1);
        setLastKey('Arrow Up');
        break;
      case 'ArrowDown':
        newRow = Math.min(ROWS - 1, row + 1);
        setLastKey('Arrow Down');
        break;
      case 'ArrowLeft':
        newCol = Math.max(0, col - 1);
        setLastKey('Arrow Left');
        break;
      case 'ArrowRight':
        newCol = Math.min(COLS - 1, col + 1);
        setLastKey('Arrow Right');
        break;
      case 'Home':
        if (e.ctrlKey || e.metaKey) {
          newRow = 0;
          newCol = 0;
          setLastKey('Ctrl+Home');
        } else {
          newCol = 0;
          setLastKey('Home');
        }
        break;
      case 'End':
        if (e.ctrlKey || e.metaKey) {
          newRow = ROWS - 1;
          newCol = COLS - 1;
          setLastKey('Ctrl+End');
        } else {
          newCol = COLS - 1;
          setLastKey('End');
        }
        break;
      case 'Enter':
      case ' ':
        setSelectedCell({ row, col });
        setLastKey(e.key === ' ' ? 'Space' : 'Enter');
        e.preventDefault();
        return;
      default:
        handled = false;
    }

    if (handled) {
      e.preventDefault();
      focusCell(newRow, newCol);
    }
  }, [focusCell]);


  const focusIndicatorSx = {
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: -2,
      zIndex: 1,
    },
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use <strong>Arrow keys</strong> to navigate cells. <strong>Home/End</strong> for row edges,{' '}
        <strong>Ctrl+Home/End</strong> for grid corners. Press <strong>Enter</strong> to select.
      </Typography>

      {/* Grid */}
      <Box
        ref={gridRef}
        role="grid"
        aria-label="Sample data grid"
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: '1px',
          bgcolor: theme.palette.divider,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
        }}
      >
        {/* Header row */}
        <Box role="row" sx={{ display: 'contents' }}>
          {Array.from({ length: COLS }).map((_, col) => (
            <Box
              key={`header-${col}`}
              role="columnheader"
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                fontWeight: 600,
                textAlign: 'center',
                fontSize: '0.875rem',
              }}
            >
              Col {String.fromCharCode(65 + col)}
            </Box>
          ))}
        </Box>

        {/* Data rows */}
        {Array.from({ length: ROWS }).map((_, row) => (
          <Box key={`row-${row}`} role="row" sx={{ display: 'contents' }}>
            {Array.from({ length: COLS }).map((_, col) => {
              const isFocused = focusedCell.row === row && focusedCell.col === col;
              const isSelected = selectedCell?.row === row && selectedCell?.col === col;
              const cellKey = getCellKey(row, col);

              return (
                <Box
                  key={cellKey}
                  ref={(el: HTMLDivElement | null) => {
                    if (el) cellRefs.current.set(cellKey, el);
                  }}
                  role="gridcell"
                  tabIndex={isFocused ? 0 : -1}
                  onKeyDown={(e) => handleKeyDown(e, row, col)}
                  onFocus={() => setFocusedCell({ row, col })}
                  aria-selected={isSelected}
                  sx={{
                    p: 1.5,
                    bgcolor: isSelected
                      ? alpha(theme.palette.primary.main, 0.2)
                      : 'background.paper',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s',
                    fontSize: '0.875rem',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.action.hover, 0.1),
                    },
                    ...focusIndicatorSx,
                  }}
                >
                  {getCellContent(row, col)}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

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
          <strong>Focused:</strong> {getCellContent(focusedCell.row, focusedCell.col)}
          {' | '}
          <strong>Selected:</strong> {selectedCell ? getCellContent(selectedCell.row, selectedCell.col) : 'None'}
          {lastKey && (
            <>
              {' | '}
              <strong>Last key:</strong> {lastKey}
            </>
          )}
        </Typography>
      </Paper>
    </Box>
  );
}

export default GridNavigationDemo;

export const gridNavigationCode = `// Grid Navigation with Arrow Keys
// Arrow keys: Move between cells
// Home/End: Row edges | Ctrl+Home/End: Grid corners
// Enter: Select cell

const handleKeyDown = (e, row, col) => {
  switch (e.key) {
    case 'ArrowUp':
      focusCell(Math.max(0, row - 1), col);
      break;
    case 'ArrowDown':
      focusCell(Math.min(ROWS - 1, row + 1), col);
      break;
    case 'ArrowLeft':
      focusCell(row, Math.max(0, col - 1));
      break;
    case 'ArrowRight':
      focusCell(row, Math.min(COLS - 1, col + 1));
      break;
    case 'Home':
      if (e.ctrlKey) focusCell(0, 0);
      else focusCell(row, 0);
      break;
    case 'End':
      if (e.ctrlKey) focusCell(ROWS - 1, COLS - 1);
      else focusCell(row, COLS - 1);
      break;
    case 'Enter':
      setSelectedCell({ row, col });
      break;
  }
  e.preventDefault();
};

<Box role="grid" aria-label="Data grid">
  {cells.map((cell) => (
    <Box
      role="gridcell"
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={(e) => handleKeyDown(e, row, col)}
      aria-selected={isSelected}
    >
      {cell.content}
    </Box>
  ))}
</Box>`;
