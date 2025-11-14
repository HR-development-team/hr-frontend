import { GetAllDivisionData } from "../division";

export interface DataTableDivisionProp {
	division: GetAllDivisionData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onView: (division: GetAllDivisionData) => void;
	onEdit: (division: GetAllDivisionData) => void;
	onDelete: (division: GetAllDivisionData) => void;
}
