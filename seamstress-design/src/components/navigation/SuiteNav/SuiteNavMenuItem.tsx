import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import type { SuiteNavMenuItem as SuiteNavMenuItemType } from '../types';

interface SuiteNavMenuItemProps {
  item: SuiteNavMenuItemType;
}

export function SuiteNavMenuItem({ item }: SuiteNavMenuItemProps) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(item.url);

  return (
    <ButtonBase
      component={Link}
      to={item.url}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: 48,
        px: 1.5,
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <Typography
        sx={{
          color: 'text.primary',
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: 1,
        }}
      >
        {item.label}
      </Typography>
      {isActive && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'primary.main',
          }}
        />
      )}
    </ButtonBase>
  );
}
