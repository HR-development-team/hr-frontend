import {
  RolePermissionsData,
  UpdatePermissionsPayload,
} from "../schemas/permissionSchema";

const BASE_URL = "/api/admin/management/permission";

/**
 * Fetch permissions for a specific role
 */
export async function getPermissionsByRoleCode(
  roleCode: string
): Promise<RolePermissionsData | null> {
  try {
    const res = await fetch(`${BASE_URL}/${roleCode}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch role permissions");
    }

    const data = await res.json();

    return data.role_permissions || null;
  } catch (error) {
    console.error("getPermissionsByRoleCode error:", error);
    return null;
  }
}

/**
 * Update permissions for a specific role
 */
export async function updatePermissions(
  roleCode: string,
  payload: UpdatePermissionsPayload
) {
  const res = await fetch(`${BASE_URL}/${roleCode}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update permissions");
  }

  return res.json();
}
