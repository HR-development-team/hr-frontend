import { LeaveRequestData } from "@/lib/types/leaveRequest";
import { Rowdies } from "next/font/google";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";

interface DataTableLeaveRequestProp {
	leaveRequest: LeaveRequestData[];
	isLoading: boolean;
}

export default function DataTableLeave({
	leaveRequest,
	isLoading,
}: DataTableLeaveRequestProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: LeaveRequestData) => {
		let severity: string;
		if (rowData.status === "Pending") {
			severity = "secondary";
		} else if (rowData.status === "Approved") {
			severity = "success";
		} else {
			severity = "danger";
		}

		return <Tag value={rowData.status} severity={severity} />;
	};

	const joinDateBodyTemplate = (rowData: LeaveRequestData, field: string) => {
		const dateValue = rowData[field as keyof LeaveRequestData];

		if (!dateValue) {
			if (field === "approval_date") {
				return "Belum ditanggapi";
			} else {
				return "N/A";
			}
		}

		const dateObject = new Date(dateValue as string);

		if (isNaN(dateObject.getTime())) {
			return "Objek tanggal tidak valid!";
		}

		return dateObject.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};
	return (
		<DataTable
			value={leaveRequest}
			loading={isLoading}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
		>
			<Column
				field="employee_name"
				header="Nama Karyawan"
				style={{ width: "25%" }}
			/>

			<Column
				field="leave_type_name"
				header="Tipe Cuti"
				style={{ width: "25%" }}
			/>

			<Column
				field="start_date"
				header="Tanggal Mulai"
				body={(rowData) => joinDateBodyTemplate(rowData, "start_date")}
				style={{ width: "25%" }}
			/>

			<Column
				field="end_date"
				header="Tanggal Selesai"
				body={(rowData) => joinDateBodyTemplate(rowData, "end_date")}
				style={{ width: "25%" }}
			/>

			<Column field="total_days" header="Lama Cuti" style={{ width: "25%" }} />

			<Column field="reason" header="Alasan" style={{ width: "25%" }} />

			<Column
				field="status"
				header="Status"
				body={statusBodyTemplate}
				style={{ width: "25%" }}
			/>

			<Column
				field="approval_date"
				header="Tanggal Disetujui"
				body={(rowData) => joinDateBodyTemplate(rowData, "approval_date")}
				style={{ width: "25%" }}
			/>

			<Column
				header="Aksi"
				body={(row: LeaveRequestData) => (
					<div className="flex gap-2">
						<Button
							icon="pi pi-check text-sm"
							size="small"
							severity="success"
							label="Setujui"
							// onClick={() => {
							// 	onEdit(row);
							// }}
							pt={{
								icon: {
									className: "mr-2",
								},
							}}
						/>

						<Button
							icon="pi pi-times text-sm"
							size="small"
							severity="danger"
							label="Tolak"
							// onClick={() => {
							// 	onDelete(row);
							// }}
							pt={{
								icon: {
									className: "mr-2",
								},
							}}
						/>
					</div>
				)}
				style={{ width: "25%" }}
			/>
		</DataTable>
	);
}
