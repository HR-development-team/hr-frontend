/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { DataTableStateEvent } from "primereact/datatable";
import { Nullable } from "primereact/ts-helpers";
import { useDebounce } from "@/hooks/useDebounce";

interface LazyTableState {
  first: number;
  rows: number;
  page: number;
}

export const useFilterAttendance = () => {
  const [lazyParams, setLazyParams] = useState<LazyTableState>({
    first: 0,
    rows: 5, // Default to 10 for attendance lists usually
    page: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Date Filters (Start & End)
  const [startDate, setStartDate] = useState<Nullable<Date>>(null);
  const [endDate, setEndDate] = useState<Nullable<Date>>(null);

  // 3. Active Filters Snapshot (what actually triggers the API call)
  const [activeFilters, setActiveFilters] = useState({
    search: "",
    office: null as string | null,
    status: null as string | null,
    startDate: null as Nullable<Date>,
    endDate: null as Nullable<Date>,
  });

  // 4. Handlers
  const handleOfficeChange = useCallback((value: string | null) => {
    setSelectedOffice(value);
  }, []);

  const handleStatusChange = useCallback((value: string | null) => {
    setSelectedStatus(value);
  }, []);

  const handleDateChange = useCallback(
    (start: Nullable<Date>, end: Nullable<Date>) => {
      setStartDate(start);
      setEndDate(end);
    },
    []
  );

  const onPageChange = (event: DataTableStateEvent) => {
    setLazyParams({
      first: event.first,
      rows: event.rows,
      page: (event.page ?? 0) + 1,
    });
  };

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedOffice(null);
    setSelectedStatus(null);
    setStartDate(null);
    setEndDate(null);
  }, []);

  // 5. Construct API Params
  const apiParams = useMemo(() => {
    const params: Record<string, any> = {
      page: lazyParams.page,
      limit: lazyParams.rows,
    };

    if (activeFilters.search) params.search = activeFilters.search;
    if (activeFilters.office) params.office_code = activeFilters.office;
    if (activeFilters.status) params.status = activeFilters.status;

    // Pass Date objects directly (The API layer handles formatting)
    if (activeFilters.startDate) params.start_date = activeFilters.startDate;
    if (activeFilters.endDate) params.end_date = activeFilters.endDate;

    return params;
  }, [lazyParams, activeFilters]);

  // 6. Effect: Reset Pagination when Filters Change
  useEffect(() => {
    setLazyParams((prev) => ({ ...prev, first: 0, page: 1 }));

    setActiveFilters({
      search: debouncedSearch,
      office: selectedOffice,
      status: selectedStatus,
      startDate: startDate,
      endDate: endDate,
    });
  }, [debouncedSearch, selectedOffice, selectedStatus, startDate, endDate]);

  return {
    // States
    search,
    setSearch,
    selectedOffice,
    setSelectedOffice: handleOfficeChange,
    selectedStatus,
    setSelectedStatus: handleStatusChange,
    startDate,
    endDate,
    setDateRange: handleDateChange,

    lazyParams,

    // Actions
    onPageChange,
    clearFilters,

    // Result
    apiParams,
  };
};
