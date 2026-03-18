/**
 * ID Generation Utilities
 *
 * Centralized utilities for generating unique identifiers throughout the application.
 * Uses a combination of timestamp and random characters to ensure uniqueness.
 */

/**
 * Generate a random suffix string for IDs.
 * Uses base36 encoding (0-9, a-z) for compact representation.
 */
function generateRandomSuffix(length = 9): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a unique message ID.
 * Format: `msg_{timestamp}_{random}`
 *
 * @example
 * generateMessageId() // "msg_1706889600000_k3j8f2n9x"
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${generateRandomSuffix()}`;
}

/**
 * Generate a unique conversation ID.
 * Format: `conv_{timestamp}_{random}`
 *
 * @example
 * generateConversationId() // "conv_1706889600000_m5p2k7r1w"
 */
export function generateConversationId(): string {
  return `conv_${Date.now()}_${generateRandomSuffix()}`;
}

/**
 * Generate a unique action ID for AI action tracking.
 * Format: `action_{timestamp}_{random}`
 *
 * @example
 * generateActionId() // "action_1706889600000_h9d4v6b8q"
 */
export function generateActionId(): string {
  return `action_${Date.now()}_${generateRandomSuffix()}`;
}

/**
 * Generate a unique group ID for action grouping.
 * Format: `group_{timestamp}_{random}`
 *
 * @example
 * generateGroupId() // "group_1706889600000_j2n8m3x5c"
 */
export function generateGroupId(): string {
  return `group_${Date.now()}_${generateRandomSuffix()}`;
}

/**
 * Generate a unique file ID for uploaded files.
 * Format: `file_{timestamp}_{random}`
 *
 * @example
 * generateFileId() // "file_1706889600000_p4r7s9w2y"
 */
export function generateFileId(): string {
  return `file_${Date.now()}_${generateRandomSuffix()}`;
}

/**
 * Generate a generic unique ID with a custom prefix.
 * Format: `{prefix}_{timestamp}_{random}`
 *
 * @param prefix - Custom prefix for the ID
 * @example
 * generateId('session') // "session_1706889600000_q8t2v5z1n"
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${generateRandomSuffix()}`;
}
