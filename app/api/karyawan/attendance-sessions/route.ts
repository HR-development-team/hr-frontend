/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";

const tokenAvailable = (token: string | null) => {
  if (!token) {
    return NextResponse.json({ message: "Akses ditolak" }, { status: 401 });
  }
  return null;
};

// Handler untuk GETACTIVESESSION
export const GET = async () => {
  const token = getAuthToken();
  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) return unauthorizedResponse;

  try {
    const response = await Axios.get(API_ENDPOINTS.GETALLATTENDANCESESSION, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[API_ERROR] /attendance-sessions (GET):", error.message);
    return NextResponse.json(
      { message: "Gagal mengambil data sesi" },
      { status: error.response?.status || 500 }
    );
  }
};
