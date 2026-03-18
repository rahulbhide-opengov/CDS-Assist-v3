import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  InputAdornment,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
  Drawer as MuiDrawer
} from '@mui/material';
import TiptapEditor from '../components/TiptapEditor';
import Drawer from '../components/Drawer/Drawer';
import { Toolbar } from '../components/Toolbar';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { pageStyles } from '../theme/pageStyles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
}

const mockTools: Tool[] = [
  {
    id: '1',
    slug: 'searchCategoryCodes',
    name: '@searchCategoryCodes',
    description: 'Search for NIGP, NAICS, and UNSPSC category codes'
  },
  {
    id: '2',
    slug: 'calculateBudget',
    name: '@calculateBudget',
    description: 'Calculate budget forecasts and projections'
  },
  {
    id: '3',
    slug: 'generateReport',
    name: '@generateReport',
    description: 'Generate comprehensive reports with visualizations'
  },
  {
    id: '4',
    slug: 'validateCompliance',
    name: '@validateCompliance',
    description: 'Validate compliance with regulatory requirements'
  }
];

const SkillEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isNewSkill = id === 'new';

  const [loading, setLoading] = useState(!isNewSkill);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Skill fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishingStatus, setPublishingStatus] = useState<'draft' | 'published'>('draft');
  const [originalSkill, setOriginalSkill] = useState({ title: '', content: '', publishingStatus: 'draft' as const });

  // Tools drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toolsSearchQuery, setToolsSearchQuery] = useState('');
  const [mentionedTools, setMentionedTools] = useState<string[]>([]);



  useEffect(() => {
    if (!isNewSkill) {
      // Simulate loading existing skill
      const loadSkill = async () => {
        setLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          const mockSkill = {
            title: 'Building Code Lookup',
            content: 'Use @knowledge/residential-building-code to answer questions about local building codes, permit requirements, and construction regulations. Always cite specific code sections and provide clear explanations.',
            publishingStatus: 'draft' as const
          };
          setTitle(mockSkill.title);
          setContent(mockSkill.content);
          setPublishingStatus(mockSkill.publishingStatus);
          setOriginalSkill(mockSkill);
          // Extract mentioned tools (@toolName)
          const toolMentions = mockSkill.content.match(/@(?!knowledge\/)\w+/g) || [];
          setMentionedTools(toolMentions.map(m => m.substring(1)));
        } catch (err) {
          setError('Failed to load skill');
        } finally {
          setLoading(false);
        }
      };
      loadSkill();
    }
  }, [isNewSkill]);

  useEffect(() => {
    // Check if there are unsaved changes
    const changed =
      title !== originalSkill.title ||
      content !== originalSkill.content ||
      publishingStatus !== originalSkill.publishingStatus;
    setHasChanges(changed);
  }, [title, content, publishingStatus, originalSkill]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOriginalSkill({ title, content, publishingStatus });
      setHasChanges(false);
      // Show success message or navigate
      if (isNewSkill) {
        navigate('/demo/skills');
      }
    } catch (err) {
      setError('Failed to save skill');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/demo/skills');
    } catch (err) {
      setError('Failed to delete skill');
    }
    setDeleteDialogOpen(false);
  };

  const handleToolAdd = (toolSlug: string) => {
    const mention = `@${toolSlug}`;
    if (!content.includes(mention)) {
      setContent(content + (content ? ' ' : '') + mention + ' ');
      setMentionedTools([...mentionedTools, toolSlug]);
    }
    setDrawerOpen(false);
  };

  const handleToolCopy = (toolSlug: string) => {
    navigator.clipboard.writeText(`@${toolSlug}`);
  };

  const filteredTools = mockTools.filter(tool =>
    tool.name.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(toolsSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'grey.300',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'text.primary'
                }}
              >
                JD
              </Avatar>
            </Stack>
          ]}
        >
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              {
                path: '/demo/skills',
                title: 'Skills',
                onClick: (e: React.MouseEvent) => {
                  e.preventDefault();
                  navigate('/demo/skills');
                }
              },
              { title: title || 'Category code lookup' }
            ]}
          />
          <PageHeaderComposable.Title
            status={{
              label: publishingStatus === 'published' ? 'Published' : 'Draft',
              color: publishingStatus === 'published' ? 'success' : 'default'
            }}
          >
            {title || 'Category code lookup'}
          </PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>


      {/* Main Content Container */}
      <Box component="main" sx={{
        ...pageStyles.formView.mainContainer,
        maxWidth: capitalDesignTokens.foundations.layout.breakpoints.desktop.wide,
        mx: 'auto',
        width: '100%',
      }}>
        <Box sx={pageStyles.formView.contentArea}>
            {/* Tools Bar */}
            <Toolbar level="level2">
              <Toolbar.Section grow>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Tools:
                  </Typography>
                  {mentionedTools.map(tool => (
                    <Chip
                      key={tool}
                      label={`@${tool}`}
                      size="small"
                      color="primary"
                    />
                  ))}
                  {mentionedTools.length === 0 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      None
                    </Typography>
                  )}
                </Stack>
              </Toolbar.Section>
              <Toolbar.Section>
                <Button
                  size="small"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                >
                  Manage Tools
                </Button>
              </Toolbar.Section>
            </Toolbar>

        {/* Editor Column */}
        <Box sx={pageStyles.formView.formSection}>
          

          {/* Skill Title Field */}
          <Box>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'text.primary',
                mb: 1
              }}
            >
              Skill Title
            </Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Category code lookup"
              variant="outlined"
              size="medium"
            />
          </Box>

          {/* Content Editor */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'text.primary',
                mb: 1
              }}
            >
              Skill Content
            </Typography>
            <TiptapEditor
                value={content}
                onChange={(value) => {
                  setContent(value);
                  // Extract mentioned tools and knowledge from HTML content
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = value;
                  const text = tempDiv.textContent || '';

                  // Extract tool mentions (@toolName)
                  const toolMentions = text.match(/@(?!knowledge\/)\w+/g) || [];
                  setMentionedTools(toolMentions.map(m => m.substring(1)));
                }}
                placeholder="Use @searchCategoryCodes to find category codes or @knowledge/residential-building-code to access building code knowledge."
                minHeight={250}
              />
          </Box>

          {/* Action Buttons Bar */}
          <Box sx={pageStyles.formView.actionBar}>
            <Button
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              disabled={isNewSkill}
              color="error"
            >
              Delete Skill
            </Button>

            <Stack direction="row" spacing={2} alignItems="center">
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
                disabled={!hasChanges || saving || !title || !content}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </Box>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
        </Box>
        </Box>

        {/* Tools Drawer - Desktop */}
        {!isMobile && (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            title="Tools"
            subtitle="Add tools to your skill to extend its capabilities"
            width={400}
            inPage={true}
            hideFooter={true}
          >
            <Box>
              <TextField
                fullWidth
                size="small"
                placeholder="Search tools..."
                value={toolsSearchQuery}
                onChange={(e) => setToolsSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    )
                  }
                }}
              />
              <Stack spacing={1} pt={2}>
                {filteredTools.map(tool => (
                  <Box
                    key={tool.id}
                    sx={{
                      backgroundColor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      p: 2
                    }}
                  >
                    <Typography
                      variant='body2'
                    >
                      {tool.name}
                    </Typography>
                    <Typography
                      variant='body2'
                    >
                      {tool.description}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        startIcon={<ContentCopyIcon />}
                        onClick={() => handleToolCopy(tool.slug)}
                        variant="outlined"
                      >
                        Copy
                      </Button>
                      <Button
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => handleToolAdd(tool.slug)}
                        disabled={mentionedTools.includes(tool.slug)}
                        variant="outlined"
                      >
                        Add
                      </Button>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Drawer>
        )}

      </Box>

      {/* Tools Drawer - Mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen && isMobile}
        onClose={() => setDrawerOpen(false)}
        title="Tools"
        subtitle="Add tools to your skill to extend its capabilities"
        width="100%"
        inPage={false}
        hideFooter={true}
      >
        <Box>
          <TextField
            fullWidth
            size="small"
            placeholder="Search tools..."
            value={toolsSearchQuery}
            onChange={(e) => setToolsSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                )
              }
            }}
          />
          <Stack spacing={1}>
            {filteredTools.map(tool => (
              <Box
                key={tool.id}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2
                }}
              >
                <Typography
                  variant='body2'
                >
                  {tool.name}
                </Typography>
                <Typography
                  variant='body2'
                >
                  {tool.description}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => handleToolCopy(tool.slug)}
                    variant="outlined"
                  >
                    Copy
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleToolAdd(tool.slug)}
                    disabled={mentionedTools.includes(tool.slug)}
                    variant="outlined"
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Skill</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this skill? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SkillEditPage;