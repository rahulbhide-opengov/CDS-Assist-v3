/**
 * Use Mention Input Hook
 * Simplifies adding @ mention support to any input field
 */

import { useEffect, useRef, useCallback } from 'react';
import { useMention } from '../contexts/MentionProvider';
import type { MentionSuggestion } from '../services/knowledge/KnowledgeTypes';

interface UseMentionInputOptions {
  onMention?: (suggestion: MentionSuggestion) => void;
  enabled?: boolean;
}

export const useMentionInput = (
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLDivElement>,
  options: UseMentionInputOptions = {}
) => {
  const { enabled = true, onMention } = options;
  const { registerInput, insertMention } = useMention();
  const cleanupRef = useRef<(() => void) | null>(null);

  const handleMention = useCallback(
    (suggestion: MentionSuggestion) => {
      if (onMention) {
        onMention(suggestion);
      } else if (inputRef.current) {
        insertMention(inputRef.current, suggestion);
      }
    },
    [onMention, insertMention, inputRef]
  );

  useEffect(() => {
    if (enabled && inputRef.current) {
      // Register the input for @ mention support
      cleanupRef.current = registerInput(inputRef.current, handleMention);
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [enabled, inputRef, registerInput, handleMention]);

  return {
    mentionEnabled: enabled,
  };
};