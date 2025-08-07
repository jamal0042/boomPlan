// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import axios from 'axios';
import { User, Role } from '../types';

const API_BASE_URL = 'https://jamaltech.alwaysdata.net/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  signupUser: (userData: any | FormData) => Promise<User>;
  signInUser: (credentials: { email: string; password: string }) => Promise<User>;
  updateUserProfile: (userId: number, data: Partial<User>) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const decodeJwt = useCallback((token: string): User | null => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      console.error("Token JWT invalide ou mal formé :", token);
      return null;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);
      const userDataFromToken = decoded.data;

      const userWithRole: User = {
        id: userDataFromToken.id,
        name: userDataFromToken.name,
        email: userDataFromToken.email,
        avatar_url: userDataFromToken.avatar_url,
        phone: userDataFromToken.phone,
        bio: userDataFromToken.bio,
        role_id: userDataFromToken.role_id,
        role: userDataFromToken.role_name
          ? { id: userDataFromToken.role_id, name: userDataFromToken.role_name }
          : undefined,
        created_at: userDataFromToken.created_at,
        updated_at: userDataFromToken.updated_at,
      };

      return userWithRole;
    } catch (e) {
      console.error("Erreur lors du décodage du JWT:", e);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      const decodedUser = decodeJwt(token);
      if (decodedUser) {
        setUser(decodedUser);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('jwt_token');
      }
    }
    setLoading(false);
  }, [decodeJwt]);

  const login = useCallback(async (token: string) => {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
      setError("Token JWT invalide ou mal formé.");
      logout();
      return;
    }

    localStorage.setItem('jwt_token', token);
    const decodedUser = decodeJwt(token);
    if (decodedUser) {
      setUser(decodedUser);
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError("Token invalide après connexion.");
      logout();
    }
  }, [decodeJwt]);

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const signupUser = useCallback(async (userData: any | FormData): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ message: string; user: User; token: string }>(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      await login(response.data.token);
      return response.data.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Échec de l\'inscription.';
      setError(errorMessage);
      console.error('Erreur lors de l\'inscription:', err.response?.data || err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [login]);

  const signInUser = useCallback(async (credentials: { email: string; password: string }): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<{ message: string; token: string; user: User }>(
        `${API_BASE_URL}/auth/login`,
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (!response.data.token) {
        throw new Error("Aucun token JWT reçu depuis l'API.");
      }

      await login(response.data.token);
      return response.data.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Échec de la connexion.';
      setError(errorMessage);
      console.error('Erreur lors de la connexion:', err.response?.data || err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [login]);

  const updateUserProfile = useCallback(async (userId: number, data: Partial<User>): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) throw new Error('Jeton d\'authentification manquant.');

      const response = await axios.put<{ message: string; user: User }>(
        `${API_BASE_URL}/auth/profile/${userId}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data.user);
      return response.data.user;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Échec de la mise à jour du profil.';
      setError(errorMessage);
      console.error('Erreur lors de la mise à jour du profil:', err.response?.data || err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    signupUser,
    signInUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
