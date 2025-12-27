/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  User,
  UserDetail,
  UserFormData,
  UserOption,
} from "../schemas/userSchema";

type UserResponse = GenericApiResponse<User>;

const BASE_URL = "/api/admin/management/user";

// Define the interface for the parameters we expect
export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role_code?: string;
  [key: string]: any;
}

/**
 * Fetch all users
 */
export async function getAllUsers(
  params?: GetUsersParams
): Promise<UserResponse> {
  try {
    // Axios automatically handles query string serialization via 'params'
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllUsers error:", error);
    // Return a safe fallback structure if it fails
    // (If 401, interceptor redirects before this returns)
    return {
      status: "99",
      message: "Failed to fetch users",
      datetime: new Date().toISOString(),
      master_positions: [], // Make sure this key matches your actual UserResponse type or use 'users: []'
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single user by ID
 */
export async function getUserById(id: number): Promise<UserDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
    return data.users || null;
  } catch (error) {
    console.error("getUserById error:", error);
    return null;
  }
}

/**
 * Get a list for dropdown
 */
export async function getUserList(
  role_code?: string
): Promise<UserOption[] | null> {
  try {
    // Pass query params as an object, Axios builds the string
    const { data } = await Axios.get(`${BASE_URL}/list`, {
      params: role_code ? { role_code } : {},
    });
    return data.users;
  } catch (error) {
    console.error("getUserOption error:", error);
    return null;
  }
}

/**
 * Create a new user
 */
export async function createUser(payload: UserFormData) {
  // Axios automatically serializes the body and sets Content-Type
  const { data } = await Axios.post(BASE_URL, payload);
  return data;
}

/**
 * Update an existing user
 */
export async function updateUser(id: number, payload: UserFormData) {
  const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
  return data;
}

/**
 * Delete a user
 */
export async function deleteUser(id: number) {
  const { data } = await Axios.delete(`${BASE_URL}/${id}`);
  return data;
}
