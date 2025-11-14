import { GetLeaveTypeByIdData } from "../leaveType";

export interface LeaveTypeViewProps {
	leaveTypeData: GetLeaveTypeByIdData | null;
	isLoading: boolean;
	dialogMode: "view" | "add" | "edit" | null;
}