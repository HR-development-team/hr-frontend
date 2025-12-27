/* eslint-disable @typescript-eslint/no-explicit-any */

import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/api/api";

export const DELETE = async () => {
  const cookieStore = cookies();
  const tokenCookie = cookieStore.get("accessToken");

  // If cookie is already gone, return success immediately
  if (!tokenCookie) {
    return NextResponse.json(
      { message: "Sudah keluar (Tidak ada sesi aktif)" },
      { status: 200 }
    );
  }

  const token = tokenCookie.value;
  let apiMessage = "Berhasil logout";

  try {
    const response = await Axios.delete(API_ENDPOINTS.LOGOUT, {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    apiMessage = response.data?.message || "Berhasil logout";
  } catch (error: any) {
    console.error("Backend logout failed:", error.message);
  } finally {
    cookieStore.delete("accessToken");
  }

  return NextResponse.json({ message: apiMessage });
};
