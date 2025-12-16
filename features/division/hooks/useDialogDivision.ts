import { useState, useCallback, useMemo } from "react";
import { Division, DivisionDetail } from "../schemas/divisionSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogDivision = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentDivision, setCurrentDivision] = useState<
    Division | DivisionDetail | null
  >(null);

  // Open for adding a new division
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentDivision(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing division
  const openEdit = useCallback((division: Division | DivisionDetail) => {
    setMode("edit");
    setCurrentDivision(division);
    setIsVisible(true);
  }, []);

  // Open for viewing division details (ReadOnly)
  const openView = useCallback((division: Division | DivisionDetail) => {
    setMode("view");
    setCurrentDivision(division);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentDivision(null), 200);
  }, []);

  // Derived Values
  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Tambah Divisi";
      case "edit":
        return "Edit Divisi";
      case "view":
        return "Detail Divisi";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      department_code: currentDivision?.department_code ?? "",
      name: currentDivision?.name ?? "",
      description: currentDivision?.description ?? "",
    }),
    [currentDivision]
  );

  return {
    isVisible,
    mode,
    currentDivision,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
  };
};
