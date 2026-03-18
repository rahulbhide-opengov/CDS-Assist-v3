import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Button,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DocumentationIcon,
  Science as LabsIcon,
  AutoAwesome as SeamstressIcon,
  SmartToy as AgentStudioIcon,
  Build as BuildIcon,
  Hub as CommandCenterIcon,
  Public as PublicIcon,
  AccountBalance as FinanceIcon,
  Engineering as PermittingIcon,
  Business as ProcurementIcon,
  ElectricalServices as UtilityIcon,
  Palette as ThemeIcon,
  Animation as AnimationIcon,
  MenuBook as GuideIcon,
  Code as CodeIcon,
  Category as ComponentsIcon,
  Lightbulb as ConceptsIcon,
  RocketLaunch as QuickStartIcon,
  School as SkillsIcon,
  AssignmentTurnedIn as PermitAppIcon,
  Campaign as MarketingIcon,
} from '@mui/icons-material';
import { RepoStatsBar } from '../components/dashboard';
import CurrentBranchBanner from '../components/CurrentBranchBanner';
import {
  useGitHubBranches,
  useGitHubRepoStatus,
  useGitHubPullRequests,
  useIsGitHubConfigured,
} from '../hooks/useGitHub';
import { useLocalGitInfo, useGitWorktrees } from '../hooks/useLocalGit';
import { useQueryClient } from '@tanstack/react-query';
import { githubKeys } from '../hooks/useGitHub';

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  badge?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  icon,
  href,
  color = 'primary',
  badge,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid ${theme.palette.divider}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          borderColor: theme.palette[color].main,
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(href)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          p: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: alpha(theme.palette[color].main, 0.1),
              color: `${color}.main`,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          {badge && (
            <Chip
              label={badge}
              size="small"
              color={color}
              sx={{ ml: 'auto' }}
            />
          )}
        </Box>
        <Typography variant="h6" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default function HomePage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if GitHub is configured
  const isGitHubConfigured = useIsGitHubConfigured();

  // Fetch GitHub data
  const { data: githubBranches, isLoading: branchesLoading } = useGitHubBranches({
    enabled: isGitHubConfigured,
  });
  const { data: githubRepoStatus, isLoading: statusLoading } = useGitHubRepoStatus({
    enabled: isGitHubConfigured,
  });
  const { data: githubPRs, isLoading: prsLoading } = useGitHubPullRequests('open', {
    enabled: isGitHubConfigured,
  });

  // Fetch local git info for current branch
  const { data: localGitInfo } = useLocalGitInfo();
  const { data: worktrees } = useGitWorktrees();

  const isLoading = branchesLoading || statusLoading || prsLoading;

  // Get current branch data from GitHub (for ahead/behind info)
  const currentBranchGitHub = React.useMemo(() => {
    if (!githubBranches || !localGitInfo?.currentBranch) return null;
    return githubBranches.find((b) => b.name === localGitInfo.currentBranch);
  }, [githubBranches, localGitInfo?.currentBranch]);

  // Derive status from local git info (prioritize local state)
  const currentBranchStatus = React.useMemo(() => {
    // If we have uncommitted changes, status is 'modified'
    if (localGitInfo && !localGitInfo.isClean) {
      return 'modified' as const;
    }
    // Otherwise use GitHub status if available
    if (currentBranchGitHub?.status) {
      return currentBranchGitHub.status;
    }
    // Default to clean if local is clean
    if (localGitInfo?.isClean) {
      return 'clean' as const;
    }
    return 'unknown' as const;
  }, [localGitInfo, currentBranchGitHub]);

  // Calculate branch statistics
  const branchStats = React.useMemo(() => {
    if (!githubBranches) {
      return { total: 0, clean: 0, ahead: 0, behind: 0, diverged: 0, unknown: 0 };
    }
    const clean = githubBranches.filter((b) => b.status === 'clean').length;
    const ahead = githubBranches.filter((b) => b.status === 'ahead').length;
    const behind = githubBranches.filter((b) => b.status === 'behind').length;
    const diverged = githubBranches.filter((b) => b.status === 'diverged').length;
    // Count unknown/modified as unknown for display purposes
    const unknown = githubBranches.length - clean - ahead - behind - diverged;
    return {
      total: githubBranches.length,
      clean,
      ahead,
      behind,
      diverged,
      unknown,
    };
  }, [githubBranches]);

  // Calculate PR statistics
  const prStats = React.useMemo(() => {
    if (!githubPRs) {
      return { open: 0, needsReview: 0, readyToMerge: 0 };
    }
    return {
      open: githubPRs.length,
      needsReview: githubPRs.filter(
        (pr) => pr.reviewStatus === 'pending' || pr.reviewStatus === 'review_required'
      ).length,
      readyToMerge: githubPRs.filter(
        (pr) => pr.reviewStatus === 'approved' && pr.checksStatus === 'passing'
      ).length,
    };
  }, [githubPRs]);

  // Top branches snapshot
  const topBranches = React.useMemo(() => {
    if (!githubBranches) return [];
    return githubBranches.slice(0, 6).map((b) => ({
      name: b.name,
      status: b.status ?? 'unknown',
      ahead: b.aheadBy ?? 0,
      behind: b.behindBy ?? 0,
    }));
  }, [githubBranches]);

  // Local worktree history snapshot
  const worktreeHistory = React.useMemo(() => {
    if (!worktrees) return [];
    return worktrees.slice(0, 6).map((wt) => ({
      branch: wt.branch,
      path: wt.path,
      commit: wt.commit,
      lastAccessed: wt.lastAccessed,
      isMain: wt.isMain,
    }));
  }, [worktrees]);

  // Handle refresh
  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: githubKeys.all });
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 12,
        }}
      >
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 900,
                fontSize: { xs: '3rem', md: '4.5rem' },
                letterSpacing: '-0.03em',
                mb: 2,
              }}
            >
              Prototypes
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ mb: 4, maxWidth: '800px', mx: 'auto', fontSize: '1.125rem' }}
            >
              Explore prototypes, documentation, experimental features, and AI-powered component
              generation for the CDS Design System
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                startIcon={<QuickStartIcon />}
                onClick={() => navigate('/seamstress/getting-started')}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<DocumentationIcon />}
                onClick={() => navigate('/docs/overview')}
              >
                View Documentation
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<DashboardIcon />}
                onClick={() => navigate('/prototypes')}
              >
                Browse Prototypes
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Git Status Section */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
          Repository Status
        </Typography>
        <CurrentBranchBanner
          branchName={localGitInfo?.currentBranch}
          status={currentBranchStatus}
          aheadBy={currentBranchGitHub?.aheadBy}
          behindBy={currentBranchGitHub?.behindBy}
          isClean={localGitInfo?.isClean}
          uncommittedChanges={localGitInfo?.uncommittedChanges}
          loading={!localGitInfo}
          worktreeCount={worktrees?.length}
          onWorktreesClick={() => navigate('/repo/worktrees')}
        />
        <RepoStatsBar
          totalBranches={branchStats.total}
          branchesAhead={branchStats.ahead}
          branchesBehind={branchStats.behind}
          branchesDiverged={branchStats.diverged}
          branchesClean={branchStats.clean}
          branchesUnknown={branchStats.unknown}
          openPRs={prStats.open}
          prsNeedingReview={prStats.needsReview}
          prsReadyToMerge={prStats.readyToMerge}
          repoName={githubRepoStatus?.repoName}
          defaultBranch={githubRepoStatus?.defaultBranch}
          loading={isLoading}
          onRefresh={handleRefresh}
        />
      </Container>

      {/* Branch & Project History */}
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" component="h2" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
          Branch & Project History
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Branches (top 6)
                </Typography>
                <List dense>
                  {topBranches.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No branches available (configure GitHub token)" />
                    </ListItem>
                  )}
                  {topBranches.map((b) => (
                    <React.Fragment key={b.name}>
                      <ListItem
                        secondaryAction={
                          <Chip
                            label={b.status}
                            size="small"
                            color={
                              b.status === 'clean'
                                ? 'success'
                                : b.status === 'ahead'
                                ? 'info'
                                : b.status === 'behind'
                                ? 'warning'
                                : b.status === 'diverged'
                                ? 'error'
                                : 'default'
                            }
                            variant="outlined"
                          />
                        }
                      >
                        <ListItemText
                          primary={b.name}
                          secondary={`↑ ${b.ahead} / ↓ ${b.behind}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Local Worktrees (projects)
                </Typography>
                <List dense>
                  {worktreeHistory.length === 0 && (
                    <ListItem>
                      <ListItemText primary="No worktrees detected" />
                    </ListItem>
                  )}
                  {worktreeHistory.map((wt) => (
                    <React.Fragment key={`${wt.path}-${wt.branch}`}>
                      <ListItem
                        secondaryAction={
                          wt.isMain ? (
                            <Chip label="main" size="small" color="primary" variant="outlined" />
                          ) : (
                            <Chip label="worktree" size="small" variant="outlined" />
                          )
                        }
                      >
                        <ListItemText
                          primary={wt.branch}
                          secondary={`${wt.path}${wt.lastAccessed ? ` — accessed ${wt.lastAccessed}` : ''}`}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Seamstress Guides - Featured First */}
          <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.info.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      mr: 2,
                    }}
                  >
                    <SeamstressIcon fontSize="large" />
                  </Box>
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                  CDS Guides
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  AI-powered Figma-to-React code generation
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/seamstress')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Overview →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/seamstress/getting-started')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Getting Started →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/seamstress/skills-reference')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Skills Reference →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/seamstress/building-from-figma')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Building from Figma →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Public Service Platform */}
          <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      mr: 2,
                    }}
                  >
                    <DashboardIcon fontSize="large" />
                  </Box>
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Public Service Platform
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Platform prototypes for citizen-facing and internal services
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/agent-studio/dashboard')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Agent Studio →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/app-builder/dashboard')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    App Builder →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/utility-billing/home')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Utility Billing →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/permitting/dashboard')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Permitting →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/procurement/dashboard')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Procurement →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Documentation */}
          <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.success.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: 'success.main',
                      mr: 2,
                    }}
                  >
                    <DocumentationIcon fontSize="large" />
                  </Box>
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight={600}>
                  Documentation
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Design system guidelines and best practices
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/docs/overview')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Overview →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/docs/theme-system')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Theme System →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/docs/layout-rules')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Layout Rules →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/docs/component-patterns')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Component Patterns →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Labs */}
          <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.warning.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: 'warning.main',
                      mr: 2,
                    }}
                  >
                    <LabsIcon fontSize="large" />
                  </Box>
                  <Chip label="Experiments" size="small" color="warning" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Labs
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Experimental features and design explorations
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/labs')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    All Experiments →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/labs/ai-animations')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    AI Animations →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/seamstress/theme-editor')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Theme Editor →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Public Portal */}
          <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.secondary.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: 'secondary.main',
                      mr: 2,
                    }}
                  >
                    <PublicIcon fontSize="large" />
                  </Box>
                  <Chip label="Prototype" size="small" color="secondary" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Public Portal
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Unified citizen-facing portal for residents and businesses with multi-city support.
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/unified-portal')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Dashboard →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/unified-portal/permits')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Permits & Licenses →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/unified-portal/utilities')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Utilities →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/unified-portal/taxes')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Taxes & Payments →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Marketing */}
          <Grid sx={{ flex: '1 1 400px', minWidth: '400px' }}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8],
                  borderColor: theme.palette.info.main,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 1,
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: 'info.main',
                      mr: 2,
                    }}
                  >
                    <MarketingIcon fontSize="large" />
                  </Box>
                  <Chip label="Prototypes" size="small" color="info" />
                </Box>
                <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                  Marketing
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Marketing site templates with mega-nav, product pages, and brand components.
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/marketing')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Marketing Home →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/marketing/products/erp')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    ERP Product Page →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/marketing/platform/agent-studio')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Agent Studio →
                  </Button>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate('/marketing/products/permitting')}
                    sx={{ justifyContent: 'flex-start' }}
                  >
                    Permitting & Licensing →
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Call to Action Footer */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          py: 8,
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Ready to Build?
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Start exploring prototypes, dive into documentation, or experiment with the theme editor
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                },
              }}
              onClick={() => navigate('/seamstress/getting-started')}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: alpha(theme.palette.common.white, 0.1),
                },
              }}
              onClick={() => navigate('/prototypes')}
            >
              Explore All Prototypes
            </Button>
          </Stack>
        </Container>
      </Box>

    </Box>
  );
}
