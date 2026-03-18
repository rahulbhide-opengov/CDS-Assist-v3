/**
 * Unified Public Portal - API Service Layer
 * 
 * This module provides a type-safe API client for all portal services.
 * It abstracts HTTP calls and provides consistent error handling.
 */

import type {
  User,
  Entity,
  EntityWithRole,
  Bill,
  Application,
  Payment,
  Document,
  Notification,
  DashboardSummary,
  PaymentMethod,
  ApiResponse,
  PaginatedRequest,
  PaginationMeta,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from '../../types';

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
}

// ============================================
// HTTP CLIENT
// ============================================

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  async request<T>(path: string, config: RequestConfig): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path, config.params);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        method: config.method,
        headers,
        body: config.body ? JSON.stringify(config.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: {
            code: data.code || 'UNKNOWN_ERROR',
            message: data.message || 'An unexpected error occurred',
            details: data.details,
          },
        };
      }

      return {
        success: true,
        data: data.data || data,
        meta: data.meta,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error occurred',
        },
      };
    }
  }

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>(path, { method: 'GET', params });
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'POST', body });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PUT', body });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

// Create singleton instance
const apiClient = new ApiClient(API_BASE_URL);

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  },

  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post<LoginResponse>('/auth/register', data);
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post<void>('/auth/logout');
    apiClient.setAuthToken(null);
    return response;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresAt: string }>> {
    return apiClient.post('/auth/refresh', { refreshToken });
  },

  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    return apiClient.post('/auth/reset-password', { token, password });
  },

  async verifyMfa(code: string): Promise<ApiResponse<LoginResponse>> {
    return apiClient.post('/auth/verify-mfa', { code });
  },

  async setupMfa(): Promise<ApiResponse<{ secret: string; qrCode: string }>> {
    return apiClient.post('/auth/setup-mfa');
  },

  setToken(token: string | null) {
    apiClient.setAuthToken(token);
  },
};

// ============================================
// USER SERVICE
// ============================================

export const userService = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/users/me');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.patch('/users/me', data);
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post('/users/me/change-password', { currentPassword, newPassword });
  },

  async getEntities(): Promise<ApiResponse<EntityWithRole[]>> {
    return apiClient.get('/users/me/entities');
  },

  async getNotificationPreferences(): Promise<ApiResponse<Record<string, unknown>>> {
    return apiClient.get('/users/me/notification-preferences');
  },

  async updateNotificationPreferences(preferences: Record<string, unknown>): Promise<ApiResponse<void>> {
    return apiClient.put('/users/me/notification-preferences', preferences);
  },
};

// ============================================
// ENTITY SERVICE
// ============================================

export const entityService = {
  async getEntity(entityId: string): Promise<ApiResponse<Entity>> {
    return apiClient.get(`/entities/${entityId}`);
  },

  async createEntity(data: Partial<Entity>): Promise<ApiResponse<Entity>> {
    return apiClient.post('/entities', data);
  },

  async updateEntity(entityId: string, data: Partial<Entity>): Promise<ApiResponse<Entity>> {
    return apiClient.patch(`/entities/${entityId}`, data);
  },

  async getEntityMembers(entityId: string): Promise<ApiResponse<EntityWithRole[]>> {
    return apiClient.get(`/entities/${entityId}/members`);
  },

  async inviteMember(entityId: string, email: string, role: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/entities/${entityId}/members/invite`, { email, role });
  },

  async removeMember(entityId: string, userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/entities/${entityId}/members/${userId}`);
  },

  async updateMemberRole(entityId: string, userId: string, role: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`/entities/${entityId}/members/${userId}`, { role });
  },
};

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  async getSummary(entityId: string): Promise<ApiResponse<DashboardSummary>> {
    return apiClient.get(`/dashboard/${entityId}/summary`);
  },

  async getActionItems(entityId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get(`/dashboard/${entityId}/action-items`);
  },

  async getDeadlines(entityId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get(`/dashboard/${entityId}/deadlines`);
  },

  async getRecentActivity(entityId: string, limit?: number): Promise<ApiResponse<unknown[]>> {
    return apiClient.get(`/dashboard/${entityId}/activity`, { limit });
  },
};

// ============================================
// BILLING SERVICE
// ============================================

