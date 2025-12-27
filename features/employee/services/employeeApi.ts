/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Use custom Axios instance
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
    // Axios handles query param serialization automatically
    const { data } = await Axios.get(BASE_URL, { params });
    return data;
  } catch (error) {
    console.error("getAllEmployees error:", error);
    // Return safe fallback
    // (If 401, interceptor redirects before this returns)
    return {
      status: "99",
      message: "Failed to fetch employees",
      datetime: new Date().toISOString(),
      master_positions: [], // Make sure this key matches your actual API response key (likely 'master_employees')
      meta: { page: 0, total: 0, limit: 0, total_page: 0 },
    } as any;
  }
}

/**
 * Fetch a single employee by ID
 */
export async function getEmployeeById(
  id: number
): Promise<EmployeeDetail | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/${id}`);
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
  try {
    // Axios automatically serializes JSON and sets Content-Type
    const { data } = await Axios.post(BASE_URL, payload);
    return data;
  } catch (error: any) {
    // Handling specific validation errors from backend
    if (error.response && error.response.data) {
      // Throw the actual data object so the hook can read `message` and `errors`
      throw error.response.data;
    }
    throw error;
  }
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id: number, payload: EmployeeFormData) {
  try {
    const { data } = await Axios.put(`${BASE_URL}/${id}`, payload);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw new Error("Failed to update employee");
  }
}

/**
 * Delete an employee
 */
export async function deleteEmployee(id: number) {
  try {
    const { data } = await Axios.delete(`${BASE_URL}/${id}`);
    return data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw error.response.data; // Pass specific error message if available
    }
    throw new Error("Failed to delete employee");
  }
}
