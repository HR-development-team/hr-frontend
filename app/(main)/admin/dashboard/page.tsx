"use client";

import { useAuth } from "@/components/AuthContext";
import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import { CalendarDays, LayoutDashboard } from "lucide-react";
import { Card } from "primereact/card";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { StatData } from "@/lib/types/statData";
import { Skeleton } from "primereact/skeleton";
import { useFetch } from "@/lib/hooks/useFetch";

const metricDefaultValues: StatData = {
  totalEmployee: 0,
  totalAttendance: 0,
  totalLeaveBalance: 0,
  totalLeaveRequest: 0,
};

export default function Dashboard() {
  const toastRef = useRef<Toast>(null);

  const [metric, setMetric] = useState<StatData>(metricDefaultValues);

  const [todayDate, setTodayDate] = useState<string>("...");

  const { user, isLoading: isAuthLoading } = useAuth();

  const { isLoading: isMetricLoading, fetchData } = useFetch();

  const fetchMetricData = async () => {
    await fetchData({
      url: "/api/admin/dashboard/metric",
      toastRef: toastRef,
      onSuccess: (responseData) => {
        setMetric(responseData.master_employees);
      },
      onError: () => {
        setMetric(metricDefaultValues);
      },
    });
  };

  const dateFormat = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return date.toLocaleString("id-ID", options);
  };

  useEffect(() => {
    fetchMetricData();
  }, []);

  useEffect(() => {
    const date = dateFormat(new Date());
    setTodayDate(date);
  }, []);

  return (
    <>
      {/* Welcome Section */}
      <div className="flex gap-3 align-items-center mt-4 mb-6">
        <div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
          <LayoutDashboard className="h-2rem w-2rem" />
        </div>
        <div>
          {isAuthLoading ? (
            <div>
              <Skeleton className="w-20rem h-1rem mb-2" />
              <Skeleton className="w-15rem h-1rem" />
            </div>
          ) : (
            <div>
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
                {user?.full_name ? (
                  `Selamat Datang, ${user?.full_name}!`
                ) : (
                  "Selamat Datang, Admin!"
                )}
              </h2>
              <p className="text-sm md:text-md text-gray-500">
                Ringkasan HR hari ini, {todayDate}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <DashboardStats data={metric} isLoading={isMetricLoading} />

      {/* Main Content Grid */}
      <div className="mt-1 grid">
        {/* Left Column */}
        <div className="col-12 md:col-6">
          <QuickActions data={metric.totalLeaveRequest} />
        </div>

        {/* Calendar Widget */}
        <div className="col-12 md:col-6">
          <Card>
            <div className="flex flex-column gap-4">
              <div className="flex gap-2 align-items-center">
                <CalendarDays className="h-2" />
                <span className="text-sm font-semibold text-800">Kalender</span>
              </div>
              <div className="text-center p-4 bg-blue-50 border-round-lg">
                <p className="text-base md:text-lg font-bold text-800">
                  {todayDate}
                </p>
                <p className="text-sm text-500 md:text-md">
                  Tidak ada hari libur
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
