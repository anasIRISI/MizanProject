import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Determine if token exists and try to decode user roughly (or fetch from /me)
    if (token) {
      localStorage.setItem('token', token);
      
      // Setup Axios Interceptor headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // A simple parse to get user from token is better done by fetching profile or from login response.
      // Since our login response gives user details, we can persist them in localStorage too.
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/login`, {
        email,
        password
      });
      const { accessToken, user } = response.data;
      
      setToken(accessToken);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/dashboard/b2c');
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: error.response?.data || "Erreur de connexion" };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/register`, {
        name,
        email,
        password,
        role
      });
      // Automatically login after successful registration
      return await login(email, password);
    } catch (error) {
      console.error("Register Error:", error);
      return { success: false, message: error.response?.data || "Erreur d'inscription" };
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
