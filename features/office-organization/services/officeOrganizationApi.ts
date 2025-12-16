import { OfficeStructure } from "../schemas/officeOrganizationSchema";

const BASE_URL = "/api/admin/organization/office";

/**
 * Fetch all office organizations
 */
export async function getAllOfficeOrganizations(): Promise<OfficeStructure[]> {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch office organizations");
    }

    const data = await res.json();
    return data.offices || [];
  } catch (error) {
    console.error("getAllOfficeOrganizations error:", error);
    return [];
  }
}
