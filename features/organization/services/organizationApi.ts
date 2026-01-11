import { Axios } from "@/utils/axios"; // Use custom Axios instance
import { PositionStructure, SafeTreeNode } from "../schemas/organizationSchema";

const BASE_URL = "/api/admin/organization";

/**
 * Fetch all office organizations
 */
export async function getAllOfficeOrganizations(): Promise<SafeTreeNode[]> {
  try {
    const { data } = await Axios.get(BASE_URL);

    return data.organization || [];
  } catch (error) {
    console.error("getAllOfficeOrganizations error:", error);
    return [];
  }
}

/**
 * Fetch office structure by office code
 */
export async function getOfficeHierarchyByOfficeCode(
  officeCode: string
): Promise<SafeTreeNode[]> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/office/${officeCode}`);
    console.log(data.organization);
    return data.organization || [];
  } catch (error) {
    console.error("getOfficeHierarchyByOffice error:", error);
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
    const { data } = await Axios.get(`${BASE_URL}/position/${officeCode}`);
    return data.master_positions || [];
  } catch (error) {
    console.error("getPositionHierarchyByOffice error:", error);
    return [];
  }
}
