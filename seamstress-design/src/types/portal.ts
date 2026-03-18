/**
 * Type definitions for portal components
 */

export interface CityAccount {
  id: string;
  accountNumber: string;
  nickname?: string;
  type: 'utilities' | 'permits' | 'licenses' | 'taxes' | 'parks' | 'other';
  ownership: 'individual' | 'business';
  vendorPortalEnabled: boolean;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  balance: number;
  lastActivity: string;
  primaryContact?: {
    name: string;
    email: string;
    phone: string;
  };
}

export type AccountFilterType = 'all' | CityAccount['type'];
export type AccountStatusType = 'all' | CityAccount['status'];
export type AccountOwnershipType = 'all' | CityAccount['ownership'];

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  bankName?: string;
  expiry?: string;
  isDefault: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}