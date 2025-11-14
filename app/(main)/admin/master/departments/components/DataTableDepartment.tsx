"use client";

import { DataTableDepartmentProp } from "@/lib/types/dataTable/dataTableDepartmentType";
import { GetAllDepartmentData } from "@/lib/types/department";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React from "react";

export default function DataTableDepartment({
	department,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
	onView
}: DataTableDepartmentProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: any) => {
		const severity = rowData.status === "Aktif" ? "success" : "danger";

		return <Tag value={rowData.status} severity={severity} />;
	};

	return (
		<DataTable
			value={department}
			loading={isLoading}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			<Column field="department_code" header="Kode" style={{ width: "25%" }} />
			<Column field="name" header="Nama Departemen" style={{ width: "25%" }} />
			<Column
				header="Aksi"
				body={(row: GetAllDepartmentData) => (
					<div className="flex gap-2">
						<Button
							icon="pi pi-eye text-sm"
							size="small"
							severity="success"
							onClick={() => {
								onView(row);
							}}
						/>

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
