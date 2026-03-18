/**
 * AccessibleBreadcrumbs - Accessible breadcrumb navigation component
 *
 * Wraps MUI Breadcrumbs with proper ARIA attributes:
 * - nav element with aria-label="Breadcrumb"
 * - aria-current="page" on the last (current) item
 * - Proper link vs text differentiation
 */

import React from 'react';
import { Box, Breadcrumbs, Link, Typography, BreadcrumbsProps } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** URL to navigate to (omit for current page) */
  href?: string;
  /** Click handler (alternative to href) */
  onClick?: () => void;
}

export interface AccessibleBreadcrumbsProps {
  /** Array of breadcrumb items in order */
  items: BreadcrumbItem[];
  /** Custom separator element */
  separator?: React.ReactNode;
  /** Additional MUI Breadcrumbs props */
  breadcrumbsProps?: Omit<BreadcrumbsProps, 'children'>;
  /** Font size for breadcrumb text */
  fontSize?: string | number;
  /** Custom aria-label for the nav element */
  'aria-label'?: string;
}

/**
 * AccessibleBreadcrumbs provides screen reader friendly breadcrumb navigation.
 *
 * Features:
 * - Wraps content in a <nav> element with aria-label="Breadcrumb"
 * - Automatically marks the last item as aria-current="page"
 * - Clickable items use Link, current page uses Typography
 *
 * @example
 * ```tsx
 * <AccessibleBreadcrumbs
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Widget A' }, // Current page - no href
 *   ]}
 * />
 * ```
 */
export function AccessibleBreadcrumbs({
  items,
  separator = <NavigateNextIcon fontSize="small" />,
  breadcrumbsProps,
  fontSize = '14px',
  'aria-label': ariaLabel = 'Breadcrumb',
}: AccessibleBreadcrumbsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box component="nav" aria-label={ariaLabel}>
      <Breadcrumbs separator={separator} {...breadcrumbsProps}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isClickable = item.href || item.onClick;

          // Last item is always the current page
          if (isLast) {
            return (
              <Typography
                key={index}
                color="text.primary"
                aria-current="page"
                sx={{ fontSize }}
              >
                {item.label}
              </Typography>
            );
          }

          // Clickable items
          if (isClickable) {
            return (
              <Link
                key={index}
                color="inherit"
                href={item.href || '#'}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                sx={{
                  textDecoration: 'none',
                  fontSize,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                  '&:focus-visible': {
                    outline: '2px solid',
                    outlineOffset: 2,
                  },
                }}
              >
                {item.label}
              </Link>
            );
          }

          // Non-clickable intermediate items (rare but supported)
          return (
            <Typography key={index} color="text.secondary" sx={{ fontSize }}>
              {item.label}
            </Typography>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}

export default AccessibleBreadcrumbs;
