/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Department,
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
    // 1. Convert params to Query String
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";

    const res = await fetch(`${BASE_URL}${queryString}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch departments");
    }

    const data = await res.json();

    // 2. Return FULL data (meta + master_departments)
    return data;
  } catch (error) {
    console.error("getAllDepartments error:", error);
    // Return safe fallback
    return {
      status: "99",
      message: "Failed to fetch departments",
      datetime: new Date().toISOString(),
      master_departments: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any; // Cast to any if structure slightly differs, or strictly match GenericApiResponse
  }
}

/**
 * Fetch a single department by ID
 */
export async function getDepartmentById(
  id: number
): Promise<DepartmentDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch department details");
    }

    const data = await res.json();

    // Handle potential naming variations from backend (singular vs plural)
    return data.master_departments || data.department || null;
  } catch (error) {
    console.error("getDepartmentById error:", error);
    return null;
  }
}

/**
 * Create a new department
 */
export async function createDepartment(payload: DepartmentFormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create department");
  }

  return res.json();
}

/**
 * Update an existing department
 */
export async function updateDepartment(
  id: number,
  payload: DepartmentFormData
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update department");
  }

  return res.json();
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete department");
  }

  return res.json();
}
