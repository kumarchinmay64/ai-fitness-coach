import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const storedUser = await api.auth.getCurrentUser();
        const storedAdmin = await api.auth.getCurrentAdmin();
        setUser(storedUser);
        setAdmin(storedAdmin);
      } catch (err) {
        console.error('Failed to initialize auth:', err);
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const loggedUser = await api.auth.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const adminLogin = async (email, password) => {
    const loggedAdmin = await api.auth.adminLogin(email, password);
    setAdmin(loggedAdmin);
    return loggedAdmin;
  };

  const signup = async (userData) => {
    const newUser = await api.auth.signup(userData);
    setUser(newUser);
    return newUser;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const adminLogout = async () => {
    await api.auth.logout();
    setAdmin(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('ai_fitness_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        login,
        adminLogin,
        signup,
        logout,
        adminLogout,
        updateUser,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
