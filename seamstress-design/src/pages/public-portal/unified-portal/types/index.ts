/**
 * Unified Public Portal - Core Type Definitions
 * 
 * These types define the data structures used throughout the portal.
 * They map directly to the database schema and API contracts.
 */

// ============================================
// ENUMS
// ============================================

export type EntityType = 'household' | 'business' | 'organization' | 'school' | 'vendor';

export type EntityStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export type RoleType = 'owner' | 'admin' | 'member' | 'delegate' | 'viewer';

export type BillStatus = 'draft' | 'issued' | 'due' | 'overdue' | 'paid' | 'partial' | 'cancelled' | 'refunded';

export type BillCategory = 
  | 'utility' 
  | 'permit' 
  | 'license' 
  | 'property_tax' 
  | 'business_tax' 
  | 'sales_tax' 
  | 'assessment' 
  | 'grant' 
  | 'vendor' 
  | 'parks_and_rec'
  | 'citation'
  | 'other'
  | 'misc';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'pending_info' 
  | 'pending_payment'
  | 'pending_inspection' 
  | 'approved' 
  | 'denied' 
  | 'withdrawn' 
  | 'expired';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled';

export type PaymentMethodType = 'credit_card' | 'debit_card' | 'ach' | 'apple_pay' | 'google_pay' | 'check' | 'cash';

export type DocumentStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export type TaskStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'inApp';

export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'read';

