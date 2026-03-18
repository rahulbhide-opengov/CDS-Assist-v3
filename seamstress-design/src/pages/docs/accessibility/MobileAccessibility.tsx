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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TouchApp as TouchAppIcon,
  PhoneAndroid as PhoneAndroidIcon,
  Accessible as AccessibleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  ZoomIn as ZoomInIcon,
  ScreenRotation as ScreenRotationIcon,
  RecordVoiceOver as VoiceOverIcon,
  Gesture as GestureIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { DocsLayout } from '../../../components/DocsLayout';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

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
      id={`mobile-tabpanel-${index}`}
      aria-labelledby={`mobile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `mobile-tab-${index}`,
    'aria-controls': `mobile-tabpanel-${index}`,
  };
}

interface GuidelineItemProps {
  type: 'do' | 'dont';
  text: string;
  context?: string;
}

function GuidelineItem({ type, text, context }: GuidelineItemProps) {
  const isDo = type === 'do';

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography variant="body2">
        {isDo ? '✓' : '✗'} {text}
      </Typography>
      {context && (
        <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
          {context}
        </Typography>
      )}
    </Box>
  );
}

interface GuidelineCardProps {
  items: GuidelineItemProps[];
  type: 'do' | 'dont';
  title: string;
}

function GuidelineCard({ items, type, title }: GuidelineCardProps) {
  const theme = useTheme();
  const isDo = type === 'do';
  const colorPalette = isDo ? theme.palette.success : theme.palette.error;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: `1px solid ${colorPalette.main}`,
        bgcolor: alpha(colorPalette.main, 0.05),
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        {isDo ? (
          <CheckIcon sx={{ color: colorPalette.main }} />
        ) : (
          <CancelIcon sx={{ color: colorPalette.main }} />
        )}
        <Typography variant="h6" sx={{ color: colorPalette.main, fontWeight: 600 }}>
          {title}
        </Typography>
      </Stack>
      <Stack spacing={1}>
        {items.map((item, index) => (
          <GuidelineItem key={index} {...item} />
        ))}
      </Stack>
    </Paper>
  );
}

export default function MobileAccessibility() {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  useDocumentTitle('Mobile Accessibility');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const touchTargetDos: GuidelineItemProps[] = [
    { type: 'do', text: 'Use minimum 44×44px touch targets for all interactive elements', context: 'WCAG 2.5.5 Target Size' },
    { type: 'do', text: 'Provide at least 8px spacing between adjacent touch targets', context: 'Prevents accidental taps' },
    { type: 'do', text: 'Make touch targets larger than visual elements when needed', context: 'Use padding to increase tap area' },
    { type: 'do', text: 'Test with actual fingers, not just mouse cursor', context: 'Finger tips are ~10mm wide' },
  ];

  const touchTargetDonts: GuidelineItemProps[] = [
    { type: 'dont', text: 'Use touch targets smaller than 24×24px, even for icons', context: 'Too small for reliable touch input' },
    { type: 'dont', text: 'Place interactive elements within 8px of each other', context: 'Causes accidental activations' },
    { type: 'dont', text: 'Rely solely on hover states for important interactions', context: 'Touch devices have no hover' },
    { type: 'dont', text: 'Use inline links in dense text without adequate spacing', context: 'Hard to tap accurately' },
  ];

  const zoomDos: GuidelineItemProps[] = [
    { type: 'do', text: 'Support zoom up to 200% without loss of content or functionality', context: 'WCAG 1.4.4 Resize Text' },
    { type: 'do', text: 'Use relative units (rem, em, %) for typography and spacing', context: 'Scales with user preferences' },
    { type: 'do', text: 'Test layouts at 200% and 400% zoom levels', context: 'Catches overflow issues early' },
    { type: 'do', text: 'Allow pinch-to-zoom gestures in web views', context: 'Never disable user zooming' },
  ];

  const zoomDonts: GuidelineItemProps[] = [
    { type: 'dont', text: 'Use maximum-scale=1.0 in viewport meta tag', context: 'Prevents users from zooming' },
    { type: 'dont', text: 'Set fixed pixel values for container widths', context: 'Causes horizontal scroll at zoom' },
    { type: 'dont', text: 'Truncate text without providing full content access', context: 'Zoomed users lose information' },
    { type: 'dont', text: 'Assume text will fit in fixed-height containers', context: 'Zoomed text will overflow' },
  ];

  return (
    <DocsLayout maxContentWidth="none">
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        {/* Hero Section */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.1)} 50%, ${alpha(theme.palette.info.main, 0.1)} 100%)`,
            borderBottom: `1px solid ${theme.palette.divider}`,
            pt: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
              <PhoneAndroidIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              <Typography variant="h1" component="h1">
                Mobile Accessibility
              </Typography>
            </Stack>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 700 }}>
              Guidelines for designing accessible mobile experiences. These patterns ensure all users
              can interact with our applications on touchscreen devices, including those using
              assistive technologies like screen readers and switch control.
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
              <Chip label="Touch Optimized" color="primary" />
              <Chip label="Screen Reader Compatible" color="secondary" />
              <Chip label="Responsive Design" />
            </Stack>

            {/* Quick Stats */}
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
                Mobile Accessibility Quick Reference
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2, 1fr)',
                    sm: 'repeat(4, 1fr)',
                  },
                  gap: { xs: 2, sm: 3 },
                  mt: 2,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main" fontWeight={700}>
                    44px
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Minimum touch target
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary.main" fontWeight={700}>
                    8px
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Target spacing
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" fontWeight={700}>
                    200%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Zoom support
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="info.main" fontWeight={700}>
                    320px
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Minimum viewport
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Tab Navigation */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="Mobile accessibility sections"
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
              <Tab label="Touch Targets" {...a11yProps(0)} />
              <Tab label="Responsive Design" {...a11yProps(1)} />
              <Tab label="Screen Readers" {...a11yProps(2)} />
              <Tab label="Testing" {...a11yProps(3)} />
            </Tabs>
          </Container>
        </Box>

        {/* Tab Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>

          {/* Tab 1: Touch Targets */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Touch Target Requirements
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Touch targets must be large enough for users to accurately tap, including those with
              motor impairments or limited dexterity. The WCAG 2.5.5 Target Size criterion recommends
              a minimum of 44×44 CSS pixels.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <strong>Key Principle:</strong> The average adult fingertip is about 10mm (38px) wide.
              Using 44px touch targets provides a comfortable margin for error.
            </Alert>

            {/* Touch Target Sizes Table */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Recommended Touch Target Sizes
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 4,
                overflowX: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.background.secondary }}>
                    <TableCell sx={{ fontWeight: 600 }}>Element Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Minimum Size</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Recommended Size</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Buttons</TableCell>
                    <TableCell>44 × 44px</TableCell>
                    <TableCell>48 × 48px</TableCell>
                    <TableCell>Primary interactive elements</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Icon Buttons</TableCell>
                    <TableCell>44 × 44px</TableCell>
                    <TableCell>48 × 48px</TableCell>
                    <TableCell>Include padding around icon</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Form Inputs</TableCell>
                    <TableCell>44px height</TableCell>
                    <TableCell>48px height</TableCell>
                    <TableCell>Full width recommended</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Checkboxes/Radios</TableCell>
                    <TableCell>44 × 44px</TableCell>
                    <TableCell>48 × 48px</TableCell>
                    <TableCell>Include label in tap area</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Links in Text</TableCell>
                    <TableCell>44px height</TableCell>
                    <TableCell>Adequate line height</TableCell>
                    <TableCell>Avoid dense inline links</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Small Buttons</TableCell>
                    <TableCell>36 × 36px</TableCell>
                    <TableCell>44 × 44px</TableCell>
                    <TableCell>Only with adequate spacing</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Target Spacing */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Touch Target Spacing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Adjacent interactive elements need sufficient spacing to prevent accidental activations.
              WCAG 2.5.8 recommends at least 8px between targets, with 24px being ideal.
            </Typography>

            <Card
              elevation={0}
              sx={{
                mb: 4,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.info.main, 0.05),
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <GestureIcon color="info" />
                  <Typography variant="h6" fontWeight={600}>
                    Spacing Guidelines
                  </Typography>
                </Stack>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="8px minimum"
                      secondary="Absolute minimum between touch targets"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="16px recommended"
                      secondary="Standard spacing for button groups"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="24px ideal"
                      secondary="Best practice for critical actions"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Touch Target Guidelines
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard items={touchTargetDos} type="do" title="Do" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard items={touchTargetDonts} type="dont" title="Don't" />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2: Responsive Design */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Responsive Design for Accessibility
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Responsive design isn't just about fitting content on different screens—it's essential
              for accessibility. Users with low vision rely on zoom functionality, and content must
              reflow properly at various magnification levels.
            </Typography>

            <Alert severity="warning" sx={{ mb: 4 }}>
              <strong>WCAG 1.4.10 Reflow:</strong> Content must be presentable without horizontal scrolling
              at 320px width (equivalent to 400% zoom on a 1280px desktop viewport).
            </Alert>

            {/* Zoom Support */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Zoom Support Requirements
            </Typography>
            <Card
              elevation={0}
              sx={{
                mb: 4,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <ZoomInIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    Zoom Levels to Test
                  </Typography>
                </Stack>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Zoom Level</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Equivalent Width</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Requirement</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>100%</TableCell>
                        <TableCell>1280px</TableCell>
                        <TableCell>Full functionality</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>200%</TableCell>
                        <TableCell>640px</TableCell>
                        <TableCell>WCAG 1.4.4 - Required</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>300%</TableCell>
                        <TableCell>427px</TableCell>
                        <TableCell>Recommended</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>400%</TableCell>
                        <TableCell>320px</TableCell>
                        <TableCell>WCAG 1.4.10 - Required</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>

            {/* Orientation Support */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Orientation Support
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Applications must not lock orientation unless essential. Some users mount devices
              in fixed positions or have mobility limitations that require specific orientations.
            </Typography>

            <Card
              elevation={0}
              sx={{
                mb: 4,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.success.main, 0.05),
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <ScreenRotationIcon color="success" />
                  <Typography variant="h6" fontWeight={600}>
                    WCAG 1.3.4 Orientation
                  </Typography>
                </Stack>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Support both portrait and landscape"
                      secondary="Content should adapt to both orientations"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Never force a specific orientation"
                      secondary="Unless essential (e.g., piano app, check deposit)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Provide alternative layouts when needed"
                      secondary="Complex tables may need horizontal scroll indicators"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* Viewport Meta */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Viewport Configuration
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 4,
                bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Recommended viewport meta tag:
              </Typography>
              <code>{`<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`}</code>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                <strong>Never use:</strong> maximum-scale=1.0, user-scalable=no
              </Typography>
            </Paper>

            {/* Guidelines */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Zoom & Reflow Guidelines
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard items={zoomDos} type="do" title="Do" />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <GuidelineCard items={zoomDonts} type="dont" title="Don't" />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Screen Readers */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Mobile Screen Reader Patterns
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Mobile screen readers (VoiceOver on iOS, TalkBack on Android) have unique interaction
              patterns that differ from desktop screen readers. Understanding these patterns is
              essential for accessible mobile development.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <strong>Key Difference:</strong> Mobile screen reader users explore by touch, swiping
              between elements rather than using a keyboard. Focus management and reading order are
              critical.
            </Alert>

            {/* VoiceOver Gestures */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              VoiceOver (iOS) Common Gestures
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 4,
                overflowX: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.background.secondary }}>
                    <TableCell sx={{ fontWeight: 600 }}>Gesture</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Design Consideration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Swipe Right</TableCell>
                    <TableCell>Move to next element</TableCell>
                    <TableCell>Logical reading order required</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Swipe Left</TableCell>
                    <TableCell>Move to previous element</TableCell>
                    <TableCell>Focus must be visible</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Double Tap</TableCell>
                    <TableCell>Activate element</TableCell>
                    <TableCell>All actions via double tap</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Two-finger Swipe Up</TableCell>
                    <TableCell>Read all from top</TableCell>
                    <TableCell>Page structure matters</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Two-finger Scrub (Z)</TableCell>
                    <TableCell>Go back / Dismiss</TableCell>
                    <TableCell>Support dismissal patterns</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Triple Tap</TableCell>
                    <TableCell>Double tap (on double-tap actions)</TableCell>
                    <TableCell>Avoid triple-tap requirements</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* TalkBack Gestures */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              TalkBack (Android) Common Gestures
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 4,
                overflowX: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.background.secondary }}>
                    <TableCell sx={{ fontWeight: 600 }}>Gesture</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Design Consideration</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Swipe Right</TableCell>
                    <TableCell>Move to next element</TableCell>
                    <TableCell>Same as VoiceOver</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Swipe Left</TableCell>
                    <TableCell>Move to previous element</TableCell>
                    <TableCell>Same as VoiceOver</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Double Tap</TableCell>
                    <TableCell>Activate element</TableCell>
                    <TableCell>Same as VoiceOver</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Swipe Down then Right</TableCell>
                    <TableCell>Next navigation setting</TableCell>
                    <TableCell>Provide semantic structure</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Swipe Up then Right</TableCell>
                    <TableCell>Custom actions menu</TableCell>
                    <TableCell>Support accessibilityActions</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Voice Control */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Voice Control Considerations
            </Typography>
            <Card
              elevation={0}
              sx={{
                mb: 4,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: alpha(theme.palette.warning.main, 0.05),
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <VoiceOverIcon color="warning" />
                  <Typography variant="h6" fontWeight={600}>
                    Voice Control (iOS) / Voice Access (Android)
                  </Typography>
                </Stack>
                <Typography variant="body2" paragraph>
                  Users who cannot touch the screen may use voice commands to interact with apps.
                  This requires:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Visible labels on all interactive elements"
                      secondary="Voice users say 'Tap [label]' to activate"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Accessible names matching visible labels"
                      secondary="aria-label should match visible text when possible"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Unique, descriptive labels"
                      secondary="Multiple 'Submit' buttons are ambiguous"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText
                      primary="Support for 'Show numbers' overlay"
                      secondary="All interactive elements must be numbered"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {/* ARIA Considerations */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Mobile-Specific ARIA Considerations
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <List>
                <ListItem>
                  <ListItemIcon><AccessibleIcon color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="aria-live regions work differently"
                    secondary="Mobile screen readers may not interrupt for polite announcements"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AccessibleIcon color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Focus management is critical"
                    secondary="After dynamic updates, move focus to new content"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AccessibleIcon color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Rotor/navigation settings matter"
                    secondary="Use proper heading levels and landmarks"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><AccessibleIcon color="primary" /></ListItemIcon>
                  <ListItemText
                    primary="Custom gestures need alternatives"
                    secondary="Swipe-to-delete needs a button alternative"
                  />
                </ListItem>
              </List>
            </Paper>
          </TabPanel>

          {/* Tab 4: Testing */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Mobile Accessibility Testing
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              Testing mobile accessibility requires a combination of automated tools, manual testing,
              and real device testing with assistive technologies.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <strong>Best Practice:</strong> Test with real devices when possible. Emulators don't
              fully replicate screen reader behavior or touch interaction patterns.
            </Alert>

            {/* Testing Checklist */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Mobile Testing Checklist
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <TouchAppIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>
                        Touch & Interaction
                      </Typography>
                    </Stack>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="All touch targets are at least 44×44px" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Adjacent targets have 8px+ spacing" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="No hover-only interactions" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Gesture alternatives provided" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Double-tap to zoom doesn't interfere" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <ZoomInIcon color="secondary" />
                      <Typography variant="h6" fontWeight={600}>
                        Zoom & Reflow
                      </Typography>
                    </Stack>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Content works at 200% zoom" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="No horizontal scroll at 320px" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Pinch-to-zoom is not disabled" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Text scales with system settings" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Both orientations supported" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <VoiceOverIcon color="success" />
                      <Typography variant="h6" fontWeight={600}>
                        Screen Reader (iOS)
                      </Typography>
                    </Stack>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="VoiceOver can reach all content" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Reading order is logical" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Buttons announce names and roles" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Forms announce labels and errors" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Dynamic content is announced" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                      <PhoneAndroidIcon color="info" />
                      <Typography variant="h6" fontWeight={600}>
                        Screen Reader (Android)
                      </Typography>
                    </Stack>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="TalkBack can reach all content" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Custom actions work correctly" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Explore by touch is functional" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Back button dismisses overlays" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Live regions announce updates" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Testing Tools */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Recommended Testing Tools
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflowX: 'auto',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.background.secondary }}>
                    <TableCell sx={{ fontWeight: 600 }}>Tool</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Platform</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Best For</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Chrome DevTools Device Mode</TableCell>
                    <TableCell>Desktop (Emulation)</TableCell>
                    <TableCell>Responsive design, viewport testing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Lighthouse Mobile Audit</TableCell>
                    <TableCell>Chrome</TableCell>
                    <TableCell>Automated accessibility checks</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>axe DevTools</TableCell>
                    <TableCell>Browser Extension</TableCell>
                    <TableCell>Comprehensive a11y testing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>VoiceOver</TableCell>
                    <TableCell>iOS (Real Device)</TableCell>
                    <TableCell>Screen reader testing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>TalkBack</TableCell>
                    <TableCell>Android (Real Device)</TableCell>
                    <TableCell>Screen reader testing</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Accessibility Inspector</TableCell>
                    <TableCell>iOS Simulator</TableCell>
                    <TableCell>Accessibility tree inspection</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            {/* Quick Tests */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 6, mb: 3 }}>
              Quick Manual Tests
            </Typography>
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                  <VisibilityIcon color="primary" />
                  <Typography variant="h6" fontWeight={600}>
                    5-Minute Mobile Accessibility Check
                  </Typography>
                </Stack>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="1. Pinch to zoom"
                      secondary="Can you zoom to 200%? Does content reflow without horizontal scroll?"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="2. Rotate device"
                      secondary="Does the app work in both portrait and landscape?"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="3. Tap test"
                      secondary="Can you tap all buttons/links accurately? Any mis-taps on adjacent elements?"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="4. Enable VoiceOver/TalkBack"
                      secondary="Swipe through the page. Is everything announced? Can you complete key tasks?"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="5. Increase text size"
                      secondary="In Settings → Accessibility → Larger Text. Does the app respect this?"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </TabPanel>
        </Container>
      </Box>
    </DocsLayout>
  );
}
