/**
 * SignatureService
 * Service for managing document signature blocks
 *
 * Features:
 * - Add/remove signers
 * - Wet vs electronic signatures
 * - Signing order
 * - Signature status tracking
 * - CRUD operations
 */

import { DocumentStorage } from './DocumentStorage';
import type { Signature } from '../../types/procurement';

export interface SignatureCreateData {
  documentId: string;
  signerName: string;
  signerTitle: string;
  signerEmail?: string;
  signatureType: 'wet' | 'electronic';
  order: number;
  isRequired?: boolean;
}

export interface SignatureUpdateData {
  signerName?: string;
  signerTitle?: string;
  signerEmail?: string;
  signatureType?: 'wet' | 'electronic';
  order?: number;
  isRequired?: boolean;
  status?: 'pending' | 'signed' | 'declined';
  signedAt?: string;
  signatureData?: string;
}

export class SignatureService {
  private storage: DocumentStorage;

  constructor() {
    this.storage = new DocumentStorage();
  }

  /**
   * Create a new signature block
   */
  async createSignature(data: SignatureCreateData): Promise<Signature> {
    const signature: Signature = {
      signatureId: this.generateId(),
      documentId: data.documentId,
      signerName: data.signerName,
      signerTitle: data.signerTitle,
      signerEmail: data.signerEmail,
      signatureType: data.signatureType,
      order: data.order,
      isRequired: data.isRequired ?? true,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    await this.storage.saveSignature(signature);
    return signature;
  }

  /**
   * Get all signatures for a document
   */
  async getSignaturesByDocument(documentId: string): Promise<Signature[]> {
    const signatures = await this.storage.getSignaturesByDocument(documentId);
    // Sort by order
    return signatures.sort((a, b) => a.order - b.order);
  }

  /**
   * Get a single signature
   */
  async getSignature(signatureId: string): Promise<Signature | null> {
    return await this.storage.getSignature(signatureId);
  }

  /**
   * Update signature
   */
  async updateSignature(signatureId: string, updates: SignatureUpdateData): Promise<Signature | null> {
    const existing = await this.storage.getSignature(signatureId);
    if (!existing) {
      throw new Error(`Signature not found: ${signatureId}`);
    }

    const updated: Signature = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.storage.saveSignature(updated);
    return updated;
  }

  /**
   * Delete signature
   */
  async deleteSignature(signatureId: string): Promise<void> {
    await this.storage.deleteSignature(signatureId);
  }

  /**
   * Reorder signatures
   */
  async reorderSignatures(documentId: string, signatureIds: string[]): Promise<void> {
    const signatures = await this.storage.getSignaturesByDocument(documentId);

    // Update order for each signature based on position in array
    for (let i = 0; i < signatureIds.length; i++) {
      const signature = signatures.find((sig) => sig.signatureId === signatureIds[i]);
      if (signature) {
        signature.order = i + 1;
        await this.storage.saveSignature(signature);
      }
    }
  }

  /**
   * Get next available order number
   */
  async getNextOrder(documentId: string): Promise<number> {
    const signatures = await this.storage.getSignaturesByDocument(documentId);
    const maxOrder = signatures.reduce((max, sig) => Math.max(max, sig.order), 0);
    return maxOrder + 1;
  }

  /**
   * Sign a signature block (for prototype/mock purposes)
   */
  async signSignature(
    signatureId: string,
    signatureData?: string
  ): Promise<Signature | null> {
    return await this.updateSignature(signatureId, {
      status: 'signed',
      signedAt: new Date().toISOString(),
      signatureData,
    });
  }

  /**
   * Decline a signature
   */
  async declineSignature(signatureId: string): Promise<Signature | null> {
    return await this.updateSignature(signatureId, {
      status: 'declined',
    });
  }

  /**
   * Check if all required signatures are complete
   */
  async areAllRequiredSignaturesComplete(documentId: string): Promise<boolean> {
    const signatures = await this.storage.getSignaturesByDocument(documentId);
    const requiredSignatures = signatures.filter((sig) => sig.isRequired);

    if (requiredSignatures.length === 0) {
      return true;
    }

    return requiredSignatures.every((sig) => sig.status === 'signed');
  }

  /**
   * Get signature completion progress
   */
  async getSignatureProgress(documentId: string): Promise<{
    total: number;
    signed: number;
    pending: number;
    declined: number;
    percentage: number;
  }> {
    const signatures = await this.storage.getSignaturesByDocument(documentId);
    const requiredSignatures = signatures.filter((sig) => sig.isRequired);

    const signed = requiredSignatures.filter((sig) => sig.status === 'signed').length;
    const pending = requiredSignatures.filter((sig) => sig.status === 'pending').length;
    const declined = requiredSignatures.filter((sig) => sig.status === 'declined').length;

    const percentage = requiredSignatures.length > 0
      ? Math.round((signed / requiredSignatures.length) * 100)
      : 100;

    return {
      total: requiredSignatures.length,
      signed,
      pending,
      declined,
      percentage,
    };
  }

  /**
   * Get signatures by type
   */
  async getSignaturesByType(
    documentId: string,
    signatureType: 'wet' | 'electronic'
  ): Promise<Signature[]> {
    const allSignatures = await this.getSignaturesByDocument(documentId);
    return allSignatures.filter((sig) => sig.signatureType === signatureType);
  }

  /**
   * Get signatures by status
   */
  async getSignaturesByStatus(
    documentId: string,
    status: 'pending' | 'signed' | 'declined'
  ): Promise<Signature[]> {
    const allSignatures = await this.getSignaturesByDocument(documentId);
    return allSignatures.filter((sig) => sig.status === status);
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
}

// ============================================================================
// Singleton Pattern
// ============================================================================

let signatureServiceInstance: SignatureService | null = null;

export function getSignatureService(): SignatureService {
  if (!signatureServiceInstance) {
    signatureServiceInstance = new SignatureService();
  }
  return signatureServiceInstance;
}
