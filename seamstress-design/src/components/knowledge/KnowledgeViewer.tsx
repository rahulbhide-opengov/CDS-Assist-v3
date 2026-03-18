/**
 * Knowledge Viewer Component
 * Fullscreen modal for viewing and editing knowledge documents
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Divider,
  TextField,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { useNavigate } from 'react-router-dom';
import type { KnowledgeDocument, DocumentVersion } from '../../services/knowledge/KnowledgeTypes';
import { knowledgeService } from '../../services/knowledge/KnowledgeService';
import KnowledgeEditor from './KnowledgeEditor';
import Drawer from '../Drawer/Drawer';
import { Result } from '@opengov/components-result';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';
import HistoryIcon from '@mui/icons-material/History';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CodeIcon from '@mui/icons-material/Code';
import PreviewIcon from '@mui/icons-material/Preview';
import RestoreIcon from '@mui/icons-material/Restore';
import TagIcon from '@mui/icons-material/Tag';

interface KnowledgeViewerProps {
  documentId: string | null;
  open: boolean;
  onClose: () => void;
  onSave?: (document: KnowledgeDocument) => void;
  onDelete?: (documentId: string) => void;
}

const KnowledgeViewer: React.FC<KnowledgeViewerProps> = ({
  documentId,
  open,
  onClose,
  onSave,
  onDelete,
}) => {
  const [document, setDocument] = useState<KnowledgeDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editedTitle, setEditedTitle] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [showVersions, setShowVersions] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentId && open) {
      loadDocument();
    }
  }, [documentId, open]);

  const loadDocument = async () => {
    if (!documentId) return;
    
    setLoading(true);
    try {
      const doc = await knowledgeService.getDocument(documentId);
      if (doc) {
        setDocument(doc);
        setEditedContent(doc.content);
        setEditedTitle(doc.title);
        setEditedTags(doc.metadata.tags);
      } else {
        console.warn(`Document with ID ${documentId} not found`);
        // Create a placeholder document for display
        setDocument({
          id: documentId,
          title: 'Document Not Found',
          content: '# Document Not Found\n\nThe requested document could not be loaded.',
          type: 'markdown',
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: 'system',
            category: 'Error',
            tags: [],
            version: 1,
            isPublished: false
          }
        } as KnowledgeDocument);
      }
    } catch (error) {
      console.error('Failed to load document:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async () => {
    if (!documentId) return;

    setLoading(true);
    try {
      const versionHistory = await knowledgeService.getVersionHistory(documentId);
      setVersions(versionHistory);
      setShowVersions(true);
    } catch (error) {
      console.error('Failed to load versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!document) return;
    
    setLoading(true);
    try {
      const updated = await knowledgeService.updateDocument(document.id, {
        title: editedTitle,
        content: editedContent,
        tags: editedTags,
      });
      setDocument(updated);
      setIsEditing(false);
      onSave?.(updated);
    } catch (error) {
      // Failed to save document
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const published = await knowledgeService.publishDocument(document.id);
      setDocument(published);
      onSave?.(published);
    } catch (error) {
      // Failed to publish document
    } finally {
      setLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!document) return;

    setLoading(true);
    try {
      const unpublished = await knowledgeService.unpublishDocument(document.id);
      setDocument(unpublished);
      onSave?.(unpublished);
    } catch (error) {
      // Failed to unpublish document
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!document) return;

    setLoading(true);
    setShowDeleteConfirm(false);
    try {
      await knowledgeService.deleteDocument(document.id);
      onDelete?.(document.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  const handleRestoreVersion = async (versionId: string) => {
    if (!documentId) return;
    
    setLoading(true);
    try {
      const restored = await knowledgeService.restoreVersion(documentId, versionId);
      setDocument(restored);
      setEditedContent(restored.content);
      setShowVersions(false);
    } catch (error) {
      // Failed to restore version
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedTags.includes(newTag.trim())) {
      setEditedTags([...editedTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setEditedTags(editedTags.filter(t => t !== tag));
  };

  const handleDownload = () => {
    if (!document) return;

    const blob = new Blob([document.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadOriginal = () => {
    if (!document?.originalFile || !document?.originalFileName) return;

    const url = URL.createObjectURL(document.originalFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.originalFileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Process markdown and convert mentions to HTML
  const processMarkdownWithMentions = (content: string): string => {
    // First convert markdown to HTML
    let html = marked(content);

    // Then process mentions
    const mentionPattern = /@(agent|skill|tool|knowledge|seamstress)\/([\w-]+)/g;
    html = html.replace(mentionPattern, (match, type, id) => {
      return `<span class="mention-${type}" data-mention-type="${type}" data-mention-id="${id}" data-mention-label="${match}">${match}</span>`;
    });

    return html;
  };

  const handleMentionClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    // Check if clicked element is a mention
    if (target.classList.contains('knowledge-mention') ||
        target.classList.contains('mention-agent') ||
        target.classList.contains('mention-skill') ||
        target.classList.contains('mention-tool') ||
        target.classList.contains('mention-knowledge')) {

      event.preventDefault();
      event.stopPropagation();

      // Get the mention data - try multiple ways to get it
      const mentionId = target.getAttribute('data-mention-id');
      const mentionType = target.getAttribute('data-mention-type');
      const mentionLabel = target.getAttribute('data-mention-label') || target.textContent;

      // Navigate based on mention type
      if (mentionType === 'agent' && mentionId) {
        onClose(); // Close the viewer first
        navigate(`/agents/${mentionId}`);
      } else if (mentionType === 'skill' && mentionId) {
        onClose();
        navigate(`/skills/${mentionId}`);
      } else if (mentionType === 'tool' && mentionId) {
        onClose();
        navigate(`/tools/${mentionId}`);
      } else if (mentionType === 'knowledge' && mentionId) {
        // For knowledge documents, reload this viewer with the new document
        onClose();
        navigate(`/agent-studio/knowledge?doc=${mentionId}`);
      }
    }
  };

  // Attach click handler to content after rendering
  useEffect(() => {
    if (contentRef.current && !isEditing) {
      contentRef.current.addEventListener('click', handleMentionClick as any);

      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener('click', handleMentionClick as any);
        }
      };
    }
  }, [document, isEditing]);

  if (!document) return null;

  // Don't render anything if dialog is not open
  if (!open) return null;

  // Show loading state
  if (loading || !document) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'background.default',
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: 'background.default',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          '& .MuiSvgIcon-root': {
            marginRight: 0,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isEditing ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              variant="standard"
              sx={{
                '& .MuiInput-root': {
                  fontSize: '32px',
                  fontWeight: 600,
                },
              }}
            />
          ) : (
            <Typography variant="h1">
              {document?.title || 'Loading...'}
            </Typography>
          )}
          
          <Chip
            label={document?.publishingStatus || 'draft'}
            size="small"
            color={document?.publishingStatus === 'published' ? 'success' : 'default'}
            variant={document?.publishingStatus === 'published' ? 'filled' : 'outlined'}
          />

          <Chip
            label={document?.type || 'unknown'}
            size="small"
            variant="outlined"
          />

          {document?.originalFileName && (
            <Chip
              label={`Converted from ${document.originalFileName.split('.').pop()?.toUpperCase()}`}
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                size="default"
                sx={{
                  backgroundColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.dark'
                  }
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(document?.content || '');
                  setEditedTitle(document?.title || '');
                  setEditedTags(document?.metadata?.tags || []);
                }}
                size="default"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => setIsEditing(true)}
                size="default"
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                onClick={loadVersions}
                size="default"
                disabled={loading}
              >
                History
              </Button>
              <Button
                variant="outlined"
                onClick={handleMenuOpen}
                color="secondary"
                size="default"
              >
                More
              </Button>
            </>
          )}
           <IconButton
              onClick={onClose}
              size="medium"
            >
              <CloseIcon  />
            </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Metadata Bar */}
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '12px' }}>
              {document?.metadata?.author?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="body2" color="text.secondary">
              {document?.metadata?.author || 'Unknown'}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Created: {document?.metadata?.created ? new Date(document.metadata.created).toLocaleDateString() : 'N/A'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Modified: {document?.metadata?.modified ? new Date(document.metadata.modified).toLocaleDateString() : 'N/A'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            Version: {document?.metadata?.version || 1}
          </Typography>
        </Box>
        
        {/* Tags Section */}
        {(isEditing || (document?.metadata?.tags?.length || 0) > 0) && (
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
            }}
          >
            <TagIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            {isEditing ? (
              <>
                {editedTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
                <TextField
                  size="small"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                  sx={{ width: 120 }}
                />
              </>
            ) : (
              document?.metadata?.tags?.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))
            )}
          </Box>
        )}
        
        {/* Content Area */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: 'background.secondary' }}>
          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
               <KnowledgeEditor
                  value={editedContent}
                  onChange={setEditedContent}
                  placeholder="Write your document content here..."
                  minHeight="100%"
                />
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: '900px',
                mx: 'auto',
                pt: 3,
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'text.primary',
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
                  borderColor: 'primary.main',
                  paddingLeft: '1em',
                  marginLeft: 0,
                  fontStyle: 'italic',
                  color: 'text.secondary',
                },
                '& pre': {
                  backgroundColor: 'grey.100',
                  padding: '1em',
                  borderRadius: '4px',
                  overflow: 'auto',
                  margin: '1em 0',
                  '& code': {
                    backgroundColor: 'transparent',
                    padding: 0,
                  },
                },
                '& code': {
                  backgroundColor: 'grey.100',
                  padding: '0.2em 0.4em',
                  borderRadius: '3px',
                  fontFamily: 'monospace',
                  fontSize: '0.9em',
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  margin: '1em 0',
                },
                '& th, & td': {
                  border: '1px solid',
                  borderColor: 'divider',
                  padding: '0.5em',
                },
                '& th': {
                  backgroundColor: 'grey.100',
                  fontWeight: 600,
                },
                '& a': {
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
                '& .knowledge-mention, & .mention-agent, & .mention-skill, & .mention-tool, & .mention-knowledge': {
                  fontWeight: 500,
                  padding: '2px 4px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'inline-block',
                  backgroundColor: 'rgba(75, 63, 255, 0.1)',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(75, 63, 255, 0.2)',
                    textDecoration: 'none',
                  },
                },
                '& .mention-agent': {
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
              }}
            >
              <div
                ref={contentRef}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(processMarkdownWithMentions(document?.content || ''), {
                    ADD_ATTR: ['target', 'rel', 'data-mention-id', 'data-mention-type', 'data-mention-label'],
                    ADD_TAGS: ['span'],
                    ALLOWED_TAGS: [
                      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
                      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                      'ul', 'ol', 'li',
                      'blockquote', 'pre', 'code',
                      'table', 'thead', 'tbody', 'tr', 'th', 'td',
                      'a', 'span', 'div'
                    ],
                    ALLOWED_ATTR: [
                      'href', 'class', 'style', 'target', 'rel',
                      'data-mention-id', 'data-mention-type', 'data-mention-label'
                    ]
                  })
                }}
              />
            </Box>
          )}
        </Box>
      </DialogContent>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {document?.publishingStatus === 'published' ? (
          <MenuItem onClick={() => { handleUnpublish(); handleMenuClose(); }}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Unpublish</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => { handlePublish(); handleMenuClose(); }}>
            <ListItemIcon>
              <PublishIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Publish</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => { handleDownload(); handleMenuClose(); }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download Markdown</ListItemText>
        </MenuItem>
        {document?.originalFile && document?.originalFileName && (
          <MenuItem onClick={() => { handleDownloadOriginal(); handleMenuClose(); }}>
            <ListItemIcon>
              <DownloadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Download Original ({document.originalFileName.split('.').pop()?.toUpperCase()})</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => { handleMenuClose(); }}>
          <ListItemIcon>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Share</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Dialog>

    {/* Version History Drawer - Outside Dialog for proper z-index */}
    <Drawer
      open={showVersions}
      onClose={() => setShowVersions(false)}
      title="Version History"
      subtitle="View and restore previous versions"
      anchor="right"
      width={480}
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
      }}
    >
      {versions.length > 0 ? (
        <Stack spacing={2}>
          {versions.map((version) => (
            <Box
              key={version.id}
              sx={{
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'background.paper',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2">
                    Version {version.version}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(version.created).toLocaleString()} by {version.author}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRestoreVersion(version.id)}
                >
                  <RestoreIcon />
                </IconButton>
              </Box>
              {version.changeDescription && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {version.changeDescription}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      ) : (
        <Result
          status="empty"
          title="No version history"
          description="This document doesn't have any previous versions yet"
        />
      )}
    </Drawer>

    {/* Delete Confirmation Dialog */}
    <Dialog
      open={showDeleteConfirm}
      onClose={handleDeleteCancel}
      maxWidth="sm"
      fullWidth
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 2,
      }}
    >
      <DialogTitle>Delete Document</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{document?.title}"? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteCancel} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleDeleteConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  </>);
};

export default KnowledgeViewer;