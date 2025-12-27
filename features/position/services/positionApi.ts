/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // 1. Convert the params object into a Query String (e.g. "?page=1&limit=5")
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";

    const res = await fetch(`${BASE_URL}${queryString}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch positions");
    }

    const data = await res.json();

    // 2. Return the FULL data object (containing master_positions AND meta)
    // The hook will handle extracting the specific arrays.
    return data;
  } catch (error) {
    console.error("getAllPositions error:", error);
    // Return a safe fallback structure if it fails
    return {
      status: "99",
      message: "Failed to fetch positions",
      datetime: new Date().toISOString(),
      master_positions: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    };
  }
}

/**
 * Fetch a single position by ID
 */
export async function getPositionById(
  id: number
): Promise<PositionDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch position details");
    }

    const data = await res.json();
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
    const params = new URLSearchParams();

    // Append parameters only if they exist
    if (office_code) {
      params.append("office_code", office_code);
    }
    if (department_code) {
      params.append("department_code", department_code);
    }
    if (division_code) {
      params.append("division_code", division_code);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${BASE_URL}/list?${queryString}`
      : `${BASE_URL}/list`;

    console.log(url);

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch position options");
    }

    const data = await res.json();
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
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create position");
  }

  return res.json();
}

/**
 * Update an existing position
 */
export async function updatePosition(id: number, payload: PositionFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update position");
  }

  return res.json();
}

/**
 * Delete a position
 */
export async function deletePosition(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete position");
  }

  return res.json();
}
