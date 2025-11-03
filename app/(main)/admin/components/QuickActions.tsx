import {
	ArrowRight,
	Building,
	ChartArea,
	ClipboardCheck,
	FastForward,
	Plus,
} from "lucide-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ReactNode } from "react";

export default function QuickActions() {
	interface QuickMenu {
		icon: ReactNode;
		label: string;
		description: string;
	}

	const actions: QuickMenu[] = [
		{
			icon: <Plus className="w-full h-full" />,
			label: "Tambah Karyawan",
			description: "Input data karyawan baru",
		},
		{
			icon: <ClipboardCheck className="w-full h-full" />,
			label: "Persetujuan Cuti",
			description: "8 permintaan pending",
		},
		{
			icon: <ChartArea className="w-full h-full" />,
			label: "Laporan Absensi",
			description: "Generate laporan bulanan",
		},
		{
			icon: <Building className="w-full h-full" />,
			label: "Update Struktur",
			description: "Edit organisasi",
		},
	];

	return (
		<Card>
			<div className="flex flex-column gap-4">
				<div className="flex align-items-center gap-2 text-700 text-sm">
					<FastForward className="h-2" />
					<span className="font-semibold">Quick Actions</span>
				</div>
				<div className="grid">
					{actions.map((action, index) => (
						<div className="col-12">
							<Button
								key={index}
								className="bg-transparent border-gray-200 shadow-1 w-full hover:bg-gray-100"
							>
								<div className="flex gap-3 align-items-center space-x-3 text-left w-full">
									<div className="text-800">{action.icon}</div>
									<div className="w-full flex-1">
										<p className="font-semibold text-sm text-800">
											{action.label}
										</p>
										<p className="text-xs text-500">{action.description}</p>
									</div>
									<div className="text-800">
										<ArrowRight />
									</div>
								</div>
							</Button>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}
