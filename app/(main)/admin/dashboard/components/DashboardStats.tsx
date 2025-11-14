import { Calendar, ClipboardCheck, TreePalm, Users } from "lucide-react";
import StatsCard from "../../components/StatsCard";
import { StatData } from "@/lib/types/statData";

const statsData = (data: StatData) => [
  {
    title: "Total Karyawan",
    value: data?.totalEmployee,
    description: "Aktif",
    icon: <Users />,
  },
  {
    title: "Cuti Pending",
    value: data?.totalLeaveRequest,
    description: "Menunggu persetujuan",
    icon: <TreePalm />,
  },
  {
    title: "Absensi Hari Ini",
    value: data?.totalAttendance,
    description: `Hadir / ${data.totalEmployee} karyawan`,
    icon: <ClipboardCheck />,
  },
  {
    title: "Saldo Cuti",
    value: data?.totalLeaveBalance,
    description: "Rata-rata per karyawan",
    icon: <Calendar />,
  },
];
export default function DashboardStats({
  data,
  isLoading,
}: {
  data: StatData;
  isLoading: boolean;
}) {
  return (
    <div className="grid">
      {statsData(data).map((stat, index) => (
        <div className="col-12 md:col-6 lg:col-3">
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            isLoading={isLoading}
          />
        </div>
      ))}
    </div>
  );
}
