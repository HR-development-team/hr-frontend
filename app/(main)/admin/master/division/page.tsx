"use client";

import { GitFork } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { DivisionFormData } from "@/lib/schemas/divisionFormSchema";
import DataTableDivision from "./components/DataTableDivision";
import DivisionDialogForm from "./components/DivisionDialogForm";
import { DivisionData } from "@/lib/types/division";
import { Toast } from "primereact/toast";
import { DepartmentData } from "@/lib/types/department";

interface CombinedDivisionData extends DivisionData {
	department_name: string;
}

export default function Division() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [department, setDepartment] = useState<DepartmentData[]>([]);
	const [division, setDivision] = useState<DivisionData[]>([]);

	const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selectedDivision, setSelectedDivision] =
		useState<DivisionFormData | null>(null);

	const fetchAllData = async () => {
		setIsLoading(true);
		try {
			const [divisionRes, departmentRes] = await Promise.all([
				fetch("/api/admin/master/division"),
				fetch("/api/admin/master/department"),
			]);

			if (!divisionRes.ok || !departmentRes.ok)
				throw new Error("Gagal mengambil data dari server");

			const divisionData = await divisionRes.json();
			const departmentData = await departmentRes.json();

			console.log(divisionData.message);

			if (
				divisionData &&
				departmentData &&
				divisionData.status === "00" &&
				departmentData.status === "00"
			) {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: divisionData.message,
						life: 3000,
					});

					isInitialLoad.current = false;
				}

				setDivision(divisionData.master_positions || []);
				setDepartment(departmentData.master_departments || []);
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: divisionData.message,
					life: 3000,
				});

				setDivision([]);
				setDepartment([]);
			}
		} catch (error: any) {
			setDivision([]);
			setDepartment([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (formData: DivisionFormData) => {
		setIsSaving(true);
		setIsLoading(true);

		const url =
			dialogMode === "edit"
				? `/api/admin/master/division/${currentEditedId}`
				: "/api/admin/master/division";

		const method = dialogMode === "edit" ? "PUT" : "POST";

		try {
			const res = await fetch(url, {
				method: method,
				body: JSON.stringify(formData),
			});

			const response = await res.json();

			if (response && response.status === "00") {
				toastRef.current?.show({
					severity: "success",
					summary: "Sukses",
					detail: response.message,
					life: 3000,
				});
				fetchAllData();
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: response.error[0].message || "Gagal menyimpan data divisi",
					life: 3000,
				});
			}

			fetchAllData();
			setSelectedDivision(null);
			setDialogMode(null);
			setIsDialogVisible(false);
			setCurrentEditedId(null);
		} catch (error: any) {
			toastRef.current?.show({
				severity: "error",
				summary: "Error",
				detail: "Terjadi kesalahan koneksi",
				life: 3000,
			});
		} finally {
			setIsSaving(false);
			setIsLoading(false);
		}
	};

	const handleEdit = (division: DivisionData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedDivision({
			position_code: division.position_code,
			name: division.name,
			department_id: division.department_id,
			base_salary: parseInt(division.base_salary, 10),
		});
		setCurrentEditedId(division.id);
	};

	const handleDelete = (division: DivisionData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus divisi ${division.name}`,
			acceptLabel: "Hapus",
			rejectLabel: "Batal",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					const res = await fetch(`/api/admin/master/division/${division.id}`, {
						method: "DELETE",
					});

					const responseData = await res.json();

					if (!res.ok)
						throw new Error(
							responseData.message || "Terjadi kesalahan koneksi"
						);

					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: responseData.message || "Data berhasil dihapus",
						life: 3000,
					});

					fetchAllData();
					setSelectedDivision(null);
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
		fetchAllData();
	}, []);

	const departmentMap = useMemo(() => {
		const map = new Map<number, string>();
		department.forEach((depth) => {
			map.set(depth.id, depth.name);
		});
		return map;
	}, [department]);

	const combinedDivisionData: CombinedDivisionData[] = useMemo(() => {
		return division.map((division) => {
			const departmentName =
				departmentMap.get(division.department_id) || "Tidak diketahui";

			return {
				...division,
				department_name: departmentName,
			};
		});
	}, [division, departmentMap]);

	return (
		<div>
			<Toast ref={toastRef} />
			<div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
				<div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
					<GitFork className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Master Data Divisi
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola data divisi atau jabatan
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-4">
					<div className="flex gap-2 align-items-center">
						<GitFork className="h-2" />
						<h2 className="text-base text-800">Master Data Divisi</h2>
					</div>

					{/* filters */}
					<div className="flex flex-column md:flex-row md:justify-content-between md:align-items-end gap-3">
						{/* calendar */}
						<form className="flex flex-column md:flex-row md:align-items-end gap-3">
							<div className="flex flex-column md:flex-row gap-2">
								{/* start date */}
								<div className="flex flex-column gap-2">
									<label htmlFor="startDate">Dari</label>
									<Calendar
										id="startDate"
										placeholder="Mulai"
										showIcon
										style={{ width: "10rem" }}
									/>
								</div>

								{/* end date */}
								<div className="flex flex-column gap-2">
									<label htmlFor="endDate">Sampai</label>
									<Calendar
										id="startDate"
										placeholder="Selesai"
										showIcon
										style={{ width: "10rem" }}
									/>
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
										setSelectedDivision(null);
										setCurrentEditedId(null);
									}}
								/>
							</div>
						</div>
					</div>

					{/* data table */}
					<DataTableDivision
						division={combinedDivisionData}
						isLoading={isLoading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>

				<ConfirmDialog />

				<Dialog
					header={dialogMode === "edit" ? "Edit Divisi" : "Tambah Divisi"}
					visible={isDialogVisible}
					onHide={() => setIsDialogVisible(false)}
					modal
					style={{ width: "50%" }}
				>
					<DivisionDialogForm
						divisionData={selectedDivision}
						onSubmit={handleSubmit}
						departmentOptions={department}
						isSubmitting={isSaving}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
