import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Chip,
  useTheme,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import {
  AIPromptInput,
  AIDisclaimer,
} from '@opengov/components-ai-patterns';
import type { Message } from '@opengov/components-ai-patterns';
import { OGAssistQuickActions } from './OGAssistQuickActions';
import { OGAssistConversation } from './OGAssistConversation';
import { useOGAssist } from '../../hooks/useOGAssist';
import { AGENT_TYPES } from '../../services/agents/agentTypes';

interface OGAssistModalProps {
  open: boolean;
  onClose: () => void;
  onVisualizationAdd?: (widgetData: any) => void;
}

export const OGAssistModal: React.FC<OGAssistModalProps> = ({ open, onClose, onVisualizationAdd }) => {
  const theme = useTheme();
  const {
    conversation,
    isLoading,
    thinkingMessage,
    selectedAgent,
    setSelectedAgent,
    sendMessage,
    createNewConversation,
    conversationHistory,
    activeConversationId,
    setActiveConversation,
  } = useOGAssist();

  const [inputValue, setInputValue] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  const activeAgent = AGENT_TYPES[selectedAgent];
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dockedSide, setDockedSide] = useState<'left' | 'right' | null>(null);
  const conversationContainerRef = useRef<HTMLDivElement>(null);

  // Simple scroll to bottom - only when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (!conversationContainerRef.current) return;

    // Use setTimeout to ensure DOM has updated
    setTimeout(() => {
      const container = conversationContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }, []);

  // Scroll when new messages are added (not on every render)
  useEffect(() => {
    if (conversation?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [conversation?.messages?.length, scrollToBottom]);

  // Simple keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to close modal (when not typing)
      if (e.key === 'Escape' && document.activeElement?.tagName !== 'TEXTAREA') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setInputValue(''); // Clear only after successful send
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [sendMessage, scrollToBottom]);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    handleSendMessage(action);
  }, [handleSendMessage]);

  const handleMessageCopy = (message: Message) => {
    navigator.clipboard.writeText(message.content);
  };

  const handleCardAction = useCallback(async (action: string, data?: any) => {
    // Handle different actions based on the current agent
    if (action === 'addVisualization') {
      // Handle adding visualization to dashboard (for EAM Dashboard agent)
      if (onVisualizationAdd) {
        onVisualizationAdd(data);
      }
    } else if (selectedAgent === 'eamScheduler') {
      if (action === 'acceptSchedule') {
        // Send message to accept and proceed to publish
        handleSendMessage('Accept and publish the schedule');
      } else if (action === 'rejectSchedule') {
        // Send message with rejection reason
        const reason = data?.reason || 'I need to make changes to the schedule';
        handleSendMessage(`Reject: ${reason}`);
      } else if (action === 'modifySchedule') {
        // Request modifications
        handleSendMessage('I need to modify the schedule');
      }
    } else if (selectedAgent === 'buildingCode' || selectedAgent === 'buildingCodeGenUX') {
      if (action === 'approve') {
        // Handle approval for permit application
        handleSendMessage('Yes, create the draft');
      } else if (action === 'reject') {
        // Handle rejection
        handleSendMessage('No, let me modify the details first');
      } else if (action === 'submit') {
        // Handle form submission (e.g., from DeckConfigCard)
        const { width, length, attachment, height } = data || {};
        handleSendMessage(`Check requirements for a ${width}x${length} ${attachment} deck at ${height} inches high`);
      }
    }
  }, [selectedAgent, handleSendMessage, onVisualizationAdd]);

  // Simplified conversation without complex rendering
  const enhancedConversation = useMemo(() => {
    return conversation;
  }, [conversation]);

  // Handle dock toggle
  const handleDockToggle = (side: 'left' | 'right') => {
    if (dockedSide === side) {
      // If already docked to this side, undock
      setDockedSide(null);
      setIsFullscreen(false);
    } else {
      // Dock to the specified side
      setDockedSide(side);
      setIsFullscreen(false);
    }
  };


  return (
    <Dialog
        open={open}
        onClose={onClose}
        maxWidth={false}
        PaperComponent={Paper}
        PaperProps={{
          sx: {
            position: 'fixed',
          ...(dockedSide === 'left' ? {
            top: 0,
            left: 0,
            transform: 'none',
            width: '600px',
            height: '100vh',
            maxWidth: '600px',
            maxHeight: '100vh',
            m: 0,
            borderRadius: 0,
          } : dockedSide === 'right' ? {
            top: 0,
            right: 0,
            left: 'auto',
            transform: 'none',
            width: '600px',
            height: '100vh',
            maxWidth: '600px',
            maxHeight: '100vh',
            m: 0,
            borderRadius: 0,
          } : isFullscreen ? {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100vw',
            height: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            m: 0,
            borderRadius: 0,
          } : {
            width: '1014px',
            height: '755px',
            maxHeight: 'calc(100vh - 120px)',
            m: 0,
            borderRadius: 1,
          }),
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'row',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Left Sidebar - History */}
      {showHistory && (
        <Box
          sx={{
            width: '352px',
            height: '100%',
            borderRight: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              height: '58px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>
              History
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowHistory(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Agent Selection and History */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {/* Agent Selector */}
            <Box sx={{ px: 2, pt: 2, pb: 1 }}>
              <FormControl fullWidth size="small">
                <Select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  IconComponent={ExpandMoreIcon}
                  displayEmpty
                  sx={{
                    height: 36,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 1,
                    },
                    '& .MuiSelect-select': {
                      color: 'primary.main',
                      fontSize: '14px',
                      py: 1,
                      display: 'flex',
                      alignItems: 'center',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {Object.values(AGENT_TYPES).map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: agent.color,
                          }}
                        />
                        {agent.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Conversation History */}
            <Box sx={{ px: 2, pt: 2 }}>
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: 1,
                  bgcolor: 'action.selected',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: '14px', fontWeight: 500, mb: 0.25 }}>
                    Introducing Agents
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                    now
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                  <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'text.secondary' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Main Chat Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: showHistory ? '662px' : '100%',
        }}
      >
        {/* Header */}
        <Box
          id="draggable-dialog-title"
          sx={{
            height: '58px',
            minHeight: '58px',
            maxHeight: '58px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 1,
            cursor: 'default',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {!showHistory && (
              <IconButton
                onClick={() => setShowHistory(true)}
                sx={{
                  width: 36,
                  height: 36,
                  '& .MuiSvgIcon-root': { fontSize: 18 }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              onClick={() => handleDockToggle('left')}
              sx={{
                width: 36,
                height: 36,
                bgcolor: dockedSide === 'left' ? 'action.selected' : 'transparent',
                '& .MuiSvgIcon-root': { fontSize: 18 }
              }}
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDockToggle('right')}
              sx={{
                width: 36,
                height: 36,
                bgcolor: dockedSide === 'right' ? 'action.selected' : 'transparent',
                '& .MuiSvgIcon-root': { fontSize: 18 }
              }}
            >
              <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setIsFullscreen(!isFullscreen);
                setDockedSide(null);
              }}
              sx={{
                width: 36,
                height: 36,
                '& .MuiSvgIcon-root': { fontSize: 18 }
              }}
            >
              {isFullscreen ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
            </IconButton>
            <IconButton
              sx={{
                width: 36,
                height: 36,
                '& .MuiSvgIcon-root': { fontSize: 18 }
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        {/* Chat Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Main Content with scroll container */}
          <Box
            ref={conversationContainerRef}
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              px: 2,
              py: 3,
              display: 'flex',
              flexDirection: 'column',
              // Maintain minimum height to prevent collapse
              minHeight: 0,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                bgcolor: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                bgcolor: 'divider',
                borderRadius: 1,
              },
            }}
          >

            {/* Conversation container - always rendered */}
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flexGrow: 1 }}>
              {conversation.messages.length === 0 ? (
                // Quick Actions when no messages
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    gap: 3,
                  }}
                >
                  <OGAssistQuickActions onActionClick={handleQuickAction} />
                </Box>
              ) : (
                // Messages when conversation exists
                <>
                  <Box sx={{ flexShrink: 0 }}>
                    <OGAssistConversation
                      conversation={enhancedConversation}
                      isLoading={isLoading}
                      thinkingMessage={thinkingMessage}
                      onMessageCopy={handleMessageCopy}
                      showCopyButton={() => true}
                      onCardAction={handleCardAction}
                    />
                  </Box>
                  {/* Spacer to maintain scroll position */}
                  <Box sx={{ flexGrow: 1, minHeight: '1px' }} />
                </>
              )}
            </Box>
          </Box>

          {/* Input Area with Agent Selector */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              flexShrink: 0,
              bgcolor: 'background.paper',
            }}
          >
            <ThemeProvider theme={theme}>
            <AIPromptInput
              value={inputValue}
              onChange={handleInputChange}
              onSubmit={handleSendMessage}
              isLoading={isLoading}
              onCancelResponse={undefined}
              disabled={false}
              placeholder={`Ask ${AGENT_TYPES[selectedAgent]?.name || 'your agent'} a question...`}
              minRows={1}
              maxRows={3}
              showFileInput={false}
              customActionItems={[
                <Select
                  key="agent-selector"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  variant="standard"
                  IconComponent={ExpandMoreIcon}
                  disableUnderline
                  size="small"
                  sx={{
                    minWidth: 120,
                    ml: 1,
                    mr: 1,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      fontSize: '13px',
                      fontWeight: 500,
                      color: 'text.primary',
                      py: 0.5,
                      pr: 3,
                    },
                    '& .MuiSvgIcon-root': {
                      fontSize: '18px',
                      color: 'text.secondary',
                      right: 4,
                    },
                    '&:before': {
                      borderBottom: 'none',
                    },
                    '&:hover:not(.Mui-disabled):before': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {Object.values(AGENT_TYPES).map((agent) => (
                    <MenuItem key={agent.id} value={agent.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: agent.color,
                            flexShrink: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: '13px', lineHeight: 1 }}>{agent.name}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>,
              ]}
              ariaLabels={{
                input: 'Message OG Assist',
                sendButton: 'Send message',
                stopButton: 'Stop generating response',
                fileButton: 'Attach files',
                clearButton: 'Clear input',
              }}
              dataTest="og-assist-input"
            />
            </ThemeProvider>
          </Box>

          {/* AI Disclaimer */}
          <Box
            sx={{
              height: '40px',
              minHeight: '40px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'background.default',
              pb: 2, // 16px padding below
            }}
          >
            <AIDisclaimer
              backgroundColor={theme.palette.background.default}
              textAndIconColor={theme.palette.text.secondary}
            />
          </Box>
        </Box>
      </Box>

    </Dialog>
  );
};

