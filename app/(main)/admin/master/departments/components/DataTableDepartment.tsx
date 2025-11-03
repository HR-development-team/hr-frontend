"use client";

import { Divide } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React from "react";

const employees = [
	{
		id: 1,
		first_name: "Budi",
		last_name: "Santoso",
		contact_phone: "000000",
		address: "Jatim",
		join_date: "2025-10-25",
		position_id: 9,
		status: "Aktif",
	},
	{
		id: 2,
		first_name: "Siti",
		last_name: "Rahayu",
		contact_phone: "000000",
		address: "Jabar",
		join_date: "2025-10-26",
		position_id: 9,
		status: "Aktif",
	},
	{
		id: 3,
		first_name: "Ahmad",
		last_name: "Fauzi",
		contact_phone: "000000",
		address: "Jateng",
		join_date: "2025-10-27",
		position_id: 9,
		status: "Aktif",
	},
	{
		id: 4,
		first_name: "Dewi",
		last_name: "Lestari",
		contact_phone: "000000",
		address: "Jaksel",
		join_date: "2025-10-28",
		position_id: 9,
		status: "Keluar",
	},
];

export default function DataTableEmployees() {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: any) => {
		const severity = rowData.status === "Aktif" ? "success" : "danger";

		return <Tag value={rowData.status} severity={severity} />;
	};
	return (
		<DataTable
			value={employees}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			<Column field="id" header="ID" style={{ width: "25%" }} />
			<Column field="first_name" header="Nama Depan" style={{ width: "25%" }} />
			<Column
				field="last_name"
				header="Nama Belakang"
				style={{ width: "25%" }}
			/>
			<Column field="contact_phone" header="Nomor Telepon" style={{ width: "25%" }} />
			<Column field="address" header="Alamat" style={{ width: "25%" }} />
			<Column field="join_date" header="Tanggal Masuk" style={{ width: "25%" }} />
			<Column field="position_id" header="Jabatan" style={{ width: "25%" }} />
			<Column
				field="status"
				header="Status"
				body={statusBodyTemplate}
				style={{ width: "25%" }}
			/>
			<Column
				header="Aksi"
				body={(row) => (
					<div className="flex gap-2">
						<Button
							icon="pi pi-pencil text-sm"
							size="small"
							severity="warning"
						/>

						<Button icon="pi pi-trash text-sm" size="small" severity="danger" />
					</div>
				)}
				style={{ width: "25%" }}
			/>
		</DataTable>
	);
}
