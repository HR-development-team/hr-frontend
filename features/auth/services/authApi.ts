// features/auth/services/authApi.ts
import { LoginFormData } from "../schemas/loginFormSchema";
import { LoginResponse, User } from "../types";

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
 * This replaces your 'fetchMultiple' logic
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
