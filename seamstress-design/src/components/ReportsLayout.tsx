import React from 'react';
import { BaseLayout } from './BaseLayout';
import { reportsLayoutConfig } from '../config/reportsNavConfig';

interface ReportsLayoutProps {
  children: React.ReactNode;
}

export function ReportsLayout({ children }: ReportsLayoutProps) {
  return <BaseLayout config={reportsLayoutConfig}>{children}</BaseLayout>;
}
