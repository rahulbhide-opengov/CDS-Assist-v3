import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

export interface ConversationHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface OGAssistChatHistoryProps {
  conversations: ConversationHistory[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

export const OGAssistChatHistory: React.FC<OGAssistChatHistoryProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onClose,
}) => {
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          History
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewChat}
          sx={{
            justifyContent: 'flex-start',
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          New Chat
        </Button>
      </Box>

      <Divider />

      {/* Conversations List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {conversations.length === 0 ? (
          <Box
            sx={{
              p: 3,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 48, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">
              No conversations yet
            </Typography>
            <Typography variant="caption">
              Start a new chat to begin
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 1 }}>
            {conversations.map((conversation) => (
              <ListItem
                key={conversation.id}
                disablePadding
                sx={{ mb: 0.5 }}
              >
                <ListItemButton
                  selected={conversation.id === activeConversationId}
                  onClick={() => onSelectConversation(conversation.id)}
                  sx={{
                    borderRadius: 1,
                    '&.Mui-selected': {
                      bgcolor: 'action.selected',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: conversation.id === activeConversationId ? 600 : 400,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {conversation.title}
                      </Typography>
                    }
                    secondary={
                      <Stack spacing={0.5}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: 'text.secondary',
                          }}
                        >
                          {conversation.lastMessage}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.disabled',
                            fontSize: '0.7rem',
                          }}
                        >
                          {formatTimestamp(conversation.timestamp)}
                        </Typography>
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};