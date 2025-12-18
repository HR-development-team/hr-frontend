import { useState, useCallback, useMemo } from "react";
import { Position, PositionDetail } from "../schemas/positionSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogPosition = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentPosition, setCurrentPosition] = useState<
    Position | PositionDetail | null
  >(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Open for adding a new position
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentPosition(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing position
  const openEdit = useCallback((position: Position | PositionDetail) => {
    setMode("edit");
    setCurrentPosition(position);
    setIsVisible(true);
  }, []);

  // Open for viewing position details (ReadOnly)
  const openView = useCallback((position: Position | PositionDetail) => {
    setMode("view");
    setCurrentPosition(position);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentPosition(null), 200);
  }, []);

  // Open for filtering division
  const openFilter = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  const closeFilter = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  // Derived Values
  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Tambah Jabatan";
      case "edit":
        return "Edit Jabatan";
      case "view":
        return "Detail Jabatan";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      parent_position_code: currentPosition?.parent_position_code ?? null,
      name: currentPosition?.name ?? "",
      base_salary: currentPosition?.base_salary
        ? Number(currentPosition.base_salary)
        : 0,
      division_code: currentPosition?.division_code ?? "",
      description: currentPosition?.description ?? "",
    }),
    [currentPosition]
  );

  return {
    isVisible,
    mode,
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
