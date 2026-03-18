import React from 'react';
import { BaseLayout } from './BaseLayout';
import { seamstressLayoutConfig } from '../config/seamstressNavConfig';

interface SeamstressLayoutProps {
  children: React.ReactNode;
  /** Override the max content width. Use 'none' for full width, or a number/string value. */
  maxContentWidth?: number | string | 'none';
}

export function SeamstressLayout({ children, maxContentWidth }: SeamstressLayoutProps) {
  return <BaseLayout config={seamstressLayoutConfig} maxContentWidth={maxContentWidth}>{children}</BaseLayout>;
}