export const billingService = {
  async getBills(entityId: string, params?: PaginatedRequest & { status?: string; category?: string }): Promise<ApiResponse<Bill[]>> {
    return apiClient.get(`/entities/${entityId}/bills`, params as Record<string, string | number | boolean | undefined>);
  },

  async getBill(entityId: string, billId: string): Promise<ApiResponse<Bill>> {
    return apiClient.get(`/entities/${entityId}/bills/${billId}`);
  },

  async getBillTypes(): Promise<ApiResponse<unknown[]>> {
    return apiClient.get('/bill-types');
  },

  async downloadBillPdf(entityId: string, billId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/entities/${entityId}/bills/${billId}/pdf`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.blob();
  },
};

// ============================================
// PAYMENT SERVICE
// ============================================

export const paymentService = {
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return apiClient.get('/payment-methods');
  },

  async addPaymentMethod(data: Partial<PaymentMethod>): Promise<ApiResponse<PaymentMethod>> {
    return apiClient.post('/payment-methods', data);
  },

  async deletePaymentMethod(methodId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/payment-methods/${methodId}`);
  },

  async setDefaultPaymentMethod(methodId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/payment-methods/${methodId}/set-default`);
  },

  async processPayment(data: {
    entityId: string;
    paymentMethodId?: string;
    newPaymentMethod?: Partial<PaymentMethod>;
    allocations: { billId: string; amount: number }[];
    setupAutopay?: boolean;
  }): Promise<ApiResponse<Payment>> {
    return apiClient.post('/payments', data);
  },

  async getPayments(entityId: string, params?: PaginatedRequest): Promise<ApiResponse<Payment[]>> {
    return apiClient.get(`/entities/${entityId}/payments`, params as Record<string, string | number | boolean | undefined>);
  },

  async getPayment(paymentId: string): Promise<ApiResponse<Payment>> {
    return apiClient.get(`/payments/${paymentId}`);
  },

  async refundPayment(paymentId: string, amount?: number): Promise<ApiResponse<Payment>> {
    return apiClient.post(`/payments/${paymentId}/refund`, { amount });
  },

  async createPaymentPlan(data: {
    entityId: string;
    billIds: string[];
    downPayment: number;
    installments: number;
    paymentMethodId: string;
  }): Promise<ApiResponse<unknown>> {
    return apiClient.post('/payment-plans', data);
  },

  async getPaymentPlans(entityId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get(`/entities/${entityId}/payment-plans`);
  },
};

// ============================================
// APPLICATION SERVICE
// ============================================

export const applicationService = {
  async getApplicationTypes(category?: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get('/application-types', { category });
  },

  async getApplicationType(typeId: string): Promise<ApiResponse<unknown>> {
    return apiClient.get(`/application-types/${typeId}`);
  },

  async getApplications(entityId: string, params?: PaginatedRequest & { status?: string; type?: string }): Promise<ApiResponse<Application[]>> {
    return apiClient.get(`/entities/${entityId}/applications`, params as Record<string, string | number | boolean | undefined>);
  },

  async getApplication(applicationId: string): Promise<ApiResponse<Application>> {
    return apiClient.get(`/applications/${applicationId}`);
  },

  async createApplication(entityId: string, data: {
    applicationTypeId: string;
    formData: Record<string, unknown>;
  }): Promise<ApiResponse<Application>> {
    return apiClient.post(`/entities/${entityId}/applications`, data);
  },

  async updateApplication(applicationId: string, data: Partial<Application>): Promise<ApiResponse<Application>> {
    return apiClient.patch(`/applications/${applicationId}`, data);
  },

  async submitApplication(applicationId: string): Promise<ApiResponse<Application>> {
    return apiClient.post(`/applications/${applicationId}/submit`);
  },

  async withdrawApplication(applicationId: string, reason?: string): Promise<ApiResponse<Application>> {
    return apiClient.post(`/applications/${applicationId}/withdraw`, { reason });
  },

  async getApplicationTasks(applicationId: string): Promise<ApiResponse<unknown[]>> {
    return apiClient.get(`/applications/${applicationId}/tasks`);
  },

  async uploadApplicationDocument(applicationId: string, file: File, documentType: string): Promise<ApiResponse<unknown>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    return response.json();
  },
};

// ============================================
// DOCUMENT SERVICE
// ============================================

export const documentService = {
  async getDocuments(entityId: string, params?: PaginatedRequest & { type?: string; status?: string }): Promise<ApiResponse<Document[]>> {
    return apiClient.get(`/entities/${entityId}/documents`, params as Record<string, string | number | boolean | undefined>);
  },

  async getDocument(documentId: string): Promise<ApiResponse<Document>> {
    return apiClient.get(`/documents/${documentId}`);
  },

  async uploadDocument(entityId: string, file: File, data: {
    documentTypeId?: string;
    expiryDate?: string;
    metadata?: Record<string, unknown>;
  }): Promise<ApiResponse<Document>> {
    const formData = new FormData();
    formData.append('file', file);
    if (data.documentTypeId) formData.append('documentTypeId', data.documentTypeId);
    if (data.expiryDate) formData.append('expiryDate', data.expiryDate);
    if (data.metadata) formData.append('metadata', JSON.stringify(data.metadata));

    const response = await fetch(`${API_BASE_URL}/entities/${entityId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    return response.json();
  },

  async deleteDocument(documentId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/documents/${documentId}`);
  },

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.blob();
  },

  async getDocumentTypes(): Promise<ApiResponse<unknown[]>> {
    return apiClient.get('/document-types');
  },

  async getExpiringDocuments(entityId: string, daysAhead?: number): Promise<ApiResponse<Document[]>> {
    return apiClient.get(`/entities/${entityId}/documents/expiring`, { daysAhead });
  },
};

// ============================================
// NOTIFICATION SERVICE
// ============================================

export const notificationService = {
  async getNotifications(params?: PaginatedRequest & { unreadOnly?: boolean }): Promise<ApiResponse<Notification[]>> {
    return apiClient.get('/notifications', params as Record<string, string | number | boolean | undefined>);
  },

  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`/notifications/${notificationId}/read`);
  },

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return apiClient.post('/notifications/read-all');
  },

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get('/notifications/unread-count');
  },
};

// ============================================
// SEARCH SERVICE
// ============================================

export const searchService = {
  async search(query: string, params?: {
    entityId?: string;
    types?: string[];
    limit?: number;
  }): Promise<ApiResponse<unknown[]>> {
    return apiClient.get('/search', {
      q: query,
      entityId: params?.entityId,
      types: params?.types?.join(','),
      limit: params?.limit,
    });
  },

  async getSuggestions(query: string): Promise<ApiResponse<string[]>> {
    return apiClient.get('/search/suggestions', { q: query });
  },
};

// Export all services
export const api = {
  auth: authService,
  user: userService,
  entity: entityService,
  dashboard: dashboardService,
  billing: billingService,
  payment: paymentService,
  application: applicationService,
  document: documentService,
  notification: notificationService,
  search: searchService,
};

export default api;

