const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set token in localStorage
export const setToken = (token: string) => localStorage.setItem('token', token);

// Remove token from localStorage
export const removeToken = () => localStorage.removeItem('token');

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: any; message?: string }> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || { message: 'Request failed' }
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: { code: 'NETWORK_ERROR', message: error.message }
    };
  }
}

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  register: (data: { email: string; password: string; fullName: string; department?: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  me: () => apiRequest('/auth/me'),
};

// Dashboard API
export const dashboardAPI = {
  getKPIs: () => apiRequest('/dashboard/kpis'),
  getOperations: (limit?: number) => apiRequest(`/dashboard/operations${limit ? `?limit=${limit}` : ''}`),
};

// Products API
export const productsAPI = {
  getAll: (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiRequest(`/products?${query.toString()}`);
  },

  getById: (id: string) => apiRequest(`/products/${id}`),

  create: (data: any) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  update: (id: string, data: any) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  delete: (id: string) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE'
    }),

  getMovements: (id: string) => apiRequest(`/products/${id}/movements`),

  getCategories: () => apiRequest('/products/meta/categories'),
};

// Warehouses API
export const warehousesAPI = {
  getAll: () => apiRequest('/warehouses'),
  getById: (id: string) => apiRequest(`/warehouses/${id}`),
  create: (data: any) =>
    apiRequest('/warehouses', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  update: (id: string, data: any) =>
    apiRequest(`/warehouses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  delete: (id: string) =>
    apiRequest(`/warehouses/${id}`, {
      method: 'DELETE'
    }),
};

// Receipts API
export const receiptsAPI = {
  getAll: (status?: string) => apiRequest(`/receipts${status ? `?status=${status}` : ''}`),
  getById: (id: string) => apiRequest(`/receipts/${id}`),
  create: (data: any) =>
    apiRequest('/receipts', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  validate: (id: string) =>
    apiRequest(`/receipts/${id}/validate`, {
      method: 'POST'
    }),
  delete: (id: string) =>
    apiRequest(`/receipts/${id}`, {
      method: 'DELETE'
    }),
};

// Deliveries API
export const deliveriesAPI = {
  getAll: (status?: string) => apiRequest(`/deliveries${status ? `?status=${status}` : ''}`),
  create: (data: any) =>
    apiRequest('/deliveries', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateStatus: (id: string, status: string) =>
    apiRequest(`/deliveries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }),
  ship: (id: string) =>
    apiRequest(`/deliveries/${id}/ship`, {
      method: 'POST'
    }),
};

// Transfers API
export const transfersAPI = {
  getAll: () => apiRequest('/transfers'),
  create: (data: any) =>
    apiRequest('/transfers', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  complete: (id: string) =>
    apiRequest(`/transfers/${id}/complete`, {
      method: 'POST'
    }),
};

// Adjustments API
export const adjustmentsAPI = {
  getAll: () => apiRequest('/adjustments'),
  create: (data: any) =>
    apiRequest('/adjustments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
};

// Stock API
export const stockAPI = {
  getAll: () => apiRequest('/stock'),
  getLowStock: () => apiRequest('/stock/low'),
  getMovements: (params?: { productId?: string; warehouseId?: string; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.productId) query.append('productId', params.productId);
    if (params?.warehouseId) query.append('warehouseId', params.warehouseId);
    if (params?.limit) query.append('limit', params.limit.toString());
    return apiRequest(`/stock/movements?${query.toString()}`);
  },
};
