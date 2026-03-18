/**
 * Universal @ Mention Menu Component
 * Provides a searchable menu for agents, skills, tools, and knowledge documents
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Divider,
  Box,
  Chip,
  InputAdornment,
  Collapse,
  ListItemButton,
  Badge,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import BuildIcon from '@mui/icons-material/Build';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ArticleIcon from '@mui/icons-material/Article';
import FolderIcon from '@mui/icons-material/Folder';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsIcon from '@mui/icons-material/Settings';
import type { MentionSuggestion } from '../../services/knowledge/KnowledgeTypes';
import { knowledgeService } from '../../services/knowledge/KnowledgeService';
import { getAllAgents } from '../../services/agents/agentTypes';

interface MentionMenuProps {
  open: boolean;
  anchorPosition?: { top: number; left: number };
  onClose: () => void;
  onSelect: (item: MentionSuggestion) => void;
  searchQuery?: string;
  embedded?: boolean;
}

interface CategorySection {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: MentionSuggestion[];
  expanded: boolean;
  color: string;
}

const MentionMenu: React.FC<MentionMenuProps> = ({
  open,
  anchorPosition,
  onClose,
  onSelect,
  searchQuery: initialQuery = '',
  embedded = false,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [categories, setCategories] = useState<CategorySection[]>([
    {
      id: 'agents',
      label: 'Agents',
      icon: <SmartToyIcon />,
      items: [],
      expanded: true,
      color: theme.palette.primary.main,
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <PsychologyIcon />,
      items: [],
      expanded: true,
      color: theme.palette.success.main,
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: <BuildIcon />,
      items: [],
      expanded: true,
      color: theme.palette.warning.main,
    },
    {
      id: 'knowledge',
      label: 'Knowledge Base',
      icon: <ArticleIcon />,
      items: [],
      expanded: true,
      color: theme.palette.info.main,
    },
    {
      id: 'system',
      label: 'System',
      icon: <SettingsIcon />,
      items: [],
      expanded: false,
      color: theme.palette.grey[500],
    },
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    if (open) {
      loadSuggestions();
    }
  }, [open]);

  // Handle search
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        searchSuggestions(searchQuery);
      } else {
        loadSuggestions();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      // Load agents
      const agents = getAllAgents();
      const agentSuggestions: MentionSuggestion[] = agents.map(agent => ({
        id: agent.id,
        type: 'agent',
        label: agent.name,
        description: agent.description,
        icon: '🤖',
        path: `@agent/${agent.id}`,
        metadata: agent,
      }));

      // Load mock skills
      const skillSuggestions: MentionSuggestion[] = [
        {
          id: 'data-analysis',
          type: 'skill',
          label: 'Data Analysis',
          description: 'Statistical analysis and visualization',
          icon: '📊',
          path: '@skill/data-analysis',
        },
        {
          id: 'code-generation',
          type: 'skill',
          label: 'Code Generation',
          description: 'Generate code snippets and templates',
          icon: '💻',
          path: '@skill/code-generation',
        },
        {
          id: 'text-processing',
          type: 'skill',
          label: 'Text Processing',
          description: 'NLP and text manipulation',
          icon: '📝',
          path: '@skill/text-processing',
        },
      ];

      // Load mock tools
      const toolSuggestions: MentionSuggestion[] = [
        {
          id: 'calculator',
          type: 'tool',
          label: 'Calculator',
          description: 'Mathematical calculations',
          icon: '🧮',
          path: '@tool/calculator',
        },
        {
          id: 'converter',
          type: 'tool',
          label: 'Unit Converter',
          description: 'Convert between units',
          icon: '🔄',
          path: '@tool/converter',
        },
        {
          id: 'formatter',
          type: 'tool',
          label: 'Code Formatter',
          description: 'Format and beautify code',
          icon: '✨',
          path: '@tool/formatter',
        },
      ];

      // Load knowledge documents
      const documents = await knowledgeService.getAllDocuments();
      const knowledgeSuggestions: MentionSuggestion[] = documents.slice(0, 10).map(doc => ({
        id: doc.id,
        type: 'knowledge',
        label: doc.title,
        description: doc.metadata.tags.join(', ') || 'No tags',
        icon: '📄',
        path: `@knowledge/${doc.id}`,
        metadata: doc,
      }));

      // System suggestions
      const systemSuggestions: MentionSuggestion[] = [
        {
          id: 'contexts',
          type: 'knowledge',
          label: 'Contexts',
          description: 'System context documents',
          icon: '📁',
          path: '@seamstress/contexts',
        },
        {
          id: 'templates',
          type: 'knowledge',
          label: 'Templates',
          description: 'Document templates',
          icon: '📋',
          path: '@seamstress/templates',
        },
        {
          id: 'help',
          type: 'knowledge',
          label: 'Help',
          description: 'Help and documentation',
          icon: '❓',
          path: '@seamstress/help',
        },
      ];

      setCategories(prev => prev.map(cat => {
        switch (cat.id) {
          case 'agents':
            return { ...cat, items: agentSuggestions };
          case 'skills':
            return { ...cat, items: skillSuggestions };
          case 'tools':
            return { ...cat, items: toolSuggestions };
          case 'knowledge':
            return { ...cat, items: knowledgeSuggestions };
          case 'system':
            return { ...cat, items: systemSuggestions };
          default:
            return cat;
        }
      }));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchSuggestions = async (query: string) => {
    setLoading(true);
    try {
      // Search in all categories
      const results = await knowledgeService.getMentionSuggestions(`@${query}`);

      // Categorize results
      const categorizedResults: Record<string, MentionSuggestion[]> = {
        agents: [],
        skills: [],
        tools: [],
        knowledge: [],
        system: [],
      };

      results.forEach(result => {
        if (result.type === 'agent') {
          categorizedResults.agents.push(result);
        } else if (result.type === 'skill') {
          categorizedResults.skills.push(result);
        } else if (result.type === 'tool') {
          categorizedResults.tools.push(result);
        } else if (result.path?.includes('@seamstress/')) {
          categorizedResults.system.push(result);
        } else {
          categorizedResults.knowledge.push(result);
        }
      });

      setCategories(prev => prev.map(cat => ({
        ...cat,
        items: categorizedResults[cat.id] || [],
        expanded: (categorizedResults[cat.id]?.length || 0) > 0,
      })));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
    ));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = categories.flatMap(cat => cat.expanded ? cat.items : []);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleSelect = (item: MentionSuggestion) => {
    onSelect(item);
    onClose();
  };

  if (!open) return null;

  const menuContent = (
    <Box
      sx={{
        width: embedded ? '100%' : 400,
        maxHeight: embedded ? 400 : 600,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Search Bar */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search agents, skills, tools, and documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Typography color="primary" sx={{ fontWeight: 600 }}>@</Typography>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Categories */}
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {categories.map((category, catIndex) => (
          <Box key={category.id}>
            {/* Category Header */}
            <ListItemButton
              onClick={() => toggleCategory(category.id)}
              sx={{
                backgroundColor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: category.color }}>
                {category.icon}
              </ListItemIcon>
              <ListItemText
                primary={category.label}
                secondary={`${category.items.length} items`}
              />
              <Badge badgeContent={category.items.length} color="default" sx={{ mr: 2 }}>
                <Box />
              </Badge>
              {category.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>

            {/* Category Items */}
            <Collapse in={category.expanded}>
              <List component="div" disablePadding>
                {category.items.map((item, index) => {
                  const globalIndex = categories
                    .slice(0, catIndex)
                    .reduce((acc, cat) => acc + (cat.expanded ? cat.items.length : 0), 0) + index;

                  return (
                    <ListItem
                      key={item.id}
                      button
                      onClick={() => handleSelect(item)}
                      selected={globalIndex === selectedIndex}
                      sx={{
                        pl: 4,
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Typography fontSize="18px">{item.icon}</Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight={500}>
                              {item.label}
                            </Typography>
                            {item.metadata?.publishingStatus === 'published' && (
                              <Chip label="Published" size="small" color="success" sx={{ height: 18 }} />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {item.description}
                          </Typography>
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.path}
                      </Typography>
                    </ListItem>
                  );
                })}
                {category.items.length === 0 && (
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body2" color="text.secondary">
                          No {category.label.toLowerCase()} found
                        </Typography>
                      }
                    />
                  </ListItem>
                )}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          p: 1,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Use ↑↓ to navigate, Enter to select, Esc to close
        </Typography>
        {loading && (
          <Typography variant="caption" color="primary">
            Loading...
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (embedded) {
    return menuContent;
  }

  return (
    <Paper
      ref={menuRef}
      elevation={8}
      sx={{
        position: 'fixed',
        top: anchorPosition?.top || '50%',
        left: anchorPosition?.left || '50%',
        transform: !anchorPosition ? 'translate(-50%, -50%)' : undefined,
        zIndex: 1500,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {menuContent}
    </Paper>
  );
};

export default MentionMenu;