import React, { createContext, useState, useContext, useEffect } from 'react';
import apiService from '../services/api'; // Import your apiService

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    console.log(credentials);
    try {
      const res = await apiService.login(credentials); // Call login API
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      console.log(res.data.user);
      console.log("Login successful");
      return true
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiService.register(userData); // Call register API
      localStorage.setItem('token', res.data.token);
      return true;
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
