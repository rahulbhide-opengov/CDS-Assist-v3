import React from 'react';
import { BaseLayout } from './BaseLayout';
import { appLayoutConfig } from '../config/navBarConfig';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return <BaseLayout config={appLayoutConfig}>{children}</BaseLayout>;
}
