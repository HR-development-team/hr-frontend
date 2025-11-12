import { formatDateIDN } from "@/lib/utils/dateFormat";
import { Briefcase, IdCard, Phone, User } from "lucide-react";
import { Avatar } from "primereact/avatar";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import React from "react";
import EmployeeDialogViewSkeleton from "./EmployeeDialogViewSkeleton";
import { EmployeeViewProps } from "@/lib/types/view/employeeViewTypes";

export default function EmployeeDialogView({
	employeeData,
	isLoading,
	dialogMode,
}: EmployeeViewProps) {
	const isOnViewMode = dialogMode === "view" ? true : false;

	const statusBodyTemplate = () => {
		const severity =
			employeeData?.employment_status === "aktif" ? "success" : "danger";

		return <Tag value={employeeData?.employment_status} severity={severity} />;
	};

	if (isLoading) {
		return <EmployeeDialogViewSkeleton />;
	}

	return (
		<div className={`${isOnViewMode ? "text-800" : "hidden"}`}>
			<div className="grid">
				{/* employee profile and name */}
				<div className="col-12 md:col-4 text-800 mt-2">
					<Card className="text-center line-height-3">
						<Avatar className="w-10rem h-10rem bg-blue-500 text-white text-4xl font-semibold">
							<span>N/A</span>
						</Avatar>
						<div className="">
							<p className="text-xl font-bold">{employeeData?.full_name}</p>
							<p className="text-600 text-md font-semibold">
								{employeeData?.employee_code}
							</p>
						</div>
					</Card>

					<Card className="line-height-4 mt-2">
						<div className="flex align-items-center gap-2 mb-4">
							<Briefcase className="text-blue-500" />
							<span className="text-800 font-medium">Status Pekerjaan</span>
						</div>
						<div className="flex align-items-center justify-content-between">
							<span>Departemen</span>
							<p>{employeeData?.department_name}</p>
						</div>

						<div className="flex align-items-center justify-content-between">
							<span>Divisi</span>
							<p>{employeeData?.division_name} </p>
						</div>

						<div className="flex align-items-center justify-content-between">
							<span>Posisi/Jabatan</span>
							<p>{employeeData?.position_name} </p>
						</div>

						<div className="flex align-items-center justify-content-between">
							<span>Status</span>
							{statusBodyTemplate()}
						</div>

						<div className="flex align-items-center justify-content-between">
							<span>Tanggal Gabung</span>
							<p>{formatDateIDN(employeeData?.join_date)}</p>
						</div>

						<div className="flex align-items-center justify-content-between">
							<span>Tanggal Resign</span>
							<p>{formatDateIDN(employeeData?.resign_date)}</p>
						</div>
					</Card>
				</div>

				{/* separator */}
				<div className="col-0 md:col-0" />

				{/* employee identity */}
				<Card className="col-12 md:col-8 mt-2">
					<div className="flex align-items-center gap-2 mb-4">
						<User className="text-blue-500" />
						<span className="text-base font-medium">Informasi Pribadi</span>
					</div>

					<div className="grid line-height-3">
						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								Nama Lengkap
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.full_name}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								Jenis Kelamin
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.gender ? employeeData.gender : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								Tempat Lahir
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.birth_place ? employeeData.birth_place : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								Tanggal Lahir
							</span>
							<p className="text-800 text-base font-medium">
								{formatDateIDN(employeeData?.birth_date)}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								Golongan Darah
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.blood_type ? employeeData.blood_type : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">Agama</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.religion ? employeeData.religion : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								Status Pernikahan
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.maritial_status
									? employeeData.maritial_status
									: "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">Pendidikan</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.education ? employeeData.education : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">Alamat</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.address ? employeeData.address : "-"}
							</p>
						</div>
					</div>

					<hr className="border-1 border-400" />
					<div className="flex align-items-center gap-2 mt-2 mb-4">
						<Phone className="text-blue-500" />

						<span className="font-medium text-800 my-2">Kontak</span>
					</div>
					<div className="grid line-height-3">
						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">Email</span>
							<p className="text-800 text-base font-medium">Email karyawan</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								No. Telepon
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.contact_phone ? employeeData.contact_phone : "-"}
							</p>
						</div>
					</div>

					<hr className="border-1 border-400" />
					<div className="flex align-items-center gap-2 mt-2 mb-4">
						<IdCard className="text-blue-500" />
						<span className="font-medium text-800 my-2">No. Kependudukan</span>
					</div>
					<div className="grid line-height-3">
						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">No. KTP</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.ktp_number ? employeeData.ktp_number : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">No. NPWP</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.npwp ? employeeData.npwp : "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								No. BPJS Ketenagakerjaan
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.bpjs_ketenagakerjaan
									? employeeData.bpjs_ketenagakerjaan
									: "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								No. BPJS Kesehatan
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.bpjs_kesehatan
									? employeeData.bpjs_kesehatan
									: "-"}
							</p>
						</div>

						<div className="col-12 md:col-6">
							<span className="text-500 text-base font-medium">
								No. Rekening Bank
							</span>
							<p className="text-800 text-base font-medium">
								{employeeData?.bank_account ? employeeData.bank_account : "-"}
							</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
