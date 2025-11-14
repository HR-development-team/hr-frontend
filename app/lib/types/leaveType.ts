export interface GetAllLeaveTypeData {
	id: number;
	type_code: string;
	name: string;
	deduction: string;
	description: string;
}

export interface GetLeaveTypeByIdData extends GetAllLeaveTypeData {
	created_at: string;
	updated_at: string;
}
