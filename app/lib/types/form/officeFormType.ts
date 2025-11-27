import { OfficeFormData } from "@/lib/schemas/officeFormSchema";

export interface OfficeFormProps {
  officeData: OfficeFormData | null;
  onSubmit: (formData: OfficeFormData) => void;
  isSubmitting: boolean;
}
