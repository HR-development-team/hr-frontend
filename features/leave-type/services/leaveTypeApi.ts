/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
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
    const { data } = await Axios.get(BASE_URL);
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
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
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
  try {
    // Axios automatically handles JSON stringification and headers
    const { data } = await Axios.post(BASE_URL, payload);
    return data;
  } catch (error: any) {
    // If specific error data exists (e.g., validation), throw it
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error("Failed to create leave type");
  }
}

/**
 * Update an existing leave type
 */
export async function updateLeaveType(id: number, payload: LeaveTypeFormData) {
  try {
    const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error("Failed to update leave type");
  }
}

/**
 * Delete a leave type
 */
export async function deleteLeaveType(id: number) {
  try {
    const { data } = await Axios.delete(`${BASE_URL}/${id}`);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error("Failed to delete leave type");
  }
}
