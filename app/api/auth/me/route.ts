/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAuthToken } from "@features/auth/utils/authUtils";
import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/api/api";

export const GET = async () => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await Axios.get(API_ENDPOINTS.GETUSER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Pass the actual error from the backend (status and data)
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: "Gagal mendapatkan data user",
    };

    return NextResponse.json(data, { status });
  }
};
