/**
 * File Converter Service
 * Converts various document formats to markdown
 */

import type { DocumentType } from './KnowledgeTypes';

interface ConversionResult {
  markdown: string;
  metadata?: any;
}

export class FileConverter {
  async convertToMarkdown(
    content: string,
    sourceType: DocumentType,
    metadata?: any
  ): Promise<ConversionResult> {
    switch (sourceType) {
      case 'pdf':
        return this.convertPDFToMarkdown(content, metadata);
      case 'word':
        return this.convertWordToMarkdown(content, metadata);
      case 'excel':
        return this.convertExcelToMarkdown(content, metadata);
      case 'csv':
        // CSV is already converted to markdown table in parser
        return { markdown: content, metadata };
      case 'txt':
        return this.convertTextToMarkdown(content);
      case 'markdown':
        return { markdown: content, metadata };
      default:
        return { markdown: content, metadata };
    }
  }

  private convertPDFToMarkdown(content: string, metadata?: any): ConversionResult {
    // Add metadata header
    let markdown = `# PDF Document\n\n`;
    
    if (metadata?.pageCount) {
      markdown += `> **Pages:** ${metadata.pageCount}\n`;
    }
    if (metadata?.fileSize) {
      markdown += `> **Size:** ${(metadata.fileSize / 1024).toFixed(2)} KB\n`;
    }
    
    markdown += `\n---\n\n`;
    markdown += content;
    
    return { markdown, metadata };
  }

  private convertWordToMarkdown(content: string, metadata?: any): ConversionResult {
    // Add metadata header
    let markdown = `# Word Document\n\n`;
    
    if (metadata?.pageCount) {
      markdown += `> **Pages:** ${metadata.pageCount}\n`;
    }
    if (metadata?.fileSize) {
      markdown += `> **Size:** ${(metadata.fileSize / 1024).toFixed(2)} KB\n`;
    }
    
    markdown += `\n---\n\n`;
    markdown += content;
    
    return { markdown, metadata };
  }

  private convertExcelToMarkdown(content: string, metadata?: any): ConversionResult {
    // Add metadata header
    let markdown = `# Excel Spreadsheet\n\n`;
    
    if (metadata?.sheetCount) {
      markdown += `> **Sheets:** ${metadata.sheetCount}\n`;
    }
    if (metadata?.fileSize) {
      markdown += `> **Size:** ${(metadata.fileSize / 1024).toFixed(2)} KB\n`;
    }
    
    markdown += `\n---\n\n`;
    markdown += content;
    
    return { markdown, metadata };
  }

  private convertTextToMarkdown(content: string): ConversionResult {
    // Detect and format code blocks
    const lines = content.split('\n');
    let markdown = '';
    let inCodeBlock = false;
    let codeLanguage = '';
    
    for (const line of lines) {
      // Detect potential code
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        if (inCodeBlock) {
          codeLanguage = line.trim().slice(3) || '';
          markdown += `\`\`\`${codeLanguage}\n`;
        } else {
          markdown += '\`\`\`\n';
        }
      } else if (inCodeBlock) {
        markdown += line + '\n';
      } else {
        // Check for headers (lines that look like titles)
        if (line.length > 0 && line.length < 100 && !line.includes('.') && line === line.toUpperCase()) {
          markdown += `## ${line}\n\n`;
        }
        // Check for bullet points
        else if (line.trim().startsWith('- ') || line.trim().startsWith('* ') || line.trim().startsWith('• ')) {
          markdown += line + '\n';
        }
        // Regular text
        else {
          markdown += line + '\n';
        }
      }
    }
    
    return { markdown };
  }

  async convertFromMarkdown(
    markdown: string,
    targetType: DocumentType
  ): Promise<string> {
    // This would convert markdown to other formats
    // For now, just return the markdown as-is
    return markdown;
  }

  sanitizeMarkdown(markdown: string): string {
    // Remove potentially dangerous content
    return markdown
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+="[^"]*"/gi, '');
  }
}

export const fileConverter = new FileConverter();