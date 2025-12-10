import {
  ArrowRight,
  Building,
  ChartArea,
  ClipboardCheck,
  FastForward,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge"; // Tambahkan ini jika menggunakan PrimeReact Badge
import { ReactNode } from "react";

interface QuickMenu {
  icon: ReactNode;
  label: string;
  description: string;
  href: string;
  color: string;
  badge?: number;
}

const actions = (data: number): QuickMenu[] => [
  {
    icon: <Plus size={24} />,
    label: "Tambah Karyawan",
    description: "Input data karyawan baru",
    href: "/admin/master/employees",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: <ClipboardCheck size={24} />,
    label: "Persetujuan Cuti",
    description: "Cek permintaan cuti",
    href: "/admin/transaction/leave-request",
    color: "text-orange-600 bg-orange-50",
    badge: data > 0 ? data : undefined,
  },
  {
    icon: <ChartArea size={24} />,
    label: "Laporan Absensi",
    description: "Generate laporan bulanan",
    href: "#",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: <Building size={24} />,
    label: "Update Struktur",
    description: "Edit organisasi",
    href: "#",
    color: "text-purple-600 bg-purple-50",
  },
];

export default function QuickActions({ data }: { data: number }) {
  const menuItems = actions(data);

  return (
    <Card className="surface-0 shadow-2 border-round-xl">
      <div className="flex flex-column gap-4">
        {/* Header */}
        <div className="flex align-items-center justify-content-between">
          <div className="flex align-items-center gap-2 text-700">
            <div className="bg-primary-50 p-2 border-round">
               <FastForward className="h-15 w-15 text-primary" />
            </div>
            <span className="font-bold text-lg text-900">Quick Actions</span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid formgrid">
          {menuItems.map((action, index) => (
            <div key={index} className="col-12 md:col-6 p-2">
              <Link href={action.href} className="no-underline">
                <Button
                  className="w-full bg-white border-1 border-gray-200 hover:border-primary-500 shadow-none hover:shadow-2 transition-all p-3 h-full flex align-items-start text-left"
                  style={{ borderRadius: '12px' }}
                >
                  <div className="flex gap-3 align-items-center w-full">
                    
                    {/* Icon dengan Background Berwarna */}
                    <div className={`p-3 border-round-lg flex align-items-center justify-content-center ${action.color}`}>
                      {action.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex align-items-center gap-2">
                        <span className="font-bold text-900 text-sm">
                          {action.label}
                        </span>
                        {/* Menampilkan Badge jika ada */}
                        {action.badge && (
                           <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 border-round-xl">
                             {action.badge} Pending
                           </span>
                        )}
                      </div>
                      <p className="text-500 text-xs m-0 mt-1 line-height-3">
                        {action.description}
                      </p>
                    </div>

                    <div className="text-400">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}