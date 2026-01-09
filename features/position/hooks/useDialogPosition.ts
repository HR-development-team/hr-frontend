import { useState, useCallback, useMemo } from "react";
import { Position, PositionDetail } from "../schemas/positionSchema";

type DialogMode = "add" | "edit" | "view";
export type PositionType =
  | "regular"
  | "head_office"
  | "head_department"
  | "head_division";

export const useDialogPosition = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [positionType, setPositionType] = useState<PositionType>("regular"); // Track type
  const [currentPosition, setCurrentPosition] = useState<
    Position | PositionDetail | null
  >(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const openAdd = useCallback((type: PositionType = "regular") => {
    setMode("add");
    setPositionType(type);
    setCurrentPosition(null);
    setIsVisible(true);
  }, []);

  const openEdit = useCallback((position: Position | PositionDetail) => {
    setMode("edit");
    setPositionType("regular");
    setCurrentPosition(position);
    setIsVisible(true);
  }, []);

  const openView = useCallback((position: Position | PositionDetail) => {
    setMode("view");
    setCurrentPosition(position);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setCurrentPosition(null), 200);
  }, []);

  const openFilter = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  const title = useMemo(() => {
    if (mode === "edit") return "Edit Jabatan";
    if (mode === "view") return "Detail Jabatan";

    // Dynamic title based on type
    switch (positionType) {
      case "head_office":
        return "Tambah Kepala Kantor";
      case "head_department":
        return "Tambah Kepala Departemen";
      case "head_division":
        return "Tambah Kepala Divisi";
      default:
        return "Tambah Jabatan Reguler";
    }
  }, [mode, positionType]);

  const formData = useMemo(() => {
    if (!currentPosition) {
      return null;
    }

    return {
      parent_position_code: currentPosition.parent_position_code ?? null,
      name: currentPosition.name ?? "",
      base_salary: currentPosition.base_salary
        ? Number(currentPosition.base_salary)
        : 0,
      division_code: currentPosition.division_code ?? "",
      description: currentPosition.description ?? "",
      office_code: currentPosition.office_code,
      department_code: currentPosition.department_code,
      position_code: currentPosition.position_code,
    };
  }, [currentPosition]);

  return {
    isVisible,
    mode,
    positionType,
    currentPosition,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
    isFilterVisible,
    openFilter,
    closeFilter,
  };
};
