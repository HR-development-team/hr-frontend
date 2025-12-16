import { LeaveRequest, LeaveStatus } from "../schemas/leaveRequestSchema";

const BASE_URL = "/api/admin/transaction/leave-request";

/**
 * Fetch all leave requests
 */
export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data permintaan cuti dari server");
    }

    const data = await res.json();
    return data.leave_requests || [];
  } catch (error) {
    console.error("getAllLeaveRequests error:", error);
    return [];
  }
}

/**
 * Fetch a single leave request by ID
 */
export async function getLeaveRequestById(
  id: number
): Promise<LeaveRequest | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch leave request details");
    }

    const data = await res.json();
    return data.leave_requests || null;
  } catch (error) {
    console.error("getLeaveRequestById error:", error);
    return null;
  }
}

/**
 * Update the status of a leave request (Approve/Reject)
 */
export async function updateLeaveRequestStatus(
  id: number,
  status: LeaveStatus
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok || data.status !== "00") {
    throw new Error(data.message || "Gagal memperbarui status permintaan cuti");
  }

  return data;
}

/**
 * Delete a leave request
 */
export async function deleteLeaveRequest(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete leave request");
  }

  return res.json();
}
