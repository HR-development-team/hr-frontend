import { useState, useCallback, useMemo } from "react";
import {
  LeaveBalance,
  LeaveBalanceFormData,
  LeaveBalanceFormMode,
} from "../schemas/leaveBalanceSchema";

export const useDialogLeaveBalance = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<LeaveBalanceFormMode>(null);
  const [currentLeaveBalance, setCurrentLeaveBalance] =
    useState<LeaveBalance | null>(null);

  // =========================================================================
  // Open Handlers
  // =========================================================================

  const openBulkAdd = useCallback(() => {
    setMode("bulkAdd");
    setCurrentLeaveBalance(null);
    setIsOpen(true);
  }, []);

  const openSingleAdd = useCallback(() => {
    setMode("singleAdd");
    setCurrentLeaveBalance(null);
    setIsOpen(true);
  }, []);

  const openBulkDelete = useCallback(() => {
    setMode("bulkDelete");
    setCurrentLeaveBalance(null);
    setIsOpen(true);
  }, []);

  const openEdit = useCallback((data: LeaveBalance) => {
    setMode("edit");
    setCurrentLeaveBalance(data);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay clearing state to prevent UI flicker during close animation
    setTimeout(() => {
      setMode(null);
      setCurrentLeaveBalance(null);
    }, 200);
  }, []);

  // =========================================================================
  // Derived Values
  // =========================================================================

  const title = useMemo(() => {
    switch (mode) {
      case "bulkAdd":
        return "Tambah Saldo Cuti Massal";
      case "singleAdd":
        return "Tambah Saldo Cuti Karyawan";
      case "edit":
        return `Edit Saldo Cuti ${currentLeaveBalance?.employee_name || ""}`;
      case "bulkDelete":
        return "Hapus Saldo Cuti Massal";
      default:
        return "";
    }
  }, [mode, currentLeaveBalance]);

  /**
   * Prepares the initial values for the form based on the current mode and data.
   */
  const formData = useMemo<LeaveBalanceFormData>(() => {
    const defaultYear = new Date().getFullYear();

    // 1. Edit Mode: Pre-fill with existing data
    if (mode === "edit" && currentLeaveBalance) {
      return {
        type_code: currentLeaveBalance.type_code,
        year: currentLeaveBalance.year,
        balance: currentLeaveBalance.balance,
        employee_code: currentLeaveBalance.employee_code,
      };
    }

    // 2. Default Values for Add Modes
    return {
      type_code: "",
      year: defaultYear,
      balance: 12, // Default standard balance
      employee_code: "",
    };
  }, [mode, currentLeaveBalance]);

  return {
    isOpen,
    mode,
    currentLeaveBalance,
    title,
    formData,
    openBulkAdd,
    openSingleAdd,
    openBulkDelete,
    openEdit,
    close,
  };
};
