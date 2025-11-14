import { GetAllDepartmentData } from "../department";

export interface DataTableDepartmentProp {
	department: GetAllDepartmentData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (department: GetAllDepartmentData) => void;
	onDelete: (department: GetAllDepartmentData) => void;
	onView: (department: GetAllDepartmentData) => void;
}
