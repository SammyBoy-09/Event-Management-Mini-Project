// API base configuration
const API_BASE_URL = 'http://192.168.29.217:5000/api'; // Backend server URL

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  EVENTS: {
    GET_ALL: '/events',
    GET_BY_ID: (id) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id) => `/events/${id}`,
    DELETE: (id) => `/events/${id}`,
    RSVP: (id) => `/events/${id}/rsvp`,
    CANCEL_RSVP: (id) => `/events/${id}/cancel-rsvp`,
    APPROVE: (id) => `/events/${id}/approve`,
    REJECT: (id) => `/events/${id}/reject`,
  },
  USERS: {
    GET_PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    GET_EVENTS: '/users/events',
    UPLOAD_AVATAR: '/users/avatar',
  },
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
  },
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
  },
};

// HTTP methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// Base API class
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = null;
  }

  setAuthToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: HTTP_METHODS.GET });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: HTTP_METHODS.PUT,
      body: JSON.stringify(data),
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: HTTP_METHODS.PATCH,
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: HTTP_METHODS.DELETE });
  }

  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: HTTP_METHODS.POST,
      body: formData,
      headers: {
        // Don't set Content-Type, let browser set it with boundary
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
