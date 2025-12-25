/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericApiResponse } from "@/utils/apiResponse";
import { Office, OfficeDetail, OfficeFormData } from "../schemas/officeSchema";
type OfficeResponse = GenericApiResponse<Office>;

const BASE_URL = "/api/admin/master/office";

/**
 * Fetch all offices with optional query parameters
 */
export async function getAllOffices(
  params?: Record<string, any>
): Promise<OfficeResponse> {
  try {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";

    console.log(`${BASE_URL}${queryString}`);

    const res = await fetch(`${BASE_URL}${queryString}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch offices");
    }

    return await res.json();
  } catch (error) {
    console.error("getAllPositions error:", error);
    // Return a safe fallback structure if it fails
    return {
      status: "99",
      message: "Failed to fetch offices",
      datetime: new Date().toISOString(),
      master_positions: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    };
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
