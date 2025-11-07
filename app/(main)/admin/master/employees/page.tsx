"use client";

import { User, Users } from "lucide-react";
import { Card } from "primereact/card";
import DataTableEmployees from "./components/DataTableEmployees";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import EmployeeDialogForm from "./components/EmployeeDialogForm";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { EmployeeFormData } from "@/lib/schemas/employeeFormSchema";
import { EmployeeData } from "@/lib/types/employee";
import { DivisionData } from "@/lib/types/division";
import { Toast } from "primereact/toast";

interface CombinedEmployeeData extends EmployeeData {
	division_name: string;
}

export default function Employees() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [division, setDivision] = useState<DivisionData[]>([]);
	const [employee, setEmployee] = useState<EmployeeData[]>([]);

	const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selectedEmployee, setSelectedEmployee] =
		useState<EmployeeFormData | null>(null);

	const fetchAllData = async () => {
		setIsLoading(true);
		try {
			const [divisionRes, employeeRes] = await Promise.all([
				fetch("/api/admin/master/division"),
				fetch("/api/admin/master/employee"),
			]);

			if (!divisionRes.ok || !employeeRes.ok)
				throw new Error("Gagal mendapatkan data dari server");

			const divisionData = await divisionRes.json();
			const employeeData = await employeeRes.json();

			console.log(employeeData.message);

			if (
				divisionData &&
				employeeData &&
				divisionData.status === "00" &&
				employeeData.status === "00"
			) {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: employeeData.message,
						life: 3000,
					});

					isInitialLoad.current = false;
				}
				setDivision(divisionData.master_positions || []);
				setEmployee(employeeData.master_employees || []);
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: employeeData.message,
					life: 3000,
				});

				setDivision([]);
				setEmployee([]);
			}
		} catch (error: any) {
			setDivision([]);
			setEmployee([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (formData: EmployeeFormData) => {
		setIsSaving(true);
		setIsLoading(true);

		const { join_date, ...restOfValues } = formData;

		const payload: any = {
			...restOfValues,

			contact_phone:
				formData.contact_phone === "" ? null : formData.contact_phone,
			address: formData.address === "" ? null : formData.address,
		};

		if (dialogMode !== "edit") {
			payload.join_date = join_date.toISOString().split("T")[0];
		}

		const url =
			dialogMode === "edit"
				? `/api/admin/master/employee/${currentEditedId}`
				: "/api/admin/master/employee";

		const method = dialogMode === "edit" ? "PUT" : "POST";

		try {
			const res = await fetch(url, {
				method: method,
				body: JSON.stringify(payload),
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
					detail:
						response?.errors?.[0]?.message || "Gagal menyimpan data karyawan",
					life: 3000,
				});
			}

			fetchAllData();
			setSelectedEmployee(null);
			setDialogMode(null);
			setIsDialogVisible(false);
			setCurrentEditedId(null);
		} catch (error: any) {
			toastRef.current?.show({
				severity: "error",
				summary: "Error",
				detail: error,
				life: 3000,
			});
		} finally {
			setIsSaving(false);
			setIsLoading(false);
		}
	};

	const handleEdit = (employee: EmployeeData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedEmployee({
			first_name: employee.first_name,
			last_name: employee.last_name,
			join_date: new Date(`${employee.join_date.split("T")[0]}T00:00:00`),
			position_id: employee.position_id,
			contact_phone: employee.contact_phone,
			address: employee.address,
		});
		setCurrentEditedId(employee.id);
	};

	const handleDelete = (employee: EmployeeData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus karyawan ${employee.first_name}`,
			acceptLabel: "Hapus",
			rejectLabel: "Batal",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					const res = await fetch(`/api/admin/master/employee/${employee.id}`, {
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
					setSelectedEmployee(null);
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

	const divisionMap = useMemo(() => {
		const map = new Map<number, string>();
		division.forEach((depth) => {
			map.set(depth.id, depth.name);
		});
		return map;
	}, [division]);

	const combinedEmployeeData: CombinedEmployeeData[] = useMemo(() => {
		return employee.map((employee) => {
			const divisionName =
				divisionMap.get(employee.position_id) || "Tidak diketahui";

			return {
				...employee,
				division_name: divisionName,
			};
		});
	}, [employee, divisionMap]);

	return (
		<div>
			<Toast ref={toastRef} />
			<div className="mb-6 flex align-items-center gap-3 mt-4 mb-6">
				<div className="bg-blue-100 text-blue-500 p-3 border-round-xl flex align-items-center">
					<Users className="w-2rem h-2rem" />
				</div>
				<div>
					<h1 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
						Master Data Karyawan
					</h1>
					<p className="text-sm md:text-md text-gray-500">
						Kelola data diri dan informasi karyawan
					</p>
				</div>
			</div>

			<Card>
				<div className="flex flex-column gap-4">
					<div className="flex gap-2 align-items-center">
						<User className="h-2" />
						<h2 className="text-base text-800">Master Data Karyawan</h2>
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
										setSelectedEmployee(null);
										setCurrentEditedId(null);
									}}
								/>
							</div>
						</div>
					</div>

					{/* data table */}
					<DataTableEmployees
						employees={combinedEmployeeData}
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
					<EmployeeDialogForm
						employeeData={selectedEmployee}
						dialogMode={dialogMode}
						onSubmit={handleSubmit}
						divisionOptions={division}
						isSubmitting={isSaving}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
