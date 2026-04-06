// API client for interacting with the backend
// All requests will include JWT token from localStorage

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Generic request function that adds JWT header
const request = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If response is 401, remove token - client components will handle redirect
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Provide user-friendly error messages
    let errorMessage = errorData.detail;
    if (!errorMessage) {
      switch (response.status) {
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        default:
          errorMessage = `Request failed with status ${response.status}`;
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Auth API functions (these don't require authentication)
const authRequest = async (endpoint: string, options: RequestInit = {}) => {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // Provide user-friendly error messages
    let errorMessage = errorData.detail;
    if (!errorMessage) {
      switch (response.status) {
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 400:
          errorMessage = 'Invalid request. Please check your input.';
          break;
        default:
          errorMessage = `Request failed with status ${response.status}`;
      }
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Task API functions
export const taskApi = {
  getAll: (statusFilter?: string): Promise<any[]> => {
    // For now, using the current user's ID - in real implementation this would be retrieved from the token
    // This requires getting the current user's ID, so for now we'll keep the old endpoint for compatibility
    // TODO: Implement proper user ID retrieval from token
    const url = statusFilter ? `/api/tasks?status_filter=${statusFilter}` : '/api/tasks';
    return request(url);
  },

  getById: (id: number): Promise<any> => request(`/api/tasks/${id}`),

  create: (taskData: { title: string; description?: string; status?: string }): Promise<any> =>
    request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  update: (id: number, taskData: { title: string; description?: string; status?: string }): Promise<any> =>
    request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  delete: (id: number): Promise<void> =>
    request(`/api/tasks/${id}`, {
      method: 'DELETE',
    }),

  // New API functions that match the spec
  getAllForUser: (userId: number, statusFilter?: string): Promise<any[]> => {
    const url = statusFilter
      ? `/api/${userId}/tasks?status_filter=${statusFilter}`
      : `/api/${userId}/tasks`;
    return request(url);
  },

  getForUser: (userId: number, taskId: number): Promise<any> =>
    request(`/api/${userId}/tasks/${taskId}`),

  createForUser: (userId: number, taskData: { title: string; description?: string; status?: string }): Promise<any> =>
    request(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  updateForUser: (userId: number, taskId: number, taskData: { title: string; description?: string; status?: string }): Promise<any> =>
    request(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  deleteForUser: (userId: number, taskId: number): Promise<void> =>
    request(`/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
    }),

  toggleComplete: (userId: number, taskId: number): Promise<any> =>
    request(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
    }),
};

// Auth API functions (public - no token required)
export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<{ access_token: string }> =>
    authRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { name: string; email: string; password: string }): Promise<{ access_token: string }> =>
    authRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getCurrentUser: (): Promise<any> => request('/api/auth/me'),
};