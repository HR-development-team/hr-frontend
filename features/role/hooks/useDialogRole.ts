import { useState, useCallback, useMemo } from "react";
import { Role } from "../schemas/roleSchema";

type DialogMode = "add" | "edit";

export const useDialogRole = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentRole, setCurrentRole] = useState<Role | null>(null);

  // Open for adding a new role
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentRole(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing role
  const openEdit = useCallback((role: Role) => {
    setMode("edit");
    setCurrentRole(role);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setCurrentRole(null), 200);
  }, []);

  // Derived Values
  const title = mode === "add" ? "Tambah Role" : "Edit Role";

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      name: currentRole?.name ?? "",
      description: currentRole?.description ?? "",
    }),
    [currentRole]
  );

  return {
    isVisible,
    mode,
    currentRole,
    title,
    formData,
    openAdd,
    openEdit,
    close,
  };
};
