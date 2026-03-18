/**
 * ProjectManagePage Component
 *
 * Displays project lifecycle with accordion-based phases and action tiles
 *
 * Accessibility features:
 * - Proper accordion keyboard navigation
 * - ARIA attributes for expandable sections
 * - Focus management for phase transitions
 * - Screen reader announcements for status changes
 *
 * Mobile responsiveness:
 * - Stacked layouts on smaller screens
 * - Responsive action tile grids
 * - Touch-friendly interactive elements
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import SyncIcon from '@mui/icons-material/Sync';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ListAltIcon from '@mui/icons-material/ListAlt';

import type { Project, LifecyclePhase, LifecyclePhaseStatus } from '../../../types/procurement';
import { mockProjects } from '../../../data/procurementProjectMockData';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

/**
 * Get phase status icon
 */
const getPhaseIcon = (status: LifecyclePhaseStatus) => {
  switch (status) {
    case 'complete':
      return <CheckCircleIcon sx={{ color: 'success.main' }} />;
    case 'in_progress':
      return <SyncIcon sx={{ color: 'info.main', animation: 'spin 2s linear infinite',
        '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } }
      }} />;
    case 'not_started':
      return <AccessTimeIcon sx={{ color: 'text.secondary' }} />;
    case 'skipped':
      return <DoNotDisturbIcon sx={{ color: 'text.disabled' }} />;
    default:
      return <AccessTimeIcon sx={{ color: 'text.secondary' }} />;
  }
};

/**
 * Get phase status text
 */
const getPhaseStatusText = (status: LifecyclePhaseStatus): string => {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in_progress':
      return 'In Progress';
    case 'not_started':
      return 'Not Started';
    case 'skipped':
      return 'Skipped';
    default:
      return status;
  }
};

/**
 * Get phase label
 */
const getPhaseLabel = (phase: string): string => {
  const labels: Record<string, string> = {
    request: 'Project Request',
    solicitation: 'Solicitation',
    builder: 'Builder',
    sourcing: 'Sourcing',
    evaluations: 'Evaluations',
    contract: 'Contract',
  };
  return labels[phase] || phase;
};

/**
 * Project Manage Page
 */
