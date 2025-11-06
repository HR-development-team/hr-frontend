"use client";

import {
	EmployeeFormData,
	employeeFormSchema,
} from "@/lib/schemas/employeeFormSchema";
import { DivisionData } from "@/lib/types/division";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import z, { any } from "zod";

// dummy dropdown
const positionOptions = [
	{ label: "Pilih Posisi", value: 0 },
	{ label: "Software Engineer", value: 1 },
	{ label: "UI/UX Designer", value: 2 },
];

// dummy status
const statusOptions = [
	{ label: "Aktif", value: "Aktif" },
	{ label: "Non-Aktif", value: "Non-Aktif" },
];

interface EmployeeFormProps {
	employeeData: EmployeeFormData | null;
	onSubmit: (formData: EmployeeFormData) => void;
	divisionOptions: DivisionData[];
	isSubmitting: boolean;
}

const defaultValues: EmployeeFormData = {
	first_name: "",
	last_name: "",
	contact_phone: "",
	address: "",
	join_date: null as any,
	position_id: 0,
	// status: "Non-Aktif",
};

export default function EmployeeDialogForm({
	employeeData,
	onSubmit,
	divisionOptions,
	isSubmitting,
}: EmployeeFormProps) {
	const formik = useFormik({
		initialValues: employeeData || defaultValues,
		validate: (values) => {
			const validation = employeeFormSchema.safeParse(values);

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

	const isFieldInvalid = (fieldName: keyof EmployeeFormData) =>
		!!(formik.touched[fieldName] && formik.errors[fieldName]);

	const getFieldError = (fieldName: keyof EmployeeFormData) => {
		return isFieldInvalid(fieldName)
			? (formik.errors[fieldName] as string)
			: undefined;
	};

	return (
		<form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
			<div className="flex flex-column md:flex-row gap-2">
				<div className="w-full flex flex-column gap-2">
					<label htmlFor="first_name">Nama Depan</label>
					<InputText
						id="first_name"
						name="first_name"
						value={formik.values.first_name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={` ${isFieldInvalid("first_name") ? "p-invalid" : ""}`}
					/>
					{getFieldError("first_name") && (
						<small className="p-error">{getFieldError("first_name")}</small>
					)}
				</div>

				<div className="w-full flex flex-column gap-2">
					<label htmlFor="last_name">Nama Belakang</label>
					<InputText
						id="last_name"
						name="last_name"
						value={formik.values.last_name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={isFieldInvalid("last_name") ? "p-invalid" : ""}
					/>

					{getFieldError("last_name") && (
						<small className="p-error">{getFieldError("last_name")}</small>
					)}
				</div>
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="contact_phone">
					No. Telepon <span className="text-xs font-light">(optional)</span>{" "}
				</label>
				<InputText
					keyfilter="int"
					id="contact_phone"
					name="contact_phone"
					value={formik.values.contact_phone}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("contact_phone") ? "p-invalid" : ""}
				/>

				{getFieldError("contact_phone") && (
					<small className="p-error">{getFieldError("contact_phone")}</small>
				)}
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="address">
					Alamat <span className="text-xs font-light">(optional)</span>
				</label>
				<InputTextarea
					id="address"
					name="address"
					value={formik.values.address}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("address") ? "p-invalid" : ""}
				/>

				{getFieldError("address") && (
					<small className="p-error">{getFieldError("address")}</small>
				)}
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="join_date">Tanggal Bergabung</label>
				<Calendar
					id="join_date"
					name="join_date"
					value={formik.values.join_date}
					onChange={(e: any) => {
						formik.setFieldValue("join_date", e.value);
					}}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("join_date") ? "p-invalid" : ""}
					showIcon
				/>

				{getFieldError("join_date") && (
					<small className="p-error">{getFieldError("join_date")}</small>
				)}
			</div>

			<div className="flex flex-column md:flex-row gap-2">
				<div className="w-full flex flex-column gap-2">
					<label htmlFor="position_id">Jabatan</label>
					<Dropdown
						id="position_id"
						name="position_id"
						value={formik.values.position_id}
						options={divisionOptions}
						optionLabel="name"
						optionValue="id"
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						filter
						filterDelay={400}
						className={isFieldInvalid("position_id") ? "p-invalid" : ""}
					/>

					{getFieldError("position_id") && (
						<small className="p-error">{getFieldError("position_id")}</small>
					)}
				</div>

				{/* <div className="w-full flex flex-column gap-2"> */}
				{/* <label htmlFor="status">Status</label>
					<Dropdown
						id="status"
						name="status"
						value={formik.values.status}
						options={statusOptions}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={isFieldInvalid("status") ? "p-invalid" : ""}
					/> */}

				{/* {getFieldError("status") && (
						<small className="p-error">{getFieldError("status")}</small>
					)} */}
				{/* </div> */}
			</div>

			<div className="flex justify-content-end mt-4">
				<Button
					type="submit"
					label="Simpan"
					icon="pi pi-save"
					severity="success"
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
