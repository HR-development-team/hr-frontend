/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { LeaveRequest, LeaveStatus } from "../schemas/leaveRequestSchema";

const BASE_URL = "/api/admin/transaction/leave-request";

/**
 * Fetch all leave requests
 */
export async function getAllLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const { data } = await Axios.get(BASE_URL);
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
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
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
  try {
    const { data } = await Axios.put(`${BASE_URL}/${id}`, { status });

    // Optional: Keep your specific "00" status check if your backend uses it
    if (data.status !== "00") {
      throw new Error(
        data.message || "Gagal memperbarui status permintaan cuti"
      );
    }

    return data;
  } catch (error: any) {
    // Pass backend error message if available
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal memperbarui status permintaan cuti"
    );
  }
}

/**
 * Delete a leave request
 */
export async function deleteLeaveRequest(id: number) {
  try {
    const { data } = await Axios.delete(`${BASE_URL}/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete leave request"
    );
  }
}
