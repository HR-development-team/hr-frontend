"use client";

import { TicketsPlane, User, Users } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { Toast } from "primereact/toast";
import { LeaveTypeData } from "@/lib/types/leaveType";
import DataTableLeaveType from "./components/DataTableLeaveType";
import { LeaveTypeFormData } from "@/lib/schemas/leaveTypeFormSchema";
import LeaveTypeDialogForm from "./components/LeaveTypeDialogForm";

export default function LeaveType() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [leaveType, setLeaveType] = useState<LeaveTypeData[]>([]);

	const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selectedLeaveType, setSelectedLeaveType] =
		useState<LeaveTypeFormData | null>(null);

	const fetchLeaveType = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/admin/master/leave-type");

			if (!res.ok) throw new Error("Gagal mendapatkan data dari server");

			const leaveTypeData = await res.json();

			console.log(leaveTypeData.message);

			if (leaveTypeData && leaveTypeData.status === "00") {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: leaveTypeData.message,
						life: 3000,
					});

					isInitialLoad.current = false;
				}
				setLeaveType(leaveTypeData.leave_types || []);
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: leaveTypeData.message,
					life: 3000,
				});

				setLeaveType([]);
			}
		} catch (error) {
			setLeaveType([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (formData: LeaveTypeFormData) => {
		try {
			const method = dialogMode === "add" ? "POST" : "PUT";

			const url =
				dialogMode === "add"
					? "/api/admin/master/leave-type"
					: `/api/admin/master/leave-type/${currentEditedId}`;

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

			fetchLeaveType();
			setSelectedLeaveType(null);
			setDialogMode(null);
			setIsDialogVisible(false);
			setCurrentEditedId(null);
		} catch (error: any) {
			toastRef.current?.show({
				severity: "success",
				summary: "Sukses",
				detail: error.message,
				life: 3000,
			});
		}
	};

	const handleEdit = (leaveType: LeaveTypeData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedLeaveType({
			name: leaveType.name,
			deduction: parseFloat(leaveType.deduction),
			description: leaveType.description || "",
		});
		setCurrentEditedId(leaveType.id);
	};

	const handleDelete = (leaveType: LeaveTypeData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus karyawan ${leaveType.name}`,
			acceptLabel: "Hapus",
			rejectLabel: "Batal",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					const res = await fetch(
						`/api/admin/master/leave-type/${leaveType.id}`,
						{
							method: "DELETE",
						}
					);

					const responseData = await res.json();

					if (!res.ok) {
						throw new Error(
							responseData.message || "Terjadi kesalahan koneksi"
						);
					}

					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: responseData.message || "Data berhasil dihapus",
						life: 3000,
					});

					fetchLeaveType();
					setSelectedLeaveType(null);
				} catch (error: any) {
					toastRef.current?.show({
						severity: "error",
						summary: "Gagal",
						detail: error.message,
						life: 3000,
					});
				} finally {
					setCurrentEditedId(null);
				}
			},
		});
	};

	useEffect(() => {
		fetchLeaveType();
	}, []);

	return (
		<div>
			<Toast ref={toastRef} />
			<div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
				<div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
					<TicketsPlane className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Master Data Tipe Cuti
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola tipe cuti beserta saldo setiap cuti
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-4">
					<div className="flex gap-2 align-items-center">
						<TicketsPlane className="h-2" />
						<h2 className="text-base text-800">Master Data Cuti</h2>
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
										setSelectedLeaveType(null);
										setCurrentEditedId(null);
										setIsDialogVisible(true);
									}}
								/>
							</div>
						</div>
					</div>

					{/* data table */}
					<DataTableLeaveType
						leaveType={leaveType}
						isLoading={isLoading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>

				<ConfirmDialog />

				<Dialog
					header={dialogMode === "edit" ? "Edit Karyawan" : "Tambah Karyawan"}
					visible={isDialogVisible}
					onHide={() => setIsDialogVisible(false)}
					modal
					style={{ width: "75%" }}
				>
					<LeaveTypeDialogForm
						leaveType={selectedLeaveType}
						onSubmit={handleSubmit}
						isSubmitting={isSaving}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
