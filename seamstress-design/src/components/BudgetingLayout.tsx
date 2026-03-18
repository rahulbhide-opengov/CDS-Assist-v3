import React from 'react';
import { BaseLayout } from './BaseLayout';
import { budgetingLayoutConfig } from '../config/budgetingNavConfig';

interface BudgetingLayoutProps {
  children: React.ReactNode;
}

export function BudgetingLayout({ children }: BudgetingLayoutProps) {
  return <BaseLayout config={budgetingLayoutConfig}>{children}</BaseLayout>;
}
