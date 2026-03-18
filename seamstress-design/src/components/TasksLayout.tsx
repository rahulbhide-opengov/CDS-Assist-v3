import React from 'react';
import { BaseLayout } from './BaseLayout';
import { tasksLayoutConfig } from '../config/tasksNavConfig';

interface TasksLayoutProps {
  children: React.ReactNode;
}

export function TasksLayout({ children }: TasksLayoutProps) {
  return <BaseLayout config={tasksLayoutConfig}>{children}</BaseLayout>;
}
