/**
 * Timing Constants for AI Agent Responses
 *
 * These values create realistic UX for AI agent interactions by ensuring
 * minimum response times that allow users to see thinking/loading states.
 * This simulates the actual latency of AI model inference and prevents
 * jarring instant responses that feel unnatural.
 */

/**
 * Minimum wait times (in milliseconds) for different agent types.
 * These ensure the UI has time to show thinking indicators and
 * provide a more natural conversational experience.
 */
export const AGENT_MIN_WAIT_TIMES = {
  /**
   * EAM Scheduler Agent - Longest wait time (14s)
   * Complex scheduling operations involving crew availability,
   * work zone analysis, and multi-factor optimization.
   */
  EAM_SCHEDULER: 14000,

  /**
   * Inspection Agent - Medium wait time (8s)
   * Database queries for inspection data, availability checks,
   * and capacity metric calculations.
   */
  INSPECTION: 8000,

  /**
   * Building Code Agents - Medium wait time (8s)
   * Code database searches, permit threshold checks,
   * and setback requirement calculations.
   */
  BUILDING_CODE: 8000,

  /**
   * Document Builder Agent - Shorter wait time (6s)
   * Document structure analysis and content generation.
   */
  DOCUMENT_BUILDER: 6000,

  /**
   * Document Builder Simple Agent - Shortest specialized wait (5s)
   * Simpler copy/paste content generation workflow.
   */
  DOCUMENT_BUILDER_SIMPLE: 5000,

  /**
   * Default/Budget Agent - Standard wait time (10s)
   * General knowledge base searches and response formulation.
   */
  DEFAULT: 10000,
} as const;

/**
 * Interval for rotating thinking/status messages (in milliseconds).
 * Messages cycle every 3.5 seconds to maintain user engagement
 * during longer wait periods.
 */
export const THINKING_MESSAGE_ROTATION_INTERVAL = 3500;
