import { PositionStructure } from "@/lib/types/organization";
import { NextResponse } from "next/server";

const positionDummyData: PositionStructure[] = [
  {
    id: 1,
    position_code: "JBT-HQ-001",
    name: "Direktur Utama",
    employee_code: "EMP-HQ-001",
    employee_name: "Budi Hartono",
    children: [
      {
        id: 2,
        position_code: "JBT-HQ-002",
        name: "Manajer HR",
        employee_code: "EMP-HQ-002",
        employee_name: "Patrick Star",
        children: [
          {
            id: 3,
            position_code: "JBT-HQ-003",
            name: "Staff HR Recruitment",
            employee_code: "EMP-HQ-003",
            employee_name: "Spongebob Squarepants",
            children: [],
          },
          {
            id: 4,
            position_code: "JBT-HQ-004",
            name: "Staff HR Payroll",
            employee_code: "EMP-HQ-004",
            employee_name: "Sandy Cheeks",
            children: [],
          },
        ],
      },
      {
        id: 5,
        position_code: "JBT-HQ-005",
        name: "Manajer Keuangan",
        employee_code: "EMP-HQ-005",
        employee_name: "Eugene Krabs",
        children: [],
      },
    ],
  },
  // Node root kedua (Independen)
  {
    id: 6,
    position_code: "JBT-HQ-006",
    name: "VP Teknologi (Independent)",
    employee_code: "EMP-HQ-006",
    employee_name: "Squidward Tentacles",
    children: [
      {
        id: 7,
        position_code: "JBT-HQ-007",
        name: "IT Support",
        employee_code: "EMP-HQ-007",
        employee_name: "Plankton",
        children: [],
      },
    ],
  },
];

export async function GET() {
  return NextResponse.json({
    status: "00",
    message: "Berhasil mendapatkan data karyawan",
    position: positionDummyData,
  });
}
