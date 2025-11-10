"use client";

import { useAuth } from "@/components/AuthContext";
import DashboardStats from "./components/DashboardStats";
import QuickActions from "./components/QuickActions";
import { CalendarDays, LayoutDashboard } from "lucide-react";
import { Card } from "primereact/card";
import React, { use, useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { StatData } from "@/lib/types/statData";

const metricDefaultValues: StatData = {
	totalEmployee: 0,
	totalAttendance: 0,
	totalLeaveBalance: 0,
	totalLeaveRequest: 0,
};

export default function Dashboard() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [isLoadingMetric, setIsLoadingMetric] = useState<boolean>(false);

	const [metric, setMetric] = useState<StatData>(metricDefaultValues);

	const [todayDate, setTodayDate] = useState<string>("...");

	const { user, isLoading } = useAuth();

	const fetchMetricData = async () => {
		setIsLoadingMetric(true);
		try {
			const res = await fetch("/api/admin/dashboard/metric");

			if (!res.ok) {
				throw new Error("Gagal mendapatkan data metrik dashboard");
			}

			const responseData = await res.json();

			if (responseData && responseData.status === "00") {
				setMetric(responseData.master_employees);
			} else {
				setMetric(metricDefaultValues);
			}
		} catch (error: any) {
			console.error(error.message);
		} finally {
			setIsLoadingMetric(false);
		}
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
					<h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						{isLoading
							? "Selamat Datang, "
							: `Selamat Datang, ${(user?.first_name, user?.last_name)}`}
					</h2>
					<p className="text-sm md:text-md text-gray-500">
						Berikut adalah ringkasan aktivitas HR hari ini.
					</p>
				</div>
			</div>

			{/* Statistics */}
			<DashboardStats data={metric} isLoading={isLoadingMetric} />

			{/* Main Content Grid */}
			<div className="mt-4 grid">
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
								<p className="text-lg font-bold text-800">{todayDate}</p>
								<p className="text-500 text-md">Tidak ada hari libur</p>
							</div>
						</div>
					</Card>
				</div>
			</div>
		</>
	);
}
