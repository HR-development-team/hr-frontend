/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Division,
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
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";

    const res = await fetch(`${BASE_URL}${queryString}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch divisions");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAllDivisions error:", error);
    // Return safe fallback
    return {
      status: "99",
      message: "Failed to fetch divisions",
      datetime: new Date().toISOString(),
      master_divisions: [],
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
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch division details");
    }

    const data = await res.json();
    return data.master_divisions || data.division || null;
  } catch (error) {
    console.error("getDivisionById error:", error);
    return null;
  }
}

/**
 * Create a new division
 */
export async function createDivision(payload: DivisionFormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create division");
  }

  return res.json();
}

/**
 * Update an existing division
 */
export async function updateDivision(id: number, payload: DivisionFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update division");
  }

  return res.json();
}

/**
 * Delete a division
 */
export async function deleteDivision(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete division");
  }

  return res.json();
}
