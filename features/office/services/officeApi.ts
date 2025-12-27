/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Office,
  OfficeDetail,
  OfficeFormData,
  OfficeOption,
} from "../schemas/officeSchema";

type OfficeResponse = GenericApiResponse<Office>;

const BASE_URL = "/api/admin/master/office";

/**
 * Fetch all offices with optional query parameters
 */
export async function getAllOffices(
  params?: Record<string, any>
): Promise<OfficeResponse> {
  try {
    // Axios automatically handles query string serialization via 'params'
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllOffices error:", error);
    // Return a safe fallback structure if it fails
    // (If 401, interceptor redirects before this returns)
    return {
      status: "99",
      message: "Failed to fetch offices",
      datetime: new Date().toISOString(),
      master_positions: [], // Make sure this key matches your actual OfficeResponse type or use 'master_offices: []'
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single office by ID
 */
export async function getOfficeById(id: number): Promise<OfficeDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
    return data.master_offices || null;
  } catch (error) {
    console.error("getOfficeById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getOfficeList(): Promise<OfficeOption[] | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/options`);
    return data.master_offices;
  } catch (error) {
    console.error("getOfficeOption error:", error);
    return null;
  }
}

/**
 * Create a new office
 */
export async function createOffice(payload: OfficeFormData) {
  // Axios automatically serializes the body and sets Content-Type
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

/**
 * Update an existing office
 */
export async function updateOffice(id: number, payload: OfficeFormData) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

/**
 * Delete an office
 */
export async function deleteOffice(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
