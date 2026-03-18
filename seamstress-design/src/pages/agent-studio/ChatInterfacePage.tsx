/**
 * ChatInterfacePage - Multi-panel chat interface with workspaces and tasks
 * Based on Figma design with three sections: Workspaces, Chat, Tasks
 */

import React, { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentName?: string;
  skills?: string[];
  title?: string;
}
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Checkbox,
  Select,
  MenuItem,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  Avatar,
  AvatarGroup,
} from '@mui/material';
import { AIPromptInput, AIConversation } from '@opengov/components-ai-patterns';
import { AIResponseTemplate } from '../../components/AIResponseTemplate';
import { PageLast } from '@opengov/react-capital-assets/icons';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LinkIcon from '@mui/icons-material/Link';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

// Mock data for workspaces
const mockWorkspaces = [
  { id: 1, title: 'Project Alpha Discussion', timestamp: 'now' },
  { id: 2, title: 'Design Review Notes', timestamp: '2m ago' },
  { id: 3, title: 'Sprint Planning', timestamp: '1h ago' },
  { id: 4, title: 'Customer Feedback', timestamp: '3h ago' },
  { id: 5, title: 'Technical Specs', timestamp: 'yesterday' },
];

// Mock data for tasks
const mockTasks = [
  { id: 1, agent: 'B&P Agent', action: 'Update' },
  { id: 2, agent: 'EAM Agent', action: 'Delete' },
  { id: 3, agent: 'PLC Agent', action: 'Create' },
  { id: 4, agent: 'B&P Agent', action: 'Update' },
  { id: 5, agent: 'Finance Agent', action: 'Create' },
  { id: 6, agent: 'EAM Agent', action: 'Update' },
  { id: 7, agent: 'PLC Agent', action: 'Delete' },
  { id: 8, agent: 'B&P Agent', action: 'Create' },
  { id: 9, agent: 'Finance Agent', action: 'Update' },
];

