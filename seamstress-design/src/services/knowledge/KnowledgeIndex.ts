/**
 * Knowledge Index Service
 * Search indexing and retrieval for fast @ symbol lookups
 */

import type { KnowledgeDocument, SearchResult } from './KnowledgeTypes';

interface IndexEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  type: string;
  author: string;
  created: Date;
  modified: Date;
}

export class KnowledgeIndex {
  private index: Map<string, IndexEntry> = new Map();
  private titleIndex: Map<string, Set<string>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private typeIndex: Map<string, Set<string>> = new Map();
  private wordIndex: Map<string, Set<string>> = new Map();

  async indexDocument(document: KnowledgeDocument): Promise<void> {
    // Create index entry
    const entry: IndexEntry = {
      id: document.id,
      title: document.title.toLowerCase(),
      content: document.content.toLowerCase(),
      tags: document.metadata.tags.map(t => t.toLowerCase()),
      type: document.type,
      author: document.metadata.author,
      created: document.metadata.created,
      modified: document.metadata.modified,
    };

    // Store in main index
    this.index.set(document.id, entry);

    // Index title words
    const titleWords = this.tokenize(entry.title);
    titleWords.forEach(word => {
      if (!this.titleIndex.has(word)) {
        this.titleIndex.set(word, new Set());
      }
      this.titleIndex.get(word)!.add(document.id);
    });

    // Index tags
    entry.tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(document.id);
    });

    // Index type
    if (!this.typeIndex.has(entry.type)) {
      this.typeIndex.set(entry.type, new Set());
    }
    this.typeIndex.get(entry.type)!.add(document.id);

    // Index content words (limited to first 1000 words for performance)
    const contentWords = this.tokenize(entry.content).slice(0, 1000);
    contentWords.forEach(word => {
      if (!this.wordIndex.has(word)) {
        this.wordIndex.set(word, new Set());
      }
      this.wordIndex.get(word)!.add(document.id);
    });
  }

  async updateDocument(document: KnowledgeDocument): Promise<void> {
    // Remove old index entries
    await this.removeDocument(document.id);
    // Re-index document
    await this.indexDocument(document);
  }

  async removeDocument(id: string): Promise<void> {
    const entry = this.index.get(id);
    if (!entry) return;

    // Remove from title index
    const titleWords = this.tokenize(entry.title);
    titleWords.forEach(word => {
      this.titleIndex.get(word)?.delete(id);
      if (this.titleIndex.get(word)?.size === 0) {
        this.titleIndex.delete(word);
      }
    });

    // Remove from tag index
    entry.tags.forEach(tag => {
      this.tagIndex.get(tag)?.delete(id);
      if (this.tagIndex.get(tag)?.size === 0) {
        this.tagIndex.delete(tag);
      }
    });

    // Remove from type index
    this.typeIndex.get(entry.type)?.delete(id);
    if (this.typeIndex.get(entry.type)?.size === 0) {
      this.typeIndex.delete(entry.type);
    }

    // Remove from word index
    const contentWords = this.tokenize(entry.content).slice(0, 1000);
    contentWords.forEach(word => {
      this.wordIndex.get(word)?.delete(id);
      if (this.wordIndex.get(word)?.size === 0) {
        this.wordIndex.delete(word);
      }
    });

    // Remove from main index
    this.index.delete(id);
  }

  async search(query: string): Promise<SearchResult[]> {
    const lowerQuery = query.toLowerCase();
    const queryWords = this.tokenize(lowerQuery);
    const results = new Map<string, { score: number; highlights: any[] }>();

    // Search in titles (highest weight)
    queryWords.forEach(word => {
      const titleMatches = this.titleIndex.get(word) || new Set();
      titleMatches.forEach(id => {
        const current = results.get(id) || { score: 0, highlights: [] };
        current.score += 10; // Title match weight
        current.highlights.push({
          field: 'title',
          snippet: this.index.get(id)?.title || '',
        });
        results.set(id, current);
      });
    });

    // Search in tags (medium weight)
    queryWords.forEach(word => {
      const tagMatches = this.tagIndex.get(word) || new Set();
      tagMatches.forEach(id => {
        const current = results.get(id) || { score: 0, highlights: [] };
        current.score += 5; // Tag match weight
        results.set(id, current);
      });
    });

    // Search in content (lower weight)
    queryWords.forEach(word => {
      const contentMatches = this.wordIndex.get(word) || new Set();
      contentMatches.forEach(id => {
        const current = results.get(id) || { score: 0, highlights: [] };
        current.score += 1; // Content match weight
        const entry = this.index.get(id);
        if (entry) {
          const snippet = this.extractSnippet(entry.content, word);
          if (snippet) {
            current.highlights.push({
              field: 'content',
              snippet,
            });
          }
        }
        results.set(id, current);
      });
    });

    // Convert to SearchResult format
    const searchResults: SearchResult[] = [];
    results.forEach((result, id) => {
      const entry = this.index.get(id);
      if (entry) {
        // Create a mock document for search results
        const document: KnowledgeDocument = {
          id,
          title: entry.title,
          content: entry.content,
          type: entry.type as any,
          metadata: {
            author: entry.author,
            created: entry.created,
            modified: entry.modified,
            tags: entry.tags,
            references: [],
            referencedBy: [],
            version: 1,
          },
          permissions: {
            owner: entry.author,
            public: false,
            sharedWith: [],
            canEdit: [],
            canView: [],
          },
          publishingStatus: 'published',
        };

        searchResults.push({
          document,
          score: result.score,
          highlights: result.highlights,
        });
      }
    });

    // Sort by score
    searchResults.sort((a, b) => b.score - a.score);

    return searchResults;
  }

  async searchByType(type: string): Promise<string[]> {
    return Array.from(this.typeIndex.get(type) || new Set());
  }

  async searchByTag(tag: string): Promise<string[]> {
    return Array.from(this.tagIndex.get(tag.toLowerCase()) || new Set());
  }

  async getSuggestions(prefix: string, limit: number = 10): Promise<string[]> {
    const lowerPrefix = prefix.toLowerCase();
    const suggestions = new Set<string>();

    // Search in title words
    this.titleIndex.forEach((_, word) => {
      if (word.startsWith(lowerPrefix)) {
        suggestions.add(word);
      }
    });

    // Search in tags
    this.tagIndex.forEach((_, tag) => {
      if (tag.startsWith(lowerPrefix)) {
        suggestions.add(tag);
      }
    });

    return Array.from(suggestions).slice(0, limit);
  }

  private tokenize(text: string): string[] {
    // Simple tokenization - can be improved with better NLP
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2); // Filter out very short words
  }

  private extractSnippet(content: string, word: string, contextLength: number = 100): string {
    const index = content.indexOf(word);
    if (index === -1) return '';

    const start = Math.max(0, index - contextLength);
    const end = Math.min(content.length, index + word.length + contextLength);
    
    let snippet = content.substring(start, end);
    
    // Add ellipsis if truncated
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';
    
    return snippet;
  }

  async clear(): Promise<void> {
    this.index.clear();
    this.titleIndex.clear();
    this.tagIndex.clear();
    this.typeIndex.clear();
    this.wordIndex.clear();
  }

  getStats(): {
    totalDocuments: number;
    totalWords: number;
    totalTags: number;
    types: string[];
  } {
    return {
      totalDocuments: this.index.size,
      totalWords: this.wordIndex.size,
      totalTags: this.tagIndex.size,
      types: Array.from(this.typeIndex.keys()),
    };
  }
}

export const knowledgeIndex = new KnowledgeIndex();