import {
  LeaveType,
  LeaveTypeDetail,
  LeaveTypeFormData,
} from "../schemas/leaveTypeSchema";

const BASE_URL = "/api/admin/master/leave-type";

/**
 * Fetch all leave types
 */
export async function getAllLeaveTypes(): Promise<LeaveType[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch leave types");
    }

    const data = await res.json();
    return data.leave_types || [];
  } catch (error) {
    console.error("getAllLeaveTypes error:", error);
    return [];
  }
}

/**
 * Fetch a single leave type by ID
 */
export async function getLeaveTypeById(
  id: number
): Promise<LeaveTypeDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch leave type details");
    }

    const data = await res.json();
    return data.leave_types || data.leave_type || null;
  } catch (error) {
    console.error("getLeaveTypeById error:", error);
    return null;
  }
}

/**
 * Create a new leave type
 */
export async function createLeaveType(payload: LeaveTypeFormData) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create leave type");
  }

  return res.json();
}

/**
 * Update an existing leave type
 */
export async function updateLeaveType(id: number, payload: LeaveTypeFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update leave type");
  }

  return res.json();
}

/**
 * Delete a leave type
 */
export async function deleteLeaveType(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete leave type");
  }

  return res.json();
}
