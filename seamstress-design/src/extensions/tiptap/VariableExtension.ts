/**
 * TipTap Variable Extension
 * Handles {{variable}} syntax for document variables
 *
 * Variables are rendered as styled chips and can be inserted via:
 * 1. Typing {{ to trigger autocomplete
 * 2. Clicking insert from variable picker
 *
 * Variables are stored as nodes (not plain text) so they can:
 * - Display resolved values on hover
 * - Prevent editing of variable syntax
 * - Be highlighted differently than regular text
 */

import { Node } from '@tiptap/core';
import { PluginKey } from '@tiptap/pm/state';
import Suggestion from '@tiptap/suggestion';
import type { Variable } from '../../services/procurement/ProcurementTypes';

interface VariableOptions {
  HTMLAttributes: Record<string, any>;
  suggestion: any;
  getVariableSuggestions?: (query: string) => Promise<Variable[]>;
  getVariableValue?: (variableName: string) => Promise<string | null>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      /**
       * Insert a variable at the current cursor position
       */
      insertVariable: (variableName: string) => ReturnType;
    };
  }
}

// Create the variable node
const VariableNode = Node.create<VariableOptions>({
  name: 'variable',

  addOptions() {
    return {
      HTMLAttributes: {},
      getVariableSuggestions: async () => [],
      getVariableValue: async () => null,
      suggestion: {
        char: '{{',
        allowSpaces: true,
        startOfLine: false,
        pluginKey: new PluginKey('variable'),
        command: ({ editor, range, props }: any) => {
          // Insert the variable node
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: 'variable',
                attrs: {
                  name: props.name,
                  value: props.value || '',
                  label: props.label || props.name,
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

  selectable: true,

  atom: true,

  draggable: false,

  addAttributes() {
    return {
      name: {
        default: null,
        parseHTML: element => element.getAttribute('data-variable-name'),
        renderHTML: attributes => {
          if (!attributes.name) {
            return {};
          }
          return {
            'data-variable-name': attributes.name,
          };
        },
      },
      value: {
        default: '',
        parseHTML: element => element.getAttribute('data-variable-value'),
        renderHTML: attributes => {
          return {
            'data-variable-value': attributes.value || '',
          };
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-variable-label'),
        renderHTML: attributes => {
          return {
            'data-variable-label': attributes.label || attributes.name,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-variable-name]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const label = node.attrs.label || node.attrs.name || 'variable';
    const value = node.attrs.value;

    return [
      'span',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        class: 'document-variable',
        'data-variable-name': node.attrs.name,
        'data-variable-value': value,
        'data-variable-label': label,
        title: value ? `${label}: ${value}` : label,
        style: `
          display: inline-block;
          padding: 2px 8px;
          margin: 0 2px;
          background-color: #e3f2fd;
          color: #0288d1;
          border: 1px solid #90caf9;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: monospace;
          cursor: default;
          user-select: none;
        `,
      },
      `{{${label}}}`,
    ];
  },

  renderText({ node }) {
    return `{{${node.attrs.name}}}`;
  },

  addCommands() {
    return {
      insertVariable:
        (variableName: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: {
              name: variableName,
              label: variableName,
              value: '',
            },
          });
        },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        items: async ({ query }: { query: string }) => {
          // Get variable suggestions from the provided function
          if (this.options.getVariableSuggestions) {
            try {
              const variables = await this.options.getVariableSuggestions(query);
              return variables;
            } catch (error) {
              console.error('Error fetching variable suggestions:', error);
              return [];
            }
          }
          return [];
        },
        render: () => {
          let popup: HTMLElement | null = null;
          let selectedIndex = 0;
          let items: Variable[] = [];
          let currentCommand: any = null;

          return {
            onStart: (props: any) => {
              if (!props.clientRect) {
                return;
              }

              popup = document.createElement('div');
              popup.className = 'variable-popup';
              popup.style.cssText = `
                position: fixed;
                z-index: 9999;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                padding: 8px;
                max-height: 300px;
                overflow-y: auto;
                min-width: 350px;
                max-width: 450px;
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
                if (props.clientRect) {
                  popup = document.createElement('div');
                  popup.className = 'variable-popup';
                  popup.style.cssText = `
                    position: fixed;
                    z-index: 9999;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    padding: 8px;
                    max-height: 300px;
                    overflow-y: auto;
                    min-width: 350px;
                    max-width: 450px;
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

              // Show loading state
              if (items === null || items === undefined) {
                const loadingDiv = document.createElement('div');
                loadingDiv.style.cssText = 'padding: 12px; color: #666; font-size: 14px;';
                loadingDiv.textContent = 'Loading variables...';
                popup.appendChild(loadingDiv);
                return;
              }

              // Show empty state
              if (Array.isArray(items) && items.length === 0) {
                const emptyDiv = document.createElement('div');
                emptyDiv.style.cssText = 'padding: 12px; color: #666; font-size: 14px;';
                emptyDiv.innerHTML = `
                  <div style="font-weight: 500; margin-bottom: 8px;">No variables found</div>
                  <div style="font-size: 12px; color: #999;">
                    Type {{ to insert variables like project.title, contract.startDate, etc.
                  </div>
                `;
                popup.appendChild(emptyDiv);
                return;
              }

              // Render variable items
              if (!popup) return;

              // Capture popup in const to satisfy TypeScript
              const popupElement = popup;

              items.forEach((item: Variable, index: number) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'variable-item';
                itemDiv.style.cssText = `
                  padding: 10px 12px;
                  cursor: pointer;
                  display: flex;
                  flex-direction: column;
                  gap: 4px;
                  font-size: 14px;
                  transition: background-color 0.1s;
                  border-radius: 4px;
                  ${index === selectedIndex ? 'background-color: rgba(75, 63, 255, 0.08);' : ''}
                `;

                // Variable name row
                const nameRow = document.createElement('div');
                nameRow.style.cssText = 'display: flex; align-items: center; gap: 8px;';

                // Variable icon
                const iconSpan = document.createElement('span');
                iconSpan.textContent = '📌';
                iconSpan.style.fontSize = '14px';
                nameRow.appendChild(iconSpan);

                // Variable name
                const nameDiv = document.createElement('div');
                nameDiv.textContent = `{{${item.name}}}`;
                nameDiv.style.cssText = 'font-family: monospace; color: #0288d1; font-weight: 400; flex: 1;';
                nameRow.appendChild(nameDiv);

                // Source badge
                const sourceSpan = document.createElement('span');
                sourceSpan.textContent = item.source;
                const sourceColors: Record<string, string> = {
                  'project': '#2e7d32',
                  'contract': '#ed6c02',
                  'question': '#4b3fff',
                  'custom': '#616161',
                };
                sourceSpan.style.cssText = `
                  font-size: 10px;
                  padding: 2px 6px;
                  border-radius: 4px;
                  background-color: ${sourceColors[item.source] || '#616161'}20;
                  color: ${sourceColors[item.source] || '#616161'};
                  text-transform: uppercase;
                  font-weight: 600;
                `;
                nameRow.appendChild(sourceSpan);

                itemDiv.appendChild(nameRow);

                // Label and description
                if (item.label) {
                  const labelDiv = document.createElement('div');
                  labelDiv.textContent = item.label;
                  labelDiv.style.cssText = 'font-size: 12px; color: #666; padding-left: 22px;';
                  itemDiv.appendChild(labelDiv);
                }

                if (item.description) {
                  const descDiv = document.createElement('div');
                  descDiv.textContent = item.description;
                  descDiv.style.cssText = 'font-size: 11px; color: #999; padding-left: 22px;';
                  itemDiv.appendChild(descDiv);
                }

                // Current value (if available)
                if (item.value) {
                  const valueDiv = document.createElement('div');
                  valueDiv.textContent = `Current value: ${item.value}`;
                  valueDiv.style.cssText = 'font-size: 11px; color: #4caf50; padding-left: 22px; font-style: italic;';
                  itemDiv.appendChild(valueDiv);
                }

                // Events
                itemDiv.onmouseenter = () => {
                  selectedIndex = index;
                  updateSelection();
                };

                itemDiv.onclick = () => {
                  selectItem(index);
                };

                popupElement.appendChild(itemDiv);
              });

              // Update position
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
            if (!popup || !items || items.length === 0) return;
            const itemElements = popup.querySelectorAll('.variable-item');
            itemElements.forEach((item, index) => {
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

// Export as extension for easy import
export const VariableExtension = VariableNode;
