/**
 * Theme Storage Service
 *
 * Centralized service for theme persistence with event-driven updates
 * Handles localStorage operations and provides subscription mechanism
 * for live theme updates across components and tabs
 */

import type { SavedTheme } from '../components/theme-editor/types';

const STORAGE_KEY = 'seamstress_custom_themes';
const ACTIVE_THEME_KEY = 'seamstress_active_theme';

// Custom event for theme updates
const THEME_UPDATE_EVENT = 'seamstress-theme-update';
const THEME_DELETE_EVENT = 'seamstress-theme-delete';
const ACTIVE_THEME_CHANGE_EVENT = 'seamstress-active-theme-change';

type ThemeEventType = 'update' | 'delete' | 'active-change' | 'storage';

interface ThemeUpdateEvent {
  type: ThemeEventType;
  themeId?: string;
  theme?: SavedTheme;
  activeThemeId?: string | null;
}

type ThemeSubscriber = (event: ThemeUpdateEvent) => void;

class ThemeStorageService {
  private subscribers: Set<ThemeSubscriber> = new Set();

  constructor() {
    // Listen for cross-tab storage events
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent);
    }
  }

  /**
   * Handle storage events from other tabs
   */
  private handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === ACTIVE_THEME_KEY) {
      this.notifySubscribers({
        type: 'storage',
        activeThemeId: e.key === ACTIVE_THEME_KEY ? e.newValue : undefined,
      });
    }
  };

  /**
   * Subscribe to theme updates
   */
  subscribe(callback: ThemeSubscriber): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers of theme updates
   */
  private notifySubscribers(event: ThemeUpdateEvent) {
    this.subscribers.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in theme subscriber:', error);
      }
    });
  }

  /**
   * Get all saved themes
   */
  getAllThemes(): SavedTheme[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];

      const themes = JSON.parse(stored);
      return Array.isArray(themes) ? themes : [];
    } catch (error) {
      console.error('Failed to load themes:', error);
      return [];
    }
  }

  /**
   * Get a single theme by ID
   */
  getTheme(themeId: string): SavedTheme | null {
    const themes = this.getAllThemes();
    return themes.find((t) => t.id === themeId) || null;
  }

  /**
   * Save a theme (create or update)
   */
  saveTheme(theme: SavedTheme): SavedTheme {
    const themes = this.getAllThemes();
    const updatedTheme = {
      ...theme,
      updatedAt: new Date().toISOString(),
    };

    const existingIndex = themes.findIndex((t) => t.id === theme.id);

    if (existingIndex >= 0) {
      // Update existing theme
      themes[existingIndex] = updatedTheme;
    } else {
      // Add new theme
      themes.push(updatedTheme);
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));

    // Notify subscribers
    this.notifySubscribers({
      type: 'update',
      themeId: updatedTheme.id,
      theme: updatedTheme,
    });

    // Dispatch custom event for cross-component communication
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(THEME_UPDATE_EVENT, {
          detail: { themeId: updatedTheme.id, theme: updatedTheme },
        })
      );
    }

    return updatedTheme;
  }

  /**
   * Save all themes at once
   */
  saveAllThemes(themes: SavedTheme[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));

    // Notify subscribers
    this.notifySubscribers({
      type: 'update',
    });
  }

  /**
   * Delete a theme
   */
  deleteTheme(themeId: string): void {
    const themes = this.getAllThemes();
    const filtered = themes.filter((t) => t.id !== themeId);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // If deleted theme was active, clear it
    const activeThemeId = this.getActiveThemeId();
    if (activeThemeId === themeId) {
      this.setActiveThemeId(null);
    }

    // Notify subscribers
    this.notifySubscribers({
      type: 'delete',
      themeId,
    });

    // Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(THEME_DELETE_EVENT, {
          detail: { themeId },
        })
      );
    }
  }

  /**
   * Get the active theme ID
   */
  getActiveThemeId(): string | null {
    return localStorage.getItem(ACTIVE_THEME_KEY);
  }

  /**
   * Set the active theme ID
   */
  setActiveThemeId(themeId: string | null): void {
    if (themeId) {
      localStorage.setItem(ACTIVE_THEME_KEY, themeId);
    } else {
      localStorage.removeItem(ACTIVE_THEME_KEY);
    }

    // Notify subscribers
    this.notifySubscribers({
      type: 'active-change',
      activeThemeId: themeId,
    });

    // Dispatch custom event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(ACTIVE_THEME_CHANGE_EVENT, {
          detail: { activeThemeId: themeId },
        })
      );
    }
  }

  /**
   * Get the active theme
   */
  getActiveTheme(): SavedTheme | null {
    const activeId = this.getActiveThemeId();
    if (!activeId) return null;

    return this.getTheme(activeId);
  }

  /**
   * Import a theme from JSON string
   */
  importTheme(jsonString: string): SavedTheme | null {
    try {
      const importedTheme = JSON.parse(jsonString);

      // Validate theme structure
      if (!importedTheme.name || !importedTheme.colors) {
        throw new Error('Invalid theme format');
      }

      // Create new theme with imported data
      const newTheme: SavedTheme = {
        ...importedTheme,
        id: `theme_${Date.now()}`,
        mode: importedTheme.mode || 'light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return this.saveTheme(newTheme);
    } catch (error) {
      console.error('Failed to import theme:', error);
      return null;
    }
  }

  /**
   * Export a theme to JSON
   */
  exportTheme(theme: SavedTheme): void {
    const exportData = {
      ...theme,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `${theme.name.toLowerCase().replace(/\s+/g, '-')}-theme.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  /**
   * Cleanup listeners
   */
  destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
    this.subscribers.clear();
  }
}

// Export singleton instance
export const themeStorage = new ThemeStorageService();

// Export types
export type { ThemeUpdateEvent, ThemeSubscriber };
