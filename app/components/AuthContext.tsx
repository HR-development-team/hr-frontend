"use client";

import { LoginFormData } from "@/lib/schemas/loginFormSchema";
import { AuthContextType, AuthUser, LoginResponse, User } from "@/lib/types/auth";
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

  const fetchUserData = async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();

      if (!meData || meData.status !== "00" || !meData.users) {
        throw new Error("Sesi tidak valid");
      }

      const authData: AuthUser = meData.users;

      // const userRes = await fetch(
      //  `/api/admin/master/employee/${authData.employee_id}`
      // );

      const profileRes = await fetch("/api/auth/profile");
      const profileData = await profileRes.json();
      // const userData = await userRes.json();

      if (!profileData || profileData.status !== "00" || !profileData.users) {
        throw new Error("Profil karyawan tidak ditemukan atau data korup.");
      }

      const profileUser: GetEmployeeByIdData = profileData.users;

      const fullUserData: User = {
        ...profileUser,

        email: authData.email,
        role_code: authData.role_code,
      };

      setUser(fullUserData);
    } catch (error: any) {
      setUser(null);
    } finally {
      setIsloading(false);
    }
  };

  const login = async (values: LoginFormData): Promise<LoginResponse> => {
    setIsloading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const responseData = await res.json();

      if (!res.ok) throw new Error(responseData.message || "Terjadi kesalahan");

      console.log("Login success", responseData.message);

      if (responseData.meta && responseData.meta.role_mapping) {
        localStorage.setItem("ROLE_MAP", JSON.stringify(responseData.meta.role_mapping)) 
      }

      // const authUser: AuthUser = responseData.auth.user;

      await fetchUserData();

      return responseData as LoginResponse;
    } catch (error: any) {
      setUser(null);
      setIsloading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Gagal untuk logout");
      }

      localStorage.removeItem("ROLE_MAP")
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
