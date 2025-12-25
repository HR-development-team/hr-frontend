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

export const useFilterOffice = () => {
  const [lazyParams, setLazyParams] = useState<LazyTableState>({
    first: 0,
    rows: 5,
    page: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedParentOffice, setSelectedParentOffice] = useState<
    string | null
  >(null);

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    parent_office_code: null as string | null,
  });

  const handleParentOfficeChange = useCallback((value: string | null) => {
    setSelectedParentOffice(value);
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
    if (activeFilters.parent_office_code)
      params.parent_office_code = activeFilters.parent_office_code;

    return params;
  }, [lazyParams, activeFilters]);

  useEffect(() => {
    setLazyParams((prev) => ({ ...prev, first: 0, page: 1 }));
    setActiveFilters({
      search: debouncedSearch,
      parent_office_code: selectedParentOffice,
    });
  }, [debouncedSearch, selectedParentOffice]);

  return {
    // Search state
    search,
    setSearch,

    // Parent office filter
    selectedParentOffice,
    setSelectedParentOffice: handleParentOfficeChange,

    // Pagination
    lazyParams,
    onPageChange,

    // API parameters
    apiParams,
  };
};
