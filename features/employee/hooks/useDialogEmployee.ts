import { useState, useCallback, useMemo } from "react";
import { Employee, EmployeeDetail } from "../schemas/employeeSchema";

type DialogMode = "add" | "edit" | "view";

export const useDialogEmployee = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<DialogMode>("add");
  const [currentEmployee, setCurrentEmployee] = useState<
    Employee | EmployeeDetail | null
  >(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Open for adding a new employee
  const openAdd = useCallback(() => {
    setMode("add");
    setCurrentEmployee(null);
    setIsVisible(true);
  }, []);

  // Open for editing an existing employee
  const openEdit = useCallback((employee: Employee | EmployeeDetail) => {
    setMode("edit");
    setCurrentEmployee(employee);
    setIsVisible(true);
  }, []);

  // Open for viewing employee details (ReadOnly)
  const openView = useCallback((employee: Employee | EmployeeDetail) => {
    setMode("view");
    setCurrentEmployee(employee);
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    // Delay clearing data slightly to prevent UI flicker while closing
    setTimeout(() => setCurrentEmployee(null), 200);
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
        return "Tambah Karyawan";
      case "edit":
        return "Edit Karyawan";
      case "view":
        return "Detail Karyawan";
      default:
        return "";
    }
  }, [mode]);

  // Prepare data for the form
  const formData = useMemo(() => {
    // Cast to detail to access all potential fields safely
    const emp = currentEmployee as EmployeeDetail | null;

    return {
      full_name: emp?.full_name ?? "",
      // Required Date: Default to today if null (Add mode), else parse string
      join_date: emp?.join_date ? new Date(emp.join_date) : new Date(),
      position_code: emp?.position_code ?? "",
      office_code: emp?.office_code ?? "",
      user_code: emp?.user_code ?? null,
      employment_status_code: emp?.employment_status_code ?? "aktif",

      // Optional Fields
      contact_phone: emp?.contact_phone ?? null,
      address: emp?.address ?? null,
      ktp_number: emp?.ktp_number ?? null,
      birth_place: emp?.birth_place ?? null,

      // Optional Date: Parse string if exists
      birth_date: emp?.birth_date ? new Date(emp.birth_date) : null,

      gender: emp?.gender ?? null,
      religion: emp?.religion ?? null,
      maritial_status: emp?.maritial_status ?? null,

      // Optional Date: Parse string if exists
      resign_date: emp?.resign_date ? new Date(emp.resign_date) : null,

      education: emp?.education ?? null,
      blood_type: emp?.blood_type ?? null,
      bpjs_ketenagakerjaan: emp?.bpjs_ketenagakerjaan ?? null,
      bpjs_kesehatan: emp?.bpjs_kesehatan ?? null,
      npwp: emp?.npwp ?? null,
      bank_account: emp?.bank_account ?? null,
    };
  }, [currentEmployee]);

  return {
    isVisible,
    mode,
    currentEmployee,
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
