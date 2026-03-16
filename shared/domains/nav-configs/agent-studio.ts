/**
 * Agent Studio navigation configuration.
 */

import type { NavConfig } from '../../types';

/** Agent Studio nav config. */
export const agentStudioNavConfig: NavConfig = {
  appName: 'Agent Studio',
  menuOptions: [
    { id: 'dashboard', label: 'Dashboard', path: '/agent-studio/dashboard' },
    { id: 'agents', label: 'Assistants', path: '/agent-studio/agents' },
    { id: 'skills', label: 'Skills', path: '/agent-studio/skills' },
    { id: 'tools', label: 'Tools', path: '/agent-studio/tools' },
    { id: 'knowledge', label: 'Knowledge', path: '/agent-studio/knowledge' },
  ],
  searchConfig: {
    filters: ['All', 'Agents', 'Workflows', 'Analytics'],
  },
  profile: {
    initials: 'JD',
  },
};
