/**
 * Agent Workspace Demo Page
 * Demonstrates cross-suite platform mutations with agent coordination
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  LinearProgress,
  IconButton,
  Collapse,
  Alert,
  Divider,
  Fade,
  Grow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { PageHeaderComposable } from '@opengov/components-page-header';
import { AIPromptInput, AIDisclaimer } from '@opengov/components-ai-patterns';
import type { Message, Conversation } from '@opengov/components-ai-patterns';
import { WorkspaceLayout } from '../components/AgentWorkspace/WorkspaceLayout';
import { workspaceDemoService } from '../services/workspaceDemoService';
import type { StagedMutation, WorkspaceState } from '../types/workspace';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';
import PresentationIcon from '@mui/icons-material/PresentToAll';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { OGAssistConversation } from '../components/OGAssist/OGAssistConversation';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

const AgentWorkspaceDemoPage: React.FC = () => {
  const [conversation, setConversation] = useState<Conversation>({
    messages: [],
    conversationId: 'workspace_demo',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState<string>();
  const [inputValue, setInputValue] = useState('');
  const [demoStep, setDemoStep] = useState(0);
  const [showMutationOutput, setShowMutationOutput] = useState(false);
  const [mutations, setMutations] = useState<StagedMutation[]>([]);
  const [appliedMutations, setAppliedMutations] = useState<string[]>([]);
  const [selectedMutations, setSelectedMutations] = useState<Set<string>>(new Set());
  const [applyProgress, setApplyProgress] = useState(0);
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const [expandedLinks, setExpandedLinks] = useState<Set<string>>(new Set());
  const [showKnowledgeDocs, setShowKnowledgeDocs] = useState(true);

  // Progressive reveal state
  const [visibleDocuments, setVisibleDocuments] = useState<number>(0);
  const [visibleAgents, setVisibleAgents] = useState<Array<{name: string, status: 'working' | 'complete', activity: string}>>([]);
  const [visibleDataSources, setVisibleDataSources] = useState<number>(0);
  const [insights, setInsights] = useState<Array<{id: string, title: string, content: string, priority: 'high' | 'medium' | 'low', documentId?: string, agentName?: string, mutationIds?: string[]}>>([]);
  const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);

  // Modal state for document viewer
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');

  const conversationContainerRef = useRef<HTMLDivElement>(null);

  const handleOpenDocument = (docId: string) => {
    const content = workspaceDemoService.getDocumentMarkdown(docId);
    setDocumentContent(content);
    setSelectedDocId(docId);
  };

  const handleCloseDocument = () => {
    setSelectedDocId(null);
    setDocumentContent('');
  };

  // Initialize with intro message
  useEffect(() => {
    const introMsg: Message = {
      id: 'msg_intro',
      role: 'assistant',
      content: `## Welcome to Infrastructure Program Coordinator

I help you plan and execute complex infrastructure programs across multiple OpenGov suites.

I can:
• Coordinate work across EAM, B&P, PRO, FIN, and R&T suites
• Orchestrate multiple specialist agents
• Create budgets, work orders, solicitations, and reports
• Generate presentations and documentation
• Ensure compliance and audit trails

**Try this demo**: Type "Help me plan the FY2026 infrastructure bond program. We have $15M approved for roads, bridges, and water infrastructure."`,
      timestamp: new Date().toISOString(),
      metadata: {
        agentName: 'Infrastructure Program Coordinator',
        skillName: 'Introduction',
      },
    };

    // Set a delayed intro to simulate initial setup
    setTimeout(() => {
      setConversation({ messages: [introMsg], conversationId: 'workspace_demo' });
    }, 500);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (!conversationContainerRef.current) return;
    setTimeout(() => {
      const container = conversationContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
    }));

    setIsLoading(true);
    setInputValue('');

    // Rotate thinking messages
    const thinkingMessages = workspaceDemoService.getThinkingMessages();
    let thinkingIndex = 0;
    setThinkingMessage(thinkingMessages[0]);

    const thinkingInterval = setInterval(() => {
      thinkingIndex = (thinkingIndex + 1) % thinkingMessages.length;
      setThinkingMessage(thinkingMessages[thinkingIndex]);
    }, 3000);

    try {
      const response = await workspaceDemoService.processMessage(message);

      clearInterval(thinkingInterval);
      setThinkingMessage(undefined);

      setConversation((prev) => ({
        ...prev,
        messages: [...prev.messages, response],
      }));

      scrollToBottom();

      // Progressive reveal based on message content and step
      const step = workspaceDemoService.getCurrentStep();

      // Step 1: Show documents being uploaded
      if (step === 1) {
        setDemoStep(1);
        setTimeout(() => setVisibleDocuments(1), 300);
        setTimeout(() => setVisibleDocuments(2), 600);
        setTimeout(() => setVisibleDocuments(3), 900);
      }

      // Step 2: Activate Asset Assessment Agent (working)
      if (step === 2) {
        setDemoStep(2);
        setTimeout(() => {
          setVisibleAgents([{
            name: 'Asset Assessment Agent',
            status: 'working',
            activity: 'Analyzing 47 infrastructure assets using condition scoring model...'
          }]);
          setVisibleDataSources(2); // EAM and GIS
        }, 500);

        // Auto-complete after 4 seconds
        setTimeout(() => {
          setVisibleAgents(prev => prev.map(a =>
            a.name === 'Asset Assessment Agent' ? {...a, status: 'complete', activity: 'Analysis complete'} : a
          ));
          setInsights([{
            id: 'insight_1',
            title: 'Asset Assessment',
            content: '8 critical assets, 12 work orders, $14.8M',
            priority: 'high',
            documentId: 'kb_insight_001',
            agentName: 'Asset Assessment Agent',
            mutationIds: ['mut_wo_001', 'mut_wo_002', 'mut_wo_003', 'mut_wo_004', 'mut_wo_005', 'mut_wo_006', 'mut_wo_007', 'mut_wo_008', 'mut_wo_009', 'mut_wo_010', 'mut_wo_011', 'mut_wo_012', 'mut_asset_001', 'mut_asset_002', 'mut_asset_003', 'mut_wo_old_001']
          }]);
        }, 4500);
      }

      // Step 4: Activate Budget and Finance agents (working)
      if (step === 4) {
        setDemoStep(4);
        setTimeout(() => {
          setVisibleAgents(prev => [...prev,
            {
              name: 'Budget Planner Agent',
              status: 'working',
              activity: 'Creating budget allocations across 3 funding categories...'
            },
            {
              name: 'Finance Agent',
              status: 'working',
              activity: 'Setting up GL accounts and payment tracking...'
            }
          ]);
          setVisibleDataSources(4); // Add B&P and FIN
        }, 500);

        // Both complete simultaneously after 4 seconds
        setTimeout(() => {
          setVisibleAgents(prev => prev.map(a =>
            (a.name === 'Budget Planner Agent' || a.name === 'Finance Agent')
              ? {...a, status: 'complete', activity: 'Configuration complete'}
              : a
          ));
          setInsights(prev => [...prev, {
            id: 'insight_2',
            title: 'Budget & Finance',
            content: '15 budget lines, $15M allocated, +$200K contingency',
            priority: 'medium',
            documentId: 'kb_insight_002',
            agentName: 'Budget Planner Agent',
            mutationIds: ['mut_budget_version', 'mut_budget_001', 'mut_budget_002', 'mut_budget_003', 'mut_budget_004', 'mut_budget_005', 'mut_budget_006', 'mut_budget_007', 'mut_budget_008', 'mut_budget_009', 'mut_budget_010', 'mut_budget_011', 'mut_budget_012', 'mut_budget_013', 'mut_budget_update_001', 'mut_budget_delete_001', 'mut_gl_001', 'mut_gl_002', 'mut_gl_003', 'mut_gl_004', 'mut_gl_005', 'mut_gl_006', 'mut_gl_update_001', 'mut_gl_update_002', 'mut_gl_delete_001', 'mut_journal_template', 'mut_payment_001', 'mut_payment_002']
          }]);
        }, 4500);
      }

      // Step 6: Activate Procurement agent (working)
      if (step === 6) {
        setDemoStep(6);
        setTimeout(() => {
          setVisibleAgents(prev => [...prev, {
            name: 'Procurement Strategist Agent',
            status: 'working',
            activity: 'Analyzing vendor capacity and creating solicitation strategy...'
          }]);
          setVisibleDataSources(5); // Add PRO
        }, 500);

        // Complete after 4 seconds
        setTimeout(() => {
          setVisibleAgents(prev => prev.map(a =>
            a.name === 'Procurement Strategist Agent' ? {...a, status: 'complete', activity: 'Strategy finalized'} : a
          ));
          setInsights(prev => [...prev, {
            id: 'insight_3',
            title: 'Procurement Strategy',
            content: '5 solicitations, +$800K grant opportunity, schedule optimization',
            priority: 'high',
            documentId: 'kb_insight_003',
            agentName: 'Procurement Strategist Agent',
            mutationIds: ['mut_sol_001', 'mut_sol_002', 'mut_sol_003', 'mut_sol_004', 'mut_sol_005', 'mut_vendor_list_1', 'mut_vendor_list_2', 'mut_vendor_list_3', 'mut_sol_update_001', 'mut_vendor_delete_001', 'mut_sol_conflict_001']
          }]);
        }, 4500);
      }

      // Step 8: Activate remaining agents (working)
      if (step === 8) {
        setDemoStep(8);
        setTimeout(() => {
          setVisibleAgents(prev => [...prev,
            {
              name: 'Compliance Agent',
              status: 'working',
              activity: 'Generating accountability reports and public dashboards...'
            },
            {
              name: 'Public Works Agent',
              status: 'working',
              activity: 'Creating work order templates and project schedules...'
            }
          ]);
          setVisibleDataSources(8); // All sources
        }, 500);

        // Both complete simultaneously after 4 seconds
        setTimeout(() => {
          setVisibleAgents(prev => prev.map(a =>
            (a.name === 'Compliance Agent' || a.name === 'Public Works Agent')
              ? {...a, status: 'complete', activity: 'Documentation ready'}
              : a
          ));
        }, 4500);
      }

      // Step 9: Load mutations after analysis complete
      if (step === 9 && response.content.includes('Ready for Your Review')) {
        setDemoStep(9);
        const stagedMutations = await workspaceDemoService.getStagedMutations();
        setMutations(stagedMutations);

        // Add final comprehensive insight
        setInsights(prev => [...prev, {
          id: 'insight_all',
          title: 'Complete Program',
          content: '65 changes across 6 suites, 9 knowledge docs',
          priority: 'high',
          agentName: 'Infrastructure Program Coordinator',
          mutationIds: stagedMutations.map(m => m.id)
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [scrollToBottom]);

  const handleReviewChanges = (insightId?: string) => {
    setShowMutationOutput(true);

    // If an insight is selected, only select its mutations
    if (insightId) {
      const insight = insights.find(i => i.id === insightId);
      if (insight?.mutationIds) {
        setSelectedMutations(new Set(insight.mutationIds));
      }
    } else {
      // Select all mutations by default
      setSelectedMutations(new Set(mutations.map(m => m.id)));
    }
  };

  const handleToggleMutation = (mutationId: string) => {
    setSelectedMutations((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mutationId)) {
        newSet.delete(mutationId);
      } else {
        newSet.add(mutationId);
      }
      return newSet;
    });
  };

  const handleToggleSuite = (suite: string) => {
    const suiteMutationIds = mutationsBySuite[suite].map(m => m.id);
    const allSelected = suiteMutationIds.every(id => selectedMutations.has(id));

    setSelectedMutations((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        // Deselect all in suite
        suiteMutationIds.forEach(id => newSet.delete(id));
      } else {
        // Select all in suite
        suiteMutationIds.forEach(id => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleApplySelectedChanges = async () => {
    if (selectedMutations.size === 0) return;

    setApplyProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setApplyProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    try {
      const selectedIds = Array.from(selectedMutations);
      const result = await workspaceDemoService.applyMutations(selectedIds);

      if (result.success) {
        setAppliedMutations(selectedIds);
        setDemoStep(2);
      }
    } catch (error) {
      console.error('Error applying mutations:', error);
    }
  };

  const handleRevertMutation = async (mutationId: string) => {
    await workspaceDemoService.revertMutation(mutationId);
    setAppliedMutations((prev) => prev.filter((id) => id !== mutationId));
  };

  const handleRevertSuite = async (suite: string) => {
    await workspaceDemoService.revertSuite(suite);
    const suiteMutationIds = mutations.filter((m) => m.suite === suite).map((m) => m.id);
    setAppliedMutations((prev) => prev.filter((id) => !suiteMutationIds.includes(id)));
  };

  const toggleSuiteExpansion = (suite: string) => {
    setExpandedSuites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(suite)) {
        newSet.delete(suite);
      } else {
        newSet.add(suite);
      }
      return newSet;
    });
  };

  const toggleLinksExpansion = (mutationId: string) => {
    setExpandedLinks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(mutationId)) {
        newSet.delete(mutationId);
      } else {
        newSet.add(mutationId);
      }
      return newSet;
    });
  };

  const resetDemo = () => {
    setConversation({ messages: [], conversationId: 'workspace_demo' });
    setMutations([]);
    setAppliedMutations([]);
    setShowMutationOutput(false);
    setDemoStep(0);
    setApplyProgress(0);
    setVisibleDocuments(0);
    setVisibleAgents([]);
    setVisibleDataSources(0);
    setInsights([]);
    workspaceDemoService.resetStep();

    // Re-initialize with intro
    setTimeout(() => {
      const introMsg: Message = {
        id: 'msg_intro',
        role: 'assistant',
        content: `## Welcome to Infrastructure Program Coordinator

I help you plan and execute complex infrastructure programs across multiple OpenGov suites.

I can:
• Coordinate work across EAM, B&P, PRO, FIN, and R&T suites
• Orchestrate multiple specialist agents
• Create budgets, work orders, solicitations, and reports
• Generate presentations and documentation
• Ensure compliance and audit trails

**Try this demo**: Type "Help me plan the FY2026 infrastructure bond program. We have $15M approved for roads, bridges, and water infrastructure."`,
        timestamp: new Date().toISOString(),
        metadata: {
          agentName: 'Infrastructure Program Coordinator',
          skillName: 'Introduction',
        },
      };
      setConversation({ messages: [introMsg], conversationId: 'workspace_demo' });
    }, 500);
  };

  // Filter mutations by selected insight
  const filteredMutations = selectedInsightId && showMutationOutput
    ? (() => {
        const insight = insights.find(i => i.id === selectedInsightId);
        if (insight?.mutationIds) {
          return mutations.filter(m => insight.mutationIds!.includes(m.id));
        }
        return mutations;
      })()
    : mutations;

  // Group mutations by suite
  const mutationsBySuite = filteredMutations.reduce((acc, mutation) => {
    if (!acc[mutation.suite]) {
      acc[mutation.suite] = [];
    }
    acc[mutation.suite].push(mutation);
    return acc;
  }, {} as Record<string, StagedMutation[]>);

  const suites = Object.keys(mutationsBySuite);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button
              key="reset"
              startIcon={<RestartAltIcon />}
              onClick={resetDemo}
              variant="outlined"
            >
              Reset Demo
            </Button>,
          ]}
        >
          <PageHeaderComposable.Title>
            Infrastructure Bond Workspace
          </PageHeaderComposable.Title>
          <PageHeaderComposable.Description>
            Agent: Infrastructure Program Coordinator | Demo: FY2026 $15M Bond Program
          </PageHeaderComposable.Description>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      <WorkspaceLayout
        chatColumn={
          <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
                Chat
              </Typography>
            </Box>

            {/* Conversation Area */}
            <Box
              ref={conversationContainerRef}
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: 2,
                maxHeight: '500px',
              }}
            >
              <OGAssistConversation
                conversation={conversation}
                isLoading={isLoading}
                thinkingMessage={thinkingMessage}
                onMessageCopy={(msg) => navigator.clipboard.writeText(msg.content || '')}
                showCopyButton={() => true}
              />
            </Box>

            {/* Input Area */}
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <AIPromptInput
                value={inputValue}
                onChange={setInputValue}
                onSubmit={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask the coordinator agent..."
                minRows={1}
                maxRows={3}
                showFileInput={false}
                ariaLabels={{
                  input: 'Message workspace agent',
                  sendButton: 'Send message',
                }}
              />
              <Box sx={{ mt: 1 }}>
                <AIDisclaimer />
              </Box>
            </Box>
          </Paper>
        }
        contextColumn={
          <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
                Context & Activity
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxHeight: '500px' }}>
              {demoStep === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Type a message to begin the demo workflow
                </Alert>
              )}

              {demoStep >= 1 && (
                <Stack spacing={2}>
                  {/* Documents Section */}
                  {visibleDocuments > 0 && (
                    <Fade in={true} timeout={500}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Documents ({visibleDocuments})
                        </Typography>
                        <Stack spacing={0.5}>
                          {workspaceDemoService.getUploadedDocuments().slice(0, visibleDocuments).map((doc, idx) => (
                            <Grow key={doc.id} in={true} timeout={300} style={{ transformOrigin: '0 0 0' }}>
                              <Chip
                                label={doc.name}
                                size="small"
                                icon={<CheckCircleIcon />}
                                sx={{ mr: 0.5 }}
                              />
                            </Grow>
                          ))}
                        </Stack>
                      </Box>
                    </Fade>
                  )}

                  {visibleDocuments > 0 && <Divider />}

                  {/* Active Agents Section */}
                  {visibleAgents.length > 0 && (
                    <Fade in={true} timeout={500}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Active Agents ({visibleAgents.length})
                        </Typography>
                        <Stack spacing={1}>
                          {visibleAgents.map((agent, idx) => (
                            <Grow key={agent.name} in={true} timeout={400 + idx * 100} style={{ transformOrigin: '0 0 0' }}>
                              <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {agent.status === 'working' ? (
                                    <CircularProgress size={16} sx={{ color: 'primary.main' }} />
                                  ) : (
                                    <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                  )}
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {agent.name}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 3, display: 'block', mt: 0.25 }}>
                                  {agent.activity}
                                </Typography>
                              </Box>
                            </Grow>
                          ))}
                        </Stack>
                      </Box>
                    </Fade>
                  )}

                  {visibleAgents.length > 0 && <Divider />}

                  {/* Data Sources Section */}
                  {visibleDataSources > 0 && (
                    <Fade in={true} timeout={500}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Data Sources ({visibleDataSources})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {visibleDataSources >= 2 && 'EAM, GIS'}
                          {visibleDataSources >= 4 && ', B&P, FIN'}
                          {visibleDataSources >= 5 && ', PRO'}
                          {visibleDataSources >= 8 && ', R&T, DOCUMENT'}
                        </Typography>
                      </Box>
                    </Fade>
                  )}
                </Stack>
              )}
            </Box>
          </Paper>
        }
        insightsColumn={
          <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600 }}>
                Insights & Actions
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxHeight: '500px' }}>
              {/* Progressive Insights */}
              {insights.length > 0 && !showMutationOutput && (
                <Stack spacing={1}>
                  {insights.map((insight, idx) => (
                    <Grow key={insight.id} in={true} timeout={600} style={{ transformOrigin: '0 0 0' }}>
                      <Paper
                        elevation={0}
                        onClick={() => setSelectedInsightId(insight.id)}
                        sx={{
                          p: 1.5,
                          bgcolor: selectedInsightId === insight.id ? 'primary.main' : 'background.paper',
                          borderLeft: '3px solid',
                          borderColor: selectedInsightId === insight.id ? 'primary.dark' : insight.priority === 'high' ? 'error.main' : insight.priority === 'medium' ? 'warning.main' : 'info.main',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: selectedInsightId === insight.id ? 'primary.dark' : 'action.hover',
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                mb: 0.25,
                                color: selectedInsightId === insight.id ? 'primary.contrastText' : 'text.primary'
                              }}
                            >
                              {insight.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                color: selectedInsightId === insight.id ? 'primary.contrastText' : 'text.secondary'
                              }}
                            >
                              {insight.content}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {insight.mutationIds && (
                              <Chip
                                label={insight.mutationIds.length}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '11px',
                                  bgcolor: selectedInsightId === insight.id ? 'primary.contrastText' : 'action.selected',
                                  color: selectedInsightId === insight.id ? 'primary.main' : 'text.primary'
                                }}
                              />
                            )}
                            {insight.documentId && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenDocument(insight.documentId!);
                                }}
                                sx={{
                                  p: 0.25,
                                  color: selectedInsightId === insight.id ? 'primary.contrastText' : 'text.secondary'
                                }}
                              >
                                <DescriptionIcon sx={{ fontSize: 16 }} />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Grow>
                  ))}
                </Stack>
              )}

              {/* Final Review Section */}
              {demoStep >= 9 && !showMutationOutput && (
                <Fade in={true} timeout={800}>
                  <Stack spacing={2}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Ready for Review
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        65 platform changes staged across 6 suites
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Includes CREATE, UPDATE, and DELETE operations
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                        9 knowledge documents available for stakeholder review
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleReviewChanges(selectedInsightId || undefined)}
                      >
                        {selectedInsightId && selectedInsightId !== 'insight_all'
                          ? `Review ${insights.find(i => i.id === selectedInsightId)?.title} Changes`
                          : 'Review All Changes'}
                      </Button>
                    </Paper>

                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Program Overview
                      </Typography>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Total Budget:</Typography>
                          <Typography variant="body2" fontWeight={600}>$15.0M</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Projects:</Typography>
                          <Typography variant="body2" fontWeight={600}>30</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">Timeline:</Typography>
                          <Typography variant="body2" fontWeight={600}>24 months</Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Stack>
                </Fade>
              )}
            </Box>
          </Paper>
        }
        outputArea={
          showMutationOutput && (
            <Box>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {applyProgress === 100
                      ? 'Changes Applied Successfully'
                      : selectedInsightId && selectedInsightId !== 'insight_all'
                      ? `${insights.find(i => i.id === selectedInsightId)?.title} - ${filteredMutations.length} changes`
                      : `Pending Platform Changes (${filteredMutations.length} mutations)`}
                  </Typography>

                  {applyProgress === 0 && insights.length > 0 && (
                    <Stack direction="row" spacing={1}>
                      {insights.map((insight) => (
                        <Chip
                          key={insight.id}
                          label={insight.title}
                          size="small"
                          onClick={() => {
                            setSelectedInsightId(insight.id);
                            handleReviewChanges(insight.id);
                          }}
                          color={selectedInsightId === insight.id ? 'primary' : 'default'}
                          variant={selectedInsightId === insight.id ? 'filled' : 'outlined'}
                          sx={{
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: selectedInsightId === insight.id ? 'primary.dark' : 'action.hover',
                            }
                          }}
                        />
                      ))}
                    </Stack>
                  )}
                </Box>

                {/* Overall Impact Statistics */}
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Overall Impact Summary
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 3 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Total Changes
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'primary.main' }}>
                        {filteredMutations.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        across {suites.length} OpenGov suites
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Operations
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'success.main' }}>
                            {filteredMutations.filter(m => m.operation === 'CREATE').length}
                          </Typography>
                          <Typography variant="caption">CREATE</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'warning.main' }}>
                            {filteredMutations.filter(m => m.operation === 'UPDATE').length}
                          </Typography>
                          <Typography variant="caption">UPDATE</Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '1.125rem', color: 'error.main' }}>
                            {filteredMutations.filter(m => m.operation === 'DELETE').length}
                          </Typography>
                          <Typography variant="caption">DELETE</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Cross-Suite Links
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                        {filteredMutations.reduce((sum, m) => sum + m.linkedMutations.length, 0)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        dependencies tracked
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Budget Impact
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'success.main' }}>
                        $15.0M
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        infrastructure bond program
                      </Typography>
                    </Box>
                    {(() => {
                      const actionsRequired = filteredMutations.filter(m => m.requiresUserAction);
                      const blockingActions = actionsRequired.filter(m => m.requiresUserAction?.blocking);
                      if (actionsRequired.length > 0) {
                        return (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                              Actions Required
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, fontSize: '1.5rem', color: 'warning.main' }}>
                              {actionsRequired.length}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {blockingActions.length} blocking, {actionsRequired.length - blockingActions.length} non-blocking
                            </Typography>
                          </Box>
                        );
                      }
                      return null;
                    })()}
                  </Box>
                </Paper>

                {applyProgress === 0 && (() => {
                  const actionsRequired = filteredMutations.filter(m => m.requiresUserAction);
                  const blockingActions = actionsRequired.filter(m => m.requiresUserAction?.blocking);
                  if (actionsRequired.length > 0) {
                    return (
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {blockingActions.length} blocking actions required, {actionsRequired.length - blockingActions.length} non-blocking actions needed
                        </Typography>
                        <Typography variant="caption">
                          Review mutations marked with "Action Required" before applying changes
                        </Typography>
                      </Alert>
                    );
                  }
                  return null;
                })()}
              </Box>

              {/* Knowledge Documents Section */}
              {showKnowledgeDocs && applyProgress === 0 && (
                <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default', border: '1px solid', borderColor: 'primary.main' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DescriptionIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Knowledge Documents
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => setShowKnowledgeDocs(false)}>
                      <ExpandLessIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Comprehensive documentation explaining the infrastructure bond program, strategic rationale, and implementation plan.
                    These documents can be circulated to stakeholders and referenced throughout the project lifecycle.
                  </Typography>
                  <Stack spacing={1.5}>
                    {workspaceDemoService.getGeneratedDocuments().map((doc) => (
                      <Paper
                        key={doc.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: 'action.hover',
                          }
                        }}
                        onClick={() => handleOpenDocument(doc.id)}
                      >
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <DescriptionIcon sx={{ color: 'primary.dark' }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {doc.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {doc.format} • Agent Studio Knowledge Base • {doc.generatedBy}
                          </Typography>
                          {doc.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {doc.description}
                            </Typography>
                          )}
                        </Box>
                        <Button variant="outlined" size="small" onClick={(e) => { e.stopPropagation(); handleOpenDocument(doc.id); }}>
                          View
                        </Button>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              )}
              {!showKnowledgeDocs && applyProgress === 0 && (
                <Button
                  startIcon={<ExpandMoreIcon />}
                  onClick={() => setShowKnowledgeDocs(true)}
                  sx={{ mb: 3 }}
                >
                  Show Knowledge Documents
                </Button>
              )}

              {applyProgress > 0 && applyProgress < 100 && (
                <Box sx={{ mb: 3 }}>
                  <LinearProgress variant="determinate" value={applyProgress} sx={{ height: 8, borderRadius: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Applying {selectedMutations.size} selected changes... {applyProgress}%
                  </Typography>
                </Box>
              )}

              {applyProgress === 0 && (
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleApplySelectedChanges}
                    disabled={selectedMutations.size === 0}
                  >
                    Apply Selected Changes ({selectedMutations.size})
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {selectedMutations.size} of {filteredMutations.length} changes selected
                  </Typography>
                </Box>
              )}

              <Stack spacing={3}>
                {suites.map((suite) => {
                  const suiteMutations = mutationsBySuite[suite];
                  const isExpanded = expandedSuites.has(suite);
                  const allApplied = suiteMutations.every((m) => appliedMutations.includes(m.id));
                  const selectedCount = suiteMutations.filter(m => selectedMutations.has(m.id)).length;
                  const allSelected = selectedCount === suiteMutations.length;

                  // Calculate impact summary
                  const totalCost = suiteMutations.reduce((sum, m) => {
                    return sum + (m.data.estimatedCost || m.data.amount || m.data.totalAmount || 0);
                  }, 0);

                  const createCount = suiteMutations.filter(m => m.operation === 'CREATE').length;
                  const updateCount = suiteMutations.filter(m => m.operation === 'UPDATE').length;
                  const deleteCount = suiteMutations.filter(m => m.operation === 'DELETE').length;
                  const actionsNeeded = suiteMutations.filter(m => m.requiresUserAction).length;
                  const blockingActionsNeeded = suiteMutations.filter(m => m.requiresUserAction?.blocking).length;

                  return (
                    <Paper elevation={0} key={suite} sx={{ p: 3, border: '1px solid', borderColor: allApplied ? 'success.main' : 'divider' }}>
                      <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {applyProgress === 0 && (
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={() => handleToggleSuite(suite)}
                              style={{ width: 20, height: 20, cursor: 'pointer' }}
                            />
                          )}
                          {allApplied && <CheckCircleIcon sx={{ color: 'success.main' }} />}
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              {suite}: {['EAM', 'B&P', 'PRO', 'FIN', 'R&T', 'STUDIO', 'DOCUMENT'][suites.indexOf(suite)]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {suiteMutations.length} changes {applyProgress === 0 && `(${selectedCount} selected)`}
                              {actionsNeeded > 0 && (
                                <Chip
                                  icon={<WarningIcon sx={{ fontSize: 14 }} />}
                                  label={`${actionsNeeded} action${actionsNeeded > 1 ? 's' : ''} needed`}
                                  size="small"
                                  color="warning"
                                  sx={{ height: 20, fontSize: '11px', ml: 1 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {applyProgress === 100 && (
                            <Button size="small" onClick={() => handleRevertSuite(suite)}>
                              Revert Suite
                            </Button>
                          )}
                          <IconButton size="small" onClick={() => toggleSuiteExpansion(suite)}>
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Impact Summary */}
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          Impact Summary
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 2 }}>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Operations</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {createCount} Create, {updateCount} Update, {deleteCount} Delete
                            </Typography>
                          </Box>
                          {totalCost > 0 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">Total Budget Impact</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                ${(totalCost / 1000000).toFixed(1)}M
                              </Typography>
                            </Box>
                          )}
                          <Box>
                            <Typography variant="caption" color="text.secondary">Records Affected</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {suiteMutations.length} {suite} records
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary">Cross-Suite Dependencies</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LinkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {suiteMutations.reduce((sum, m) => sum + m.linkedMutations.length, 0)} links
                              </Typography>
                            </Box>
                          </Box>
                          {actionsNeeded > 0 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">Actions Required</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'warning.main' }}>
                                {blockingActionsNeeded} blocking, {actionsNeeded - blockingActionsNeeded} non-blocking
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Paper>

                      <Collapse in={isExpanded}>
                        <Stack spacing={2}>
                          {suiteMutations.map((mutation) => (
                            <Paper
                              elevation={0}
                              key={mutation.id}
                              sx={{
                                p: 2,
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: mutation.requiresUserAction?.blocking ? 'warning.main' : 'divider',
                                ...(mutation.requiresUserAction?.blocking && {
                                  borderWidth: 2,
                                })
                              }}
                            >
                              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                                {applyProgress === 0 && !appliedMutations.includes(mutation.id) && (
                                  <input
                                    type="checkbox"
                                    checked={selectedMutations.has(mutation.id)}
                                    onChange={() => handleToggleMutation(mutation.id)}
                                    disabled={mutation.requiresUserAction?.blocking}
                                    style={{
                                      width: 18,
                                      height: 18,
                                      cursor: mutation.requiresUserAction?.blocking ? 'not-allowed' : 'pointer',
                                      marginTop: 2,
                                      opacity: mutation.requiresUserAction?.blocking ? 0.5 : 1
                                    }}
                                  />
                                )}
                                <Box sx={{ flex: 1 }}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                    <Box>
                                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {mutation.displayName}
                                      </Typography>
                                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip
                                          label={mutation.operation}
                                          size="small"
                                          color={mutation.operation === 'CREATE' ? 'success' : mutation.operation === 'UPDATE' ? 'warning' : 'error'}
                                          sx={{ height: 20, fontSize: '11px' }}
                                        />
                                        <Chip
                                          label={mutation.table}
                                          size="small"
                                          variant="outlined"
                                          sx={{ height: 20, fontSize: '11px' }}
                                        />
                                        {mutation.requiresUserAction && (
                                          <Chip
                                            icon={<WarningIcon sx={{ fontSize: 14 }} />}
                                            label={mutation.requiresUserAction.blocking ? 'Action Required' : 'Action Needed'}
                                            size="small"
                                            color="warning"
                                            sx={{ height: 20, fontSize: '11px' }}
                                          />
                                        )}
                                      </Box>
                                    </Box>
                                    {appliedMutations.includes(mutation.id) && (
                                      <Button size="small" onClick={() => handleRevertMutation(mutation.id)}>
                                        Revert
                                      </Button>
                                    )}
                                  </Box>

                                  {mutation.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      {mutation.description}
                                    </Typography>
                                  )}

                                  {mutation.requiresUserAction && (
                                    <Alert severity={mutation.requiresUserAction.blocking ? 'warning' : 'info'} sx={{ mb: 1 }}>
                                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                        {mutation.requiresUserAction.reason}
                                      </Typography>
                                      <Typography variant="caption">
                                        {mutation.requiresUserAction.actionNeeded}
                                      </Typography>
                                    </Alert>
                                  )}

                                  {/* Detailed data */}
                                  <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                      Changes:
                                    </Typography>
                                    <Stack spacing={0.5}>
                                      {Object.entries(mutation.data).slice(0, 5).map(([key, value]) => (
                                        <Box key={key} sx={{ display: 'flex', gap: 1 }}>
                                          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 120 }}>
                                            {key}:
                                          </Typography>
                                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                                            {typeof value === 'number' && key.toLowerCase().includes('cost') || key.toLowerCase().includes('amount')
                                              ? `$${value.toLocaleString()}`
                                              : typeof value === 'object'
                                              ? JSON.stringify(value).substring(0, 50) + '...'
                                              : String(value)}
                                          </Typography>
                                        </Box>
                                      ))}
                                      {Object.keys(mutation.data).length > 5 && (
                                        <Typography variant="caption" color="text.secondary">
                                          ... and {Object.keys(mutation.data).length - 5} more fields
                                        </Typography>
                                      )}
                                    </Stack>
                                  </Box>

                                  {mutation.linkedMutations.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 1,
                                          cursor: 'pointer',
                                          '&:hover': { opacity: 0.7 }
                                        }}
                                        onClick={() => toggleLinksExpansion(mutation.id)}
                                      >
                                        <LinkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                        <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                                          {mutation.linkedMutations.length} cross-suite {mutation.linkedMutations.length === 1 ? 'link' : 'links'}
                                        </Typography>
                                        <IconButton size="small" sx={{ p: 0 }}>
                                          {expandedLinks.has(mutation.id) ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
                                        </IconButton>
                                      </Box>
                                      <Collapse in={expandedLinks.has(mutation.id)}>
                                        <Stack spacing={0.5} sx={{ mt: 1, pl: 3, borderLeft: '2px solid', borderColor: 'primary.main' }}>
                                          {mutation.linkedMutations.map((linkedId) => {
                                            const linkedMutation = mutations.find(m => m.id === linkedId);
                                            if (!linkedMutation) {
                                              return (
                                                <Typography key={linkedId} variant="caption" color="text.secondary">
                                                  {linkedId}
                                                </Typography>
                                              );
                                            }
                                            return (
                                              <Box key={linkedId} sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip
                                                  label={linkedMutation.suite}
                                                  size="small"
                                                  variant="filled"
                                                  sx={{ height: 18, fontSize: '10px', fontWeight: 600 }}
                                                />
                                                <Chip
                                                  label={linkedMutation.operation}
                                                  size="small"
                                                  color={linkedMutation.operation === 'CREATE' ? 'success' : linkedMutation.operation === 'UPDATE' ? 'warning' : 'error'}
                                                  sx={{ height: 18, fontSize: '10px' }}
                                                />
                                                <Typography variant="caption" sx={{ fontSize: '11px' }}>
                                                  {linkedMutation.displayName}
                                                </Typography>
                                              </Box>
                                            );
                                          })}
                                        </Stack>
                                      </Collapse>
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </Paper>
                          ))}
                        </Stack>
                      </Collapse>
                    </Paper>
                  );
                })}
              </Stack>
            </Box>
          )
        }
      />

      {/* Knowledge Document Modal */}
      <Dialog
        open={selectedDocId !== null}
        onClose={handleCloseDocument}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh', borderRadius: '16px' }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DescriptionIcon color="primary" />
            <Box>
              <Typography variant="h6">
                {workspaceDemoService.getGeneratedDocuments().find(d => d.id === selectedDocId)?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Agent Studio Knowledge Base • Markdown
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{
            '& h1': { fontSize: '1.75rem', fontWeight: 700, mb: 2, mt: 3 },
            '& h2': { fontSize: '1.5rem', fontWeight: 600, mb: 1.5, mt: 2.5 },
            '& h3': { fontSize: '1.25rem', fontWeight: 600, mb: 1, mt: 2 },
            '& p': { mb: 1.5, lineHeight: 1.7 },
            '& ul, & ol': { pl: 3, mb: 1.5 },
            '& li': { mb: 0.5 },
            '& table': { width: '100%', borderCollapse: 'collapse', mb: 2 },
            '& th': { textAlign: 'left', borderBottom: '2px solid', borderColor: 'divider', p: 1, fontWeight: 600 },
            '& td': { borderBottom: '1px solid', borderColor: 'divider', p: 1 },
            '& code': { bgcolor: 'action.hover', p: 0.5, borderRadius: 0.5, fontFamily: 'monospace', fontSize: '0.875rem' },
            '& hr': { my: 3, borderColor: 'divider' },
            '& strong': { fontWeight: 600 },
          }}>
            <ReactMarkdown>{documentContent}</ReactMarkdown>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid', borderColor: 'divider', px: 3, py: 2 }}>
          <Button onClick={handleCloseDocument}>
            Close
          </Button>
          <Button variant="contained" onClick={handleCloseDocument}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentWorkspaceDemoPage;
