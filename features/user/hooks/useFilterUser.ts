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

export const useFilterUser = () => {
  const [lazyParams, setLazyParams] = useState<LazyTableState>({
    first: 0,
    rows: 5,
    page: 1,
  });

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    role_code: null as string | null,
  });

  const handleRoleChange = useCallback((value: string | null) => {
    setSelectedRole(value);
  }, []);

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
      role_code: selectedRole,
    });
  }, [debouncedSearch, selectedRole]);

  const apiParams = useMemo(() => {
    const params: Record<string, any> = {
      page: lazyParams.page,
      limit: lazyParams.rows,
    };

    if (activeFilters.search) params.search = activeFilters.search;
    if (activeFilters.role_code) params.role_code = activeFilters.role_code;

    return params;
  }, [lazyParams, activeFilters]);

  return {
    // Search
    search,
    setSearch,

    // Role Filter
    selectedRole,
    setSelectedRole: handleRoleChange,

    // Pagination
    lazyParams,
    onPageChange,

    // API
    apiParams,
  };
};
