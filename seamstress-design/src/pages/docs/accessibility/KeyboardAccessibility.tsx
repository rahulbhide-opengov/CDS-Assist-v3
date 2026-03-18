import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  useTheme,
  alpha,
  Tabs,
  Tab,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Keyboard as KeyboardIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { DocsLayout } from '../../../components/DocsLayout';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { KeyboardShortcutTable } from '../../../components/docs/KeyboardShortcutTable';
import { KeyboardKey, KeyboardShortcut } from '../../../components/docs/KeyboardKey';
import { ExampleBlock } from '../../../components/docs/ExampleBlock';
import {
  navigationPatterns,
  interactionPatterns,
  componentPatterns,
  referencePatterns,
  focusGuidelines,
  keyboardGuidelines,
  type Guideline,
} from '../../../data/keyboardAccessibilityData';

// Tab 1: Navigation Examples
import {
  TabNavigationDemo,
  tabNavigationCode,
  SkipLinkDemo,
  skipLinkCode,
  GridNavigationDemo,
  gridNavigationCode,
  KeyboardMapDemo,
  keyboardMapCode,
  AccessibleTableDemo,
  accessibleTableCode,
} from '../../../components/docs/accessibility-examples';

// Tab 2: Interaction Examples
import {
  ExpandableCardDemo,
  expandableCardCode,
  SelectableListDemo,
  selectableListCode,
  KeyboardSortableListDemo,
  keyboardSortableListCode,
  ReorderableTagsDemo,
  reorderableTagsCode,
} from '../../../components/docs/accessibility-examples';

// Tab 3: Component Examples
import {
  FormKeyboardDemo,
  formKeyboardCode,
  AutocompleteDemo,
  autocompleteCode,
  OverlayDemo,
  overlayDemoCode,
  DashboardKeyboardDemo,
  dashboardKeyboardCode,
} from '../../../components/docs/accessibility-examples';

