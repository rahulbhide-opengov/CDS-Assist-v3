import React from 'react';
import { BaseLayout } from './BaseLayout';
import { docsLayoutConfig } from '../config/docsNavConfig';

interface DocsLayoutProps {
  children: React.ReactNode;
  /** Override the max content width. Use 'none' for full width, or a number/string value. */
  maxContentWidth?: number | string | 'none';
}

export function DocsLayout({ children, maxContentWidth }: DocsLayoutProps) {
  return <BaseLayout config={docsLayoutConfig} maxContentWidth={maxContentWidth}>{children}</BaseLayout>;
}
