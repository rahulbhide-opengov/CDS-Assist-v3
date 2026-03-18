/**
 * File Upload Service
 * Handles file uploads and processing for various document formats
 */

import type { UploadResult, DocumentType } from './KnowledgeTypes';
import { fileParser } from './FileParser';
import { fileConverter } from './FileConverter';
import logger from '../../utils/logger';

export class FileUploadService {
  private supportedTypes = {
    'application/pdf': 'pdf' as DocumentType,
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word' as DocumentType,
    'application/msword': 'word' as DocumentType,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel' as DocumentType,
    'application/vnd.ms-excel': 'excel' as DocumentType,
    'text/csv': 'csv' as DocumentType,
    'text/markdown': 'markdown' as DocumentType,
    'text/plain': 'txt' as DocumentType,
  };

  async uploadFile(file: File): Promise<UploadResult> {
    try {
      // Validate file type
      const documentType = this.getDocumentType(file);
      if (!documentType) {
        return {
          success: false,
          error: `Unsupported file type: ${file.type}`,
        };
      }

      // Parse file content
      const parseResult = await fileParser.parseFile(file, documentType);
      if (!parseResult.success) {
        return parseResult;
      }

      // Convert to markdown if needed
      let content = parseResult.content || '';
      if (documentType !== 'markdown' && documentType !== 'txt') {
        const convertResult = await fileConverter.convertToMarkdown(content, documentType, parseResult.metadata);
        content = convertResult.markdown;
      }

      // Convert File to Blob for storage (preserve original file for non-text documents)
      const shouldPreserveOriginal = documentType === 'pdf' || documentType === 'word' || documentType === 'excel';
      const originalBlob = shouldPreserveOriginal ? new Blob([file], { type: file.type }) : undefined;

      return {
        success: true,
        extractedContent: content,
        metadata: {
          type: documentType,
          size: file.size,
          mimeType: file.type,
          ...parseResult.metadata,
        },
        originalFile: originalBlob,
        originalFileName: shouldPreserveOriginal ? file.name : undefined,
      };
    } catch (error) {
      logger.error('File upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async uploadMultipleFiles(files: FileList | File[]): Promise<Map<string, UploadResult>> {
    const results = new Map<string, UploadResult>();
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const result = await this.uploadFile(file);
      results.set(file.name, result);
    }

    return results;
  }

  private getDocumentType(file: File): DocumentType | null {
    // Check by MIME type
    if (this.supportedTypes[file.type]) {
      return this.supportedTypes[file.type];
    }

    // Check by file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'word';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'csv':
        return 'csv';
      case 'md':
        return 'markdown';
      case 'txt':
        return 'txt';
      default:
        return null;
    }
  }

  isSupported(file: File): boolean {
    return this.getDocumentType(file) !== null;
  }

  getMaxFileSize(): number {
    return 50 * 1024 * 1024; // 50MB
  }

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!this.isSupported(file)) {
      return {
        valid: false,
        error: `Unsupported file type: ${file.name}`,
      };
    }

    if (file.size > this.getMaxFileSize()) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.getMaxFileSize() / (1024 * 1024)}MB`,
      };
    }

    return { valid: true };
  }

  // Alias for uploadFile to match test expectations
  async processFile(file: File): Promise<{ content: string; type: string; metadata?: any }> {
    const result = await this.uploadFile(file);
    return {
      content: result.extractedContent || '',
      type: result.metadata?.type || 'txt',
      metadata: result.metadata,
    };
  }
}

export const fileUploadService = new FileUploadService();