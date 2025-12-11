import { RoleFormData } from "@/lib/schemas/roleFormSchema";

export interface RoleFormProps {
  roleData: RoleFormData | null;
  onSubmit: (formData: RoleFormData) => Promise<void>;
  isSubmitting: boolean;
}
