import { GetDivisionByIdData } from "../division";

export interface DivisionViewProps {
	divisionData: GetDivisionByIdData | null;
	isLoading: boolean;
	dialogMode: "view" | "add" | "edit" | null;
}
