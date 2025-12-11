import { LoginFormData } from "../schemas/loginFormSchema";
import { GetEmployeeByIdData } from "./employee";

export interface AuthUser {
  id: number; // Ini adalah ID User
  email: string;
  user_code: string;
  employee_code: string;
  role_code: string;
}

export interface User extends GetEmployeeByIdData {
  email: string | null;
}

export interface LoginResponse {
  status: string;
  message: string;
  auth: {
    token: string;
    user: AuthUser;
  };
  meta?: {
    role_mapping: Record<string, string>;
  };
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginFormData) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  updateAuthUser: (newUserData: Partial<User>) => void;
}
