import { UserFormData } from "@/lib/schemas/userFormSchema";
import { GetAllEmployeeData } from "../employee";

export interface UserFormProps {
	userData: UserFormData | null;
	onSubmit: (formData: UserFormData) => void;
	dialogMode: "add" | "edit" | null;
	employeeOptions: GetAllEmployeeData[];
	isSubmitting: boolean;
}