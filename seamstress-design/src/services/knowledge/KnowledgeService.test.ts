import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { KnowledgeService } from './KnowledgeService';
import { knowledgeStorage } from './KnowledgeStorage';
import { knowledgeIndex } from './KnowledgeIndex';
import { fileUploadService } from './FileUploadService';
import { getAllAgents } from '../agents/agentTypes';
import { exampleDocuments } from './ExampleDocuments';
import type { KnowledgeDocument, KnowledgeFolder } from './KnowledgeTypes';

// Mock dependencies
vi.mock('./KnowledgeStorage');
vi.mock('./KnowledgeIndex');
vi.mock('./FileUploadService');
vi.mock('../agents/agentTypes');
vi.mock('./ExampleDocuments');

describe('KnowledgeService', () => {
  let service: KnowledgeService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new KnowledgeService();

    // Setup default mock implementations
    vi.mocked(knowledgeStorage.getAllDocuments).mockResolvedValue([]);
    vi.mocked(knowledgeStorage.saveDocument).mockResolvedValue(undefined);
    vi.mocked(knowledgeStorage.saveFolder).mockResolvedValue(undefined);
    vi.mocked(knowledgeStorage.getFolder).mockResolvedValue(null);
    vi.mocked(knowledgeStorage.getAllFolders).mockResolvedValue([]);
    vi.mocked(knowledgeStorage.saveVersion).mockResolvedValue(undefined);
    vi.mocked(knowledgeIndex.indexDocument).mockResolvedValue(undefined);
    vi.mocked(knowledgeIndex.search).mockResolvedValue([]);
    vi.mocked(knowledgeIndex.getSuggestions).mockResolvedValue([]);
    vi.mocked(fileUploadService.processFile).mockResolvedValue({ content: '', type: 'txt' as any });
    vi.mocked(getAllAgents).mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Document CRUD Operations', () => {
    describe('createDocument', () => {
      it('should create a document with default values', async () => {
        const title = 'Test Document';
        const content = 'Test content';

        const doc = await service.createDocument(title, content);

        expect(doc).toMatchObject({
          title,
          content,
          type: 'markdown',
          metadata: expect.objectContaining({
            author: 'current-user',
            tags: [],
            version: 1
          }),
          permissions: expect.objectContaining({
            owner: 'current-user',
            public: false
          })
        });

        expect(doc.id).toBeDefined();
        expect(doc.metadata.created).toBeInstanceOf(Date);
        expect(doc.metadata.modified).toBeInstanceOf(Date);
      });

      it('should create a document with custom type and tags', async () => {
        const title = 'Test Document';
        const content = 'Test content';
        const type = 'pdf';
        const tags = ['test', 'sample'];

        const doc = await service.createDocument(title, content, type, tags);

        expect(doc.type).toBe(type);
        expect(doc.metadata.tags).toEqual(tags);
      });

      it('should extract references from content', async () => {
        const content = 'This references @agent:test-agent and #document:doc-123';

        const doc = await service.createDocument('Test', content);

        expect(doc.metadata.references).toHaveLength(2);
        expect(doc.metadata.references).toContainEqual(
          expect.objectContaining({
            type: 'agent',
            id: 'test-agent'
          })
        );
        expect(doc.metadata.references).toContainEqual(
          expect.objectContaining({
            type: 'document',
            id: 'doc-123'
          })
        );
      });

      it('should save and index the document', async () => {
        const doc = await service.createDocument('Test', 'Content');

        expect(knowledgeStorage.saveDocument).toHaveBeenCalledWith(doc);
        expect(knowledgeIndex.indexDocument).toHaveBeenCalledWith(doc);
      });
    });

    describe('getDocument', () => {
      it('should retrieve a document from storage', async () => {
        const mockDoc: KnowledgeDocument = {
          id: 'test-id',
          title: 'Test',
          content: 'Content',
          type: 'markdown',
          metadata: {
            author: 'user',
            created: new Date(),
            modified: new Date(),
            tags: [],
            references: [],
            referencedBy: [],
            version: 1
          },
          permissions: {
            owner: 'user',
            public: false,
            sharedWith: []
          },
          searchableContent: 'Content'
        };

        vi.mocked(knowledgeStorage.getDocument).mockResolvedValue(mockDoc);

        const doc = await service.getDocument('test-id');

        expect(doc).toEqual(mockDoc);
        expect(knowledgeStorage.getDocument).toHaveBeenCalledWith('test-id');
      });

      it('should return null for non-existent document', async () => {
        vi.mocked(knowledgeStorage.getDocument).mockResolvedValue(null);

        const doc = await service.getDocument('non-existent');

        expect(doc).toBeNull();
      });
    });

    describe('updateDocument', () => {
      it('should update document content and metadata', async () => {
        const originalDoc: KnowledgeDocument = {
          id: 'test-id',
          title: 'Original Title',
          content: 'Original content',
          type: 'markdown',
          metadata: {
            author: 'user',
            created: new Date('2024-01-01'),
            modified: new Date('2024-01-01'),
            tags: ['old'],
            references: [],
            referencedBy: [],
            version: 1
          },
          permissions: {
            owner: 'current-user',
            public: false,
            sharedWith: [],
            canEdit: ['current-user'],
            canView: ['current-user']
          },
          searchableContent: 'Original content',
          publishingStatus: 'draft'
        };

        vi.mocked(knowledgeStorage.getDocument).mockResolvedValue(originalDoc);
        vi.mocked(knowledgeStorage.saveDocument).mockResolvedValue(undefined);

        const updates = {
          title: 'New Title',
          content: 'New content with @agent:new-agent',
          metadata: {
            tags: ['new', 'updated']
          }
        };

        const updated = await service.updateDocument('test-id', updates);

        expect(updated).toMatchObject({
          id: 'test-id',
          title: 'New Title',
          content: 'New content with @agent:new-agent',
          metadata: expect.objectContaining({
            version: 2,
            tags: ['new', 'updated']
          })
        });

        expect(updated?.metadata.modified.getTime()).toBeGreaterThan(originalDoc.metadata.modified.getTime());
        expect(updated?.metadata.references).toHaveLength(1);
        expect(knowledgeIndex.updateDocument).toHaveBeenCalledWith(updated);
      });

      it('should create version history on update', async () => {
        const originalDoc: KnowledgeDocument = {
          id: 'test-id',
          title: 'Original',
          content: 'Original content',
          type: 'markdown',
          metadata: {
            author: 'user',
            created: new Date(),
            modified: new Date(),
            tags: [],
            references: [],
            referencedBy: [],
            version: 1
          },
          permissions: {
            owner: 'current-user',
            public: false,
            sharedWith: [],
            canEdit: ['current-user'],
            canView: ['current-user']
          },
          searchableContent: 'Original content',
          publishingStatus: 'draft'
        };

        vi.mocked(knowledgeStorage.getDocument).mockResolvedValue(originalDoc);

        await service.updateDocument('test-id', { content: 'Updated' });

        expect(knowledgeStorage.saveVersion).toHaveBeenCalledWith(
          expect.objectContaining({
            documentId: 'test-id',
            version: 2,
            content: 'Updated'
          })
        );
      });
    });

    describe('deleteDocument', () => {
      it('should delete document and clean up references', async () => {
        const mockDoc: KnowledgeDocument = {
          id: 'test-id',
          title: 'Test',
          content: 'Content',
          type: 'markdown',
          metadata: {
            author: 'user',
            created: new Date(),
            modified: new Date(),
            tags: [],
            references: [],
            referencedBy: ['other-doc-id'],
            version: 1
          },
          permissions: {
            owner: 'current-user',
            public: false,
            sharedWith: [],
            canEdit: ['current-user'],
            canView: ['current-user']
          },
          searchableContent: 'Content',
          publishingStatus: 'draft'
        };

        const referencingDoc: KnowledgeDocument = {
          ...mockDoc,
          id: 'other-doc-id',
          metadata: {
            ...mockDoc.metadata,
            references: [{ type: 'document', id: 'test-id', title: 'Test' }],
            referencedBy: []
          }
        };

        vi.mocked(knowledgeStorage.getDocument)
          .mockResolvedValueOnce(mockDoc)
          .mockResolvedValueOnce(referencingDoc);

        const result = await service.deleteDocument('test-id');

        expect(result).toBe(true);
        expect(knowledgeStorage.deleteDocument).toHaveBeenCalledWith('test-id');
        expect(knowledgeIndex.removeDocument).toHaveBeenCalledWith('test-id');
        expect(knowledgeStorage.saveDocument).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'other-doc-id',
            metadata: expect.objectContaining({
              references: []
            })
          })
        );
      });
    });
  });

  describe('Search and Discovery', () => {
    describe('searchDocuments', () => {
      it('should search documents with query', async () => {
        const mockResults = [
          { documentId: 'doc1', score: 0.9, highlights: ['test'] },
          { documentId: 'doc2', score: 0.7, highlights: ['sample'] }
        ];

        vi.mocked(knowledgeIndex.search).mockResolvedValue(mockResults);

        const results = await service.searchDocuments('test query');

        expect(results).toEqual(mockResults);
        expect(knowledgeIndex.search).toHaveBeenCalledWith('test query', undefined);
      });

      it('should apply filters to search', async () => {
        const filters = {
          tags: ['important'],
          type: 'markdown' as const,
          author: 'user'
        };

        await service.searchDocuments('query', filters);

        expect(knowledgeIndex.search).toHaveBeenCalledWith('query', filters);
      });
    });

    describe('getRecentDocuments', () => {
      it('should return recent documents sorted by modified date', async () => {
        const now = new Date();
        const docs = [
          { id: '1', metadata: { modified: new Date(now.getTime() - 3000) } },
          { id: '2', metadata: { modified: new Date(now.getTime() - 1000) } },
          { id: '3', metadata: { modified: new Date(now.getTime() - 2000) } }
        ] as KnowledgeDocument[];

        vi.mocked(knowledgeStorage.getAllDocuments).mockResolvedValue(docs);

        const recent = await service.getRecentDocuments(2);

        expect(recent).toHaveLength(2);
        expect(recent[0].id).toBe('2');
        expect(recent[1].id).toBe('3');
      });
    });

    describe('getRelatedDocuments', () => {
      it('should find documents with similar tags', async () => {
        const sourceDoc: KnowledgeDocument = {
          id: 'source',
          title: 'Source',
          content: 'Content',
          type: 'markdown',
          metadata: {
            author: 'user',
            created: new Date(),
            modified: new Date(),
            tags: ['ai', 'ml', 'data'],
            references: [],
            referencedBy: [],
            version: 1
          },
          permissions: {
            owner: 'user',
            public: false,
            sharedWith: []
          },
          searchableContent: 'Content'
        };

        const allDocs = [
          sourceDoc,
          { ...sourceDoc, id: 'doc1', metadata: { ...sourceDoc.metadata, tags: ['ai', 'ml'] } },
          { ...sourceDoc, id: 'doc2', metadata: { ...sourceDoc.metadata, tags: ['data'] } },
          { ...sourceDoc, id: 'doc3', metadata: { ...sourceDoc.metadata, tags: ['other'] } }
        ] as KnowledgeDocument[];

        vi.mocked(knowledgeStorage.getDocument).mockResolvedValue(sourceDoc);
        vi.mocked(knowledgeStorage.getAllDocuments).mockResolvedValue(allDocs);

        const related = await service.getRelatedDocuments('source');

        expect(related).toHaveLength(2);
        expect(related.map(d => d.id)).toContain('doc1');
        expect(related.map(d => d.id)).toContain('doc2');
        expect(related.map(d => d.id)).not.toContain('doc3');
      });
    });
  });

  describe('Folder Management', () => {
    describe('createFolder', () => {
      it('should create a new folder', async () => {
        const folder = await service.createFolder('Test Folder', '/root');

        expect(folder).toMatchObject({
          name: 'Test Folder',
          parentId: '/root',
          documentIds: []
        });

        expect(folder.id).toBeDefined();
        expect(folder.created).toBeInstanceOf(Date);
        expect(knowledgeStorage.saveFolder).toHaveBeenCalledWith(folder);
      });
    });

    describe('moveDocumentToFolder', () => {
      it('should move document to folder', async () => {
        const folder: KnowledgeFolder = {
          id: 'folder-id',
          name: 'Folder',
          parentId: null,
          documentIds: [],
          created: new Date()
        };

        vi.mocked(knowledgeStorage.getFolder).mockResolvedValue(folder);

        const result = await service.moveDocumentToFolder('doc-id', 'folder-id');

        expect(result).toBe(true);
        expect(knowledgeStorage.saveFolder).toHaveBeenCalledWith(
          expect.objectContaining({
            id: 'folder-id',
            documentIds: ['doc-id']
          })
        );
      });
    });
  });

  describe('Mention System', () => {
    describe('getMentionSuggestions', () => {
      it('should return agent suggestions for @a query', async () => {
        const mockAgents = [
          { id: 'agent1', name: 'Alpha Agent', description: 'Test' },
          { id: 'agent2', name: 'Beta Agent', description: 'Test' }
        ];

        vi.mocked(getAllAgents).mockReturnValue(mockAgents as any);

        const suggestions = await service.getMentionSuggestions('@a');

        expect(suggestions).toHaveLength(2);
        expect(suggestions[0]).toMatchObject({
          id: 'agent1',
          type: 'agent',
          title: 'Alpha Agent'
        });
      });

      it('should return document suggestions for #doc query', async () => {
        const mockSearchResults = [
          { documentId: 'doc1', score: 0.9, highlights: [] },
          { documentId: 'doc2', score: 0.8, highlights: [] }
        ];

        const mockDoc1: KnowledgeDocument = {
          id: 'doc1',
          title: 'Document 1',
          content: 'Content',
          type: 'markdown',
          metadata: {
            author: 'user',
            created: new Date(),
            modified: new Date(),
            tags: [],
            references: [],
            referencedBy: [],
            version: 1
          },
          permissions: {
            owner: 'user',
            public: false,
            sharedWith: [],
            canEdit: ['user'],
            canView: ['user']
          },
          searchableContent: 'Content',
          publishingStatus: 'draft'
        };

        vi.mocked(knowledgeIndex.search).mockResolvedValue(mockSearchResults);
        vi.mocked(knowledgeStorage.getDocument).mockResolvedValue(mockDoc1);

        const suggestions = await service.getMentionSuggestions('#doc ');

        expect(suggestions).toHaveLength(2);
        expect(suggestions[0]).toMatchObject({
          id: 'doc1',
          type: 'document',
          title: 'Document 1'
        });
      });
    });

    describe('extractReferences', () => {
      it('should extract multiple reference types from content', async () => {
        const content = `
          Check out @agent:budget-agent for analysis
          See #document:doc-123 for details
          Review @skill:data-analysis skill
        `;

        const refs = await service.extractReferences(content);

        expect(refs).toHaveLength(3);
        expect(refs).toContainEqual(
          expect.objectContaining({ type: 'agent', id: 'budget-agent' })
        );
        expect(refs).toContainEqual(
          expect.objectContaining({ type: 'document', id: 'doc-123' })
        );
        expect(refs).toContainEqual(
          expect.objectContaining({ type: 'skill', id: 'data-analysis' })
        );
      });
    });
  });

  describe('Statistics', () => {
    describe('getStats', () => {
      it('should calculate knowledge base statistics', async () => {
        const mockDocs = [
          {
            id: '1',
            type: 'markdown',
            content: 'Short',
            metadata: { tags: ['tag1', 'tag2'] }
          },
          {
            id: '2',
            type: 'pdf',
            content: 'A bit longer content here',
            metadata: { tags: ['tag1', 'tag3'] }
          },
          {
            id: '3',
            type: 'markdown',
            content: 'Even more content in this document',
            metadata: { tags: [] }
          }
        ] as KnowledgeDocument[];

        const mockFolders = [
          { id: 'f1', name: 'Folder 1' },
          { id: 'f2', name: 'Folder 2' }
        ] as KnowledgeFolder[];

        vi.mocked(knowledgeStorage.getAllDocuments).mockResolvedValue(mockDocs);
        vi.mocked(knowledgeStorage.getAllFolders).mockResolvedValue(mockFolders);

        const stats = await service.getStats();

        expect(stats).toMatchObject({
          totalDocuments: 3,
          totalFolders: 2,
          documentsByType: {
            markdown: 2,
            pdf: 1
          },
          totalWords: expect.any(Number),
          uniqueTags: 3,
          averageDocumentLength: expect.any(Number)
        });
      });
    });
  });

  describe('File Upload', () => {
    describe('uploadFile', () => {
      it('should process and create document from uploaded file', async () => {
        const mockFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
        const mockProcessed = {
          content: 'Processed content',
          type: 'text' as const,
          metadata: { originalName: 'test.txt' }
        };

        vi.mocked(fileUploadService.processFile).mockResolvedValue(mockProcessed);

        const doc = await service.uploadFile(mockFile, ['uploaded']);

        expect(fileUploadService.processFile).toHaveBeenCalledWith(mockFile);
        expect(doc).toMatchObject({
          title: 'test.txt',
          content: 'Processed content',
          type: 'text',
          metadata: expect.objectContaining({
            tags: ['uploaded'],
            originalName: 'test.txt'
          })
        });
      });
    });
  });
});