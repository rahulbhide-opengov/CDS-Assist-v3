/**
 * Simplified Mention Service for TipTap
 * Shows actual items, not category placeholders
 */

import type { MentionSuggestion } from './KnowledgeTypes';
import { knowledgeService } from './KnowledgeService';
import { getAllAgents } from '../agents/agentTypes';

export async function getSimpleMentionSuggestions(query: string): Promise<MentionSuggestion[]> {
  const suggestions: MentionSuggestion[] = [];
  const lowerQuery = query.toLowerCase();

  // Get all available items
  const allSuggestions: MentionSuggestion[] = [];

  // Add agents
  const agents = getAllAgents();
  agents.forEach(agent => {
    allSuggestions.push({
      id: agent.id,
      type: 'agent',
      label: `agent/${agent.name}`,
      description: agent.description,
      icon: '🤖',
      color: agent.color,
      path: `@agent/${agent.id}`,
      metadata: agent,
    });
  });

  // Add knowledge documents - with error handling
  try {
    const documents = await knowledgeService.getAllDocuments();
    documents.slice(0, 20).forEach(doc => {
      allSuggestions.push({
        id: doc.id,
        type: 'knowledge',
        label: `knowledge/${doc.title}`,
        description: doc.metadata.tags.join(', ') || 'No tags',
        icon: '📄',
        path: `@knowledge/${doc.id}`,
        metadata: doc,
      });
    });
  } catch (error) {
    // If no documents exist yet, this is expected - continue without documents
  }

  // Add skills (mock data)
  const skills = [
    { id: 'data-analysis', name: 'Data Analysis', description: 'Data analysis and visualization' },
    { id: 'code-generation', name: 'Code Generation', description: 'Generate code snippets' },
    { id: 'text-processing', name: 'Text Processing', description: 'Text manipulation and NLP' },
  ];

  skills.forEach(skill => {
    allSuggestions.push({
      id: skill.id,
      type: 'skill',
      label: `skill/${skill.name}`,
      description: skill.description,
      icon: '💡',
      path: `@skill/${skill.id}`,
    });
  });

  // Add tools (mock data)
  const tools = [
    { id: 'calculator', name: 'Calculator', description: 'Basic calculator functions' },
    { id: 'converter', name: 'Unit Converter', description: 'Convert between units' },
    { id: 'formatter', name: 'Code Formatter', description: 'Format and beautify code' },
  ];

  tools.forEach(tool => {
    allSuggestions.push({
      id: tool.id,
      type: 'tool',
      label: `tool/${tool.name}`,
      description: tool.description,
      icon: '🔧',
      path: `@tool/${tool.id}`,
    });
  });

  // Add seamstress system items
  const seamstressItems = [
    { id: 'seamstress-contexts', name: 'contexts', description: 'System context documents' },
    { id: 'seamstress-templates', name: 'templates', description: 'Document templates' },
    { id: 'seamstress-help', name: 'help', description: 'Help and documentation' },
  ];

  seamstressItems.forEach(item => {
    allSuggestions.push({
      id: item.id,
      type: 'knowledge',
      label: `seamstress/${item.name}`,
      description: item.description,
      icon: '📁',
      path: `@seamstress/${item.name}`,
    });
  });

  // Filter based on query
  if (query === '') {
    // When no query, show a good mix of items from each category
    const byType: Record<string, MentionSuggestion[]> = {};
    allSuggestions.forEach(item => {
      if (!byType[item.type]) byType[item.type] = [];
      byType[item.type].push(item);
    });

    // Take first 3 of each type to show variety
    const typeOrder = ['agent', 'skill', 'tool', 'knowledge'];
    typeOrder.forEach(type => {
      if (byType[type]) {
        suggestions.push(...byType[type].slice(0, 3));
      }
    });

    // If we have less than 10 items total, add more
    if (suggestions.length < 10) {
      const remaining = allSuggestions.filter(item => !suggestions.includes(item));
      suggestions.push(...remaining.slice(0, 10 - suggestions.length));
    }
  } else {
    // Filter by query - check if query matches any part of the label
    const filtered = allSuggestions.filter(item => {
      const label = item.label.toLowerCase();
      const desc = item.description?.toLowerCase() || '';

      // Check if query matches the type prefix (e.g., "skill" matches "skill/...")
      if (label.startsWith(lowerQuery)) return true;

      // Check if query matches anywhere in the label
      if (label.includes(lowerQuery)) return true;

      // Check if query matches in the description
      if (desc.includes(lowerQuery)) return true;

      // Special handling for partial type matches
      const parts = label.split('/');
      if (parts[0].startsWith(lowerQuery)) return true;
      if (parts[1] && parts[1].includes(lowerQuery)) return true;

      return false;
    });

    // Sort results - exact prefix matches first
    filtered.sort((a, b) => {
      const aLabel = a.label.toLowerCase();
      const bLabel = b.label.toLowerCase();

      // Exact prefix matches first
      const aStartsWith = aLabel.startsWith(lowerQuery);
      const bStartsWith = bLabel.startsWith(lowerQuery);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Then by type
      if (a.type !== b.type) {
        const typeOrder = ['agent', 'skill', 'tool', 'knowledge'];
        return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
      }

      return aLabel.localeCompare(bLabel);
    });

    suggestions.push(...filtered.slice(0, 15)); // Limit to 15 results
  }

  // Always return at least some suggestions if we have none
  if (suggestions.length === 0 && allSuggestions.length > 0) {
    // Return first 5 items as fallback
    return allSuggestions.slice(0, 5);
  }

  return suggestions;
}