import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import Link from '@tiptap/extension-link';
import { MentionExtension } from '../extensions/tiptap/MentionExtension';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  Divider,
  useTheme
} from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number | string;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  minHeight = 200
}) => {
  const theme = useTheme();
  const [headingLevel, setHeadingLevel] = React.useState('paragraph');

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
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
      }),
      MentionExtension,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  React.useEffect(() => {
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

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper,
      border: '1px solid',
      borderColor: theme.palette.divider,
      borderRadius: '4px',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
      minHeight: 0
    }}>
      {/* Formatting Toolbar */}
      <Box sx={{
        borderBottom: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'grey.50',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap'
      }}>
        {/* Heading Selector */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={headingLevel}
            onChange={handleHeadingChange}
            sx={{
              height: 32,
              fontSize: '14px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.12)',
              }
            }}
          >
            <MenuItem value="paragraph">Normal</MenuItem>
            <MenuItem value="h1">Heading 1</MenuItem>
            <MenuItem value="h2">Heading 2</MenuItem>
            <MenuItem value="h3">Heading 3</MenuItem>
          </Select>
        </FormControl>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text Formatting */}
        <ToggleButtonGroup
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '4px',
              padding: '4px',
              marginRight: '4px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(75, 63, 255, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(75, 63, 255, 0.2)'
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
          }}
        >
          <ToggleButton
            value="bold"
            selected={editor.isActive('bold')}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton
            value="italic"
            selected={editor.isActive('italic')}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Lists */}
        <ToggleButtonGroup
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '4px',
              padding: '4px',
              marginRight: '4px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(75, 63, 255, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(75, 63, 255, 0.2)'
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
          }}
        >
          <ToggleButton
            value="bulletList"
            selected={editor.isActive('bulletList')}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton
            value="orderedList"
            selected={editor.isActive('orderedList')}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        {/* Text Alignment */}
        <ToggleButtonGroup
          size="small"
          exclusive
          value={
            editor.isActive({ textAlign: 'center' }) ? 'center' :
            editor.isActive({ textAlign: 'right' }) ? 'right' :
            editor.isActive({ textAlign: 'justify' }) ? 'justify' :
            'left'
          }
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: '4px',
              padding: '4px',
              marginRight: '4px',
              '&.Mui-selected': {
                backgroundColor: 'rgba(75, 63, 255, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(75, 63, 255, 0.2)'
                }
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }
          }}
        >
          <ToggleButton
            value="left"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
          >
            <FormatAlignLeftIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton
            value="center"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
          >
            <FormatAlignCenterIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton
            value="right"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
          >
            <FormatAlignRightIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
          <ToggleButton
            value="justify"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          >
            <FormatAlignJustifyIcon sx={{ fontSize: 18 }} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Editor Content */}
      <Box sx={{
        flex: 1,
        px: 2,
        py: 4,  // Theme padding level 4 for top and bottom
        minHeight,
        overflow: 'auto',
        '& .ProseMirror': {
          outline: 'none',
          minHeight: '100%',
          fontSize: '14px',
          lineHeight: 1.5,
          fontFamily: 'DM Sans',
          color: theme.palette.text.primary,
          maxWidth: theme.breakpoints.values.md, // Using md breakpoint (900px) for max-width
          margin: '0 auto',
          width: '100%',
          '& h1': {
            fontSize: '2em',
            fontWeight: 600,
            margin: '0.67em 0',
            lineHeight: 1.2
          },
          '& h2': {
            fontSize: '1.5em',
            fontWeight: 600,
            margin: '0.75em 0',
            lineHeight: 1.3
          },
          '& h3': {
            fontSize: '1.17em',
            fontWeight: 600,
            margin: '0.83em 0',
            lineHeight: 1.4
          },
          '& p': {
            margin: '0 0 1em 0',
            '&:last-child': {
              marginBottom: 0
            }
          },
          '& ul, & ol': {
            paddingLeft: '1.5em',
            margin: '0 0 1em 0',
            '&:last-child': {
              marginBottom: 0
            }
          },
          '& li': {
            marginBottom: '0.25em',
            '&:last-child': {
              marginBottom: 0
            }
          },
          '& blockquote': {
            borderLeft: '3px solid',
            borderColor: theme.palette.primary.main,
            paddingLeft: '1em',
            marginLeft: 0,
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
            margin: '1em 0',
          },
          '& code': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : theme.palette.grey[100],
            color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit',
            padding: '0.2em 0.4em',
            borderRadius: '3px',
            fontFamily: 'monospace',
            fontSize: '0.9em',
          },
          '& pre': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : theme.palette.grey[100],
            padding: '1em',
            borderRadius: '4px',
            overflow: 'auto',
            margin: '1em 0',
            '& code': {
              backgroundColor: 'transparent',
              padding: 0,
            },
          },
          '& p.is-editor-empty:first-of-type::before': {
            content: 'attr(data-placeholder)',
            float: 'left',
            color: theme.palette.text.disabled,
            pointerEvents: 'none',
            height: 0
          },
          '&:focus': {
            outline: 'none'
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
          }
        }
      }}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default TiptapEditor;