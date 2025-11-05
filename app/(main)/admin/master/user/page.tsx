"use client";

import { User, Users } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import UserDialogForm from "./components/UserDialogForm";
import { UserFormData } from "@/lib/schemas/userFormSchema";
import DataTableUser from "./components/DataTableUser";

export default function UserPage() {
	const toastRef = useRef<any>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selectedEmployee, setSelectedEmployee] =
		useState<UserFormData | null>(null);

	const handleHideDialog = () => {
		setIsDialogVisible(false);
		setSelectedEmployee(null);
		setDialogMode(null);
	};

	const handleEdit = (user: UserFormData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedEmployee(user);
	};

	const handleDelete = (user: UserFormData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus karyawan ${user.email}`,
		});
	};

	const handleFormSubmit = (formData: UserFormData) => {
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
					<User className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Master Data User
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola data diri dan informasi User
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-4">
					<div className="flex gap-2 align-items-center">
						<User className="h-2" />
						<h2 className="text-base text-800">Master Data User</h2>
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
									<Button icon="pi pi-check" type="submit" severity="info" />

									<Button icon="pi pi-times" severity="secondary" />
								</div>
							</div>
						</form>

						{/* search filter and add button */}
						<div className="flex flex-column md:flex-row gap-3">
							{/* search */}
							<InputTextComponent
								icon="pi pi-search"
								placeholder="Cari berdasarkan ID atau nama"
								className="w-full"
							/>

							{/* add button */}
							<div>
								<Button
									icon="pi pi-plus"
									label="Tambah"
									severity="info"
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
					<DataTableUser onEdit={handleEdit} onDelete={handleDelete} />
				</div>

				<ConfirmDialog />

				<Dialog
					header={selectedEmployee ? "Edit Karyawan" : "Tambah Karyawan"}
					visible={isDialogVisible}
					onHide={handleHideDialog}
					modal
					style={{ width: "75%" }}
				>
					<UserDialogForm
						userData={selectedEmployee}
						// onSubmit={}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
