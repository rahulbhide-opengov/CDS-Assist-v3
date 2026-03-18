import React from 'react';
import { Box, useTheme } from '@mui/material';
import type { BoxProps } from '@mui/material';

export interface ToolbarProps extends BoxProps {
  children: React.ReactNode;
  level?: 'level1' | 'level2';
}

interface ToolbarSectionProps {
  children: React.ReactNode;
  grow?: boolean;
  align?: 'left' | 'center' | 'right';
  spacing?: number;
}

interface ToolbarGroupProps {
  children: React.ReactNode;
  spacing?: number;
}

// Main Toolbar component
const Toolbar = ({
  children,
  level = 'level1',
  ...boxProps
}: ToolbarProps) => {
  const theme = useTheme();
  const isLevel1 = level === 'level1';

  return (
    <Box
      {...boxProps}
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        borderRadius: 1,
        px: 3,
        py: 1,
        gap: 1,
        border: isLevel1 ? "none" : `1px solid ${theme.palette.divider}`,
        borderColor: isLevel1 ? 0 : theme.palette.divider,
        backgroundColor: isLevel1
          ? 'transparent'
          : theme.palette.background.paper,
        // Mobile responsiveness - level1 stacks, level2 stays row
        [theme.breakpoints.down('sm')]: isLevel1
          ? {
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 1.5,
              py: 2,
              px: 2,
              '& .MuiButton-root': {
                width: '100%',
              },
              '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
                width: '100%',
              },
              '& .MuiToggleButtonGroup-root': {
                width: '100%',
                '& .MuiToggleButton-root': {
                  flex: 1,
                },
              },
              '& .MuiAutocomplete-root, & .MuiTextField-root': {
                width: '100%',
              },
            }
          : {
              px: 2,
            },
        ...boxProps.sx,
      }}
    >
      {children}
    </Box>
  );
};

// Section component for grouping toolbar items
const ToolbarSection: React.FC<ToolbarSectionProps> = ({
  children,
  grow = false,
  align = 'left',
  spacing = 1,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing,
        flex: grow ? 1 : 'initial',
        justifyContent: align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
        // Mobile responsiveness
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          gap: 1,
        },
      }}
    >
      {children}
    </Box>
  );
};

// Group component for tightly grouped items
const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        // Mobile responsiveness
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
          alignItems: 'stretch',
          width: '100%',
          gap: 1,
        },
      }}
    >
      {children}
    </Box>
  );
};

// Divider component
const ToolbarDivider: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 1,
        height: 24,
        mx: 1,
        // Hide on mobile since vertical dividers don't make sense in column layout
        [theme.breakpoints.down('sm')]: {
          display: 'none',
        },
      }}
    />
  );
};

// Export compound component
export default Object.assign(Toolbar, {
  Section: ToolbarSection,
  Group: ToolbarGroup,
  Divider: ToolbarDivider,
});

// Export individual components for flexibility
export { ToolbarSection, ToolbarGroup, ToolbarDivider };