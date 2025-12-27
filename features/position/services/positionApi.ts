/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Position,
  PositionOption,
  PositionDetail,
  PositionFormData,
} from "../schemas/positionSchema";

type PositionResponse = GenericApiResponse<Position>;

const BASE_URL = "/api/admin/master/position";

// Define the interface for the parameters we expect
export interface GetPositionsParams {
  page?: number;
  limit?: number;
  search?: string;
  office_code?: string;
  department_code?: string;
  division_code?: string;
  [key: string]: any; // Allow flexibility
}

/**
 * Fetch all positions with optional pagination and filtering
 */
export async function getAllPositions(
  params?: GetPositionsParams
): Promise<PositionResponse> {
  try {
    // Axios automatically handles query string serialization via 'params'
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllPositions error:", error);
    // Return a safe fallback structure if it fails
    // (If 401, interceptor redirects before this returns)
    return {
      status: "99",
      message: "Failed to fetch positions",
      datetime: new Date().toISOString(),
      master_positions: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single position by ID
 */
export async function getPositionById(
  id: number
): Promise<PositionDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
    return data.master_positions || data.position || null;
  } catch (error) {
    console.error("getPositionById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getPositionList(
  office_code?: string,
  department_code?: string,
  division_code?: string
): Promise<PositionOption[] | null> {
  try {
    // Construct params object conditionally
    const params: Record<string, string> = {};
    if (office_code) params.office_code = office_code;
    if (department_code) params.department_code = department_code;
    if (division_code) params.division_code = division_code;

    const { data } = await Axios.get(`${BASE_URL}/list`, { params });
    return data.master_positions;
  } catch (error) {
    console.error("getPositionOption error:", error);
    return null;
  }
}

/**
 * Create a new position
 */
export async function createPosition(payload: PositionFormData) {
  // Axios automatically serializes JSON and sets Content-Type
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

/**
 * Update an existing position
 */
export async function updatePosition(id: number, payload: PositionFormData) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

/**
 * Delete a position
 */
export async function deletePosition(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
