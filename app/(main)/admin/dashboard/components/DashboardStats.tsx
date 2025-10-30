import StatsCard from "../../components/StatsCard";
import { Card } from "primereact/card";

export default function DashboardStats() {
  const statsData = [
    {
      title: "Total Karyawan",
      value: "156",
      description: "Aktif",
      trend: { value: "12%", isPositive: true },
      icon: "pi pi-users",
    },
    {
      title: "Cuti Pending",
      value: "8",
      description: "Menunggu persetujuan",
      trend: { value: "2", isPositive: false },
      icon: "🏖️",
    },
    {
      title: "Absensi Hari Ini",
      value: "142",
      description: "Hadir / 156 total",
      trend: { value: "94%", isPositive: true },
      icon: "⏰",
    },
    {
      title: "Saldo Cuti",
      value: "12",
      description: "Rata-rata per karyawan",
      trend: { value: "0", isPositive: true },
      icon: "📅",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          trend={stat.trend}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
