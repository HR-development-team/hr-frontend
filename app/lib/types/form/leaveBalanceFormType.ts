import { LeaveBalanceFormData } from "@/lib/schemas/leaveBalanceFormSchema";
import { GetAllLeaveTypeData } from "../leaveType";
import { GetAllEmployeeData } from "../employee";

type modeType = "bulkAdd" | "bulkDelete" | "singleAdd" | "edit" | null;
type labelType =
  | "Pilih Tindakan"
  | "Tambah Saldo Cuti Massal"
  | "Tambah Saldo Cuti Karyawan"
  | "Edit Saldo Cuti"
  | "Hapus Saldo Cuti Massal"
  | null;

export interface LeaveBalanceFormProps {
  leaveBalanceData: LeaveBalanceFormData | null;
  onSubmit: (formData: LeaveBalanceFormData) => void;
  setDialogMode: (mode: modeType, label: labelType) => void;
  dialogMode: modeType;
  leaveTypeOptions: GetAllLeaveTypeData[];
  employeeOptions: GetAllEmployeeData[];
  isLeaveTypeLoading: boolean;
  isEmployeeLoading: boolean;
  isSubmitting: boolean;
}
