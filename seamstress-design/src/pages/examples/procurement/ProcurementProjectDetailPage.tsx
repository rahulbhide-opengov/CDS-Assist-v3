import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
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
import ListIcon from '@mui/icons-material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SettingsIcon from '@mui/icons-material/Settings';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PublicIcon from '@mui/icons-material/Public';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

// Type Definitions
type PhaseStatus = 'skipped' | 'not_started' | 'in_progress' | 'complete';
type ProjectStatus = 'draft' | 'sourcing' | 'evaluation' | 'awarded' | 'closed' | 'on_hold';
type ScorecardStatus = 'in_progress' | 'submitted' | 'returned';

interface Phase {
  key: 'project_request' | 'solicitation' | 'builder' | 'sourcing' | 'evaluations' | 'contract';
  label: string;
  status: PhaseStatus;
  started_at?: string;
  completed_at?: string;
}

interface Score {
  criterion_id: string;
  value: number;
  comment: string;
}

interface ConsensusScore {
  criterion_id: string;
  value: number;
  consensus_comment: string;
}

interface Scorecard {
  id: string;
  response_id: string;
  evaluator_id: string;
  evaluator_name: string;
  vendor_name: string;
  scores: Score[];
  submitted_at?: string;
  status: ScorecardStatus;
}

interface ConsensusScorecard {
  id: string;
  response_id: string;
  scores: ConsensusScore[];
  locked_at?: string;
  locked_by?: string;
}

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface EvaluatorAssignment {
  id: string;
  user_id: string;
  user_name: string;
  role: string;
}

interface ResponseRef {
  id: string;
  vendor_id: string;
  vendor_name: string;
}

interface Evaluation {
  id: string;
  criteria: Criterion[];
  evaluators: EvaluatorAssignment[];
  responses: ResponseRef[];
  scorecards: Scorecard[];
  consensus?: ConsensusScorecard;
  rank_method: 'weighted_sum' | 'custom';
  selected_vendor_id?: string;
  is_configured: boolean;
}

interface Award {
  id: string;
  vendor_id: string;
  vendor_name: string;
  amount: number;
  awarded_at: string;
}

interface Contract {
  id: string;
  vendor_id: string;
  vendor_name: string;
  project_id: string;
  status: 'draft' | 'active' | 'expired' | 'closed';
  value: number;
  start_date: string;
  end_date: string;
  title: string;
}

interface UserRef {
  id: string;
  name: string;
  email: string;
}

interface Notice {
  id: string;
  type: string;
  title: string;
  created_at: string;
}

interface Timeline {
  open_at: string;
  close_at: string;
  unseal_at: string;
}

interface Project {
  id: string;
  title: string;
  department: string;
  template_id: string;
  status: ProjectStatus;
  phases: Phase[];
  timeline: Timeline;
  collaborators: UserRef[];
  notices: Notice[];
  evaluation: Evaluation;
  award?: Award;
  contract?: Contract;
  followers_count: number;
}

interface Action {
  label: string;
  icon: React.ReactNode;
  color: 'primary' | 'success' | 'error' | 'warning' | 'info';
}

interface OtherAction {
  label: string;
  icon: React.ReactNode;
}

interface EvaluationTile {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  route: string;
}

// Helper Functions
function getEvaluationsNextAction(project: Project): Action {
  if (!project.evaluation.is_configured) {
    return { label: 'Complete Set-Up', icon: <CheckCircleIcon />, color: 'success' };
  }

  const allSubmitted = project.evaluation.scorecards.every(
    sc => sc.status === 'submitted'
  );

  if (allSubmitted && !project.evaluation.consensus) {
    return { label: 'Build Consensus Scorecard', icon: <GroupIcon />, color: 'success' };
  }

  if (project.evaluation.consensus?.locked_at && !project.award) {
    return { label: 'Select Vendor', icon: <EmojiEventsIcon />, color: 'success' };
  }

  return { label: 'Continue Evaluation', icon: <StarIcon />, color: 'success' };
}

function getEvaluationsOtherActions(): OtherAction[] {
  return [
    { label: 'Invite Collaborators', icon: <PeopleIcon /> },
    { label: 'Unseal Bids', icon: <LockOpenIcon /> },
    { label: 'Public Display Options', icon: <ListIcon /> },
    { label: 'Edit Timeline', icon: <CalendarTodayIcon /> },
    { label: 'Put On Hold', icon: <PauseCircleOutlineIcon /> },
    { label: 'Close Out Project', icon: <CheckCircleOutlineIcon /> },
    { label: 'Delete Evaluation', icon: <DeleteOutlineIcon /> },
  ];
}

