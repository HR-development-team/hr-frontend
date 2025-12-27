/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Division,
  DivisionOption,
  DivisionDetail,
  DivisionFormData,
} from "../schemas/divisionSchema";

type DivisionResponse = GenericApiResponse<Division>;

const BASE_URL = "/api/admin/master/division";

// Define filter parameters
export interface GetDivisionsParams {
  page?: number;
  limit?: number;
  search?: string;
  office_code?: string;
  department_code?: string;
  [key: string]: any;
}

/**
 * Fetch all divisions with optional pagination and filtering
 */
export async function getAllDivisions(
  params?: GetDivisionsParams
): Promise<DivisionResponse> {
  try {
    // Axios automatically handles query string serialization via 'params'
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllDivisions error:", error);
    // Return safe fallback
    // (If 401, interceptor redirects before this returns)
    return {
      status: "99",
      message: "Failed to fetch divisions",
      datetime: new Date().toISOString(),
      master_divisions: [], // Ensure this matches your API response structure (e.g. master_divisions)
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single division by ID
 */
export async function getDivisionById(
  id: number
): Promise<DivisionDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
    // Handle potential response variations (list vs single object) if necessary
    return data.master_divisions || data.division || null;
  } catch (error) {
    console.error("getDivisionById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getDivisionList(
  office_code?: string,
  department_code?: string
): Promise<DivisionOption[] | null> {
  try {
    // Construct params object conditionally
    const params: Record<string, string> = {};
    if (office_code) params.office_code = office_code;
    if (department_code) params.department_code = department_code;

    const { data } = await Axios.get(`${BASE_URL}/list`, { params });
    return data.master_divisions;
  } catch (error) {
    console.error("getDivisionOption error:", error);
    return null;
  }
}

/**
 * Create a new division
 */
export async function createDivision(payload: DivisionFormData) {
  // Axios automatically serializes JSON and sets Content-Type
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

/**
 * Update an existing division
 */
export async function updateDivision(id: number, payload: DivisionFormData) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

/**
 * Delete a division
 */
export async function deleteDivision(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
