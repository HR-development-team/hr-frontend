import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params; // Ini akan bernilai "3" jika Anda login sebagai ID 3

  console.log(`[API MOCK] Request masuk untuk Employee ID: ${id}`);

  try {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulasi loading

    // ============================================================
    // 🟢 MOCK DATA DINAMIS (MENGIKUTI ID)
    // ============================================================
    
    // Kita buat data dummy yang ID-nya berubah sesuai request URL
    const mockData = [
      {
        id: 101 + Number(id), // ID Payroll jadi unik (misal 104)
        generated_at: "25 Oktober 2025",
        period_label: "Oktober 2025",
        gross_salary: 9100000,
        total_deductions: 800000,
        net_salary: 8300000,
        employee: {
          id: Number(id), // <--- PENTING: ID Karyawan mengikuti parameter URL (3)
          name: `Karyawan Demo ${id}`, // Nama berubah biar kelihatan bedanya
          nik: "12345678",
          position: "Software Engineer",
          department: "IT",
          bank_account: "BCA 123-456-7890",
          email: `user${id}@example.com`
        },
        earnings: [
          { label: "Gaji Pokok", amount: 8000000 },
          { label: "Tunjangan Transport", amount: 500000 },
          { label: "Tunjangan Makan", amount: 600000 }
        ],
        deductions: [
          { label: "BPJS Kesehatan", amount: 200000 },
          { label: "BPJS Ketenagakerjaan", amount: 150000 },
          { label: "PPH 21", amount: 450000 }
        ]
      },
      // Data Bulan Lalu
      {
        id: 100 + Number(id), 
        generated_at: "25 September 2025",
        period_label: "September 2025",
        gross_salary: 8500000,
        total_deductions: 500000,
        net_salary: 8000000,
        employee: {
          id: Number(id), // <--- PENTING: ID Karyawan mengikuti parameter URL (3)
          name: `Karyawan Demo ${id}`,
          nik: "12345678",
          position: "Software Engineer",
          department: "IT",
          bank_account: "BCA 123-456-7890",
          email: `user${id}@example.com`
        },
        earnings: [
          { label: "Gaji Pokok", amount: 8000000 },
          { label: "Tunjangan Transport", amount: 500000 }
        ],
        deductions: [
          { label: "BPJS Kesehatan", amount: 200000 },
           { label: "Potongan Terlambat", amount: 300000 }
        ]
      }
    ];

    // Jika ID = 99 (Contoh kasus user tidak punya gaji)
    if (id === '99') {
        return NextResponse.json([]);
    }

    return NextResponse.json(mockData);

  } catch (error: any) {
    console.error(`[API_ERROR] Mocking Error`, error);
     return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};