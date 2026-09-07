import React, { createContext, useContext, useState } from 'react';
import api from '../api/client';
import { AuthUser } from '../types';

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  bloodGroup: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('pp_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, email: userEmail, fullName, role } = res.data;
    const userData: AuthUser = { email: userEmail, fullName, role };
    localStorage.setItem('pp_token', token);
    localStorage.setItem('pp_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (payload: RegisterPayload) => {
    await api.post('/auth/register', payload);
  };

  const logout = () => {
    localStorage.removeItem('pp_token');
    localStorage.removeItem('pp_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
