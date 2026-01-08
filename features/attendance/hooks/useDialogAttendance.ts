import { useState, useCallback } from "react";
import { Attendance, AttendanceDetail } from "../schemas/attendanceSchema";

export const useDialogAttendance = () => {
  // 1. Dialog Visibility State
  const [isVisible, setIsVisible] = useState(false);

  // 2. Data State
  const [currentAttendance, setCurrentAttendance] = useState<
    Attendance | AttendanceDetail | null
  >(null);

  // 3. Filter Sidebar State
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // --- Actions ---

  // Open Detail View
  const openView = useCallback((data: Attendance | AttendanceDetail) => {
    setCurrentAttendance(data);
    setIsVisible(true);
  }, []);

  // Close Dialog
  const close = useCallback(() => {
    setIsVisible(false);
    // Small delay to prevent UI flickering while animation finishes
    setTimeout(() => setCurrentAttendance(null), 200);
  }, []);

  // Open Filter
  const openFilter = useCallback(() => {
    setIsFilterVisible(true);
  }, []);

  // Close Filter
  const closeFilter = useCallback(() => {
    setIsFilterVisible(false);
  }, []);

  return {
    // States
    isVisible,
    currentAttendance,
    title: "Detail Absensi",
    isFilterVisible,

    // Actions
    openView,
    close,
    openFilter,
    closeFilter,
  };
};
