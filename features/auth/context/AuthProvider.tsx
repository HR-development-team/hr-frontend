"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { AuthContextType, User } from "../types";
import { LoginFormData } from "../schemas/loginFormSchema";
import { fetchCurrentUser, loginUser, logoutUser } from "../services/authApi";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isManualLogout, setIsManualLogout] = useState(false);

  const router = useRouter();

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

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }
    refreshUser();
  }, []);

  const login = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await loginUser(values);
      await refreshUser();

      return response;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setIsManualLogout(true);
    setIsLoading(true);

    try {
      await logoutUser();

      setUser(null);

      router.push("/login");
    } catch (error) {
      console.error("Logout error", error);
      setIsManualLogout(false);
    } finally {
      if (!isManualLogout) {
        setIsLoading(false);
      }
    }
  };

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
        isManualLogout,
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
