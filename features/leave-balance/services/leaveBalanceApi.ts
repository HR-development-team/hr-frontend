/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios";
import {
  LeaveBalance,
  LeaveBalanceFormData,
} from "../schemas/leaveBalanceSchema";

const BASE_URL = "/api/admin/transaction/leave-balance";

/**
 * Fetch all leave balances with optional filtering
 */
export async function getAllLeaveBalances(
  year?: number | null,
  type_code?: string | null
): Promise<LeaveBalance[]> {
  try {
    // Axios handles query params automatically
    const params: Record<string, any> = {};
    if (year) params.year = year;
    if (type_code) params.type_code = type_code;

    const { data } = await Axios.get(BASE_URL, { params });
    return data.leave_balances || [];
  } catch (error) {
    console.error("getAllLeaveBalances error:", error);
    return [];
  }
}

/**
 * Create a single leave balance (Specific Employee)
 */
export async function createLeaveBalance(payload: LeaveBalanceFormData) {
  try {
    const { data } = await Axios.post(BASE_URL, payload);

    if (data.status !== "00") {
      throw new Error(data.message || "Gagal menambahkan saldo cuti");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan saldo cuti"
    );
  }
}

/**
 * Create bulk leave balances (All Employees)
 */
export async function createBulkLeaveBalance(payload: LeaveBalanceFormData) {
  try {
    const { data } = await Axios.post(`${BASE_URL}/bulk`, payload);

    if (data.status !== "00") {
      throw new Error(data.message || "Gagal menambahkan saldo cuti massal");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal menambahkan saldo cuti massal"
    );
  }
}

/**
 * Update a specific leave balance
 */
export async function updateLeaveBalance(
  id: number,
  payload: LeaveBalanceFormData
) {
  try {
    const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);

    if (data.status !== "00") {
      throw new Error(data.message || "Gagal memperbarui saldo cuti");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal memperbarui saldo cuti"
    );
  }
}

/**
 * Delete a specific leave balance
 */
export async function deleteLeaveBalance(id: number) {
  try {
    const { data } = await Axios.delete(`${BASE_URL}/${id}`);

    if (data.status !== "00") {
      throw new Error(data.message || "Gagal menghapus saldo cuti");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal menghapus saldo cuti"
    );
  }
}

/**
 * Delete bulk leave balances (Based on Year and Type)
 */
export async function deleteBulkLeaveBalance(year: number, type_code: string) {
  try {
    // Pass query params in the config object
    const { data } = await Axios.delete(`${BASE_URL}/bulk`, {
      params: {
        year,
        type_code,
      },
    });

    if (data.status !== "00") {
      throw new Error(data.message || "Gagal menghapus saldo cuti massal");
    }

    return data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Gagal menghapus saldo cuti massal"
    );
  }
}
