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
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPositions = useCallback(
    async (params: any = {}, showToastMessage: boolean = false) => {
      try {
        setIsLoading(true);
        const response = await getAllPositions(params);
        setPositions(response.master_positions);
        setTotalRecords(response.meta.total);

        if (showToastMessage) {
          showToast("success", "Berhasil", "Data Jabatan berhasil dimuat");
        }
      } catch (err: any) {
        showToast("error", "Gagal", err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

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

  const clearPosition = useCallback(() => setPosition(null), []);

  return {
    positions,
    position,
    totalRecords,
    isLoading,
    fetchPositions,
    fetchPositionById: fetchPositionByIdHandler,
    clearPosition,
  };
}
