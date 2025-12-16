/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
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
    // 🔹 Panggil endpoint USERS dari backend kamu
    const response = await Axios.get(API_ENDPOINTS.GETALLUSER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // 🔹 Jika respons sukses, kembalikan data ke frontend
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Gagal mendapatkan data users:", error);

    // 🔹 Jika backend merespons error
    if (error.response) {
      return NextResponse.json(
        {
          message:
            error.response.data?.message ||
            "Gagal mendapatkan data users dari server.",
        },
        { status: error.response.status || 500 }
      );
    }

    // 🔹 Jika error tidak diketahui
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server Next.js." },
      { status: 500 }
    );
  }
};
