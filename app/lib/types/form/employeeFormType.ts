import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { GetAllPositionData } from "../position";
import { GetAllUserData } from "../user";

export interface EmployeeFormProps {
  employeeData: EmployeeFormData | null;
  onSubmit: (formData: EmployeeFormData) => void;
  dialogMode: "view" | "add" | "edit" | null;
  positionOptions: GetAllPositionData[];
  userOptions: GetAllUserData[];
  isSubmitting: boolean;
}
