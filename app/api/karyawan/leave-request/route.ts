import { NextRequest, NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/app/api/api";
import { getAuthToken } from "@/lib/utils/authUtils";
import { Axios } from "@/lib/utils/axios";

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken();
    if (!token) {
      return NextResponse.json({ status: "01", message: "Unauthorized" }, { status: 401 });
    }

    // 🔹 Ambil semua data cuti
    const res = await Axios.get(API_ENDPOINTS.LEAVEREQUEST, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allRequests = res.data?.leave_requests || [];

    // 🔹 Decode token untuk ambil employee_id
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const employeeId = payload?.employee_id;

    // 🔹 Filter hanya milik user yang login
    const filtered = allRequests.filter((item: any) => item.employee_id === employeeId);

    return NextResponse.json({
      status: "00",
      message: "Berhasil mendapatkan data cuti user",
      leave_requests: filtered,
    });
  } catch (error: any) {
    console.error("❌ Error GET Leave Request:", error);
    return NextResponse.json({ status: "01", message: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken();
    if (!token) {
      return NextResponse.json({ status: "01", message: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.json();

    // 🔹 Decode token untuk ambil employee_id
    const decoded = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    const employeeId = decoded?.employee_id;

    // 🔹 Tambahkan employee_id otomatis ke body
    const bodyWithEmployee = {
      ...payload,
      employee_id: employeeId,
    };

    // 🔹 Kirim ke API utama
    const response = await Axios.post(API_ENDPOINTS.LEAVEREQUEST, bodyWithEmployee, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("❌ Error POST Leave Request:", error);
    return NextResponse.json(
      { status: "01", message: "Gagal mengirim pengajuan cuti" },
      { status: 500 }
    );
  }
}
