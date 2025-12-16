"use client";

import React, { useMemo } from "react";
import { Calendar, ClipboardCheck, TreePalm, Users } from "lucide-react";
import StatsCard from "./StatCard";
import { DashboardStat } from "../schemas/dashboardSchema";

interface DashboardStatsProps {
  data: DashboardStat;
  isLoading: boolean;
}

export default function DashboardStats({
  data,
  isLoading,
}: DashboardStatsProps) {
  // Memoize the stats array to prevent unnecessary recalculations
  const statsData = useMemo(() => {
    return [
      {
        title: "Total Karyawan",
        value: data.totalEmployee,
        description: "Aktif",
        icon: <Users className="text-blue-500" size={24} />,
        iconClassName: "bg-blue-100",
        borderRightClassName: "border-left-3 border-blue-500",
        showProgress: false,
      },
      {
        title: "Cuti Pending",
        value: data.totalLeaveRequest,
        description: "Menunggu persetujuan",
        icon: <TreePalm className="text-orange-500" size={24} />,
        iconClassName: "bg-orange-100",
        borderRightClassName: "border-left-3 border-orange-500",
        showProgress: false,
      },
      {
        title: "Absensi Hari Ini",
        value: data.totalAttendance,
        description: `Hadir / ${data.totalEmployee} karyawan`,
        icon: <ClipboardCheck className="text-green-500" size={24} />,
        iconClassName: "bg-green-100",
        borderRightClassName: "border-left-3 border-green-500",
        showProgress: true,
        progressValue: data.totalEmployee
          ? Math.round((data.totalAttendance / data.totalEmployee) * 100)
          : 0,
        progressTemplate: () => (
          <React.Fragment>
            <span className="font-bold text-green-700">
              {data.totalAttendance} / {data.totalEmployee}
            </span>
          </React.Fragment>
        ),
      },
      {
        title: "Saldo Cuti",
        value: data.totalLeaveBalance,
        description: "Rata-rata per karyawan",
        icon: <Calendar className="text-purple-500" size={24} />,
        iconClassName: "bg-purple-100",
        borderRightClassName: "border-left-3 border-purple-500",
        showProgress: false,
      },
    ];
  }, [data]);

  return (
    <div className="grid">
      {statsData.map((stat, index) => (
        <div key={index} className="col-12 md:col-6 lg:col-3">
          <StatsCard
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
