"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { EmployeeData } from "@/lib/types/employee";

interface DataTableEmployeesProp {
	employees: EmployeeData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (employee: EmployeeData) => void;
	onDelete: (employee: EmployeeData) => void;
}

export default function DataTableEmployees({
	employees,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableEmployeesProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: any) => {
		const severity = rowData.status === "Aktif" ? "success" : "danger";

		return <Tag value={rowData.status} severity={severity} />;
	};

	const joinDateBodyTemplate = (rowData: EmployeeData) => {
		const dateObject = new Date(rowData.join_date);
		return dateObject.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	return (
		<DataTable
			value={employees}
			loading={isLoading}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			<Column field="first_name" header="Nama Depan" style={{ width: "25%" }} />
			<Column
				field="last_name"
				header="Nama Belakang"
				style={{ width: "25%" }}
			/>
			<Column
				field="contact_phone"
				header="Nomor Telepon"
				style={{ width: "25%" }}
			/>
			<Column field="address" header="Alamat" style={{ width: "25%" }} />
			<Column
				field="join_date"
				header="Bergabung Pada"
				body={joinDateBodyTemplate}
				style={{ width: "25%" }}
			/>
			<Column field="division_name" header="Posisi" style={{ width: "25%" }} />
			{/* <Column
				field="status"
				header="Status"
				body={statusBodyTemplate}
				style={{ width: "25%" }}
			/> */}
			<Column
				header="Aksi"
				body={(row: EmployeeData) => (
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
