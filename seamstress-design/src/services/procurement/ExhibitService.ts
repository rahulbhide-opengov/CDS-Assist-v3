/**
 * ExhibitService
 * Service for managing document exhibits (attachments)
 *
 * Features:
 * - File upload with validation
 * - Store file blobs in IndexedDB
 * - Internal vs external classification
 * - Reordering exhibits
 * - Download and delete operations
 */

import { DocumentStorage } from './DocumentStorage';
import type { Attachment } from '../../types/procurement';

export interface ExhibitUploadData {
  file: File;
  documentId: string;
  isInternal?: boolean;
  description?: string;
}

export interface ExhibitUpdateData {
  fileName?: string;
  isInternal?: boolean;
  description?: string;
  order?: number;
}

export class ExhibitService {
  private storage: DocumentStorage;

  constructor() {
    this.storage = new DocumentStorage();
  }

  /**
   * Upload a file as an exhibit
   */
  async uploadExhibit(data: ExhibitUploadData): Promise<Attachment> {
    const { file, documentId, isInternal = false, description } = data;

    // Validate file
    this.validateFile(file);

    // Read file as blob
    const fileBlob = await this.readFileAsBlob(file);

    // Get current exhibits to determine order
    const existingExhibits = await this.storage.getExhibitsByDocument(documentId);
    const maxOrder = existingExhibits.reduce((max, ex) => Math.max(max, ex.order || 0), 0);

    // Create exhibit
    const exhibit: Attachment = {
      attachmentId: this.generateId(),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileBlob: fileBlob,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'current-user', // TODO: Get from auth context
      documentId,
      isInternal,
      description,
      order: maxOrder + 1,
    };

    // Save to IndexedDB
    await this.storage.saveExhibit(exhibit);

    return exhibit;
  }

  /**
   * Get all exhibits for a document
   */
  async getExhibitsByDocument(documentId: string): Promise<Attachment[]> {
    const exhibits = await this.storage.getExhibitsByDocument(documentId);
    // Sort by order
    return exhibits.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  /**
   * Get a single exhibit
   */
  async getExhibit(exhibitId: string): Promise<Attachment | null> {
    return await this.storage.getExhibit(exhibitId);
  }

  /**
   * Update exhibit metadata
   */
  async updateExhibit(exhibitId: string, updates: ExhibitUpdateData): Promise<Attachment | null> {
    const existing = await this.storage.getExhibit(exhibitId);
    if (!existing) {
      throw new Error(`Exhibit not found: ${exhibitId}`);
    }

    const updated: Attachment = {
      ...existing,
      ...updates,
    };

    await this.storage.saveExhibit(updated);
    return updated;
  }

  /**
   * Reorder exhibits
   */
  async reorderExhibits(documentId: string, exhibitIds: string[]): Promise<void> {
    const exhibits = await this.storage.getExhibitsByDocument(documentId);

    // Update order for each exhibit based on position in array
    for (let i = 0; i < exhibitIds.length; i++) {
      const exhibit = exhibits.find((ex) => ex.attachmentId === exhibitIds[i]);
      if (exhibit) {
        exhibit.order = i + 1;
        await this.storage.saveExhibit(exhibit);
      }
    }
  }

  /**
   * Delete an exhibit
   */
  async deleteExhibit(exhibitId: string): Promise<void> {
    await this.storage.deleteExhibit(exhibitId);
  }

  /**
   * Download an exhibit as a file
   */
  downloadExhibit(exhibit: Attachment): void {
    if (!exhibit.fileBlob) {
      throw new Error('File blob not found');
    }

    const blob = new Blob([exhibit.fileBlob], { type: exhibit.fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = exhibit.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get exhibits by type (internal vs external)
   */
  async getExhibitsByType(documentId: string, isInternal: boolean): Promise<Attachment[]> {
    const allExhibits = await this.getExhibitsByDocument(documentId);
    return allExhibits.filter((ex) => ex.isInternal === isInternal);
  }

  /**
   * Get total file size for a document
   */
  async getTotalFileSize(documentId: string): Promise<number> {
    const exhibits = await this.getExhibitsByDocument(documentId);
    return exhibits.reduce((total, ex) => total + ex.fileSize, 0);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return crypto.randomUUID();
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): void {
    // Max file size: 100MB
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum allowed size of 100MB`);
    }

    // Check file type (allow most common types)
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      // Text
      'text/plain',
      'text/csv',
      // Archives
      'application/zip',
      'application/x-zip-compressed',
    ];

    if (!allowedTypes.includes(file.type)) {
      console.warn(`File type ${file.type} may not be supported`);
      // Don't throw error, just warn - allow all types for prototype
    }
  }

  /**
   * Read file as ArrayBuffer for storage
   */
  private readFileAsBlob(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
}

// ============================================================================
// Singleton Pattern
// ============================================================================

let exhibitServiceInstance: ExhibitService | null = null;

export function getExhibitService(): ExhibitService {
  if (!exhibitServiceInstance) {
    exhibitServiceInstance = new ExhibitService();
  }
  return exhibitServiceInstance;
}
