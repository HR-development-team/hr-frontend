"use client";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils/formatRupiah";
import { PositionData } from "@/lib/types/position";

interface DataTablePositionProp {
	division: PositionData[];
	isLoading: boolean;
	// lazyParams: { first: number; rows: number; page: number };
	// totalItems: number;
	// onPageChange: (event: DataTablePageEvent) => void;
	onEdit: (division: PositionData) => void;
	onDelete: (division: PositionData) => void;
}

export default function DataTablePosition({
	division,
	isLoading,
	// lazyParams,
	// totalItems,
	// onPageChange,
	onEdit,
	onDelete,
}: DataTablePositionProp) {
	const newLocal =
		"border-1 border-gray-50 border-round-xl shadow-1 overflow-hidden";

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
				field="base_salary"
				header="Gaji Pokok"
				body={(row: PositionData) => formatRupiah(row.base_salary)}
				style={{ width: "25%" }}
			/>
			<Column
				header="Aksi"
				body={(row: PositionData) => (
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