function getContractNextAction(): Action {
  return { label: 'Add Contract Record', icon: <AddIcon />, color: 'success' };
}

function getContractOtherActions(): OtherAction[] {
  return [
    { label: 'View Contracts', icon: <ListIcon /> },
  ];
}

function getPhaseIcon(status: PhaseStatus): React.ReactNode {
  switch (status) {
    case 'complete':
      return <CheckCircleIcon color="success" />;
    case 'in_progress':
      return <SyncIcon color="info" />;
    case 'not_started':
      return <AccessTimeIcon color="disabled" />;
    case 'skipped':
      return <DoNotDisturbIcon color="disabled" />;
  }
}

function getPhaseStatusText(status: PhaseStatus): string {
  switch (status) {
    case 'complete':
      return 'Complete';
    case 'in_progress':
      return 'In Progress';
    case 'not_started':
      return 'Not Started';
    case 'skipped':
      return 'Skipped';
  }
}

// Mock Data
function getMockProject(): Project {
  return {
    id: 'proj-001',
    title: 'Agricultural Supplies',
    department: 'Parks Department, Buildings & Grounds',
    template_id: 'tmpl-evaluation',
    status: 'evaluation',
    phases: [
      {
        key: 'project_request',
        label: 'Project Request',
        status: 'skipped',
      },
      {
        key: 'solicitation',
        label: 'Solicitation',
        status: 'in_progress',
        started_at: '2024-06-03T14:30:00Z',
      },
      {
        key: 'builder',
        label: 'Builder',
        status: 'skipped',
      },
      {
        key: 'sourcing',
        label: 'Sourcing',
        status: 'skipped',
      },
      {
        key: 'evaluations',
        label: 'Evaluations',
        status: 'in_progress',
        started_at: '2024-09-20T17:00:00Z',
      },
      {
        key: 'contract',
        label: 'Contract',
        status: 'not_started',
      },
    ],
    timeline: {
      open_at: '2024-06-01T09:00:00Z',
      close_at: '2025-01-15T17:00:00Z',
      unseal_at: '2024-09-20T17:00:00Z',
    },
    collaborators: [
      { id: 'user-001', name: 'Chris Barnes', email: 'cbarnes@example.com' },
      { id: 'user-002', name: 'Jane Smith', email: 'jsmith@example.com' },
    ],
    notices: [
      { id: 'notice-001', type: 'addendum', title: 'Addendum #1', created_at: '2024-08-15T10:00:00Z' },
    ],
    evaluation: {
      id: 'eval-001',
      is_configured: true,
      criteria: [
        { id: 'crit-001', name: 'Price', weight: 40 },
        { id: 'crit-002', name: 'Quality', weight: 30 },
        { id: 'crit-003', name: 'Delivery Time', weight: 30 },
      ],
      evaluators: [
        { id: 'eval-001', user_id: 'user-003', user_name: 'Robert Johnson', role: 'Lead Evaluator' },
        { id: 'eval-002', user_id: 'user-004', user_name: 'Sarah Williams', role: 'Evaluator' },
      ],
      responses: [
        { id: 'resp-001', vendor_id: 'vend-001', vendor_name: 'Green Valley Supplies' },
        { id: 'resp-002', vendor_id: 'vend-002', vendor_name: 'Premier Agricultural Co.' },
        { id: 'resp-003', vendor_id: 'vend-003', vendor_name: 'Farm Direct Solutions' },
      ],
      scorecards: [
        {
          id: 'sc-001',
          response_id: 'resp-001',
          evaluator_id: 'user-003',
          evaluator_name: 'Robert Johnson',
          vendor_name: 'Green Valley Supplies',
          status: 'submitted',
          submitted_at: '2024-10-05T14:30:00Z',
          scores: [
            { criterion_id: 'crit-001', value: 85, comment: 'Competitive pricing' },
            { criterion_id: 'crit-002', value: 90, comment: 'Excellent quality samples' },
            { criterion_id: 'crit-003', value: 75, comment: 'Standard delivery time' },
          ],
        },
        {
          id: 'sc-002',
          response_id: 'resp-002',
          evaluator_id: 'user-003',
          evaluator_name: 'Robert Johnson',
          vendor_name: 'Premier Agricultural Co.',
          status: 'submitted',
          submitted_at: '2024-10-05T15:00:00Z',
          scores: [
            { criterion_id: 'crit-001', value: 75, comment: 'Higher price point' },
            { criterion_id: 'crit-002', value: 95, comment: 'Outstanding quality' },
            { criterion_id: 'crit-003', value: 85, comment: 'Fast delivery commitment' },
          ],
        },
        {
          id: 'sc-003',
          response_id: 'resp-001',
          evaluator_id: 'user-004',
          evaluator_name: 'Sarah Williams',
          vendor_name: 'Green Valley Supplies',
          status: 'submitted',
          submitted_at: '2024-10-06T09:15:00Z',
          scores: [
            { criterion_id: 'crit-001', value: 88, comment: 'Good value' },
            { criterion_id: 'crit-002', value: 85, comment: 'Good quality' },
            { criterion_id: 'crit-003', value: 80, comment: 'Acceptable delivery' },
          ],
        },
        {
          id: 'sc-004',
          response_id: 'resp-002',
          evaluator_id: 'user-004',
          evaluator_name: 'Sarah Williams',
          vendor_name: 'Premier Agricultural Co.',
          status: 'in_progress',
          scores: [],
        },
      ],
      rank_method: 'weighted_sum',
    },
    followers_count: 5,
  };
}

