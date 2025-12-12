import { useState, useCallback, useMemo } from "react";
import { User, UserDetail } from "../schemas/userSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogUser = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentUser, setCurrentUser] = useState<User | UserDetail | null>(
    null
  );

  // Open for adding a new user
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentUser(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing user
  const openEdit = useCallback((user: User | UserDetail) => {
    setMode("edit");
    setCurrentUser(user);
    setIsVisible(true);
  }, []);

  // Open for viewing user details (ReadOnly)
  const openView = useCallback((user: User | UserDetail) => {
    setMode("view");
    setCurrentUser(user);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentUser(null), 200);
  }, []);

  // Derived Values
  const title = useMemo(() => {
    switch (mode) {
      case "add":
        return "Tambah User";
      case "edit":
        return "Edit User";
      case "view":
        return "Detail User";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      email: currentUser?.email ?? "",
      role_code: currentUser?.role_code ?? "",
      password: "",
    }),
    [currentUser]
  );

  return {
    isVisible,
    mode,
    currentUser,
    title,
    formData,
    openAdd,
    openEdit,
    openView,
    close,
  };
};
