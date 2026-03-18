/**
 * AgentSelector
 *
 * Dropdown component for selecting the active AI agent.
 * Uses the AGENT_TYPES configuration.
 */

import React from 'react';
import { FormControl, Select, MenuItem, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AGENT_TYPES } from '../../services/agents/agentTypes';

interface AgentSelectorProps {
  selectedAgent: string;
  onAgentChange: (agentId: string) => void;
  variant?: 'outlined' | 'standard';
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  selectedAgent,
  onAgentChange,
  variant = 'outlined',
  size = 'small',
  fullWidth = true,
}) => {
  return (
    <FormControl fullWidth={fullWidth} size={size}>
      <Select
        value={selectedAgent}
        onChange={(e) => onAgentChange(e.target.value)}
        variant={variant}
        IconComponent={ExpandMoreIcon}
        displayEmpty
        sx={{
          height: size === 'small' ? 36 : 44,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
            borderWidth: 1,
          },
          '& .MuiSelect-select': {
            color: 'primary.main',
            fontSize: '14px',
            py: 1,
            display: 'flex',
            alignItems: 'center',
          },
          '& .MuiSvgIcon-root': {
            color: 'primary.main',
          },
        }}
      >
        {Object.values(AGENT_TYPES).map((agent) => (
          <MenuItem key={agent.id} value={agent.id}>
            <Typography sx={{ fontSize: '14px' }}>{agent.name}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AgentSelector;
