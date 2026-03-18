import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Avatar,
  Chip,
  TextField,
  Divider,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { UnifiedNavigation } from '../navigation/UnifiedNavigation';
import type { SuiteNavMenuItem } from '../navigation/types';
import Drawer from '../Drawer/Drawer';
import Toolbar from '../Toolbar/Toolbar';
import { dataVizPalette } from '../../constants/dataVizColors';
import { SpacingInspector, type SpacingMeasurements } from './SpacingInspector';

// High-contrast colors for Page Anatomy sections (from dataViz palette)
const anatomyColors = {
  navigation: dataVizPalette[0].value,   // Blurple (unified navigation)
  pageHeader: dataVizPalette[3].value,   // Turquoise
  toolbar: dataVizPalette[5].value,      // Blue
  content: dataVizPalette[1].value,      // Terracotta
  drawer: dataVizPalette[4].value,       // Magenta
};

interface BreadcrumbItem {
  path?: string;
  title: string;
}

interface HeaderAction {
  label: string;
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface PageAnatomyPreviewProps {
  /** Page title shown in the header */
  title: string;
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[];
  /** Status badge for the title */
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  };
  /** Header action buttons */
  headerActions?: HeaderAction[];
  /** Show the toolbar section */
  showToolbar?: boolean;
  /** Custom toolbar content - if not provided, uses default */
  toolbarContent?: React.ReactNode;
  /** Show the in-page drawer */
  showDrawer?: boolean;
  /** Initial drawer open state */
  drawerOpen?: boolean;
  /** Drawer title */
  drawerTitle?: string;
  /** Drawer subtitle */
  drawerSubtitle?: string;
  /** Custom drawer content */
  drawerContent?: React.ReactNode;
  /** Content area horizontal padding (MUI spacing units) */
  contentPadding?: number;
  /** Show colored anatomy indicators on the left */
  showAnatomyIndicators?: boolean;
  /** Suite name shown in NavBar */
  suiteName?: string;
  /** Active menu item in NavBar */
  activeMenuItem?: string;
  /** Main content area */
  children: React.ReactNode;
  /** Additional sx props for the outer Paper */
  sx?: object;
  /** Enable interactive spacing inspector mode */
  inspectSpacing?: boolean;
  /** Callback when element is inspected */
  onElementInspected?: (element: HTMLElement, measurements: SpacingMeasurements) => void;
  /** Callback when drawer open state changes */
  onDrawerOpenChange?: (open: boolean) => void;
}

// Menu items for UnifiedNavigation
const createMenuItems = (activeMenuItem: string): SuiteNavMenuItem[] => [
  { id: 'dashboard', label: 'Dashboard', url: '#' },
  { id: 'items', label: 'Items', url: '#' },
  { id: 'reports', label: 'Reports', url: '#' },
  { id: 'settings', label: 'Settings', url: '#' },
];

// Anatomy indicator bar component
const AnatomyIndicator = ({ color, height = '70%' }: { color: string; height?: string }) => (
  <Box
    sx={{
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 4,
      height,
      bgcolor: color,
      borderRadius: '0 4px 4px 0',
      zIndex: 10,
    }}
  />
);

