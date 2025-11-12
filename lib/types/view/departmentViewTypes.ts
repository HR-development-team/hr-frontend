import { GetDepartmentByIdData } from "../department";

export interface DepartmentViewProps {
	departmentData: GetDepartmentByIdData | null;
	isLoading: boolean;
	dialogMode: "view" | "add" | "edit" | null;
}
