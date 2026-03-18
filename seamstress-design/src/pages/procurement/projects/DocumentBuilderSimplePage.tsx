/**
 * DocumentBuilderSimplePage Component
 *
 * Simplified document builder demo without GenUX workflow.
 * Users manually copy AI responses and paste into sections.
 *
 * Multi-tab document editing interface with:
 * - Document Editor tab (outline + rich text editor)
 * - Attachments tab (file uploads)
 * - Signatures tab (signature block configuration)
 * - Final Review Checklist tab (validation)
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  LinearProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AiOgAssist } from '@opengov/react-capital-assets/icons';
import Modal from '../../../components/Modal/Modal';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeaderComposable } from '@opengov/components-page-header';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';

import type { SharedSection, DocumentSection } from '../../../types/procurement';
import { useDocumentBuilder } from '../../../hooks/procurement/useDocumentBuilder';
import { SectionEditor } from '../../../components/procurement/document-builder/SectionEditor';
import { DocumentOutlineSidebar } from '../../../components/procurement/document-builder/DocumentOutlineSidebar';
import { VariableInserter } from '../../../components/procurement/document-builder/VariableInserter';
import { SectionLibraryDrawer } from '../../../components/procurement/document-builder/SectionLibraryDrawer';
import { ExhibitsManager } from '../../../components/procurement/document-builder/ExhibitsManager';
import { SignatureBlockEditor } from '../../../components/procurement/document-builder/SignatureBlockEditor';
import { capitalDesignTokens } from '@opengov/capital-mui-theme';

/**
 * Tab panel component
 */
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps & { fillHeight?: boolean }> = ({ children, value, index, fillHeight }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`document-tabpanel-${index}`}
      aria-labelledby={`document-tab-${index}`}
      sx={fillHeight
        ? { height: '100%', display: value === index ? 'flex' : 'none', flexDirection: 'column' }
        : { height: '100%', overflow: 'auto' }
      }
    >
      {value === index && <Box sx={{ p: 3, ...(fillHeight && { flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }) }}>{children}</Box>}
    </Box>
  );
};

/**
 * Simplified Document Builder Page
 */
