/**
 * Centralized Mock Data Module
 *
 * This module provides all mock data for the Seamstress application.
 * It serves as a single source of truth for development and prototyping.
 *
 * Benefits:
 * - No duplicate data across pages
 * - Easy to switch between mock and real API data
 * - Consistent data structure
 * - Type-safe with TypeScript
 */

// Export all mock data
export { mockAgents } from './mockAgents';
export { mockAgentsOG } from './mockAgentsOG';
export { mockSkills } from './mockSkills';
export { mockTools } from './mockTools';

// Re-export types for convenience
export type { OGAgent, OGSkill, OGTool, OGKnowledgeDocument } from '../types/opengov';