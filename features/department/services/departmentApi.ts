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
  [key: string]: any;
}

/**
 * Fetch all departments with optional pagination and filtering
 */
export async function getAllDepartments(
  params?: GetDepartmentsParams
): Promise<DepartmentResponse> {
  try {
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllDepartments error:", error);
    // Throw error so the UI (TanStack Query/UseEffect) can handle the error state
    throw error;
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
  try {
    const { data } = await Axios.post(BASE_URL, payload);
    return data;
  } catch (error: any) {
    // Extract backend validation errors
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
}

/**
 * Update an existing department
 */
export async function updateDepartment(
  id: number,
  payload: DepartmentFormData
) {
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
 * Delete a department
 */
export async function deleteDepartment(id: number) {
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
