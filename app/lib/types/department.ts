export interface GetAllDepartmentData {
  id: number;
  department_code: string;
  office_code: string;
  office_name: string;
  name: string;
  description: string | null;
}

export interface GetDepartmentByIdData extends GetAllDepartmentData {
  created_at: string;
  updated_at: string;
}
