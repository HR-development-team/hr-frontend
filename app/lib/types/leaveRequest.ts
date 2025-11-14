export interface GetAllLeaveRequestData {
	id: number;
	request_code: string;
	employee_code: string;
	type_code: string;
	start_date: string;
	end_date: string;
	total_days: string;
	reason: string;
	status: "Approved" | "Rejected" | "Pending";
	approved_by_code: string | null; // user code
	approval_date: string | null;
	employee_name: string;
	type_name: string;
	aproved_by_name: string | null; //
}

export interface GetLeaveRequestByIdData {
	created_at: string;
	updated_at: string;
}
