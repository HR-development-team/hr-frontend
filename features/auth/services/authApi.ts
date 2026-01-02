/* eslint-disable @typescript-eslint/no-explicit-any */
import { Axios } from "@/utils/axios"; // Import your custom instance
import { LoginFormData } from "../schemas/loginFormSchema";
import { LoginResponse, RolePermissionResponse, User } from "../types";

const BASE_URL = "/api/auth";

export async function loginUser(
  payload: LoginFormData
): Promise<LoginResponse> {
  const { data } = await Axios.post(`${BASE_URL}/login`, payload);
  console.log(data);
  return data;
}

export async function logoutUser() {
  const { data } = await Axios.delete(`${BASE_URL}/logout`);
  return data;
}

/**
 * Fetches both /me and /profile and merges them
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    // Run both requests in parallel using Axios
    const [meRes, profileRes] = await Promise.all([
      Axios.get(`${BASE_URL}/me`),
      Axios.get(`${BASE_URL}/profile`),
    ]);

    const meData = meRes.data;
    const profileData = profileRes.data;
    const profileUser = profileData.users;

    return {
      role_code: meData.users.role_code,
      email: meData.users.email,
      ...profileUser,
    };
  } catch (error) {
    // Axios interceptor will handle 401s automatically.
    // We just log other errors here.
    console.error("Error fetching user data", error);
    return null;
  }
}

/**
 * Fetches /permissions for the current user
 */
export async function fetchCurrentUserPermissions(): Promise<RolePermissionResponse | null> {
  try {
    const { data } = await Axios.get(`${BASE_URL}/permission`);
    return data;
  } catch (error: any) {
    // If it's a 401, the interceptor handles the redirect.
    // If it's another error, we re-throw it so the caller knows.
    console.error("Failed to fetch permissions:", error);
    throw error;
  }
}

export async function keepSessionAlive(): Promise<void> {
  try {
    await Axios.post(`${BASE_URL}/keep-alive`);
  } catch (error) {
    // Fails silently so it doesn't disrupt the user UI
    console.error("Error extending session", error);
  }
}
