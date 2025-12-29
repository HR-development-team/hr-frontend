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

  // 2. Initial load (FIXED)
  useEffect(() => {
    // Check if token exists in storage BEFORE calling API.
    // Ensure the key ("accessToken") matches what you set in your Login logic.
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      // No token found? We are definitely logged out.
      // Stop loading and DO NOT call the API.
      setIsLoading(false);
      return;
    }

    // Token exists? Okay, let's verify it with the API.
    refreshUser();
  }, []);

  // 3. Login Action
  const login = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(values);

      // CRITICAL: Ensure token is saved BEFORE fetching user
      if (response.auth.token) {
        sessionStorage.setItem("accessToken", response.auth.token);
      }

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
      await logoutUser(); // Call backend (Backend should also allow Set-Cookie: token=; Max-Age=0)

      setUser(null);

      // Clear Client Storage
      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("lastActiveTime");

      // Clear Cookie
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
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
