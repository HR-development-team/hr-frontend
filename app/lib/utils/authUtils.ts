import { cookies } from "next/headers";

export function getAuthToken(): string | null {
  const tokenCookie = cookies().get("token");
  return tokenCookie?.value || null;
}