// Mock chat messages
const mockMessages = [
  {
    id: '1',
    role: 'user' as const,
    content: 'Can you explain the design principles for our system?',
  },
  {
    id: '2',
    role: 'assistant' as const,
    agentName: 'Design Agent',
    skills: ['Design Systems', 'UX Principles', 'Documentation', 'Best Practices'],
    title: 'Design System Principles Overview',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sagittis, nulla in sagittis luctus, lectus lorem elementum mauris, id aliquam ante nisi nec lectus. Integer commodo, sapien a vestibulum vehicula, orci est vestibulum eros, nec tincidunt elit magna ut urna. Duis sit amet consequat sapien. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.

## Section 1: Overview

**Purpose**

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur suscipit, elit in suscipit porttitor, felis est tincidunt sem, vel blandit libero sem sed est.

## Section 2: Design Principles

### A. Consistency

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur varius, enim at luctus convallis, augue urna volutpat magna, at tincidunt libero augue in ipsum.

### B. Accessibility

- Vivamus sodales euismod velit vel placerat.
- Nunc quis felis nec neque congue aliquet.
- Suspendisse faucibus, libero a tempor cursus, elit sem sagittis est, nec dignissim ex urna vel dolor.

### C. Scalability

1. Quisque in ex ac augue bibendum luctus.
2. Ut at urna at sapien cursus vehicula.
3. Sed at nunc at est sodales ultrices ac in ante.`,
  },
];

interface ChatInterfacePageProps {
  onClose?: () => void;
  dragHandleRef?: React.RefObject<HTMLDivElement>;
  onToggleFullscreen?: () => void;
  onToggleDock?: () => void;
  isFullscreen?: boolean;
  isDocked?: boolean;
  showWorkspaces?: boolean;
  showTasks?: boolean;
  onWorkspacesChange?: (show: boolean) => void;
  onTasksChange?: (show: boolean) => void;
  workspacesWidth?: number;
  tasksWidth?: number;
  onResizeStart?: (panel: 'workspaces' | 'tasks', e: React.MouseEvent) => void;
}

const ChatInterfacePage: React.FC<ChatInterfacePageProps> = ({
  onClose,
  dragHandleRef,
  onToggleFullscreen,
  onToggleDock,
  isFullscreen,
  isDocked,
  showWorkspaces: externalShowWorkspaces,
  showTasks: externalShowTasks,
  onWorkspacesChange,
  onTasksChange,
  workspacesWidth = 400,
  tasksWidth = 450,
  onResizeStart
}) => {
  // When used as modal (onClose exists), start with panels closed
  const [internalShowWorkspaces, setInternalShowWorkspaces] = useState(!onClose);
  const [internalShowTasks, setInternalShowTasks] = useState(!onClose);

  // Use external state if provided, otherwise use internal state
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
  const [activeTab, setActiveTab] = useState<'tasks' | 'agenda'>('tasks');
  const [selectedRows, setSelectedRows] = useState<number[]>([1]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedRows.length === mockTasks.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockTasks.map((task) => task.id));
    }
  };

  const handleSubmitMessage = async (prompt: string) => {
    console.log('Sending message:', prompt);
    setIsLoading(true);
    // Simulate AI response delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelResponse = () => {
    setIsLoading(false);
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
      {/* Left Sidebar - Workspaces Panel */}
      {showWorkspaces && (
        <>
          <Box
            sx={{
              width: workspacesWidth,
              minWidth: workspacesWidth,
              maxWidth: workspacesWidth,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.secondary',
              boxSizing: 'border-box',
              overflow: 'hidden',
              '& *': {
                boxSizing: 'border-box',
              },
            }}
          >
            {/* Workspaces Header */}
            <Box
              sx={{
                height: '53px',
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
                Workspaces
              </Typography>
              <IconButton size="small" onClick={() => handleToggleWorkspaces(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* New Workspace Button */}
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                }}
              >
                New Workspace
              </Button>
            </Box>

            {/* Workspace List */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
              {mockWorkspaces.map((workspace) => (
                <Paper
                  key={workspace.id}
                  sx={{
                    px: 2,
                    py: 1,
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body2"
                    >
                      {workspace.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {workspace.timestamp}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
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

      {/* Center - Main Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Chat Header with Panel Toggle Buttons */}
        <Box
          id="chat-drag-handle"
          ref={dragHandleRef}
          sx={{
            height: '53px',
            px: 2,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.secondary',
            width: '100%',
            cursor: onClose ? 'move' : 'default',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleToggleWorkspaces(true)}
            sx={{
              textTransform: 'none',
              minWidth: 100,
              visibility: showWorkspaces ? 'hidden' : 'visible'
            }}
          >
            Workspaces
          </Button>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleToggleTasks(true)}
              sx={{
                textTransform: 'none',
                minWidth: 100,
                visibility: showTasks ? 'hidden' : 'visible'
              }}
            >
              Tasks
            </Button>
            {onToggleDock && (
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
            {onToggleFullscreen && !isDocked && (
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

        {/* Chat Messages Area */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '100%',
            p: 2,
            bgcolor: 'background.secondary',
          }}
        >
          {mockMessages.map((message) => (
            <Box maxWidth={900} width={'100%'} key={message.id} sx={{ mb: 3 }}>
              {message.role === 'user' ? (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    }}
                  >
                    <Typography variant="body2">
                      {message.content}
                    </Typography>
                  </Paper>
                </Box>
              ) : (
                <AIResponseTemplate
                  responseId={message.id}
                  agentName={message.agentName || 'Agent'}
                  skills={message.skills || []}
                  title={message.title || 'Response'}
                  content={message.content}
                  onCopy={() => {
                    navigator.clipboard.writeText(message.content);
                    console.log('Response copied');
                  }}
                  onFeedback={(type, comment, tags) => {
                    console.log('Feedback:', type, comment, tags);
                  }}
                  showAcceptReject={false}
                />
              )}
            </Box>
          ))}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Generating response...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Chat Input Area */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.secondary',
            maxWidth: '600px',
            width: '100%',
          }}
        >
          <AIPromptInput
            placeholder="Ask me about your..."
            onSubmit={handleSubmitMessage}
            isLoading={isLoading}
            onCancelResponse={isLoading ? handleCancelResponse : undefined}
            minRows={1}
            maxRows={4}
          />
        </Box>

        {/* Chat Footer */}
        <Box
          sx={{
            height: '53px',
            px: 2,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.secondary',
            width: '100%',
          }}
        >
          {/* Left side - Avatar Group */}
          <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.875rem' } }}>
            <Avatar alt="User 1" sx={{ bgcolor: 'primary.main' }}>U1</Avatar>
            <Avatar alt="User 2" sx={{ bgcolor: 'secondary.main' }}>U2</Avatar>
            <Avatar alt="User 3" sx={{ bgcolor: 'success.main' }}>U3</Avatar>
          </AvatarGroup>

          {/* Right side - Buttons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              variant="text"
              size="small"
              startIcon={<LinkIcon />}
              sx={{ textTransform: 'none' }}
            >
              Workspace title 1
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Invite
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar - Tasks/Agenda Panel */}
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
              width: tasksWidth,
              minWidth: tasksWidth,
              maxWidth: tasksWidth,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.secondary',
              boxSizing: 'border-box',
              overflow: 'hidden',
              '& *': {
                boxSizing: 'border-box',
              },
            }}
          >
            {/* Tasks Header with Breadcrumbs */}
            <Box
              sx={{
                height: '53px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Box component="nav" aria-label="Breadcrumb">
                <Breadcrumbs
                  separator={<NavigateNextIcon fontSize="small" />}
                >
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setActiveTab('tasks')}
                    sx={{
                      textDecoration: 'none',
                      color: activeTab === 'tasks' ? 'text.primary' : 'text.secondary',
                      fontWeight: activeTab === 'tasks' ? 600 : 400,
                      cursor: 'pointer',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Tasks
                  </Link>
                  <Typography
                    variant="body2"
                    aria-current="page"
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                    }}
                  >
                    Agenda title 1
                  </Typography>
                </Breadcrumbs>
              </Box>
              <IconButton size="small" onClick={() => handleToggleTasks(false)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Search Bar */}
            <Box sx={{ p: 2 }}>
              <TextField
                size="medium"
                placeholder="Search for Title, ID, Contact, Vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }
                }}
              />
            </Box>

            {/* Action Bar */}
            <Box
              sx={{
                px: 2,
                pb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {selectedRows.length} selected
              </Typography>
              <Select
                size="small"
                defaultValue="approve"
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="approve">APPROVE</MenuItem>
                <MenuItem value="reject">REJECT</MenuItem>
                <MenuItem value="pending">PENDING</MenuItem>
              </Select>
            </Box>

            {/* Tasks Table */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', px: 2 }}>
              <TableContainer sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedRows.length === mockTasks.length &&
                            mockTasks.length > 0
                          }
                          indeterminate={
                            selectedRows.length > 0 &&
                            selectedRows.length < mockTasks.length
                          }
                          onChange={handleToggleAll}
                        />
                      </TableCell>
                      <TableCell>Agent</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockTasks.map((task) => (
                      <TableRow
                        key={task.id}
                        hover
                        selected={selectedRows.includes(task.id)}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedRows.includes(task.id)}
                            onChange={() => handleToggleRow(task.id)}
                          />
                        </TableCell>
                        <TableCell>{task.agent}</TableCell>
                        <TableCell>{task.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Pagination Footer */}
            <Box
              sx={{
                px: 2,
                height: '53px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="caption" color="text.secondary">
                1 to 9 of 102
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Page 1 of 12
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ChatInterfacePage;
