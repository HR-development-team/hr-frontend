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
    // Aligning with authApi: Throw error so the UI knows the request failed
    throw error;
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
    // Aligning with fetchCurrentUser: Return null on error
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
  try {
    const { data } = await Axios.post(BASE_URL, payload);
    return data;
  } catch (error: any) {
    // Extract specific backend validation message if available
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}

/**
 * Update an existing office
 */
export async function updateOffice(id: number, payload: OfficeFormData) {
  try {
    const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}

/**
 * Delete an office
 */
export async function deleteOffice(id: number) {
  try {
    const { data } = await Axios.delete(`${BASE_URL}/${id}`);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}
