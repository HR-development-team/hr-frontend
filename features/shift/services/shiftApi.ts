/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios";
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Shift,
  ShiftOption,
  ShiftDetail,
  ShiftFormData,
} from "../schemas/shiftSchema";

type ShiftResponse = GenericApiResponse<Shift>;

const BASE_URL = "/api/admin/attendance/shift";

// Define the interface for the parameters we expect
export interface GetShiftsParams {
  page?: number;
  limit?: number;
  search?: string;
  office_code?: string;
  [key: string]: any; // Allow flexibility
}

/**
 * Fetch all shifts with optional pagination and filtering
 */
export async function getAllShifts(
  params?: GetShiftsParams
): Promise<ShiftResponse> {
  try {
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllShifts error:", error);
    // Return a safe fallback structure
    return {
      status: "99",
      message: "Failed to fetch shifts",
      datetime: new Date().toISOString(),
      master_shifts: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single shift by ID
 */
export async function getShiftById(id: number): Promise<ShiftDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
    return data.master_shifts || data.shift || null;
  } catch (error) {
    console.error("getShiftById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getShiftList(
  office_code?: string
): Promise<ShiftOption[] | null> {
  try {
    const params: Record<string, string> = {};
    if (office_code) params.office_code = office_code;

    // Matches the /api/shift/options/route.ts we created
    const { data } = await Axios.get(`${BASE_URL}/options`, { params });
    return data.master_shifts;
  } catch (error) {
    console.error("getShiftList error:", error);
    return null;
  }
}

/**
 * Create a new shift
 */
export async function createShift(payload: ShiftFormData) {
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

/**
 * Update an existing shift
 */
export async function updateShift(id: number, payload: ShiftFormData) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

/**
 * Delete a shift
 */
export async function deleteShift(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
