export interface GetAllPositionData {
  id: number;
  position_code: string;
  name: string;
  base_salary: string;
  division_code: string;
  division_name: string;
  department_code: string;
  department_name: string;
  sort_order: number;
  parent_position_code: string | null;
}

export interface GetPositionByIdData extends GetAllPositionData {
  parent_position_name: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}
