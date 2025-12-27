import { Employement, EmploymentOption } from "../schemas/employmentSchema";

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
    return data.employment_status || [];
  } catch (error) {
    console.error("getAllEmployees error:", error);
    return [];
  }
}

/**
 * Get a list for dropdown
 */
export async function getEmployementList(): Promise<EmploymentOption[] | null> {
  try {
    const res = await fetch(`${BASE_URL}/list`);
    console.log("value list: ", res);
    if (!res.ok) {
      throw new Error("Failed to fetch employment options");
    }

    const data = await res.json();
    return data.employment_status;
  } catch (error) {
    console.error("getEmploymentOption error:", error);
    return null;
  }
}
