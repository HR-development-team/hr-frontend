export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API_ENDPOINTS = {
	LOGIN: `${API_URL}/auth/login`,
	LOGOUT: `${API_URL}/auth/logout`,
	GETUSER: `${API_URL}/auth/me`,

	ADDDEPARTMENT: `${API_URL}/master-departments`,
	EDITDEPARTMENT: (id: number) => `${API_URL}/master-departments/${id}`,
	DELETEDEPARTMENT: (id: number) => `${API_URL}/master-departments/${id}`,
    GETALLDEPARTMENT: `${API_URL}/master-departments`
};
