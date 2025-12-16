/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtVerify } from "jose";

export async function getSecretKey() {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY tidak ditemukan di environment variables");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyToken(token: string) {
  try {
    const secretKey = await getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error: any) {
    console.error("Verifikasi JWT Gagal", error);
    return null;
  }
}
