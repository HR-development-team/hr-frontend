"use client";

import { useEffect, useCallback } from "react";

import { useDialogPosition } from "./useDialogPosition";
import { useFilterPosition } from "./useFilterPosition";
import { useFetchPosition } from "./useFetchPosition";
import { useSavePosition } from "./useSavePosition";
import { useDeletePosition } from "./useDeletePosition";
import { PositionFormData, Position } from "../schemas/positionSchema";

export function usePagePosition() {
  const dialog = useDialogPosition();
  const filter = useFilterPosition();

  const { positions, position, fetchPositions, fetchPositionById, isLoading } =
    useFetchPosition();

  const refreshData = useCallback(
    (showToast: boolean = false) => {
      fetchPositions(showToast, filter.queryParams);
    },
    [fetchPositions, filter.queryParams]
  );

  const { savePosition, isSaving } = useSavePosition(() => {
    dialog.close();
    refreshData(false);
  });

  const deleteAction = useDeletePosition(() => {
    refreshData(false);
  });

  const handleSave = async (values: PositionFormData) => {
    await savePosition(values, dialog.currentPosition?.id);
  };

  const handleView = async (row: Position) => {
    dialog.openView(row);
    await fetchPositionById(row.id);
  };

  // Initial Data Load
  useEffect(() => {
    refreshData(true);
  }, [refreshData]);

  return {
    // Data & Status
    positions,
    position,
    isLoading,
    isSaving,

    dialog,
    filter,
    deleteAction,

    // Handlers
    handleSave,
    handleView,
  };
}
