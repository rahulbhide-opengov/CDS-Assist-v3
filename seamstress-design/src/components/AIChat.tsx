import React, { useState } from 'react';
import { Box } from '@mui/material';
import { AIPromptInput, AIConversation } from '@opengov/components-ai-patterns';
import { generateMessageId } from '../utils/id';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (prompt: string) => {
    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: `I received your message: "${prompt}". This is a simulated response.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCancelResponse = () => {
    setIsLoading(false);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        flex: 1,
        overflow: 'auto',
        p: 2,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper'
      }}>
        <AIConversation
          conversation={{
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          }}
          isResponseLoading={isLoading}
          contentMaxWidth={800}
        />
      </Box>

      <AIPromptInput
        placeholder="Ask me anything..."
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onCancelResponse={isLoading ? handleCancelResponse : undefined}
        minRows={2}
        maxRows={6}
      />
    </Box>
  );
};

export default AIChat;