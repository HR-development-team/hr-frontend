import { LoginFormData } from "../schemas/loginFormSchema";
import { EmployeeData } from "./employee";

export interface AuthUser {
	id: number; // Ini adalah ID User
	email: string;
	employee_id: number;
	role: "admin" | "employee";
}

export interface User extends EmployeeData {
	user_id: number;
	email: string;
	role: "admin" | "employee";
}

export interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (credentials: LoginFormData) => Promise<AuthUser>;
	logout: () => Promise<void>;
}
