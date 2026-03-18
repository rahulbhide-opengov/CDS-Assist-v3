/**
 * Type definitions for UB Account Validation
 * Updated: 2026-01-12
 */

// Service Status Enum
export enum ServiceStatus {
  New = 'new',
  Active = 'active',
  Disconnect = 'disconnect',
  Inactive = 'inactive',
}

// Account Status Enum
export enum AccountStatus {
  New = 'new',
  Active = 'active',
  ActiveCutoff = 'active-cutoff',
  ActiveHold = 'active-hold',
  ActivePendingDisconnect = 'active-pending-disconnect',
  Disconnect = 'disconnect',
  Collections = 'collections',
  Final = 'final',
  Inactive = 'inactive',
}

// Service interface
export interface Service {
  id: string;
  serviceCode: string;
  serviceName: string;
  rateCode: string;
  rateName: string;
  status: ServiceStatus;
  startDate: string | null;
  endDate: string | null;
  meterNumber?: string;
  serialNumber?: string;
  numberOfUnits?: number;
  accountId?: string;
  serviceAddressId?: string;
}

// Account interface
export interface Account {
  id: string;
  accountNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  serviceAddressId: string;
  serviceAddress: string;
  status: AccountStatus;
  balance: number;
  startDate: string;
  accountClass: string;
  billingCycle?: string;
  route?: string;
  services: Service[];
}

// Customer interface
export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email?: string;
  phone?: string;
  mailingAddress?: string;
  dateOfBirth?: string;
  customerType: 'individual' | 'business';
  attributes?: string[];
}

// Service Address interface
export interface ServiceAddress {
  id: string;
  serviceAddressNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  billingCycle: string;
  route: string;
}

// Validation Result
export interface ValidationResult {
  isValid: boolean;
  warnings: ValidationWarning[];
  errors: ValidationError[];
  conflicts: ServiceConflict[];
}

export interface ValidationWarning {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ServiceConflict {
  serviceCode: string;
  serviceName: string;
  rateCode: string;
  rateName: string;
  conflictingAccountNumber: string;
  conflictingAccountCustomerName: string;
  conflictingAccountStatus: AccountStatus;
  conflictingServiceStatus: ServiceStatus;
  conflictingServiceEndDate?: string;
  canProceed: boolean;
  message: string;
}

// Create Account Form Data
export interface CreateAccountFormData {
  accountNumber: string;
  startDate: string;
  accountClass: string;
  customerId: string;
  customerName: string;
  serviceAddressId: string;
  serviceAddress: string;
  services: Service[];
  acknowledgedWarnings: boolean;
}

// Status color mapping
export const getAccountStatusColor = (status: AccountStatus): string => {
  const colorMap: Record<AccountStatus, string> = {
    [AccountStatus.New]: '#3B82F6',
    [AccountStatus.Active]: '#10B981',
    [AccountStatus.ActiveCutoff]: '#F97316',
    [AccountStatus.ActiveHold]: '#EAB308',
    [AccountStatus.ActivePendingDisconnect]: '#FB7185',
    [AccountStatus.Disconnect]: '#EF4444',
    [AccountStatus.Collections]: '#A855F7',
    [AccountStatus.Final]: '#6B7280',
    [AccountStatus.Inactive]: '#9CA3AF',
  };
  return colorMap[status];
};

export const getServiceStatusColor = (status: ServiceStatus): string => {
  const colorMap: Record<ServiceStatus, string> = {
    [ServiceStatus.New]: '#3B82F6',
    [ServiceStatus.Active]: '#10B981',
    [ServiceStatus.Disconnect]: '#F97316',
    [ServiceStatus.Inactive]: '#9CA3AF',
  };
  return colorMap[status];
};

// Status priority for sorting
export const getAccountStatusPriority = (status: AccountStatus): number => {
  const priorityMap: Record<AccountStatus, number> = {
    [AccountStatus.New]: 1,
    [AccountStatus.Active]: 2,
    [AccountStatus.ActiveCutoff]: 3,
    [AccountStatus.ActiveHold]: 4,
    [AccountStatus.ActivePendingDisconnect]: 5,
    [AccountStatus.Disconnect]: 6,
    [AccountStatus.Collections]: 7,
    [AccountStatus.Final]: 8,
    [AccountStatus.Inactive]: 9,
  };
  return priorityMap[status];
};

// Check if account status requires warning
export const requiresWarning = (status: AccountStatus): boolean => {
  return [
    AccountStatus.New,
    AccountStatus.Active,
    AccountStatus.ActiveCutoff,
    AccountStatus.ActiveHold,
    AccountStatus.ActivePendingDisconnect,
    AccountStatus.Disconnect,
  ].includes(status);
};
