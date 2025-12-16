/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { Position, PositionDetail } from "../schemas/positionSchema";
import { getAllPositions, getPositionById } from "../services/positionApi";
import { useToastContext } from "@components/ToastProvider";

export function useFetchPosition() {
  const { showToast } = useToastContext();
  const [positions, setPositions] = useState<Position[]>([]);
  const [position, setPosition] = useState<PositionDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Fetch all positions
   */
  const fetchPositions = useCallback(
    async (
      showToastMessage: boolean = false,
      params?: {
        search?: string;
      }
    ) => {
      try {
        setIsLoading(true);
        const data = await getAllPositions();
        setPositions(data);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data jabatan berhasil dimuat");
        }
      } catch (err: any) {
        if (showToastMessage) {
          showToast("error", "Gagal", err.message);
        }
        setPositions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Fetch a single position detail by ID
   */
  const fetchPositionByIdHandler = useCallback(async (id: number) => {
    try {
      setIsLoading(true);
      const data = await getPositionById(id);
      setPosition(data);
    } catch (err) {
      console.error("Error fetching position details:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Reset selected position
   */
  const clearPosition = useCallback(() => setPosition(null), []);

  return {
    positions,
    position,
    isLoading,
    fetchPositions,
    fetchPositionById: fetchPositionByIdHandler,
    clearPosition,
  };
}
