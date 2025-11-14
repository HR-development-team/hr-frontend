import { LeaveTypeFormData } from "@/lib/schemas/leaveTypeFormSchema";

export interface LeaveTypeFormProps {
  leaveType: LeaveTypeFormData | null;
  onSubmit: (formData: LeaveTypeFormData) => void;
  isSubmitting: boolean;
}
