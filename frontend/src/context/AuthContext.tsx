import { createContext, useState, type ReactNode } from 'react';
import api from '../common/api/axios.instance';
import type { ApiResponse } from '../common/api/api.types';
import { setAxiosAccessToken } from '../common/api/axios.instance';

interface AuthContextType {
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<ApiResponse<{ accessToken: string }>>(
        '/auth/login',
        { email, password }
      );

      const token = res.data.data.accessToken;

      setAccessToken(token); // store in memory
      setAxiosAccessToken(token); // (global axios access)
      
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, login }}>
      {children}
    </AuthContext.Provider>
  );
};