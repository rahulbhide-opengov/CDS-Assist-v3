import React from 'react';
import { BaseLayout } from './BaseLayout';
import { eamLayoutConfig } from '../config/eamNavBarConfig';

interface EAMLayoutProps {
  children: React.ReactNode;
}

export function EAMLayout({ children }: EAMLayoutProps) {
  return <BaseLayout config={eamLayoutConfig}>{children}</BaseLayout>;
}
