import { GetPositionByIdData } from "../position";

export interface PositionViewProps {
  positionData: GetPositionByIdData | null;
  isLoading: boolean;
  dialogMode: "view" | "add" | "edit" | null;
}
