import { createContext, useEffect, useState, type ReactNode } from 'react';
import api from '../common/api/axios.instance';
import type { ApiResponse } from '../common/api/api.types';
import {
  registerTokenRefreshHandler,
  setAxiosAccessToken,
} from '../common/api/axios.instance';

interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextType {
  accessToken: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const applyAccessToken = (token: string | null) => {
    setAccessToken(token);
    setAxiosAccessToken(token);

    if (!token) {
      setUser(null);
      return;
    }

    try {
      setUser(decodeUserFromToken(token));
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const unregister = registerTokenRefreshHandler((newToken) => {
      applyAccessToken(newToken);
    });

    return unregister;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<ApiResponse<{ accessToken: string }>>(
        '/auth/login',
        { email, password }
      );

      const token = res.data.data.accessToken;

      applyAccessToken(token);
      
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    applyAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};