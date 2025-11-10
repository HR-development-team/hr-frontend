"use client";

import {
	EmployeeFormData,
	employeeFormSchema,
} from "@/lib/schemas/employeeFormSchema";
import { UserFormData, userFormSchema } from "@/lib/schemas/userFormSchema";
import { EmployeeData } from "@/lib/types/employee";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

// status
const roleOptions = [
	{ label: "Admin", value: "admin" },
	{ label: "Karyawan", value: "employee" },
];

interface UserFormProps {
	userData: UserFormData | null;
	onSubmit: (formData: UserFormData) => void;
	dialogMode: "add" | "edit" | null;
	employeeOptions: EmployeeData[];
	isSubmitting: boolean;
}

const defaultValues: UserFormData = {
	email: "",
	password: "",
	employee_id: 0,
	role: "employee",
};

export default function UserDialogForm({
	userData,
	onSubmit,
	employeeOptions,
	isSubmitting,
}: UserFormProps) {
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

	const formik = useFormik({
		initialValues: userData || defaultValues,
		validate: (values) => {
			const validation = userFormSchema.safeParse(values);

			if (validation.success) {
				return {};
			}

			const errors: Record<string, string> = {};
			for (const [key, value] of Object.entries(
				validation.error.flatten().fieldErrors
			)) {
				if (value) errors[key] = value[0];
			}

			return errors;
		},

		onSubmit: (values) => {
			onSubmit(values);
		},

		enableReinitialize: true,
	});

	const isFieldInvalid = (fieldName: keyof UserFormData) =>
		!!(formik.touched[fieldName] && formik.errors[fieldName]);

	const getFieldError = (fieldName: keyof UserFormData) => {
		return isFieldInvalid(fieldName)
			? (formik.errors[fieldName] as string)
			: undefined;
	};

	return (
		<form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
			<div className="flex flex-column md:flex-row gap-2">
				<div className="w-full flex flex-column gap-2">
					<label htmlFor="email">Email</label>
					<InputText
						id="email"
						name="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={` ${isFieldInvalid("email") ? "p-invalid" : ""}`}
						placeholder="ex: budi@example.com"
					/>
					{getFieldError("email") && (
						<small className="p-error">{getFieldError("email")}</small>
					)}
				</div>

				<div className="w-full flex flex-column gap-2">
					<label htmlFor="password">Password</label>
					<div className="p-inputgroup w-full">
						<InputText
							id="password"
							name="password"
							type={passwordVisible ? "text" : "password"}
							value={formik.values.password}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder="Masukkan Kassword"
							className={isFieldInvalid("password") ? "p-invalid" : ""}
						/>

						<Button
							type="button"
							icon={passwordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
							className="p-button-secondary p-button-text p-button-plain border-1 border-gray-400"
							onClick={() => setPasswordVisible(!passwordVisible)}
						/>
					</div>

					{getFieldError("password") && (
						<small className="p-error">{getFieldError("password")}</small>
					)}

					<div className="p-3 bg-gray-50 border-round mt-2">
						<div className="font-bold mb-1 text-sm text-700">
							Password harus berisi:
						</div>
						<ul className="pl-3 mt-1 line-height-3 text-sm text-500">
							<li>Setidaknya mengandung 1 huruf kecil</li>
							<li>Setidaknya mengandung 1 huruf besar</li>
							<li>Setidaknya mengandung 1 angka</li>
							<li>Setidaknya mengandung 1 karakter spesial</li>
							<li>Minimal 8 karakter</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="employee_id">Nama Karyawan</label>
				<Dropdown
					id="employee_id"
					name="employee_id"
					placeholder="Pilih Karyawan"
					value={formik.values.employee_id}
					options={employeeOptions}
					optionLabel="first_name"
					optionValue="id"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					filter
					filterDelay={400}
					className={isFieldInvalid("employee_id") ? "p-invalid" : ""}
				/>

				{getFieldError("employee_id") && (
					<small className="p-error">{getFieldError("employee_id")}</small>
				)}
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="role">Role</label>
				<Dropdown
					id="role"
					name="role"
					value={formik.values.role}
					options={roleOptions}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("role") ? "p-invalid" : ""}
				/>

				{getFieldError("role") && (
					<small className="p-error">{getFieldError("role")}</small>
				)}
			</div>

			<div className="flex justify-content-end mt-4">
				<Button
					type="submit"
					label="Simpan"
					icon="pi pi-save"
					severity="success"
					loading={isSubmitting}
					disabled={formik.isSubmitting}
					pt={{
						icon: {
							className: "mr-2",
						},
					}}
				/>
			</div>
		</form>
	);
}
