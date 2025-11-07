export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
	LOGIN: `${API_URL}/auth/login`,
	LOGOUT: `${API_URL}/auth/logout`,
	GETUSER: `${API_URL}/auth/me`,

	ADDDEPARTMENT: `${API_URL}/master-departments`,
	GETALLDEPARTMENT: `${API_URL}/master-departments`,
	EDITDEPARTMENT: (id: string) => `${API_URL}/master-departments/${id}`,
	DELETEDEPARTMENT: (id: string) => `${API_URL}/master-departments/${id}`,
	GETDEPARTMENTBYID: (id: string) => `${API_URL}/master-departments/${id}`,

	ADDDIVISION: `${API_URL}/master-positions`,
	GETALLDIVISION: `${API_URL}/master-positions`,
	EDITDIVISION: (id: string) => `${API_URL}/master-positions/${id}`,
	DELETEDIVISION: (id: string) => `${API_URL}/master-positions/${id}`,
	GETDIVISIONBYID: (id: string) => `${API_URL}/master-positions/${id}`,

	GETUSERPROFILE: `${API_URL}/profiles`,
	GETALLUSER: `${API_URL}/users`,
	UPDATEUSERPROFILE: `${API_URL}/profiles`
};
