/**
 * Utility to handle base path for URLs in the application.
 *
 * In production with BASE_PATH=/seamstress-design, all internal URLs need to be
 * prefixed with the base path. This utility provides a consistent way to do that.
 */

/**
 * Get the base URL from Vite's environment.
 * - Development: '/'
 * - Production: '/seamstress-design/' (or whatever BASE_PATH is set to)
 */
export const BASE_URL = import.meta.env.BASE_URL;

/**
 * Prepend the base path to an internal URL.
 *
 * @param path - The path to prefix (should start with '/')
 * @returns The path with base URL prepended
 *
 * @example
 * // In development (BASE_URL = '/')
 * withBasePath('/procurement/projects') // returns '/procurement/projects'
 *
 * // In production (BASE_URL = '/seamstress-design/' or '/seamstress-design')
 * withBasePath('/procurement/projects') // returns '/seamstress-design/procurement/projects'
 */
export function withBasePath(path: string): string {
  // Normalize: ensure BASE_URL ends with '/' and path starts with '/'
  const base = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${normalizedPath}`;
}
