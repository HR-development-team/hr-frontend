import { PositionFormData } from "@/lib/schemas/positionFormSchema";
import { GetAllDivisionData } from "../division";

export interface PositionFormProps {
  positionData: PositionFormData | null;
  onSubmit: (formData: PositionFormData) => void;
  divisionOptions: GetAllDivisionData[];
  isSubmitting: boolean;
}
