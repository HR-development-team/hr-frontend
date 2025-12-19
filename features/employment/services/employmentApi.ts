import { Employement } from "../schemas/employmentSchema";

const BASE_URL = "/api/admin/master/employment";

/**
 * Fetch all employment status
 */
export async function getAllEmploymentStatus(): Promise<Employement[]> {
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
    return data.employment_status || [];
  } catch (error) {
    console.error("getAllEmployees error:", error);
    return [];
  }
}
