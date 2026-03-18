/**
 * Mock data for Account Validation prototype
 */

import type {
  Account,
  Customer,
  ServiceAddress,
  Service,
} from '../../types/utility-billing/ValidationTypes';
import {
  AccountStatus,
  ServiceStatus,
} from '../../types/utility-billing/ValidationTypes';

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    customerNumber: '#14-0000-04',
    name: 'Austin Brown',
    email: 'abrown@opengov.com',
    phone: '+1 (302) 123-4567',
    mailingAddress: '896 Main St, Newark, DE 19711',
    dateOfBirth: '01/01/1990',
    customerType: 'individual',
    attributes: ['Senior Citizen', 'Veteran', 'Tag'],
  },
  {
    id: 'cust-002',
    customerNumber: '#14-0000-03',
    name: 'Austin Brown',
    email: 'abrown@gmail.com',
    phone: '+1 (302) 456-7890',
    mailingAddress: '232 Main St, Newark, DE',
    customerType: 'individual',
  },
  {
    id: 'cust-003',
    customerNumber: '#14-0000-06',
    name: 'Austin Brown',
    email: 'austin@me.com',
    phone: '+1 (302) 789-0123',
    mailingAddress: '5 Apple St, Newark, DE',
    customerType: 'individual',
  },
  {
    id: 'cust-004',
    customerNumber: 'landlord-001',
    name: 'John Smith',
    email: 'jsmith@properties.com',
    phone: '+1 (302) 555-0001',
    mailingAddress: '552 Main St, Newark, DE 19711',
    customerType: 'business',
  },
  {
    id: 'cust-005',
    customerNumber: '#14-0000-08',
    name: 'Sarah Johnson',
    email: 'sjohnson@email.com',
    phone: '+1 (302) 234-5678',
    mailingAddress: '1200 Elm Street, Newark, DE 19711',
    dateOfBirth: '05/15/1985',
    customerType: 'individual',
    attributes: ['Senior Citizen'],
  },
  {
    id: 'cust-006',
    customerNumber: '#15-0000-02',
    name: 'Delaware Coffee Roasters',
    email: 'info@delcoffee.com',
    phone: '+1 (302) 345-6789',
    mailingAddress: '450 Oak Avenue, Newark, DE 19702',
    customerType: 'business',
  },
  {
    id: 'cust-007',
    customerNumber: '#14-0000-09',
    name: 'Michael Chen',
    email: 'mchen@yahoo.com',
    phone: '+1 (302) 456-7891',
    mailingAddress: '789 Maple Drive, Newark, DE 19711',
    dateOfBirth: '08/22/1992',
    customerType: 'individual',
  },
  {
    id: 'cust-008',
    customerNumber: '#14-0000-10',
    name: 'Emily Martinez',
    email: 'emartinez@outlook.com',
    phone: '+1 (302) 567-8901',
    mailingAddress: '321 Pine Street, Newark, DE 19702',
    dateOfBirth: '11/30/1978',
    customerType: 'individual',
    attributes: ['Veteran'],
  },
  {
    id: 'cust-009',
    customerNumber: '#15-0000-03',
    name: 'Newark Auto Repair LLC',
    email: 'service@newarkauto.com',
    phone: '+1 (302) 678-9012',
    mailingAddress: '555 Industrial Blvd, Newark, DE 19711',
    customerType: 'business',
  },
  {
    id: 'cust-010',
    customerNumber: '#14-0000-11',
    name: 'David Thompson',
    email: 'dthompson@gmail.com',
    phone: '+1 (302) 789-0123',
    mailingAddress: '1024 Cedar Lane, Newark, DE 19702',
    dateOfBirth: '03/10/1988',
    customerType: 'individual',
  },
  {
    id: 'cust-011',
    customerNumber: '#14-0000-12',
    name: 'Jennifer Williams',
    email: 'jwilliams@protonmail.com',
    phone: '+1 (302) 890-1234',
    mailingAddress: '678 Birch Road, Newark, DE 19711',
    dateOfBirth: '07/25/1995',
    customerType: 'individual',
    attributes: ['Tag'],
  },
  {
    id: 'cust-012',
    customerNumber: '#15-0000-04',
    name: 'Main Street Bakery',
    email: 'orders@mainstreetbakery.com',
    phone: '+1 (302) 901-2345',
    mailingAddress: '234 Main St, Newark, DE 19711',
    customerType: 'business',
  },
  {
    id: 'cust-013',
    customerNumber: '#14-0000-13',
    name: 'Robert Anderson',
    email: 'randerson@icloud.com',
    phone: '+1 (302) 012-3456',
    mailingAddress: '890 Walnut Avenue, Newark, DE 19702',
    dateOfBirth: '12/05/1982',
    customerType: 'individual',
    attributes: ['Senior Citizen', 'Veteran'],
  },
  {
    id: 'cust-014',
    customerNumber: '#14-0000-14',
    name: 'Lisa Rodriguez',
    email: 'lrodriguez@hotmail.com',
    phone: '+1 (302) 123-4568',
    mailingAddress: '1456 Cherry Street, Newark, DE 19711',
    dateOfBirth: '04/18/1990',
    customerType: 'individual',
  },
];

