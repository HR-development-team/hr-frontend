import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { GetAllPositionData } from "../position";

export interface EmployeeFormProps {
	employeeData: EmployeeFormData | null;
	onSubmit: (formData: EmployeeFormData) => void;
	dialogMode: "view" | "add" | "edit" | null;
	positionOptions: GetAllPositionData[];
	isSubmitting: boolean;
}
