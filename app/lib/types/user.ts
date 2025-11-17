export interface GetAllUserData {
  id: number;
  user_code: string;
  email: string;
  role: "admin" | "employee";
  employee_name: string | null;
}

export interface GetUserByIdData extends GetAllUserData {
  password: string;
  created_at: string;
  updated_at: string;
}