const DocumentBuilderSimplePage: React.FC = () => {
  const { projectId, documentId } = useParams<{ projectId: string; documentId: string }>();
  const navigate = useNavigate();

  // Use the real document builder hook
  const {
    document,
    selectedSectionId,
    selectedSection,
    isDirty,
    isSaving,
    isLoading,
    lastSavedAt,
    validationReport,
    error,
    loadDocument,
    saveDocument,
    selectSection,
    addSection,
    updateSectionContent,
    deleteSection,
    reorderSections,
    validateDocument,
  } = useDocumentBuilder({
    documentId: documentId || '',
    projectId: projectId || '',
    autoSave: true,
  });

  const [activeTab, setActiveTab] = useState(0);
  const [sectionLibraryOpen, setSectionLibraryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Ref for the Tiptap editor to insert variables
  const editorRef = useRef<any>(null);

  // Auto-select first section when document loads
  useEffect(() => {
    if (document?.sections?.length > 0 && !selectedSectionId) {
      selectSection(document.sections[0].sectionId);
    }
  }, [document?.sections, selectedSectionId, selectSection]);

  // Handle opening AI assistant - just opens chat, no special agent
  const handleOpenAI = () => {
    if ((window as any).openUnifiedChatWithAgent) {
      (window as any).openUnifiedChatWithAgent('documentBuilder');
    }
  };

  // Validate document when switching to Final Review tab
  useEffect(() => {
    if (activeTab === 3 && documentId) {
      validateDocument();
    }
  }, [activeTab, documentId, validateDocument]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to switch tabs?');
      if (!confirmed) return;
    }
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    await saveDocument();
  };

  const handleBack = () => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate(`/procurement/projects/${projectId}`);
  };

  /**
   * Handle adding a new section from the sidebar
   */
  const handleAddSection = async (title: string, type: DocumentSection['type']) => {
    await addSection({
      title,
      type,
      content: '',
      order: document?.sections.length || 0,
    });
  };

  /**
   * Handle deleting a section
   */
  const handleDeleteSection = async (sectionId: string) => {
    await deleteSection(sectionId);
  };

  /**
   * Handle reordering sections via drag-and-drop
   */
  const handleReorderSections = async (sectionIds: string[]) => {
    await reorderSections(sectionIds);
  };

  /**
   * Handle inserting a variable at the cursor position
   */
  const handleInsertVariable = (variableName: string) => {
    if (editorRef.current?.editor) {
      const editor = editorRef.current.editor;
      editor.chain().focus().insertContent(`{{${variableName}}}`).run();
    }
  };

  /**
   * Handle section content change
   */
  const handleContentChange = (newContent: string) => {
    if (selectedSectionId) {
      updateSectionContent(selectedSectionId, newContent);
    }
  };

  /**
   * Handle inserting a section from the library
   */
  const handleInsertFromLibrary = async (section: SharedSection) => {
    await addSection({
      title: section.title,
      type: 'text',
      content: section.content,
      order: document?.sections.length || 0,
    });
    setSectionLibraryOpen(false);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !document) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={loadDocument}>
              Retry
            </Button>
          }
        >
          {error || 'Document not found'}
        </Alert>
      </Box>
    );
  }

  // Calculate completion percentage for validation
  const completedSections = document.sections.filter(s => s.content.length > 50).length;
  const completionPercentage = document.sections.length > 0
    ? Math.round((completedSections / document.sections.length) * 100)
    : 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 92px)', bgcolor: 'background.default' }}>
      {/* Page Header */}
      <PageHeaderComposable maxContentWidth={capitalDesignTokens.foundations.layout.breakpoints.desktop.wide}>
        <PageHeaderComposable.Header
          actions={[
            <Button key="back" variant="outlined" size="medium" onClick={handleBack} disabled={isSaving}>
              Back to Project
            </Button>,
            <Button
              key="preview"
              variant="outlined"
              size="medium"
              startIcon={<VisibilityIcon />}
              onClick={() => setPreviewOpen(true)}
            >
              Preview Document
            </Button>,
            <Button key="save" variant="contained" size="medium" onClick={handleSave} disabled={!isDirty || isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>,
          ]}
        >
          <PageHeaderComposable.Breadcrumbs
            breadcrumbs={[
              { path: '/procurement/projects', title: 'Projects' },
              { path: `/procurement/projects/${projectId}`, title: document.projectId || 'Project' },
              { title: 'Document Builder' },
            ]}
          />
          <PageHeaderComposable.Title>Document Builder</PageHeaderComposable.Title>
        </PageHeaderComposable.Header>
      </PageHeaderComposable>

      {/* Tabs */}
      <Box sx={{ px: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="document builder tabs">
          <Tab label="1. Document Editor" />
          <Tab label="2. Attachments" />
          <Tab label="3. Signatures" />
          <Tab label="4. Final Review" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {/* Tab 1: Document Editor */}
        <TabPanel value={activeTab} index={0} fillHeight>
          <Box sx={{ display: 'flex', border: 1, borderColor: 'divider', flex: 1, minHeight: 0 }}>
            {/* Outline Sidebar */}
            <Box sx={{ width: 300, flexShrink: 0, overflow: 'auto' }}>
              <DocumentOutlineSidebar
                sections={document.sections}
                selectedSectionId={selectedSectionId}
                onSelectSection={selectSection}
                onAddSection={handleAddSection}
                onDeleteSection={handleDeleteSection}
                onReorderSections={handleReorderSections}
              />
            </Box>

            {/* Editor Area */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2, overflow: 'auto', minHeight: 0 }}>
              {selectedSection ? (
                <Stack spacing={2} sx={{ height: '100%' }}>
                  {/* Section Header */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      {selectedSection.title}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <VariableInserter
                        documentId={documentId || ''}
                        onInsert={handleInsertVariable}
                      />
                      <Button
                        variant="outlined"
                        size="medium"
                        startIcon={<AiOgAssist />}
                        onClick={handleOpenAI}
                        sx={{
                          borderColor: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            bgcolor: 'primary.50',
                          },
                        }}
                      >
                        Use AI
                      </Button>
                      <Button
                        variant="outlined"
                        size="medium"
                        onClick={() => setSectionLibraryOpen(true)}
                      >
                        Search Library
                      </Button>
                    </Stack>
                  </Stack>

                  {/* Rich Text Editor */}
                  <Box sx={{ flex: 1, minHeight: 0 }}>
                    <SectionEditor
                      ref={editorRef}
                      value={selectedSection.content || ''}
                      onChange={handleContentChange}
                      onBlur={() => {
                        // Auto-save is handled by the hook
                      }}
                      documentId={documentId}
                      placeholder="Start typing or paste content from AI assistant... Use {{ to insert variables"
                      minHeight="100%"
                    />
                  </Box>
                </Stack>
              ) : (
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Select a section from the outline to start editing
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </TabPanel>

        {/* Tab 2: Attachments */}
        <TabPanel value={activeTab} index={1}>
          <ExhibitsManager documentId={documentId || ''} />
        </TabPanel>

        {/* Tab 3: Signatures */}
        <TabPanel value={activeTab} index={2}>
          <SignatureBlockEditor documentId={documentId || ''} />
        </TabPanel>

        {/* Tab 4: Final Review Checklist */}
        <TabPanel value={activeTab} index={3}>
          <Stack spacing={3} sx={{ maxWidth: 800 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Final Project Review
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Check for any errors before moving your document into the review stage.
              </Typography>
            </Box>

            {/* Overall Status Alert */}
            {completionPercentage < 100 ? (
              <Alert
                severity="warning"
                icon={<WarningIcon />}
                action={
                  <Button color="inherit" size="small" onClick={() => setActiveTab(0)}>
                    Review
                  </Button>
                }
              >
                You have one or more incomplete sections. You must complete all required fields before starting project review.
              </Alert>
            ) : (
              <Alert severity="success" icon={<CheckCircleIcon />}>
                All sections are complete. You can now submit for review.
              </Alert>
            )}

            {/* Progress Bar */}
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Overall Progress
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {completionPercentage}% Complete
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={completionPercentage}
                sx={{ height: 8, borderRadius: 1 }}
                color={completionPercentage === 100 ? 'success' : 'primary'}
              />
            </Box>

            {/* Validation Report */}
            {validationReport && (
              <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Validation Results
                  </Typography>
                </Box>
                <List>
                  {validationReport.results.map((result, index) => (
                    <React.Fragment key={result.ruleId}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        {result.passed ? (
                          <CheckCircleIcon sx={{ color: 'success.main', mr: 2 }} />
                        ) : result.severity === 'error' ? (
                          <ErrorIcon sx={{ color: 'error.main', mr: 2 }} />
                        ) : (
                          <WarningIcon sx={{ color: 'warning.main', mr: 2 }} />
                        )}
                        <ListItemText
                          primary={result.ruleName}
                          secondary={result.message}
                        />
                        <Chip
                          label={result.passed ? 'Passed' : result.severity}
                          color={result.passed ? 'success' : result.severity === 'error' ? 'error' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}

            {/* Document Outline Checklist */}
            <Paper elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Document Outline Checklist
                </Typography>
              </Box>
              <List>
                {document.sections.map((section, index) => {
                  const isComplete = section.content.length > 50;
                  return (
                    <React.Fragment key={section.sectionId}>
                      {index > 0 && <Divider />}
                      <ListItem>
                        {isComplete ? (
                          <CheckCircleIcon sx={{ color: 'success.main', mr: 2 }} />
                        ) : (
                          <WarningIcon sx={{ color: 'warning.main', mr: 2 }} />
                        )}
                        <ListItemText
                          primary={`${index + 1}. ${section.title}`}
                          secondary={isComplete ? 'Content provided' : 'Missing content'}
                        />
                        <Chip
                          label={isComplete ? 'Complete' : 'Incomplete'}
                          color={isComplete ? 'success' : 'warning'}
                          size="small"
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            </Paper>

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={handleBack}>
                Back to Project
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={completionPercentage < 100}
              >
                Submit for Review
              </Button>
            </Stack>
          </Stack>
        </TabPanel>
      </Box>

      {/* Section Library Drawer */}
      <SectionLibraryDrawer
        open={sectionLibraryOpen}
        onClose={() => setSectionLibraryOpen(false)}
        onInsertSection={handleInsertFromLibrary}
      />

      {/* Document Preview Modal */}
      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Document Preview"
        size="medium"
        secondaryAction={{
          label: 'Close',
          onClick: () => setPreviewOpen(false),
        }}
      >
        {/* Document Title */}
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
          {document.title || 'Untitled Document'}
        </Typography>

        {/* Assembled Sections */}
        {document.sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <Box key={section.sectionId} sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                {index + 1}. {section.title}
              </Typography>
              {section.content ? (
                <Box
                  sx={{
                    '& p': { my: 1 },
                    '& ul, & ol': { pl: 3 },
                    '& li': { my: 0.5 },
                  }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              ) : (
                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                  No content provided for this section.
                </Typography>
              )}
              {index < document.sections.length - 1 && (
                <Divider sx={{ mt: 3 }} />
              )}
            </Box>
          ))}

        {document.sections.length === 0 && (
          <Typography variant="body1" color="text.secondary" align="center">
            No sections have been added to this document yet.
          </Typography>
        )}
      </Modal>
    </Box>
  );
};

export default DocumentBuilderSimplePage;
