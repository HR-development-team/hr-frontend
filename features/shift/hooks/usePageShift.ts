"use client";

import { useFilterRole } from "@features/role/hooks/useFilterRole";

export function usePageShift() {
  const filter = useFilterRole();

  return {
    filter,
  };
}
