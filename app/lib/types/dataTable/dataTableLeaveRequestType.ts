import { GetAllLeaveRequestData } from "../leaveRequest";

export interface DataTableLeaveRequestProps {
	leaveRequest: GetAllLeaveRequestData[];
	isLoading: boolean;
	onUpdate: (
		leaveRequest: GetAllLeaveRequestData,
		status: "Approved" | "Rejected"
	) => void;
}