// ============================================
// CORE INTERFACES
// ============================================

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  preferredLanguage: string;
  mfaEnabled: boolean;
  emailVerifiedAt?: string;
  phoneVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Entity {
  id: string;
  entityType: EntityType;
  displayName: string;
  status: EntityStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface EntityRole {
  id: string;
  userId: string;
  entityId: string;
  roleType: RoleType;
  permissions: Permission[];
  delegatedBy?: string;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

// ============================================
// ENTITY TYPE INTERFACES
// ============================================

export interface Household extends Entity {
  entityType: 'household';
  memberCount: number;
  householdType?: string;
  isSenior: boolean;
  isVeteran: boolean;
  incomeBracket?: string;
}

export interface Business extends Entity {
  entityType: 'business';
  ein?: string;
  businessName: string;
  dbaName?: string;
  businessType?: string;
  licenseNumber?: string;
  licenseExpiry?: string;
  naicsCode?: string;
  employeeCount?: number;
}

export interface Organization extends Entity {
  entityType: 'organization';
  ein?: string;
  orgName: string;
  orgType?: string;
  c501Type?: string;
  missionStatement?: string;
  taxExemptSince?: string;
}

export interface School extends Entity {
  entityType: 'school';
  schoolName: string;
  districtId?: string;
  schoolType?: string;
  gradeLevels?: string;
  enrollment?: number;
  principalName?: string;
}

export interface Vendor extends Entity {
  entityType: 'vendor';
  vendorNumber: string;
  vendorName: string;
  vendorType?: string;
  certifications: VendorCertification[];
  paymentTerms?: string;
  isActive: boolean;
  registeredSince?: string;
}

export interface VendorCertification {
  type: string;
  number?: string;
  issuedBy?: string;
  expiresAt?: string;
}

// ============================================
// ADDRESS
// ============================================

export interface Address {
  id: string;
  entityId: string;
  addressType: string;
  streetLine1: string;
  streetLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  parcelId?: string;
  geoLocation?: GeoPoint;
  isPrimary: boolean;
  verifiedAt?: string;
  createdAt: string;
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

// ============================================
// BILLING
// ============================================

export interface BillType {
  id: string;
  code: string;
  name: string;
  category: BillCategory;
  department?: string;
  feeStructure: Record<string, unknown>;
  glCode?: string;
  isActive: boolean;
}

export interface Bill {
  id: string;
  entityId: string;
  billTypeId: string;
  billType?: BillType;
  billNumber: string;
  status: BillStatus;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  periodStart?: string;
  periodEnd?: string;
  metadata: Record<string, unknown>;
  lineItems?: BillLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BillLineItem {
  id: string;
  billId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  glCode?: string;
  sortOrder: number;
}

// ============================================
// APPLICATIONS & WORKFLOWS
// ============================================

export interface ApplicationType {
  id: string;
  code: string;
  name: string;
  category: string;
  department?: string;
  requiredDocuments: DocumentRequirement[];
  workflowDefinition: WorkflowDefinition;
  baseFee: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface DocumentRequirement {
  documentTypeCode: string;
  isRequired: boolean;
  description?: string;
}

export interface WorkflowDefinition {
  steps: WorkflowStep[];
  initialStep: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'review' | 'approval' | 'inspection' | 'payment' | 'notification';
  assignTo?: string;
  nextSteps: { condition?: string; stepId: string }[];
}

export interface Application {
  id: string;
  entityId: string;
  submittedBy: string;
  applicationTypeId: string;
  applicationType?: ApplicationType;
  applicationNumber: string;
  status: ApplicationStatus;
  formData: Record<string, unknown>;
  feeAmount: number;
  feePaid: number;
  submittedAt?: string;
  approvedAt?: string;
  expiresAt?: string;
  documents?: ApplicationDocument[];
  tasks?: WorkflowTask[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationDocument {
  id: string;
  applicationId: string;
  documentId: string;
  document?: Document;
  requirementType: string;
  status: DocumentStatus;
  notes?: string;
  createdAt: string;
}

export interface WorkflowTask {
  id: string;
  applicationId: string;
  name: string;
  type: 'review' | 'approval' | 'inspection' | 'payment' | 'notification' | 'document_upload' | 'custom';
  assignedTo?: string;
  taskType?: string;
  status: TaskStatus;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  taskData?: Record<string, unknown>;
  dueDate?: string;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
  createdAt?: string;
}

// ============================================
// PAYMENTS
// ============================================

export interface PaymentMethod {
  id: string;
  userId: string;
  methodType: PaymentMethodType;
  nickname?: string;
  lastFour?: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
  isAutopay: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  entityId: string;
  userId: string;
  paymentMethodId?: string;
  paymentMethod?: PaymentMethod;
  paymentNumber: string;
  status: PaymentStatus;
  amount: number;
  feeAmount: number;
  processorReference?: string;
  processorStatus?: string;
  allocations?: PaymentAllocation[];
  processedAt?: string;
  refundedAt?: string;
  createdAt: string;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  billId: string;
  bill?: Bill;
  amount: number;
  createdAt: string;
}

export interface PaymentPlan {
  id: string;
  entityId: string;
  bills: string[];
  totalAmount: number;
  downPayment: number;
  installments: PaymentInstallment[];
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  createdAt: string;
}

export interface PaymentInstallment {
  id: string;
  planId: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  paymentId?: string;
}

// ============================================
// DOCUMENTS
// ============================================

export interface DocumentType {
  id: string;
  code: string;
  name: string;
  category?: string;
  retentionDays: number;
  requiresExpiry: boolean;
  isActive: boolean;
}

export interface Document {
  id: string;
  entityId: string;
  uploadedBy: string;
  documentTypeId?: string;
  documentType?: DocumentType;
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  storagePath: string;
  status: DocumentStatus;
  expiryDate?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface NotificationPreference {
  id: string;
  userId: string;
  notificationType: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  settings: Record<string, unknown>;
}

export interface Notification {
  id: string;
  userId: string;
  notificationType: string;
  subject: string;
  body: string;
  data: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
}

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardSummary {
  totalDue: number;
  upcomingDeadlines: Deadline[];
  recentActivity: ActivityItem[];
  actionItems: ActionItem[];
  billsByCategory: BillCategorySummary[];
  applicationsByStatus: ApplicationStatusSummary[];
}

export interface Deadline {
  id: string;
  type: 'bill' | 'application' | 'document' | 'license';
  title: string;
  dueDate: string;
  amount?: number;
  status: string;
  link: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

export interface ActionItem {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  dueDate?: string;
  link: string;
}

export interface BillCategorySummary {
  category: BillCategory;
  label: string;
  count: number;
  totalDue: number;
}

export interface ApplicationStatusSummary {
  status: ApplicationStatus;
  label: string;
  count: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, unknown>;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  entities: EntityWithRole[];
  activeEntity: EntityWithRole | null;
  token: string | null;
  loading: boolean;
}

export interface EntityWithRole extends Entity {
  role: EntityRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  entityType?: EntityType;
  entityName?: string;
}

export interface LoginResponse {
  user: User;
  entities: EntityWithRole[];
  token: string;
  refreshToken: string;
  expiresAt: string;
}

