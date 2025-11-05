"use client";

import { Building } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useRef, useState } from "react";
import {
	DepartementFormData,
	departmentFormSchema,
} from "@/lib/schemas/departmentFormSchema";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import DataTableDepartment from "./components/DataTableDepartment";
import { Dialog } from "primereact/dialog";
import DepartmentDialogForm from "./components/DepartmentDialogForm";
import { Toast } from "primereact/toast";
import { DepartmentData } from "@/lib/types/department";

export default function Department() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [department, setDepartment] = useState<DepartmentData[]>([]);
	const [currentSelectedId, setCurrentSelectedId] = useState<number | null>(
		null
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selectedDepartment, setSelectedDepartment] =
		useState<DepartementFormData | null>(null);
	const [errorMessages, setErrorMessages] = useState(null);

	const fetchDepartment = async () => {
		setIsLoading(true);

		try {
			const res = await fetch("/api/master/department");
			const response = await res.json();

			if (response && response.status === "00") {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: response.message,
						life: 3000,
					});

					isInitialLoad.current = false;
				}
				setDepartment(response.master_departments);
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: response.message,
					life: 3000,
				});

				setDepartment([]);
			}
		} catch (error: any) {
			setDepartment([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (formData: DepartementFormData) => {
		try {
			const method = dialogMode === "add" ? "POST" : "PUT";

			const url =
				dialogMode === "add"
					? "/api/master/department"
					: `/api/master/department/${currentSelectedId}`;

			const res = await fetch(url, {
				method: method,
				body: JSON.stringify(formData),
			});

			const responseData = await res.json();

			if (!res.ok) {
				throw new Error(responseData.message || "Terjadi kesalahan");
			}

			toastRef.current?.show({
				severity: "success",
				summary: "Sukses",
				detail: responseData.message || "Data berhasil disimpan",
				life: 3000,
			});

			fetchDepartment();
			setSelectedDepartment(null);
			setDialogMode(null);
			setIsDialogVisible(false);
			setCurrentSelectedId(null);
		} catch (error: any) {
			toastRef.current?.show({
				severity: "error",
				summary: "Gagal",
				detail: error.message,
				life: 3000,
			});
			throw error;
		}
	};

	const handleEdit = (department: DepartmentData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedDepartment({
			name: department.name,
			department_code: department.department_code,
		});

		setCurrentSelectedId(department.id);
	};

	const handleDelete = (department: DepartmentData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus departemen ${department.name}`,
			accept: async () => {
				try {
					const res = await fetch(
						`/api/master/department/${department.id}`,
						{
							method: "DELETE",
						}
					);

					const responseData = await res.json();

					if (!res.ok) {
						throw new Error(responseData.message || "Terjadi kesalahan");
					}

					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: responseData.message || "Data berhasil dihapus",
						life: 3000,
					});

					fetchDepartment();
					setSelectedDepartment(null);
				} catch (error: any) {
					toastRef.current?.show({
						severity: "error",
						summary: "Gagal",
						detail: error.message,
						life: 3000,
					});
				} finally {
					setCurrentSelectedId(null);
				}
			},
		});
	};

	useEffect(() => {
		fetchDepartment();
	}, []);

	return (
		<div>
			<Toast ref={toastRef} />
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
										setSelectedDepartment(null);
										setCurrentSelectedId(null);
										setIsDialogVisible(true);
									}}
								/>
							</div>
						</div>
					</div>

					{/* data table */}
					<DataTableDepartment
						department={department}
						isLoading={isLoading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>

				<ConfirmDialog />

				<Dialog
					header={
						dialogMode === "edit" ? "Edit Departemen" : "Tambah Departemen"
					}
					visible={isDialogVisible}
					onHide={() => setIsDialogVisible(false)}
					modal
					style={{ width: "50%" }}
				>
					<DepartmentDialogForm
						departmentData={selectedDepartment}
						dialogMode={dialogMode}
						onSubmit={handleSubmit}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
