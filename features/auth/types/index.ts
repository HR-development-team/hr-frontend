import { LoginFormData } from "../schemas/loginFormSchema";
import { EmployeeDetail } from "@features/employee/schemas/employeeSchema";

export interface AuthUser {
  id: number;
  email: string;
  user_code: string;
  employee_code: string;
  role_code: string;
  office_code: string;
  role_name: string;
}

export interface User extends EmployeeDetail {
  id: number;
  email: string;
  user_code: string;
  employee_code: string;
  role_code: string;
  role_name: string;
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
  isManualLogout: boolean;
}

export interface PermissionItem {
  role_code: string;
  feature_code: string;
  feature_name: string;
  can_create: number;
  can_read: number;
  can_update: number;
  can_delete: number;
  can_print: number;
}

export interface RolePermission {
  user_code: string;
  role_name: string;
  permissions: PermissionItem[];
}

export interface RolePermissionResponse {
  role_permissions: RolePermission;
}
