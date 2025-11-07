import { id } from "zod/v4/locales";

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

	ADDEMPLOYEE: `${API_URL}/master-employees`,
	GETALLEMPLOYEE: `${API_URL}/master-employees`,
	EDITEMPLOYEE: (id: string) => `${API_URL}/master-employees/${id}`,
	DELETEEMPLOYEE: (id: string) => `${API_URL}/master-employees/${id}`,
	GETEMPLOYEEBYID: (id: string) => `${API_URL}/master-employees/${id}`,

	ADDUSER: `${API_URL}/users`,
	GETALLUSER: `${API_URL}/users`,
	EDITUSER: (id: string) => `${API_URL}/users/${id}`,
	DELETEUSER: (id: string) => `${API_URL}/users/${id}`,
	GETUSERBYID: (id: string) => `${API_URL}/users/${id}`,

	ADDLEAVETYPE: `${API_URL}/master-leave-types`,
	GETALLLEAVETYPE: `${API_URL}/master-leave-types`,
	EDITLEAVETYPE: (id: string) => `${API_URL}/master-leave-types/${id}`,
	DELETELEAVETYPE: (id: string) => `${API_URL}/master-leave-types/${id}`,
	GETLEAVETYPEBYID: (id: string) => `${API_URL}/master-leave-types/${id}`,
};
