import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  Tab,
  Tabs,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { useParams, useNavigate } from 'react-router-dom';
import { pageStyles, getStatusChipStyle } from '../theme/pageStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface Skill {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface AgentDetail {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft' | 'error';
  category: string;
  owner: string;
  createdAt: string;
  lastModified: string;
  version: string;
  skills: Skill[];
  configuration: {
    temperature: number;
    maxTokens: number;
    responseTimeout: number;
    retryAttempts: number;
  };
  metrics: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
    lastUsed: string;
  };
}

const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<AgentDetail>>({});

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock data
        const mockAgent: AgentDetail = {
          id: id || '1',
          name: 'Customer Support Agent',
          description: 'An intelligent agent designed to handle customer inquiries, support tickets, and provide instant assistance to users.',
          status: 'active',
          category: 'Support',
          owner: 'John Doe',
          createdAt: '2024-01-15T10:30:00Z',
          lastModified: '2024-03-15T10:30:00Z',
          version: '2.1.0',
          skills: [
            { id: '1', name: 'Ticket Classification', description: 'Automatically categorize support tickets', enabled: true },
            { id: '2', name: 'Sentiment Analysis', description: 'Analyze customer sentiment in messages', enabled: true },
            { id: '3', name: 'Response Generation', description: 'Generate appropriate responses to queries', enabled: true },
            { id: '4', name: 'Escalation Detection', description: 'Identify when to escalate to human agent', enabled: false },
            { id: '5', name: 'Knowledge Base Search', description: 'Search and retrieve relevant documentation', enabled: true }
          ],
          configuration: {
            temperature: 0.7,
            maxTokens: 2048,
            responseTimeout: 30,
            retryAttempts: 3
          },
          metrics: {
            totalRequests: 15432,
            successRate: 94.5,
            avgResponseTime: 1.2,
            lastUsed: '2024-03-15T14:30:00Z'
          }
        };

        setAgent(mockAgent);
        setFormData(mockAgent);
        setError(null);
      } catch (err) {
        setError('Failed to load agent details');
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = async () => {
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 500));
    setAgent(formData as AgentDetail);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(agent || {});
    setEditMode(false);
  };

  const handleDelete = () => {
    // Handle delete
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfigChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      configuration: {
        ...prev.configuration!,
        [field]: value
      }
    }));
  };

  const handleSkillToggle = (skillId: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills?.map(skill =>
        skill.id === skillId ? { ...skill, enabled: !skill.enabled } : skill
      )
    }));
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      active: { color: 'success' as const, label: 'Active' },
      inactive: { color: 'default' as const, label: 'Inactive' },
      draft: { color: 'warning' as const, label: 'Draft' },
      error: { color: 'error' as const, label: 'Error' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return <Chip label={config.label} color={config.color} sx={getStatusChipStyle(status)} />;
  };

  if (loading) {
    return (
      <Stack justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
        <CircularProgress />
      </Stack>
    );
  }

  if (error || !agent) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error || 'Agent not found'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={pageStyles.detailView.pageContainer}>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Stack key="actions" direction="row" spacing={1}>
              {!editMode ? (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          ]}
        >
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <IconButton onClick={() => navigate('/demo/agents')}>
              <ArrowBackIcon fontSize="small" />
            </IconButton>
            <PageHeaderComposable.Title
              status={{
                label: agent.status.charAt(0).toUpperCase() + agent.status.slice(1),
                color: agent.status === 'active' ? 'success' : agent.status === 'error' ? 'error' : 'default'
              }}
            >
              {editMode ? formData.name : agent.name}
            </PageHeaderComposable.Title>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Category: {agent.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Version: {agent.version}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Owner: {agent.owner}
            </Typography>
          </Stack>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Tabs */}
      <Box sx={pageStyles.detailView.tabContainer}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons={isMobile ? "auto" : false}
          allowScrollButtonsMobile
        >
          <Tab label="Overview" />
          <Tab label="Skills" />
          <Tab label={isMobile ? "Config" : "Configuration"} />
          <Tab label="Metrics" />
        </Tabs>
      </Box>

      {/* Content Area */}
      <Box sx={pageStyles.detailView.contentArea}>
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={pageStyles.detailView.gridSpacing}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper sx={pageStyles.detailView.sectionPaper}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                  />
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {agent.description}
                  </Typography>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Paper sx={pageStyles.detailView.sectionPaper}>
                <Typography variant="h6" gutterBottom>
                  Information
                </Typography>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(agent.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Modified
                    </Typography>
                    <Typography variant="body2">
                      {new Date(agent.lastModified).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Skills
                    </Typography>
                    <Typography variant="body2">
                      {agent.skills.length}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={pageStyles.detailView.sectionPaper}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Skills</Typography>
              {editMode && (
                <Button startIcon={<AddIcon />} size="small">
                  Add Skill
                </Button>
              )}
            </Stack>
            <List>
              {formData.skills?.map((skill) => (
                <React.Fragment key={skill.id}>
                  <ListItem>
                    <ListItemText
                      primary={skill.name}
                      secondary={skill.description}
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        checked={skill.enabled}
                        onChange={() => handleSkillToggle(skill.id)}
                        disabled={!editMode}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={pageStyles.detailView.sectionPaper}>
            <Typography variant="h6" gutterBottom>
              Configuration
            </Typography>
            <Grid container spacing={pageStyles.detailView.gridSpacing}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Temperature"
                  type="number"
                  value={formData.configuration?.temperature}
                  onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
                  disabled={!editMode}
                  inputProps={{ step: 0.1, min: 0, max: 1 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Max Tokens"
                  type="number"
                  value={formData.configuration?.maxTokens}
                  onChange={(e) => handleConfigChange('maxTokens', parseInt(e.target.value))}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Response Timeout (seconds)"
                  type="number"
                  value={formData.configuration?.responseTimeout}
                  onChange={(e) => handleConfigChange('responseTimeout', parseInt(e.target.value))}
                  disabled={!editMode}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Retry Attempts"
                  type="number"
                  value={formData.configuration?.retryAttempts}
                  onChange={(e) => handleConfigChange('retryAttempts', parseInt(e.target.value))}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={pageStyles.detailView.gridSpacing}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={pageStyles.detailView.metricCard}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Requests
                  </Typography>
                  <Typography variant="h4">
                    {agent.metrics.totalRequests.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={pageStyles.detailView.metricCard}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4">
                    {agent.metrics.successRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={pageStyles.detailView.metricCard}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Avg Response Time
                  </Typography>
                  <Typography variant="h4">
                    {agent.metrics.avgResponseTime}s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Card sx={pageStyles.detailView.metricCard}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Last Used
                  </Typography>
                  <Typography variant="body1">
                    {new Date(agent.metrics.lastUsed).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default AgentDetailPage;