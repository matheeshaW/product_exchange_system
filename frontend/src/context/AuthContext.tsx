import { createContext, useState, type ReactNode } from 'react';
import api from '../common/api/axios.instance';
import type { ApiResponse } from '../common/api/api.types';
import { setAxiosAccessToken } from '../common/api/axios.instance';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const decodeUserFromToken = (token: string): AuthUser => {
    const payloadPart = token.split('.')[1];
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(padded));

    return {
      id: payload.sub,
      email: payload.email,
    };
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<ApiResponse<{ accessToken: string }>>(
        '/auth/login',
        { email, password }
      );

      const token = res.data.data.accessToken;
      const authenticatedUser = decodeUserFromToken(token);

      setAccessToken(token); // store in memory
      setUser(authenticatedUser);
      setAxiosAccessToken(token); // (global axios access)
      
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login }}>
      {children}
    </AuthContext.Provider>
  );
};