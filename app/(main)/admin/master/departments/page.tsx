"use client";

import { Building } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useRef, useState } from "react";
import { DepartementFormData } from "@/lib/schemas/departmentFormSchema";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import DataTableDepartment from "./components/DataTableDepartment";
import { Dialog } from "primereact/dialog";
import DepartmentDialogForm from "./components/DepartmentDialogForm";

export default function Department() {
	const toastRef = useRef<any>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selectedDepartment, setSelectedDepartment] =
		useState<DepartementFormData | null>(null);

	const handleHideDialog = () => {
		setIsDialogVisible(false);
		setSelectedDepartment(null);
		setDialogMode(null);
	};

	const handleEdit = (department: DepartementFormData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedDepartment(department);
	};

	const handleDelete = (department: DepartementFormData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus departemen ${department.name}`,
		});
	};

	const handleFormSubmit = (formData: DepartementFormData) => {
		if (dialogMode === "edit") {
			console.log("LOGIKA EDIT:", formData);
			// Panggil API update Anda di sini
		} else {
			console.log("LOGIKA TAMBAH:", formData);
			// Panggil API tambah Anda di sini
		}
		handleHideDialog();
	};
	return (
		<div>
			<div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
				<div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
					<Building className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Master Data Departemen
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola data departemen perusahaan
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-4">
					<div className="flex gap-2 align-items-center">
						<Building className="h-2" />
						<h2 className="text-base text-800">Master Data Departemen</h2>
					</div>

					{/* filters */}
					<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-end gap-3">
						{/* calendar */}
						<form className="flex flex-column md:flex-row md:align-items-end gap-3">
							<div className="flex flex-column gap-2">
								{/* start date */}
								<div className="flex flex-column gap-2">
									<label htmlFor="startDate">Dari</label>
									<Calendar id="startDate" placeholder="Mulai" showIcon />
								</div>

								{/* end date */}
								<div className="flex flex-column gap-2">
									<label htmlFor="endDate">Sampai</label>
									<Calendar id="startDate" placeholder="Selesai" showIcon />
								</div>
							</div>

							{/* submit button */}
							<div className="flex flex-column gap-2">
								<span>Terapkan</span>
								<div className="flex align-items-center gap-3">
									<Button icon="pi pi-check" type="submit" />

									<Button icon="pi pi-times" severity="secondary" />
								</div>
							</div>
						</form>

						{/* search filter and add button */}
						<div className="flex flex-column md:flex-row gap-3">
							{/* search */}
							<InputTextComponent
								icon="pi pi-search"
								placeholder="Cari berdasarkan Kode atau nama"
								className="w-full"
							/>

							{/* add button */}
							<div>
								<Button
									icon="pi pi-plus"
									label="Tambah"
									pt={{
										icon: { className: "mr-2" },
									}}
									onClick={() => {
										setDialogMode("add");
										setIsDialogVisible(true);
									}}
								/>
							</div>
						</div>
					</div>

					{/* data table */}
					<DataTableDepartment onEdit={handleEdit} onDelete={handleDelete} />
				</div>

				<ConfirmDialog />

				<Dialog
					header={selectedDepartment ? "Edit Departemen" : "Tambah Departemen"}
					visible={isDialogVisible}
					onHide={handleHideDialog}
					modal
					style={{ width: "50%" }}
				>
					<DepartmentDialogForm
						departmentData={selectedDepartment}
						// onSubmit={}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
