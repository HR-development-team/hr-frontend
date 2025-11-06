"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { DepartementFormData } from "@/lib/schemas/departmentFormSchema";
import { any } from "zod";
import { DepartmentData } from "@/lib/types/department";

interface DataTableDepartmentProp {
	department: DepartmentData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (department: DepartmentData) => void;
	onDelete: (department: DepartmentData) => void;
}

export default function DataTableDepartment({
	department,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableDepartmentProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: any) => {
		const severity = rowData.status === "Aktif" ? "success" : "danger";

		return <Tag value={rowData.status} severity={severity} />;
	};

	const joinDateBodyTemplate = (rowData: DepartmentData) => {
		const dateObject = new Date(rowData.created_at);
		return dateObject.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
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
				field="created_at"
				header="Tanggal Dibuat"
				body={joinDateBodyTemplate}
				style={{ width: "25%" }}
			/>
			<Column
				header="Aksi"
				body={(row: DepartmentData) => (
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
