import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider: Checking for saved user in localStorage');
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('🔐 AuthProvider: Found saved user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('❌ AuthProvider: Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    } else {
      console.log('🔐 AuthProvider: No saved user found');
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    console.log('🔐 AuthProvider: Logging in user:', userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ AuthProvider: User logged in successfully');
  };

  const logout = () => {
    console.log('🔐 AuthProvider: Logging out user:', user);
    setUser(null);
    localStorage.removeItem('user');
    console.log('✅ AuthProvider: User logged out successfully');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  console.log('🔐 AuthProvider: Current state:', {
    hasUser: !!user,
    userEmail: user?.email,
    loading
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 