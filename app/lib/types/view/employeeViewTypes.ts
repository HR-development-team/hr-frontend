import { GetEmployeeByIdData } from "../employee";

export interface EmployeeViewProps {
	employeeData: GetEmployeeByIdData | null;
	isLoading: boolean;
	dialogMode: "view" | "add" | "edit" | null;
}
