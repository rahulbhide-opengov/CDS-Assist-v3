import React, { useState } from 'react';
import {
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Star as StarIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { SuiteNavFavoritesSection } from '../types';

interface FavoritesDropdownProps {
  favorites: SuiteNavFavoritesSection[];
}

export function FavoritesDropdown({ favorites }: FavoritesDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Check if there are any favorite items across all sections
  const hasItems = favorites.some((section) => section.items.length > 0);

  return (
    <>
      <ButtonBase
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          height: 48,
          px: 1.5,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <StarIcon sx={{ fontSize: 18, color: 'warning.main' }} />
        <Typography
          sx={{
            color: 'text.primary',
            fontSize: '0.875rem',
            fontWeight: 400,
          }}
        >
          Favorites
        </Typography>
        <ArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 200,
              maxWidth: 300,
              mt: 1,
            },
          },
        }}
      >
        {!hasItems ? (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              No favorites yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Star items to add them to your favorites
            </Typography>
          </Box>
        ) : (
          favorites.map((section, sectionIndex) => (
            <React.Fragment key={section.id}>
              {section.label && (
                <Typography
                  variant="caption"
                  sx={{
                    px: 2,
                    py: 0.5,
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 600,
                  }}
                >
                  {section.label}
                </Typography>
              )}
              {section.items.map((item) => (
                <MenuItem
                  key={item.id}
                  component={Link}
                  to={item.url}
                  onClick={handleClose}
                  sx={{
                    fontSize: 14,
                    py: 1,
                  }}
                >
                  {item.label}
                </MenuItem>
              ))}
              {sectionIndex < favorites.length - 1 && section.items.length > 0 && (
                <Divider sx={{ my: 0.5 }} />
              )}
            </React.Fragment>
          ))
        )}
      </Menu>
    </>
  );
}