// Evaluation Tiles Configuration
const evaluationTiles: EvaluationTile[] = [
  {
    id: 'edit-evaluation',
    label: 'Edit Evaluation',
    icon: <EditIcon />,
    description: 'Configure criteria and settings',
    route: '/evaluation/edit',
  },
  {
    id: 'view-evaluation',
    label: 'View Evaluation',
    icon: <VisibilityIcon />,
    description: 'Review evaluation setup',
    route: '/evaluation/view',
  },
  {
    id: 'manage-responses',
    label: 'Manage Responses',
    icon: <ListIcon />,
    description: 'View and organize submissions',
    route: '/evaluation/responses',
  },
  {
    id: 'manage-notices',
    label: 'Manage Notices',
    icon: <NotificationsIcon />,
    description: 'Send notifications to vendors',
    route: '/evaluation/notices',
  },
  {
    id: 'evaluators-admin',
    label: 'Evaluators Admin',
    icon: <PeopleIcon />,
    description: 'Assign and manage evaluators',
    route: '/evaluation/evaluators',
  },
  {
    id: 'score-responses',
    label: 'Score Responses',
    icon: <StarIcon />,
    description: 'Enter evaluation scores',
    route: '/evaluation/score',
  },
  {
    id: 'review-scorecards',
    label: 'Review All Scorecards',
    icon: <DescriptionIcon />,
    description: 'View submitted scorecards',
    route: '/evaluation/scorecards',
  },
  {
    id: 'consensus-scorecard',
    label: 'Consensus Scorecard',
    icon: <GroupIcon />,
    description: 'Build team consensus',
    route: '/evaluation/consensus',
  },
  {
    id: 'select-vendor',
    label: 'Selected Vendor',
    icon: <EmojiEventsIcon />,
    description: 'Choose winning vendor',
    route: '/evaluation/select-vendor',
  },
];

