import { Axios } from "@/lib/utils/axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_ENDPOINTS } from "@/api/api";

// FUNGSI GET ANDA (TETAP SAMA)
export const GET = async (request: NextRequest) => {
    try {
        const token = cookies().get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Akses ditolak: Tidak terautentikasi" },
                { status: 401 }
            );
        }

        const response = await Axios.get(API_ENDPOINTS.GETPROFILES, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.error("Gagal mendapatkan data profil:", error.message || error);

        if (error.response) {
            return NextResponse.json(
                {
                    message:
                        error.response.data?.message ||
                        "Gagal mendapatkan data profil dari server.",
                },
                { status: error.response?.status ?? 500 }
            );
        }

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server Next.js." },
            { status: 500 }
        );
    }
};

// --- TAMBAHAN FUNGSI PUT ---
// Ini adalah kode baru untuk menangani request PUT
export const PUT = async (request: NextRequest) => {
    try {
        // 1. Dapatkan token (logika yang sama dengan GET)
        const token = cookies().get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Akses ditolak: Tidak terautentikasi" },
                { status: 401 }
            );
        }

        const formData = await request.formData();

        const response = await Axios.put(
            API_ENDPOINTS.GETPROFILES, // Asumsi endpoint update sama
            formData, 
            {
                headers: {
                   
                    "Authorization": `Bearer ${token}`,
                },
            }
        );

        return NextResponse.json(response.data, { status: 200 });

    } catch (error: any) {
        // 5. Penanganan error (logika yang sama dengan GET)
        console.error("Gagal memperbarui data profil:", error.message || error);

        if (error.response) {
            return NextResponse.json(
                {
                    message:
                        error.response.data?.message ||
                        "Gagal memperbarui data profil di server.",
                },
                { status: error.response?.status ?? 500 }
            );
        }

        return NextResponse.json(
            { message: "Terjadi kesalahan pada server Next.js." },
            { status: 500 }
        );
    }
};