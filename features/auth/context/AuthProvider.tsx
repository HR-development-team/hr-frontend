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

      // Handle Role Mapping (Logic preserved from your code)
      if (response.meta?.role_mapping) {
        localStorage.setItem(
          "ROLE_MAP",
          JSON.stringify(response.meta.role_mapping)
        );
      }

      // Re-fetch full user profile after successful login
      await refreshUser();

      return response; // Pass response back to the form for redirection/toast
    } catch (error) {
      setIsLoading(false); // Stop loading if error
      throw error; // Let the form handle the error message
    }
  };

  // 4. Logout Action
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      localStorage.removeItem("ROLE_MAP");
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setIsLoading(false);
      // Optional: Force redirect to login here or let the protected route handle it
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
