/**
 * Knowledge Storage Service
 * IndexedDB-based persistence layer with offline support
 */

import type { KnowledgeDocument, DocumentVersion, ProcessingJob } from './KnowledgeTypes';

const DB_NAME = 'seamstress-knowledge';
const DB_VERSION = 1;

export class KnowledgeStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const documentStore = db.createObjectStore('documents', { keyPath: 'id' });
          documentStore.createIndex('title', 'title', { unique: false });
          documentStore.createIndex('type', 'type', { unique: false });
          documentStore.createIndex('publishingStatus', 'publishingStatus', { unique: false });
          documentStore.createIndex('created', 'metadata.created', { unique: false });
          documentStore.createIndex('modified', 'metadata.modified', { unique: false });
          documentStore.createIndex('author', 'metadata.author', { unique: false });
          documentStore.createIndex('tags', 'metadata.tags', { unique: false, multiEntry: true });
        }


        // Versions store
        if (!db.objectStoreNames.contains('versions')) {
          const versionStore = db.createObjectStore('versions', { keyPath: 'id' });
          versionStore.createIndex('documentId', 'documentId', { unique: false });
          versionStore.createIndex('version', 'version', { unique: false });
          versionStore.createIndex('created', 'created', { unique: false });
        }

        // Processing jobs store
        if (!db.objectStoreNames.contains('jobs')) {
          const jobStore = db.createObjectStore('jobs', { keyPath: 'id' });
          jobStore.createIndex('documentId', 'documentId', { unique: false });
          jobStore.createIndex('status', 'status', { unique: false });
        }

        // Folders store
        if (!db.objectStoreNames.contains('folders')) {
          const folderStore = db.createObjectStore('folders', { keyPath: 'id' });
          folderStore.createIndex('name', 'name', { unique: false });
          folderStore.createIndex('parentId', 'parentId', { unique: false });
        }
      };
    });
  }

  private async ensureDB(): Promise<IDBDatabase> {
    if (this.initPromise) {
      await this.initPromise;
    }
    if (!this.db) {
      throw new Error('Database not initialized');
    }
    return this.db;
  }

  // Document operations
  async saveDocument(document: KnowledgeDocument): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readwrite');
    const store = transaction.objectStore('documents');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(document);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDocument(id: string): Promise<KnowledgeDocument | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllDocuments(): Promise<KnowledgeDocument[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async searchDocuments(query: string): Promise<KnowledgeDocument[]> {
    const allDocs = await this.getAllDocuments();
    const lowerQuery = query.toLowerCase();
    
    return allDocs.filter(doc => 
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (doc.searchableContent && doc.searchableContent.toLowerCase().includes(lowerQuery))
    );
  }

  async getDocumentsByType(type: string): Promise<KnowledgeDocument[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    const index = store.index('type');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(type);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getDocumentsByTag(tag: string): Promise<KnowledgeDocument[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    const index = store.index('tags');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(tag);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDocument(id: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents', 'versions'], 'readwrite');
    const docStore = transaction.objectStore('documents');
    const versionStore = transaction.objectStore('versions');
    
    // Delete document
    await new Promise<void>((resolve, reject) => {
      const request = docStore.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    // Delete all versions
    const versionIndex = versionStore.index('documentId');
    const versions = await new Promise<DocumentVersion[]>((resolve, reject) => {
      const request = versionIndex.getAll(id);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    
    for (const version of versions) {
      await new Promise<void>((resolve, reject) => {
        const request = versionStore.delete(version.id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }


  // Version operations
  async saveVersion(version: DocumentVersion): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['versions'], 'readwrite');
    const store = transaction.objectStore('versions');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(version);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getVersionHistory(documentId: string): Promise<DocumentVersion[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['versions'], 'readonly');
    const store = transaction.objectStore('versions');
    const index = store.index('documentId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(documentId);
      request.onsuccess = () => {
        const versions = request.result || [];
        versions.sort((a, b) => b.version - a.version);
        resolve(versions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Job operations
  async saveJob(job: ProcessingJob): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['jobs'], 'readwrite');
    const store = transaction.objectStore('jobs');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(job);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getJob(id: string): Promise<ProcessingJob | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['jobs'], 'readonly');
    const store = transaction.objectStore('jobs');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  // Folder operations
  async saveFolder(folder: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['folders'], 'readwrite');
    const store = transaction.objectStore('folders');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(folder);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFolder(id: string): Promise<any | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['folders'], 'readonly');
    const store = transaction.objectStore('folders');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllFolders(): Promise<any[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['folders'], 'readonly');
    const store = transaction.objectStore('folders');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents', 'versions', 'jobs', 'folders'], 'readwrite');

    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('documents').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('versions').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('jobs').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('folders').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
    ]);
  }
}

export const knowledgeStorage = new KnowledgeStorage();