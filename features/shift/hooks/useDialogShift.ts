import { useState, useCallback, useMemo } from "react";
import { Shift, ShiftDetail } from "../schemas/shiftSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogShift = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentShift, setCurrentShift] = useState<Shift | ShiftDetail | null>(
    null
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentShift(null);
    setIsVisible(true);
  }, []);

  const openEdit = useCallback((shift: Shift | ShiftDetail) => {
    setMode("edit");
    setCurrentShift(shift);
    setIsVisible(true);
  }, []);

  const openView = useCallback((shift: Shift | ShiftDetail) => {
    setMode("view");
    setCurrentShift(shift);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setCurrentShift(null), 200);
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
        return "Tambah Shift";
      case "edit":
        return "Edit Shift";
      case "view":
        return "Detail Shift";
      default:
        return "";
    }
  }, [mode]);

  const formData = useMemo(() => {
    if (!currentShift) {
      return null;
    }

    // Adjust these fields based on your actual Shift schema
    return {
      shift_code: currentShift.shift_code,
      name: currentShift.name ?? "",
      start_time: currentShift.start_time ?? "",
      end_time: currentShift.end_time ?? "",
      is_overnight: currentShift.is_overnight ?? false,
      late_tolerance_minutes: currentShift.late_tolerance_minutes ?? 0,
      check_in_limit_minutes: currentShift.check_in_limit_minutes ?? 0,
      check_out_limit_minutes: currentShift.check_out_limit_minutes ?? 0,
      work_days: currentShift.work_days ?? [],
      office_code: currentShift.office_code ?? "",
      office_name: currentShift.office_name ?? "",
    };
  }, [currentShift]);

  return {
    isVisible,
    mode,
    currentShift,
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
