"use client";

import { Button } from "primereact/button";
import { RefreshCw } from "lucide-react";

// Components
import DashboardStats from "../components/DashboardStats";
import QuickActions from "../components/QuickActions";
import DashboardCalendar from "../components/DashboardCalendar";

// Hook
import { usePageDashboard } from "../hooks/usePageDashboard";

export default function DashboardManagementPage() {
  const { metrics, user, todayDate, isLoading, refreshMetrics } =
    usePageDashboard();

  return (
    <div className="layout-dashboard animate-fade-in mt-4">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-column md:flex-row justify-content-between align-items-start md:align-items-center mb-5 gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 m-0">
            Halo, {user?.full_name || "Admin"}! 👋
          </h1>
          <p className="text-gray-500 mt-2 mb-0 text-sm md:text-base">
            <span className="font-medium text-gray-700">{todayDate}</span>
            <span className="mx-2 text-gray-300">|</span>
            Selamat bekerja, semoga harimu menyenangkan.
          </p>
        </div>

        {/* Manual Refresh Button */}
        <Button
          label="Refresh Data"
          icon={<RefreshCw size={16} className="mr-2" />}
          size="small"
          outlined
          severity="secondary"
          onClick={refreshMetrics}
          loading={isLoading}
          className="w-full md:w-auto"
        />
      </div>

      {/* --- STATS CARDS --- */}
      <div className="mb-5">
        <DashboardStats data={metrics} isLoading={isLoading} />
      </div>

      {/* --- MAIN CONTENT GRID --- */}
      <div className="grid">
        {/* Left Column: Quick Actions & (Future) Charts */}
        <div className="col-12 xl:col-8 flex flex-column gap-4">
          {/* Quick Actions Menu */}
          <QuickActions data={metrics.totalLeaveRequest} />

          {/* Placeholder for Future Charts (e.g., Attendance History) 
            You can add a Chart component here later.
          */}
        </div>

        {/* Right Column: Calendar & Widgets */}
        <div className="col-12 xl:col-4">
          <DashboardCalendar />
        </div>
      </div>
    </div>
  );
}
