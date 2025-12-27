import { cookies } from "next/headers";

export function getAuthToken(): string | null {
  const tokenCookie = cookies().get("accessToken");
  return tokenCookie?.value || null;
}
