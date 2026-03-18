import React from 'react';
import { BaseLayout } from './BaseLayout';
import { permittingLayoutConfig } from '../config/permittingNavConfig';

interface PermittingLayoutProps {
  children: React.ReactNode;
}

export function PermittingLayout({ children }: PermittingLayoutProps) {
  return <BaseLayout config={permittingLayoutConfig}>{children}</BaseLayout>;
}
