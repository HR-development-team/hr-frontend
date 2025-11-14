export interface GetAllDivisionData {
  id: number;
  division_code: string;
  name: string;
  department_code: string;
  department_name: string;
}

export interface GetDivisionByIdData extends GetAllDivisionData {
  description: string;
  created_at: string;
  updated_at: string;
}
