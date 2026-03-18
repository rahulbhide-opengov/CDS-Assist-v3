/**
 * UnifiedChatInterface
 *
 * 3-panel chat interface combining OG Assist conversation features
 * with the workspace layout structure.
 *
 * Layout:
 * - Left panel: Agent selector + conversation history
 * - Center: Rich conversation with streaming, tool calls, card rendering
 * - Right panel: Tasks/Agenda
 */

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Drawer,
} from '@mui/material';
import { AIPromptInput } from '@opengov/components-ai-patterns';
import { PageLast } from '@opengov/react-capital-assets/icons';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useUnifiedChat } from '../../contexts/UnifiedChatContext';
import { OGAssistConversation } from '../OGAssist/OGAssistConversation';
import { AgentSelector } from '../OGAssist/AgentSelector';
import { AIActionsPanel } from './AIActionsPanel';

interface UnifiedChatInterfaceProps {
  onClose?: () => void;
  onToggleDock?: () => void;
  onToggleFullscreen?: () => void;
  isDocked?: boolean;
  isFullscreen?: boolean;
  showWorkspaces?: boolean;
  showTasks?: boolean;
  onWorkspacesChange?: (show: boolean) => void;
  onTasksChange?: (show: boolean) => void;
  workspacesWidth?: number;
  tasksWidth?: number;
  onResizeStart?: (panel: 'workspaces' | 'tasks' | 'docked', e: React.MouseEvent) => void;
  isMobile?: boolean;
}

