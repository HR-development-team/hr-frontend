/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // 1. Convert the params object into a Query String (e.g. "?page=1&limit=5")
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";

    const res = await fetch(`${BASE_URL}${queryString}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAllUsers error:", error);
    // Return a safe fallback structure if it fails
    return {
      status: "99",
      message: "Failed to fetch users",
      datetime: new Date().toISOString(),
      master_positions: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    };
  }
}

/**
 * Fetch a single user by ID
 */
export async function getUserById(id: number): Promise<UserDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await res.json();
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
    const params = new URLSearchParams();

    // Append parameters only if they exist
    if (role_code) {
      params.append("role_code", role_code);
    }

    const queryString = params.toString();
    const url = queryString
      ? `${BASE_URL}/list?${queryString}`
      : `${BASE_URL}/list`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed to fetch user options");
    }

    const data = await res.json();
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
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create user");
  }

  return res.json();
}

/**
 * Update an existing user
 */
export async function updateUser(id: number, payload: UserFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update user");
  }

  return res.json();
}

/**
 * Delete a user
 */
export async function deleteUser(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete user");

  return res.json();
}
