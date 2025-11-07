export interface UserData {
	id: number;
	email: string;
	password: string;
	role: "admin" | "employee";
	employee_id: number;
	created_at: string;
	updated_at: string;
}
