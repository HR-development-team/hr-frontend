import { DepartementFormData } from "@/lib/schemas/departmentFormSchema";
import { GetAllOfficeData } from "../office";

export interface DepartmentFormProps {
  departmentData: DepartementFormData | null;
  officeOptions: GetAllOfficeData[];
  onSubmit: (formData: DepartementFormData) => Promise<void>;
  isSubmitting: boolean;
  isOfficeLoading: boolean;
}
