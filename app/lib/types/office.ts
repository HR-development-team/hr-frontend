export interface GetAllOfficeData {
  id: number;
  office_code: string;
  parent_office_code: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  radius_meters: number;
  sort_order: number;
  description: string;
}

export interface GetOfficeByIdData extends GetAllOfficeData {
  parent_office_name: string | null;
  created_at: string;
  updated_at: string;
}