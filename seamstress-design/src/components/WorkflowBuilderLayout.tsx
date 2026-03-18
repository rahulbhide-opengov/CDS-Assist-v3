import React from 'react';
import { BaseLayout } from './BaseLayout';
import { workflowBuilderLayoutConfig } from '../config/workflowBuilderNavConfig';

interface WorkflowBuilderLayoutProps {
  children: React.ReactNode;
}

export function WorkflowBuilderLayout({ children }: WorkflowBuilderLayoutProps) {
  return <BaseLayout config={workflowBuilderLayoutConfig}>{children}</BaseLayout>;
}
