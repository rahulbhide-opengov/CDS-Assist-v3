/**
 * CDS-Assist ID generation utilities.
 * Use for generating unique IDs across the application.
 */

function generateIdInternal(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generates a unique ID string.
 */
export function generateId(): string {
  return generateIdInternal();
}

/**
 * Generates a message ID with 'msg-' prefix.
 */
export function generateMessageId(): string {
  return `msg-${generateIdInternal()}`;
}

/**
 * Generates a conversation ID with 'conv-' prefix.
 */
export function generateConversationId(): string {
  return `conv-${generateIdInternal()}`;
}
