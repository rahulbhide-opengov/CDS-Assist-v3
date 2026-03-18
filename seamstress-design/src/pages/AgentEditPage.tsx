import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  Chip,
  IconButton,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Drawer as MuiDrawer,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme
} from '@mui/material';
import TiptapEditor from '../components/TiptapEditor';
import Drawer from '../components/Drawer/Drawer';
import { Toolbar } from '../components/Toolbar';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { useNavigate, useParams } from 'react-router-dom';
import { pageStyles } from '../theme/pageStyles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const AgentEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // State variables
  const [hasChanges, setHasChanges] = useState(false);
  const [publishingStatus, setPublishingStatus] = useState<'draft' | 'published'>('draft');
  const [agentName, setAgentName] = useState('OG Helper');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skillsSearchQuery, setSkillsSearchQuery] = useState('');
  const [persona, setPersona] = useState(`OG Helper is an internal AI-powered assistant built to help OpenGov employees quickly find accurate answers to process-related questions by referencing content from designated Confluence spaces. Whether you're navigating SDLC workflows, planning rituals, Jira practices, or cross-functional handoffs, OG Helper ensures consistent understanding of "how things work at OG."

Purpose:
OG Helper reduces time spent searching for information by surfacing the right content at the right time—from trusted sources like the R&D Hub, Product Ops space, PM Enablement pages, Engineering Playbooks, and more. It's especially helpful for new team members, squad leads, or anyone involved in product development, operations, or go-to-market planning.

Personality:
  • Helpful & pragmatic – It gets straight to the point but stays approachable.
  • Process-savvy – It speaks the language of OKRs, Epics, Tiers, and Reviews.
  • Team-oriented – Think of it as the teammate who always knows where the doc is.

What It Can Do:
  • Answer questions like:
  • "What's the process for a Tier 1 launch?"
  • "Where's the SDLC checklist?"
  • "Who owns sprint notes?"
  • Reference the most relevant Confluence pages.
  • Suggest templates or artifacts required at specific process stages.
  • Clarify roles, timelines, and ownership expectations.

Use It When You Need To:
  • Ramp up on R&D and Product Ops workflows.
  • Prep for planning, reviews, or launches.
  • Help others follow the right path with confidence.`);

  const [originalAgent, setOriginalAgent] = useState({
    agentName: 'OG Helper',
    persona: persona,
    publishingStatus: 'draft' as const
  });

  // Check for unsaved changes
  React.useEffect(() => {
    const changed =
      agentName !== originalAgent.agentName ||
      persona !== originalAgent.persona ||
      publishingStatus !== originalAgent.publishingStatus;
    setHasChanges(changed);
  }, [agentName, persona, publishingStatus, originalAgent]);

  const handleSave = async () => {
    // Save logic here
    setOriginalAgent({ agentName, persona, publishingStatus });
    setHasChanges(false);
  };

  const handleDelete = async () => {
    // Delete logic here
    setDeleteDialogOpen(false);
    navigate('/agents');
  };

  return (
    <Box sx={pageStyles.formView.pageContainer}>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Stack key="user-info" direction="row" alignItems="center" spacing={1.5}>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Last updated: Mar 15, 2024
              </Typography>
              <Avatar>
                JD
              </Avatar>
            </Stack>
          ]}
        >
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              {
                path: '/agents',
                title: 'Agents',
                onClick: (e: React.MouseEvent) => {
                  e.preventDefault();
                  navigate('/agents');
                }
              },
              { title: agentName || 'OG Helper' }
            ]}
          />
          <PageHeaderComposable.Title
            status={{
              label: publishingStatus === 'published' ? 'Published' : 'Draft',
              color: publishingStatus === 'published' ? 'success' : 'default'
            }}
          >
            {agentName || 'OG Helper'}
          </PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Main Container */}
      <Box sx={pageStyles.formView.mainContainer}>
        {/* Content Area */}
        <Box sx={pageStyles.formView.contentArea}>
          {/* Form Section */}

          {/* Skills Toolbar */}
          <Toolbar level="level2">
            <Toolbar.Section grow>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Skills:
                </Typography>
                <Chip
                  label="OG Knowledge Base"
                  size="small"
                />
              </Stack>
            </Toolbar.Section>
            <Toolbar.Section>
              <Button
                size="small"
                onClick={() => setDrawerOpen(!drawerOpen)}
              >
                Manage Skills
              </Button>
            </Toolbar.Section>
          </Toolbar>

          <Box sx={pageStyles.formView.formSection}>

            {/* Agent Name Field */}
            <Box>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'text.primary',
                  mb: 1
                }}
              >
                Agent Name
              </Typography>
              <TextField
                fullWidth
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Enter agent name"
                variant="outlined"
                size="medi"
              />
            </Box>

            {/* Persona/Description Field */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'text.primary',
                  mb: 1
                }}
              >
                Persona / Description
              </Typography>
              <TiptapEditor
                value={persona}
                onChange={(value) => {
                  setPersona(value);
                  setHasChanges(true);
                }}
                placeholder="Enter agent persona and description..."
                minHeight={250}
              />
            </Box>

            {/* Action Buttons Bar */}
            <Box sx={pageStyles.formView.actionBar}>
              <Button
                startIcon={<DeleteOutlineIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                color="error"
              >
                Delete Agent
              </Button>

              <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 'auto' }}>
                <ToggleButtonGroup
                  value={publishingStatus}
                  exclusive
                  onChange={(e, newStatus) => newStatus && setPublishingStatus(newStatus)}
                  size="small"
                >
                  <ToggleButton value="draft">Draft</ToggleButton>
                  <ToggleButton value="published">Published</ToggleButton>
                </ToggleButtonGroup>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!hasChanges || !agentName || !persona}
                >
                  Save Changes
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>

        {/* Skills Drawer - Desktop */}
        {!isMobile && (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Skills"
            subtitle="Add skills to extend your agent's capabilities"
            width={400}
            inPage={true}
            hideFooter={true}
          >
            <Box>
              <TextField
                fullWidth
                size="medium"
                placeholder="Search skills..."
                value={skillsSearchQuery}
                onChange={(e) => setSkillsSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5
                    }}
                  >
                    OG Knowledge Base
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '13px',
                      color: 'text.secondary',
                      lineHeight: '18px',
                      mb: 1.5
                    }}
                  >
                    A skill for retrieving knowledge about the Open Gov Platform.
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      variant="outlined"
                    >
                      Add
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Drawer>
        )}

        {/* Mobile Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen && isMobile}
          onClose={() => setDrawerOpen(false)}
          title="Skills"
          subtitle="Add skills to extend your agent's capabilities"
          width="100%"
          inPage={false}
          hideFooter={true}
        >
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search skills..."
              value={skillsSearchQuery}
              onChange={(e) => setSkillsSearchQuery(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Stack spacing={1} sx={{ mt: 2 }}>
              <Box
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2
                }}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 0.5
                  }}
                >
                  OG Knowledge Base
                </Typography>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: 'text.secondary',
                    lineHeight: '18px',
                    mb: 1.5
                  }}
                >
                  A skill for retrieving knowledge about the Open Gov Platform.
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    variant="outlined"
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Drawer>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Agent</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{agentName}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentEditPage;