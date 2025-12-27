/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericApiResponse } from "@/utils/apiResponse";
import { Role, RoleFormData, RoleOption } from "../schemas/roleSchema";
type RoleResponse = GenericApiResponse<Role>;

// Define the interface for the parameters we expect
export interface GetRolesParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any;
}

const BASE_URL = "/api/admin/management/role";

export async function getAllRoles(
  params?: GetRolesParams
): Promise<RoleResponse> {
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
      throw new Error("Failed to fetch roles");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAllRoles error:", error);
    // Return a safe fallback structure if it fails
    return {
      status: "99",
      message: "Failed to fetch roles",
      datetime: new Date().toISOString(),
      master_positions: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    };
  }
}

export async function getRoleById(id: number): Promise<Role | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch role");
    }

    const data = await res.json();
    return data.roles || null;
  } catch (error) {
    console.error("getRoleById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getRoleList(): Promise<RoleOption[] | null> {
  try {
    const url = `${BASE_URL}/list`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch user options");
    }

    const data = await res.json();
    return data.roles;
  } catch (error) {
    console.error("getRoleOption error:", error);
    return null;
  }
}

export async function createRole(payload: RoleFormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create role");
  }

  return res.json();
}

export async function updateRole(id: number, payload: RoleFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update role");

  return res.json();
}

export async function deleteRole(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete role");

  return res.json();
}
