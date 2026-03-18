import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from '@mui/material';
import {
  MoreVert as MoreIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Assignment as TaskIcon,
} from '@mui/icons-material';

interface Widget {
  id: number;
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

/**
 * DashboardKeyboardDemo - Demonstrates dashboard widget navigation
 *
 * Keyboard patterns:
 * - Tab: Navigate between widgets
 * - Enter: Enter widget to access actions
 * - Esc: Exit widget
 * - F2: Enter edit mode
 */
export function DashboardKeyboardDemo() {
  const theme = useTheme();
  const [widgets] = useState<Widget[]>([
    { id: 1, title: 'Total Revenue', value: '$124,500', icon: <MoneyIcon />, trend: '+12%' },
    { id: 2, title: 'Active Users', value: '2,847', icon: <PeopleIcon />, trend: '+5%' },
    { id: 3, title: 'Growth Rate', value: '18.2%', icon: <TrendingIcon />, trend: '+3%' },
    { id: 4, title: 'Open Tasks', value: '43', icon: <TaskIcon />, trend: '-8%' },
  ]);
  const [activeWidgetId, setActiveWidgetId] = useState<number | null>(null);
  const [focusedWidgetId, setFocusedWidgetId] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<string>('');
  const widgetRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const firstActionRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const enterWidget = useCallback((widgetId: number) => {
    setActiveWidgetId(widgetId);
    setTimeout(() => {
      firstActionRefs.current.get(widgetId)?.focus();
    }, 0);
    setLastAction(`Entered "${widgets.find(w => w.id === widgetId)?.title}"`);
  }, [widgets]);

  const exitWidget = useCallback((widgetId: number) => {
    setActiveWidgetId(null);
    widgetRefs.current.get(widgetId)?.focus();
    setLastAction(`Exited "${widgets.find(w => w.id === widgetId)?.title}"`);
  }, [widgets]);

  const handleWidgetKeyDown = useCallback((e: React.KeyboardEvent, widget: Widget) => {
    if (activeWidgetId === widget.id) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        exitWidget(widget.id);
      }
    } else {
      if (e.key === 'Enter') {
        e.preventDefault();
        enterWidget(widget.id);
      } else if (e.key === 'F2') {
        e.preventDefault();
        setLastAction(`Edit mode for "${widget.title}"`);
      }
    }
  }, [activeWidgetId, enterWidget, exitWidget]);

  const handleActionClick = (widgetId: number, action: string) => {
    const widget = widgets.find(w => w.id === widgetId);
    setLastAction(`${action} on "${widget?.title}"`);
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
        Use <strong>Tab</strong> to navigate between widgets. Press <strong>Enter</strong> to enter
        a widget and access its actions. <strong>Esc</strong> to exit. <strong>F2</strong> for edit mode.
      </Typography>

      {/* Dashboard Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
          gap: 2,
          mb: 3,
        }}
        role="region"
        aria-label="Dashboard widgets"
      >
        {widgets.map((widget) => {
          const isActive = activeWidgetId === widget.id;
          const isFocused = focusedWidgetId === widget.id;

          return (
            <Paper
              key={widget.id}
              ref={(el: HTMLDivElement | null) => {
                if (el) widgetRefs.current.set(widget.id, el);
              }}
              elevation={0}
              tabIndex={isActive ? -1 : 0}
              role="article"
              aria-label={`${widget.title}: ${widget.value}`}
              onKeyDown={(e) => handleWidgetKeyDown(e, widget)}
              onFocus={() => !isActive && setFocusedWidgetId(widget.id)}
              onBlur={() => setFocusedWidgetId(null)}
              sx={{
                p: 2,
                border: `1px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                borderRadius: 1,
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxShadow: isActive ? `0 0 0 1px ${theme.palette.primary.main}` : 'none',
                cursor: isActive ? 'default' : 'pointer',
                ...(!isActive && focusIndicatorSx),
              }}
            >
              {/* Widget Header */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    display: 'flex',
                  }}
                >
                  {widget.icon}
                </Box>
                {isActive && (
                  <IconButton
                    size="small"
                    aria-label="Widget options"
                    sx={focusIndicatorSx}
                    onClick={() => handleActionClick(widget.id, 'Options')}
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>

              {/* Widget Content */}
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {widget.title}
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
                {widget.value}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: widget.trend.startsWith('+')
                    ? theme.palette.success.main
                    : theme.palette.error.main,
                }}
              >
                {widget.trend} from last period
              </Typography>

              {/* Widget Actions - visible when active */}
              {isActive && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      e.stopPropagation();
                      exitWidget(widget.id);
                    }
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Widget Actions (Esc to exit)
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      ref={(el: HTMLButtonElement | null) => {
                        if (el) firstActionRefs.current.set(widget.id, el);
                      }}
                      size="small"
                      variant="outlined"
                      onClick={() => handleActionClick(widget.id, 'View Details')}
                      sx={focusIndicatorSx}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleActionClick(widget.id, 'Export')}
                      sx={focusIndicatorSx}
                    >
                      Export
                    </Button>
                  </Stack>
                </Box>
              )}
            </Paper>
          );
        })}
      </Box>

      {/* Mode indicator */}
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
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Navigation Mode
        </Typography>
        <Typography variant="body2">
          {activeWidgetId
            ? `Inside widget: "${widgets.find(w => w.id === activeWidgetId)?.title}". Tab to navigate actions. Esc to exit.`
            : 'Tab between widgets. Enter to access widget actions. F2 for edit mode.'}
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
          <strong>Active widget:</strong> {activeWidgetId ? widgets.find(w => w.id === activeWidgetId)?.title : 'None'}
          {' | '}
          <strong>Focused:</strong> {focusedWidgetId ? widgets.find(w => w.id === focusedWidgetId)?.title : 'None'}
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

export default DashboardKeyboardDemo;

export const dashboardKeyboardCode = `// Dashboard Widget Navigation
// Tab: Navigate between widgets | Enter: Enter widget
// Esc: Exit widget | F2: Edit mode

const enterWidget = (widgetId) => {
  setActiveWidgetId(widgetId);
  // Focus first action button
  firstActionRef.current?.focus();
};

const exitWidget = (widgetId) => {
  setActiveWidgetId(null);
  // Return focus to widget container
  widgetRef.current?.focus();
};

const handleWidgetKeyDown = (e, widget) => {
  if (activeWidgetId === widget.id) {
    if (e.key === 'Escape') exitWidget(widget.id);
  } else {
    if (e.key === 'Enter') enterWidget(widget.id);
    if (e.key === 'F2') enterEditMode(widget.id);
  }
};

<Box role="region" aria-label="Dashboard widgets">
  {widgets.map((widget) => (
    <Paper
      ref={widgetRef}
      tabIndex={isActive ? -1 : 0}
      role="article"
      aria-label={\`\${widget.title}: \${widget.value}\`}
      onKeyDown={(e) => handleWidgetKeyDown(e, widget)}
    >
      <WidgetContent />
      {isActive && (
        <WidgetActions>
          <Button ref={firstActionRef}>View Details</Button>
          <Button>Export</Button>
        </WidgetActions>
      )}
    </Paper>
  ))}
</Box>`;
