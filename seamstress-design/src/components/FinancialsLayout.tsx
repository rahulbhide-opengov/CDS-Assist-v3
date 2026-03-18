import React from 'react';
import { BaseLayout } from './BaseLayout';
import { financialsLayoutConfig } from '../config/financialsNavConfig';

interface FinancialsLayoutProps {
  children: React.ReactNode;
}

export function FinancialsLayout({ children }: FinancialsLayoutProps) {
  return <BaseLayout config={financialsLayoutConfig}>{children}</BaseLayout>;
}
