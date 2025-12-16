/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from "next/server";
import { Axios } from "@/utils/axios";
import { getAuthToken } from "@features/auth/utils/authUtils";
import { API_ENDPOINTS } from "../../api";

// GET: Ambil data profil
export const GET = async (request: NextRequest) => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const response = await Axios.get(API_ENDPOINTS.GETUSER, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Gagal mendapatkan data profil:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message ||
          "Gagal mendapatkan data profil dari server.",
      },
      { status: error.response?.status || 500 }
    );
  }
};

// PUT: Update data profil
export const PUT = async (request: NextRequest) => {
  const token = getAuthToken();

  if (!token) {
    return NextResponse.json(
      { message: "Akses ditolak: Tidak terautentikasi" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();

    const contact_phone = formData.get("contact_phone");
    const address = formData.get("address");
    const profile_image = formData.get("profile_image") as File | null;

    const backendData = new FormData();
    if (contact_phone)
      backendData.append("contact_phone", contact_phone.toString());
    if (address) backendData.append("address", address.toString());
    if (profile_image) backendData.append("profile_image", profile_image);

    const response = await Axios.put(
      API_ENDPOINTS.UPDATEUSERPROFILE,
      backendData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Gagal memperbarui profil:", error);
    return NextResponse.json(
      {
        message:
          error.response?.data?.message || "Gagal memperbarui data profil.",
      },
      { status: error.response?.status || 500 }
    );
  }
};
