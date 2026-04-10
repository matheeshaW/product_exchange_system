import { createContext, useEffect, useState, type ReactNode } from 'react';
import api from '../common/api/axios.instance';
import type { ApiResponse } from '../common/api/api.types';
import { getAccessTokenFromAuthHeader } from '../common/api/access-token';
import {
  registerTokenRefreshHandler,
  setAxiosAccessToken,
} from '../common/api/axios.instance';

interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
}

interface AuthContextType {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthLoading: boolean;
  register: (payload: {
    email: string;
    password: string;
    name: string;
    phone: string;
    province: string;
    district: string;
  }) => Promise<void>;
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
    email: null,
    name: null,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const hydrateUserProfile = async () => {
    try {
      const profileRes = await api.get<ApiResponse<{ id: string; email: string; name: string | null }>>('/users/me');

      setUser((prev) => {
        if (!prev) {
          return {
            id: profileRes.data.data.id,
            email: profileRes.data.data.email,
            name: profileRes.data.data.name,
          };
        }

        return {
          ...prev,
          email: profileRes.data.data.email,
          name: profileRes.data.data.name,
        };
      });
    } catch {
      // Keep minimal token-derived user if profile hydration fails.
    }
  };

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

      if (newToken) {
        void hydrateUserProfile();
      }
    });

    return unregister;
  }, []);

  // Rehydrate auth state on page refresh using HttpOnly refresh cookie.
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');

        const token = getAccessTokenFromAuthHeader(
          (res.headers as Record<string, string>)?.authorization,
        );

        if (!token) {
          throw new Error('Access token missing in refresh response');
        }

        applyAccessToken(token);
        await hydrateUserProfile();
      } catch {
        applyAccessToken(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post(
        '/auth/login',
        { email, password }
      );

      const token = getAccessTokenFromAuthHeader(
        (res.headers as Record<string, string>)?.authorization,
      );

      if (!token) {
        throw new Error('Access token missing in login response');
      }

      applyAccessToken(token);
      await hydrateUserProfile();
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (payload: {
    email: string;
    password: string;
    name: string;
    phone: string;
    province: string;
    district: string;
  }) => {
    try {
      await api.post('/auth/register', payload);
    } catch {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    applyAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};