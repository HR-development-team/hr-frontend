import { LoginFormData } from "../schemas/loginFormSchema";
import { GetEmployeeByIdData } from "./employee";

export interface AuthUser {
  id: number; // Ini adalah ID User
  email: string;
  role: "admin" | "employee";
}

export interface User extends GetEmployeeByIdData {
  email: string;
  role: "admin" | "employee";
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<AuthUser>;
  logout: () => Promise<void>;

  updateAuthUser: (newUserData: Partial<User>) => void;
}
