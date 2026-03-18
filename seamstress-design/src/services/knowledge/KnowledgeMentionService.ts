/**
 * Knowledge Mention Service
 * Handles @ mention suggestions for TipTap editor
 */

import type { MentionSuggestion } from './KnowledgeTypes';
import { knowledgeService } from './KnowledgeService';
import { getAllAgents } from '../agents/agentTypes';

export async function getEnhancedMentionSuggestions(query: string): Promise<MentionSuggestion[]> {
  const suggestions: MentionSuggestion[] = [];

  // Normalize query - remove @ if present since TipTap already strips it
  const normalizedQuery = query.startsWith('@') ? query.substring(1) : query;
  const lowerQuery = normalizedQuery.toLowerCase();

  // Show everything if query is empty
  if (normalizedQuery === '' || normalizedQuery === '@') {
    return [
      {
        id: 'hint-knowledge',
        type: 'knowledge',
        label: 'knowledge/',
        description: 'Reference knowledge documents',
        icon: '📚',
        path: '@knowledge/',
      },
      {
        id: 'hint-agent',
        type: 'agent',
        label: 'agent/',
        description: 'Reference AI agents',
        icon: '🤖',
        path: '@agent/',
      },
      {
        id: 'hint-skill',
        type: 'skill',
        label: 'skill/',
        description: 'Reference skills',
        icon: '💡',
        path: '@skill/',
      },
      {
        id: 'hint-tool',
        type: 'tool',
        label: 'tool/',
        description: 'Reference tools',
        icon: '🔧',
        path: '@tool/',
      },
      {
        id: 'hint-seamstress',
        type: 'knowledge',
        label: 'seamstress/',
        description: 'System commands and contexts',
        icon: '⚙️',
        path: '@seamstress/',
      },
    ];
  }

  // Handle specific category searches
  if (normalizedQuery.startsWith('knowledge/')) {
    const searchTerm = normalizedQuery.replace('knowledge/', '').toLowerCase();

    if (searchTerm === '') {
      // Show all documents when just "knowledge/" is typed
      const documents = await knowledgeService.getAllDocuments();
      return documents.slice(0, 10).map(doc => ({
        id: doc.id,
        type: 'knowledge' as const,
        label: `knowledge/${doc.title}`,
        description: doc.metadata.tags.join(', ') || 'No tags',
        icon: '📄',
        path: `@knowledge/${doc.id}`,
        metadata: doc,
      }));
    } else {
      // Search documents
      const results = await knowledgeService.searchDocuments(searchTerm);
      return results.slice(0, 10).map(result => ({
        id: result.document.id,
        type: 'knowledge' as const,
        label: `knowledge/${result.document.title}`,
        description: result.document.metadata.tags.join(', ') || 'No tags',
        icon: '📄',
        path: `@knowledge/${result.document.id}`,
        metadata: result.document,
      }));
    }
  }

  if (normalizedQuery.startsWith('agent/')) {
    const searchTerm = normalizedQuery.replace('agent/', '').toLowerCase();
    const agents = getAllAgents();

    const filtered = searchTerm === ''
      ? agents
      : agents.filter(agent => agent.name.toLowerCase().includes(searchTerm));

    return filtered.map(agent => ({
      id: agent.id,
      type: 'agent' as const,
      label: `agent/${agent.name}`,
      description: agent.description,
      icon: '🤖',
      color: agent.color,
      path: `@agent/${agent.id}`,
      metadata: agent,
    }));
  }

  if (normalizedQuery.startsWith('skill/')) {
    const searchTerm = normalizedQuery.replace('skill/', '').toLowerCase();
    const skills = [
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Data analysis and visualization',
      },
      {
        id: 'code-generation',
        name: 'Code Generation',
        description: 'Generate code snippets',
      },
      {
        id: 'text-processing',
        name: 'Text Processing',
        description: 'Text manipulation and NLP',
      },
    ];

    const filtered = searchTerm === ''
      ? skills
      : skills.filter(skill => skill.name.toLowerCase().includes(searchTerm));

    return filtered.map(skill => ({
      id: skill.id,
      type: 'skill' as const,
      label: `skill/${skill.name}`,
      description: skill.description,
      icon: '💡',
      path: `@skill/${skill.id}`,
    }));
  }

  if (normalizedQuery.startsWith('tool/')) {
    const searchTerm = normalizedQuery.replace('tool/', '').toLowerCase();
    const tools = [
      {
        id: 'calculator',
        name: 'Calculator',
        description: 'Basic calculator functions',
      },
      {
        id: 'converter',
        name: 'Unit Converter',
        description: 'Convert between units',
      },
      {
        id: 'formatter',
        name: 'Code Formatter',
        description: 'Format and beautify code',
      },
    ];

    const filtered = searchTerm === ''
      ? tools
      : tools.filter(tool => tool.name.toLowerCase().includes(searchTerm));

    return filtered.map(tool => ({
      id: tool.id,
      type: 'tool' as const,
      label: `tool/${tool.name}`,
      description: tool.description,
      icon: '🔧',
      path: `@tool/${tool.id}`,
    }));
  }

  if (normalizedQuery.startsWith('seamstress/')) {
    const searchTerm = normalizedQuery.replace('seamstress/', '').toLowerCase();
    const seamstressOptions = [
      {
        id: 'seamstress-contexts',
        name: 'contexts',
        description: 'System context documents',
      },
      {
        id: 'seamstress-templates',
        name: 'templates',
        description: 'Document templates',
      },
      {
        id: 'seamstress-help',
        name: 'help',
        description: 'Help and documentation',
      },
    ];

    const filtered = searchTerm === ''
      ? seamstressOptions
      : seamstressOptions.filter(opt => opt.name.includes(searchTerm));

    return filtered.map(opt => ({
      id: opt.id,
      type: 'knowledge' as const,
      label: `seamstress/${opt.name}`,
      description: opt.description,
      icon: '📁',
      path: `@seamstress/${opt.name}`,
    }));
  }

  // If query doesn't match any pattern, show category hints with the query as filter
  const categoryHints = [
    {
      id: 'hint-knowledge',
      type: 'knowledge' as const,
      label: 'knowledge/',
      description: 'Reference knowledge documents',
      icon: '📚',
      path: '@knowledge/',
    },
    {
      id: 'hint-agent',
      type: 'agent' as const,
      label: 'agent/',
      description: 'Reference AI agents',
      icon: '🤖',
      path: '@agent/',
    },
    {
      id: 'hint-skill',
      type: 'skill' as const,
      label: 'skill/',
      description: 'Reference skills',
      icon: '💡',
      path: '@skill/',
    },
    {
      id: 'hint-tool',
      type: 'tool' as const,
      label: 'tool/',
      description: 'Reference tools',
      icon: '🔧',
      path: '@tool/',
    },
    {
      id: 'hint-seamstress',
      type: 'knowledge' as const,
      label: 'seamstress/',
      description: 'System commands and contexts',
      icon: '⚙️',
      path: '@seamstress/',
    },
  ];

  return categoryHints.filter(hint =>
    hint.label.toLowerCase().includes(lowerQuery)
  );
}