import { Office, OfficeDetail, OfficeFormData } from "../schemas/officeSchema";

const BASE_URL = "/api/admin/master/office";

/**
 * Fetch all offices
 */
export async function getAllOffices(): Promise<Office[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch offices");
    }

    const data = await res.json();
    return data.master_offices || [];
  } catch (error) {
    console.error("getAllOffices error:", error);
    return [];
  }
}

/**
 * Fetch a single office by ID
 */
export async function getOfficeById(id: number): Promise<OfficeDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch office details");
    }

    const data = await res.json();
    return data.master_offices || null;
  } catch (error) {
    console.error("getOfficeById error:", error);
    return null;
  }
}

/**
 * Create a new office
 */
export async function createOffice(payload: OfficeFormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create office");
  }

  return res.json();
}

/**
 * Update an existing office
 */
export async function updateOffice(id: number, payload: OfficeFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update office");
  }

  return res.json();
}

/**
 * Delete an office
 */
export async function deleteOffice(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete office");
  }

  return res.json();
}
