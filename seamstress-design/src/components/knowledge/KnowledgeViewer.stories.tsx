import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import KnowledgeViewer from './KnowledgeViewer';
import type { KnowledgeDocument, DocumentVersion } from '../../services/knowledge/KnowledgeTypes';

const meta = {
  title: 'Knowledge/KnowledgeViewer',
  component: KnowledgeViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Fullscreen modal for viewing and editing knowledge documents. Supports version history, collaboration, and multiple view modes.',
      },
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
          <Story />
        </Box>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Control the open state of the viewer',
    },
    mode: {
      control: { type: 'radio' },
      options: ['view', 'edit'],
      description: 'Display mode of the document',
    },
    showVersionHistory: {
      control: 'boolean',
      description: 'Show version history panel',
    },
    enableSharing: {
      control: 'boolean',
      description: 'Enable document sharing features',
    },
    enableDelete: {
      control: 'boolean',
      description: 'Enable document deletion',
    },
  },
} satisfies Meta<typeof KnowledgeViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample document data
const sampleDocument: KnowledgeDocument = {
  id: 'doc-1',
  title: 'OpenGov AI Integration Guide',
  content: `# OpenGov AI Integration Guide

## Overview
This guide covers the integration of AI capabilities into the OpenGov platform, focusing on best practices and implementation strategies.

## Key Components

### 1. Natural Language Processing
The NLP module handles:
- **Intent Recognition**: Understanding user queries
- **Entity Extraction**: Identifying key information
- **Sentiment Analysis**: Gauging user feedback

### 2. Machine Learning Pipeline
Our ML pipeline includes:
1. Data preprocessing
2. Feature engineering
3. Model training
4. Evaluation and deployment

### 3. Integration Points
- REST API endpoints
- WebSocket connections for real-time updates
- Event-driven architecture

## Implementation Example

\`\`\`typescript
import { AIService } from '@opengov/ai-core';

const aiService = new AIService({
  apiKey: process.env.AI_API_KEY,
  model: 'gpt-4',
});

async function processQuery(query: string) {
  const response = await aiService.analyze(query);
  return response.insights;
}
\`\`\`

## Best Practices

> **Important**: Always validate AI responses before presenting to users.

- Implement proper error handling
- Add response caching for common queries
- Monitor API usage and costs
- Maintain audit logs

## Related Documents
- @Technical Architecture
- @Security Guidelines
- @API Documentation

## Contributors
- @John Doe - Technical Lead
- @Jane Smith - AI Engineer
- @Bob Johnson - Product Manager

---

*Last updated: November 2024*`,
  tags: ['AI', 'Integration', 'Technical', 'Guide'],
  category: 'Technical Documentation',
  status: 'published',
  createdBy: 'John Doe',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-11-01'),
  version: '2.1.0',
  permissions: {
    canEdit: true,
    canDelete: true,
    canShare: true,
  },
};

const sampleVersions: DocumentVersion[] = [
  {
    id: 'v3',
    documentId: 'doc-1',
    version: '2.1.0',
    content: sampleDocument.content,
    createdBy: 'Jane Smith',
    createdAt: new Date('2024-11-01'),
    changeNotes: 'Updated implementation examples and best practices',
  },
  {
    id: 'v2',
    documentId: 'doc-1',
    version: '2.0.0',
    content: '# OpenGov AI Integration Guide\n\n## Overview\n...(previous content)',
    createdBy: 'John Doe',
    createdAt: new Date('2024-10-15'),
    changeNotes: 'Major revision: Added ML pipeline section',
  },
  {
    id: 'v1',
    documentId: 'doc-1',
    version: '1.0.0',
    content: '# OpenGov AI Integration Guide\n\n## Initial version...',
    createdBy: 'John Doe',
    createdAt: new Date('2024-01-15'),
    changeNotes: 'Initial document creation',
  },
];

// Wrapper component to handle state
const KnowledgeViewerWrapper = (props: any) => {
  const [open, setOpen] = useState(true);
  const [document, setDocument] = useState(props.document);

  const handleClose = () => {
    setOpen(false);
    console.log('Viewer closed');
  };

  const handleSave = (updatedDoc: KnowledgeDocument) => {
    setDocument(updatedDoc);
    console.log('Document saved:', updatedDoc);
  };

  return (
    <>
      <Stack spacing={2}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open Knowledge Viewer
        </Button>
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(document, null, 2)}
          </pre>
        </Box>
      </Stack>
      <KnowledgeViewer
        {...props}
        open={open}
        document={document}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};

// Default view mode
export const Default: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    document: sampleDocument,
    versions: sampleVersions,
    mode: 'view',
    showVersionHistory: false,
    enableSharing: true,
    enableDelete: true,
  },
};

// Edit mode
export const EditMode: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    ...Default.args,
    mode: 'edit',
  },
  parameters: {
    docs: {
      description: {
        story: 'Document viewer in edit mode with the rich text editor enabled.',
      },
    },
  },
};