// Main Component
const ProcurementProjectDetailPage: React.FC = () => {
  const { project_title } = useParams<{ project_title: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPhase, setExpandedPhase] = useState<string>('evaluations');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockProject = getMockProject();
        setProject(mockProject);
        setError(null);
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [project_title]);

  const handlePhaseChange = (phaseKey: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPhase(isExpanded ? phaseKey : '');
  };

  const handleTileClick = (route: string) => {
    console.log('Navigate to:', route);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading) {
    return (
      <Stack justifyContent="center" alignItems="center" minHeight="calc(100vh - 64px)">
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !project) {
    return (
      <Box padding={3}>
        <Alert severity="error">{error || 'Project not found'}</Alert>
      </Box>
    );
  }

  const evaluationsNextAction = getEvaluationsNextAction(project);
  const evaluationsOtherActions = getEvaluationsOtherActions();
  const contractNextAction = getContractNextAction();
  const contractOtherActions = getContractOtherActions();

  return (
    <Box display="flex" flexDirection="column" bgcolor="background.default">
        {/* Page Header */}
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Stack key="actions" direction="row" spacing={1}>
                <Button variant="outlined" startIcon={<DescriptionIcon />}>
                  Reports
                </Button>
                <Button
                  variant="outlined"
                  startIcon={isFollowing ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
              </Stack>
            ]}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <PageHeaderComposable.Title>
                  {project.title}
                </PageHeaderComposable.Title>
                <Chip
                  label={project.template_id === 'tmpl-evaluation' ? 'EVALUATION' : 'BID'}
                  color="secondary"
                  size="small"
                />
                <Chip
                  label={project.status.toUpperCase()}
                  color="success"
                  size="small"
                />
                <Link
                  href="#"
                  display="flex"
                  alignItems="center"
                  gap={0.5}
                  color="primary.main"
                  underline="hover"
                  variant="body2"
                >
                  <HistoryIcon fontSize="small" />
                  Status History
                </Link>
              </Stack>
              <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
                <Typography variant="body2" color="text.secondary">
                  Department: {project.department}
                </Typography>
                {isFollowing && (
                  <Typography variant="body2" color="text.secondary">
                    {project.followers_count} followers
                  </Typography>
                )}
              </Stack>
            </Stack>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>

        {/* Main Content */}
        <Box flex={1} overflow="auto" padding={3}>
          <Stack spacing={3}>
            {/* Phase Accordion */}
            {project.phases.filter(p => ['project_request', 'solicitation', 'contract'].includes(p.key)).map((phase) => (
              <Accordion
                key={phase.key}
                expanded={expandedPhase === phase.key}
                onChange={handlePhaseChange(phase.key)}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Stack direction="row" alignItems="center" spacing={2} width="100%">
                    {getPhaseIcon(phase.status)}
                    <Box flex={1}>
                      <Typography variant="h6">{phase.label}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getPhaseStatusText(phase.status)}
                        {phase.started_at && ` • Started ${new Date(phase.started_at).toLocaleDateString()}`}
                        {phase.completed_at && ` • Completed ${new Date(phase.completed_at).toLocaleDateString()}`}
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Solicitation Phase - Contains nested sub-phases */}
                  {phase.key === 'solicitation' && (
                    <Stack spacing={2}>
                      {/* Builder Sub-Phase */}
                      {project.phases.filter(p => p.key === 'builder').map((subPhase) => (
                        <Accordion key={subPhase.key}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" alignItems="center" spacing={2} width="100%">
                              {getPhaseIcon(subPhase.status)}
                              <Box flex={1}>
                                <Typography variant="subtitle1">{subPhase.label}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {getPhaseStatusText(subPhase.status)}
                                </Typography>
                              </Box>
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box display="flex" justifyContent="center" padding={4}>
                              <Typography variant="body1" fontStyle="italic" color="text.secondary">
                                Builder phase was skipped
                              </Typography>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}

                      {/* Sourcing Sub-Phase */}
                      {project.phases.filter(p => p.key === 'sourcing').map((subPhase) => (
                        <Accordion key={subPhase.key}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" alignItems="center" spacing={2} width="100%">
                              {getPhaseIcon(subPhase.status)}
                              <Box flex={1}>
                                <Typography variant="subtitle1">{subPhase.label}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {getPhaseStatusText(subPhase.status)}
                                </Typography>
                              </Box>
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box display="flex" justifyContent="center" padding={4}>
                              <Typography variant="body1" fontStyle="italic" color="text.secondary">
                                Sourcing phase was skipped
                              </Typography>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}

                      {/* Evaluations Sub-Phase */}
                      {project.phases.filter(p => p.key === 'evaluations').map((subPhase) => (
                        <Accordion key={subPhase.key} defaultExpanded>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Stack direction="row" alignItems="center" spacing={2} width="100%">
                              {getPhaseIcon(subPhase.status)}
                              <Box flex={1}>
                                <Typography variant="subtitle1">{subPhase.label}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {getPhaseStatusText(subPhase.status)}
                                  {subPhase.started_at && ` • Started ${new Date(subPhase.started_at).toLocaleDateString()}`}
                                </Typography>
                              </Box>
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box display="flex" gap={3}>
                              {/* Left: Main Content */}
                              <Box flex={1}>
                                {/* Evaluation Tools */}
                                <Typography variant="h6" gutterBottom>
                                  Evaluation Tools
                                </Typography>
                                <Grid container spacing={2} marginBottom={3}>
                                  {evaluationTiles.map((tile) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tile.id}>
                                      <Card
                                        variant="outlined"
                                        onClick={() => handleTileClick(tile.route)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleTileClick(tile.route);
                                          }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        aria-label={`${tile.label}${tile.description ? `: ${tile.description}` : ''}. Press Enter to open.`}
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
                                            <Box color="primary.main" display="flex">
                                              {tile.icon}
                                            </Box>
                                            <Typography variant="body2" fontWeight={500}>
                                              {tile.label}
                                            </Typography>
                                          </Stack>
                                          {tile.description && (
                                            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                                              {tile.description}
                                            </Typography>
                                          )}
                                        </CardContent>
                                      </Card>
                                    </Grid>
                                  ))}
                                </Grid>

                                {/* Evaluation Progress Stats */}
                                <Paper elevation={0}>
                                  <Box padding={2}>
                                    <Typography variant="subtitle2" gutterBottom>
                                      Evaluation Progress
                                    </Typography>
                                    <Stack direction="row" spacing={4} marginTop={2}>
                                      <Box>
                                        <Typography variant="body2" color="text.secondary">
                                          Responses Received
                                        </Typography>
                                        <Typography variant="h6">
                                          {project.evaluation.responses.length}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography variant="body2" color="text.secondary">
                                          Scorecards Submitted
                                        </Typography>
                                        <Typography variant="h6">
                                          {project.evaluation.scorecards.filter(sc => sc.status === 'submitted').length} / {project.evaluation.scorecards.length}
                                        </Typography>
                                      </Box>
                                      <Box>
                                        <Typography variant="body2" color="text.secondary">
                                          Evaluators Assigned
                                        </Typography>
                                        <Typography variant="h6">
                                          {project.evaluation.evaluators.length}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </Box>
                                </Paper>
                              </Box>

                              {/* Right: Next Action Sidebar */}
                              <Box width={300} flexShrink={0}>
                                <Stack spacing={2}>
                                  {/* Next Action Card */}
                                  <Paper elevation={0}>
                                    <Box padding={2}>
                                      <Typography variant="overline" color="text.secondary" gutterBottom display="block">
                                        Next Action:
                                      </Typography>
                                      <Button
                                        variant="contained"
                                        color={evaluationsNextAction.color}
                                        fullWidth
                                        startIcon={evaluationsNextAction.icon}
                                      >
                                        {evaluationsNextAction.label}
                                      </Button>
                                    </Box>
                                  </Paper>

                                  {/* Other Actions Card */}
                                  <Paper elevation={0}>
                                    <Box padding={2}>
                                      <Typography variant="overline" color="text.secondary" gutterBottom display="block">
                                        Other Actions:
                                      </Typography>
                                      <List dense disablePadding>
                                        {evaluationsOtherActions.map((action, index) => (
                                          <ListItem key={index} disablePadding>
                                            <ListItemButton>
                                              <ListItemIcon sx={{ minWidth: 40 }}>
                                                {action.icon}
                                              </ListItemIcon>
                                              <ListItemText primary={action.label} />
                                            </ListItemButton>
                                          </ListItem>
                                        ))}
                                      </List>
                                    </Box>
                                  </Paper>
                                </Stack>
                              </Box>
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Stack>
                  )}

                  {/* Project Request Phase */}
                  {phase.key === 'project_request' && (
                    <Box display="flex" justifyContent="center" padding={4}>
                      <Typography variant="body1" fontStyle="italic" color="text.secondary">
                        Project request phase content
                      </Typography>
                    </Box>
                  )}

                  {/* Contract Phase */}
                  {phase.key === 'contract' && (
                    <Box display="flex" gap={3}>
                      {/* Left: Main Content */}
                      <Box flex={1}>
                        {project.contract ? (
                          <Card variant="outlined">
                            <CardContent>
                              <Stack spacing={1}>
                                <Typography variant="subtitle2">{project.contract.title}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Vendor: {project.contract.vendor_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Value: ${project.contract.value.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Status: {project.contract.status.toUpperCase()}
                                </Typography>
                              </Stack>
                            </CardContent>
                          </Card>
                        ) : (
                          <Box display="flex" justifyContent="center" padding={4}>
                            <Typography variant="body1" fontStyle="italic" color="text.secondary">
                              No contracts have been added yet
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Right: Next Action Sidebar */}
                      <Box width={300} flexShrink={0}>
                        <Stack spacing={2}>
                          {/* Next Action Card */}
                          <Paper elevation={0}>
                            <Box padding={2}>
                              <Typography variant="overline" color="text.secondary" gutterBottom display="block">
                                Next Action:
                              </Typography>
                              <Button
                                variant="contained"
                                color={contractNextAction.color}
                                fullWidth
                                startIcon={contractNextAction.icon}
                              >
                                {contractNextAction.label}
                              </Button>
                            </Box>
                          </Paper>

                          {/* Other Actions Card */}
                          <Paper elevation={0}>
                            <Box padding={2}>
                              <Typography variant="overline" color="text.secondary" gutterBottom display="block">
                                Other Actions:
                              </Typography>
                              <List dense disablePadding>
                                {contractOtherActions.map((action, index) => (
                                  <ListItem key={index} disablePadding>
                                    <ListItemButton>
                                      <ListItemIcon sx={{ minWidth: 40 }}>
                                        {action.icon}
                                      </ListItemIcon>
                                      <ListItemText primary={action.label} />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </Box>
                          </Paper>
                        </Stack>
                      </Box>
                    </Box>
                  )}

                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      </Box>
  );
};

export default ProcurementProjectDetailPage;
