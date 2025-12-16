/* eslint-disable @typescript-eslint/no-explicit-any */

import { getAuthToken } from "@features/auth/utils/authUtils";
import { verifyToken } from "@features/auth/utils/verifyToken";
import { Axios } from "@/utils/axios";
import { NextResponse } from "next/server";
import { API_ENDPOINTS } from "@/api/api";

export const GET = async () => {
  const token = getAuthToken();

  try {
    if (token) {
      await verifyToken(token);
    }

    const response = await Axios.get(API_ENDPOINTS.GETUSER, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      { message: "Gagal mendapatkan data master divisi" },
      { status: 500 }
    );
  }
};