export const UnifiedChatInterface: React.FC<UnifiedChatInterfaceProps> = ({
  onClose,
  onToggleDock,
  onToggleFullscreen,
  isDocked = false,
  isFullscreen = false,
  showWorkspaces: externalShowWorkspaces,
  showTasks: externalShowTasks,
  onWorkspacesChange,
  onTasksChange,
  workspacesWidth = 400,
  tasksWidth = 450,
  onResizeStart,
  isMobile = false,
}) => {
  // Context
  const {
    conversation,
    isLoading,
    thinkingMessage,
    selectedAgent,
    conversationHistory,
    activeConversationId,
    setSelectedAgent,
    sendMessage,
    createNewConversation,
    setActiveConversation,
    // AI Actions
    aiActions,
    aiActionGroups,
    addAiAction,
    approveAiAction,
    rejectAiAction,
    undoAiAction,
    approveAllAiActions,
  } = useUnifiedChat();

  // Local panel state (fallback if not controlled externally)
  const [internalShowWorkspaces, setInternalShowWorkspaces] = useState(!onClose);
  const [internalShowTasks, setInternalShowTasks] = useState(!onClose);

  // Mobile history drawer state
  const [mobileHistoryOpen, setMobileHistoryOpen] = useState(false);

  // Use external state if provided
  const showWorkspaces = externalShowWorkspaces !== undefined ? externalShowWorkspaces : internalShowWorkspaces;
  const showTasks = externalShowTasks !== undefined ? externalShowTasks : internalShowTasks;

  const handleToggleWorkspaces = (show: boolean) => {
    if (onWorkspacesChange) {
      onWorkspacesChange(show);
    } else {
      setInternalShowWorkspaces(show);
    }
  };

  const handleToggleTasks = (show: boolean) => {
    if (onTasksChange) {
      onTasksChange(show);
    } else {
      setInternalShowTasks(show);
    }
  };

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmitMessage = async (prompt: string) => {
    await sendMessage(prompt);
    // Scroll to bottom after sending
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        bgcolor: 'background.secondary',
        height: '100%',
        width: '100%',
      }}
    >
      {/* ================================================================== */}
      {/* Left Panel - Agent Selector + Conversation History */}
      {/* ================================================================== */}
      <Box
        sx={{
          width: showWorkspaces ? workspacesWidth : 0,
          minWidth: showWorkspaces ? workspacesWidth : 0,
          maxWidth: showWorkspaces ? workspacesWidth : 0,
          display: 'flex',
          flexDirection: 'row',
          bgcolor: 'background.secondary',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {showWorkspaces && (
          <>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              {/* Header */}
              <Box
                sx={{
                  height: '48px',
                  px: 2,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                  AI Assistant
                </Typography>
                <IconButton size="small" onClick={() => handleToggleWorkspaces(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Agent Selector */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <AgentSelector
                  selectedAgent={selectedAgent}
                  onAgentChange={setSelectedAgent}
                />
              </Box>

              {/* New Chat Button */}
              <Box sx={{ p: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={createNewConversation}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  }}
                >
                  New Chat
                </Button>
              </Box>

              <Divider />

              {/* Conversation History List */}
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', fontWeight: 600, px: 2, py: 1, display: 'block' }}
                >
                  Recent Conversations
                </Typography>
                <List dense disablePadding>
                  {/* Sample conversations */}
                  {[
                    { id: '1', title: 'RFP Section Requirements', time: '2 min ago' },
                    { id: '2', title: 'Budget variance analysis Q4', time: '15 min ago' },
                    { id: '3', title: 'Vendor qualification criteria', time: '1 hour ago' },
                    { id: '4', title: 'Contract terms review', time: '2 hours ago' },
                    { id: '5', title: 'Procurement timeline planning', time: 'Yesterday' },
                    { id: '6', title: 'Compliance checklist', time: 'Yesterday' },
                    { id: '7', title: 'Award notification draft', time: '2 days ago' },
                    { id: '8', title: 'Bid evaluation matrix', time: '3 days ago' },
                  ].map((conv) => (
                    <ListItemButton
                      key={conv.id}
                      selected={conv.id === '1'}
                      onClick={() => setActiveConversation(conv.id)}
                      sx={{
                        py: 1,
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemText
                        primary={conv.title}
                        secondary={conv.time}
                        primaryTypographyProps={{
                          variant: 'body2',
                          sx: {
                            fontWeight: conv.id === '1' ? 600 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                        secondaryTypographyProps={{
                          variant: 'caption',
                          sx: { color: 'text.disabled' },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Box>

            {/* Resize Handle - Workspaces */}
            {onResizeStart && (
              <Box
                onMouseDown={(e) => onResizeStart('workspaces', e)}
                sx={{
                  width: '8px',
                  cursor: 'col-resize',
                  bgcolor: 'divider',
                  '&:hover': {
                    bgcolor: 'rgb(100, 116, 139)',
                  },
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
              />
            )}
          </>
        )}
      </Box>

      {/* ================================================================== */}
      {/* Center - Main Chat Area */}
      {/* ================================================================== */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minWidth: 0,
        }}
      >
        {/* Chat Header with Panel Toggle Buttons */}
        <Box
          id="chat-drag-handle"
          sx={{
            height: '48px',
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.secondary',
            width: '100%',
            cursor: onClose && !isMobile ? 'move' : 'default',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => isMobile ? setMobileHistoryOpen(true) : handleToggleWorkspaces(true)}
            sx={{
              textTransform: 'none',
              minWidth: 100,
              visibility: !isMobile && showWorkspaces ? 'hidden' : 'visible',
            }}
          >
            History
          </Button>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {/* Hide dock and fullscreen buttons on mobile */}
            {!isMobile && onToggleDock && (
              <IconButton
                size="small"
                onClick={onToggleDock}
                sx={{
                  transform: isDocked ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                }}
              >
                <PageLast fontSize="small" />
              </IconButton>
            )}
            {!isMobile && onToggleFullscreen && !isDocked && (
              <IconButton size="small" onClick={onToggleFullscreen}>
                {isFullscreen ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
              </IconButton>
            )}
            {onClose && (
              <IconButton size="small" onClick={onClose}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Chat Messages Area - Using OGAssistConversation */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            width: '100%',
            p: 2,
            bgcolor: 'background.secondary',
          }}
        >
          <Box sx={{ maxWidth: 900, width: '100%', mx: 'auto' }}>
            <OGAssistConversation
              conversation={conversation}
              isLoading={isLoading}
              thinkingMessage={thinkingMessage}
              onMessageCopy={(msg) => navigator.clipboard.writeText(msg.content || '')}
              onSendMessage={handleSubmitMessage}
              onAddAiAction={(action) => {
                addAiAction({
                  type: action.type,
                  target: { sectionTitle: action.sectionTitle },
                  payload: {
                    content: action.content,
                    previewContent: action.previewContent,
                  },
                  metadata: {
                    agentName: action.agentName,
                    stepName: action.stepName,
                  },
                  autoApply: !action.requiresApproval,
                });
              }}
            />
            <div ref={messagesEndRef} />
          </Box>
        </Box>

        {/* Chat Input Area */}
        <Box
          sx={{
            p: 2,
            pb: 0,
            bgcolor: 'background.secondary',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <AIPromptInput
            placeholder="Ask me about your..."
            onSubmit={handleSubmitMessage}
            isLoading={isLoading}
            onCancelResponse={isLoading ? () => { } : undefined}
            minRows={1}
            maxRows={4}
          />
        </Box>

        {/* Disclaimer */}
        <Box sx={{ width: '100%', bgcolor: 'background.secondary', py: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            AI can make mistakes. Please carefully check all outputs.
          </Typography>
        </Box>
      </Box>

      {/* ================================================================== */}
      {/* Right Panel - AI Actions Audit Workspace */}
      {/* ================================================================== */}
      <Box
        sx={{
          width: showTasks ? tasksWidth : 0,
          minWidth: showTasks ? tasksWidth : 0,
          maxWidth: showTasks ? tasksWidth : 0,
          display: 'flex',
          flexDirection: 'row',
          bgcolor: 'background.secondary',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {showTasks && (
          <>
            {/* Resize Handle - Tasks */}
            {onResizeStart && (
              <Box
                onMouseDown={(e) => onResizeStart('tasks', e)}
                sx={{
                  width: '8px',
                  cursor: 'col-resize',
                  bgcolor: 'divider',
                  '&:hover': {
                    bgcolor: 'rgb(100, 116, 139)',
                  },
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
              />
            )}

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.secondary',
                boxSizing: 'border-box',
                overflow: 'hidden',
              }}
            >
              {/* Header with close button */}
              <Box
                sx={{
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  px: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <IconButton size="small" onClick={() => handleToggleTasks(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* AI Actions Panel */}
              <AIActionsPanel
                actions={aiActions}
                actionGroups={aiActionGroups}
                onApprove={approveAiAction}
                onReject={rejectAiAction}
                onUndo={undoAiAction}
                onApproveAll={approveAllAiActions}
              />
            </Box>
          </>
        )}
      </Box>

      {/* Mobile History Drawer */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileHistoryOpen}
          onClose={() => setMobileHistoryOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: '85%',
                maxWidth: 360,
                bgcolor: 'background.secondary',
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box
              sx={{
                height: '48px',
                px: 2,
                py: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                AI Assistant
              </Typography>
              <IconButton size="small" onClick={() => setMobileHistoryOpen(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Agent Selector */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <AgentSelector
                selectedAgent={selectedAgent}
                onAgentChange={setSelectedAgent}
              />
            </Box>

            {/* New Chat Button */}
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={() => {
                  createNewConversation();
                  setMobileHistoryOpen(false);
                }}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                New Chat
              </Button>
            </Box>

            <Divider />

            {/* Conversation History List */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 600, px: 2, py: 1, display: 'block' }}
              >
                Recent Conversations
              </Typography>
              <List dense disablePadding>
                {[
                  { id: '1', title: 'RFP Section Requirements', time: '2 min ago' },
                  { id: '2', title: 'Budget variance analysis Q4', time: '15 min ago' },
                  { id: '3', title: 'Vendor qualification criteria', time: '1 hour ago' },
                  { id: '4', title: 'Contract terms review', time: '2 hours ago' },
                  { id: '5', title: 'Procurement timeline planning', time: 'Yesterday' },
                  { id: '6', title: 'Compliance checklist', time: 'Yesterday' },
                  { id: '7', title: 'Award notification draft', time: '2 days ago' },
                  { id: '8', title: 'Bid evaluation matrix', time: '3 days ago' },
                ].map((conv) => (
                  <ListItemButton
                    key={conv.id}
                    selected={conv.id === '1'}
                    onClick={() => {
                      setActiveConversation(conv.id);
                      setMobileHistoryOpen(false);
                    }}
                    sx={{
                      py: 1,
                      px: 2,
                      '&.Mui-selected': {
                        bgcolor: 'action.selected',
                      },
                    }}
                  >
                    <ListItemText
                      primary={conv.title}
                      secondary={conv.time}
                      primaryTypographyProps={{
                        variant: 'body2',
                        sx: {
                          fontWeight: conv.id === '1' ? 600 : 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        },
                      }}
                      secondaryTypographyProps={{
                        variant: 'caption',
                        sx: { color: 'text.disabled' },
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default UnifiedChatInterface;
