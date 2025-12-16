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
    };
  }, [debouncedSearch, appliedDates]);

  return {
    search,
    setSearch,
    dates,
    setDates,
    applyDateFilter,
    clearDateFilter,
    queryParams,
  };
};
