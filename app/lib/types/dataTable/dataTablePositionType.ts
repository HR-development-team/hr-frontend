import { GetAllPositionData } from "../position";

export interface DataTablePositionProp {
	position: GetAllPositionData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (position: GetAllPositionData) => void;
	onDelete: (position: GetAllPositionData) => void;
	onView: (position: GetAllPositionData) => void;
}