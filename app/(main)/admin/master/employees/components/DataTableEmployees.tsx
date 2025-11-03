"use client";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React from "react";

const employees = [
	{
		id: "EMP001",
		name: "Budi Santoso",
		position: "Software Engineer",
		department: "IT",
		status: "Aktif",
	},
	{
		id: "EMP002",
		name: "Siti Rahayu",
		position: "HR Manager",
		department: "HR",
		status: "Aktif",
	},
	{
		id: "EMP003",
		name: "Ahmad Fauzi",
		position: "Marketing Specialist",
		department: "Marketing",
		status: "Aktif",
	},
	{
		id: "EMP004",
		name: "Dewi Lestari",
		position: "Finance Manager",
		department: "Finance",
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
			<Column field="id" header="ID" style={{ width: "25%" }}></Column>
			<Column field="name" header="Name" style={{ width: "25%" }}></Column>
			<Column
				field="position"
				header="Posisi"
				style={{ width: "25%" }}
			></Column>
			<Column
				field="status"
				header="Status"
				body={statusBodyTemplate}
				style={{ width: "25%" }}
			></Column>
		</DataTable>
	);
}
