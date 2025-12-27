/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { DataTableStateEvent } from "primereact/datatable";
import { useDebounce } from "@/hooks/useDebounce";

interface LazyTableState {
  first: number;
  rows: number;
  page: number;
}

export const useFilterEmployee = () => {
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
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    office: null as string | null,
    department: null as string | null,
    division: null as string | null,
    position: null as string | null,
  });

  const handleOfficeChange = useCallback((value: string | null) => {
    setSelectedOffice(value);
    setSelectedDepartment(null);
    setSelectedDivision(null);
    setSelectedPosition(null);
  }, []);

  const handleDepartmentChange = useCallback((value: string | null) => {
    setSelectedDepartment(value);
    setSelectedDivision(null);
    setSelectedPosition(null);
  }, []);

  const handleDivisionChange = useCallback((value: string | null) => {
    setSelectedDivision(value);
    setSelectedPosition(null);
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
    if (activeFilters.position) params.position_code = activeFilters.position;

    return params;
  }, [lazyParams, activeFilters]);

  useEffect(() => {
    setLazyParams((prev) => ({ ...prev, first: 0, page: 1 }));
    setActiveFilters({
      search: debouncedSearch,
      office: selectedOffice,
      department: selectedDepartment,
      division: selectedDivision,
      position: selectedPosition,
    });
  }, [
    debouncedSearch,
    selectedOffice,
    selectedDepartment,
    selectedDivision,
    selectedPosition,
  ]);

  return {
    search,
    setSearch,
    selectedOffice,
    setSelectedOffice: handleOfficeChange,
    selectedDepartment,
    setSelectedDepartment: handleDepartmentChange,
    selectedDivision,
    setSelectedDivision: handleDivisionChange,
    selectedPosition,
    setSelectedPosition,
    lazyParams,
    onPageChange,
    apiParams,
  };
};
