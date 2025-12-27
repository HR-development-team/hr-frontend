/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Department,
  DepartmentOption,
  DepartmentDetail,
  DepartmentFormData,
} from "../schemas/departmentSchema";

type DepartmentResponse = GenericApiResponse<Department>;

const BASE_URL = "/api/admin/master/department";

// Define filter parameters
export interface GetDepartmentsParams {
  page?: number;
  limit?: number;
  search?: string;
  office_code?: string;
  [key: string]: any; // Allow flexibility
}

/**
 * Fetch all departments with optional pagination and filtering
 */
export async function getAllDepartments(
  params?: GetDepartmentsParams
): Promise<DepartmentResponse> {
  try {
    // Axios automatically handles query string serialization via 'params'
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllDepartments error:", error);
    // Return safe fallback
    // (If 401, interceptor redirects before this returns)
    return {
      status: "99",
      message: "Failed to fetch departments",
      datetime: new Date().toISOString(),
      master_departments: [], // Ensure this key matches your actual API response key
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single department by ID
 */
export async function getDepartmentById(
  id: number
): Promise<DepartmentDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
    // Handle potential naming variations from backend (singular vs plural)
    return data.master_departments || data.department || null;
  } catch (error) {
    console.error("getDepartmentById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getDepartmentList(
  office_code?: string
): Promise<DepartmentOption[] | null> {
  try {
    // Pass query params object, Axios handles the string building
    const { data } = await Axios.get(`${BASE_URL}/list`, {
      params: office_code ? { office_code } : {},
    });
    return data.master_departments;
  } catch (error) {
    console.error("getDepartmentOption error:", error);
    return null;
  }
}

/**
 * Create a new department
 */
export async function createDepartment(payload: DepartmentFormData) {
  // Axios automatically serializes JSON and sets Content-Type
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

/**
 * Update an existing department
 */
export async function updateDepartment(
  id: number,
  payload: DepartmentFormData
) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
