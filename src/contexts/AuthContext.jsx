import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

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
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('medisync_token');
    if (token) {
      checkAuthStatus(token);
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async (token) => {
    try {
      // For demo: check if it's the demo token
      if (token === 'demo-token-medisync') {
        setUser({
          id: 'demo-user',
          email: 'demo@medisync.example',
          name: 'Demo User',
          avatar: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent('Demo User')}&backgroundType=gradientLinear&fontFamily=Arial&radius=50`,
          role: 'patient'
        });
        setError(null);
        setLoading(false);
        return;
      }

      // Try real API call
      const response = await axios.get('https://api.medisync.com/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const respUser = response.data || {};
      if (!respUser.avatar) {
        respUser.avatar = `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(respUser.name || respUser.email || 'User')}&backgroundType=gradientLinear&fontFamily=Arial&radius=50`;
      }
      setUser(respUser);
      setError(null);
    } catch (err) {
      // Silently clear invalid tokens (don't show error on page load)
      localStorage.removeItem('medisync_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      
      // Mock login for demo - accept any credentials
      const mockUser = {
        id: email === 'demo@medisync.example' ? 'demo-user' : 'user-' + Date.now(),
        email: email,
        name: email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(email.split('@')[0])}&backgroundType=gradientLinear&fontFamily=Arial&radius=50`,
        role: 'patient'
      };
      
      const mockToken = email === 'demo@medisync.example' ? 'demo-token-medisync' : 'mock-token-' + Date.now();
      
      localStorage.setItem('medisync_token', mockToken);
      setUser(mockUser);
      setError(null);
      return { success: true };
      
      // Real API call (commented out for demo)
      // const response = await axios.post('https://api.medisync.com/v1/auth/login', {
      //   email,
      //   password
      // });
      // const { token, user: userData } = response.data;
      // localStorage.setItem('medisync_token', token);
      // setUser(userData);
      // setError(null);
      // return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      
      // Mock registration for demo
      const mockUser = {
        id: 'user-' + Date.now(),
        email: userData.email,
        name: userData.name || userData.email.split('@')[0],
        role: 'patient'
      };
      
      const mockToken = 'mock-token-' + Date.now();
      
      localStorage.setItem('medisync_token', mockToken);
      setUser(mockUser);
      setError(null);
      return { success: true };
      
      // Real API call (commented out for demo)
      // const response = await axios.post('https://api.medisync.com/v1/auth/register', userData);
      // const { token, user: newUser } = response.data;
      // localStorage.setItem('medisync_token', token);
      // setUser(newUser);
      // setError(null);
      // return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('medisync_token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};