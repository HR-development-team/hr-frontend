import { LeaveBalanceFormData } from "@/lib/schemas/leaveBalanceFormSchema";
import { GetAllLeaveTypeData } from "../leaveType";
import { GetAllEmployeeData } from "../employee";

export interface LeaveBalanceFormProps {
  leaveBalanceData: LeaveBalanceFormData | null;
  onSubmit: (formData: LeaveBalanceFormData) => void;
  dialogMode: "bulkAdd" | "bulkDelete" | "singleAdd" | "edit" | null;
  leaveTypeOptions: GetAllLeaveTypeData[];
  employeeOptions: GetAllEmployeeData[];
  isEmployeeLoading: boolean;
  isSubmitting: boolean;
}
