"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { DivisionFormData } from "@/lib/schemas/divisionFormSchema";

const division: DivisionFormData[] = [
	{
		// id: 1,
		code: "DR401",
		name: "R&D",
		department_id: 1,
	},
	{
		// id: 2,
		code: "DO403",
		name: "Operasi",
		department_id: 2,
	},
	{
		// id: 3,
		code: "DP404",
		name: "Penjualan",
		department_id: 3,
	},
	{
		// id: 4,
		code: "DP405",
		name: "Pemasaran",
		department_id: 4,
	},
];

interface DataTableDivisionProp {
	// users: EmployeeFormData;
	// isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (division: DivisionFormData) => void;
	onDelete: (division: DivisionFormData) => void;
}

export default function DataTableDivision({
	// users,
	// isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableDivisionProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: any) => {
		const severity = rowData.status === "Aktif" ? "success" : "danger";

		return <Tag value={rowData.status} severity={severity} />;
	};

	return (
		<DataTable
			value={division}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			<Column field="code" header="Kode" style={{ width: "25%" }} />
			<Column field="name" header="Nama Divisi" style={{ width: "25%" }} />
			<Column field="department_id" header="Berasal Dari Departemen" style={{ width: "25%" }} />
			<Column
				header="Aksi"
				body={(row: DivisionFormData) => (
					<div className="flex gap-2">
						<Button
							icon="pi pi-pencil text-sm"
							size="small"
							severity="warning"
							onClick={() => {
								onEdit(row);
							}}
						/>

						<Button
							icon="pi pi-trash text-sm"
							size="small"
							severity="danger"
							onClick={() => {
								onDelete(row);
							}}
						/>
					</div>
				)}
				style={{ width: "25%" }}
			/>
		</DataTable>
	);
}
