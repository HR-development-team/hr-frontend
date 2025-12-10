import { PositionFormData } from "@/lib/schemas/positionFormSchema";
import { GetAllDivisionData } from "../division";
import { GetAllPositionData } from "../position";

export interface PositionFormProps {
  positionData: PositionFormData | null;
  positionOptions: GetAllPositionData[];
  onSubmit: (formData: PositionFormData) => void;
  divisionOptions: GetAllDivisionData[];
  isSubmitting: boolean;
}
