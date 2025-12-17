/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAuthToken } from "@features/auth/utils/authUtils";
import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/api/api";
import { Axios } from "@/utils/axios";

export const GET = async () => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    // Panggil endpoint profil dari backend kamu
    const response = await Axios.get(API_ENDPOINTS.GETPROFILES, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Gagal mendapatkan data profil:", error.response.data);
    if (error.response) {
      return NextResponse.json(
        {
          message:
            error.response.data?.message ||
            "Gagal mendapatkan data profil dari server.",
        },
        { status: error.response.data.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
};
