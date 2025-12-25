import { LoginFormData } from "../schemas/loginFormSchema";
import { LoginResponse, RolePermissionResponse, User } from "../types";

const BASE_URL = "/api/auth";

export async function loginUser(
  payload: LoginFormData
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Login Failed");
  }

  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${BASE_URL}/logout`, { method: "DELETE" });
  if (!res.ok) throw new Error("Logout Failed");
  return res.json();
}

/**
 * Fetches both /me and /profile and merges them
 */
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    // Run both requests in parallel
    const [meRes, profileRes] = await Promise.all([
      fetch(`${BASE_URL}/me`, { cache: "no-store" }),
      fetch(`${BASE_URL}/profile`, { cache: "no-store" }),
    ]);

    if (!meRes.ok || !profileRes.ok) return null;

    const meData = await meRes.json();
    const profileData = await profileRes.json();
    const profileUser = profileData.users;

    return {
      role_code: meData.users.role_code,
      email: meData.users.email,
      ...profileUser,
    };
  } catch (error) {
    console.error("Error fetching user data", error);
    return null;
  }
}

/**
 * Fetches /permissions for the current user
 */
export async function fetchCurrentUserPermissions(): Promise<RolePermissionResponse | null> {
  const res = await fetch(`${BASE_URL}/permission`, { cache: "no-store" });

  if (!res.ok) {
    const errorData = await res.json();
    console.log("error data: ", errorData);

    const error = new Error(errorData.message || "Failed to fetch permissions");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (error as any).status = res.status;

    throw error;
  }

  return res.json();
}

export async function keepSessionAlive(): Promise<void> {
  try {
    const res = await fetch(`${BASE_URL}/keep-alive`, {
      method: "POST",
    });

    if (!res.ok) {
      console.warn("Failed to extend session:", res.statusText);
    }
  } catch (error) {
    // Fails silently so it doesn't disrupt the user UI
    console.error("Error extending session", error);
  }
}
