import { Calendar, ClipboardCheck, TreePalm, Users } from "lucide-react";
import StatsCard from "../../components/StatsCard";
import { Card } from "primereact/card";

export default function DashboardStats() {
	const statsData = [
		{
			title: "Total Karyawan",
			value: "156",
			description: "Aktif",
			trend: { value: "12%", isPositive: true },
			icon: <Users />,
		},
		{
			title: "Cuti Pending",
			value: "8",
			description: "Menunggu persetujuan",
			trend: { value: "2", isPositive: false },
			icon: <TreePalm />,
		},
		{
			title: "Absensi Hari Ini",
			value: "142",
			description: "Hadir / 156 total",
			trend: { value: "94%", isPositive: true },
			icon: <ClipboardCheck />,
		},
		{
			title: "Saldo Cuti",
			value: "12",
			description: "Rata-rata per karyawan",
			trend: { value: "0", isPositive: true },
			icon: <Calendar />,
		},
	];

	return (
		<div className="grid">
			{statsData.map((stat, index) => (
				<div className="col-12 md:col-6 lg:col-3">
					<StatsCard
						key={index}
						title={stat.title}
						value={stat.value}
						description={stat.description}
						trend={stat.trend}
						icon={stat.icon}
					/>
				</div>
			))}
		</div>
	);
}
