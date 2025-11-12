export interface GetAllEmployeeData {
	id: number;
	employee_code: string;
	full_name: string;
	join_date: string;
	position_code: string;
	employment_status: "aktif" | "inaktif";
	position_name: string;
	division_code: string;
	division_name: string;
	department_code: string;
	department_name: string;
}

export interface GetEmployeeByIdData extends GetAllEmployeeData {
	ktp_number: string;
	birth_place: string;
	birt_date: string;
	gender: "laki-laki" | "perempuan";
	address: string;
	contact_phone: string;
	religion: string;
	maritial_status: "belum menikah" | "sudah menikah";
	resign_date: string | null;
	education: string;
	blood_type: string;
	profile_picture: string;
	bpjs_ketenagakerjaan: string;
	bpjs_kesehatan: string;
	npwp: string;
	bank_account: string;
	created_at: string;
	updated_at: string;
}
