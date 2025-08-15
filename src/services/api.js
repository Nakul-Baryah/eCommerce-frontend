import axios from 'axios';

// Use relative URLs with proxy configuration
const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);

export const homeAPI = {
  // Get home page data including products and navbar info
  getHomeData: async () => {
    try {
      console.log('🏠 Fetching home data...');
      const response = await api.get('/ecom/v1/home');
      console.log('🏠 Home data received:', {
        productCount: Array.isArray(response.data) ? response.data.length : 'Not an array',
        data: response.data
      });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching home data:', error);
      throw error;
    }
  },
};

export const aboutAPI = {
  // Get about page data including description and contact info
  getAboutData: async () => {
    try {
      console.log('ℹ️ Fetching about page data...');
      const response = await api.get('/ecom/v1/about');
      console.log('ℹ️ About data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching about data:', error);
      throw error;
    }
  },
};

export const productAPI = {
  // Add to favorites
  addToFavorites: async (productId) => {
    try {
      console.log('❤️ Adding to favorites:', productId);
      const response = await api.post('/ecom/v1/favorites/add', {
        productId
      });
      console.log('✅ Added to favorites successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding to favorites:', error);
      throw error;
    }
  },

  // Remove from favorites
  removeFromFavorites: async (productId) => {
    try {
      console.log('💔 Removing from favorites:', productId);
      const response = await api.delete(`/ecom/v1/favorites/remove/${productId}`);
      console.log('✅ Removed from favorites successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing from favorites:', error);
      throw error;
    }
  },

  // Add to cart
  addToCart: async (productId, size, color, quantity = 1) => {
    try {
      console.log('🛒 Adding to cart:', {
        productId,
        size,
        color,
        quantity
      });
      const response = await api.post('/ecom/v1/cart/add', {
        productId,
        size,
        color,
        quantity
      });
      console.log('✅ Added to cart successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      throw error;
    }
  },
};

export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting login for:', email);
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  },

  // Signup user
  signup: async (email, password, mobileNumber) => {
    try {
      console.log('📝 Attempting signup for:', email);
      const response = await api.post('/auth/signup', {
        email,
        password,
        mobileNumber,
      });
      console.log('✅ Signup successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  },
};

export default api; 