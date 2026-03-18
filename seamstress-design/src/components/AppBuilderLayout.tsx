import React from 'react';
import { BaseLayout } from './BaseLayout';
import { appBuilderLayoutConfig } from '../config/appBuilderNavConfig';

interface AppBuilderLayoutProps {
  children: React.ReactNode;
}

export function AppBuilderLayout({ children }: AppBuilderLayoutProps) {
  return <BaseLayout config={appBuilderLayoutConfig}>{children}</BaseLayout>;
}
