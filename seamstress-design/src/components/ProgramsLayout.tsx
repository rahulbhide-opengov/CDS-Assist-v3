import React from 'react';
import { BaseLayout } from './BaseLayout';
import { programsLayoutConfig } from '../config/programsNavConfig';

interface ProgramsLayoutProps {
  children: React.ReactNode;
}

export function ProgramsLayout({ children }: ProgramsLayoutProps) {
  return <BaseLayout config={programsLayoutConfig}>{children}</BaseLayout>;
}
