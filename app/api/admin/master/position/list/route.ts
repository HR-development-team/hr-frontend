/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { API_ENDPOINTS } from "@/api/api";

const tokenAvailable = (token: string | null) => {
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }

  return null;
};

// This endpoint is specific for DROPDOWNS
export const GET = async (request: NextRequest) => {
  const token = getAuthToken();

  const unauthorizedResponse = tokenAvailable(token);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const officeCode = searchParams.get("office_code");
    const departmentCode = searchParams.get("department_code");
    const divisionCode = searchParams.get("division_code");

    const response = await Axios.get(API_ENDPOINTS.GETPOSITIONOPTION, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        office_code: officeCode,
        department_code: departmentCode,
        division_code: divisionCode,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Gagal mendapatkan data master jabatan" },
      { status: 500 }
    );
  }
};
