import React, { useState, useEffect, useRef } from 'react';
import { Box, Stack, Chip, Typography, IconButton, Fade, Grow } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { EAMCardRenderer } from './EAMCardRenderer';
import { InspectionCardRenderer } from '../InspectionScheduler';
import { GenUXMessageRenderer } from './GenUXMessageRenderer';
import { ChatVisualization } from './ChatVisualization';
import { DocumentActionCard } from './DocumentActionCard';
import type { DocumentAction, PreviewContent } from './DocumentActionCard';
import { renderContentWithCitations } from './KnowledgeCitation';
import { FeedbackDialog, FeedbackToast } from './FeedbackDialog';
import type { FeedbackType, FeedbackData } from './FeedbackDialog';
import { FeedbackCard } from './cards/FeedbackCard';
import { SuggestedActionsBar } from './SuggestedActionsBar';
import type { Conversation, Message } from '@opengov/components-ai-patterns';

interface OGAssistConversationProps {
  conversation: Conversation;
  isLoading: boolean;
  thinkingMessage?: string;
  onMessageCopy?: (message: Message) => void;
  customActionItems?: (message: Message) => React.ReactNode[];
  showCopyButton?: (message: Message) => boolean;
  onCardAction?: (action: string, data?: any) => void;
  /** Callback to send a message (used for suggestion clicks) */
  onSendMessage?: (message: string) => void;
  /** Callback to add an AI action to the tracking system */
  onAddAiAction?: (action: {
    type: 'add_section' | 'update_section' | 'delete_section' | 'navigate';
    sectionTitle?: string;
    content?: string;
    previewContent?: { title: string; body: string; };
    agentName: string;
    stepName?: string;
    requiresApproval?: boolean;
  }) => void;
}

// Component for streaming text effect with citation support
const StreamingText: React.FC<{
  content: string;
  isStreaming: boolean;
  speed?: number;
  renderWithCitations?: boolean;
}> = ({ content, isStreaming, speed = 20, renderWithCitations = false }) => {
  const [displayedContent, setDisplayedContent] = useState(isStreaming ? '' : content);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content);
      return;
    }

    // Reset for new content
    indexRef.current = 0;
    setDisplayedContent('');

    const streamContent = () => {
      if (indexRef.current < content.length) {
        const chunkSize = Math.min(3, content.length - indexRef.current);
        const nextChunk = content.substring(indexRef.current, indexRef.current + chunkSize);
        indexRef.current += chunkSize;
        setDisplayedContent(prev => prev + nextChunk);
      }
    };

    const interval = setInterval(streamContent, speed);

    return () => clearInterval(interval);
  }, [content, isStreaming, speed]);

  // Render with citations if requested
  if (renderWithCitations && !isStreaming) {
    return <>{renderContentWithCitations(displayedContent)}</>;
  }

  return <>{displayedContent}</>;
};

