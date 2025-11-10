"use client";

import { LoginFormData } from "@/lib/schemas/loginFormSchema";
import { AuthContextType, AuthUser, User } from "@/lib/types/auth";
import { EmployeeData } from "@/lib/types/employee";
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

			const userRes = await fetch(
				`/api/admin/master/employee/${authData.employee_id}`
			);
			const userData = await userRes.json();

			if (!userData || userData.status !== "00" || !userData.master_employees) {
				throw new Error("Profil karyawan tidak ditemukan atau data korup.");
			}

			const profileData: EmployeeData = userData.master_employees;

			const fullUserData: User = {
				...profileData,

				user_id: authData.id,
				email: authData.email,
				role: authData.role,
			};

			setUser(fullUserData);
		} catch (error: any) {
			setUser(null);
		} finally {
			setIsloading(false);
		}
	};

	const login = async (values: LoginFormData): Promise<AuthUser> => {
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

			const authUser: AuthUser = responseData.auth.user;

			await fetchUserData();

			return authUser;
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
		} catch (error: any) {
			console.error("Gagal untuk logout", error);
		} finally {
			setUser(null);
			setIsloading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
