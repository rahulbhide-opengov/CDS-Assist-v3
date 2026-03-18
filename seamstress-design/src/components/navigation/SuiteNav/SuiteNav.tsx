import React from 'react';
import { Box, Typography } from '@mui/material';
import { SuiteNavMenuItem } from './SuiteNavMenuItem';
import { FavoritesDropdown } from './FavoritesDropdown';
import type { SuiteNavProps } from '../types';

export function SuiteNav({ appName, menuItems, favorites }: SuiteNavProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        overflowX: 'scroll',
        overflowY: 'hidden',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      <Box
        component="nav"
        aria-label="Suite navigation"
        sx={{
          display: 'inline-flex',
          minWidth: 'fit-content',
          alignItems: 'center',
          height: 48,
          pl: 2,
          pr: 2,
          gap: 0.5,
          bgcolor: 'background.paper',
          whiteSpace: 'nowrap',
        }}
      >
        {/* App Name */}
        <Typography
          sx={{
            fontWeight: 600,
            color: 'text.main',
            fontSize: '1rem',
            mr: 1,
          }}
        >
          {appName}
        </Typography>

        {/* Favorites Dropdown */}
        {favorites && <FavoritesDropdown favorites={favorites} />}

        {/* Menu Items */}
        {menuItems.map((item) => (
          <SuiteNavMenuItem key={item.id} item={item} />
        ))}
      </Box>
    </Box>
  );
}
