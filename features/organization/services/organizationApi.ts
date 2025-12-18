import {
  OfficeStructure,
  PositionStructure,
} from "../schemas/organizationSchema";

const BASE_URL = "/api/admin/organization";

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

/**
 * Fetch position hierarchy by office code
 */
export async function getPositionHierarchyByOffice(
  officeCode: string
): Promise<PositionStructure[]> {
  try {
    const res = await fetch(`${BASE_URL}/${officeCode}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch positions organizations");
    }

    const data = await res.json();
    return data.master_positions || [];
  } catch (error) {
    console.error("getPositionHierarchyByOffice error:", error);
    return [];
  }
}
