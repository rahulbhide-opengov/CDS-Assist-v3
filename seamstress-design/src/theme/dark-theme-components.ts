/**
 * Dark Theme MUI Component Overrides
 *
 * These overrides apply proper dark theme styling to MUI components using theme tokens.
 * This is the BEST PRACTICE approach - using theme palette values instead of hardcoded colors.
 *
 * Why component-level overrides instead of CSS?
 * - Automatically adapts to theme mode
 * - Uses theme tokens (maintainable)
 * - Type-safe
 * - Respects component variants
 * - Better performance
 */

import type { ThemeOptions } from '@mui/material/styles';

export const darkThemeComponents: ThemeOptions['components'] = {
  // ================================================================
  // Paper (Cards, Dialogs, Menus)
  // ================================================================
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundImage: 'none', // Remove default gradient
              backgroundColor: theme.palette.background.paper,
            }
          : {},
    },
  },

  // ================================================================
  // Backdrop (Dialogs, Drawers)
  // ================================================================
  MuiBackdrop: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark backdrop instead of white
            }
          : {},
    },
  },

  // ================================================================
  // Inputs (TextField, Select, etc.)
  // ================================================================
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              '& input': {
                color: theme.palette.text.primary,
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
              },
              '&.Mui-focused': {
                backgroundColor: theme.palette.background.paper,
              },
            }
          : {},
      input: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&::placeholder': {
                color: theme.palette.text.secondary,
                opacity: 0.7,
              },
            }
          : {},
    },
  },

  // OutlinedInput (specific for search fields)
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.text.secondary,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.primary.main,
              },
              '&.Mui-focused': {
                outline: '2px solid',
                outlineColor: theme.palette.primary.main,
                outlineOffset: 2,
              },
            }
          : {},
    },
  },

  // ================================================================
  // Buttons
  // ================================================================
  MuiButton: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              // Focus visible outline for accessibility
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: theme.palette.primary.main,
                outlineOffset: 2,
              },
              // Text buttons
              '&.MuiButton-text': {
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              },
              // Outlined buttons
              '&.MuiButton-outlined': {
                borderColor: theme.palette.divider,
                color: theme.palette.text.primary,
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  borderColor: theme.palette.text.secondary,
                },
              },
            }
          : {},
    },
  },

  // ================================================================
  // Icon Buttons
  // ================================================================
  MuiIconButton: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: theme.palette.primary.main,
                outlineOffset: 2,
              },
            }
          : {},
    },
  },

  // ================================================================
  // Tabs
  // ================================================================
  MuiTabs: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              },
            }
          : {},
    },
  },

  MuiTab: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              color: theme.palette.text.secondary,
              '&.Mui-selected': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.text.primary,
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: theme.palette.primary.main,
                outlineOffset: 2,
              },
            }
          : {},
    },
  },

  // ================================================================
  // Checkbox
  // ================================================================
  MuiCheckbox: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: theme.palette.primary.main,
                outlineOffset: 2,
              },
            }
          : {},
    },
  },

  // ================================================================
  // Radio
  // ================================================================
  MuiRadio: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: theme.palette.primary.main,
                outlineOffset: 2,
              },
            }
          : {},
    },
  },

  // ================================================================
  // Toggle Buttons (Time window selectors, etc.)
  // ================================================================
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            }
          : {},
    },
  },

  // ================================================================
  // Chips
  // ================================================================
  MuiChip: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.action.selected,
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }
          : {},
      outlined: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'transparent',
              borderColor: theme.palette.divider,
              color: theme.palette.text.primary,
            }
          : {},
      filled: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&.MuiChip-colorDefault': {
                backgroundColor: 'rgba(255, 255, 255, 0.09) !important', // Darker than palette default
                color: theme.palette.text.primary,
              },
              '&.MuiChip-colorWarning': {
                backgroundColor: 'rgba(255, 167, 38, 0.3)',
                color: theme.palette.warning.light,
              },
              '&.MuiChip-colorInfo': {
                backgroundColor: 'rgba(41, 182, 246, 0.3)',
                color: theme.palette.info.light,
              },
              '&.MuiChip-colorSuccess': {
                backgroundColor: 'rgba(102, 187, 106, 0.3)',
                color: theme.palette.success.light,
              },
            }
          : {},
    },
  },

  // ================================================================
  // Cards
  // ================================================================
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  // ================================================================
  // Dialogs
  // ================================================================
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  // ================================================================
  // Menus / Popovers
  // ================================================================
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  MuiPopover: {
    styleOverrides: {
      paper: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  // ================================================================
  // Lists
  // ================================================================
  MuiList: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
            }
          : {},
    },
  },

  MuiListItem: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.action.selected,
                '&:hover': {
                  backgroundColor: theme.palette.action.selected,
                },
              },
            }
          : {},
    },
  },

  // ================================================================
  // Tooltips
  // ================================================================
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            }
          : {},
    },
  },

  // ================================================================
  // Accordion
  // ================================================================
  MuiAccordion: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }
          : {},
    },
  },

  MuiAccordionDetails: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
            }
          : {},
    },
  },

  // ================================================================
  // Alert
  // ================================================================
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundImage: 'none',
            }
          : {},
      standardError: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'rgba(211, 47, 47, 0.15)',
              color: theme.palette.error.light,
            }
          : {},
      standardWarning: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'rgba(255, 167, 38, 0.15)',
              color: theme.palette.warning.light,
            }
          : {},
      standardInfo: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'rgba(41, 182, 246, 0.15)',
              color: theme.palette.info.light,
            }
          : {},
      standardSuccess: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: 'rgba(102, 187, 106, 0.15)',
              color: theme.palette.success.light,
            }
          : {},
    },
  },

  // ================================================================
  // Drawer
  // ================================================================
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  // ================================================================
  // App Bar
  // ================================================================
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              backgroundImage: 'none',
            }
          : {},
    },
  },

  // ================================================================
  // DataGrid (for agents, skills, tools pages)
  // ================================================================
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
              // Remove bottom border from last row to prevent double border
              '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
                borderBottom: 'none',
              },
            }
          : {},
      columnHeaders: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.secondary,
              color: theme.palette.text.primary,
              borderTopLeftRadius: '3px',
              borderTopRightRadius: '3px',
            }
          : {},
      columnHeader: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.secondary,
              color: theme.palette.text.primary,
              '&:focus': {
                outline: `1px solid ${theme.palette.primary.main}`,
              },
            }
          : {},
      row: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                },
              },
            }
          : {},
      cell: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              borderBottom: `1px solid ${theme.palette.divider}`,
              borderTop: 'none',
              color: theme.palette.text.primary,
            }
          : {},
      footerContainer: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.paper,
              borderTop: `1px solid ${theme.palette.divider}`,
            }
          : {},
    },
  },

  // ================================================================
  // Tables
  // ================================================================
  MuiTable: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              borderColor: theme.palette.divider,
            }
          : {},
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              borderColor: theme.palette.divider,
            }
          : {},
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              borderColor: theme.palette.divider,
              borderBottomColor: theme.palette.divider,
              // Remove bottom border from cells in last row to prevent double border
              'tbody tr:last-child &': {
                borderBottom: 'none',
              },
            }
          : {},
      head: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.secondary,
              fontWeight: 600,
            }
          : {},
    },
  },

  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: theme.shape.borderRadius,
            }
          : {},
    },
  },

  // ================================================================
  // Divider
  // ================================================================
  MuiDivider: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              borderColor: theme.palette.divider,
            }
          : {},
    },
  },

  // ================================================================
  // Scoped CSS Baseline (Global container)
  // ================================================================
  MuiScopedCssBaseline: {
    styleOverrides: {
      root: ({ theme }: any) =>
        theme.palette.mode === 'dark'
          ? {
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }
          : {},
    },
  },
};
