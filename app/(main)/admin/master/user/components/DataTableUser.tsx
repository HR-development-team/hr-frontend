"use client";

import { UserFormData } from "@/lib/schemas/userFormSchema";
import { EmployeeData } from "@/lib/types/employee";
import { UserData } from "@/lib/types/user";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";

interface DataTableUserProp {
	user: UserData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (user: UserData) => void;
	onDelete: (user: UserData) => void;
}

export default function DataTableUser({
	user,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableUserProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

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
			loading={isLoading}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			{/* <Column field="id" header="ID" style={{ width: "25%" }} /> */}
			<Column field="email" header="Email" style={{ width: "25%" }} />
			<Column
				field="employee_first_name"
				header="Nama Karyawan"
				style={{ width: "25%" }}
			/>
			<Column field="role" header="Role User" style={{ width: "25%" }} />
			<Column
				header="Aksi"
				body={(row: UserData) => (
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
