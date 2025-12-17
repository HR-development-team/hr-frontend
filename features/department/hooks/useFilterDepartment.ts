"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "primereact/hooks";

export type DateRangeState = {
  start: Date | null;
  end: Date | null;
};

export const useFilterDepartment = () => {
  // 1. Existing State
  const [search, setSearch] = useState("");
  const [dates, setDates] = useState<DateRangeState>({
    start: null,
    end: null,
  });
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

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

  const queryParams = useMemo(() => {
    return {
      search: debouncedSearch,
      startDate: appliedDates.start,
      endDate: appliedDates.end,
      // office_code: selectedOffice,
    };
  }, [debouncedSearch, appliedDates]);

  return {
    // Search
    search,
    setSearch,

    // Dates
    dates,
    setDates,
    applyDateFilter,
    clearDateFilter,

    // Office (New)
    selectedOffice,
    setSelectedOffice,

    // Combined Params
    queryParams,
  };
};
