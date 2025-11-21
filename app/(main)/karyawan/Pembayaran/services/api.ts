import { Payroll } from "../types";

export const getPayrollData = async (payrollId: string): Promise<Payroll[]> => {
  try {
    // Memanggil Route Next.js yang sudah kita buat sebelumnya
    // URL ini mengarah ke: src/app/api/payroll-periods/[id]/route.ts
    const res = await fetch(`/api/karyawan/payroll-periods/${payrollId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Agar data tidak dicache (selalu fresh)
    });

    if (!res.ok) {
      throw new Error("Gagal mengambil data dari server");
    }

    return await res.json();
  } catch (error) {
    console.error("Service Error:", error);
    return []; 
  }
};