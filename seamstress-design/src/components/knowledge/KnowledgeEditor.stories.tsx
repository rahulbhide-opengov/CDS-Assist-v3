import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import KnowledgeEditor from './KnowledgeEditor';

const meta = {
  title: 'Knowledge/KnowledgeEditor',
  component: KnowledgeEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Enhanced TipTap editor with @ mention support for knowledge documents. Features rich text editing, markdown support, and intelligent mention suggestions.',
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Box sx={{ p: 2, bgcolor: 'background.paper', minHeight: 400 }}>
          <Story />
        </Box>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for empty editor',
    },
    minHeight: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: 'Minimum height of the editor',
    },
    showToolbar: {
      control: 'boolean',
      description: 'Show or hide the formatting toolbar',
    },
    readOnly: {
      control: 'boolean',
      description: 'Make the editor read-only',
    },
    mentionSuggestions: {
      control: 'object',
      description: 'List of mention suggestions',
    },
  },
} satisfies Meta<typeof KnowledgeEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to handle state
const KnowledgeEditorWrapper = (props: any) => {
  const [value, setValue] = useState(props.value || '');

  return (
    <KnowledgeEditor
      {...props}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        console.log('Content updated:', newValue);
      }}
    />
  );
};

// Default story with basic configuration
export const Default: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    placeholder: 'Start writing your knowledge document...',
    minHeight: 400,
    showToolbar: true,
    readOnly: false,
    value: '',
    mentionSuggestions: [
      { id: '1', name: 'John Doe', type: 'user' },
      { id: '2', name: 'Budget Planning', type: 'skill' },
      { id: '3', name: 'Data Analysis', type: 'tool' },
    ],
  },
};

// Story with pre-filled content
export const WithContent: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...Default.args,
    value: `# Knowledge Base Article

Welcome to the knowledge editor! This editor supports:

## Rich Text Formatting
- **Bold text** for emphasis
- *Italic text* for subtle emphasis
- ~~Strikethrough~~ for corrections

## Lists
1. Numbered lists
2. With multiple items
   - And nested bullets
   - For sub-points

## Mentions
Try typing @ to mention @John Doe or reference @Budget Planning skill.

## Code Blocks
\`\`\`javascript
function example() {
  console.log('Hello, Knowledge Base!');
}
\`\`\`

## Links
Visit [OpenGov](https://opengov.com) for more information.

> Blockquotes are great for highlighting important information.

---

*Start editing to see the editor in action!*`,
  },
};

// Story with mention suggestions
export const WithMentions: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...Default.args,
    value: 'Type @ to see mention suggestions. Try mentioning @',
    mentionSuggestions: [
      { id: '1', name: 'Alice Johnson', type: 'user' },
      { id: '2', name: 'Bob Smith', type: 'user' },
      { id: '3', name: 'Carol Williams', type: 'user' },
      { id: '4', name: 'Budget Analysis', type: 'skill' },
      { id: '5', name: 'Financial Planning', type: 'skill' },
      { id: '6', name: 'Data Visualization', type: 'skill' },
      { id: '7', name: 'Excel Parser', type: 'tool' },
      { id: '8', name: 'PDF Generator', type: 'tool' },
      { id: '9', name: 'API Connector', type: 'tool' },
    ],
  },
};

// Read-only story
export const ReadOnly: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...WithContent.args,
    readOnly: true,
    showToolbar: false,
  },
};

// Story without toolbar
export const WithoutToolbar: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...Default.args,
    showToolbar: false,
    placeholder: 'Start typing... (Toolbar hidden)',
  },
};

// Minimal height story
export const MinimalHeight: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...Default.args,
    minHeight: 200,
    value: 'This editor has a minimal height of 200px.',
  },
};

// Extended height story
export const ExtendedHeight: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...Default.args,
    minHeight: 600,
    value: 'This editor has an extended height of 600px, perfect for longer documents.',
  },
};

// Story with markdown example
export const MarkdownExample: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    ...Default.args,
    value: `# Markdown Support

The editor fully supports markdown syntax:

## Headers
# H1 Header
## H2 Header
### H3 Header
#### H4 Header

## Text Formatting
**Bold** text using double asterisks
*Italic* text using single asterisks
***Bold and Italic*** using triple asterisks
\`inline code\` using backticks

## Lists
- Unordered list item 1
- Unordered list item 2
  - Nested item 2.1
  - Nested item 2.2

1. Ordered list item 1
2. Ordered list item 2
   1. Nested item 2.1
   2. Nested item 2.2

## Links and Images
[Link text](https://example.com)
![Alt text](https://via.placeholder.com/150)

## Tables
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Code Block
\`\`\`python
def hello_world():
    print("Hello from the Knowledge Editor!")
\`\`\`

## Task Lists
- [x] Completed task
- [ ] Pending task
- [ ] Another pending task`,
  },
};

// Interactive playground story
export const Playground: Story = {
  render: (args) => <KnowledgeEditorWrapper {...args} />,
  args: {
    placeholder: 'This is your playground! Try all the features...',
    minHeight: 500,
    showToolbar: true,
    readOnly: false,
    value: '',
    mentionSuggestions: [
      { id: '1', name: 'Product Manager', type: 'user' },
      { id: '2', name: 'Software Engineer', type: 'user' },
      { id: '3', name: 'UX Designer', type: 'user' },
      { id: '4', name: 'Agile Planning', type: 'skill' },
      { id: '5', name: 'Code Review', type: 'skill' },
      { id: '6', name: 'User Research', type: 'skill' },
      { id: '7', name: 'Jira Integration', type: 'tool' },
      { id: '8', name: 'Slack Bot', type: 'tool' },
      { id: '9', name: 'Analytics Dashboard', type: 'tool' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'A fully interactive playground where you can test all editor features including formatting, mentions, and markdown.',
      },
    },
  },
};