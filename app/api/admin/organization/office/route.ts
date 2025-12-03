import { OfficeStructure } from "@/lib/types/organization";
import { NextResponse } from "next/server";

// Data Dummy Office (Yang sebelumnya di frontend)
const officeOrgDummyData: OfficeStructure[] = [
  {
    id: 1,
    office_code: "OFC-HQ-001",
    name: "Kantor Pusat Jakarta",
    address: "Jl. Jendral Sudirman No. 1, Jakarta Pusat",
    description: "Head Quarter (HQ) - Pusat Operasional Nasional",
    children: [
      {
        id: 1,
        office_code: "OFC-REG-001",
        name: "Kantor Wilayah 1 (Jawa Barat)",
        address: "Jl. Asia Afrika No. 55, Bandung",
        description: "Membawahi area operasional Jawa Barat",
        children: [
          {
            id: 1,
            office_code: "OFC-BRC-001",
            name: "Kantor Cabang Bandung Kota",
            address: "Jl. Braga No. 10, Bandung",
            description: "Cabang Utama Bandung",
            children: [
              {
                id: 1,
                office_code: "OFC-UNT-001",
                name: "Unit Pelayanan Dago",
                address: "Jl. Ir. H. Juanda No. 40, Bandung",
                description: "Unit layanan khusus area Dago",
                children: [],
              },
              {
                id: 2,
                office_code: "OFC-UNT-002",
                name: "Unit Pelayanan Buah Batu",
                address: "Jl. Buah Batu No. 20, Bandung",
                description: "Unit layanan khusus area Buah Batu",
                children: [],
              },
            ],
          },
          {
            id: 1,
            office_code: "OFC-BRC-002",
            name: "Kantor Cabang Bogor",
            address: "Jl. Pajajaran No. 12, Bogor",
            description: "Cabang Utama Bogor",
            children: [],
          },
        ],
      },
      {
        id: 1,
        office_code: "OFC-REG-002",
        name: "Kantor Wilayah 2 (Jawa Timur)",
        address: "Jl. Pemuda No. 88, Surabaya",
        description: "Membawahi area operasional Jawa Timur",
        children: [
          {
            id: 1,
            office_code: "OFC-BRC-003",
            name: "Kantor Cabang Surabaya",
            address: "Jl. Darmo No. 5, Surabaya",
            description: "Cabang Utama Surabaya",
            children: [],
          },
          {
            id: 1,
            office_code: "OFC-BRC-004",
            name: "Kantor Cabang Malang",
            address: "Jl. Ijen No. 3, Malang",
            description: "Cabang Utama Malang",
            children: [
              {
                id: 1,
                office_code: "OFC-UNT-003",
                name: "Unit Pelayanan Batu",
                address: "Jl. Diponegoro No. 1, Batu",
                description: "Unit layanan wisata Batu",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 1,
    office_code: "OFC-HQ-002",
    name: "Gudang Logistik Utama (Cikarang)",
    address: "Kawasan Industri Jababeka II, Cikarang",
    description: "Pusat distribusi logistik terpisah dari HQ",
    children: [],
  },
];

export async function GET() {
  // Opsional: Simulasi loading (delay 1 detik) agar spinner di frontend terlihat
  // await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({
    status: "00",
    message: "Berhasil mendapatkan data kantor (Dummy)",
    offices: officeOrgDummyData,
  });
}
