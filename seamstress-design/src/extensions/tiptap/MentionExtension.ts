/**
 * TipTap Mention Extension
 * Simplified @ symbol triggers for knowledge, agents, skills, and tools
 */

import { Node } from '@tiptap/core';
import { Node as ProseMirrorNode } from '@tiptap/pm/model';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import type { MentionSuggestion } from '../../services/knowledge/KnowledgeTypes';
import { getSimpleMentionSuggestions } from '../../services/knowledge/SimpleMentionService';

// Create the mention node
export const Mention = Node.create({
  name: 'mention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }: any) {
        return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
      },
      suggestion: {
        char: '@',
        allowSpaces: false,
        startOfLine: false,
        pluginKey: new PluginKey('mention'),
        allowedPrefixes: [' ', '(', '[', '{', '"', "'", '\n', '\t'],
        command: ({ editor, range, props }: any) => {
          // Extract the actual ID from the path if available
          let actualId = props.id;
          if (props.path) {
            // Extract ID from path like "@agent/agent-001" -> "agent-001"
            const pathParts = props.path.split('/');
            if (pathParts.length > 1) {
              actualId = pathParts[pathParts.length - 1];
            }
          }

          // Insert the full mention as a node
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'mention',
                attrs: {
                  id: actualId,
                  label: (props.path || props.label).replace('@', ''), // Remove @ from label
                  type: props.type,
                },
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run();
        },
        allow: ({ state, range }: any) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = type ? !!$from.parent.type.contentMatch.matchType(type) : true;
          return allow;
        },
      } as any,
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-mention-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return {
            'data-mention-id': attributes.id,
          };
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-mention-label'),
        renderHTML: attributes => {
          if (!attributes.label) {
            return {};
          }
          return {
            'data-mention-label': attributes.label,
          };
        },
      },
      type: {
        default: null,
        parseHTML: element => element.getAttribute('data-mention-type'),
        renderHTML: attributes => {
          if (!attributes.type) {
            return {};
          }
          return {
            'data-mention-type': attributes.type,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-mention-id]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const label = node.attrs.label || node.attrs.id || '';
    // Only add @ if the label doesn't already start with it
    const displayLabel = label.startsWith('@') ? label : `@${label}`;

    return [
      'span',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        class: `knowledge-mention mention-${node.attrs.type}`,
        'data-mention-id': node.attrs.id,
        'data-mention-type': node.attrs.type,
        'data-mention-label': node.attrs.label,
        style: 'cursor: pointer;',
      },
      displayLabel,
    ];
  },

  renderText({ node }) {
    return node.attrs.label || node.attrs.id;
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: async ({ query }: { query: string }) => {
          // TipTap already strips the @ character, so query doesn't include it
          const suggestions = await getSimpleMentionSuggestions(query);
          return suggestions;
        },
        render: () => {
          let popup: HTMLElement | null = null;
          let selectedIndex = 0;
          let items: MentionSuggestion[] = [];
          let currentCommand: any = null;

          return {
            onStart: (props: any) => {
              if (!props.clientRect) {
                return;
              }

              popup = document.createElement('div');
              popup.className = 'mention-popup';
              popup.style.cssText = `
                position: fixed;
                z-index: 9999;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 4px;
                max-height: 300px;
                overflow-y: auto;
                min-width: 300px;
                max-width: 400px;
              `;

              const rect = props.clientRect();
              if (rect) {
                popup.style.left = rect.left + 'px';
                popup.style.top = rect.bottom + 5 + 'px';
              }

              document.body.appendChild(popup);
            },

            onUpdate: (props: any) => {
              if (!popup) {
                // Recreate popup if it doesn't exist
                if (props.clientRect) {
                  popup = document.createElement('div');
                  popup.className = 'mention-popup';
                  popup.style.cssText = `
                    position: fixed;
                    z-index: 9999;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    padding: 4px;
                    max-height: 300px;
                    overflow-y: auto;
                    min-width: 300px;
                    max-width: 400px;
                  `;
                  document.body.appendChild(popup);
                } else {
                  return;
                }
              }

              items = props.items;
              selectedIndex = 0;
              currentCommand = props.command;

              // Clear popup
              popup.innerHTML = '';

              // Show loading state if items is undefined/null
              if (items === null || items === undefined) {
                const loadingDiv = document.createElement('div');
                loadingDiv.style.cssText = 'padding: 8px 12px; color: #666; font-size: 14px;';
                loadingDiv.textContent = 'Loading suggestions...';
                popup.appendChild(loadingDiv);
                return;
              }

              // If items is an empty array, show helpful message
              if (Array.isArray(items) && items.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.style.cssText = 'padding: 8px 12px; color: #666; font-size: 14px;';
                emptyDiv.textContent = 'Type to search: agent/, skill/, tool/, knowledge/, or seamstress/';
                popup.appendChild(emptyDiv);
                return;
              }

              // Render items
              items.forEach((item: MentionSuggestion, index: number) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'mention-item';
                itemDiv.style.cssText = `
                  padding: 8px 12px;
                  cursor: pointer;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 14px;
                  transition: background-color 0.1s;
                  ${index === selectedIndex ? 'background-color: rgba(75, 63, 255, 0.08);' : ''}
                `;

                // Icon
                const iconSpan = document.createElement('span');
                iconSpan.textContent = item.icon || '📄';
                iconSpan.style.fontSize = '16px';
                itemDiv.appendChild(iconSpan);

                // Content
                const contentDiv = document.createElement('div');
                contentDiv.style.flex = '1';
                contentDiv.style.minWidth = '0';

                const labelDiv = document.createElement('div');
                labelDiv.textContent = item.label || item.path || 'Unnamed';
                labelDiv.style.cssText = 'font-weight: 500; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                contentDiv.appendChild(labelDiv);

                if (item.description) {
                  const descDiv = document.createElement('div');
                  descDiv.textContent = item.description;
                  descDiv.style.cssText = 'font-size: 11px; color: #666; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                  contentDiv.appendChild(descDiv);
                }

                itemDiv.appendChild(contentDiv);

                // Type badge with better colors
                const typeSpan = document.createElement('span');
                typeSpan.textContent = item.type;
                const typeColors: Record<string, string> = {
                  'agent': '#4b3fff',
                  'skill': '#2e7d32',
                  'tool': '#ed6c02',
                  'knowledge': '#0288d1',
                };
                typeSpan.style.cssText = `
                  font-size: 10px;
                  padding: 2px 6px;
                  border-radius: 4px;
                  background-color: ${typeColors[item.type] || '#616161'}20;
                  color: ${typeColors[item.type] || '#616161'};
                  text-transform: uppercase;
                  font-weight: 600;
                `;
                itemDiv.appendChild(typeSpan);

                // Events
                itemDiv.onmouseenter = () => {
                  selectedIndex = index;
                  updateSelection();
                };

                itemDiv.onclick = () => {
                  selectItem(index);
                };

                popup.appendChild(itemDiv);
              });

              // Update position if needed
              if (props.clientRect && popup) {
                const rect = props.clientRect();
                if (rect) {
                  popup.style.left = rect.left + 'px';
                  popup.style.top = rect.bottom + 5 + 'px';
                }
              }
            },

            onKeyDown: (props: any) => {
              if (props.event.key === 'ArrowDown') {
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection();
                return true;
              }

              if (props.event.key === 'ArrowUp') {
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection();
                return true;
              }

              if (props.event.key === 'Enter') {
                selectItem(selectedIndex);
                return true;
              }

              if (props.event.key === 'Escape') {
                props.command(null);
                return true;
              }

              return false;
            },

            onExit: () => {
              if (popup && popup.parentNode) {
                popup.parentNode.removeChild(popup);
              }
              popup = null;
            },
          };

          function updateSelection() {
            if (!popup) return;
            const items = popup.querySelectorAll('.mention-item');
            items.forEach((item, index) => {
              (item as HTMLElement).style.backgroundColor =
                index === selectedIndex ? 'rgba(75, 63, 255, 0.08)' : 'transparent';
            });
          }

          function selectItem(index: number) {
            const item = items[index];
            if (item && currentCommand) {
              currentCommand(item);
            }
          }
        },
      }),
    ];
  },
});

// Export as extension for backward compatibility
export const MentionExtension = Mention;