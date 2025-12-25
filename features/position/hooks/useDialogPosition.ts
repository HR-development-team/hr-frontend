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

  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentPosition(null);
    setIsVisible(true);
  }, []);

  const openEdit = useCallback((position: Position | PositionDetail) => {
    setMode("edit");
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
