import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { KeyboardShortcut } from './KeyboardKey';
import type { ShortcutCategory } from '../../data/keyboardAccessibilityData';

export interface KeyboardShortcutTableProps {
  /** Category data containing shortcuts to display */
  category: ShortcutCategory;
  /** Whether to show the notes column */
  showNotes?: boolean;
  /** Whether to show the context column */
  showContext?: boolean;
  /** Compact mode for smaller tables */
  compact?: boolean;
}

/**
 * KeyboardShortcutTable - Reusable table component for displaying keyboard shortcuts
 *
 * @example
 * <KeyboardShortcutTable category={pageNavigationShortcuts} />
 */
export function KeyboardShortcutTable({
  category,
  showNotes = true,
  showContext = true,
  compact = false,
}: KeyboardShortcutTableProps) {
  const theme = useTheme();

  // Check if any shortcuts have notes
  const hasNotes = showNotes && category.shortcuts.some(s => s.notes);
  // Check if any shortcuts have context
  const hasContext = showContext && category.shortcuts.some(s => s.context);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        component="h3"
        gutterBottom
        sx={{ fontWeight: 600 }}
      >
        {category.title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        {category.description}
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflowX: 'auto',
          maxWidth: '100%',
          // Shadow hints for horizontal scroll
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.common.black, 0.05),
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.common.black, 0.2),
            borderRadius: 4,
          },
        }}
      >
        <Table
          size={compact ? 'small' : 'medium'}
          sx={{
            minWidth: { xs: 600, sm: 'auto' },
            '& th, & td': {
              whiteSpace: { xs: 'nowrap', md: 'normal' },
              padding: { xs: 1, sm: 2 },
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === 'dark'
                  ? alpha(theme.palette.common.white, 0.02)
                  : alpha(theme.palette.common.black, 0.02),
              }}
            >
              <TableCell sx={{ fontWeight: 600, width: '180px' }}>Keys</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Behavior</TableCell>
              {hasContext && (
                <TableCell sx={{ fontWeight: 600, width: '160px' }}>Context</TableCell>
              )}
              {hasNotes && (
                <TableCell sx={{ fontWeight: 600, width: '200px' }}>Notes</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {category.shortcuts.map((shortcut, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(odd)': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.common.white, 0.01)
                      : alpha(theme.palette.common.black, 0.01),
                  },
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.08)
                      : alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                <TableCell>
                  <KeyboardShortcut
                    keys={shortcut.keys}
                    size={compact ? 'small' : 'medium'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {shortcut.action}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {shortcut.behavior}
                  </Typography>
                </TableCell>
                {hasContext && (
                  <TableCell>
                    {shortcut.context && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {shortcut.context.split(', ').map((ctx, i) => (
                          <Chip
                            key={i}
                            label={ctx}
                            size="small"
                            variant="outlined"
                            sx={{
                              height: 28,
                              fontSize: '0.75rem',
                              borderColor: theme.palette.divider,
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </TableCell>
                )}
                {hasNotes && (
                  <TableCell>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic' }}
                    >
                      {shortcut.notes}
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

/**
 * Compact inline shortcut display for use in running text
 */
export interface InlineShortcutProps {
  keys: string[];
  description?: string;
}

export function InlineShortcut({ keys, description }: InlineShortcutProps) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <KeyboardShortcut keys={keys} size="small" />
      {description && (
        <Typography
          component="span"
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}

export default KeyboardShortcutTable;
