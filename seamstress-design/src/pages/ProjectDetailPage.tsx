import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  useTheme,
  alpha,
  Divider,
  Avatar,
  Skeleton,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccountTree as BranchIcon,
  MergeType as PRIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ArrowBack as BackIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenInNewIcon,
  Code as CodeIcon,
  Refresh as RefreshIcon,
  VerifiedUser as AuditIcon,
  ArrowUpward as AheadIcon,
  ArrowDownward as BehindIcon,
} from '@mui/icons-material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';
import {
  useGitHubBranches,
  useGitHubPullRequests,
  useIsGitHubConfigured,
  githubKeys,
} from '../hooks/useGitHub';
import { useLocalGitInfo } from '../hooks/useLocalGit';
import { useQueryClient } from '@tanstack/react-query';
import type { GitHubBranch, GitHubPullRequest } from '../services/github';

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

function StatusChip({ status }: { status: string }) {
  const colorMap: Record<string, 'success' | 'info' | 'warning' | 'error' | 'default'> = {
    clean: 'success',
    ahead: 'info',
    behind: 'warning',
    diverged: 'error',
    modified: 'warning',
  };
  const iconMap: Record<string, React.ReactNode> = {
    clean: <CheckIcon sx={{ fontSize: 16 }} />,
    ahead: <AheadIcon sx={{ fontSize: 16 }} />,
    behind: <BehindIcon sx={{ fontSize: 16 }} />,
    diverged: <ErrorIcon sx={{ fontSize: 16 }} />,
    modified: <WarningIcon sx={{ fontSize: 16 }} />,
  };

  return (
    <Chip
      icon={iconMap[status] as React.ReactElement | undefined}
      label={status}
      size="small"
      color={colorMap[status] ?? 'default'}
    />
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.5 }}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 160, flexShrink: 0, fontWeight: 500 }}>
        {label}
      </Typography>
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  );
}

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [copied, setCopied] = React.useState(false);

  const branchName = slug ? decodeURIComponent(slug) : '';
  const isGitHubConfigured = useIsGitHubConfigured();
  const { data: branches, isLoading: branchesLoading } = useGitHubBranches({ enabled: isGitHubConfigured });
  const { data: prs, isLoading: prsLoading } = useGitHubPullRequests('all', { enabled: isGitHubConfigured });
  const { data: localGitInfo } = useLocalGitInfo();

  const isLoading = branchesLoading || prsLoading;

  const branch: GitHubBranch | undefined = React.useMemo(
    () => branches?.find(b => b.name === branchName),
    [branches, branchName],
  );

  const associatedPRs: GitHubPullRequest[] = React.useMemo(
    () => prs?.filter(pr => pr.sourceBranch === branchName) ?? [],
    [prs, branchName],
  );

  const isCurrent = localGitInfo?.currentBranch === branchName;

  const handleCopyBranch = () => {
    navigator.clipboard.writeText(branchName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: githubKeys.all });
  };

  const repoUrl = `https://github.com/OpenGov/cds-assists`;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box component="header">
        <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
          <PageHeaderComposable.Header
            actions={[
              <Tooltip key="refresh" title="Refresh data">
                <IconButton onClick={handleRefresh} disabled={isLoading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>,
              <Button
                key="repo"
                variant="outlined"
                size="small"
                startIcon={<OpenInNewIcon />}
                component="a"
                href={`${repoUrl}/tree/${encodeURIComponent(branchName)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Button>,
            ]}
          >
            <PageHeaderComposable.Title>
              <Stack direction="row" spacing={1} alignItems="center">
                <IconButton size="small" onClick={() => navigate(-1)} sx={{ mr: 0.5 }}>
                  <BackIcon />
                </IconButton>
                <BranchIcon sx={{ color: 'text.secondary' }} />
                <span>{branchName || 'Project'}</span>
                {branch && <StatusChip status={branch.status} />}
                {isCurrent && <Chip label="current" size="small" color="primary" variant="outlined" />}
              </Stack>
            </PageHeaderComposable.Title>
          </PageHeaderComposable.Header>
        </PageHeaderComposable>
      </Box>

      <Box
        component="main"
        sx={{
          maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 4,
        }}
      >
        {isLoading ? (
          <Stack spacing={3}>
            {[1, 2, 3].map(i => (
              <Card key={i} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
                <CardContent>
                  <Skeleton width="30%" height={28} sx={{ mb: 2 }} />
                  <Skeleton width="80%" height={20} />
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="70%" height={20} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : !branch ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Branch &quot;{branchName}&quot; not found. It may not exist on the remote, or GitHub is not configured.
            Check your <code>.env.local</code> for <code>VITE_GITHUB_TOKEN</code>.
          </Alert>
        ) : (
          <Stack spacing={3}>
            {/* Branch Info */}
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Branch Information</Typography>
                <Divider sx={{ mb: 1 }} />
                <InfoRow label="Branch Name">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{branch.name}</Typography>
                    <Tooltip title={copied ? 'Copied!' : 'Copy branch name'}>
                      <IconButton size="small" onClick={handleCopyBranch}>
                        {copied ? <CheckIcon sx={{ fontSize: 16 }} color="success" /> : <CopyIcon sx={{ fontSize: 16 }} />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </InfoRow>
                <InfoRow label="Status">
                  <StatusChip status={branch.status} />
                </InfoRow>
                <InfoRow label="Default Branch">
                  <Chip label={branch.isDefault ? 'Yes' : 'No'} size="small" variant="outlined" />
                </InfoRow>
                <InfoRow label="Protected">
                  <Chip label={branch.protected ? 'Yes' : 'No'} size="small" variant="outlined" color={branch.protected ? 'warning' : 'default'} />
                </InfoRow>
                {(branch.aheadBy !== undefined || branch.behindBy !== undefined) && (
                  <InfoRow label="Sync Status">
                    <Stack direction="row" spacing={1}>
                      {branch.aheadBy !== undefined && branch.aheadBy > 0 && (
                        <Chip icon={<AheadIcon sx={{ fontSize: 14 }} />} label={`${branch.aheadBy} ahead`} size="small" color="info" variant="outlined" />
                      )}
                      {branch.behindBy !== undefined && branch.behindBy > 0 && (
                        <Chip icon={<BehindIcon sx={{ fontSize: 14 }} />} label={`${branch.behindBy} behind`} size="small" color="warning" variant="outlined" />
                      )}
                      {(!branch.aheadBy || branch.aheadBy === 0) && (!branch.behindBy || branch.behindBy === 0) && (
                        <Chip icon={<CheckIcon sx={{ fontSize: 14 }} />} label="Up to date" size="small" color="success" variant="outlined" />
                      )}
                    </Stack>
                  </InfoRow>
                )}
                <InfoRow label="Last Commit">
                  <Typography variant="body2">{branch.lastCommitMessage}</Typography>
                </InfoRow>
                <InfoRow label="Author">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, fontSize: 12, bgcolor: 'primary.main' }}>
                      {branch.lastCommitAuthor?.charAt(0)?.toUpperCase() || '?'}
                    </Avatar>
                    <Typography variant="body2">{branch.lastCommitAuthor}</Typography>
                  </Stack>
                </InfoRow>
                <InfoRow label="Last Updated">
                  <Typography variant="body2">{formatDate(branch.lastCommitDate)}</Typography>
                </InfoRow>
                <InfoRow label="SHA">
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{branch.sha?.slice(0, 12)}</Typography>
                </InfoRow>

                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Clone this branch:
                </Typography>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.text.primary, 0.04),
                    p: 1.5,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: 13,
                    overflow: 'auto',
                  }}
                >
                  git clone -b {branch.name} {repoUrl}.git
                </Box>
              </CardContent>
            </Card>

            {/* Pull Requests */}
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Pull Requests
                  {associatedPRs.length > 0 && (
                    <Chip label={associatedPRs.length} size="small" color="info" sx={{ ml: 1 }} />
                  )}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {associatedPRs.length === 0 ? (
                  <Box sx={{ py: 3, textAlign: 'center' }}>
                    <PRIcon sx={{ fontSize: 40, color: 'text.hint', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No pull requests for this branch.
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      component="a"
                      href={`${repoUrl}/compare/main...${encodeURIComponent(branch.name)}?expand=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={<OpenInNewIcon />}
                    >
                      Create Pull Request
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {associatedPRs.map(pr => {
                      const reviewColor = pr.reviewStatus === 'approved' ? 'success'
                        : pr.reviewStatus === 'changes_requested' ? 'error'
                        : 'warning';
                      const checksColor = pr.checksStatus === 'passing' ? 'success'
                        : pr.checksStatus === 'failing' ? 'error'
                        : 'warning';

                      return (
                        <Box
                          key={pr.id}
                          sx={{
                            p: 2,
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 1,
                            '&:hover': { borderColor: theme.palette.primary.main },
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <Chip
                              label={pr.status}
                              size="small"
                              color={pr.status === 'open' ? 'success' : pr.status === 'merged' ? 'info' : 'default'}
                            />
                            <Chip label={`Review: ${pr.reviewStatus}`} size="small" color={reviewColor} variant="outlined" />
                            <Chip label={`Checks: ${pr.checksStatus}`} size="small" color={checksColor} variant="outlined" />
                          </Stack>
                          <Typography variant="subtitle2">
                            #{pr.number} — {pr.title}
                          </Typography>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Avatar src={pr.authorAvatar} sx={{ width: 20, height: 20 }}>
                                {pr.author?.charAt(0)?.toUpperCase()}
                              </Avatar>
                              <Typography variant="caption" color="text.secondary">{pr.author}</Typography>
                            </Stack>
                            <Typography variant="caption" color="text.hint">{formatDate(pr.updatedAt)}</Typography>
                            {pr.labels.length > 0 && (
                              <Stack direction="row" spacing={0.5}>
                                {pr.labels.slice(0, 3).map(l => (
                                  <Chip key={l.name} label={l.name} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
                                ))}
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* Audit Status */}
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AuditIcon />
                    <span>Design Token Audit</span>
                  </Stack>
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Alert severity="info" variant="outlined">
                  Run <code>npm run audit</code> locally to check for hardcoded colors and design token violations.
                  Results will appear here when CI integration is active.
                </Alert>
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Chip icon={<AuditIcon />} label="Token Validation" size="small" color="info" variant="outlined" />
                  <Chip icon={<CodeIcon />} label="ESLint Design Rules" size="small" color="info" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    component="a"
                    href={`${repoUrl}/tree/${encodeURIComponent(branch.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Browse Code
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PRIcon />}
                    component="a"
                    href={`${repoUrl}/compare/main...${encodeURIComponent(branch.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Compare with main
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate('/repo/branches')}>
                    All Branches
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate('/repo/pull-requests')}>
                    All PRs
                  </Button>
                  <Button variant="outlined" size="small" onClick={() => navigate('/')}>
                    Back to Home
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default ProjectDetailPage;
