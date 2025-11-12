export interface GetAllDepartmentData {
	id: number;
	name: string;
	department_code: string;
}

export interface GetDepartmentByIdData extends GetAllDepartmentData {
	description: string | null;
	created_at: string;
	updated_at: string;	
}
