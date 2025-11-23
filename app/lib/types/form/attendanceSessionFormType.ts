import { AttendanceSessionFormData } from "@/lib/schemas/attendanceFormSchema";

export interface AttendanceSessionFormProps {
  sessionData: AttendanceSessionFormData | null;
  dialogMode: "view" | "add" | "edit" | null;
  onSubmit: (formData: AttendanceSessionFormData) => Promise<void>;
  isSubmitting: boolean;
}
