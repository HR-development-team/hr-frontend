import { Calendar, ClipboardCheck, TreePalm, Users } from "lucide-react";
import StatsCard from "../../components/StatsCard";
import { StatData } from "@/lib/types/statData";
import React from "react";

export default function DashboardStats({
  data,
  isLoading,
}: {
  data: StatData;
  isLoading: boolean;
}) {
  const statsData = (data: StatData) => [
    {
      title: "Total Karyawan",
      value: data?.totalEmployee,
      description: "Aktif",
      icon: <Users className="text-blue-500" />,
      iconClassName: "bg-blue-100",
      borderRightClassName: "border-left-3 border-blue-500",
      showProgress: false,
    },
    {
      title: "Cuti Pending",
      value: data?.totalLeaveRequest,
      description: "Menunggu persetujuan",
      icon: <TreePalm className="text-orange-500" />,
      iconClassName: "bg-orange-100",
      borderRightClassName: "border-left-3 border-orange-500",
      showProgress: false,
    },
    {
      title: "Absensi Hari Ini",
      value: data?.totalAttendance,
      description: `Hadir / ${data.totalEmployee} karyawan`,
      icon: <ClipboardCheck className="text-green-500" />,
      iconClassName: "bg-green-100",
      borderRightClassName: "border-left-3 border-green-500",
      showProgress: true,
      progressValue: data.totalEmployee
        ? Math.round((data.totalAttendance / data.totalEmployee) * 100)
        : 0,
      progressTemplate: () => (
        <React.Fragment>
          <b>
            {data.totalAttendance} / {data.totalEmployee}
          </b>
        </React.Fragment>
      ),
    },
    {
      title: "Saldo Cuti",
      value: data?.totalLeaveBalance,
      description: "Rata-rata per karyawan",
      icon: <Calendar className="text-purple-500" />,
      iconClassName: "bg-purple-100",
      borderRightClassName: "border-left-3 border-purple-500",
      showProgress: false,
    },
  ];

  return (
    <div className="grid">
      {statsData(data).map((stat, index) => (
        <div key={index} className="col-12 md:col-6 lg:col-3">
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            isLoading={isLoading}
            iconClassName={stat.iconClassName}
            borderRightClassName={stat.borderRightClassName}
            showProgress={stat.showProgress}
            progressTemplate={stat.progressTemplate}
            progressValue={stat.progressValue}
          />
        </div>
      ))}
    </div>
  );
}
