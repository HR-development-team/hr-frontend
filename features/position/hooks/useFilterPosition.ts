/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { DataTableStateEvent } from "primereact/datatable";
import { useDebounce } from "@/hooks/useDebounce";

interface LazyTableState {
  first: number;
  rows: number;
  page: number;
}

export const useFilterPosition = () => {
  const [lazyParams, setLazyParams] = useState<LazyTableState>({
    first: 0,
    rows: 5,
    page: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(
    null
  );
  const [selectedDivision, setSelectedDivision] = useState<string | null>(null);
  const [selectedScope, setSelectedScope] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    office: null as string | null,
    department: null as string | null,
    division: null as string | null,
    scope: null as string | null,
  });

  const handleOfficeChange = useCallback((value: string | null) => {
    setSelectedOffice(value);
    setSelectedDepartment(null);
    setSelectedDivision(null);
  }, []);

  const handleDepartmentChange = useCallback((value: string | null) => {
    setSelectedDepartment(value);
    setSelectedDivision(null);
  }, []);

  const onPageChange = (event: DataTableStateEvent) => {
    setLazyParams({
      first: event.first,
      rows: event.rows,
      page: (event.page ?? 0) + 1,
    });
  };

  const apiParams = useMemo(() => {
    const params: Record<string, any> = {
      page: lazyParams.page,
      limit: lazyParams.rows,
    };

    if (activeFilters.search) params.search = activeFilters.search;
    if (activeFilters.office) params.office_code = activeFilters.office;
    if (activeFilters.department)
      params.department_code = activeFilters.department;
    if (activeFilters.division) params.division_code = activeFilters.division;
    // NEW: Add Scope to API Params
    if (activeFilters.scope) params.scope = activeFilters.scope;

    return params;
  }, [lazyParams, activeFilters]);

  // Sync state to active filters and reset page
  useEffect(() => {
    setLazyParams((prev) => ({ ...prev, first: 0, page: 1 }));
    setActiveFilters({
      search: debouncedSearch,
      office: selectedOffice,
      department: selectedDepartment,
      division: selectedDivision,
      scope: selectedScope,
    });
  }, [
    debouncedSearch,
    selectedOffice,
    selectedDepartment,
    selectedDivision,
    selectedScope,
  ]);

  return {
    search,
    setSearch,
    selectedOffice,
    setSelectedOffice: handleOfficeChange,
    selectedDepartment,
    setSelectedDepartment: handleDepartmentChange,
    selectedDivision,
    setSelectedDivision,
    selectedScope,
    setSelectedScope,
    lazyParams,
    onPageChange,
    apiParams,
  };
};
