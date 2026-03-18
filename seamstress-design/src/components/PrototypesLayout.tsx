import React from 'react';
import { BaseLayout } from './BaseLayout';
import { prototypesLayoutConfig } from '../config/prototypesNavConfig';

interface PrototypesLayoutProps {
  children: React.ReactNode;
}

export function PrototypesLayout({ children }: PrototypesLayoutProps) {
  return <BaseLayout config={prototypesLayoutConfig}>{children}</BaseLayout>;
}
