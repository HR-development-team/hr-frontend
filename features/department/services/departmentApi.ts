import {
  Department,
  DepartmentDetail,
  DepartmentFormData,
} from "../schemas/departmentSchema";

const BASE_URL = "/api/admin/master/department";

/**
 * Fetch all departments
 */
export async function getAllDepartments(): Promise<Department[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch departments");
    }

    const data = await res.json();
    return data.master_departments || [];
  } catch (error) {
    console.error("getAllDepartments error:", error);
    return [];
  }
}

/**
 * Fetch a single department by ID
 */
export async function getDepartmentById(
  id: number
): Promise<DepartmentDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch department details");
    }

    const data = await res.json();

    return data.master_departments || null;
  } catch (error) {
    console.error("getDepartmentById error:", error);
    return null;
  }
}

/**
 * Create a new department
 */
export async function createDepartment(payload: DepartmentFormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create department");
  }

  return res.json();
}

/**
 * Update an existing department
 */
export async function updateDepartment(
  id: number,
  payload: DepartmentFormData
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update department");
  }

  return res.json();
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete department");
  }

  return res.json();
}
