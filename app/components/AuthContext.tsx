"use client";

import { useFetch } from "@/lib/hooks/useFetch";
import { useSubmit } from "@/lib/hooks/useSubmit";
import { LoginFormData } from "@/lib/schemas/loginFormSchema";
import { AuthContextType, LoginResponse, User } from "@/lib/types/auth";
import { GetEmployeeByIdData } from "@/lib/types/employee";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsloading] = useState(true);

  const { fetchMultiple } = useFetch();
  const { submitData } = useSubmit();

  const fetchUserData = async () => {
    try {
      await fetchMultiple({
        urls: ["/api/auth/me", "/api/auth/profile"],
        onSuccess: (resultArray) => {
          const [meData, profileData] = resultArray;

          const profileUser: GetEmployeeByIdData = profileData.users;

          if (meData && profileData) {
            const fullUserData: User = {
              ...profileUser,

              email: meData.users.email,
            };

            setUser(fullUserData);
          }
        },
        onError: () => {
          console.log("Gagal mengambil data user");
        },
      });
    } catch (error) {
      console.log("Gagal mendapatkan data user:", error);
    } finally {
      setIsloading(false);
    }
  };

  const login = async (values: LoginFormData): Promise<LoginResponse> => {
    setIsloading(true);
    const result = await submitData({
      url: "/api/auth/login",
      payload: values,
      method: "POST",
      onSuccess: async (responseData: any) => {
        if (responseData.meta && responseData.meta.role_mapping) {
          localStorage.setItem(
            "ROLE_MAP",
            JSON.stringify(responseData.meta.role_mapping)
          );
        }

        await fetchUserData();
      },
    });

    return result as LoginResponse;
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal untuk logout");
      }

      localStorage.removeItem("ROLE_MAP");
    } catch (error: any) {
      console.error("Gagal untuk logout", error);
    } finally {
      setUser(null);
      setIsloading(false);
    }
  };

  // <-- 2. TAMBAHKAN FUNGSI BARU DI SINI -->
  const updateAuthUser = (newUserData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null; // Jika tidak ada user, jangan lakukan apa-apa

      // Gabungkan data user lama (...prevUser) dengan data baru (...newUserData)
      return {
        ...prevUser,
        ...newUserData,
      };
    });
  };
  // <-- PENAMBAHAN FUNGSI SELESAI -->

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateAuthUser, // <-- 3. TAMBAHKAN FUNGSI DI SINI
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam AuthProvider");
  }
  return context;
}
