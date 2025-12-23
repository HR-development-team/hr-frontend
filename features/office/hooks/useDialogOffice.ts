import { useState, useCallback, useMemo } from "react";
import { Office, OfficeDetail } from "../schemas/officeSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogOffice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentOffice, setCurrentOffice] = useState<
    Office | OfficeDetail | null
  >(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Open for adding a new office
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentOffice(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing office
  const openEdit = useCallback((office: Office | OfficeDetail) => {
    setMode("edit");
    setCurrentOffice(office);
    setIsVisible(true);
  }, []);

  // Open for viewing office details (ReadOnly)
  const openView = useCallback((office: Office | OfficeDetail) => {
    setMode("view");
    setCurrentOffice(office);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentOffice(null), 200);
  }, []);

  // Open for filtering
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
        return "Tambah Kantor";
      case "edit":
        return "Edit Kantor";
      case "view":
        return "Detail Kantor";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(
    () => ({
      name: currentOffice?.name ?? "",
      address: currentOffice?.address ?? "",
      latitude: currentOffice?.latitude ?? 0,
      longitude: currentOffice?.longitude ?? 0,
      radius_meters: currentOffice?.radius_meters ?? 0,
      parent_office_code: currentOffice?.parent_office_code ?? null,
      description: currentOffice?.description ?? "",
    }),
    [currentOffice]
  );

  return {
    isVisible,
    mode,
    currentOffice,
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
