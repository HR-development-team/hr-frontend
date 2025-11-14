import { formatDateIDN } from "@/lib/utils/dateFormat";
import { formatRupiah } from "@/lib/utils/formatRupiah";
import { TicketsPlane } from "lucide-react";
import { Card } from "primereact/card";
import LeaveTypeDialogViewSkeleton from "./LeaveTypeDialogViewSkeleton";
import { LeaveTypeViewProps } from "@/lib/types/view/leaveTypeViewTypes";

export default function LeaveTYpeDialogView({
	leaveTypeData,
	isLoading,
	dialogMode,
}: LeaveTypeViewProps) {
	const isOnViewMode = dialogMode === "view" ? true : false;

	if (isLoading) {
		return <LeaveTypeDialogViewSkeleton />;
	}

	return (
		<div>
			<div className={`${isOnViewMode ? "line-height-3 text-800" : "hidden"}`}>
				<Card>
					<div className="flex align-items-center gap-2 mb-4">
						<TicketsPlane className="text-blue-500" />
						<span className="font-medium">Detail Data Tipe Cuti</span>
					</div>

					<div className="flex flex-column gap-3 xl:flex-row border-bottom-1 border-gray-400 py-4">
						<div className="w-full text-base font-medium">
							<span className="text-500">Nama Tipe Cuti</span>
							<p>{leaveTypeData?.name ? leaveTypeData.name : "-"}</p>
							<p className="text-sm font-light font-italic">
								{leaveTypeData?.type_code ? leaveTypeData.type_code : "-"}
							</p>
						</div>

						<div className="w-full text-base font-medium">
							<span className="text-500">Pengurangan Gaji</span>
							<p>
								{leaveTypeData?.deduction
									? formatRupiah(leaveTypeData.deduction)
									: "-"}
							</p>
						</div>
					</div>

					<div className="w-full border-bottom-1 border-gray-400 py-3">
						<div className="text-base font-medium col-12 p-3 bg-gray-100 border-round-xl">
							<span>Deskripsi Tipe Cuti</span>
							<p className="text-500 font-italic">
								{leaveTypeData?.description
									? leaveTypeData.description
									: "Belum ada deskripsi"}
							</p>
						</div>
					</div>

					<div className="mt-4 flex flex-column xl:flex-row xl:align-items-center justify-content-between font-italic text-xs">
						<div className="font-light flex align-items-center gap-2 text-500">
							<span className="">Diperbarui:</span>
							<span>{formatDateIDN(leaveTypeData?.updated_at)}</span>
						</div>

						<div className="font-light flex align-items-center gap-2 text-500">
							<span className="">Ditambahkan:</span>
							<span>{formatDateIDN(leaveTypeData?.created_at)}</span>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
