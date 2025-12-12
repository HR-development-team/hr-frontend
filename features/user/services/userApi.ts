import { User, UserDetail, UserFormData } from "../schemas/userSchema";

const BASE_URL = "/api/admin/management/user";

/**
 * Fetch all users
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    const data = await res.json();
    return data.users || [];
  } catch (error) {
    console.error("getAllUsers error:", error);
    return [];
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
