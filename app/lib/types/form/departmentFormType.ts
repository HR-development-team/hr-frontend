import { DepartementFormData } from "@/lib/schemas/departmentFormSchema";

export interface DepartmentFormProps {
  departmentData: DepartementFormData | null;
  dialogMode: "view" | "add" | "edit" | null;
  onSubmit: (formData: DepartementFormData) => Promise<void>;
  isSubmitting: boolean;
}
