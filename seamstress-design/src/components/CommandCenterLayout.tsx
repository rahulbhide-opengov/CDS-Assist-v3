import React from 'react';
import { BaseLayout } from './BaseLayout';
import { commandCenterLayoutConfig } from '../config/commandCenterNavConfig';

interface CommandCenterLayoutProps {
  children: React.ReactNode;
}

export function CommandCenterLayout({ children }: CommandCenterLayoutProps) {
  return <BaseLayout config={commandCenterLayoutConfig}>{children}</BaseLayout>;
}
