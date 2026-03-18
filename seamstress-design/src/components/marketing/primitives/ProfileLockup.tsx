/**
 * ProfileLockup
 *
 * Split layout component for leadership/team member profiles.
 * Features portrait photo, large display name, title, and bio.
 * Supports marketing theme for light/dark mode.
 */

import React from 'react';
import { Box, Typography, IconButton, type SxProps, type Theme } from '@mui/material';
import { LinkedIn, X } from '@mui/icons-material';
import { useMarketingTheme } from '../../../contexts/MarketingThemeContext';

export interface ProfileLockupProps {
  /** Person's full name */
  name: string;
  /** Job title or role */
  title: string;
  /** Bio text - can be multiple paragraphs */
  bio: string | string[];
  /** URL to portrait image */
  imageUrl?: string;
  /** LinkedIn profile URL */
  linkedInUrl?: string;
  /** X (Twitter) profile URL */
  xUrl?: string;
  /** Additional styles */
  sx?: SxProps<Theme>;
}

export const ProfileLockup: React.FC<ProfileLockupProps> = ({
  name,
  title,
  bio,
  imageUrl,
  linkedInUrl,
  xUrl,
  sx,
}) => {
  const { marketingColors } = useMarketingTheme();
  const bioArray = Array.isArray(bio) ? bio : [bio];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1.2fr' },
        gap: { xs: 4, md: 8 },
        alignItems: 'start',
        ...sx,
      }}
    >
      {/* Left: Photo and social links */}
      <Box>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 400,
            aspectRatio: '3 / 4',
            bgcolor: marketingColors.surfaceDark,
            borderRadius: 0,
            overflow: 'hidden',
          }}
        >
          {imageUrl ? (
            <Box
              component="img"
              src={imageUrl}
              alt={name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: marketingColors.muted,
                fontSize: '0.875rem',
              }}
            >
              Photo
            </Box>
          )}
        </Box>

        {/* Social links */}
        {(linkedInUrl || xUrl) && (
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {linkedInUrl && (
              <IconButton
                component="a"
                href={linkedInUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: marketingColors.accent, p: 0.5 }}
              >
                <LinkedIn sx={{ fontSize: 28 }} />
              </IconButton>
            )}
            {xUrl && (
              <IconButton
                component="a"
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: marketingColors.accent, p: 0.5 }}
              >
                <X sx={{ fontSize: 24 }} />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      {/* Right: Name, title, bio */}
      <Box>
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: '3rem', sm: '4rem', md: '5rem', lg: '6rem' },
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '-0.02em',
            color: marketingColors.accent,
            mb: 1,
          }}
        >
          {name}
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            color: marketingColors.accent,
            fontWeight: 400,
            mb: 3,
          }}
        >
          {title}
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            height: 1,
            bgcolor: marketingColors.accent,
            opacity: 0.3,
            mb: 3,
          }}
        />

        {/* Bio paragraphs */}
        {bioArray.map((paragraph, index) => (
          <Typography
            key={index}
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              lineHeight: 1.7,
              color: marketingColors.muted,
              mb: 2.5,
            }}
          >
            {paragraph}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ProfileLockup;
