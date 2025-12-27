import { Axios } from "@/utils/axios"; // Use custom Axios instance
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
    const { data } = await Axios.get(BASE_URL);
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
    const { data } = await Axios.get(`${BASE_URL}/${officeCode}`);
    return data.master_positions || [];
  } catch (error) {
    console.error("getPositionHierarchyByOffice error:", error);
    return [];
  }
}
