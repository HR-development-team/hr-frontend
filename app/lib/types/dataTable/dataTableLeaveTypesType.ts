import { GetAllLeaveTypeData } from "../leaveType";

export interface DataTableLeaveTypeProp {
  leaveType: GetAllLeaveTypeData[];
  isLoading: boolean;
  // lazyParams: { first: number; rows: number; page: number };
  // totalItems: number;
  // onPageChange: (event: DataTablePageEvent) => void;
  onView: (leaveType: GetAllLeaveTypeData) => void;
  onEdit: (leaveType: GetAllLeaveTypeData) => void;
  onDelete: (leaveType: GetAllLeaveTypeData) => void;
}
