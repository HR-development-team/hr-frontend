import { DivisionFormData } from "@/lib/schemas/divisionFormSchema";
import { GetAllDepartmentData } from "../department";

export interface DivisionFormProps {
  divisionData: DivisionFormData | null;
  onSubmit: (formData: DivisionFormData) => void;
  departmentOptions: GetAllDepartmentData[];
  isSubmitting: boolean;
}
