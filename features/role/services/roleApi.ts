import { Role, RoleFormData } from "../schemas/roleSchema";

const BASE_URL = "/api/admin/management/role";

export async function getAllRoles(): Promise<Role[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch roles");
    }

    const data = await res.json();
    return data.roles || [];
  } catch (error) {
    console.error("getAllRoles error:", error);
    return [];
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
