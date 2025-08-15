import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    mobileNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await authAPI.signup(
        formData.email, 
        formData.password, 
        formData.mobileNumber
      );
      
      if (response.success) {
        setSuccess(true);
        // Auto-login after successful signup
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        login(response.user || { email: formData.email });
        
        // Redirect to home after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setApiError(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error.response?.status === 409) {
        setApiError('Email already exists. Please try logging in instead.');
      } else {
        setApiError('Signup failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-card success">
            <div className="success-icon">✓</div>
            <h2>Account Created Successfully!</h2>
            <p>Welcome to ShopHub! You will be redirected to the home page shortly.</p>
            <Link to="/" className="home-link">
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <h2>Create Account</h2>
            <p>Join ShopHub and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {apiError && (
              <div className="error-message">
                {apiError}
                {apiError.includes('Email already exists') && (
                  <Link to="/login" className="login-link">
                    Sign in instead
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
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="tel"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={errors.mobileNumber ? 'error' : ''}
                placeholder="Enter your mobile number"
                disabled={loading}
              />
              {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
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
                placeholder="Create a password"
                disabled={loading}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
                disabled={loading}
              />
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button 
              type="submit" 
              className="signup-btn"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="signup-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="login-link">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 