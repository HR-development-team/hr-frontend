import { DataTableLeaveRequestProps } from "@/lib/types/dataTable/dataTableLeaveRequestType";
import { GetAllLeaveRequestData } from "@/lib/types/leaveRequest";
import { formatDateIDN } from "@/lib/utils/dateFormat";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";

export default function DataTableLeaveRequest({
	leaveRequest,
	isLoading,
	onUpdate,
}: DataTableLeaveRequestProps) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: GetAllLeaveRequestData) => {
		const status = rowData.status;

		const severity =
			status === "Pending"
				? "warning"
				: status === "Approved"
				? "success"
				: "danger";

		return <Tag value={status} severity={severity} />;
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
			<Column field="request_code" header="Kode" style={{ width: "25%" }} />
			<Column
				field="employee_name"
				header="Nama Karyawan"
				style={{ width: "25%" }}
			/>
			<Column field="type_name" header="Tipe Cuti" style={{ width: "25%" }} />
			<Column field="reason" header="Alasan" style={{ width: "25%" }} />
			<Column field="total_days" header="Lama Cuti" style={{ width: "25%" }} />
			<Column
				field="start_date"
				header="Tanggal Mulai"
				body={(rowData) => formatDateIDN(rowData.start_date)}
				style={{ width: "25%" }}
			/>
			<Column
				field="end_date"
				header="Tanggal Selesai"
				body={(rowData) => formatDateIDN(rowData.end_date)}
				style={{ width: "25%" }}
			/>
			<Column
				field="status"
				header="Status"
				body={statusBodyTemplate}
				style={{ width: "25%" }}
			/>
			<Column
				field="approval_date"
				header="Tanggal Ditanggapi"
				body={(rowData) => formatDateIDN(rowData.approval_date)}
				style={{ width: "25%" }}
			/>
			<Column
				field="aproved_by_name"
				header="Disetujui oleh"
				style={{ width: "25%" }}
			/>
			<Column
				header="Aksi"
				body={(row: GetAllLeaveRequestData) => (
					<div className="flex gap-2">
						<Button
							icon="pi pi-check text-sm"
							size="small"
							severity="success"
							label="Setujui"
							onClick={() => {
								onUpdate(row, "Approved");
							}}
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
							onClick={() => {
								onUpdate(row, "Rejected");
							}}
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
