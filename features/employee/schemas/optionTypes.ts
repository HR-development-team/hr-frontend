export interface Office {
  office_code: string;
  name: string;
}
export interface Department {
  department_code: string;
  name: string;
  office_code: string; // Needed for filtering
}
export interface Division {
  division_code: string;
  name: string;
  department_code: string; // Needed for filtering
}
export interface Position {
  position_code: string;
  name: string;
  division_code: string; // Needed for filtering
}
