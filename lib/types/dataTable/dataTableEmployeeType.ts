import { GetAllEmployeeData } from "../employee";

export interface DataTableEmployeesProp {
	employees: GetAllEmployeeData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onView: (employee: GetAllEmployeeData) => void;
	onEdit: (employee: GetAllEmployeeData) => void;
	onDelete: (employee: GetAllEmployeeData) => void;
}
