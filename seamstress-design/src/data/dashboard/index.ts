/**
 * Dashboard Mock Data - Organized Exports
 *
 * Re-exports all dashboard data in a clean, organized structure.
 * Data is sourced from dashboardMockData.ts but organized by domain.
 */

// Export all types
export * from './types';

// Export helpers
export * from './helpers';

// Re-export data from the main file
export {
  goalMetrics,
  heroKPIs,
  agentPerformance,
  skillUsage,
  toolCallStats,
  userActivity,
  feedbackData,
  guardrailViolations,
  modelProviderStats,
  timeSeriesData,
  feedbackFlywheel,
  dashboardMockData,

  // Utility functions
  getAgentById,
  getSkillsByAgent,
  getToolsBySkill,
  getUserFeedback,
  getActiveAgents,
  getActiveUsersInPeriod,
} from '../dashboardMockData';

// Re-export default
export { default } from '../dashboardMockData';
