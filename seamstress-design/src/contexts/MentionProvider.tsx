/**
 * Mention Provider
 * Global context for managing @ mentions across the application
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { colorTokens } from '../theme/cds/tokens';
import type { MentionSuggestion } from '../services/knowledge/KnowledgeTypes';
import MentionMenu from '../components/mentions/MentionMenu';

interface MentionContextType {
  openMention: (position?: { top: number; left: number }, initialQuery?: string) => void;
  closeMention: () => void;
  insertMention: (target: HTMLElement | null, suggestion: MentionSuggestion) => void;
  registerInput: (input: HTMLElement, onMention: (suggestion: MentionSuggestion) => void) => () => void;
}

const MentionContext = createContext<MentionContextType | null>(null);

export const useMention = () => {
  const context = useContext(MentionContext);
  if (!context) {
    throw new Error('useMention must be used within MentionProvider');
  }
  return context;
};

interface MentionProviderProps {
  children: React.ReactNode;
}

export const MentionProvider: React.FC<MentionProviderProps> = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTarget, setActiveTarget] = useState<HTMLElement | null>(null);
  const registeredInputs = useRef<Map<HTMLElement, (suggestion: MentionSuggestion) => void>>(new Map());
  const activeCallback = useRef<((suggestion: MentionSuggestion) => void) | null>(null);

  const openMention = useCallback((position?: { top: number; left: number }, initialQuery = '') => {
    setMenuPosition(position);
    setSearchQuery(initialQuery);
    setMenuOpen(true);
  }, []);

  const closeMention = useCallback(() => {
    setMenuOpen(false);
    setMenuPosition(undefined);
    setSearchQuery('');
    setActiveTarget(null);
    activeCallback.current = null;
  }, []);

  const insertMention = useCallback((target: HTMLElement | null, suggestion: MentionSuggestion) => {
    if (!target) return;

    // Handle different input types
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      const input = target as HTMLInputElement | HTMLTextAreaElement;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const text = input.value;

      // Find the @ symbol position
      let atPosition = start - 1;
      while (atPosition >= 0 && text[atPosition] !== '@') {
        atPosition--;
      }

      if (atPosition >= 0) {
        // Replace from @ to current cursor position with the mention
        const newText = text.substring(0, atPosition) + suggestion.path + ' ' + text.substring(end);
        input.value = newText;

        // Set cursor position after the mention
        const newPosition = atPosition + suggestion.path.length + 1;
        input.setSelectionRange(newPosition, newPosition);

        // Trigger input event
        const event = new Event('input', { bubbles: true });
        input.dispatchEvent(event);
      }
    } else if (target.contentEditable === 'true') {
      // Handle contentEditable elements
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Find and replace @ mention
        const textNode = range.startContainer;
        if (textNode.nodeType === Node.TEXT_NODE) {
          const text = textNode.textContent || '';
          const offset = range.startOffset;

          // Find the @ symbol position
          let atPosition = offset - 1;
          while (atPosition >= 0 && text[atPosition] !== '@') {
            atPosition--;
          }

          if (atPosition >= 0) {
            // Create mention link
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'mention-link';
            link.dataset.mentionPath = suggestion.path;
            link.dataset.mentionId = suggestion.id;
            link.dataset.mentionType = suggestion.type;
            link.textContent = suggestion.path;
            link.style.color = colorTokens.primary.main;
            link.style.textDecoration = 'none';
            link.style.fontWeight = '500';
            link.onclick = (e) => {
              e.preventDefault();
              // Handle mention click
            };

            // Replace text with link
            const beforeText = text.substring(0, atPosition);
            const afterText = text.substring(offset);

            textNode.textContent = beforeText;

            if (textNode.parentNode) {
              // Insert link after the text node
              textNode.parentNode.insertBefore(link, textNode.nextSibling);

              // Add space and remaining text
              const spaceNode = document.createTextNode(' ');
              textNode.parentNode.insertBefore(spaceNode, link.nextSibling);

              if (afterText) {
                const afterNode = document.createTextNode(afterText);
                textNode.parentNode.insertBefore(afterNode, spaceNode.nextSibling);
              }

              // Set cursor after the mention
              const newRange = document.createRange();
              newRange.setStartAfter(spaceNode);
              newRange.collapse(true);
              selection.removeAllRanges();
              selection.addRange(newRange);
            }

            // Trigger input event
            const event = new Event('input', { bubbles: true });
            target.dispatchEvent(event);
          }
        }
      }
    }
  }, []);

  const handleMentionSelect = useCallback((suggestion: MentionSuggestion) => {
    if (activeCallback.current) {
      activeCallback.current(suggestion);
    } else if (activeTarget) {
      insertMention(activeTarget, suggestion);
    }
    closeMention();
  }, [activeTarget, closeMention, insertMention]);

  const registerInput = useCallback((input: HTMLElement, onMention: (suggestion: MentionSuggestion) => void) => {
    registeredInputs.current.set(input, onMention);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '@') {
        // Get cursor position
        const rect = input.getBoundingClientRect();
        const position = {
          top: rect.bottom + 5,
          left: rect.left,
        };

        setActiveTarget(input);
        activeCallback.current = onMention;
        openMention(position);
      }
    };

    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      let text = '';
      let cursorPosition = 0;

      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const input = target as HTMLInputElement | HTMLTextAreaElement;
        text = input.value;
        cursorPosition = input.selectionStart || 0;
      } else if (target.contentEditable === 'true') {
        text = target.textContent || '';
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          cursorPosition = range.startOffset;
        }
      }

      // Check if we're in an @ mention context
      if (cursorPosition > 0 && text[cursorPosition - 1] === '@') {
        const rect = input.getBoundingClientRect();
        const position = {
          top: rect.bottom + 5,
          left: rect.left,
        };

        setActiveTarget(input);
        activeCallback.current = onMention;
        openMention(position);
      }
    };

    input.addEventListener('keydown', handleKeyDown);
    input.addEventListener('input', handleInput);

    // Return cleanup function
    return () => {
      input.removeEventListener('keydown', handleKeyDown);
      input.removeEventListener('input', handleInput);
      registeredInputs.current.delete(input);
    };
  }, [openMention]);

  const value: MentionContextType = {
    openMention,
    closeMention,
    insertMention,
    registerInput,
  };

  return (
    <MentionContext.Provider value={value}>
      {children}
      <MentionMenu
        open={menuOpen}
        anchorPosition={menuPosition}
        onClose={closeMention}
        onSelect={handleMentionSelect}
        searchQuery={searchQuery}
      />
    </MentionContext.Provider>
  );
};

export default MentionProvider;
