/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINTS } from "@/api/api";
import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * @handler GET /api/employee/dashboard/metrics
 * @description Meneruskan request untuk mengambil metrik dashboard karyawan
 * dari API backend setelah memverifikasi token.
 */
export const GET = async () => {
  try {
    // 1. Dapatkan token dari cookies
    const token = cookies().get("token")?.value;

    // 2. Validasi autentikasi
    if (!token) {
      return NextResponse.json(
        { message: "Akses ditolak: Tidak terautentikasi" },
        { status: 401 }
      );
    }

    // 3. Teruskan request ke API Backend
    // Asumsi: API_ENDPOINTS.GETEMPLOYEEDASHBOARD berisi URL backend
    const response = await Axios.get(API_ENDPOINTS.GETEMPLOYEEDASHBOARD, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Teruskan token
      },
    });

    // 4. Kembalikan data dari API Backend ke client
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    // 5. Penanganan error (mengikuti model Anda)
    console.error("Gagal mendapatkan data dashboard:", error.message || error);

    // Jika error datang dari Axios (API backend)
    if (error.response) {
      return NextResponse.json(
        {
          message:
            error.response.data?.message ||
            "Gagal mendapatkan data dashboard dari server.",
        },
        { status: error.response?.status ?? 500 }
      );
    }

    // Jika error terjadi di server Next.js
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server Next.js." },
      { status: 500 }
    );
  }
};
