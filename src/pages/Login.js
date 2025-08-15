import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  console.log('🔐 Login component rendered');

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔐 Form field changed:', { field: name, value: value.substring(0, 3) + '***' });
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setApiError('');
  };

  const validateForm = () => {
    console.log('🔐 Validating login form');
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    console.log('🔐 Validation errors:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🔐 Login form submitted');
    
    if (!validateForm()) {
      console.log('🔐 Form validation failed');
      return;
    }

    setLoading(true);
    setApiError('');
    console.log('🔐 Attempting login for:', formData.email);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      if (response.success) {
        console.log('🔐 Login successful, storing token and user data');
        // Store token if provided
        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('🔐 Token stored in localStorage');
        }
        
        // Login user with response data
        login(response.user || { email: formData.email });
        console.log('🔐 Navigating to home page');
        navigate('/');
      } else {
        console.log('🔐 Login failed:', response.message);
        setApiError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.response?.status === 404) {
        setApiError('Email not found. Please create a new account.');
      } else if (error.response?.status === 401) {
        setApiError('Invalid email or password.');
      } else {
        setApiError('Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {apiError && (
              <div className="error-message">
                {apiError}
                {apiError.includes('Email not found') && (
                  <Link to="/signup" className="create-account-link">
                    Create new account
                  </Link>
                )}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
                disabled={loading}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                disabled={loading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 