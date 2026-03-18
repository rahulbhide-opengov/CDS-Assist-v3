/**
 * Section Editor Component
 * Rich text editor for document sections with variable support
 *
 * Features:
 * - Tiptap WYSIWYG editing
 * - Variable insertion ({{ syntax)
 * - Standard formatting (bold, italic, lists, headings)
 * - Auto-save on blur
 */

import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { VariableExtension } from '../../../extensions/tiptap/VariableExtension';
import { variableService } from '../../../services/procurement/VariableService';
import type { Variable } from '../../../services/procurement/ProcurementTypes';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';

interface SectionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  minHeight?: number | string;
  documentId?: string; // For variable resolution
  readOnly?: boolean;
}

export interface SectionEditorRef {
  editor: Editor | null;
}

export const SectionEditor = forwardRef<SectionEditorRef, SectionEditorProps>(
  function SectionEditorInner(props, ref) {
  const {
    value,
    onChange,
    onBlur,
    placeholder = 'Start typing... Use {{ to insert variables',
    minHeight = 300,
    documentId,
    readOnly = false,
  } = props;
  const theme = useTheme();
  const [headingLevel, setHeadingLevel] = React.useState('paragraph');
  const [availableVariables, setAvailableVariables] = React.useState<Variable[]>([]);

  // Fetch available variables for the document
  useEffect(() => {
    if (documentId) {
      variableService.getVariablesWithValues(documentId).then(setAvailableVariables).catch(console.error);
    }
  }, [documentId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configure heading through StarterKit instead of separate extension
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      VariableExtension.configure({
        getVariableSuggestions: async (query: string) => {
          // Filter variables based on query
          const lowerQuery = query.toLowerCase();
          return availableVariables.filter(
            (v) =>
              v.name.toLowerCase().includes(lowerQuery) ||
              (v.label && v.label.toLowerCase().includes(lowerQuery))
          );
        },
      }),
    ],
    content: value,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onBlur: () => {
      if (onBlur) {
        onBlur();
      }
    },
  });

  // Expose the editor via ref for external access (e.g., inserting variables)
  useImperativeHandle(ref, () => ({
    editor,
  }), [editor]);

  // Update heading level state when selection changes
  useEffect(() => {
    if (!editor) return;

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

  // Update editor content when value changes externally
  useEffect(() => {
    if (!editor) return;

    // Only update if content is different to avoid cursor issues
    const currentContent = editor.getHTML();
    if (currentContent !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

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

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid',
        borderColor: theme.palette.divider,
        borderRadius: 1,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        minHeight: 0,
      }}
    >
      {/* Formatting Toolbar */}
      {!readOnly && (
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: theme.palette.divider,
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.50',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {/* Heading Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={headingLevel}
              onChange={handleHeadingChange}
              sx={{
                height: 32,
                fontSize: '14px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
              }}
            >
              <MenuItem value="paragraph">Normal</MenuItem>
              <MenuItem value="h1">Heading 1</MenuItem>
              <MenuItem value="h2">Heading 2</MenuItem>
              <MenuItem value="h3">Heading 3</MenuItem>
            </Select>
          </FormControl>

          {/* Text Formatting */}
          <ToggleButtonGroup size="small">
            <ToggleButton
              value="bold"
              selected={editor.isActive('bold')}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <FormatBoldIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="italic"
              selected={editor.isActive('italic')}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <FormatItalicIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="code"
              selected={editor.isActive('code')}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <CodeIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Lists */}
          <ToggleButtonGroup size="small">
            <ToggleButton
              value="bulletList"
              selected={editor.isActive('bulletList')}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <FormatListBulletedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="orderedList"
              selected={editor.isActive('orderedList')}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <FormatListNumberedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Alignment */}
          <ToggleButtonGroup size="small">
            <ToggleButton
              value="left"
              selected={editor.isActive({ textAlign: 'left' })}
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
            >
              <FormatAlignLeftIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="center"
              selected={editor.isActive({ textAlign: 'center' })}
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
            >
              <FormatAlignCenterIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton
              value="right"
              selected={editor.isActive({ textAlign: 'right' })}
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
            >
              <FormatAlignRightIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Link */}
          <Tooltip title="Add link">
            <IconButton size="small" onClick={setLink}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Editor Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          minHeight,
          '& .ProseMirror': {
            minHeight: '100%',
            padding: 2,
            outline: 'none',
            '& p': {
              margin: 0,
              marginBottom: 1,
            },
            '& h1': {
              fontSize: '2em',
              fontWeight: 600,
              marginTop: 2,
              marginBottom: 1,
            },
            '& h2': {
              fontSize: '1.5em',
              fontWeight: 600,
              marginTop: 1.5,
              marginBottom: 1,
            },
            '& h3': {
              fontSize: '1.25em',
              fontWeight: 600,
              marginTop: 1,
              marginBottom: 0.5,
            },
            '& ul, & ol': {
              paddingLeft: 3,
              marginTop: 0.5,
              marginBottom: 1,
            },
            '& li': {
              marginBottom: 0.25,
            },
            '& code': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              padding: '2px 4px',
              borderRadius: '3px',
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
              padding: 2,
              borderRadius: 1,
              overflow: 'auto',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              cursor: 'pointer',
            },
            '& .document-variable': {
              display: 'inline-block',
              padding: '2px 8px',
              margin: '0 2px',
              backgroundColor: theme.palette.mode === 'dark'
                ? theme.palette.primary.dark
                : theme.palette.primary.light,
              color: theme.palette.mode === 'dark'
                ? theme.palette.primary.contrastText
                : theme.palette.primary.main,
              border: `1px solid ${theme.palette.primary.main}`,
              borderRadius: '4px',
              fontSize: '0.9em',
              fontFamily: 'monospace',
              cursor: 'default',
              userSelect: 'none',
            },
            '& p.is-editor-empty:first-of-type::before': {
              color: theme.palette.text.disabled,
              content: 'attr(data-placeholder)',
              float: 'left',
              height: 0,
              pointerEvents: 'none',
            },
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
});
