import { useState, useCallback, useMemo } from "react";
import { Department, DepartmentDetail } from "../schemas/departmentSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogDepartment = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentDepartment, setCurrentDepartment] = useState<
    Department | DepartmentDetail | null
  >(null);

  // Open for adding a new department
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentDepartment(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing department
  const openEdit = useCallback((department: Department | DepartmentDetail) => {
    setMode("edit");
    setCurrentDepartment(department);
    setIsVisible(true);
  }, []);

  // Open for viewing department details (ReadOnly)
  const openView = useCallback((department: Department | DepartmentDetail) => {
    setMode("view");
    setCurrentDepartment(department);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentDepartment(null), 200);
  }, []);

  // Derived Values
  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Tambah Departemen";
      case "edit":
        return "Edit Departemen";
      case "view":
        return "Detail Departemen";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      office_code: currentDepartment?.office_code ?? "",
      name: currentDepartment?.name ?? "",
      description: currentDepartment?.description ?? "",
    }),
    [currentDepartment]
  );

  return {
    isVisible,
    mode,
    currentDepartment,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
  };
};
