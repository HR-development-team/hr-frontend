"use client";

import { Flashlight, User, Users } from "lucide-react";
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
import { Toast } from "primereact/toast";
import EmployeeDialogView from "./components/EmployeeDialogView";
import { GetAllEmployeeData, GetEmployeeByIdData } from "@/lib/types/employee";

// interface CombinedEmployeeData extends EmployeeData {
// 	division_name: string;
// }

export default function Employees() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	// const [position, setPosition] = useState<PositionData[]>([]);
	const [allEmployee, setAllEmployee] = useState<GetAllEmployeeData[]>([]);
	const [viewEmployee, setViewEmployee] = useState<GetEmployeeByIdData | null>(
		null
	);

	const [currentSelectedId, setCurrentSelectedId] = useState<number | null>(
		null
	);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [dialogMode, setDialogMode] = useState<"view" | "add" | "edit" | null>(
		null
	);
	const [dialogLabel, setDialogLabel] = useState<
		"Lihat Data Karyawan" | "Edit Karyawan" | "Tambah Karyawan" | null
	>(null);

	const [selectedEmployee, setSelectedEmployee] =
		useState<EmployeeFormData | null>(null);

	const fetchAllEmployee = async () => {
		setIsLoading(true);
		try {
			const res = await fetch("/api/admin/master/employee");

			if (!res.ok) {
				throw new Error("Gagal mendapatkan data dari server");
			}

			const responseData = await res.json();

			if (responseData && responseData.status === "00") {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: responseData.message,
						life: 3000,
					});
					isInitialLoad.current = false;
				}
				setAllEmployee(responseData.master_employees || []);
			}
		} catch (error: any) {
			setAllEmployee([]);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchEmployeeById = async (id: number) => {
		setIsLoading(true);
		try {
			const res = await fetch(`/api/admin/master/employee/${id}`);

			if (!res.ok) {
				throw new Error("Gagal mendapatkan data dari server");
			}

			const responseData = await res.json();

			if (responseData && responseData.status === "00") {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: responseData.message,
						life: 3000,
					});
					isInitialLoad.current = false;
				}
				setViewEmployee(responseData.master_employees || null);
			}
		} catch (error: any) {
			setViewEmployee(null);
		} finally {
			setIsLoading(false);
		}
	};

	// const fetchAllData = async () => {
	// 	setIsLoading(true);
	// 	try {
	// 		const [positionRes, employeeRes] = await Promise.all([
	// 			fetch("/api/admin/master/position"),
	// 			fetch("/api/admin/master/employee"),
	// 		]);

	// 		if (!positionRes.ok || !employeeRes.ok)
	// 			throw new Error("Gagal mendapatkan data dari server");

	// 		const positionData = await positionRes.json();
	// 		const employeeData = await employeeRes.json();

	// 		console.log(employeeData.message);

	// 		if (
	// 			positionData &&
	// 			employeeData &&
	// 			positionData.status === "00" &&
	// 			employeeData.status === "00"
	// 		) {
	// 			if (isInitialLoad.current) {
	// 				toastRef.current?.show({
	// 					severity: "success",
	// 					summary: "Sukses",
	// 					detail: employeeData.message,
	// 					life: 3000,
	// 				});

	// 				isInitialLoad.current = false;
	// 			}
	// 			setPosition(positionData.master_positions || []);
	// 			setEmployee(employeeData.master_employees || []);
	// 		} else {
	// 			toastRef.current?.show({
	// 				severity: "error",
	// 				summary: "Gagal",
	// 				detail: employeeData.message,
	// 				life: 3000,
	// 			});

	// 			setPosition([]);
	// 			setEmployee([]);
	// 		}
	// 	} catch (error: any) {
	// 		setPosition([]);
	// 		setEmployee([]);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

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
				? `/api/admin/master/employee/${currentSelectedId}`
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
				// fetchAllData();
				fetchAllEmployee();
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail:
						response?.errors?.[0]?.message || "Gagal menyimpan data karyawan",
					life: 3000,
				});
			}

			// fetchAllData();
			fetchAllEmployee();
			setSelectedEmployee(null);
			setDialogMode(null);
			setIsDialogVisible(false);
			setCurrentSelectedId(null);
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

	const handleView = (employee: GetAllEmployeeData) => {
		setDialogMode("view");
		setIsDialogVisible(true);
		setDialogLabel("Lihat Data Karyawan");
		console.log("Id detail karyawan:", employee.id);

		fetchEmployeeById(employee.id);
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
		setCurrentSelectedId(employee.id);
		setDialogLabel("Edit Karyawan");
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

					// fetchAllData();
					fetchAllEmployee();
					setSelectedEmployee(null);
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
		// fetchAllData();
		fetchAllEmployee();
	}, []);

	// const positionMap = useMemo(() => {
	// 	const map = new Map<number, string>();
	// 	position.forEach((depth) => {
	// 		map.set(depth.id, depth.name);
	// 	});
	// 	return map;
	// }, [position]);

	// const combinedEmployeeData: CombinedEmployeeData[] = useMemo(() => {
	// 	return employee.map((employee) => {
	// 		const divisionName =
	// 			positionMap.get(employee.position_id) || "Tidak diketahui";

	// 		return {
	// 			...employee,
	// 			division_name: divisionName,
	// 		};
	// 	});
	// }, [employee, positionMap]);

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
										setDialogLabel("Tambah Karyawan");
										setIsDialogVisible(true);
										setSelectedEmployee(null);
										setCurrentSelectedId(null);
									}}
								/>
							</div>
						</div>
					</div>

					{/* data table */}
					<DataTableEmployees
						employees={allEmployee}
						isLoading={isLoading}
						onView={handleView}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>

				<ConfirmDialog />

				<Dialog
					header={dialogLabel}
					visible={isDialogVisible}
					onHide={() => {
						setDialogLabel(null);
						setIsDialogVisible(false);
						setViewEmployee(null);
					}}
					modal
					className={`w-full ${dialogMode === "view" ? "md:w-9" : "md:w-6"}`}
				>
					<EmployeeDialogForm
						employeeData={selectedEmployee}
						dialogMode={dialogMode}
						onSubmit={handleSubmit}
						// positionOptions={position}
						isSubmitting={isSaving}
					/>

					<EmployeeDialogView
						employeeData={viewEmployee}
						isLoading={isLoading}
						dialogMode={dialogMode}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
