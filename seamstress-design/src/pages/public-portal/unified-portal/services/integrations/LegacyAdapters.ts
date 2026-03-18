/**
 * Legacy System Integration Adapters
 * 
 * Adapters for connecting to existing government systems:
 * - Utility CIS (Customer Information System)
 * - Property Tax System
 * - Permitting System
 * - Business License System
 * - Payment Processors
 * - Vendor Procurement
 * - Parks & Recreation
 * - GIS/Address Systems
 * - ERP/Financial System
 * 
 * Each adapter implements a common interface pattern for:
 * - Connection management
 * - Data transformation
 * - Error handling
 * - Retry logic
 * - Logging/auditing
 */

// ============================================
// BASE ADAPTER INTERFACE
// ============================================

export interface AdapterConfig {
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface AdapterResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  metadata?: {
    requestId: string;
    timestamp: string;
    responseTime: number;
  };
}

export abstract class BaseLegacyAdapter {
  protected config: AdapterConfig;
  protected systemName: string;

  constructor(systemName: string, config: AdapterConfig) {
    this.systemName = systemName;
    this.config = {
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config,
    };
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: unknown
  ): Promise<AdapterResponse<T>> {
    const startTime = Date.now();
    const requestId = `${this.systemName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= (this.config.retryAttempts || 3); attempt++) {
      try {
        const response = await this.executeRequest<T>(method, endpoint, data, requestId);
        return {
          success: true,
          data: response,
          metadata: {
            requestId,
            timestamp: new Date().toISOString(),
            responseTime: Date.now() - startTime,
          },
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`[${this.systemName}] Request failed (attempt ${attempt}):`, error);
        
        if (attempt < (this.config.retryAttempts || 3)) {
          await this.delay(this.config.retryDelay || 1000);
        }
      }
    }

    return {
      success: false,
      error: {
        code: 'ADAPTER_ERROR',
        message: lastError?.message || 'Unknown error occurred',
      },
      metadata: {
        requestId,
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime,
      },
    };
  }

  protected abstract executeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown,
    requestId: string
  ): Promise<T>;

  protected delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  abstract healthCheck(): Promise<boolean>;
}

// ============================================
// UTILITY CIS ADAPTER
// ============================================

export interface UtilityAccount {
  accountNumber: string;
  serviceAddress: string;
  customerName: string;
  status: 'active' | 'inactive' | 'suspended';
  services: {
    type: 'water' | 'sewer' | 'trash' | 'electric' | 'gas';
    status: 'active' | 'inactive';
    meterNumber?: string;
  }[];
  balance: number;
  lastPayment?: {
    date: string;
    amount: number;
  };
}

export interface UtilityBill {
  billNumber: string;
  accountNumber: string;
  serviceAddress: string;
  billingPeriod: {
    start: string;
    end: string;
  };
  dueDate: string;
  charges: {
    service: string;
    description: string;
    amount: number;
  }[];
  totalAmount: number;
  amountDue: number;
  status: 'pending' | 'paid' | 'partial' | 'overdue';
}

export class UtilityCISAdapter extends BaseLegacyAdapter {
  constructor(config: AdapterConfig) {
    super('UTILITY_CIS', config);
  }

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown,
    requestId: string
  ): Promise<T> {
    // Simulated implementation - replace with actual API calls
    console.log(`[${this.systemName}] ${method} ${endpoint}`, { requestId, data });
    
    // Mock response for development
    return {} as T;
  }

  async healthCheck(): Promise<boolean> {
    const response = await this.request<{ status: string }>('GET', '/health');
    return response.success;
  }

  async getAccount(accountNumber: string): Promise<AdapterResponse<UtilityAccount>> {
    return this.request<UtilityAccount>('GET', `/accounts/${accountNumber}`);
  }

  async getAccountByAddress(address: string): Promise<AdapterResponse<UtilityAccount[]>> {
    return this.request<UtilityAccount[]>('GET', `/accounts/search?address=${encodeURIComponent(address)}`);
  }

  async getBills(accountNumber: string, options?: { from?: string; to?: string }): Promise<AdapterResponse<UtilityBill[]>> {
    const params = new URLSearchParams();
    if (options?.from) params.append('from', options.from);
    if (options?.to) params.append('to', options.to);
    return this.request<UtilityBill[]>('GET', `/accounts/${accountNumber}/bills?${params}`);
  }

  async getCurrentBill(accountNumber: string): Promise<AdapterResponse<UtilityBill>> {
    return this.request<UtilityBill>('GET', `/accounts/${accountNumber}/bills/current`);
  }

  async postPayment(accountNumber: string, payment: {
    amount: number;
    paymentMethod: string;
    transactionId: string;
  }): Promise<AdapterResponse<{ confirmationNumber: string }>> {
    return this.request('POST', `/accounts/${accountNumber}/payments`, payment);
  }

  async getUsageHistory(accountNumber: string, serviceType: string): Promise<AdapterResponse<{
    period: string;
    usage: number;
    unit: string;
  }[]>> {
    return this.request('GET', `/accounts/${accountNumber}/usage/${serviceType}`);
  }
}

// ============================================
// PROPERTY TAX ADAPTER
// ============================================

export interface PropertyRecord {
  parcelId: string;
  address: string;
  ownerName: string;
  ownerAddress: string;
  legalDescription: string;
  propertyClass: string;
  assessedValue: {
    land: number;
    improvements: number;
    total: number;
    year: number;
  };
  taxRate: number;
  exemptions: {
    type: string;
    amount: number;
  }[];
}

export interface PropertyTaxBill {
  billNumber: string;
  parcelId: string;
  taxYear: number;
  installment: number;
  totalInstallments: number;
  dueDate: string;
  assessedValue: number;
  taxRate: number;
  grossTax: number;
  exemptions: number;
  netTax: number;
  penalties: number;
  interest: number;
  totalDue: number;
  status: 'pending' | 'paid' | 'partial' | 'delinquent';
}

export class PropertyTaxAdapter extends BaseLegacyAdapter {
  constructor(config: AdapterConfig) {
    super('PROPERTY_TAX', config);
  }

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown,
    requestId: string
  ): Promise<T> {
    console.log(`[${this.systemName}] ${method} ${endpoint}`, { requestId, data });
    return {} as T;
  }

  async healthCheck(): Promise<boolean> {
    const response = await this.request<{ status: string }>('GET', '/health');
    return response.success;
  }

  async getProperty(parcelId: string): Promise<AdapterResponse<PropertyRecord>> {
    return this.request<PropertyRecord>('GET', `/properties/${parcelId}`);
  }

  async searchProperties(query: {
    address?: string;
    ownerName?: string;
    parcelId?: string;
  }): Promise<AdapterResponse<PropertyRecord[]>> {
    const params = new URLSearchParams();
    if (query.address) params.append('address', query.address);
    if (query.ownerName) params.append('owner', query.ownerName);
    if (query.parcelId) params.append('parcel', query.parcelId);
    return this.request<PropertyRecord[]>('GET', `/properties/search?${params}`);
  }

  async getTaxBills(parcelId: string, year?: number): Promise<AdapterResponse<PropertyTaxBill[]>> {
    const params = year ? `?year=${year}` : '';
    return this.request<PropertyTaxBill[]>('GET', `/properties/${parcelId}/taxes${params}`);
  }

  async getCurrentTaxBill(parcelId: string): Promise<AdapterResponse<PropertyTaxBill>> {
    return this.request<PropertyTaxBill>('GET', `/properties/${parcelId}/taxes/current`);
  }

  async postPayment(parcelId: string, payment: {
    billNumber: string;
    amount: number;
    transactionId: string;
  }): Promise<AdapterResponse<{ confirmationNumber: string; receiptUrl: string }>> {
    return this.request('POST', `/properties/${parcelId}/payments`, payment);
  }

  async getPaymentHistory(parcelId: string): Promise<AdapterResponse<{
    date: string;
    amount: number;
    billNumber: string;
    confirmationNumber: string;
  }[]>> {
    return this.request('GET', `/properties/${parcelId}/payments`);
  }
}

// ============================================
// PERMITTING SYSTEM ADAPTER
// ============================================

export interface PermitRecord {
  permitNumber: string;
  permitType: string;
  status: string;
  applicationDate: string;
  issueDate?: string;
  expirationDate?: string;
  address: string;
  parcelId: string;
  applicantName: string;
  contractorName?: string;
  projectDescription: string;
  estimatedCost: number;
  fees: {
    type: string;
    amount: number;
    paid: boolean;
  }[];
  inspections: {
    type: string;
    scheduledDate?: string;
    completedDate?: string;
    result?: string;
    inspector?: string;
    notes?: string;
  }[];
}

export class PermittingAdapter extends BaseLegacyAdapter {
  constructor(config: AdapterConfig) {
    super('PERMITTING', config);
  }

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown,
    requestId: string
  ): Promise<T> {
    console.log(`[${this.systemName}] ${method} ${endpoint}`, { requestId, data });
    return {} as T;
  }

  async healthCheck(): Promise<boolean> {
    const response = await this.request<{ status: string }>('GET', '/health');
    return response.success;
  }

  async getPermit(permitNumber: string): Promise<AdapterResponse<PermitRecord>> {
    return this.request<PermitRecord>('GET', `/permits/${permitNumber}`);
  }

  async searchPermits(query: {
    address?: string;
    parcelId?: string;
    applicantName?: string;
    status?: string;
    type?: string;
  }): Promise<AdapterResponse<PermitRecord[]>> {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return this.request<PermitRecord[]>('GET', `/permits/search?${params}`);
  }

  async submitApplication(application: {
    permitType: string;
    address: string;
    parcelId: string;
    applicantInfo: Record<string, unknown>;
    projectDetails: Record<string, unknown>;
  }): Promise<AdapterResponse<{ permitNumber: string; status: string }>> {
    return this.request('POST', '/permits', application);
  }

  async scheduleInspection(permitNumber: string, inspection: {
    type: string;
    requestedDate: string;
    notes?: string;
  }): Promise<AdapterResponse<{ inspectionId: string; scheduledDate: string }>> {
    return this.request('POST', `/permits/${permitNumber}/inspections`, inspection);
  }

  async cancelInspection(permitNumber: string, inspectionId: string): Promise<AdapterResponse<void>> {
    return this.request('DELETE', `/permits/${permitNumber}/inspections/${inspectionId}`);
  }
}

// ============================================
// PAYMENT PROCESSOR ADAPTER
// ============================================

export interface PaymentTransaction {
  transactionId: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  fee: number;
  netAmount: number;
  paymentMethod: {
    type: 'card' | 'ach' | 'check';
    lastFour: string;
    brand?: string;
  };
  createdAt: string;
  completedAt?: string;
  metadata: Record<string, unknown>;
}

export class PaymentProcessorAdapter extends BaseLegacyAdapter {
  constructor(config: AdapterConfig) {
    super('PAYMENT_PROCESSOR', config);
  }

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown,
    requestId: string
  ): Promise<T> {
    console.log(`[${this.systemName}] ${method} ${endpoint}`, { requestId, data });
    return {} as T;
  }

  async healthCheck(): Promise<boolean> {
    const response = await this.request<{ status: string }>('GET', '/health');
    return response.success;
  }

  async processPayment(payment: {
    amount: number;
    currency: string;
    paymentMethodToken: string;
    description: string;
    metadata?: Record<string, unknown>;
  }): Promise<AdapterResponse<PaymentTransaction>> {
    return this.request<PaymentTransaction>('POST', '/transactions', payment);
  }

  async getTransaction(transactionId: string): Promise<AdapterResponse<PaymentTransaction>> {
    return this.request<PaymentTransaction>('GET', `/transactions/${transactionId}`);
  }

  async refundTransaction(transactionId: string, amount?: number): Promise<AdapterResponse<PaymentTransaction>> {
    return this.request<PaymentTransaction>('POST', `/transactions/${transactionId}/refund`, { amount });
  }

  async createPaymentMethod(data: {
    type: 'card' | 'ach';
    cardNumber?: string;
    expMonth?: number;
    expYear?: number;
    cvv?: string;
    routingNumber?: string;
    accountNumber?: string;
    accountType?: 'checking' | 'savings';
  }): Promise<AdapterResponse<{ token: string; lastFour: string; brand?: string }>> {
    return this.request('POST', '/payment-methods', data);
  }
}

// ============================================
// GIS/ADDRESS ADAPTER
// ============================================

export interface AddressRecord {
  addressId: string;
  fullAddress: string;
  streetNumber: string;
  streetName: string;
  streetType: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  parcelId?: string;
  latitude: number;
  longitude: number;
  jurisdiction: string;
  councilDistrict?: string;
  zipPlus4?: string;
}

export class GISAdapter extends BaseLegacyAdapter {
  constructor(config: AdapterConfig) {
    super('GIS', config);
  }

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    data: unknown,
    requestId: string
  ): Promise<T> {
    console.log(`[${this.systemName}] ${method} ${endpoint}`, { requestId, data });
    return {} as T;
  }

  async healthCheck(): Promise<boolean> {
    const response = await this.request<{ status: string }>('GET', '/health');
    return response.success;
  }

  async validateAddress(address: string): Promise<AdapterResponse<AddressRecord>> {
    return this.request<AddressRecord>('GET', `/addresses/validate?q=${encodeURIComponent(address)}`);
  }

  async searchAddresses(query: string, limit?: number): Promise<AdapterResponse<AddressRecord[]>> {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', String(limit));
    return this.request<AddressRecord[]>('GET', `/addresses/search?${params}`);
  }

  async getAddressByParcel(parcelId: string): Promise<AdapterResponse<AddressRecord>> {
    return this.request<AddressRecord>('GET', `/parcels/${parcelId}/address`);
  }

  async reverseGeocode(lat: number, lng: number): Promise<AdapterResponse<AddressRecord>> {
    return this.request<AddressRecord>('GET', `/addresses/reverse?lat=${lat}&lng=${lng}`);
  }
}

// ============================================
// ADAPTER FACTORY
// ============================================

export class AdapterFactory {
  private static instances: Map<string, BaseLegacyAdapter> = new Map();

  static getUtilityCIS(config?: AdapterConfig): UtilityCISAdapter {
    const key = 'utility_cis';
    if (!this.instances.has(key)) {
      this.instances.set(key, new UtilityCISAdapter(config || {
        baseUrl: import.meta.env.VITE_UTILITY_CIS_URL || 'http://localhost:8001',
        apiKey: import.meta.env.VITE_UTILITY_CIS_KEY,
      }));
    }
    return this.instances.get(key) as UtilityCISAdapter;
  }

  static getPropertyTax(config?: AdapterConfig): PropertyTaxAdapter {
    const key = 'property_tax';
    if (!this.instances.has(key)) {
      this.instances.set(key, new PropertyTaxAdapter(config || {
        baseUrl: import.meta.env.VITE_PROPERTY_TAX_URL || 'http://localhost:8002',
        apiKey: import.meta.env.VITE_PROPERTY_TAX_KEY,
      }));
    }
    return this.instances.get(key) as PropertyTaxAdapter;
  }

  static getPermitting(config?: AdapterConfig): PermittingAdapter {
    const key = 'permitting';
    if (!this.instances.has(key)) {
      this.instances.set(key, new PermittingAdapter(config || {
        baseUrl: import.meta.env.VITE_PERMITTING_URL || 'http://localhost:8003',
        apiKey: import.meta.env.VITE_PERMITTING_KEY,
      }));
    }
    return this.instances.get(key) as PermittingAdapter;
  }

  static getPaymentProcessor(config?: AdapterConfig): PaymentProcessorAdapter {
    const key = 'payment_processor';
    if (!this.instances.has(key)) {
      this.instances.set(key, new PaymentProcessorAdapter(config || {
        baseUrl: import.meta.env.VITE_PAYMENT_PROCESSOR_URL || 'http://localhost:8004',
        apiKey: import.meta.env.VITE_PAYMENT_PROCESSOR_KEY,
      }));
    }
    return this.instances.get(key) as PaymentProcessorAdapter;
  }

  static getGIS(config?: AdapterConfig): GISAdapter {
    const key = 'gis';
    if (!this.instances.has(key)) {
      this.instances.set(key, new GISAdapter(config || {
        baseUrl: import.meta.env.VITE_GIS_URL || 'http://localhost:8005',
        apiKey: import.meta.env.VITE_GIS_KEY,
      }));
    }
    return this.instances.get(key) as GISAdapter;
  }

  static async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    const adapters = [
      { name: 'utility_cis', adapter: this.getUtilityCIS() },
      { name: 'property_tax', adapter: this.getPropertyTax() },
      { name: 'permitting', adapter: this.getPermitting() },
      { name: 'payment_processor', adapter: this.getPaymentProcessor() },
      { name: 'gis', adapter: this.getGIS() },
    ];

    await Promise.all(
      adapters.map(async ({ name, adapter }) => {
        try {
          results[name] = await adapter.healthCheck();
        } catch {
          results[name] = false;
        }
      })
    );

    return results;
  }
}

export default AdapterFactory;