// With version history
export const WithVersionHistory: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    ...Default.args,
    showVersionHistory: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Document viewer showing version history panel with multiple versions.',
      },
    },
  },
};

// Read-only document
export const ReadOnly: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    document: {
      ...sampleDocument,
      permissions: {
        canEdit: false,
        canDelete: false,
        canShare: false,
      },
    },
    versions: sampleVersions,
    mode: 'view',
    enableSharing: false,
    enableDelete: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Document viewer with read-only permissions.',
      },
    },
  },
};

// Minimal document
export const MinimalDocument: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    document: {
      id: 'doc-2',
      title: 'Quick Note',
      content: '# Quick Note\n\nThis is a simple document with minimal content.',
      tags: ['Note'],
      category: 'Notes',
      status: 'draft',
      createdBy: 'Current User',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0.0',
      permissions: {
        canEdit: true,
        canDelete: true,
        canShare: true,
      },
    },
    versions: [],
    mode: 'view',
  },
};

// Technical document with code
export const TechnicalDocument: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    document: {
      ...sampleDocument,
      title: 'API Implementation Guide',
      content: `# API Implementation Guide

## Authentication

\`\`\`javascript
const auth = {
  apiKey: 'your-api-key',
  secret: 'your-secret'
};

async function authenticate() {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': auth.apiKey
    },
    body: JSON.stringify({ secret: auth.secret })
  });

  return response.json();
}
\`\`\`

## Endpoints

### GET /api/users
Returns a list of users.

\`\`\`bash
curl -X GET https://api.opengov.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

### POST /api/users
Creates a new user.

\`\`\`json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin"
}
\`\`\`

## Error Handling

| Code | Description |
|------|-------------|
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Internal Server Error |`,
      tags: ['API', 'Technical', 'Authentication', 'REST'],
    },
    versions: sampleVersions,
    mode: 'view',
  },
};

// Process documentation
export const ProcessDocument: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    document: {
      ...sampleDocument,
      title: 'Budget Approval Process',
      content: `# Budget Approval Process

## Overview
This document outlines the standard budget approval workflow for all departments.

## Process Steps

### Step 1: Budget Submission
Department heads submit their budget proposals by:
- [ ] Completing the budget template
- [ ] Adding justification notes
- [ ] Attaching supporting documents

### Step 2: Initial Review
Finance team reviews submissions for:
- [ ] Completeness
- [ ] Accuracy
- [ ] Compliance with guidelines

### Step 3: Management Approval
Required approvals:
1. Direct Manager
2. Department Director
3. CFO (for budgets > $100k)
4. CEO (for budgets > $500k)

### Step 4: Final Processing
- [ ] Update financial systems
- [ ] Notify stakeholders
- [ ] Archive documentation

## Timeline
\`\`\`mermaid
gantt
    title Budget Approval Timeline
    dateFormat  YYYY-MM-DD
    section Submission
    Prepare Documents    :2024-01-01, 7d
    Submit Proposal      :2024-01-08, 1d
    section Review
    Initial Review       :2024-01-09, 3d
    Management Review    :2024-01-12, 5d
    section Approval
    Final Approval       :2024-01-17, 2d
    Implementation       :2024-01-19, 1d
\`\`\`

## Key Contacts
- @Finance Team - Initial review
- @Budget Committee - Approval authority
- @System Admin - Technical support`,
      tags: ['Process', 'Budget', 'Workflow', 'Finance'],
      category: 'Process Documentation',
    },
    versions: sampleVersions,
    mode: 'view',
  },
};

// Playground with all features
export const Playground: Story = {
  render: (args) => <KnowledgeViewerWrapper {...args} />,
  args: {
    document: {
      ...sampleDocument,
      title: 'Interactive Playground Document',
      content: `# Interactive Playground

## Try All Features!

This is an interactive playground where you can test all viewer features:

### Editing
Click the edit button to modify this content.

### Version History
Toggle the version history panel to see document versions.

### Sharing
Use the share button to see sharing options.

### View Modes
Switch between different view modes:
- **Preview**: Rendered markdown
- **Source**: Raw markdown
- **Edit**: Rich text editor

### Mentions
This document mentions @John Doe and references @Budget Planning.

### Tags and Categories
Check out the tags and category metadata.

## Your Turn!
Feel free to edit this document and explore all the features.`,
    },
    versions: [
      ...sampleVersions,
      {
        id: 'v4',
        documentId: 'doc-1',
        version: '2.2.0',
        content: 'Latest playground updates...',
        createdBy: 'You',
        createdAt: new Date(),
        changeNotes: 'Your experimental changes',
      },
    ],
    mode: 'view',
    showVersionHistory: false,
    enableSharing: true,
    enableDelete: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A fully interactive playground to test all KnowledgeViewer features.',
      },
    },
  },
};