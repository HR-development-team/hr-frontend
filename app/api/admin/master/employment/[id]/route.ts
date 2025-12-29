/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS } from "@/api/api";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextRequest, NextResponse } from "next/server";

interface paramsProp {
  params: {
    id: string;
  };
}

// Consistent helper
const validateToken = (token: string | null) => {
  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terauntetikasi" },
      { status: 401 }
    );
  }
  return null;
};

export const GET = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const response = await Axios.get(
      API_ENDPOINTS.GETEMPLOYEMENTBYID(params.id),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Dynamic status handling
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data master status karyawan",
    };

    return NextResponse.json(data, { status });
  }
};

export const PUT = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const body = await request.json();

    const response = await Axios.put(
      API_ENDPOINTS.EDITEMPLOYEMENTSTATUS(params.id),
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Return FULL data (crucial for validation errors)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mengedit data master status karyawan",
    };

    return NextResponse.json(data, { status });
  }
};

export const DELETE = async (request: NextRequest, { params }: paramsProp) => {
  const token = getAuthToken();
  const authError = validateToken(token);
  if (authError) return authError;

  try {
    const response = await Axios.delete(
      API_ENDPOINTS.DELETEEMPLOYEMENTSTATUS(params.id),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal menghapus data master status karyawan",
    };

    return NextResponse.json(data, { status });
  }
};
