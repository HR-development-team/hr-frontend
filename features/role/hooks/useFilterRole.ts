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

export const useFilterRole = () => {
  const [lazyParams, setLazyParams] = useState<LazyTableState>({
    first: 0,
    rows: 5,
    page: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [activeFilters, setActiveFilters] = useState({
    search: "",
  });

  const onPageChange = (event: DataTableStateEvent) => {
    setLazyParams({
      first: event.first,
      rows: event.rows,
      page: (event.page ?? 0) + 1,
    });
  };

  useEffect(() => {
    setLazyParams((prev) => ({ ...prev, first: 0, page: 1 }));

    setActiveFilters({
      search: debouncedSearch,
    });
  }, [debouncedSearch]);

  const apiParams = useMemo(() => {
    const params: Record<string, any> = {
      page: lazyParams.page,
      limit: lazyParams.rows,
    };

    if (activeFilters.search) params.search = activeFilters.search;

    return params;
  }, [lazyParams, activeFilters]);

  return {
    // Search
    search,
    setSearch,

    // Pagination
    lazyParams,
    onPageChange,

    // API
    apiParams,
  };
};
