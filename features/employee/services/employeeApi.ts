/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericApiResponse } from "@/utils/apiResponse";
import {
  Employee,
  EmployeeDetail,
  EmployeeFormData,
} from "../schemas/employeeSchema";
type EmployeeResponse = GenericApiResponse<Employee>;

const BASE_URL = "/api/admin/master/employee";

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  office_code?: string;
  department_code?: string;
  division_code?: string;
  position_code?: string;
  [key: string]: any;
}

/**
 * Fetch all employees
 */
export async function getAllEmployees(
  params?: GetEmployeesParams
): Promise<EmployeeResponse> {
  try {
    const queryString = params
      ? `?${new URLSearchParams(params as any).toString()}`
      : "";

    const res = await fetch(`${BASE_URL}${queryString}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employees");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("getAllEmployees error:", error);
    return {
      status: "99",
      message: "Failed to fetch employees",
      datetime: new Date().toISOString(),
      master_positions: [],
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    };
  }
}

/**
 * Fetch a single employee by ID
 */
export async function getEmployeeById(
  id: number
): Promise<EmployeeDetail | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employee details");
    }

    const data = await res.json();
    // Check for master_employees (if wrapped in array) or singular 'employee' key
    return data.master_employees || data.employee || null;
  } catch (error) {
    console.error("getEmployeeById error:", error);
    return null;
  }
}

/**
 * Create a new employee
 */
export async function createEmployee(payload: EmployeeFormData) {
  // console.log(payload);
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    // 1. Parse the rich error data from the backend
    const errorData = await res.json().catch(() => ({}));

    // 2. THROW THE DATA, NOT A NEW ERROR
    // This passes the object { message: "...", errors: [...] }
    // straight to your hook's catch block.
    throw errorData;
  }

  return res.json();
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id: number, payload: EmployeeFormData) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to update employee");
  }

  return res.json();
}

/**
 * Delete an employee
 */
export async function deleteEmployee(id: number) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete employee");
  }

  return res.json();
}
