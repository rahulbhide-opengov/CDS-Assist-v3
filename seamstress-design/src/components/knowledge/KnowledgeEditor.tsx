/**
 * Knowledge Editor Component
 * Enhanced TipTap editor with @ mention support
 */

import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { useNavigate } from 'react-router-dom';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  Divider,
  IconButton,
  Tooltip,
  useTheme
} from '@mui/material';
import { MentionExtension } from '../../extensions/tiptap/MentionExtension';
import { marked } from 'marked';
import TurndownService from 'turndown';

// Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import CodeIcon from '@mui/icons-material/Code';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LinkIcon from '@mui/icons-material/Link';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import MentionIcon from '@mui/icons-material/AlternateEmail';

interface KnowledgeEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number | string;
  showToolbar?: boolean;
  readOnly?: boolean;
}

const KnowledgeEditor: React.FC<KnowledgeEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing... Use @ to mention documents, agents, skills, or tools',
  minHeight = 400,
  showToolbar = true,
  readOnly = false,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [headingLevel, setHeadingLevel] = React.useState('paragraph');

  // Convert markdown to HTML for TipTap
  const convertMarkdownToHtml = (markdown: string): string => {
    if (!markdown) return '';
    try {
      // Convert markdown to HTML
      const html = marked(markdown);
      // Keep mentions as plain text - TipTap will handle them
      return html;
    } catch (error) {
      // Fallback to original markdown on error
      return markdown;
    }
  };

  // Convert HTML back to markdown for storage
  const convertHtmlToMarkdown = (html: string): string => {
    if (!html) return '';
    try {
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
      });

      // Preserve mention spans
      turndownService.addRule('mentions', {
        filter: function(node) {
          return node.nodeName === 'SPAN' &&
                 node.className &&
                 node.className.includes('mention-');
        },
        replacement: function(content) {
          return content; // Keep the @mention text as is
        }
      });

      return turndownService.turndown(html);
    } catch (error) {
      console.error('Error converting HTML to markdown:', error);
      return html;
    }
  };

  const handleMentionClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Check if clicked element is a mention and we're in read-only mode
    if (readOnly && (
        target.classList.contains('knowledge-mention') ||
        target.classList.contains('mention-agent') ||
        target.classList.contains('mention-skill') ||
        target.classList.contains('mention-tool') ||
        target.classList.contains('mention-knowledge'))) {

      event.preventDefault();
      event.stopPropagation();

      // Get the mention data
      const mentionId = target.getAttribute('data-mention-id');
      const mentionType = target.getAttribute('data-mention-type');

      // Navigate based on mention type
      if (mentionType === 'agent' && mentionId) {
        navigate(`/agents/${mentionId}`);
      } else if (mentionType === 'skill' && mentionId) {
        navigate(`/skills/${mentionId}`);
      } else if (mentionType === 'tool' && mentionId) {
        navigate(`/tools/${mentionId}`);
      } else if (mentionType === 'knowledge' && mentionId) {
        navigate(`/agent-studio/knowledge?doc=${mentionId}`);
      }
    }
  }, [readOnly, navigate]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      MentionExtension,
    ],
    content: convertMarkdownToHtml(value),
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      // Convert HTML back to markdown before saving
      const html = editor.getHTML();
      const markdown = convertHtmlToMarkdown(html);
      onChange(markdown);
    },
    editorProps: {
      handleClick: (view, pos, event) => {
        handleMentionClick(event as MouseEvent);
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;

    // Update heading level state when selection changes
    const updateHeadingLevel = () => {
      if (editor.isActive('heading', { level: 1 })) {
        setHeadingLevel('h1');
      } else if (editor.isActive('heading', { level: 2 })) {
        setHeadingLevel('h2');
      } else if (editor.isActive('heading', { level: 3 })) {
        setHeadingLevel('h3');
      } else {
        setHeadingLevel('paragraph');
      }
    };

    editor.on('selectionUpdate', updateHeadingLevel);
    editor.on('update', updateHeadingLevel);

    return () => {
      editor.off('selectionUpdate', updateHeadingLevel);
      editor.off('update', updateHeadingLevel);
    };
  }, [editor]);

  // Update editor editable state when readOnly prop changes
  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  if (!editor) {
    return null;
  }

  const handleHeadingChange = (event: any) => {
    const value = event.target.value;
    setHeadingLevel(value);

    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else if (value === 'h1') {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (value === 'h2') {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (value === 'h3') {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'background.paper',
      }}
    >
      {showToolbar && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            flexWrap: 'wrap',
            flexShrink: 0
          }}
        >
          {/* Heading Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={headingLevel}
              onChange={handleHeadingChange}
              sx={{ height: 32 }}
            >
              <MenuItem value="paragraph">Paragraph</MenuItem>
              <MenuItem value="h1">Heading 1</MenuItem>
              <MenuItem value="h2">Heading 2</MenuItem>
              <MenuItem value="h3">Heading 3</MenuItem>
            </Select>
          </FormControl>

          <Divider orientation="vertical" flexItem />

          {/* Text Formatting */}
          <ToggleButtonGroup
            size="small"
            value={[]}
            sx={{ height: 32 }}
          >
            <ToggleButton
              value="bold"
              selected={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
            >
              <Tooltip title="Bold (Cmd+B)">
                <FormatBoldIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="italic"
              selected={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
              <Tooltip title="Italic (Cmd+I)">
                <FormatItalicIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="code"
              selected={editor.isActive('code')}
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
            >
              <Tooltip title="Code">
                <CodeIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Lists */}
          <ToggleButtonGroup
            size="small"
            value={[]}
            sx={{ height: 32 }}
          >
            <ToggleButton
              value="bulletList"
              selected={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <Tooltip title="Bullet List">
                <FormatListBulletedIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="orderedList"
              selected={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <Tooltip title="Numbered List">
                <FormatListNumberedIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Alignment */}
          <ToggleButtonGroup
            size="small"
            exclusive
            value={editor.isActive({ textAlign: 'left' }) ? 'left' :
                   editor.isActive({ textAlign: 'center' }) ? 'center' :
                   editor.isActive({ textAlign: 'right' }) ? 'right' :
                   editor.isActive({ textAlign: 'justify' }) ? 'justify' : 'left'}
            sx={{ height: 32 }}
          >
            <ToggleButton
              value="left"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <Tooltip title="Align Left">
                <FormatAlignLeftIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="center"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <Tooltip title="Align Center">
                <FormatAlignCenterIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="right"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <Tooltip title="Align Right">
                <FormatAlignRightIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
            <ToggleButton
              value="justify"
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            >
              <Tooltip title="Justify">
                <FormatAlignJustifyIcon fontSize="small" />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          <Divider orientation="vertical" flexItem />

          {/* Additional Actions */}
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            color={editor.isActive('blockquote') ? 'primary' : 'default'}
          >
            <Tooltip title="Quote">
              <FormatQuoteIcon fontSize="small" />
            </Tooltip>
          </IconButton>
          <IconButton
            size="small"
            onClick={addLink}
            color={editor.isActive('link') ? 'primary' : 'default'}
          >
            <Tooltip title="Insert Link">
              <LinkIcon fontSize="small" />
            </Tooltip>
          </IconButton>

          <Box sx={{ flex: 1 }} />

          {/* @ Mention Hint */}
          <Tooltip title="Type @ to mention documents, agents, skills, or tools">
            <IconButton size="small" color="primary">
              <MentionIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem />

          {/* Undo/Redo */}
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Tooltip title="Undo (Cmd+Z)">
              <UndoIcon fontSize="small" />
            </Tooltip>
          </IconButton>
          <IconButton
            size="small"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Tooltip title="Redo (Cmd+Shift+Z)">
              <RedoIcon fontSize="small" />
            </Tooltip>
          </IconButton>
        </Box>
      )}

      {/* Editor Content */}
      <Box
        sx={{
          flex: 1,
          minHeight,
          p: 2,
          '& .ProseMirror': {
            minHeight: '100%',
            outline: 'none',
            maxWidth: '900px',
            margin: '0 auto',
            paddingTop: theme.spacing(3),
            fontSize: '16px',
            lineHeight: 1.7,
            color: theme.palette.text.primary,
            '& p': {
              margin: '0 0 1em 0',
              lineHeight: 1.7,
            },
            '& h1': {
              fontSize: '2em',
              fontWeight: 600,
              margin: '0.67em 0',
            },
            '& h2': {
              fontSize: '1.5em',
              fontWeight: 600,
              margin: '0.83em 0',
            },
            '& h3': {
              fontSize: '1.17em',
              fontWeight: 600,
              margin: '1em 0',
            },
            '& ul, & ol': {
              paddingLeft: '2em',
              margin: '1em 0',
            },
            '& li': {
              margin: '0.25em 0',
            },
            '& blockquote': {
              borderLeft: '3px solid',
              borderColor: theme.palette.primary.main,
              paddingLeft: '1em',
              marginLeft: 0,
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
            },
            '& code': {
              backgroundColor: theme.palette.grey[100],
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontFamily: 'monospace',
              fontSize: '0.9em',
            },
            '& pre': {
              backgroundColor: theme.palette.grey[100],
              padding: '1em',
              borderRadius: '4px',
              overflow: 'auto',
              margin: '1em 0',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            '& .editor-link': {
              color: theme.palette.primary.main,
              cursor: 'pointer',
              textDecoration: 'underline',
            },
            '& .knowledge-mention, & .mention-agent, & .mention-skill, & .mention-tool, & .mention-knowledge': {
              fontWeight: 500,
              padding: '2px 4px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'inline-block',
            },
            '& .knowledge-mention, & .mention-agent': {
              backgroundColor: 'rgba(75, 63, 255, 0.1)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(75, 63, 255, 0.2)',
              },
            },
            '& .mention-skill': {
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: 'success.main',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.2)',
              },
            },
            '& .mention-tool': {
              backgroundColor: 'rgba(237, 108, 2, 0.1)',
              color: 'warning.main',
              '&:hover': {
                backgroundColor: 'rgba(237, 108, 2, 0.2)',
              },
            },
            '& .mention-knowledge': {
              backgroundColor: 'rgba(2, 136, 209, 0.1)',
              color: 'info.main',
              '&:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.2)',
              },
            },
            '& p.is-editor-empty:first-of-type::before': {
              content: 'attr(data-placeholder)',
              float: 'left',
              color: theme.palette.text.disabled,
              pointerEvents: 'none',
              height: 0,
            },
            // Mention styles in editor
            '& span[data-mention-id]': {
              fontWeight: 500,
              padding: '2px 4px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'inline-block',
              textDecoration: 'none',
              transition: 'background-color 0.2s',
            },
            '& span[data-mention-type="agent"]': {
              backgroundColor: 'rgba(75, 63, 255, 0.1)',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(75, 63, 255, 0.2)',
              },
            },
            '& span[data-mention-type="skill"]': {
              backgroundColor: 'rgba(46, 125, 50, 0.1)',
              color: 'success.main',
              '&:hover': {
                backgroundColor: 'rgba(46, 125, 50, 0.2)',
              },
            },
            '& span[data-mention-type="tool"]': {
              backgroundColor: 'rgba(237, 108, 2, 0.1)',
              color: 'warning.main',
              '&:hover': {
                backgroundColor: 'rgba(237, 108, 2, 0.2)',
              },
            },
            '& span[data-mention-type="knowledge"]': {
              backgroundColor: 'rgba(2, 136, 209, 0.1)',
              color: 'info.main',
              '&:hover': {
                backgroundColor: 'rgba(2, 136, 209, 0.2)',
              },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {/* Mention popup styles */}
      <style>
        {`
          .mention-popup {
            font-family: ${theme.typography.fontFamily};
          }
          .mention-item:hover {
            background-color: ${theme.palette.action.hover};
          }
        `}
      </style>
    </Box>
  );
};

export default KnowledgeEditor;