const ProjectManagePage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Refs for focus management
  const statusAnnouncerRef = useRef<HTMLDivElement>(null);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string>('builder');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingMenuAnchor, setFollowingMenuAnchor] = useState<null | HTMLElement>(null);

  // Announce status changes to screen readers
  const announceStatus = useCallback((message: string) => {
    if (statusAnnouncerRef.current) {
      statusAnnouncerRef.current.textContent = message;
    }
  }, []);

  // Load project
  useEffect(() => {
    const loadProject = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        // Find project from mock data
        const foundProject = mockProjects.find(p => p.projectId === projectId);
        if (foundProject) {
          setProject(foundProject);
          setError(null);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handlePhaseChange = (phaseId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPhase(isExpanded ? phaseId : '');
  };

  const handleFollowClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isFollowing) {
      setFollowingMenuAnchor(event.currentTarget);
    } else {
      setIsFollowing(true);
    }
  };

  const handleFollowMenuClose = () => {
    setFollowingMenuAnchor(null);
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    setFollowingMenuAnchor(null);
  };

  const handleActionClick = (actionLabel: string) => {
    // Handle navigation for specific actions
    if (actionLabel === 'Edit Document' || actionLabel === 'View Document') {
      // Get the first document for this project
      if (project && project.documents.length > 0) {
        const firstDocument = project.documents[0];
        navigate(`/procurement/projects/${project.projectId}/documents/${firstDocument.documentId}`);
      }
    } else {
      console.log('Action clicked:', actionLabel);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
        role="status"
        aria-label="Loading project details"
      >
        <CircularProgress aria-label="Loading" />
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" role="alert">
          {error || 'Project not found'}
        </Alert>
      </Box>
    );
  }

  // Separate main phases and sub-phases
  const mainPhases = project.lifecycle.filter(p => !p.subPhases);
  const solicitationPhase = project.lifecycle.find(p => p.phase === 'solicitation');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Screen reader announcements */}
      <Box
        ref={statusAnnouncerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />

      {/* Page Header */}
      <Box component="header" role="banner">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="reports"
              variant="outlined"
              size="medium"
              startIcon={<DescriptionIcon aria-hidden="true" />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Reports
            </Button>,
            <>
              <Button
                key="follow"
                variant="outlined"
                size="medium"
                startIcon={isFollowing ? <FavoriteIcon aria-hidden="true" /> : <FavoriteBorderIcon aria-hidden="true" />}
                endIcon={isFollowing ? <KeyboardArrowDownIcon aria-hidden="true" /> : undefined}
                onClick={handleFollowClick}
                aria-expanded={isFollowing && Boolean(followingMenuAnchor)}
                aria-haspopup={isFollowing ? 'menu' : undefined}
                aria-label={isFollowing ? 'Following, click to manage' : 'Follow this project'}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Menu
                anchorEl={followingMenuAnchor}
                open={Boolean(followingMenuAnchor)}
                onClose={handleFollowMenuClose}
                aria-label="Follow options"
              >
                <MenuItem onClick={handleUnfollow}>Unfollow</MenuItem>
              </Menu>
            </>,
          ]}
        >
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
              <PageHeaderComposable.Title>
                {project.title}
              </PageHeaderComposable.Title>
              <Chip
                label={project.status}
                color="primary"
                size="small"
                variant="filled"
              />
              <Chip
                label={project.template.type}
                color="secondary"
                size="small"
                variant="outlined"
              />
              {project.isEmergency && (
                <Chip
                  label="Emergency"
                  color="error"
                  size="small"
                  variant="outlined"
                />
              )}
              <Link
                href="#"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Show status history');
                }}
              >
                <HistoryIcon fontSize="small" />
                <Typography variant="body2">Status History</Typography>
              </Link>
              {project.requests.length > 0 && (
                <Link
                  href="#"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: 'primary.main',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Add request');
                  }}
                >
                  <AddIcon fontSize="small" />
                  <Typography variant="body2">Add Request</Typography>
                </Link>
              )}
            </Stack>
            <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
              <Typography variant="body2" color="text.secondary">
                {project.department.name}
              </Typography>
              {isFollowing && (
                <Typography variant="body2" color="text.secondary">
                  {project.followers.length} followers
                </Typography>
              )}
            </Stack>
          </Stack>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      </Box>

      {/* Main Content */}
      <Box
        component="main"
        role="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 2, sm: 3 },
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Stack spacing={2} component="section" aria-label="Project lifecycle phases">
          {/* Request Phase */}
          {project.lifecycle.filter(p => p.phase === 'request').map((phase) => (
            <Accordion
              key={phase.phaseId}
              expanded={expandedPhase === phase.phaseId}
              onChange={handlePhaseChange(phase.phaseId)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={2} width="100%">
                  {getPhaseIcon(phase.status)}
                  <Box flex={1}>
                    <Typography variant="h6">{getPhaseLabel(phase.phase)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getPhaseStatusText(phase.status)}
                      {phase.startedAt && ` • Started ${new Date(phase.startedAt).toLocaleDateString()}`}
                      {phase.completedAt && ` • Completed ${new Date(phase.completedAt).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography variant="body1" fontStyle="italic" color="text.secondary">
                    {phase.status === 'skipped' ? 'Request phase was skipped' : 'Request phase details'}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* Solicitation Phase (with nested sub-phases) */}
          {solicitationPhase && (
            <Accordion
              key={solicitationPhase.phaseId}
              expanded={expandedPhase === solicitationPhase.phaseId}
              onChange={handlePhaseChange(solicitationPhase.phaseId)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={2} width="100%">
                  {getPhaseIcon(solicitationPhase.status)}
                  <Box flex={1}>
                    <Typography variant="h6">{getPhaseLabel(solicitationPhase.phase)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getPhaseStatusText(solicitationPhase.status)}
                      {solicitationPhase.startedAt && ` • Started ${new Date(solicitationPhase.startedAt).toLocaleDateString()}`}
                      {solicitationPhase.completedAt && ` • Completed ${new Date(solicitationPhase.completedAt).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {/* Sub-phases (Builder, Sourcing, Evaluations) */}
                  {project.lifecycle.filter(p => ['builder', 'sourcing', 'evaluations'].includes(p.phase)).map((subPhase) => (
                    <Accordion key={subPhase.phaseId} defaultExpanded={subPhase.phase === 'builder'}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Stack direction="row" alignItems="center" spacing={2} width="100%">
                          {getPhaseIcon(subPhase.status)}
                          <Box flex={1}>
                            <Typography variant="subtitle1">{getPhaseLabel(subPhase.phase)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {getPhaseStatusText(subPhase.status)}
                              {subPhase.startedAt && ` • Started ${new Date(subPhase.startedAt).toLocaleDateString()}`}
                            </Typography>
                          </Box>
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        {subPhase.status === 'skipped' ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <Typography variant="body1" fontStyle="italic" color="text.secondary">
                              {getPhaseLabel(subPhase.phase)} phase was skipped
                            </Typography>
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', lg: 'row' },
                              gap: 3,
                            }}
                          >
                            {/* Left: Main Content (Action Tiles) */}
                            <Box flex={1}>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="h4"
                                id={`${subPhase.phaseId}-actions-heading`}
                              >
                                {getPhaseLabel(subPhase.phase)} Actions
                              </Typography>
                              <Box
                                sx={{
                                  display: 'grid',
                                  gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                  },
                                  gap: 2,
                                }}
                                role="list"
                                aria-labelledby={`${subPhase.phaseId}-actions-heading`}
                              >
                                {subPhase.actions.map((action) => (
                                  <Card
                                    key={action.actionId}
                                    variant="outlined"
                                    onClick={() => handleActionClick(action.label)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleActionClick(action.label);
                                      }
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`${action.label}${action.description ? `: ${action.description}` : ''}. Press Enter to activate.`}
                                    sx={{
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      '&:hover, &:focus': {
                                        boxShadow: 4,
                                        transform: 'translateY(-2px)',
                                      },
                                      '&:focus': {
                                        outline: `2px solid ${theme.palette.primary.main}`,
                                        outlineOffset: 2,
                                      },
                                    }}
                                  >
                                    <CardContent>
                                      <Stack direction="row" alignItems="center" spacing={1.5}>
                                        <Box sx={{ color: 'primary.main', display: 'flex' }}>
                                          {action.icon === 'edit' && <EditIcon />}
                                          {action.icon === 'view' && <VisibilityIcon />}
                                          {action.icon === 'list' && <ListAltIcon />}
                                          {action.icon === 'people' && <PeopleIcon />}
                                          {action.icon === 'public' && <PublicIcon />}
                                          {action.icon === 'description' && <DescriptionIcon />}
                                          {!action.icon && <DescriptionIcon />}
                                        </Box>
                                        <Typography variant="body2" fontWeight={500}>
                                          {action.label}
                                        </Typography>
                                      </Stack>
                                      {action.description && (
                                        <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                          {action.description}
                                        </Typography>
                                      )}
                                    </CardContent>
                                  </Card>
                                ))}
                              </Box>
                            </Box>

                            {/* Right: Next Action Sidebar */}
                            <Box
                              sx={{
                                width: { xs: '100%', lg: 300 },
                                flexShrink: 0,
                              }}
                              component="aside"
                              aria-label="Quick actions"
                            >
                              <Stack spacing={2}>
                                {/* Next Action Card */}
                                {subPhase.nextAction && (
                                  <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                                    <Box sx={{ p: 2 }}>
                                      <Typography
                                        variant="overline"
                                        color="text.secondary"
                                        gutterBottom
                                        display="block"
                                        id={`${subPhase.phaseId}-next-action`}
                                      >
                                        Next Action:
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        color={subPhase.nextAction.color}
                                        fullWidth
                                        onClick={subPhase.nextAction.onClick}
                                        aria-describedby={`${subPhase.phaseId}-next-action`}
                                      >
                                        {subPhase.nextAction.label}
                                      </Button>
                                    </Box>
                                  </Paper>
                                )}

                                {/* Other Actions Card */}
                                {subPhase.otherActions && subPhase.otherActions.length > 0 && (
                                  <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                                    <Box sx={{ p: 2 }}>
                                      <Typography variant="overline" color="text.secondary" gutterBottom display="block">
                                        Other Actions:
                                      </Typography>
                                      <List dense disablePadding>
                                        {subPhase.otherActions.map((action, index) => (
                                          <ListItem key={index} disablePadding>
                                            <ListItemButton onClick={action.onClick}>
                                              <ListItemIcon sx={{ minWidth: 40 }}>
                                                {action.icon === 'edit' && <EditIcon />}
                                                {action.icon === 'view' && <VisibilityIcon />}
                                                {action.icon === 'list' && <ListAltIcon />}
                                                {action.icon === 'people' && <PeopleIcon />}
                                                {action.icon === 'public' && <PublicIcon />}
                                                {action.icon === 'description' && <DescriptionIcon />}
                                                {!action.icon && <DescriptionIcon />}
                                              </ListItemIcon>
                                              <ListItemText primary={action.label} />
                                            </ListItemButton>
                                          </ListItem>
                                        ))}
                                      </List>
                                    </Box>
                                  </Paper>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                        )}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Contract Phase */}
          {project.lifecycle.filter(p => p.phase === 'contract').map((phase) => (
            <Accordion
              key={phase.phaseId}
              expanded={expandedPhase === phase.phaseId}
              onChange={handlePhaseChange(phase.phaseId)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" alignItems="center" spacing={2} width="100%">
                  {getPhaseIcon(phase.status)}
                  <Box flex={1}>
                    <Typography variant="h6">{getPhaseLabel(phase.phase)}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getPhaseStatusText(phase.status)}
                      {phase.startedAt && ` • Started ${new Date(phase.startedAt).toLocaleDateString()}`}
                      {phase.completedAt && ` • Completed ${new Date(phase.completedAt).toLocaleDateString()}`}
                    </Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <Typography variant="body1" fontStyle="italic" color="text.secondary">
                    {phase.status === 'not_started' ? 'Contract phase has not started yet' : 'Contract phase details'}
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default ProjectManagePage;
