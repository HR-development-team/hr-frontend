export interface GetAllPositionData {
	id: number;
	position_code: string;
	name: string;
	base_salary: string;
	division_code: string;
	division_name: string;
	department_code: string;
	department_name: string;
}

export interface GetPositionByIdData extends GetAllPositionData {
	description: string;
	created_at: string;
	updated_at: string;
}
