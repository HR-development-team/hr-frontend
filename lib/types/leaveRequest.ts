export interface LeaveRequestData {
	id: number;
	employee_id: number;
	leave_type_id: number;
	start_date: string;
	end_date: string;
	total_days: string;
	reason: string;
	status: "Approved" | "Rejected" | "Pending";
	approved_by_id: number;
	approval_date: string;
	created_at: string;
	updated_at: string;
}
