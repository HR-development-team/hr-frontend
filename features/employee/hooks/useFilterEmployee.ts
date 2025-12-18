"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "primereact/hooks";

export type DateRangeState = {
  start: Date | null;
  end: Date | null;
};

export const useFilterEmployee = () => {
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState<DateRangeState>({
    start: null,
    end: null,
  });

  // --- Hierarchical Filters ---
  // Level 1
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  // Level 2
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  // Level 3
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  // Level 4
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const [debouncedSearch] = useDebounce(search, 500);
  const [appliedDates, setAppliedDates] = useState<DateRangeState>({
    start: null,
    end: null,
  });

  const applyDateFilter = () => {
    setAppliedDates(dates);
  };

  const clearDateFilter = () => {
    const empty = { start: null, end: null };
    setDates(empty);
    setAppliedDates(empty);
  };

  // Helper to reset all organization filters at once
  const clearHierarchyFilters = () => {
    setSelectedOffice(null);
    setSelectedDepartment(null);
    setSelectedDivision(null);
    setSelectedPosition(null);
  };

  const queryParams = useMemo(() => {
    return {
      search: debouncedSearch,
      startDate: appliedDates.start,
      endDate: appliedDates.end,
      // Include these if you plan to send them to the API for server-side filtering
      office: selectedOffice,
      department: selectedDepartment,
      division: selectedDivision,
      position: selectedPosition,
    };
  }, [
    debouncedSearch,
    appliedDates,
    selectedOffice,
    selectedDepartment,
    selectedDivision,
    selectedPosition,
  ]);

  return {
    search,
    setSearch,
    dates,
    setDates,
    applyDateFilter,
    clearDateFilter,
    clearHierarchyFilters,

    // Exposed Filters
    selectedOffice,
    setSelectedOffice,
    selectedDepartment,
    setSelectedDepartment,
    selectedDivision,
    setSelectedDivision,
    selectedPosition,
    setSelectedPosition,

    queryParams,
  };
};
