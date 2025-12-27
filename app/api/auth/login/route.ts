/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Axios from "axios";
import { API_ENDPOINTS } from "@/api/api";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // 1. Forward the login request to the Backend
    const response = await Axios.post(API_ENDPOINTS.LOGIN, body, {
      withCredentials: true,
    });

    const loginData = response.data;
    const responseToBrowser = NextResponse.json(loginData);
    const backendCookies = response.headers["set-cookie"];

    if (backendCookies) {
      backendCookies.forEach((cookie) => {
        responseToBrowser.headers.append("Set-Cookie", cookie);
      });
    }

    return responseToBrowser;
  } catch (error: any) {
    if (error.response) {
      const backendMessage = error.response.data?.message || "Login gagal";
      const status = error.response.status;
      return NextResponse.json({ message: backendMessage }, { status });
    }

    return NextResponse.json(
      { message: "Tidak dapat terhubung ke server" },
      { status: 500 }
    );
  }
};