// Tab 4: Reference Examples
import {
  FocusManagementDemo,
  focusManagementCode,
  LiveRegionDemo,
  liveRegionCode,
} from '../../../components/docs/accessibility-examples';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`keyboard-tabpanel-${index}`}
      aria-labelledby={`keyboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `keyboard-tab-${index}`,
    'aria-controls': `keyboard-tabpanel-${index}`,
  };
}

interface GuidelineCardProps {
  guidelines: Guideline[];
  type: 'do' | 'dont';
  title: string;
}

function GuidelineCard({ guidelines, type, title }: GuidelineCardProps) {
  const theme = useTheme();
  const isDo = type === 'do';
  const color = isDo ? theme.palette.success : theme.palette.error;
  const filtered = guidelines.filter(g => g.type === type);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: `1px solid ${color.main}`,
        bgcolor: alpha(color.main, 0.05),
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        {isDo ? (
          <CheckIcon sx={{ color: color.main }} />
        ) : (
          <CancelIcon sx={{ color: color.main }} />
        )}
        <Typography variant="h6" sx={{ color: color.main, fontWeight: 600 }}>
          {title}
        </Typography>
      </Stack>
      <Stack spacing={1.5}>
        {filtered.map((guideline, index) => (
          <Box key={index}>
            <Typography variant="body2">
              {isDo ? '✓' : '✗'} {guideline.text}
            </Typography>
            {guideline.context && (
              <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                {guideline.context}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export default function KeyboardAccessibility() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  // Update document title for screen readers and browser tab
  useDocumentTitle('Keyboard Accessibility');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 50%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <KeyboardIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              <Typography variant="h1" component="h1">
                Keyboard Accessibility
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600 }}>
              Comprehensive keyboard interaction guidelines for designing accessible interfaces.
              These patterns ensure all users can navigate and interact with our components using only a keyboard.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              sx={{
                mt: 4,
                flexWrap: 'wrap',
                gap: 1.5,
                '& .MuiChip-root': {
                  height: 36,
                  fontSize: '0.875rem',
                },
              }}
            >
              <Chip label="WCAG 2.1 AA" color="success" />
              <Chip label="Screen Reader Compatible" color="primary" />
              <Chip label="12+ Patterns" color="secondary" />
              <Chip label="Designer Reference" />
            </Stack>

            {/* Quick Reference */}
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: { xs: 2, sm: 3 },
                bgcolor: alpha(theme.palette.background.paper, 0.8),
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Essential Keys at a Glance
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(3, 1fr)',
                    md: 'repeat(6, 1fr)',
                  },
                  gap: { xs: 2, sm: 3 },
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <KeyboardKey>Tab</KeyboardKey>
                  <Typography variant="body2" color="text.secondary">Navigate forward</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <KeyboardShortcut keys={['Shift', 'Tab']} />
                  <Typography variant="body2" color="text.secondary">Navigate backward</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <KeyboardKey>Enter</KeyboardKey>
                  <Typography variant="body2" color="text.secondary">Activate</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <KeyboardKey>Space</KeyboardKey>
                  <Typography variant="body2" color="text.secondary">Toggle/Select</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <KeyboardKey>Esc</KeyboardKey>
                  <Typography variant="body2" color="text.secondary">Cancel/Close</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                  <KeyboardShortcut keys={['↑', '↓', '←', '→']} separator="" />
                  <Typography variant="body2" color="text.secondary">Navigate within</Typography>
                </Box>
              </Box>
            </Paper>

            {/* Tab Navigation */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Keyboard accessibility sections"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                mt: 4,
                '& .MuiTab-root': {
                  minHeight: 48,
                  minWidth: { xs: 'auto', sm: 90 },
                  px: { xs: 2, sm: 3 },
                },
                '& .MuiTabs-scrollButtons': {
                  '&.Mui-disabled': {
                    opacity: 0.3,
                  },
                },
              }}
            >
              <Tab label="Navigation" {...a11yProps(0)} />
              <Tab label="Interactions" {...a11yProps(1)} />
              <Tab label="Components" {...a11yProps(2)} />
              <Tab label="Reference" {...a11yProps(3)} />
            </Tabs>
          </Container>
        </Box>

        {/* Tab Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>

          {/* Tab 1: Navigation Patterns */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Navigation Patterns
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              These patterns define how users move through pages, applications, and complex data structures
              using only keyboard input. Consistent navigation is essential for users who cannot use a mouse.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <strong>Key Principle:</strong> Users should be able to reach every interactive element using{' '}
              <KeyboardKey size="small">Tab</KeyboardKey> and navigate within composite widgets using arrow keys.
            </Alert>

            {/* Page Navigation */}
            <KeyboardShortcutTable category={navigationPatterns[0]} />
            <ExampleBlock
              title="Try It: Tab Navigation"
              description="Use Tab to move forward through elements, Shift+Tab to go backward. Press Enter or Space on buttons, Space on checkboxes."
              code={tabNavigationCode}
            >
              <TabNavigationDemo />
            </ExampleBlock>

            {/* Skip Links */}
            <KeyboardShortcutTable category={navigationPatterns[1]} />
            <ExampleBlock
              title="Try It: Skip Link"
              description="Click 'Start Demo' then press Tab to reveal the skip link. Press Enter to jump past navigation."
              code={skipLinkCode}
            >
              <SkipLinkDemo />
            </ExampleBlock>

            {/* Grid Navigation */}
            <KeyboardShortcutTable category={navigationPatterns[2]} />
            <ExampleBlock
              title="Try It: Grid Navigation"
              description="Use arrow keys to navigate between cells. Home/End for row edges, Ctrl+Home/End for grid corners. Enter to select."
              code={gridNavigationCode}
            >
              <GridNavigationDemo />
            </ExampleBlock>

            {/* Map Navigation */}
            <KeyboardShortcutTable category={navigationPatterns[3]} />
            <ExampleBlock
              title="Try It: Map Navigation"
              description="Focus the map and use Arrow keys to pan, +/- to zoom. Tab to markers, Enter to open popup, Esc to close."
              code={keyboardMapCode}
            >
              <KeyboardMapDemo />
            </ExampleBlock>

            {/* Table Navigation */}
            <KeyboardShortcutTable category={navigationPatterns[4]} />
            <ExampleBlock
              title="Try It: Table Navigation"
              description="Use Up/Down to navigate rows, Space to select, Enter for row actions, Ctrl+A to select all. Tab to headers, Enter to sort."
              code={accessibleTableCode}
            >
              <AccessibleTableDemo />
            </ExampleBlock>

            {/* Do/Don't Section */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Navigation Guidelines
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard
                  guidelines={focusGuidelines}
                  type="do"
                  title="Do"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard
                  guidelines={focusGuidelines}
                  type="dont"
                  title="Don't"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Interactions */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Interaction Patterns
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              These patterns define how users interact with elements, select items, and manipulate content
              using keyboard commands. They provide keyboard equivalents for mouse-based interactions.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <strong>Key Principle:</strong> Every mouse interaction must have a keyboard equivalent.
              Use <KeyboardKey size="small">Space</KeyboardKey> for selection and{' '}
              <KeyboardKey size="small">Enter</KeyboardKey> for activation.
            </Alert>

            {/* Z-Axis Interaction (Enter/Exit) */}
            <KeyboardShortcutTable category={interactionPatterns[0]} />
            <ExampleBlock
              title="Try It: Expandable Cards"
              description="Tab between cards. Press Enter to expand and access actions. Tab within to navigate. Esc to collapse and exit."
              code={expandableCardCode}
            >
              <ExpandableCardDemo />
            </ExampleBlock>

            {/* Item Selection */}
            <KeyboardShortcutTable category={interactionPatterns[1]} />
            <ExampleBlock
              title="Try It: Multi-Select List"
              description="Use Up/Down to navigate, Space to toggle selection, Shift+Arrow for range selection, Ctrl+A to select all."
              code={selectableListCode}
            >
              <SelectableListDemo />
            </ExampleBlock>

            {/* Move Selection (Keyboard DnD) */}
            <KeyboardShortcutTable category={interactionPatterns[2]} />
            <ExampleBlock
              title="Try It: Keyboard Sortable List"
              description="Navigate with arrows, Space to grab an item, arrows to move it, Space/Enter to drop, Esc to cancel."
              code={keyboardSortableListCode}
            >
              <KeyboardSortableListDemo />
            </ExampleBlock>

            {/* Reorder Selection */}
            <KeyboardShortcutTable category={interactionPatterns[3]} />
            <ExampleBlock
              title="Try It: Reorderable Tags"
              description="Use Left/Right to navigate, Ctrl+Left/Right to reorder, Ctrl+Home/End to move to start/end, Delete to remove."
              code={reorderableTagsCode}
            >
              <ReorderableTagsDemo />
            </ExampleBlock>

            {/* Keyboard Drag-and-Drop Example */}
            <Card
              elevation={0}
              sx={{
                mt: 4,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.info.main, 0.05),
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <InfoIcon color="info" />
                  <Typography variant="h6" fontWeight={600}>
                    Keyboard Drag-and-Drop Flow
                  </Typography>
                </Stack>
                <Typography variant="body2" paragraph>
                  For sortable lists and Kanban boards, implement this keyboard flow:
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label="1" size="small" color="primary" />
                    <Typography variant="body2">
                      Focus the item and press <KeyboardKey size="small">Space</KeyboardKey> to "grab" it
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label="2" size="small" color="primary" />
                    <Typography variant="body2">
                      Use <KeyboardShortcut keys={['↑', '↓']} separator="/" size="small" /> to move within a list,
                      or <KeyboardShortcut keys={['←', '→']} separator="/" size="small" /> to move between columns
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Chip label="3" size="small" color="primary" />
                    <Typography variant="body2">
                      Press <KeyboardKey size="small">Space</KeyboardKey> or <KeyboardKey size="small">Enter</KeyboardKey> to drop,
                      or <KeyboardKey size="small">Esc</KeyboardKey> to cancel
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Do/Don't Section */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Interaction Guidelines
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard
                  guidelines={keyboardGuidelines}
                  type="do"
                  title="Do"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard
                  guidelines={keyboardGuidelines}
                  type="dont"
                  title="Don't"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Components */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Component Patterns
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              These patterns define keyboard behavior for specific UI components. Each component type
              has established patterns that users expect based on ARIA authoring practices.
            </Typography>

            <Alert severity="warning" sx={{ mb: 4 }}>
              <strong>Focus Trapping:</strong> Modals and drawers must trap focus within the overlay.
              Users should not be able to Tab to content behind the modal.
            </Alert>

            {/* Form Inputs */}
            <KeyboardShortcutTable category={componentPatterns[0]} />
            <ExampleBlock
              title="Try It: Form Navigation"
              description="Tab between fields, Space to toggle checkboxes, Arrow keys for radio groups, Enter to submit."
              code={formKeyboardCode}
            >
              <FormKeyboardDemo />
            </ExampleBlock>

            {/* Dropdowns & Autocomplete */}
            <KeyboardShortcutTable category={componentPatterns[1]} />
            <ExampleBlock
              title="Try It: Autocomplete"
              description="Type to filter, Up/Down to navigate options, Enter to select, Esc to close, Home/End for first/last."
              code={autocompleteCode}
            >
              <AutocompleteDemo />
            </ExampleBlock>

            {/* Modals & Drawers */}
            <KeyboardShortcutTable category={componentPatterns[2]} />
            <ExampleBlock
              title="Try It: Modal & Drawer"
              description="Open overlays and Tab through them - focus is trapped. Press Esc to close. Focus returns to trigger."
              code={overlayDemoCode}
            >
              <OverlayDemo />
            </ExampleBlock>

            {/* Dashboards & Widgets */}
            <KeyboardShortcutTable category={componentPatterns[3]} />
            <ExampleBlock
              title="Try It: Dashboard Widgets"
              description="Tab between widgets, Enter to access widget actions, Esc to exit widget, F2 for edit mode."
              code={dashboardKeyboardCode}
            >
              <DashboardKeyboardDemo />
            </ExampleBlock>

            {/* Component Context Chips */}
            <Card
              elevation={0}
              sx={{
                mt: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Component Reference
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  These context chips appear throughout the documentation to indicate which components
                  a pattern applies to:
                </Typography>
                <Stack
                  direction="row"
                  spacing={1.5}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{
                    '& .MuiChip-root': {
                      height: 32,
                      fontSize: '0.8rem',
                    },
                  }}
                >
                  {[
                    'DataGrid',
                    'Calendar',
                    'Modal',
                    'Drawer',
                    'Dropdown',
                    'Autocomplete',
                    'Form',
                    'Table',
                    'Dashboard',
                    'Card',
                    'List',
                  ].map(component => (
                    <Chip
                      key={component}
                      label={component}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: theme.palette.divider }}
                    />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </TabPanel>

          {/* Tab 4: Reference */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Reference Guide
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Advanced focus management guidelines, ARIA live region patterns, and technical appendices
              for implementing accessible keyboard interactions.
            </Typography>

            {/* Focus Management */}
            <KeyboardShortcutTable category={referencePatterns[0]} />
            <ExampleBlock
              title="Try It: Focus Management"
              description="Demonstrates focus return after modal closes and focus movement after item deletion."
              code={focusManagementCode}
            >
              <FocusManagementDemo />
            </ExampleBlock>

            {/* Live Announcements */}
            <KeyboardShortcutTable category={referencePatterns[1]} />
            <ExampleBlock
              title="Try It: Live Regions"
              description="Click buttons to trigger different types of screen reader announcements. Watch the log to see what would be announced."
              code={liveRegionCode}
            >
              <LiveRegionDemo />
            </ExampleBlock>

            {/* Tabindex Policy */}
            <KeyboardShortcutTable category={referencePatterns[2]} />

            {/* CSS Utilities */}
            <KeyboardShortcutTable category={referencePatterns[3]} />

            {/* Visually Hidden CSS */}
            <Card
              elevation={0}
              sx={{
                mt: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  CSS: .visually-hidden Class
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Use this utility class to hide content visually while keeping it accessible to screen readers:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    overflow: 'auto',
                  }}
                >
                  <pre style={{ margin: 0 }}>
                    {`.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}`}
                  </pre>
                </Paper>
              </CardContent>
            </Card>

            {/* Quick Reference Table */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Quick Reference: Common Shortcuts
            </Typography>
            <Paper
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)',
                  },
                  gap: 0,
                }}
              >
                {[
                  { keys: ['Tab'], desc: 'Move to next element' },
                  { keys: ['Shift', 'Tab'], desc: 'Move to previous element' },
                  { keys: ['Enter'], desc: 'Activate element' },
                  { keys: ['Space'], desc: 'Toggle/Select' },
                  { keys: ['Esc'], desc: 'Cancel/Close' },
                  { keys: ['↑', '↓'], desc: 'Navigate list/menu' },
                  { keys: ['←', '→'], desc: 'Navigate horizontally' },
                  { keys: ['Home'], desc: 'Go to first item' },
                  { keys: ['End'], desc: 'Go to last item' },
                  { keys: ['Ctrl', 'A'], desc: 'Select all' },
                  { keys: ['F2'], desc: 'Edit mode' },
                  { keys: ['Page Up', 'Page Down'], desc: 'Scroll page' },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: { xs: 1.5, sm: 2 },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      borderRight: { xs: 'none', sm: `1px solid ${theme.palette.divider}` },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      minHeight: 56,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <Box sx={{ minWidth: { xs: 80, sm: 100 } }}>
                      <KeyboardShortcut keys={item.keys} size="small" />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </TabPanel>
        </Container>
      </Box>
    </DocsLayout>
  );
}
