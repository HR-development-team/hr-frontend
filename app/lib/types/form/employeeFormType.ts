import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { GetAllPositionData } from "../position";
import { GetAllUserData } from "../user";
import { GetAllOfficeData } from "../office";

export interface EmployeeFormProps {
  employeeData: EmployeeFormData | null;
  onSubmit: (formData: EmployeeFormData) => void;
  dialogMode: "view" | "add" | "edit" | null;
  officeOptions: GetAllOfficeData[];
  positionOptions: GetAllPositionData[];
  userOptions: GetAllUserData[];
  isSubmitting: boolean;
}
