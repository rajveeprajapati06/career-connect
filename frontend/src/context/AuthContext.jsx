import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set default authorization header for Axios if token exists
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  // Load current user details on initialization
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/login', { email, password });
      
      if (res.data.success) {
        const { token: userToken, user: userData } = res.data;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const register = async (name, email, password, role) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/register', { name, email, password, role });
      
      if (res.data.success) {
        const { token: userToken, user: userData } = res.data;
        localStorage.setItem('token', userToken);
        setToken(userToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        toast.success(`Registration successful! Welcome ${userData.name}`);
        return { success: true };
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (err) {
      console.warn('Backend logout warning:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      toast.success('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