// Mock Service Addresses
export const mockServiceAddresses: ServiceAddress[] = [
  {
    id: 'addr-001',
    serviceAddressNumber: '123456',
    address: '896 Main St, Newark, DE 19711',
    city: 'Newark',
    state: 'DE',
    zipCode: '19711',
    billingCycle: 'Cycle 1',
    route: 'Route 1',
  },
  {
    id: 'addr-002',
    serviceAddressNumber: '123457',
    address: '232 Main St, Newark, DE',
    city: 'Newark',
    state: 'DE',
    zipCode: '19711',
    billingCycle: 'Cycle 1',
    route: 'Route 1',
  },
  {
    id: 'addr-003',
    serviceAddressNumber: '123458',
    address: '5 Apple St, Newark, DE 19711',
    city: 'Newark',
    state: 'DE',
    zipCode: '19711',
    billingCycle: 'Cycle 2',
    route: 'Route 2',
  },
  {
    id: 'addr-004',
    serviceAddressNumber: '123459',
    address: '552 Main St, Newark, DE 19711',
    city: 'Newark',
    state: 'DE',
    zipCode: '19711',
    billingCycle: 'Cycle 1',
    route: 'Route 1',
  },
  {
    id: 'addr-005',
    serviceAddressNumber: '123460',
    address: '1200 Elm Street, Newark, DE 19711',
    city: 'Newark',
    state: 'DE',
    zipCode: '19711',
    billingCycle: 'Cycle 3',
    route: 'Route 3',
  },
  {
    id: 'addr-006',
    serviceAddressNumber: '123461',
    address: '450 Oak Avenue, Newark, DE 19702',
    city: 'Newark',
    state: 'DE',
    zipCode: '19702',
    billingCycle: 'Cycle 2',
    route: 'Route 2',
  },
];

// Mock Services (Available for selection)
export const mockAvailableServices: Omit<Service, 'id' | 'accountId'>[] = [
  {
    serviceCode: 'WATER',
    serviceName: 'Water',
    rateCode: 'RES',
    rateName: 'Residential',
    status: ServiceStatus.New,
    startDate: null,
    endDate: null,
  },
  {
    serviceCode: 'SEWER',
    serviceName: 'Sewer',
    rateCode: 'RES',
    rateName: 'Residential',
    status: ServiceStatus.New,
    startDate: null,
    endDate: null,
  },
  {
    serviceCode: 'TRASH',
    serviceName: 'Trash',
    rateCode: 'RES',
    rateName: 'Residential',
    status: ServiceStatus.New,
    startDate: null,
    endDate: null,
  },
  {
    serviceCode: 'RECYCLE',
    serviceName: 'Recycling',
    rateCode: 'RES',
    rateName: 'Residential',
    status: ServiceStatus.New,
    startDate: null,
    endDate: null,
  },
  {
    serviceCode: 'STORMWATER',
    serviceName: 'Stormwater',
    rateCode: 'RES',
    rateName: 'Residential',
    status: ServiceStatus.New,
    startDate: null,
    endDate: null,
  },
  {
    serviceCode: 'GAS',
    serviceName: 'Gas',
    rateCode: 'RES',
    rateName: 'Residential',
    status: ServiceStatus.New,
    startDate: null,
    endDate: null,
  },
];

