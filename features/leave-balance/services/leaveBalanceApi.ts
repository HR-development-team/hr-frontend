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
    const url = new URL(BASE_URL, window.location.origin);

    if (year) {
      url.searchParams.append("year", String(year));
    }

    if (type_code) {
      url.searchParams.append("type_code", type_code);
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Gagal mendapatkan data saldo cuti");
    }

    const data = await res.json();
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
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.status !== "00") {
    throw new Error(data.message || "Gagal menambahkan saldo cuti");
  }

  return data;
}

/**
 * Create bulk leave balances (All Employees)
 */
export async function createBulkLeaveBalance(payload: LeaveBalanceFormData) {
  const res = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.status !== "00") {
    throw new Error(data.message || "Gagal menambahkan saldo cuti massal");
  }

  return data;
}

/**
 * Update a specific leave balance
 */
export async function updateLeaveBalance(
  id: number,
  payload: LeaveBalanceFormData
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.status !== "00") {
    throw new Error(data.message || "Gagal memperbarui saldo cuti");
  }

  return data;
}

/**
 * Delete a specific leave balance
 */
export async function deleteLeaveBalance(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok || data.status !== "00") {
    throw new Error(data.message || "Gagal menghapus saldo cuti");
  }

  return data;
}

/**
 * Delete bulk leave balances (Based on Year and Type)
 */
export async function deleteBulkLeaveBalance(year: number, type_code: string) {
  const url = new URL(`${BASE_URL}/bulk`, window.location.origin);
  url.searchParams.append("year", String(year));
  url.searchParams.append("type_code", type_code);

  const res = await fetch(url.toString(), {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok || data.status !== "00") {
    throw new Error(data.message || "Gagal menghapus saldo cuti massal");
  }

  return data;
}
