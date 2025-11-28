import { Payroll } from "@/lib/types/payroll";

// Perbaikan path URL jika perlu, pastikan endpoint ini benar ada di backend
export const getPayrollData = async (payrollId: string): Promise<Payroll[]> => {
  try {
    const res = await fetch(`/api/karyawan/payroll-periods/${payrollId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", 
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