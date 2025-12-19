/* eslint-disable @typescript-eslint/no-explicit-any */

import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";
import { cookies } from "next/dist/client/components/headers";
import { API_ENDPOINTS } from "@/api/api";

export const DELETE = async () => {
  const tokenCookie = cookies().get("token");

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
    cookies().delete("token");
  }

  return NextResponse.json({ message: apiMessage });
};
