'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

// Types pour l'utilisateur et l'authentification
interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

// Contexte d'authentification
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Clé pour le localStorage
const TOKEN_KEY = 'fliptrade_token';
const USER_KEY = 'fliptrade_user';

// URL de base de l'API (à adapter selon votre configuration)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Utilitaire pour gérer le localStorage de manière sécurisée
const storage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du token:', error);
    }
  },
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du token:', error);
    }
  },
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'utilisateur:", error);
    }
  },
  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  },
  clearAll: (): void => {
    storage.removeToken();
    storage.removeUser();
  },
};

// Fonction pour valider le token JWT
const isTokenValid = (token: string): boolean => {
  if (!token) return false;

  try {
    // Décoder le payload du JWT (partie centrale)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Vérifier si le token a expiré
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// Fonction pour faire des requêtes API avec gestion d'erreurs
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}/${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Une erreur est survenue');
    }

    return data;
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
};

// Fonction pour récupérer les informations de l'utilisateur
const fetchUserProfile = async (token: string): Promise<User | null> => {
  try {
    // Décoder le token pour obtenir l'ID utilisateur
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    if (!userId) {
      throw new Error('ID utilisateur non trouvé dans le token');
    }

    const response = await apiRequest(`user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return null;
  }
};

// Provider d'authentification
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation - vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = storage.getToken();
        const savedUser = storage.getUser();

        if (savedToken && isTokenValid(savedToken)) {
          setToken(savedToken);

          // Si on a un utilisateur sauvegardé, l'utiliser
          if (savedUser) {
            setUser(savedUser);
          } else {
            // Sinon, récupérer les informations depuis l'API
            const userProfile = await fetchUserProfile(savedToken);
            if (userProfile) {
              setUser(userProfile);
              storage.setUser(userProfile);
            } else {
              // Token invalide, nettoyer le storage
              storage.clearAll();
            }
          }
        } else {
          // Token invalide ou expiré, nettoyer le storage
          storage.clearAll();
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'authentification:",
          error,
        );
        storage.clearAll();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Fonction de connexion
  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await apiRequest('auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.access_token) {
        const newToken = response.access_token;

        // Sauvegarder le token
        setToken(newToken);
        storage.setToken(newToken);

        // Récupérer les informations de l'utilisateur
        const userProfile = await fetchUserProfile(newToken);
        if (userProfile) {
          setUser(userProfile);
          storage.setUser(userProfile);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (credentials: RegisterCredentials): Promise<void> => {
    try {
      setIsLoading(true);

      const response = await apiRequest('auth/register', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Après l'inscription, connecter automatiquement l'utilisateur
      if (response) {
        await login({
          email: credentials.email,
          password: credentials.password,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = (): void => {
    setUser(null);
    setToken(null);
    storage.clearAll();
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook pour vérifier si l'utilisateur est connecté
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Rediriger vers la page de connexion si nécessaire
      window.location.href = '/sign-in';
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
};

// Composant de protection des routes
interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  ),
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-20">
        <div className="text-sm text-black dark:text-white">
          Veuillez vous connecter pour accéder à cette page.
        </div>
        <Link href="/sign-in" className="text-primary">
          Se connecter
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
