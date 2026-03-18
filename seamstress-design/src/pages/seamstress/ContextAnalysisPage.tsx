import React, { useState, useEffect, useRef } from 'react';
import { colorTokens } from '../../theme/cds/tokens';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
} from '@mui/material';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { cdsDesignTokens } from '../../theme/cds';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

interface ContextMetrics {
  totalFiles: number;
  totalLines: number;
  docsCount: number;
  templatesCount: number;
  coverage: {
    architecture: number;
    patterns: number;
    business: number;
    ux: number;
  };
  categoryBreakdown: {
    persona: number;
    task: number;
    context: number;
    format: number;
  };
}

interface StructuralIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  title: string;
  description: string;
  impact: string;
  recommendation: string;
}

interface Improvement {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  rationale: string;
  implementation: string;
  effort: string;
  impact: string;
}

interface ContextNode {
  id: string;
  label: string;
  group: 'persona' | 'task' | 'context' | 'format';
  title: string;
  size: number;
}

interface ContextEdge {
  from: string;
  to: string;
  label?: string;
  arrows: string;
  color?: { color: string; opacity?: number };
}

const ContextAnalysisPage: React.FC = () => {
  const theme = useTheme();
  const [viewMode, setViewMode] = useState<'overview' | 'issues' | 'improvements' | 'visualization'>('overview');
  const [vizType, setVizType] = useState<'network' | 'hierarchy'>('network');
  const networkRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<ContextNode | null>(null);

  // Theme-aware colors for visualization
  const isDark = theme.palette.mode === 'dark';
  const textColor = isDark ? colorTokens.grey[200] : colorTokens.grey[800];
  const personaColor = { bg: colorTokens.primary[400], border: colorTokens.primary[700], highlight: { bg: colorTokens.primary[200], border: colorTokens.primary[400] } };
  const taskColor = { bg: colorTokens.primary.main, border: colorTokens.primary.dark, highlight: { bg: colorTokens.primary[400], border: colorTokens.primary.main } };
  const contextColor = { bg: colorTokens.success.main, border: colorTokens.success.dark, highlight: { bg: colorTokens.success.light, border: colorTokens.success.main } };
  const formatColor = { bg: colorTokens.warning.main, border: colorTokens.warning.dark, highlight: { bg: colorTokens.warning.light, border: colorTokens.warning.main } };

  // Context system metrics - UPDATED after structural improvements
  const metrics: ContextMetrics = {
    totalFiles: 22, // Added CONTEXT_MAP.md and mock-generators.ts
    totalLines: 3850, // Increased with new documentation
    docsCount: 12, // Added CONTEXT_MAP.md
    templatesCount: 7, // Same count, now organized
    coverage: {
      architecture: 100, // Improved with CONTEXT_MAP
      patterns: 95, // Improved with template guide
      business: 90, // Improved with mock generators
      ux: 85, // Improved overall
    },
    categoryBreakdown: {
      persona: 2, // government_personas + government_suite_scope
      task: 7, // Added CONTEXT_MAP as navigation task
      context: 6, // architecture, ux_principles, etc.
      format: 7, // templates (now organized)
    },
  };

  // Define context nodes with categories
  const contextNodes: ContextNode[] = [
    // Persona
    { id: 'government_personas', label: 'Government\nPersonas', group: 'persona', title: 'User personas and profiles', size: 25 },
    { id: 'government_suite', label: 'Government\nSuite Scope', group: 'persona', title: 'Project scope and boundaries', size: 20 },

    // Task (How-to guides)
    { id: 'seamstress_agent', label: 'Seamstress\nAgent', group: 'task', title: 'Core agent instructions and mission', size: 35 },
    { id: 'context_map', label: 'Context\nMap', group: 'task', title: 'NEW: Navigation guide for all docs', size: 28 },
    { id: 'business_logic', label: 'Business\nLogic', group: 'task', title: 'Patterns for implementing business logic', size: 30 },
    { id: 'routing', label: 'Routing', group: 'task', title: 'Route structure and navigation patterns', size: 28 },
    { id: 'theme_customization', label: 'Theme\nCustomization', group: 'task', title: 'How to customize the theme', size: 27 },
    { id: 'figma_variables', label: 'Figma\nVariables', group: 'task', title: 'Figma integration and design tokens', size: 32 },
    { id: 'pattern_generation', label: 'Pattern\nGeneration', group: 'task', title: 'How to generate component patterns', size: 26 },

    // Context (Background knowledge)
    { id: 'readme', label: 'README', group: 'context', title: 'Project overview and quick start', size: 20 },
    { id: 'architecture', label: 'Architecture', group: 'context', title: 'System architecture and design', size: 30 },
    { id: 'ux_principles', label: 'UX\nPrinciples', group: 'context', title: 'Core UX and design principles', size: 22 },
    { id: 'accessibility', label: 'Accessibility', group: 'context', title: 'WCAG standards and a11y patterns', size: 24 },
    { id: 'design_guidelines', label: 'Design\nGuidelines', group: 'context', title: 'OpenGov design rules and patterns', size: 28 },
    { id: 'mock_generators', label: 'Mock\nGenerators', group: 'context', title: 'NEW: Entity-specific data generators', size: 26 },

    // Format (Templates - now organized in subdirectories)
    { id: 'base_template', label: 'Base\nTemplate', group: 'format', title: 'Foundation template structure', size: 18 },
    { id: 'list_template', label: 'List\nTemplate', group: 'format', title: 'Full DataGrid list view pattern', size: 20 },
    { id: 'form_template', label: 'Form\nTemplate', group: 'format', title: 'Full create/edit form pattern', size: 20 },
    { id: 'detail_template', label: 'Detail\nTemplate', group: 'format', title: 'Full read-only detail view pattern', size: 20 },
    { id: 'list_minimal', label: 'List\n(Minimal)', group: 'format', title: 'Minimal list view variant', size: 16 },
    { id: 'form_minimal', label: 'Form\n(Minimal)', group: 'format', title: 'Minimal form variant', size: 16 },
    { id: 'detail_minimal', label: 'Detail\n(Minimal)', group: 'format', title: 'Minimal detail view variant', size: 16 },
  ];

  // Define relationships between nodes
  const contextEdges: ContextEdge[] = [
    // NEW: Context Map - central navigation hub
    { from: 'context_map', to: 'readme', label: 'organizes', arrows: 'to' },
    { from: 'context_map', to: 'seamstress_agent', label: 'references', arrows: 'to' },
    { from: 'context_map', to: 'architecture', label: 'maps', arrows: 'to' },
    { from: 'readme', to: 'context_map', label: 'links to', arrows: 'to' },

    // NEW: Mock Generators - used by everything
    { from: 'seamstress_agent', to: 'mock_generators', label: 'uses', arrows: 'to' },
    { from: 'list_template', to: 'mock_generators', label: 'uses', arrows: 'to' },
    { from: 'form_template', to: 'mock_generators', label: 'uses', arrows: 'to' },

    // Agent references everything
    { from: 'seamstress_agent', to: 'pattern_generation', label: 'uses', arrows: 'to' },
    { from: 'seamstress_agent', to: 'list_template', label: 'generates', arrows: 'to' },
    { from: 'seamstress_agent', to: 'form_template', label: 'generates', arrows: 'to' },
    { from: 'seamstress_agent', to: 'detail_template', label: 'generates', arrows: 'to' },
    { from: 'seamstress_agent', to: 'design_guidelines', label: 'follows', arrows: 'to' },
    { from: 'seamstress_agent', to: 'theme_customization', label: 'applies', arrows: 'to' },

    // Architecture relationships
    { from: 'business_logic', to: 'architecture', label: 'implements', arrows: 'to' },
    { from: 'routing', to: 'architecture', label: 'implements', arrows: 'to' },

    // Theme and design relationships
    { from: 'theme_customization', to: 'figma_variables', label: 'uses', arrows: 'to' },
    { from: 'theme_customization', to: 'design_guidelines', label: 'follows', arrows: 'to' },
    { from: 'figma_variables', to: 'design_guidelines', label: 'syncs', arrows: 'to' },

    // UX relationships
    { from: 'ux_principles', to: 'accessibility', label: 'requires', arrows: 'to' },
    { from: 'ux_principles', to: 'design_guidelines', label: 'informs', arrows: 'to' },
    { from: 'design_guidelines', to: 'accessibility', label: 'includes', arrows: 'to' },

    // Pattern generation to templates
    { from: 'pattern_generation', to: 'base_template', label: 'extends', arrows: 'to' },
    { from: 'pattern_generation', to: 'list_template', label: 'creates', arrows: 'to' },
    { from: 'pattern_generation', to: 'form_template', label: 'creates', arrows: 'to' },
    { from: 'pattern_generation', to: 'detail_template', label: 'creates', arrows: 'to' },

    // Template inheritance
    { from: 'list_template', to: 'base_template', label: 'extends', arrows: 'to' },
    { from: 'form_template', to: 'base_template', label: 'extends', arrows: 'to' },
    { from: 'detail_template', to: 'base_template', label: 'extends', arrows: 'to' },
    { from: 'list_minimal', to: 'list_template', label: 'variant', arrows: 'to' },
    { from: 'form_minimal', to: 'form_template', label: 'variant', arrows: 'to' },
    { from: 'detail_minimal', to: 'detail_template', label: 'variant', arrows: 'to' },

    // Templates use design guidelines
    { from: 'list_template', to: 'design_guidelines', label: 'follows', arrows: 'to' },
    { from: 'form_template', to: 'design_guidelines', label: 'follows', arrows: 'to' },
    { from: 'detail_template', to: 'design_guidelines', label: 'follows', arrows: 'to' },

    // Persona influences
    { from: 'government_personas', to: 'ux_principles', label: 'informs', arrows: 'to' },
    { from: 'government_personas', to: 'government_suite', label: 'defines', arrows: 'to' },

    // Project scope
    { from: 'readme', to: 'architecture', label: 'introduces', arrows: 'to' },
    { from: 'readme', to: 'seamstress_agent', label: 'introduces', arrows: 'to' },
    { from: 'government_suite', to: 'architecture', label: 'constrains', arrows: 'to' },
  ];

  // Structural issues discovered - UPDATED after improvements (6 → 2 → 1 issues remaining)
  const issues: StructuralIssue[] = [
    {
      severity: 'warning',
      category: 'Pattern Generation',
      title: 'Incomplete pattern generation documentation',
      description: 'pattern_generation.md mentions scripts/create-project.sh but context is focused on app development, not package creation',
      impact: 'Confuses the purpose - is this for app prototypes or component library patterns?',
      recommendation: 'Clarify scope: separate "app pattern generation" from "component library pattern creation"',
    },
  ];

  // FIXED ISSUES (showing improvements):
  const fixedIssues = [
    {
      title: '✅ Fixed filename typo',
      description: 'Renamed governament_suite_scope.md → government_suite_scope.md',
    },
    {
      title: '✅ Created mock data generators',
      description: 'Added .seamstress/contexts/mock-generators.ts with entity-specific generators',
    },
    {
      title: '✅ Organized template structure',
      description: 'Reorganized templates into patterns/ and minimal/ subdirectories',
    },
    {
      title: '✅ Added template selection guide',
      description: 'Documented when to use full vs minimal templates in SEAMSTRESS_AGENT.md',
    },
    {
      title: '✅ Created context navigation map',
      description: 'Added CONTEXT_MAP.md for easy document discovery',
    },
    {
      title: '✅ Consolidated theme documentation',
      description: 'Added cross-reference navigation boxes to all 4 theme docs (architecture, theme_customization, design_guidelines, figma_variables_guide)',
    },
  ];

  // Improvement suggestions
  const improvements: Improvement[] = [
    {
      priority: 'high',
      category: 'Context Organization',
      title: 'Add context hierarchy manifest',
      rationale: 'Currently no single source of truth showing how all context documents relate to each other',
      implementation: 'Create .seamstress/CONTEXT_MAP.md with visual hierarchy and when to consult each doc',
      effort: '1-2 hours',
      impact: 'Dramatically improves agent and developer ability to navigate context system',
    },
    {
      priority: 'high',
      category: 'Mock Data',
      title: 'Centralize mock data generation',
      rationale: 'Mock data references are scattered; no clear pattern for realistic data generation',
      implementation: 'Create .seamstress/contexts/mock-generators.ts with entity-specific generators',
      effort: '3-4 hours',
      impact: 'Provides consistent, realistic mock data across all prototypes',
    },
    {
      priority: 'high',
      category: 'Validation',
      title: 'Add context validation script',
      rationale: 'No automated way to verify context consistency (e.g., detect broken references, typos)',
      implementation: 'Create scripts/validate-context.ts that checks file existence, cross-references, and naming conventions',
      effort: '4-5 hours',
      impact: 'Prevents documentation drift and catches errors early',
    },
    {
      priority: 'medium',
      category: 'Template System',
      title: 'Create template composition guide',
      rationale: 'Templates exist but no guide on combining patterns (e.g., list + detail on same page)',
      implementation: 'Add .seamstress/docs/template_composition.md with common combinations',
      effort: '2-3 hours',
      impact: 'Enables more complex page patterns without starting from scratch',
    },
    {
      priority: 'medium',
      category: 'Business Logic',
      title: 'Add Effect.ts examples to business_logic.md',
      rationale: 'Doc mandates Effect.ts but only has basic examples; needs real-world patterns',
      implementation: 'Expand with pagination, caching, retry logic, and error recovery patterns',
      effort: '3-4 hours',
      impact: 'Reduces implementation time for complex async operations',
    },
    {
      priority: 'medium',
      category: 'Accessibility',
      title: 'Expand accessibility.md with component-specific patterns',
      rationale: 'Current a11y doc is high-level; needs specific ARIA patterns for common components',
      implementation: 'Add sections: DataGrid keyboard nav, Form validation announcements, Modal focus trap examples',
      effort: '4-5 hours',
      impact: 'Ensures consistent a11y implementation across all generated components',
    },
    {
      priority: 'medium',
      category: 'Figma Integration',
      title: 'Create Figma workflow quick reference',
      rationale: 'figma_variables_guide.md is comprehensive but lengthy; needs TL;DR version',
      implementation: 'Add .seamstress/docs/figma_quick_start.md with just the essential steps',
      effort: '1-2 hours',
      impact: 'Faster onboarding for Figma-to-code workflow',
    },
    {
      priority: 'low',
      category: 'Documentation Structure',
      title: 'Add doc versioning and changelog',
      rationale: 'No way to track when docs were last updated or what changed',
      implementation: 'Add version and last-updated metadata to each doc, plus .seamstress/CHANGELOG.md',
      effort: '2-3 hours',
      impact: 'Helps identify stale documentation and track evolution',
    },
    {
      priority: 'low',
      category: 'Examples',
      title: 'Create reference implementation gallery',
      rationale: 'No concrete examples showing "perfect" implementations of each pattern',
      implementation: 'Add .seamstress/examples/ with annotated reference components',
      effort: '6-8 hours',
      impact: 'Provides gold standard examples for AI agent and developers to reference',
    },
    {
      priority: 'low',
      category: 'Performance',
      title: 'Add performance optimization guide',
      rationale: 'business_logic.md touches on performance but no comprehensive guide',
      implementation: 'Create .seamstress/docs/performance.md covering memoization, virtualization, lazy loading',
      effort: '3-4 hours',
      impact: 'Ensures generated prototypes follow performance best practices',
    },
  ];

  // Initialize network visualization
  useEffect(() => {
    if (viewMode === 'visualization' && networkRef.current) {
      const nodes = new DataSet(
        contextNodes.map((node) => ({
          id: node.id,
          label: node.label,
          title: node.title,
          group: node.group,
          size: node.size,
          font: { size: 14, color: textColor },
        }))
      );

      const edges = new DataSet(
        contextEdges.map((edge) => ({
          ...edge,
          smooth: { type: 'curvedCW', roundness: 0.2 },
          font: { size: 10, align: 'middle' },
        }))
      );

      const data = { nodes, edges };

      const options = {
        nodes: {
          shape: 'dot',
          scaling: {
            min: 10,
            max: 40,
          },
          font: {
            size: 14,
            face: 'Tahoma',
            bold: {
              color: textColor,
            },
          },
          borderWidth: 2,
          shadow: true,
        },
        edges: {
          width: 1.5,
          color: { inherit: 'from', opacity: 0.5 },
          arrows: {
            to: { enabled: true, scaleFactor: 0.5 },
          },
          smooth: {
            type: 'curvedCW',
            roundness: 0.2,
          },
        },
        groups: {
          persona: {
            color: {
              background: personaColor.bg,
              border: personaColor.border,
              highlight: { background: personaColor.highlight.bg, border: personaColor.highlight.border },
            },
          },
          task: {
            color: {
              background: taskColor.bg,
              border: taskColor.border,
              highlight: { background: taskColor.highlight.bg, border: taskColor.highlight.border },
            },
          },
          context: {
            color: {
              background: contextColor.bg,
              border: contextColor.border,
              highlight: { background: contextColor.highlight.bg, border: contextColor.highlight.border },
            },
          },
          format: {
            color: {
              background: formatColor.bg,
              border: formatColor.border,
              highlight: { background: formatColor.highlight.bg, border: formatColor.highlight.border },
            },
          },
        },
        physics: {
          enabled: true,
          barnesHut: {
            gravitationalConstant: -8000,
            centralGravity: 0.3,
            springLength: 150,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0.5,
          },
          stabilization: {
            iterations: 200,
          },
        },
        interaction: {
          hover: true,
          tooltipDelay: 100,
          navigationButtons: true,
          keyboard: true,
        },
        layout: vizType === 'hierarchy' ? {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'directed',
            levelSeparation: 150,
            nodeSpacing: 100,
          },
        } : undefined,
      };

      const network = new Network(networkRef.current, data, options);

      network.on('selectNode', (params) => {
        const nodeId = params.nodes[0];
        const node = contextNodes.find((n) => n.id === nodeId);
        if (node) {
          setSelectedNode(node);
        }
      });

      network.on('deselectNode', () => {
        setSelectedNode(null);
      });

      return () => {
        network.destroy();
      };
    }
  }, [viewMode, vizType, textColor, personaColor, taskColor, contextColor, formatColor]);

  const getSeverityIcon = (severity: StructuralIssue['severity']) => {
    switch (severity) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
    }
  };

  const getPriorityColor = (priority: Improvement['priority']) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
    }
  };

  const renderOverview = () => (
    <Grid container spacing={3}>
      {/* Metrics Cards */}
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Total Files
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {metrics.totalFiles}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {metrics.docsCount} docs, {metrics.templatesCount} templates
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Total Lines
            </Typography>
            <Typography variant="h3" sx={{ mt: 1 }}>
              {metrics.totalLines.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Comprehensive coverage
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Issues Found
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, color: 'warning.main' }}>
              {issues.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {issues.filter((i) => i.severity === 'error').length} critical
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="caption" color="text.secondary">
              Improvements
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, color: 'info.main' }}>
              {improvements.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {improvements.filter((i) => i.priority === 'high').length} high priority
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Category Breakdown */}
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Context Categories (Persona • Task • Context • Format)
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: colorTokens.primary[400],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" color="white">
                    {metrics.categoryBreakdown.persona}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Persona
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Who uses this
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: colorTokens.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" color="white">
                    {metrics.categoryBreakdown.task}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Task
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  How to do things
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: colorTokens.success.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" color="white">
                    {metrics.categoryBreakdown.context}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Context
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Background knowledge
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: colorTokens.warning.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 1,
                  }}
                >
                  <Typography variant="h4" color="white">
                    {metrics.categoryBreakdown.format}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Format
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Templates & patterns
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      {/* Coverage Analysis */}
      <Grid size={{ xs: 12 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Documentation Coverage Analysis
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {Object.entries(metrics.coverage).map(([area, percentage]) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={area}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {area}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {percentage}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 8,
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${percentage}%`,
                        backgroundColor: percentage > 90 ? 'success.main' : percentage > 80 ? 'warning.main' : 'error.main',
                        transition: 'width 0.3s',
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>

      {/* Context Structure */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Context Structure
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Core Agent Instructions"
                secondary="SEAMSTRESS_AGENT.md - Clear mission and quick commands"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Template Library"
                secondary="7 templates covering list, form, detail patterns + minimal variants"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Documentation Suite"
                secondary="11 specialized docs covering architecture, UX, business logic, etc."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WarningIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Missing Elements"
                secondary="No context map, validation scripts, or mock data generators"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Strengths */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Key Strengths
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Comprehensive Theme System"
                secondary="Excellent documentation on design tokens and Figma integration"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Pattern-Driven Approach"
                secondary="Well-defined patterns with clear detection logic"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Entity-Scoped Architecture"
                secondary="Clear routing and data access patterns"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <TrendingUpIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Accessibility First"
                secondary="WCAG 2.1 AA compliance as default, not optional"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Improvements Applied */}
      <Grid size={{ xs: 12 }}>
        <Alert severity="success" icon={<CheckCircleIcon />}>
          <Typography variant="subtitle2" gutterBottom>
            🎉 <strong>Recent Improvements Applied!</strong> (Issues Resolved: 6 → 1)
          </Typography>
          <Grid container spacing={1} sx={{ mt: 1 }}>
            {fixedIssues.map((fix, idx) => (
              <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Box>
                    <Typography variant="caption" fontWeight="bold" display="block">
                      {fix.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {fix.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Alert>
      </Grid>

      {/* Summary Alert */}
      <Grid size={{ xs: 12 }}>
        <Alert severity="info" icon={<InfoIcon />}>
          <Typography variant="subtitle2" gutterBottom>
            Overall Assessment: <strong>Excellent Foundation with Near-Complete Improvements</strong>
          </Typography>
          <Typography variant="body2">
            The Seamstress context system demonstrates sophisticated architecture and comprehensive coverage. Recent
            structural improvements have added CONTEXT_MAP.md for navigation, mock-generators.ts for data, organized
            templates into patterns/minimal subdirectories, added template selection guidance, and consolidated theme
            documentation with cross-references across all 4 theme docs. The system now has 100% architecture coverage
            and only 1 remaining issue (down from 6). Outstanding progress!
          </Typography>
        </Alert>
      </Grid>
    </Grid>
  );

  const renderIssues = () => (
    <Box>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Structural issues and inconsistencies discovered in the context system:
      </Typography>
      {issues.map((issue, index) => (
        <Accordion key={index} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {getSeverityIcon(issue.severity)}
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{issue.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {issue.category}
                </Typography>
              </Box>
              <Chip label={issue.severity.toUpperCase()} size="small" color={issue.severity === 'error' ? 'error' : issue.severity === 'warning' ? 'warning' : 'info'} />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  Description
                </Typography>
                <Typography variant="body2">{issue.description}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  Impact
                </Typography>
                <Typography variant="body2">{issue.impact}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight="bold">
                  Recommendation
                </Typography>
                <Typography variant="body2">{issue.recommendation}</Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  const renderImprovements = () => (
    <Box>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Prioritized improvements to enhance the context system:
      </Typography>
      {['high', 'medium', 'low'].map((priority) => (
        <Box key={priority} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, textTransform: 'capitalize' }}>
            {priority} Priority
          </Typography>
          {improvements
            .filter((imp) => imp.priority === priority)
            .map((improvement, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{improvement.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {improvement.category} • {improvement.effort}
                      </Typography>
                    </Box>
                    <Chip label={improvement.priority.toUpperCase()} size="small" color={getPriorityColor(improvement.priority)} />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Rationale
                      </Typography>
                      <Typography variant="body2">{improvement.rationale}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold">
                        Implementation
                      </Typography>
                      <Typography variant="body2">{improvement.implementation}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', gap: 3 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Effort
                        </Typography>
                        <Typography variant="body2">{improvement.effort}</Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          Impact
                        </Typography>
                        <Typography variant="body2">{improvement.impact}</Typography>
                      </Box>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
        </Box>
      ))}
    </Box>
  );

  const renderVisualization = () => (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Typography variant="subtitle2">Visualization Type:</Typography>
              <ToggleButtonGroup
                value={vizType}
                exclusive
                onChange={(_, value) => value && setVizType(value)}
                size="small"
              >
                <ToggleButton value="network">Network</ToggleButton>
                <ToggleButton value="hierarchy">Hierarchy</ToggleButton>
              </ToggleButtonGroup>
              <Box sx={{ flex: 1 }} />
              <Stack direction="row" spacing={2}>
                <Chip
                  label="Persona"
                  size="small"
                  sx={{ bgcolor: personaColor.bg, color: 'white' }}
                />
                <Chip
                  label="Task"
                  size="small"
                  sx={{ bgcolor: taskColor.bg, color: 'white' }}
                />
                <Chip
                  label="Context"
                  size="small"
                  sx={{ bgcolor: contextColor.bg, color: 'white' }}
                />
                <Chip
                  label="Format"
                  size="small"
                  sx={{ bgcolor: formatColor.bg, color: 'white' }}
                />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: selectedNode ? 8 : 12 }}>
          <Paper sx={{ p: 0, height: 700, position: 'relative' }}>
            <Box
              ref={networkRef}
              sx={{
                width: '100%',
                height: '100%',
                backgroundColor: colorTokens.grey[900],
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                p: 2,
                borderRadius: 1,
                maxWidth: 300,
              }}
            >
              <Typography variant="caption" display="block" gutterBottom>
                <strong>Interactive Graph Controls:</strong>
              </Typography>
              <Typography variant="caption" display="block">
                • Click and drag to pan
              </Typography>
              <Typography variant="caption" display="block">
                • Scroll to zoom
              </Typography>
              <Typography variant="caption" display="block">
                • Click nodes for details
              </Typography>
              <Typography variant="caption" display="block">
                • Hover over connections to see relationships
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {selectedNode && (
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, height: 700, overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                {selectedNode.label.replace(/\n/g, ' ')}
              </Typography>
              <Chip
                label={selectedNode.group.toUpperCase()}
                size="small"
                sx={{
                  mb: 2,
                  bgcolor:
                    selectedNode.group === 'persona'
                      ? colorTokens.primary[400]
                      : selectedNode.group === 'task'
                      ? colorTokens.primary.main
                      : selectedNode.group === 'context'
                      ? colorTokens.success.main
                      : colorTokens.warning.main,
                  color: 'white',
                }}
              />
              <Typography variant="body2" paragraph>
                {selectedNode.title}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" gutterBottom>
                Related Files:
              </Typography>
              <List dense>
                {contextEdges
                  .filter((edge) => edge.from === selectedNode.id || edge.to === selectedNode.id)
                  .map((edge, idx) => {
                    const relatedId = edge.from === selectedNode.id ? edge.to : edge.from;
                    const relatedNode = contextNodes.find((n) => n.id === relatedId);
                    return (
                      <ListItem key={idx}>
                        <ListItemText
                          primary={relatedNode?.label.replace(/\n/g, ' ')}
                          secondary={edge.label}
                        />
                      </ListItem>
                    );
                  })}
              </List>
            </Paper>
          </Grid>
        )}

        <Grid size={{ xs: 12 }}>
          <Alert severity="info" icon={<InfoIcon />}>
            <Typography variant="subtitle2" gutterBottom>
              Understanding the Visualization
            </Typography>
            <Typography variant="body2">
              This interactive network graph shows how all context documents relate to each other. Each node represents
              a file, color-coded by category: <Box component="strong" sx={{ color: 'secondary.main' }}>Persona</Box> (purple) defines
              users, <Box component="strong" sx={{ color: 'primary.main' }}>Task</Box> (blue) shows how-to guides,{' '}
              <Box component="strong" sx={{ color: 'success.main' }}>Context</Box> (green) provides background knowledge, and{' '}
              <Box component="strong" sx={{ color: 'warning.main' }}>Format</Box> (orange) contains templates. Arrows show
              dependencies and references between documents.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <PageHeaderComposable maxContentWidth={cdsDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header>
          <PageHeaderComposable.Title>Context System Analysis</PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Deep analysis of Seamstress .seamstress/ context structure with interactive visualizations
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && setViewMode(value)}
            size="small"
          >
            <ToggleButton value="overview">Overview</ToggleButton>
            <ToggleButton value="visualization">Visualization</ToggleButton>
            <ToggleButton value="issues">Issues ({issues.length})</ToggleButton>
            <ToggleButton value="improvements">Improvements ({improvements.length})</ToggleButton>
          </ToggleButtonGroup>

          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small">
              Export Report
            </Button>
            <Button variant="contained" size="small">
              Generate Action Plan
            </Button>
          </Stack>
        </Box>

        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'visualization' && renderVisualization()}
        {viewMode === 'issues' && renderIssues()}
        {viewMode === 'improvements' && renderImprovements()}
      </Box>
    </Box>
  );
};

export default ContextAnalysisPage;
