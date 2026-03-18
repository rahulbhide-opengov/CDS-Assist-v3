import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for development - replace with actual auth implementation
const MOCK_USER: User = {
  id: 'user-123',
  name: 'Current User',
  email: 'user@example.com',
  role: 'user',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        // Check for existing session
        const storedUser = localStorage.getItem('seamstress_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // For development, auto-login with mock user
          setUser(MOCK_USER);
          localStorage.setItem('seamstress_user', JSON.stringify(MOCK_USER));
        }
      } catch (error) {
        // Handle auth initialization error
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual authentication API call
      // For now, use mock authentication
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      if (email && password) {
        const loggedInUser: User = {
          ...MOCK_USER,
          email,
          name: email.split('@')[0],
        };
        setUser(loggedInUser);
        localStorage.setItem('seamstress_user', JSON.stringify(loggedInUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual logout API call
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay

      setUser(null);
      localStorage.removeItem('seamstress_user');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('seamstress_user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get current user ID for services
export const getCurrentUserId = (): string => {
  const storedUser = localStorage.getItem('seamstress_user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user.id || 'current-user';
    } catch {
      return 'current-user';
    }
  }
  return 'current-user';
};