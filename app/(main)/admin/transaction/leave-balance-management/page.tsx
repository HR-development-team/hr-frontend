import { ChartPie } from "lucide-react";
import { Card } from "primereact/card";

export default function BalanceManagement() {
  return (
    <div>
      <div className="mb-6 flex align-items-center gap-3 mt-4">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <ChartPie className="w-2rem h-2rem" />
        </div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            Managemen Saldo Cuti
          </h1>

          <p className="text-sm md:text-md text-gray-500">
            Kelola saldo cuti untuk semua atau salah satu karyawan
          </p>
        </div>
      </div>

      <Card></Card>
    </div>
  );
}
