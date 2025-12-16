import {
  Employee,
  EmployeeDetail,
  EmployeeFormData,
} from "../schemas/employeeSchema";

const BASE_URL = "/api/admin/master/employee";

/**
 * Fetch all employees
 */
export async function getAllEmployees(): Promise<Employee[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch employees");
    }

    const data = await res.json();
    // Accommodate 'master_employees' or 'employees' depending on exact API response
    return data.master_employees || data.employees || [];
  } catch (error) {
    console.error("getAllEmployees error:", error);
    return [];
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
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create employee");
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
