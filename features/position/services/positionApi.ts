import {
  Position,
  PositionDetail,
  PositionFormData,
} from "../schemas/positionSchema";

const BASE_URL = "/api/admin/master/position";

/**
 * Fetch all positions
 */
export async function getAllPositions(): Promise<Position[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch positions");
    }

    const data = await res.json();
    return data.master_positions || [];
  } catch (error) {
    console.error("getAllPositions error:", error);
    return [];
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
