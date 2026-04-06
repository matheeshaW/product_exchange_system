import { createContext, useState, type ReactNode } from 'react';
import api from '../api/axios';
import type { ApiResponse } from '../types';

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const res = await api.post<ApiResponse<{ accessToken: string }>>(
      '/auth/login',
      { email, password }
    );

    const token = res.data.data.accessToken;

    setAccessToken(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};