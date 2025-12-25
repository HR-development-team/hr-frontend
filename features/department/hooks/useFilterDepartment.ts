/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { DataTableStateEvent } from "primereact/datatable";
import { useDebounce } from "@/hooks/useDebounce";

interface LazyTableState {
  first: number;
  rows: number;
  page: number;
}

export const useFilterDepartment = () => {
  const [lazyParams, setLazyParams] = useState<LazyTableState>({
    first: 0,
    rows: 5,
    page: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    office: null as string | null,
  });

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

    return params;
  }, [lazyParams, activeFilters]);

  useEffect(() => {
    setLazyParams((prev) => ({ ...prev, first: 0, page: 1 }));

    setActiveFilters({
      search: debouncedSearch,
      office: selectedOffice,
    });
  }, [debouncedSearch, selectedOffice]);

  return {
    search,
    setSearch,
    selectedOffice,
    setSelectedOffice,
    lazyParams,
    onPageChange,
    apiParams,
  };
};
