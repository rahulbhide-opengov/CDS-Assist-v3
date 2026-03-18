/**
 * OpenGov Component Dark Mode Overrides
 *
 * This file contains CSS overrides for OpenGov components that don't natively
 * support dark mode. These are temporary fixes until the OpenGov packages
 * themselves are updated with proper dark mode support.
 *
 * Components requiring overrides:
 * - @opengov/components-nav-bar (NavBar)
 * - @opengov/components-page-header (PageHeaderComposable)
 * - @opengov/components-pagination (Pagination)
 * - @opengov/components-result (Result)
 * - @opengov/components-file-management (FilePreviewCard)
 * - @opengov/components-ai-patterns (AIPromptInput, AIConversation)
 *
 * TODO: Remove these overrides once OpenGov packages support dark mode natively
 */

import type { ThemeOptions } from '@mui/material/styles';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

export const openGovDarkModeOverrides: ThemeOptions['components'] = {
  // ================================================================
  // MUI Component-level overrides for dark mode
  // ================================================================

  // Fix for MuiScopedCssBaseline (used by NavBar)
  MuiScopedCssBaseline: {
    styleOverrides: {
      root: ({ theme }) => ({
        // Hide OpenGov logo in NavBar at all screen widths (applies to both modes)
        '& #openGovLogo': {
          display: 'none !important',
        },
        '& [data-test="nav_icon_opengov"]': {
          display: 'none !important',
        },
        '& [aria-label="OpenGov Logo"]': {
          display: 'none !important',
        },
        // Dark mode specific styles
        ...(theme.palette.mode === 'dark' && {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }),
      }),
    },
  },

  MuiTable: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
          }
          : {},
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            backgroundColor: theme.palette.background.secondary,
            borderColor: theme.palette.divider,
          }
          : {},
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            borderColor: theme.palette.divider,
            '&:hover': {
              backgroundColor: `${theme.palette.action.hover} !important`,
            },
          }
          : {
            backgroundColor: capitalDesignTokens.foundations.colors.white,
            '&:hover': {
              backgroundColor: `${capitalDesignTokens.foundations.colors.gray50} !important`,
            },
          },
      head: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            backgroundColor: theme.palette.background.secondary,
            borderColor: theme.palette.divider,
          }
          : {},
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            color: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            borderBottomColor: theme.palette.divider,
          }
          : {},
      head: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.secondary,
            fontWeight: 600,
            borderColor: theme.palette.divider,
          }
          : {},
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            borderColor: theme.palette.divider,
          }
          : {},
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: ({ theme }) =>
        theme.palette.mode === 'dark'
          ? {
            borderColor: theme.palette.divider,
            '& .MuiTableRow-root': {
              borderColor: theme.palette.divider,
            },
          }
          : {},
    },
  },
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      // ================================================================
      // Global NavBar Overrides (applies to both light and dark modes)
      // ================================================================
      // Hide OpenGov logo in NavBar at all screen widths
      '#openGovLogo': {
        display: 'none !important',
      },
      '[data-test="nav_icon_opengov"]': {
        display: 'none !important',
      },
      '[aria-label="OpenGov Logo"]': {
        display: 'none !important',
      },

      // ================================================================
      // PageHeader Max Width Override (applies to both light and dark modes)
      // ================================================================
      // Remove PageHeader max-width constraints to allow full-width layout
      "[data-test='page_header_content_container']": {
        maxWidth: '100% !important',
      },

      // ================================================================
      // Light Mode NavBar Overrides
      // ================================================================
      ...(theme.palette.mode === 'light' && {
        // NavBar app title/logo - use CSS custom properties with very high specificity
        '[data-test="nav_bar_header"] h1': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] h2': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] h3': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] h4': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .MuiTypography-h1': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] .MuiTypography-h2': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] .MuiTypography-h3': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] .MuiTypography-h4': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // NavBar badge - use CSS custom properties
        '[data-test="nav_bar_header"] .MuiBadge-badge': {
          backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] .MuiBadge-colorPrimary': {
          backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // NavBar menu items - target all Typography span elements that might have borders
        '[data-test="nav_bar_header"] span.MuiTypography-root': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },
        '[data-test="nav_bar_header"] .MuiTypography-h5': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // NavBar active links - use CSS custom property with fallback to theme
        '[data-test="nav_bar_header"] .MuiTypography-root.MuiTypography-inherit.MuiLink-root.MuiLink-underlineAlways.active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .MuiTypography-root.MuiTypography-inherit.MuiLink-root.active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .MuiLink-root.MuiTypography-h5.active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] a.MuiLink-root.active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .MuiTypography-root.MuiLink-root.active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] a.active-nav-link': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // NavBar links with aria-current
        '[data-test="nav_bar_header"] a[aria-current="page"]': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .MuiLink-root[aria-current="page"]': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] [aria-current="page"]': {
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // NavBar tabs - use CSS custom properties
        '[data-test="nav_bar_header"] .MuiTabs-root .MuiTabs-indicator': {
          backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        '[data-test="nav_bar_header"] .MuiTab-root.Mui-selected': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // Pagination - use CSS custom properties
        '[data-component="Pagination"] button.Mui-selected, [data-component="Pagination"] button[aria-current="true"]': {
          backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          color: `var(--theme-primary-contrastText, ${theme.palette.primary.contrastText}) !important`,
        },
      }),

      // ================================================================
      // Dark Mode Overrides
      // ================================================================
      // Only apply these overrides in dark mode
      ...(theme.palette.mode === 'dark' && {
        // ================================================================
        // Global Scoped CSS Baseline Fix (NavBar container)
        // ================================================================
        '.MuiScopedCssBaseline-root': {
          backgroundColor: `${theme.palette.background.default} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // ================================================================
        // NavBar Component Overrides
        // ================================================================
        // Target the actual NavBar container
        '[data-test="nav_bar_header"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          borderBottom: `1px solid ${theme.palette.divider} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // Target all elements within NavBar - force light colors
        '[data-test="nav_bar_header"] *': {
          borderColor: `${theme.palette.divider} !important`,
        },

        // NavBar text - all text elements
        '[data-test="nav_bar_header"] span, [data-test="nav_bar_header"] p, [data-test="nav_bar_header"] div': {
          color: `${theme.palette.text.primary} !important`,
        },

        // NavBar links and buttons - use CSS custom properties with fallback
        '[data-test="nav_bar_header"] a': {
          color: `${theme.palette.text.secondary} !important`,
          textDecoration: 'none !important',
          borderBottom: '2px solid transparent',
          transition: 'all 0.2s',
          '&:hover': {
            color: `${theme.palette.text.primary} !important`,
          },
          '&[aria-current="page"]': {
            color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
            borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          },
        },

        // NavBar link wrapper (MuiLink)
        '[data-test="nav_bar_header"] .MuiLink-root': {
          color: `${theme.palette.text.secondary} !important`,
          textDecoration: 'none !important',
          borderBottom: '3px solid transparent',
          paddingBottom: '2px',
          transition: 'all 0.2s',
          '&:hover': {
            color: `${theme.palette.text.primary} !important`,
            borderBottomColor: `${theme.palette.action.hover} !important`,
          },
          '&[aria-current="page"]': {
            color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
            borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          },
        },

        '[data-test="nav_bar_header"] button': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },

        // NavBar MUI components
        '[data-test="nav_bar_header"] .MuiButton-root': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        '[data-test="nav_bar_header"] .MuiIconButton-root': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // NavBar tabs - use CSS custom properties
        '[data-test="nav_bar_header"] .MuiTabs-root': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          '& .MuiTabs-indicator': {
            backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          },
        },

        '[data-test="nav_bar_header"] .MuiTab-root': {
          color: `${theme.palette.text.secondary} !important`,
          '&.Mui-selected': {
            color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          },
        },

        // NavBar logo and application title
        '[data-test="nav_bar_header"] .MuiTypography-root': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        '[data-test="nav_bar_header"] img, [data-test="nav_bar_header"] [class*="logo"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
        },

        // NavBar active menu items - use CSS custom properties
        '[data-test="nav_bar_header"] [aria-current="page"]': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // Active link class (will be added by JavaScript)
        '[data-test="nav_bar_header"] a.active-nav-link': {
          color: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
          borderBottomColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
        },

        // NavBar utility buttons and icons
        '[data-test="nav_bar_header"] svg': {
          color: `${theme.palette.text.primary} !important`,
          fill: `${theme.palette.text.primary} !important`,
        },

        // Fallback for any NavBar-related elements
        '[data-component="NavBar"], [class*="NavBar"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          borderBottom: `1px solid ${theme.palette.divider} !important`,
        },

        // NavBar dropdowns and popovers
        '[data-test="nav_bar_header"] [role="menu"], [class*="NavBar"] [role="menu"]': {
          color: `${theme.palette.text.primary} !important`,
        },

        '[data-test="nav_bar_header"] [role="menuitem"], [class*="NavBar"] [role="menuitem"]': {
          color: `${theme.palette.text.primary} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },

        // ================================================================
        // PageHeaderComposable Overrides
        // ================================================================
        // PageHeader root container
        '[data-test="page_header_root"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
        },

        // PageHeader header section - mobile responsive stacking
        // Target both data-test attribute and common class patterns
        '[data-test="page_header_header"]': {
          color: `${theme.palette.text.primary} !important`,
          // Mobile: stack left/right sections vertically
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column !important',
            alignItems: 'stretch !important',
            gap: `${theme.spacing(2)} !important`,
            '& > *': {
              width: '100% !important',
              maxWidth: '100% !important',
            },
          },
        },

        // Target the inner flex container of PageHeader that holds title + actions
        '[data-test="page_header_header"] > div': {
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column !important',
            alignItems: 'stretch !important',
            gap: `${theme.spacing(2)} !important`,
            '& > *': {
              width: '100% !important',
            },
          },
        },

        // PageHeader title
        '[data-test="page_header_title"]': {
          color: `${theme.palette.text.primary} !important`,
        },

        // PageHeader title status chip
        '[data-test="page_header_title_status"]': {
          backgroundColor: `${theme.palette.action.selected} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // PageHeader title - chip inside
        '[data-test="page_header_title"] .MuiChip-root': {
          backgroundColor: `${theme.palette.action.selected} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // PageHeader description
        '[data-test="page_header_description"]': {
          color: `${theme.palette.text.secondary} !important`,
        },

        // PageHeader actions area - mobile responsive
        '[data-test="page_header_actions"]': {
          '& button': {
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
          },
          // Mobile: full width actions
          [theme.breakpoints.down('sm')]: {
            width: '100% !important',
            justifyContent: 'flex-start !important',
            '& > *': {
              width: '100% !important',
            }
          },
        },

        // Global mobile stacking for any PageHeader-like flex containers
        // Targets common patterns used by OpenGov components
        '[class*="PageHeader"] > div[class*="MuiBox"], [class*="pageHeader"] > div[class*="MuiBox"]': {
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column !important',
            alignItems: 'stretch !important',
            gap: `${theme.spacing(2)} !important`,
          },
        },

        // Fallback selectors for PageHeader
        '[data-component="PageHeaderComposable"], [class*="PageHeader"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,
          borderBottom: `1px solid ${theme.palette.divider} !important`,
        },

        '[data-component="PageHeaderComposable"] h1, [class*="PageHeader"] h1': {
          color: `${theme.palette.text.primary} !important`,
        },

        '[data-component="PageHeaderComposable"] h2, [class*="PageHeader"] h2': {
          color: `${theme.palette.text.primary} !important`,
        },

        '[data-component="PageHeaderComposable"] p, [class*="PageHeader"] p': {
          color: `${theme.palette.text.secondary} !important`,
        },

        // ================================================================
        // Pagination Component Overrides
        // ================================================================
        '[data-component="Pagination"], [class*="OgPagination"]': {
          '& button': {
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
            '&:hover': {
              backgroundColor: `${theme.palette.action.hover} !important`,
            },
            '&.Mui-selected, &[aria-current="true"]': {
              backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
              color: `var(--theme-primary-contrastText, ${theme.palette.primary.contrastText}) !important`,
            },
          },
          '& select': {
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
          },
        },

        // ================================================================
        // Result Component Overrides (Empty States)
        // ================================================================
        '[data-component="Result"], [class*="OgResult"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,

          '& h3, & h4, & h5': {
            color: `${theme.palette.text.primary} !important`,
          },
          '& p': {
            color: `${theme.palette.text.secondary} !important`,
          },
          '& svg': {
            color: `${theme.palette.text.disabled} !important`,
            opacity: 0.7,
          },
        },

        // ================================================================
        // FilePreviewCard Overrides
        // ================================================================
        '[data-component="FilePreviewCard"], [class*="FilePreview"]': {
          backgroundColor: `${theme.palette.background.secondary} !important`,
          borderColor: `${theme.palette.divider} !important`,

          '& .MuiCardContent-root': {
            color: `${theme.palette.text.primary} !important`,
          },
          '& .MuiTypography-root': {
            color: `${theme.palette.text.primary} !important`,
          },
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },

        // ================================================================
        // AI Components Overrides (AIPromptInput, AIConversation)
        // ================================================================
        '[data-component*="AI"], [class*="OgAI"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        '[data-component="AIPromptInput"], [class*="AIPromptInput"]': {
          '& input, & textarea': {
            color: `${theme.palette.text.primary} !important`,
            backgroundColor: `${theme.palette.background.secondary} !important`,
            borderColor: `${theme.palette.divider} !important`,
          },
          '& .MuiInputBase-root': {
            color: `${theme.palette.text.primary} !important`,
            backgroundColor: `${theme.palette.background.secondary} !important`,
          },
        },

        '[data-component="AIConversation"], [class*="AIConversation"]': {
          backgroundColor: `${theme.palette.background.paper} !important`,

          '& .message': {
            backgroundColor: `${theme.palette.background.secondary} !important`,
            color: `${theme.palette.text.primary} !important`,
            borderColor: `${theme.palette.divider} !important`,
          },
          '& .message.user': {
            backgroundColor: `var(--theme-primary-main, ${theme.palette.primary.main}) !important`,
            color: `var(--theme-primary-contrastText, ${theme.palette.primary.contrastText}) !important`,
          },
          '& .message.assistant': {
            backgroundColor: `${theme.palette.background.secondary} !important`,
            color: `${theme.palette.text.primary} !important`,
          },
        },

        // ================================================================
        // General OpenGov Component Patterns
        // ================================================================

        // All OpenGov cards
        '[class*="Og"] .MuiCard-root, [data-component*="Og"] .MuiCard-root': {
          backgroundColor: `${theme.palette.background.secondary} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // All OpenGov inputs
        '[class*="Og"] input, [data-component*="Og"] input': {
          color: `${theme.palette.text.primary} !important`,
          '&::placeholder': {
            color: `${theme.palette.text.disabled} !important`,
          },
        },

        // All OpenGov lists
        '[class*="Og"] .MuiList-root, [data-component*="Og"] .MuiList-root': {
          backgroundColor: `${theme.palette.background.secondary} !important`,
        },

        // All OpenGov list items
        '[class*="Og"] .MuiListItem-root, [data-component*="Og"] .MuiListItem-root': {
          color: `${theme.palette.text.primary} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },

        // All OpenGov dividers
        '[class*="Og"] .MuiDivider-root, [data-component*="Og"] .MuiDivider-root': {
          borderColor: `${theme.palette.divider} !important`,
        },

        // All OpenGov popovers
        '[class*="Og"] .MuiPopover-paper, [data-component*="Og"] .MuiPopover-paper': {
          backgroundColor: `${theme.palette.background.secondary} !important`,
          color: `${theme.palette.text.primary} !important`,
        },

        // ================================================================
        // MUI Table Overrides (for tables in dashboard and lists)
        // ================================================================
        '.MuiTable-root': {
          backgroundColor: `${theme.palette.background.paper} !important`,
        },

        '.MuiTableHead-root': {
          backgroundColor: `${theme.palette.background.secondary} !important`,
        },

        '.MuiTableRow-root': {
          borderBottomColor: `${theme.palette.divider} !important`,
          '&:hover': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },

        '.MuiTableRow-head': {
          backgroundColor: `${theme.palette.background.secondary} !important`,
        },

        '.MuiTableCell-root': {
          color: `${theme.palette.text.primary} !important`,
          borderBottomColor: `${theme.palette.divider} !important`,
        },

        '.MuiTableCell-head': {
          color: `${theme.palette.text.primary} !important`,
          backgroundColor: `${theme.palette.background.secondary} !important`,
          fontWeight: 600,
        },

        '.MuiTableBody-root .MuiTableRow-root': {
          backgroundColor: `${theme.palette.background.paper} !important`,
          '&:nth-of-type(odd)': {
            backgroundColor: `${theme.palette.action.hover} !important`,
          },
        },
      }),

      // ================================================================
      // Light Mode Table Overrides
      // ================================================================
      ...(theme.palette.mode === 'light' && {
        '.MuiTableBody-root .MuiTableRow-root': {
          backgroundColor: `${capitalDesignTokens.foundations.colors.white} !important`,
        },
      }),
    }),
  },
};

/**
 * Instructions for updating OpenGov packages:
 *
 * When OpenGov packages are updated with native dark mode support:
 * 1. Test each component in dark mode
 * 2. Remove the corresponding override section above
 * 3. Document the package version that added dark mode support
 * 4. Eventually remove this entire file when all packages support dark mode
 *
 * Package versions to track:
 * - @opengov/components-nav-bar: ^37.13.1 (needs dark mode)
 * - @opengov/components-page-header: ^37.6.0 (needs dark mode)
 * - @opengov/components-pagination: ^37.0.4 (needs dark mode)
 * - @opengov/components-result: ^37.0.5 (needs dark mode)
 * - @opengov/components-file-management: ^37.1.2 (needs dark mode)
 * - @opengov/components-ai-patterns: ^37.8.1 (needs dark mode)
 */
