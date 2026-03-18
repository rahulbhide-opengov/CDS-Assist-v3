import React from 'react';
import { BaseLayout } from './BaseLayout';
import { branchesLayoutConfig } from '../config/branchesNavConfig';

interface BranchesLayoutProps {
  children: React.ReactNode;
}

export function BranchesLayout({ children }: BranchesLayoutProps) {
  return <BaseLayout config={branchesLayoutConfig}>{children}</BaseLayout>;
}
