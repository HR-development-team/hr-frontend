import { UserFormData } from "@/lib/schemas/userFormSchema";
import { GetAllEmployeeData } from "../employee";

export interface UserFormProps {
  userData: Omit<UserFormData, "password" | "confirmPassword"> | null;
  onSubmit: (formData: UserFormData) => void;
  dialogMode: "view" | "add" | "edit" | null;
  employeeOptions: GetAllEmployeeData[];
  isSubmitting: boolean;
}
