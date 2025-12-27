/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use your custom Axios instance
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
    // Axios handles Query Strings automatically via the 'params' object
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllRoles error:", error);

    // Return a safe fallback structure if it fails
    // (Note: If it's a 401, the interceptor will redirect before we get here)
    return {
      status: "99",
      message: "Failed to fetch roles",
      datetime: new Date().toISOString(),
      master_positions: [], // Note: check if this key matches your API response type
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any; // Cast as any because fallback structure might slightly differ from T
  }
}

export async function getRoleById(id: number): Promise<Role | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
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
    const { data } = await Axios.get(`${BASE_URL}/list`);
    return data.roles;
  } catch (error) {
    console.error("getRoleOption error:", error);
    return null;
  }
}

export async function createRole(payload: RoleFormData) {
  // Axios automatically stringifies JSON and sets Content-Type
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

export async function updateRole(id: number, payload: RoleFormData) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

export async function deleteRole(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
