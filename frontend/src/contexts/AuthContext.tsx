import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

// ------------------
// User Interface
// ------------------
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  github?: string;
  website?: string;
  skills?: string[];
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

// ------------------
// Context Interface
// ------------------
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
}

// ------------------
// Create Context
// ------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ------------------
// Provider
// ------------------
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ------------------
  // Initialize Auth (restore session if token exists)
  // ------------------
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("devconnect-token");
        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem("devconnect-token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Listen for storage changes (e.g., token removed in another tab) or custom logout events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'devconnect-token' && !e.newValue && user) {
        setUser(null);
      }
    };

    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('devconnect-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('devconnect-unauthorized', handleUnauthorized);
    };
  }, [user]);

  // ------------------
  // Auth Actions
  // ------------------
  const login = async (email: string, password: string) => {
    const { user: userData, token } = await authService.login(email, password);
    localStorage.setItem("devconnect-token", token);
    setUser(userData);
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const { user: newUser, token } = await authService.register(userData);
    localStorage.setItem("devconnect-token", token);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("devconnect-token");
    setUser(null);
  };

  const updateUser = async (userData: Partial<User>) => {
    const updatedUser = await authService.updateUser(userData);
    setUser(updatedUser);
  };

  // ------------------
  // Follow/Unfollow Actions
  // ------------------
  const followUser = async (userId: string) => {
    try {
      await userService.followUser(userId);
      if (user) {
        setUser({
          ...user,
          followingCount: (user.followingCount || 0) + 1
        });
      }
    } catch (error) {
        console.error('Follow user failed:', error.response?.data?.msg || error.message);
      throw error;
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      await userService.unfollowUser(userId);
      if (user) {
        setUser({
          ...user,
          followingCount: Math.max((user.followingCount || 0) - 1, 0)
        });
      }
    } catch (error) {
        console.error('Unfollow user failed:', error.response?.data?.msg || error.message);
      throw error;
    }
  };

  // ------------------
  // Context Value
  // ------------------
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    followUser,
    unfollowUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
