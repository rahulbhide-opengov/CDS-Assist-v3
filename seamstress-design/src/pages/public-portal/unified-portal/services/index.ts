/**
 * Unified Public Portal - Service Exports
 * 
 * This module exports all services for the Unified Public Portal.
 */

// API Services
export { default as api, authService, userService, entityService, dashboardService, billingService, paymentService, applicationService, documentService, notificationService, searchService } from './api';

// Workflow Engine
export { workflowEngine, WorkflowEngine, PERMIT_WORKFLOW, LICENSE_WORKFLOW, GRANT_WORKFLOW } from './workflow/WorkflowEngine';
export type { WorkflowDefinition, WorkflowState, TaskDefinition, WorkflowTransition, WorkflowInstance, WorkflowTaskInstance } from './workflow/WorkflowEngine';

// Notification Engine
export { notificationEngine, NotificationEngine, NOTIFICATION_TEMPLATES } from './notifications/NotificationEngine';
export type { NotificationTemplate, NotificationRequest, NotificationResult, UserNotificationPreferences } from './notifications/NotificationEngine';

// Legacy Integration Adapters
export { AdapterFactory, UtilityCISAdapter, PropertyTaxAdapter, PermittingAdapter, PaymentProcessorAdapter, GISAdapter } from './integrations/LegacyAdapters';
export type { AdapterConfig, AdapterResponse, UtilityAccount, UtilityBill, PropertyRecord, PropertyTaxBill, PermitRecord, PaymentTransaction, AddressRecord } from './integrations/LegacyAdapters';

