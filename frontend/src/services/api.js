import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API ${config.method?.toUpperCase()}: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Redirect to login or show login modal
      console.log('Authentication required');
    }
    
    return Promise.reject(error);
  }
);

// ============================================================================
// REFLECTION APIs
// ============================================================================

export const reflectionApi = {
  // Get all published reflections
  getAll: async (category = null) => {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/reflections', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reflections:', error);
      throw error;
    }
  },

  // Get single reflection
  getById: async (id) => {
    try {
      const response = await api.get(`/reflections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reflection:', error);
      throw error;
    }
  },

  // Admin: Get all reflections (including unpublished)
  getAllAdmin: async () => {
    try {
      const response = await api.get('/reflections-admin');
      return response.data;
    } catch (error) {
      console.error('Error fetching admin reflections:', error);
      throw error;
    }
  },

  // Admin: Create reflection
  create: async (reflectionData) => {
    try {
      const response = await api.post('/reflections', reflectionData);
      return response.data;
    } catch (error) {
      console.error('Error creating reflection:', error);
      throw error;
    }
  },

  // Admin: Update reflection
  update: async (id, reflectionData) => {
    try {
      const response = await api.put(`/reflections/${id}`, reflectionData);
      return response.data;
    } catch (error) {
      console.error('Error updating reflection:', error);
      throw error;
    }
  },

  // Admin: Delete reflection
  delete: async (id) => {
    try {
      const response = await api.delete(`/reflections/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting reflection:', error);
      throw error;
    }
  },
};

// ============================================================================
// CONTACT APIs
// ============================================================================

export const contactApi = {
  // Submit contact form
  submit: async (contactData) => {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Admin: Get all contact submissions
  getSubmissions: async () => {
    try {
      const response = await api.get('/contact-submissions');
      return response.data;
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      throw error;
    }
  },
};

// ============================================================================
// ADMIN APIs
// ============================================================================

export const adminApi = {
  // Login
  login: async (credentials) => {
    try {
      const response = await api.post('/admin/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Verify session
  verify: async () => {
    try {
      const response = await api.get('/admin/verify');
      return response.data;
    } catch (error) {
      console.error('Error verifying session:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/admin/logout');
      return response.data;
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        status,
        message: data?.detail || data?.message || 'An error occurred',
        data: data
      };
    } else if (error.request) {
      // Request made but no response
      return {
        status: 0,
        message: 'Network error - please check your connection',
        data: null
      };
    } else {
      // Something else happened
      return {
        status: 0,
        message: error.message || 'An unexpected error occurred',
        data: null
      };
    }
  },

  // Format date for display
  formatDate: (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  },

  // Calculate reading time
  calculateReadTime: (content) => {
    const words = content.split(' ').length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
  }
};

export default api;