"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType, User } from "../types";
import { LoginFormData } from "../schemas/loginFormSchema";
import { fetchCurrentUser, loginUser, logoutUser } from "../services/authApi";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Centralized function to load user data
  const refreshUser = async () => {
    try {
      const userData = await fetchCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Initial load
  useEffect(() => {
    refreshUser();
  }, []);

  // 3. Login Action
  const login = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(values);

      await refreshUser();
      localStorage.setItem("lastActiveTime", Date.now().toString());

      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // 4. Logout Action
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Manual State Update
  const updateAuthUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return { ...prevUser, ...newUserData };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
