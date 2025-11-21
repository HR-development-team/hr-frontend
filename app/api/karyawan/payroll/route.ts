import { getAuthToken } from "@/lib/utils/authUtils";
import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/api/api";
import { Axios } from "@/lib/utils/axios";

export const GET = async (request: Request) => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terautentikasi" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  // Ambil ID karyawan jika ada (sesuaikan nama paramnya, misal 'id' atau 'employeeId')
  const id = searchParams.get("employeeId") || searchParams.get("id") || "";
  const query = searchParams.toString();

  try {
    let url = "";

    // CEK TYPE: Apakah endpoint ini function (butuh ID) atau string biasa?
    if (typeof API_ENDPOINTS.GETPAYROLLBYID === "function") {
      if (!id) {
        return NextResponse.json(
          { message: "Employee ID diperlukan untuk endpoint ini." },
          { status: 400 }
        );
      }
      // Panggil function-nya dengan ID
      // @ts-ignore (Gunakan ini jika TS masih rewel meski sudah dicek typeof)
      url = API_ENDPOINTS.GET_PAYROLL(id);
    } 
    // Tambahkan query params sisa jika ada (selain ID yang sudah dipakai di atas)
    if (query) {
       // Cek apakah url sudah punya '?' atau belum
       const separator = url.includes("?") ? "&" : "?";
       url = `${url}${separator}${query}`;
    }

    const response = await Axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.log("Gagal mendapatkan data payroll:", error.response?.data);
    if (error.response) {
      return NextResponse.json(
        {
          message:
            error.response.data?.message ||
            "Gagal mendapatkan data payroll dari server.",
        },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
};