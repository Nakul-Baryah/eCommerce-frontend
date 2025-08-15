import axios from 'axios';

const API_BASE_URL = 'http://localhost:6060';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const homeAPI = {
  // Get home page data including products and navbar info
  getHomeData: async () => {
    try {
      const response = await api.get('/ecom/v1/home/');
      return response.data;
    } catch (error) {
      console.error('Error fetching home data:', error);
      throw error;
    }
  },
};

export const productAPI = {
  // Add to favorites
  addToFavorites: async (productId) => {
    try {
      const response = await api.post('/ecom/v1/favorites/add', {
        productId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  // Remove from favorites
  removeFromFavorites: async (productId) => {
    try {
      const response = await api.delete(`/ecom/v1/favorites/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  // Add to cart
  addToCart: async (productId, size, color, quantity = 1) => {
    try {
      const response = await api.post('/ecom/v1/cart/add', {
        productId,
        size,
        color,
        quantity
      });
      return response.data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },
};

export const authAPI = {
  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Signup user
  signup: async (email, password, mobileNumber) => {
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        mobileNumber,
      });
      return response.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
};

export default api; 