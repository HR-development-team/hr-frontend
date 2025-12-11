export interface GetAllRoleData {
  id: number;
  role_code: string;
  name: string;
  description: string;
}

export interface GetRoleById extends GetAllRoleData {
  created_at: string;
  updated_at: string;
}