// Mock Accounts (Existing accounts for validation)
export const mockAccounts: Account[] = [
  // Landlord account at 896 Main St
  {
    id: 'acc-001',
    accountNumber: '1-123-1',
    customerId: 'cust-004',
    customerName: 'John Smith',
    customerEmail: 'jsmith@properties.com',
    serviceAddressId: 'addr-001',
    serviceAddress: '896 Main St, Newark, DE 19711',
    status: AccountStatus.Active,
    balance: 245.67,
    startDate: '2024-01-01',
    accountClass: 'Residential',
    billingCycle: 'Cycle 1',
    route: 'Route 1',
    services: [
      {
        id: 'svc-001',
        serviceCode: 'TRASH',
        serviceName: 'Trash',
        rateCode: 'RES',
        rateName: 'Residential',
        status: ServiceStatus.Active,
        startDate: '2024-01-01',
        endDate: null,
        accountId: 'acc-001',
        serviceAddressId: 'addr-001',
      },
      {
        id: 'svc-002',
        serviceCode: 'RECYCLE',
        serviceName: 'Recycling',
        rateCode: 'RES',
        rateName: 'Residential',
        status: ServiceStatus.Active,
        startDate: '2024-01-01',
        endDate: null,
        accountId: 'acc-001',
        serviceAddressId: 'addr-001',
      },
    ],
  },
  // Austin Brown's other accounts
  {
    id: 'acc-002',
    accountNumber: '1-456-1',
    customerId: 'cust-002',
    customerName: 'Austin Brown',
    customerEmail: 'abrown@gmail.com',
    serviceAddressId: 'addr-002',
    serviceAddress: '232 Main St, Newark, DE',
    status: AccountStatus.Active,
    balance: 178.50,
    startDate: '2023-06-15',
    accountClass: 'Residential',
    services: [
      {
        id: 'svc-003',
        serviceCode: 'WATER',
        serviceName: 'Water',
        rateCode: 'RES',
        rateName: 'Residential',
        status: ServiceStatus.Active,
        startDate: '2023-06-15',
        endDate: null,
        meterNumber: '123456',
        serialNumber: 'SR124567',
        numberOfUnits: 100,
      },
      {
        id: 'svc-004',
        serviceCode: 'SEWER',
        serviceName: 'Sewer',
        rateCode: 'RES',
        rateName: 'Residential',
        status: ServiceStatus.Active,
        startDate: '2023-06-15',
        endDate: null,
      },
    ],
  },
  {
    id: 'acc-003',
    accountNumber: '1-789-1',
    customerId: 'cust-003',
    customerName: 'Austin Brown',
    customerEmail: 'austin@me.com',
    serviceAddressId: 'addr-002',
    serviceAddress: '5 Apple St, Newark, DE',
    status: AccountStatus.Final,
    balance: 0,
    startDate: '2022-01-01',
    accountClass: 'Residential',
    services: [
      {
        id: 'svc-005',
        serviceCode: 'WATER',
        serviceName: 'Water',
        rateCode: 'RES',
        rateName: 'Residential',
        status: ServiceStatus.Inactive,
        startDate: '2022-01-01',
        endDate: '2023-12-31',
      },
    ],
  },
];

// Mock validation functions
export const validateCustomer = (customerName: string): Account[] => {
  return mockAccounts.filter(acc =>
    acc.customerName.toLowerCase().includes(customerName.toLowerCase())
  );
};

export const validateServiceAddress = (serviceAddressId: string): Account[] => {
  return mockAccounts
    .filter(acc => acc.serviceAddressId === serviceAddressId)
    .sort((a, b) => {
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
      return priorityMap[a.status] - priorityMap[b.status];
    });
};

export const searchCustomers = (query: string): Customer[] => {
  // If no query, return empty array (only show results when searching)
  if (!query.trim()) return [];

  return mockCustomers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email?.toLowerCase().includes(query.toLowerCase()) ||
    c.customerNumber?.toLowerCase().includes(query.toLowerCase()) ||
    c.mailingAddress?.toLowerCase().includes(query.toLowerCase())
  );
};

export const searchServiceAddresses = (query: string): ServiceAddress[] => {
  // If no query, return empty array (only show results when searching)
  if (!query.trim()) return [];

  return mockServiceAddresses.filter(addr =>
    addr.address.toLowerCase().includes(query.toLowerCase()) ||
    addr.serviceAddressNumber.includes(query) ||
    addr.city.toLowerCase().includes(query.toLowerCase()) ||
    addr.zipCode.includes(query)
  );
};
