"use client";

import { User, Users } from "lucide-react";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import InputTextComponent from "@/components/Input";
import { use, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import UserDialogForm from "./components/UserDialogForm";
import { UserFormData } from "@/lib/schemas/userFormSchema";
import DataTableUser from "./components/DataTableUser";
import { Toast } from "primereact/toast";
import { UserData } from "@/lib/types/user";
import { EmployeeData } from "@/lib/types/employee";

interface CombinedUserData extends UserData {
	employee_first_name: string;
}

export default function UserPage() {
	const toastRef = useRef<Toast>(null);
	const isInitialLoad = useRef<boolean>(true);

	const [employee, setEmployee] = useState<EmployeeData[]>([]);
	const [user, setUser] = useState<UserData[]>([]);

	const [currentEditedId, setCurrentEditedId] = useState<number | null>(null);

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
	const [selecteduser, setSelectedUser] = useState<UserFormData | null>(null);

	const fetchAllData = async () => {
		setIsLoading(true);
		try {
			const [employeeRes, userRes] = await Promise.all([
				fetch("/api/admin/master/employee"),
				fetch("/api/admin/master/user"),
			]);

			if (!employeeRes.ok || !userRes.ok)
				throw new Error("Gagal mendapatkan data dari server");

			const employeeData = await employeeRes.json();
			const userData = await userRes.json();

			console.log(userData.message);

			if (
				employeeData &&
				userData &&
				employeeData.status === "00" &&
				userData.status === "00"
			) {
				if (isInitialLoad.current) {
					toastRef.current?.show({
						severity: "success",
						summary: "Sukses",
						detail: userData.message,
						life: 3000,
					});

					isInitialLoad.current = false;
				}
				setEmployee(employeeData.master_employees || []);
				setUser(userData.users || []);
			} else {
				toastRef.current?.show({
					severity: "error",
					summary: "Gagal",
					detail: userData.message,
					life: 3000,
				});

				setEmployee([]);
				setUser([]);
			}
		} catch (error: any) {
			setEmployee([]);
			setUser([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (formData: UserFormData) => {
		setIsSaving(true);
		setIsLoading(true);

		const url =
			dialogMode === "edit"
				? `/api/admin/master/user/${currentEditedId}`
				: "/api/admin/master/user";

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
					detail: response?.errors?.[0]?.message || "Gagal menyimpan data user",
					life: 3000,
				});
			}

			fetchAllData();
			setSelectedUser(null);
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

	const handleEdit = (user: UserData) => {
		setDialogMode("edit");
		setIsDialogVisible(true);
		setSelectedUser({
			email: user.email,
			password: user.password,
			role: user.role,
			employee_id: user.employee_id,
		});

		setCurrentEditedId(user.id);
	};

	const handleDelete = (user: UserData) => {
		confirmDialog({
			icon: "pi pi-exclamation-triangle text-red-400 mr-2",
			header: "Konfirmasi Hapus",
			message: `Yakin ingin menghapus user ${user.email}`,
			acceptLabel: "Hapus",
			rejectLabel: "Batal",
			acceptClassName: "p-button-danger",
			accept: async () => {
				try {
					const res = await fetch(`/api/admin/master/user/${user.id}`, {
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
					setSelectedUser(null);
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

	const employeeMap = useMemo(() => {
		const map = new Map<number, string>();
		employee.forEach((depth) => {
			map.set(depth.id, depth.first_name);
		});
		return map;
	}, [employee]);

	const combinedUserData: CombinedUserData[] = useMemo(() => {
		return user.map((user) => {
			const employeeFirstName =
				employeeMap.get(user.employee_id) || "Tidak diketahui";

			return {
				...user,
				employee_first_name: employeeFirstName,
			};
		});
	}, [user, employeeMap]);

	return (
		<div>
			<Toast ref={toastRef} />
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
					<DataTableUser
						user={combinedUserData}
						isLoading={isLoading}
						onEdit={handleEdit}
						onDelete={handleDelete}
					/>
				</div>

				<ConfirmDialog />

				<Dialog
					header={dialogMode === "edit" ? "Edit User" : "Tambah User"}
					visible={isDialogVisible}
					onHide={() => setIsDialogVisible(false)}
					modal
					style={{ width: "75%" }}
				>
					<UserDialogForm
						userData={selecteduser}
						onSubmit={handleSubmit}
						dialogMode={dialogMode}
						employeeOptions={employee}
						isSubmitting={isSaving}
					/>
				</Dialog>
			</Card>
		</div>
	);
}
