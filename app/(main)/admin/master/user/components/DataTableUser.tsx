"use client";

import { UserFormData } from "@/lib/schemas/userFormSchema";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";

const user: UserFormData[] = [
	{
		// id: 1,
		email: "jeanne@example.com",
		password: "Admin@12",
		employee_id: 1,
		role: "admin",
	},
	{
		// id: 2,
		email: "remchan@example.com",
		password: "Admin@12",
		employee_id: 2,
		role: "employee",
	},
	{
		// id: 3,
		email: "vanitas@example.com",
		password: "Admin@12",
		employee_id: 3,
		role: "employee",
	},
	{
		// id: 4,
		email: "step@example.com",
		password: "Admin@12",
		employee_id: 4,
		role: "admin",
	},
];

interface DataTableUserProp {
	// users: EmployeeFormData;
	// isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (user: UserFormData) => void;
	onDelete: (user: UserFormData) => void;
}

export default function DataTableUser({
	// users,
	// isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableUserProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const statusBodyTemplate = (rowData: any) => {
		const severity = rowData.status === "Aktif" ? "success" : "danger";

		return <Tag value={rowData.status} severity={severity} />;
	};

	// const joinDateBodyTemplate = (rowData: EmployeeFormData) => {
	// 	if (
	// 		rowData.join_date &&
	// 		typeof rowData.join_date.toLocaleString === "function"
	// 	) {
	// 		return rowData.join_date.toLocaleDateString("id-ID");
	// 	}

	// 	return null;
	// };

	return (
		<DataTable
			value={user}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			{/* <Column field="id" header="ID" style={{ width: "25%" }} /> */}
			<Column field="email" header="Email" style={{ width: "25%" }} />
			<Column field="password" header="Password" style={{ width: "25%" }} />
			<Column field="employee_id" header="Nama Karyawan" style={{ width: "25%" }} />
			<Column field="role" header="Role User" style={{ width: "25%" }} />
			<Column
				header="Aksi"
				body={(row: UserFormData) => (
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
