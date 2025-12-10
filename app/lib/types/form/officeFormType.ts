import { OfficeFormData } from "@/lib/schemas/officeFormSchema";
import { GetAllOfficeData } from "../office";

export interface OfficeFormProps {
  officeData: OfficeFormData | null;
  officeOptions: GetAllOfficeData[];
  onSubmit: (formData: OfficeFormData) => void;
  isSubmitting: boolean;
}
