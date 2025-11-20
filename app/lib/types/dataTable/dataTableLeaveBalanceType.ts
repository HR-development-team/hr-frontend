import { GetAllLeaveBalanceData } from "../leaveBalance";

export interface DataTableLeaveBalanceProps {
  data: GetAllLeaveBalanceData[];
  isLoading: boolean;
  // onAdd: (data: GetAllLeaveBalanceData) => void;
  onEdit: (data: GetAllLeaveBalanceData) => void;
  onDelete: (data: GetAllLeaveBalanceData) => void;
}
