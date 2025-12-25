/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Position,
  PositionDetail,
  PositionFormData,
} from "../schemas/positionSchema";

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
export async function getAllPositions(params?: GetPositionsParams) {
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

    console.log(`${BASE_URL}${queryString}`);

    // 2. Return the FULL data object (containing master_positions AND meta)
    // The hook will handle extracting the specific arrays.
    return data;
  } catch (error) {
    console.error("getAllPositions error:", error);
    // Return a safe fallback structure if it fails
    return { master_positions: [], meta: { total: 0 } };
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
