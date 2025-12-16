import {
  Division,
  DivisionDetail,
  DivisionFormData,
} from "../schemas/divisionSchema";

const BASE_URL = "/api/admin/master/division";

/**
 * Fetch all divisions
 */
export async function getAllDivisions(): Promise<Division[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch divisions");
    }

    const data = await res.json();
    return data.master_divisions || [];
  } catch (error) {
    console.error("getAllDivisions error:", error);
    return [];
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