export const OGAssistConversation: React.FC<OGAssistConversationProps> = ({
  conversation,
  isLoading,
  thinkingMessage,
  onMessageCopy,
  customActionItems,
  showCopyButton = () => true,
  onCardAction,
  onSendMessage,
  onAddAiAction,
}) => {
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    type: FeedbackType;
    message: Message | null;
  }>({
    open: false,
    type: 'positive',
    message: null,
  });
  const [showToast, setShowToast] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState<Map<number, FeedbackType>>(new Map());
  const [feedbackCardIndex, setFeedbackCardIndex] = useState<number | null>(null);
  const [feedbackCardType, setFeedbackCardType] = useState<'positive' | 'negative' | null>(null);

  // Track executed document actions
  const [executedActions, setExecutedActions] = useState<Set<number>>(new Set());

  // Track which messages have been displayed
  const [displayedMessages, setDisplayedMessages] = useState<Set<number>>(new Set());
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<number | null>(null);
  const [showChips, setShowChips] = useState<Map<number, boolean>>(new Map());
  const [showTitle, setShowTitle] = useState<Map<number, boolean>>(new Map());
  const [showContent, setShowContent] = useState<Map<number, boolean>>(new Map());
  const prevMessageCountRef = useRef(0);

  // Progressive reveal of new messages
  useEffect(() => {
    if (conversation.messages.length > prevMessageCountRef.current) {
      const newMessageIndex = conversation.messages.length - 1;
      const newMessage = conversation.messages[newMessageIndex];

      if (newMessage.role === 'assistant') {
        // Check if message has a documentAction and add to tracking system
        const metadata = (newMessage as any).metadata;
        if (metadata?.documentAction && onAddAiAction) {
          onAddAiAction({
            type: metadata.documentAction.type,
            sectionTitle: metadata.documentAction.sectionTitle,
            content: metadata.previewContent?.body,
            previewContent: metadata.previewContent,
            agentName: metadata.agentName || 'Document Builder Assistant',
            stepName: metadata.actionRelationship?.stepName,
            requiresApproval: metadata.requiresApproval,
          });
        }

        // Start progressive reveal
        setTimeout(() => {
          // Show chips first
          setShowChips(prev => new Map(prev).set(newMessageIndex, true));

          // Show title after 400ms
          setTimeout(() => {
            setShowTitle(prev => new Map(prev).set(newMessageIndex, true));

            // Start content streaming after 600ms
            setTimeout(() => {
              setShowContent(prev => new Map(prev).set(newMessageIndex, true));
              setStreamingMessageIndex(newMessageIndex);

              // Stop streaming after content is fully displayed
              const contentLength = (newMessage.content || '').length;
              const streamDuration = (contentLength / 3) * 20; // Based on chunk size and speed
              setTimeout(() => {
                setStreamingMessageIndex(null);
                setDisplayedMessages(prev => new Set(prev).add(newMessageIndex));
              }, streamDuration + 500);
            }, 600);
          }, 400);
        }, 100);
      } else {
        // User messages appear immediately
        setDisplayedMessages(prev => new Set(prev).add(newMessageIndex));
      }

      prevMessageCountRef.current = conversation.messages.length;
    }
  }, [conversation.messages, onAddAiAction]);

  const handleCopy = (message: Message) => {
    navigator.clipboard.writeText(message.content || '');
    onMessageCopy?.(message);
  };

  const handleThumbsUp = (message: Message, index: number) => {
    // Show feedback card inline instead of dialog
    setFeedbackCardIndex(index);
    setFeedbackCardType('positive');
  };

  const handleThumbsDown = (message: Message, index: number) => {
    // Show feedback card inline instead of dialog
    setFeedbackCardIndex(index);
    setFeedbackCardType('negative');
  };

  const handleFeedbackCardSubmit = (feedback: string, tags: string[]) => {
    console.log('Feedback submitted:', {
      messageIndex: feedbackCardIndex,
      type: feedbackCardType,
      feedback,
      tags,
    });

    // Track which message received feedback
    if (feedbackCardIndex !== null && feedbackCardType) {
      setMessageFeedback(prev => new Map(prev).set(
        feedbackCardIndex,
        feedbackCardType === 'positive' ? 'positive' : 'negative'
      ));
    }

    // Show success toast
    setShowToast(true);

    // Close feedback card
    setFeedbackCardIndex(null);
    setFeedbackCardType(null);
  };

  const handleFeedbackCardClose = () => {
    setFeedbackCardIndex(null);
    setFeedbackCardType(null);
  };

  const handleFeedbackSubmit = (feedback: FeedbackData) => {
    // Track which message received feedback
    if (feedbackDialog.message) {
      const messageIndex = (feedbackDialog.message as any).index;
      setMessageFeedback(prev => new Map(prev).set(messageIndex, feedback.type));
    }

    // Here you would typically send the feedback to your backend
    // For now, just log it and show a toast

    setFeedbackDialog({
      open: false,
      type: 'positive',
      message: null,
    });
    setShowToast(true);
  };

  const handleFeedbackClose = () => {
    setFeedbackDialog({
      open: false,
      type: 'positive',
      message: null,
    });
  };

  // Handle document action execution
  const handleDocumentAction = (action: DocumentAction, messageIndex: number) => {
    // Mark as executed
    setExecutedActions(prev => new Set(prev).add(messageIndex));

    // Dispatch custom event for DocumentBuilderPage to handle
    window.dispatchEvent(new CustomEvent('documentBuilderAction', {
      detail: action,
    }));

    // Also call the onCardAction callback if provided
    onCardAction?.('documentAction', action);
  };

  // Extract title from content (first line after ##)
  const getTitle = (content: string, message: Message): string => {
    const lines = content.split('\n');
    const titleLine = lines.find(line => line.startsWith('## '));

    if (titleLine) {
      return titleLine.replace('## ', '');
    }

    // Fallback: Use skill name if available, otherwise extract first meaningful line
    const metadata = (message as any).metadata;
    if (metadata?.skillName) {
      return metadata.skillName;
    }

    // Try to extract first non-empty line as title
    const firstLine = lines.find(line => line.trim().length > 0);
    if (firstLine && firstLine.length < 80) {
      return firstLine.trim();
    }

    return 'Response';
  };

  // Remove title from content
  const getContentWithoutTitle = (content: string): string => {
    const lines = content.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('## '));
    if (titleIndex !== -1) {
      lines.splice(titleIndex, 1);
    }
    return lines.join('\n').trim();
  };

  return (
    <Stack spacing={3} sx={{ py: 2 }}>
      {conversation.messages.map((message, index) => (
        <Box key={`msg-${index}`} sx={{ flexShrink: 0, display: 'flex', justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start' }}>
          {message.role === 'user' ? (
            // User message - simple rendering
            <Box sx={{
              bgcolor: 'action.hover',
              borderRadius: 2,
              px: 2,
              py: 1.5,
              maxWidth: '80%',
              width: 'fit-content',
            }}>
              <Typography variant="body1">{message.content}</Typography>
            </Box>
          ) : (
            // Assistant message with full formatting
            <Box>
              {/* Agent and Skill Chips with sequential animation */}
              <Grow in={showChips.get(index) || displayedMessages.has(index)} timeout={300}>
                <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                  <Fade in={showChips.get(index) || displayedMessages.has(index)} timeout={400}>
                    <Chip
                      label={(message as any).metadata?.agentName || 'Budget & Planning Agent'}
                      size="small"
                      sx={{
                        bgcolor: 'action.selected',
                        color: 'text.primary',
                        fontSize: '11px',
                        height: '24px',
                      }}
                    />
                  </Fade>
                  <Fade in={showChips.get(index) || displayedMessages.has(index)} timeout={600} style={{ transitionDelay: '200ms' }}>
                    <Chip
                      label={(message as any).metadata?.skillName || 'Analysis'}
                      size="small"
                      sx={{
                        bgcolor: 'action.selected',
                        color: 'text.primary',
                        fontSize: '11px',
                        height: '24px',
                      }}
                    />
                  </Fade>
                </Stack>
              </Grow>

              {/* H1 Title with fade in */}
              <Fade in={showTitle.get(index) || displayedMessages.has(index)} timeout={500}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: '24px',
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                  }}
                >
                  {getTitle(message.content || '', message)}
                </Typography>
              </Fade>

              {/* Content with streaming effect */}
              {(showContent.get(index) || displayedMessages.has(index)) && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: '14px' }}>
                    <StreamingText
                      content={getContentWithoutTitle(message.content || '')}
                      isStreaming={streamingMessageIndex === index}
                      renderWithCitations={
                        (message as any).metadata?.agentName?.includes('Building Code') || false
                      }
                    />
                  </Box>

                {/* Render ChatVisualization if present */}
                {(message as any).metadata?.suggestedWidget?.visualizationData && (
                  <ChatVisualization
                    type={(message as any).metadata.suggestedWidget.visualizationData.type}
                    title={(message as any).metadata.suggestedWidget.visualizationData.title}
                    data={(message as any).metadata.suggestedWidget.visualizationData.data}
                    chartType={(message as any).metadata.suggestedWidget.visualizationData.chartType}
                    chartConfig={(message as any).metadata.suggestedWidget.visualizationData.chartConfig}
                    columns={(message as any).metadata.suggestedWidget.visualizationData.columns}
                    onAddToDashboard={() => onCardAction?.('addVisualization', (message as any).metadata.suggestedWidget)}
                    buttonText={(message as any).metadata.suggestedWidget.buttonText}
                  />
                )}

                {/* Render EAM Cards if present */}
                {(message as any).metadata?.cardType && (message as any).metadata?.agentType === 'eamScheduler' && (
                  <EAMCardRenderer metadata={(message as any).metadata} onAction={onCardAction} />
                )}
                {/* Render Inspection Cards if present */}
                {(message as any).metadata?.componentType && (message as any).metadata?.agentType === 'inspection' && (
                  <InspectionCardRenderer
                    data={(message as any).metadata?.data}
                    componentType={(message as any).metadata?.componentType}
                  />
                )}

                {/* Render Gen UX components if present */}
                {(message as any).metadata?.uiComponents && (
                  <GenUXMessageRenderer
                    message={message}
                    onComponentAction={onCardAction}
                  />
                )}

                {/* Render Document Action Card if present */}
                {(message as any).metadata?.documentAction && (message as any).metadata?.previewContent && (
                  <DocumentActionCard
                    action={(message as any).metadata.documentAction}
                    previewContent={(message as any).metadata.previewContent}
                    onExecute={(action) => handleDocumentAction(action, index)}
                    isExecuted={executedActions.has(index)}
                  />
                )}

                {/* Render prompt if present */}
                {(message as any).metadata?.prompt && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 3,
                      fontStyle: 'italic',
                      color: 'text.secondary'
                    }}
                  >
                    {(message as any).metadata.prompt}
                  </Typography>
                )}

                {/* Render suggested actions bar if present */}
                {(message as any).metadata?.followUpSuggestions &&
                 (message as any).metadata.followUpSuggestions.length > 0 &&
                 !((message as any).metadata?.isFinalMessage) && (
                  <SuggestedActionsBar
                    suggestions={(message as any).metadata.followUpSuggestions}
                    onSuggestionClick={(suggestion) => onSendMessage?.(suggestion)}
                    visible={displayedMessages.has(index)}
                    disabled={isLoading}
                  />
                )}

                </Box>
              )}

              {/* Action Buttons - show after content is done streaming */}
              {!(message as any).metadata?.isFinalMessage && displayedMessages.has(index) && (
                <Box>
                  <Stack direction="row" spacing={1}>
                  <IconButton
                    size="medium"
                    onClick={() => handleCopy(message)}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <IconButton
                    size="medium"
                    onClick={() => handleThumbsUp(message, index)}
                    sx={{
                      border: '1px solid',
                      borderColor: messageFeedback.get(index) === 'positive' ? 'success.main' : 'divider',
                      bgcolor: messageFeedback.get(index) === 'positive' ? 'success.light' : 'transparent',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'success.light',
                        borderColor: 'success.main',
                      },
                    }}
                  >
                    <ThumbUpOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: messageFeedback.get(index) === 'positive' ? 'success.main' : 'inherit'
                      }}
                    />
                  </IconButton>
                  <IconButton
                    size="medium"
                    onClick={() => handleThumbsDown(message, index)}
                    sx={{
                      border: '1px solid',
                      borderColor: messageFeedback.get(index) === 'negative' ? 'error.main' : 'divider',
                      bgcolor: messageFeedback.get(index) === 'negative' ? 'error.light' : 'transparent',
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'error.light',
                        borderColor: 'error.main',
                      },
                    }}
                  >
                    <ThumbDownOutlinedIcon
                      sx={{
                        fontSize: 18,
                        color: messageFeedback.get(index) === 'negative' ? 'error.main' : 'inherit'
                      }}
                    />
                  </IconButton>
                  </Stack>

                  {/* Render feedback card directly under buttons with fade-in */}
                  <Fade in={feedbackCardIndex === index && feedbackCardType !== null} timeout={300}>
                    <Box sx={{ mt: 1.5 }}>
                      {feedbackCardIndex === index && feedbackCardType && (
                        <FeedbackCard
                          feedbackType={feedbackCardType}
                          onSubmit={handleFeedbackCardSubmit}
                          onClose={handleFeedbackCardClose}
                        />
                      )}
                    </Box>
                  </Fade>
                </Box>
              )}

              {/* Final Message */}
              {(message as any).metadata?.isFinalMessage && (
                <Typography
                  variant="h6"
                  sx={{
                    textAlign: 'center',
                    mt: 4,
                    mb: 2,
                    color: 'text.secondary',
                  }}
                >
                  Thank you for your time
                </Typography>
              )}
            </Box>
          )}
        </Box>
      ))}

      {/* Loading indicator - 3 dots animation */}
      {isLoading && (
        <Fade in={true} timeout={300}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              pl: 1,
              py: 2,
            }}
          >
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'text.secondary',
                  animation: 'dotPulse 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                  '@keyframes dotPulse': {
                    '0%, 80%, 100%': {
                      opacity: 0.3,
                      transform: 'scale(0.8)',
                    },
                    '40%': {
                      opacity: 1,
                      transform: 'scale(1)',
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Fade>
      )}

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialog.open}
        onClose={handleFeedbackClose}
        feedbackType={feedbackDialog.type}
        onSubmit={handleFeedbackSubmit}
        messageContent={feedbackDialog.message?.content}
      />

      {/* Feedback Toast */}
      {showToast && (
        <FeedbackToast
          type={feedbackDialog.type}
          onClose={() => setShowToast(false)}
        />
      )}
    </Stack>
  );
};