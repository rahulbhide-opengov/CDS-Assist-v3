import React from 'react';
import { BaseLayout } from './BaseLayout';
import { utilityBillingLayoutConfig } from '../config/utilityBillingNavConfig';

interface UtilityBillingLayoutProps {
  children: React.ReactNode;
}

export function UtilityBillingLayout({ children }: UtilityBillingLayoutProps) {
  return <BaseLayout config={utilityBillingLayoutConfig}>{children}</BaseLayout>;
}
