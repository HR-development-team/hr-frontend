"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useState } from "react";
import { LeaveTypeFormData } from "@/lib/schemas/leaveTypeFormSchema";
import { LeaveTypeData } from "@/lib/types/leaveType";
import { formatRupiah } from "@/lib/utils/formatRupiah";

interface DataTableLeaveTypeProp {
	leaveType: LeaveTypeData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (leaveType: LeaveTypeData) => void;
	onDelete: (leaveType: LeaveTypeData) => void;
}

export default function DataTableLeaveType({
	leaveType,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableLeaveTypeProp) {
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
			value={leaveType}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			{/* <Column field="id" header="ID" style={{ width: "25%" }} /> */}
			<Column field="name" header="Tipe Cuti" style={{ width: "25%" }} />

			<Column
				field="deduction"
				header="Pengurangan Gaji"
				body={(row: LeaveTypeData) => formatRupiah(row.deduction)}
				style={{ width: "25%" }}
			/>
			<Column
				field="description"
				header="Deskripsi Cuti"
				style={{ width: "25%" }}
			/>
			<Column
				header="Aksi"
				body={(row: LeaveTypeData) => (
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
