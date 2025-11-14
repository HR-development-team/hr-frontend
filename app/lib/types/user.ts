export interface UserData {
  id: number;
  user_code: string;
  email: string;
  password: string;
  role: "admin" | "employee";
  employee_code: string;
  employee_name: string;
}
