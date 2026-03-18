/**
 * Procurement Document Storage Service
 * IndexedDB-based persistence layer for procurement documents with offline support
 *
 * Follows the proven architecture from KnowledgeStorage but tailored for
 * the procurement document builder schema with 14 object stores.
 */

import type {
  Project,
  Template,
  TemplateQuestion,
  Document,
  DocumentSection,
  Attachment,
  Approval,
  Revision,
} from '../../types/procurement';

import type {
  SharedSection,
  QuestionOption,
  ProjectQuestionAnswer,
  Signature,
  AuditLog,
  Notification,
} from './ProcurementTypes';

const DB_NAME = 'seamstress-procurement';
const DB_VERSION = 1;

export class DocumentStorage {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initDB();
  }

  /**
   * Initialize the database (ensures DB is ready)
   * This method can be called to await initialization if needed
   */
  async initialize(): Promise<void> {
    await this.initPromise;
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

        // 1. Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projectStore = db.createObjectStore('projects', { keyPath: 'projectId' });
          projectStore.createIndex('status', 'status', { unique: false });
          projectStore.createIndex('departmentId', 'departmentId', { unique: false });
          projectStore.createIndex('templateId', 'templateId', { unique: false });
          projectStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 2. Templates store
        if (!db.objectStoreNames.contains('templates')) {
          const templateStore = db.createObjectStore('templates', { keyPath: 'templateId' });
          templateStore.createIndex('type', 'type', { unique: false });
          templateStore.createIndex('name', 'name', { unique: false });
        }

        // 3. Shared sections store (reusable content blocks)
        if (!db.objectStoreNames.contains('shared_sections')) {
          const sectionStore = db.createObjectStore('shared_sections', { keyPath: 'sectionId' });
          sectionStore.createIndex('title', 'title', { unique: false });
          sectionStore.createIndex('category', 'category', { unique: false });
          sectionStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        }

        // 4. Questions store (setup questions for templates)
        if (!db.objectStoreNames.contains('questions')) {
          const questionStore = db.createObjectStore('questions', { keyPath: 'questionId' });
          questionStore.createIndex('templateId', 'templateId', { unique: false });
          questionStore.createIndex('type', 'type', { unique: false });
        }

        // 5. Question options store (for multiple choice questions)
        if (!db.objectStoreNames.contains('question_options')) {
          const optionStore = db.createObjectStore('question_options', { keyPath: 'optionId' });
          optionStore.createIndex('questionId', 'questionId', { unique: false });
        }

        // 6. Project questions store (answers to setup questions)
        if (!db.objectStoreNames.contains('project_questions')) {
          const answerStore = db.createObjectStore('project_questions', { keyPath: 'answerId' });
          answerStore.createIndex('projectId', 'projectId', { unique: false });
          answerStore.createIndex('questionId', 'questionId', { unique: false });
        }

        // 7. Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const documentStore = db.createObjectStore('documents', { keyPath: 'documentId' });
          documentStore.createIndex('projectId', 'projectId', { unique: false });
          documentStore.createIndex('status', 'status', { unique: false });
          documentStore.createIndex('type', 'type', { unique: false });
          documentStore.createIndex('createdAt', 'createdAt', { unique: false });
          documentStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // 8. Document sections store
        if (!db.objectStoreNames.contains('document_sections')) {
          const sectionStore = db.createObjectStore('document_sections', { keyPath: 'sectionId' });
          sectionStore.createIndex('documentId', 'documentId', { unique: false });
          sectionStore.createIndex('order', 'order', { unique: false });
        }

        // 9. Exhibits store (attachments)
        if (!db.objectStoreNames.contains('exhibits')) {
          const exhibitStore = db.createObjectStore('exhibits', { keyPath: 'exhibitId' });
          exhibitStore.createIndex('documentId', 'documentId', { unique: false });
          exhibitStore.createIndex('order', 'order', { unique: false });
        }

        // 10. Signatures store
        if (!db.objectStoreNames.contains('signatures')) {
          const signatureStore = db.createObjectStore('signatures', { keyPath: 'signatureId' });
          signatureStore.createIndex('documentId', 'documentId', { unique: false });
          signatureStore.createIndex('order', 'order', { unique: false });
        }

        // 11. Approvals store
        if (!db.objectStoreNames.contains('approvals')) {
          const approvalStore = db.createObjectStore('approvals', { keyPath: 'approvalId' });
          approvalStore.createIndex('documentId', 'documentId', { unique: false });
          approvalStore.createIndex('status', 'status', { unique: false });
        }

        // 12. Document versions store
        if (!db.objectStoreNames.contains('document_versions')) {
          const versionStore = db.createObjectStore('document_versions', { keyPath: 'versionId' });
          versionStore.createIndex('documentId', 'documentId', { unique: false });
          versionStore.createIndex('version', 'version', { unique: false });
          versionStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // 13. Audit logs store
        if (!db.objectStoreNames.contains('audit_logs')) {
          const auditStore = db.createObjectStore('audit_logs', { keyPath: 'logId' });
          auditStore.createIndex('entityType', 'entityType', { unique: false });
          auditStore.createIndex('entityId', 'entityId', { unique: false });
          auditStore.createIndex('userId', 'userId', { unique: false });
          auditStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 14. Notifications store
        if (!db.objectStoreNames.contains('notifications')) {
          const notificationStore = db.createObjectStore('notifications', { keyPath: 'notificationId' });
          notificationStore.createIndex('userId', 'userId', { unique: false });
          notificationStore.createIndex('status', 'status', { unique: false });
          notificationStore.createIndex('createdAt', 'createdAt', { unique: false });
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

  // ============================================================================
  // Project operations
  // ============================================================================

  async saveProject(project: Project): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects'], 'readwrite');
    const store = transaction.objectStore('projects');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(project);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProject(projectId: string): Promise<Project | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects'], 'readonly');
    const store = transaction.objectStore('projects');
    return new Promise((resolve, reject) => {
      const request = store.get(projectId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProjects(): Promise<Project[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects'], 'readonly');
    const store = transaction.objectStore('projects');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getProjectsByStatus(status: string): Promise<Project[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects'], 'readonly');
    const store = transaction.objectStore('projects');
    const index = store.index('status');
    return new Promise((resolve, reject) => {
      const request = index.getAll(status);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProject(projectId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['projects'], 'readwrite');
    const store = transaction.objectStore('projects');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(projectId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Template operations
  // ============================================================================

  async saveTemplate(template: Template): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['templates'], 'readwrite');
    const store = transaction.objectStore('templates');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(template);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTemplate(templateId: string): Promise<Template | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['templates'], 'readonly');
    const store = transaction.objectStore('templates');
    return new Promise((resolve, reject) => {
      const request = store.get(templateId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllTemplates(): Promise<Template[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['templates'], 'readonly');
    const store = transaction.objectStore('templates');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Alias for getAllTemplates
  async getTemplates(): Promise<Template[]> {
    return this.getAllTemplates();
  }

  async getTemplatesByType(type: string): Promise<Template[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['templates'], 'readonly');
    const store = transaction.objectStore('templates');
    const index = store.index('type');
    return new Promise((resolve, reject) => {
      const request = index.getAll(type);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteTemplate(templateId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['templates'], 'readwrite');
    const store = transaction.objectStore('templates');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(templateId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Shared section operations
  // ============================================================================

  async saveSharedSection(section: SharedSection): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['shared_sections'], 'readwrite');
    const store = transaction.objectStore('shared_sections');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(section);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSharedSection(sectionId: string): Promise<SharedSection | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['shared_sections'], 'readonly');
    const store = transaction.objectStore('shared_sections');
    return new Promise((resolve, reject) => {
      const request = store.get(sectionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSharedSections(): Promise<SharedSection[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['shared_sections'], 'readonly');
    const store = transaction.objectStore('shared_sections');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Alias for getAllSharedSections
  async getSharedSections(): Promise<SharedSection[]> {
    return this.getAllSharedSections();
  }

  async getSharedSectionsByCategory(category: string): Promise<SharedSection[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['shared_sections'], 'readonly');
    const store = transaction.objectStore('shared_sections');
    const index = store.index('category');
    return new Promise((resolve, reject) => {
      const request = index.getAll(category);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSharedSection(sectionId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['shared_sections'], 'readwrite');
    const store = transaction.objectStore('shared_sections');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(sectionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Document operations
  // ============================================================================

  async saveDocument(document: Document): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readwrite');
    const store = transaction.objectStore('documents');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(document);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDocument(documentId: string): Promise<Document | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    return new Promise((resolve, reject) => {
      const request = store.get(documentId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getDocumentsByProject(projectId: string): Promise<Document[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['documents'], 'readonly');
    const store = transaction.objectStore('documents');
    const index = store.index('projectId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(projectId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDocument(documentId: string): Promise<void> {
    const db = await this.ensureDB();
    // Cascade delete sections, exhibits, signatures, approvals, versions
    const transaction = db.transaction(
      ['documents', 'document_sections', 'exhibits', 'signatures', 'approvals', 'document_versions'],
      'readwrite'
    );

    const docStore = transaction.objectStore('documents');
    const sectionStore = transaction.objectStore('document_sections');
    const exhibitStore = transaction.objectStore('exhibits');
    const signatureStore = transaction.objectStore('signatures');
    const approvalStore = transaction.objectStore('approvals');
    const versionStore = transaction.objectStore('document_versions');

    // Delete document
    await new Promise<void>((resolve, reject) => {
      const request = docStore.delete(documentId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Delete related sections
    const sections = await new Promise<DocumentSection[]>((resolve, reject) => {
      const index = sectionStore.index('documentId');
      const request = index.getAll(documentId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    for (const section of sections) {
      await new Promise<void>((resolve, reject) => {
        const request = sectionStore.delete(section.sectionId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    // Delete related exhibits
    const exhibits = await new Promise<Attachment[]>((resolve, reject) => {
      const index = exhibitStore.index('documentId');
      const request = index.getAll(documentId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    for (const exhibit of exhibits) {
      await new Promise<void>((resolve, reject) => {
        const request = exhibitStore.delete((exhibit as any).exhibitId || exhibit.attachmentId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    // Delete related signatures
    const signatures = await new Promise<Signature[]>((resolve, reject) => {
      const index = signatureStore.index('documentId');
      const request = index.getAll(documentId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    for (const signature of signatures) {
      await new Promise<void>((resolve, reject) => {
        const request = signatureStore.delete(signature.signatureId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    // Delete related approvals
    const approvals = await new Promise<any[]>((resolve, reject) => {
      const request = approvalStore.getAll();
      request.onsuccess = () => {
        const all = request.result || [];
        resolve(all.filter((a: any) => a.documentId === documentId));
      };
      request.onerror = () => reject(request.error);
    });
    for (const approval of approvals) {
      await new Promise<void>((resolve, reject) => {
        const request = approvalStore.delete(approval.approvalId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    // Delete related versions
    const versions = await new Promise<any[]>((resolve, reject) => {
      const index = versionStore.index('documentId');
      const request = index.getAll(documentId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    for (const version of versions) {
      await new Promise<void>((resolve, reject) => {
        const request = versionStore.delete(version.versionId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  // ============================================================================
  // Section operations
  // ============================================================================

  async saveSection(section: DocumentSection): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['document_sections'], 'readwrite');
    const store = transaction.objectStore('document_sections');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(section);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSection(sectionId: string): Promise<DocumentSection | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['document_sections'], 'readonly');
    const store = transaction.objectStore('document_sections');
    return new Promise((resolve, reject) => {
      const request = store.get(sectionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getSectionsByDocument(documentId: string): Promise<DocumentSection[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['document_sections'], 'readonly');
    const store = transaction.objectStore('document_sections');
    const index = store.index('documentId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(documentId);
      request.onsuccess = () => {
        const sections = request.result || [];
        // Sort by order
        sections.sort((a, b) => a.order - b.order);
        resolve(sections);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSection(sectionId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['document_sections'], 'readwrite');
    const store = transaction.objectStore('document_sections');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(sectionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Exhibit operations
  // ============================================================================

  async saveExhibit(exhibit: Attachment): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['exhibits'], 'readwrite');
    const store = transaction.objectStore('exhibits');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(exhibit);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getExhibit(exhibitId: string): Promise<Attachment | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['exhibits'], 'readonly');
    const store = transaction.objectStore('exhibits');
    return new Promise((resolve, reject) => {
      const request = store.get(exhibitId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getExhibitsByDocument(documentId: string): Promise<Attachment[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['exhibits'], 'readonly');
    const store = transaction.objectStore('exhibits');
    // Note: The Attachment type doesn't have documentId, but we need it for exhibits
    // We'll need to extend the type in ProcurementTypes.ts
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const allExhibits = request.result || [];
        // Filter by documentId (will need to add this field to Attachment type)
        const filtered = allExhibits.filter((e: any) => e.documentId === documentId);
        filtered.sort((a: any, b: any) => a.order - b.order);
        resolve(filtered);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteExhibit(exhibitId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['exhibits'], 'readwrite');
    const store = transaction.objectStore('exhibits');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(exhibitId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Signature operations
  // ============================================================================

  async saveSignature(signature: Signature): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['signatures'], 'readwrite');
    const store = transaction.objectStore('signatures');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(signature);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSignature(signatureId: string): Promise<Signature | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['signatures'], 'readonly');
    const store = transaction.objectStore('signatures');
    return new Promise((resolve, reject) => {
      const request = store.get(signatureId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getSignaturesByDocument(documentId: string): Promise<Signature[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['signatures'], 'readonly');
    const store = transaction.objectStore('signatures');
    const index = store.index('documentId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(documentId);
      request.onsuccess = () => {
        const signatures = request.result || [];
        signatures.sort((a, b) => a.order - b.order);
        resolve(signatures);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSignature(signatureId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['signatures'], 'readwrite');
    const store = transaction.objectStore('signatures');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(signatureId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Approval operations
  // ============================================================================

  async saveApproval(approval: Approval): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['approvals'], 'readwrite');
    const store = transaction.objectStore('approvals');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(approval);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getApprovalsByDocument(documentId: string): Promise<Approval[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['approvals'], 'readonly');
    const store = transaction.objectStore('approvals');
    // Note: Need to add documentId to Approval type or use a different approach
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        const allApprovals = request.result || [];
        // Filter by documentId (need to add this field to Approval type)
        const filtered = allApprovals.filter((a: any) => a.documentId === documentId);
        resolve(filtered);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Version operations
  // ============================================================================

  async saveVersion(version: Revision): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['document_versions'], 'readwrite');
    const store = transaction.objectStore('document_versions');
    await new Promise<void>((resolve, reject) => {
      const request = store.put({
        versionId: version.revisionId,
        documentId: version.documentSnapshot ? JSON.parse(version.documentSnapshot).documentId : '',
        version: version.version,
        createdAt: version.createdAt,
        createdBy: version.createdBy,
        changes: version.changes,
        snapshot: version.documentSnapshot,
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getVersionHistory(documentId: string): Promise<Revision[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['document_versions'], 'readonly');
    const store = transaction.objectStore('document_versions');
    const index = store.index('documentId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(documentId);
      request.onsuccess = () => {
        const versions = request.result || [];
        versions.sort((a: any, b: any) => b.version - a.version);
        // Convert back to Revision format
        const revisions = versions.map((v: any) => ({
          revisionId: v.versionId,
          version: v.version,
          createdAt: v.createdAt,
          createdBy: v.createdBy,
          changes: v.changes,
          documentSnapshot: v.snapshot,
        }));
        resolve(revisions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Audit log operations
  // ============================================================================

  async saveAuditLog(log: AuditLog): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['audit_logs'], 'readwrite');
    const store = transaction.objectStore('audit_logs');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(log);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getAuditLogs(entityId: string): Promise<AuditLog[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['audit_logs'], 'readonly');
    const store = transaction.objectStore('audit_logs');
    const index = store.index('entityId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(entityId);
      request.onsuccess = () => {
        const logs = request.result || [];
        logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(logs);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Notification operations
  // ============================================================================

  async saveNotification(notification: Notification): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['notifications'], 'readwrite');
    const store = transaction.objectStore('notifications');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(notification);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['notifications'], 'readonly');
    const store = transaction.objectStore('notifications');
    const index = store.index('userId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(userId);
      request.onsuccess = () => {
        const notifications = request.result || [];
        notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(notifications);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Question operations
  // ============================================================================

  async saveQuestion(question: TemplateQuestion & { templateId: string }): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['questions'], 'readwrite');
    const store = transaction.objectStore('questions');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(question);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getQuestionsByTemplate(templateId: string): Promise<TemplateQuestion[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['questions'], 'readonly');
    const store = transaction.objectStore('questions');
    const index = store.index('templateId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(templateId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getQuestion(questionId: string): Promise<(TemplateQuestion & { templateId: string }) | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['questions'], 'readonly');
    const store = transaction.objectStore('questions');
    return new Promise((resolve, reject) => {
      const request = store.get(questionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteQuestion(questionId: string): Promise<void> {
    const db = await this.ensureDB();
    // Cascade delete: also delete all options for this question
    const transaction = db.transaction(['questions', 'question_options'], 'readwrite');
    const questionStore = transaction.objectStore('questions');
    const optionStore = transaction.objectStore('question_options');

    // Delete the question
    await new Promise<void>((resolve, reject) => {
      const request = questionStore.delete(questionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Delete all options for this question
    const options = await new Promise<QuestionOption[]>((resolve, reject) => {
      const index = optionStore.index('questionId');
      const request = index.getAll(questionId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    for (const option of options) {
      await new Promise<void>((resolve, reject) => {
        const request = optionStore.delete(option.optionId);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }
  }

  // ============================================================================
  // Question Option operations
  // ============================================================================

  async saveQuestionOption(option: QuestionOption): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['question_options'], 'readwrite');
    const store = transaction.objectStore('question_options');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(option);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getQuestionOption(optionId: string): Promise<QuestionOption | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['question_options'], 'readonly');
    const store = transaction.objectStore('question_options');
    return new Promise((resolve, reject) => {
      const request = store.get(optionId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getQuestionOptionsByQuestion(questionId: string): Promise<QuestionOption[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['question_options'], 'readonly');
    const store = transaction.objectStore('question_options');
    const index = store.index('questionId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(questionId);
      request.onsuccess = () => {
        const options = request.result || [];
        options.sort((a, b) => a.order - b.order);
        resolve(options);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteQuestionOption(optionId: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['question_options'], 'readwrite');
    const store = transaction.objectStore('question_options');
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(optionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Project Question operations
  // ============================================================================

  async getProjectQuestionsByProject(projectId: string): Promise<ProjectQuestionAnswer[]> {
    return this.getProjectAnswers(projectId);
  }

  async saveProjectQuestion(answer: ProjectQuestionAnswer): Promise<void> {
    return this.saveProjectAnswer(answer);
  }

  async saveProjectAnswer(answer: ProjectQuestionAnswer): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['project_questions'], 'readwrite');
    const store = transaction.objectStore('project_questions');
    await new Promise<void>((resolve, reject) => {
      const request = store.put(answer);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProjectAnswers(projectId: string): Promise<ProjectQuestionAnswer[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['project_questions'], 'readonly');
    const store = transaction.objectStore('project_questions');
    const index = store.index('projectId');
    return new Promise((resolve, reject) => {
      const request = index.getAll(projectId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // ============================================================================
  // Utility operations
  // ============================================================================

  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    const storeNames = [
      'projects',
      'templates',
      'shared_sections',
      'questions',
      'question_options',
      'project_questions',
      'documents',
      'document_sections',
      'exhibits',
      'signatures',
      'approvals',
      'document_versions',
      'audit_logs',
      'notifications',
    ];

    const transaction = db.transaction(storeNames, 'readwrite');

    await Promise.all(
      storeNames.map((storeName) =>
        new Promise<void>((resolve, reject) => {
          const request = transaction.objectStore(storeName).clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
      )
    );
  }
}

// Singleton instance
export const documentStorage = new DocumentStorage();
