"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import React, { useState } from "react";
import { DivisionData } from "@/lib/types/division";

interface DataTableDivisionProp {
	division: DivisionData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (division: DivisionData) => void;
	onDelete: (division: DivisionData) => void;
}

export default function DataTableDivision({
	division,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTableDivisionProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

	const joinDateBodyTemplate = (rowData: DivisionData) => {
		const dateObject = new Date(rowData.created_at);
		return dateObject.toLocaleDateString("id-ID", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	return (
		<DataTable
			value={division}
			loading={isLoading}
			paginator
			rows={5}
			rowsPerPageOptions={[5, 10, 25, 50]}
			className={newLocal}
			// style={{ minWidth: "50rem" }}
		>
			<Column field="position_code" header="Kode" style={{ width: "25%" }} />
			<Column field="name" header="Nama Divisi" style={{ width: "25%" }} />
			<Column
				field="department_name"
				header="Departemen"
				style={{ width: "25%" }}
			/>

			<Column
				field="created_at"
				header="Dibuat pada"
				body={joinDateBodyTemplate}
				style={{ width: "25%" }}
			/>
			<Column
				header="Aksi"
				body={(row: DivisionData) => (
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
