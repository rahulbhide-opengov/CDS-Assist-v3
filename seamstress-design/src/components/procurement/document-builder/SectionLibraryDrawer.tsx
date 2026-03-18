/**
 * Section Library Drawer
 * Browse and insert reusable sections from the library
 *
 * Features:
 * - Search sections
 * - Filter by category
 * - Preview section content
 * - Insert section into document
 * - Show usage statistics
 */

import React, { useState, useMemo, useEffect } from 'react';
import DOMPurify from 'dompurify';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Tabs,
  Tab,
  Button,
  Divider,
  Skeleton,
  alpha,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useSectionLibrary } from '../../../hooks/procurement/useSectionLibrary';
import type { SharedSection } from '../../../types/procurement';

interface SectionLibraryDrawerProps {
  open: boolean;
  onClose: () => void;
  onInsertSection: (section: SharedSection) => void;
}

export const SectionLibraryDrawer: React.FC<SectionLibraryDrawerProps> = ({
  open,
  onClose,
  onInsertSection,
}) => {
  const theme = useTheme();
  const { sections, isLoading, error, getCategories, incrementUsageCount } = useSectionLibrary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [categories, setCategories] = useState<string[]>([]);
  const [previewSection, setPreviewSection] = useState<SharedSection | null>(null);

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(['All', ...cats]);
    };
    if (open) {
      loadCategories();
    }
  }, [open, getCategories]);

  // Filter sections
  const filteredSections = useMemo(() => {
    let filtered = sections;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          s.category.toLowerCase().includes(query)
      );
    }

    // Sort by usage count (most used first)
    return filtered.sort((a, b) => b.usageCount - a.usageCount);
  }, [sections, selectedCategory, searchQuery]);

  // Handle section insertion
  const handleInsertSection = async (section: SharedSection) => {
    // Increment usage count
    await incrementUsageCount(section.sectionId);

    // Call parent handler
    onInsertSection(section);

    // Close drawer
    onClose();
  };

  // Category colors using theme palette
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'Terms & Conditions': theme.palette.primary.main,
      'Insurance Requirements': theme.palette.error.main,
      'Compliance': theme.palette.success.main,
      'Evaluation Criteria': theme.palette.warning.main,
      'Pricing': theme.palette.secondary.main,
      'Timelines': theme.palette.info.main,
    };
    return colors[category] || theme.palette.grey[600];
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Section Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Insert reusable sections into your document
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Error message */}
      {error && (
        <Box
          sx={{
            mx: 2,
            mt: 2,
            p: 2,
            bgcolor: 'error.light',
            color: 'error.contrastText',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search sections by title, category, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Category tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs
          value={selectedCategory}
          onChange={(_, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category) => (
            <Tab
              key={category}
              label={category}
              value={category}
              sx={{ textTransform: 'none' }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Section list */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {isLoading ? (
          // Loading skeletons
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <Box key={i} sx={{ mb: 2 }}>
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} sx={{ mt: 0.5 }} />
                <Skeleton variant="rectangular" height={60} sx={{ mt: 1, borderRadius: 1 }} />
              </Box>
            ))}
          </>
        ) : filteredSections.length === 0 ? (
          // Empty state
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              px: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No sections found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'Try adjusting your search terms'
                : selectedCategory === 'All'
                ? 'No sections available'
                : `No sections in ${selectedCategory}`}
            </Typography>
          </Box>
        ) : (
          // Section cards
          <List sx={{ p: 0 }}>
            {filteredSections.map((section) => (
              <Box
                key={section.sectionId}
                sx={{
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 2,
                    borderColor: 'primary.main',
                  },
                }}
              >
                <ListItemButton
                  onClick={() => setPreviewSection(section)}
                  selected={previewSection?.sectionId === section.sectionId}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    p: 2,
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        {section.title}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        <Chip
                          label={section.category}
                          size="small"
                          sx={{
                            bgcolor: alpha(getCategoryColor(section.category), 0.1),
                            color: getCategoryColor(section.category),
                            fontWeight: 600,
                            fontSize: '0.7rem',
                          }}
                        />
                        {section.usageCount > 0 && (
                          <Chip
                            icon={<TrendingUpIcon />}
                            label={`Used ${section.usageCount}x`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>

                      {section.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {section.tags.slice(0, 3).map((tag) => (
                            <Chip
                              key={tag}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.65rem', height: 20 }}
                            />
                          ))}
                          {section.tags.length > 3 && (
                            <Chip
                              label={`+${section.tags.length - 3}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.65rem', height: 20 }}
                            />
                          )}
                        </Box>
                      )}
                    </Box>

                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInsertSection(section);
                      }}
                      sx={{ textTransform: 'none', flexShrink: 0 }}
                    >
                      Insert
                    </Button>
                  </Box>

                  {/* Preview (shown when selected) */}
                  {previewSection?.sectionId === section.sectionId && (
                    <Box
                      sx={{
                        mt: 2,
                        pt: 2,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        width: '100%',
                      }}
                    >
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        PREVIEW
                      </Typography>
                      <Box
                        sx={{
                          p: 1.5,
                          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
                          borderRadius: 1,
                          maxHeight: 200,
                          overflow: 'auto',
                          fontSize: '0.875rem',
                          '& p': { margin: '0.5em 0' },
                          '& ul, & ol': { margin: '0.5em 0', paddingLeft: '1.5em' },
                        }}
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(section.content) }}
                      />
                    </Box>
                  )}
                </ListItemButton>
              </Box>
            ))}
          </List>
        )}
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {filteredSections.length} section{filteredSections.length !== 1 ? 's' : ''} available
        </Typography>
      </Box>
    </Drawer>
  );
};
