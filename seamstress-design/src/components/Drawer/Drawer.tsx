import React, { ReactNode } from 'react';
import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Tabs,
  Tab,
  Divider,
  Paper,
  Collapse,
  dividerClasses,
  useTheme,
} from '@mui/material';
import type { DrawerProps as MuiDrawerProps } from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { transitions } from '../../theme';

export interface DrawerProps extends Omit<MuiDrawerProps, 'children'> {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  tabs?: {
    label: string;
    value: string;
  }[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onClose?: () => void;
  width?: number | string;
  showBackdrop?: boolean;
  primaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  destructiveAction?: {
    label: string;
    onClick: () => void;
  };
  hideHeader?: boolean;
  hideFooter?: boolean;
  contentPadding?: number | string;
  inPage?: boolean;
  /** Accessible label for the drawer */
  'aria-label'?: string;
  /** ID of an element that labels the drawer */
  'aria-labelledby'?: string;
}

const Drawer: React.FC<DrawerProps> = ({
  open = false,
  title = 'Drawer Title',
  subtitle = 'Drawer subtitle goes here.',
  children,
  actions,
  tabs,
  activeTab,
  onTabChange,
  onClose,
  width = 567,
  anchor = 'right',
  showBackdrop = true,
  primaryAction,
  secondaryAction,
  destructiveAction,
  hideHeader = false,
  hideFooter = false,
  contentPadding = 3,
  inPage = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...drawerProps
}) => {
  const theme = useTheme();
  const headingId = `drawer-heading-${Math.random().toString(36).substr(2, 9)}`;

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: inPage ? 'auto' : '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: inPage ? 'background.secondary' : 'background.paper',
      }}
      role={inPage ? 'region' : 'dialog'}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy || (!ariaLabel ? headingId : undefined)}
      aria-modal={!inPage}
    >
      {/* Header */}
      {!hideHeader && (
        <Box
          sx={{
            px: inPage ? 2 : 3,
            pt: 2,
            pb: inPage ? 0 : 2,
            backgroundColor: inPage ? theme.palette.background.secondary : theme.palette.background.paper,
            borderBottom: !inPage ? '1px solid' : 'none',
            borderColor: theme.palette.divider,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            sx={{ pb: inPage ? 2 : 0 }}
          >
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                id={headingId}
                component="h2"
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: inPage ? '14px' : '16px',
                    lineHeight: inPage ? 1.43 : 1.5,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {actions}
              {!inPage ? (
                <IconButton
                  onClick={onClose}
                  size="small"
                  aria-label="Close drawer"
                  sx={{
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    borderRadius: 1,
                    width: 32,
                    height: 32,
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              ) : (
                <IconButton
                  onClick={onClose}
                  aria-label="Close panel"
                  sx={{
                    padding: '8px',
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  <CloseIcon sx={{ fontSize: 24 }} />
                </IconButton>
              )}
            </Stack>
          </Stack>
        </Box>
      )}

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <Box sx={{
          borderBottom: 1,
          borderColor: theme.palette.divider,
          px: inPage ? 2 : 3,
          backgroundColor: inPage ? theme.palette.background.paper : 'transparent',
        }}>
          <Tabs
            value={activeTab || tabs[0].value}
            onChange={handleTabChange}
            aria-label="Drawer tabs"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                id={`drawer-tab-${tab.value}`}
                aria-controls={`drawer-tabpanel-${tab.value}`}
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          px: inPage ? 2 : contentPadding,
          py: inPage ? 2 : contentPadding,
          backgroundColor: inPage ? theme.palette.background.secondary : theme.palette.background.paper,
          '& .MuiInputBase-multiline': {
            width: '100%',
          },
        }}
      >
        {children}
      </Box>

      {/* Footer Actions */}
      {!hideFooter && (primaryAction || secondaryAction || destructiveAction) && (
        <>
          <Divider sx={{ borderColor: theme.palette.divider }} />
          <Box
            sx={{
              px: 2,
              py: 2,
              backgroundColor: inPage ? theme.palette.background.secondary : theme.palette.background.paper,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            role="group"
            aria-label="Drawer actions"
          >
            <Box>
              {destructiveAction && (
                <Button
                  onClick={destructiveAction.onClick}
                  sx={{ minHeight: 44 }}
                >
                  {destructiveAction.label}
                </Button>
              )}
            </Box>
            <Stack direction="row" spacing={1}>
              {secondaryAction && (
                <Button
                  variant="text"
                  onClick={secondaryAction.onClick}
                  sx={{ minHeight: 44 }}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button
                  variant="contained"
                  onClick={primaryAction.onClick}
                  disabled={primaryAction.disabled}
                  sx={{ minHeight: 44 }}
                >
                  {primaryAction.label}
                </Button>
              )}
            </Stack>
          </Box>
        </>
      )}
    </Box>
  );

  if (inPage) {
    return (
      <Collapse
        in={open}
        orientation="horizontal"
        timeout={transitions.getDuration(transitions.components.drawer.timeout)}
      >
        <Paper
          elevation={0}
          sx={{
            width: width,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            backgroundColor: theme.palette.background.secondary,
            overflow: 'hidden',
          }}
        >
          {drawerContent}
        </Paper>
      </Collapse>
    );
  }

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      transitionDuration={transitions.components.drawer.timeout}
      {...drawerProps}
      sx={{
        '& .MuiDrawer-paper': {
          width,
          boxShadow: '0px 6px 30px 5px rgba(0,0,0,0.12), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 8px 10px -5px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        },
        '& .MuiBackdrop-root': {
          display: showBackdrop ? 'block' : 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        ...drawerProps.sx,
      }}
    >
      {drawerContent}
    </MuiDrawer>
  );
};

export default Drawer;