import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { Employement, EmploymentOption } from "../schemas/employmentSchema";

const BASE_URL = "/api/admin/master/employment";

/**
 * Fetch all employment status
 */
export async function getAllEmploymentStatus(): Promise<Employement[]> {
  try {
    const { data } = await Axios.get(BASE_URL);
    return data.employment_status || [];
  } catch (error) {
    console.error("getAllEmploymentStatus error:", error);
    return [];
  }
}

/**
 * Get a list for dropdown
 */
export async function getEmployementList(): Promise<EmploymentOption[] | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/list`);
    return data.employment_status;
  } catch (error) {
    console.error("getEmploymentOption error:", error);
    return null;
  }
}