export function PageAnatomyPreview({
  title,
  breadcrumbs = [{ path: '#', title: 'Home' }, { title }],
  status,
  headerActions,
  showToolbar = false,
  toolbarContent,
  showDrawer = false,
  drawerOpen: initialDrawerOpen = false,
  drawerTitle = 'Filters',
  drawerSubtitle,
  drawerContent,
  contentPadding = 3,
  showAnatomyIndicators = true,
  suiteName = 'Suite Name',
  activeMenuItem = 'items',
  children,
  sx,
  inspectSpacing = false,
  onElementInspected,
  onDrawerOpenChange,
}: PageAnatomyPreviewProps) {
  const theme = useTheme();
  const [internalDrawerOpen, setInternalDrawerOpen] = useState(initialDrawerOpen);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal state with external prop when it changes
  useEffect(() => {
    setInternalDrawerOpen(initialDrawerOpen);
  }, [initialDrawerOpen]);

  // Use controlled state if callback is provided, otherwise internal state
  const drawerOpen = internalDrawerOpen;
  const setDrawerOpen = (open: boolean) => {
    setInternalDrawerOpen(open);
    onDrawerOpenChange?.(open);
  };

  const menuItems = createMenuItems(activeMenuItem);

  // Default header actions if none provided
  const defaultHeaderActions = (
    <Stack direction="row" alignItems="center" spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Last updated: Jan 15, 2024
      </Typography>
      <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'secondary.main', color: 'white' }}>JD</Avatar>
      <Button variant="contained" startIcon={<AddIcon />}>
        Create Item
      </Button>
    </Stack>
  );

  // Render header actions
  const renderHeaderActions = () => {
    if (headerActions) {
      return (
        <Stack direction="row" alignItems="center" spacing={2}>
          {headerActions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              startIcon={action.icon}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      );
    }
    return defaultHeaderActions;
  };

  // Default drawer content
  const defaultDrawerContent = (
    <Stack spacing={2}>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          Status
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="Active" size="small" color="success" />
          <Chip label="Inactive" size="small" variant="outlined" />
        </Stack>
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
          Search
        </Typography>
        <TextField size="small" placeholder="Filter..." fullWidth />
      </Box>
      <Divider />
      <Button variant="outlined" size="small" fullWidth>
        Clear Filters
      </Button>
    </Stack>
  );

  return (
    <Box>
      <Paper
        ref={containerRef}
        elevation={3}
        sx={{
          overflow: 'visible',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          position: 'relative',
          ...sx,
        }}
      >
        {/* Spacing Inspector Overlay */}
        <SpacingInspector
          enabled={inspectSpacing}
          containerRef={containerRef}
          onElementSelected={onElementInspected}
        />
        {/* Unified Navigation (Global Nav + Suite Nav) */}
        <Box sx={{ position: 'relative' }}>
          {showAnatomyIndicators && <AnatomyIndicator color={anatomyColors.navigation} />}
          <UnifiedNavigation
            globalNav={{ centeredBranding: false }}
            appName={suiteName}
            menuItems={menuItems}
          />
        </Box>

        {/* Page Header */}
        <Box sx={{ position: 'relative' }}>
          {showAnatomyIndicators && <AnatomyIndicator color={anatomyColors.pageHeader} />}
          <PageHeaderComposable maxContentWidth="none">
            <PageHeaderComposable.Header
              actions={[<Box key="header-actions">{renderHeaderActions()}</Box>]}
            >
              <PageHeaderComposable.Breadcrumbs breadcrumbs={breadcrumbs} />
              <PageHeaderComposable.Title status={status}>
                {title}
              </PageHeaderComposable.Title>
            </PageHeaderComposable.Header>
          </PageHeaderComposable>
        </Box>

        {/* Content Area */}
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            gap: 0,
            px: contentPadding,
          }}
        >
          {showAnatomyIndicators && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 12,
                width: 4,
                height: 'calc(100% - 24px)',
                bgcolor: anatomyColors.content,
                borderRadius: '0 4px 4px 0',
                zIndex: 1,
              }}
            />
          )}

          {/* In-Page Drawer (Left Side) */}
          {showDrawer && (
            <Box
              sx={{
                ml: 0,
                mt: 1,
                mr: drawerOpen ? 2 : 0,
                alignSelf: 'flex-start',
                ...(showAnatomyIndicators && drawerOpen && {
                  borderLeft: `4px solid ${anatomyColors.drawer}`,
                  borderRadius: '4px 0 0 4px',
                }),
              }}
            >
              <Drawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={drawerTitle}
                subtitle={drawerSubtitle}
                width={280}
                inPage
                hideFooter
              >
                {drawerContent || defaultDrawerContent}
              </Drawer>
            </Box>
          )}

          {/* Toolbar + Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            {showToolbar && (
              <Box
                sx={{
                  ...(showAnatomyIndicators && {
                    borderLeft: `4px solid ${anatomyColors.toolbar}`,
                    borderRadius: '4px 0 0 4px',
                    pl: 1,
                  }),
                }}
              >
                {toolbarContent || (
                  <Toolbar level="level1" sx={{ px: 0 }}>
                    <Toolbar.Section spacing={1}>
                      {showDrawer && (
                        <Button
                          variant={drawerOpen ? 'contained' : 'outlined'}
                          size="medium"
                          onClick={() => setDrawerOpen(!drawerOpen)}
                          color={drawerOpen ? 'primary' : 'inherit'}
                        >
                          Filters
                        </Button>
                      )}
                      <TextField
                        size="medium"
                        placeholder="Search..."
                        sx={{ width: 180 }}
                      />
                    </Toolbar.Section>
                    <Toolbar.Section grow />
                    <Toolbar.Section>
                      <Button variant="outlined" size="medium">Export</Button>
                    </Toolbar.Section>
                  </Toolbar>
                )}
              </Box>
            )}

            {/* Main Content */}
            <Box sx={{ pb: 3 }}>{children}</Box>
          </Box>
        </Box>
      </Paper>

      {/* Legend - always shown for PageAnatomy */}
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: anatomyColors.navigation, borderRadius: 1 }} />
          <Typography variant="caption">Navigation</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: anatomyColors.pageHeader, borderRadius: 1 }} />
          <Typography variant="caption">Page Header</Typography>
        </Stack>
        {showToolbar && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: anatomyColors.toolbar, borderRadius: 1 }} />
            <Typography variant="caption">Toolbar</Typography>
          </Stack>
        )}
        <Stack direction="row" spacing={1} alignItems="center">
          <Box sx={{ width: 16, height: 16, bgcolor: anatomyColors.content, borderRadius: 1 }} />
          <Typography variant="caption">Content</Typography>
        </Stack>
        {showDrawer && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 16, height: 16, bgcolor: anatomyColors.drawer, borderRadius: 1 }} />
            <Typography variant="caption">Drawer</Typography>
          </Stack>
        )}
        {inspectSpacing && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.success.main, borderRadius: 1 }} />
              <Typography variant="caption">Padding</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.warning.main, borderRadius: 1 }} />
              <Typography variant="caption">Margin</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box sx={{ width: 16, height: 16, bgcolor: theme.palette.info.main, borderRadius: 1 }} />
              <Typography variant="caption">Gap</Typography>
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default PageAnatomyPreview;
