import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('flashmenu_token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          setRestaurant(res.data.restaurant);
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('flashmenu_token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    localStorage.setItem('flashmenu_token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, role: res.data.role });
    setRestaurant(res.data.restaurant);
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    localStorage.setItem('flashmenu_token', res.data.token);
    setUser({ _id: res.data._id, name: res.data.name, email: res.data.email, role: res.data.role });
    setRestaurant(res.data.restaurant);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('flashmenu_token');
    setUser(null);
    setRestaurant(null);
  };

  const updateRestaurantState = (updatedRestaurant) => {
    setRestaurant(updatedRestaurant);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        restaurant,
        loading,
        login,
        register,
        logout,
        updateRestaurantState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
