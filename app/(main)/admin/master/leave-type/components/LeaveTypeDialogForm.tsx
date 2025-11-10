"use client";

import {
	EmployeeFormData,
	employeeFormSchema,
} from "@/lib/schemas/employeeFormSchema";
import {
	LeaveTypeFormData,
	leaveTypeFormSchema,
} from "@/lib/schemas/leaveTypeFormSchema";
import { LeaveTypeData } from "@/lib/types/leaveType";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

interface LeaveTypeFormProps {
	leaveType: LeaveTypeFormData | null;
	onSubmit: (formData: LeaveTypeFormData) => void;
	isSubmitting: boolean;
}

const defaultValues: LeaveTypeFormData = {
	name: "",
	deduction: 0,
	description: "",
};

export default function LeaveTypeDialogForm({
	leaveType,
	onSubmit,
	isSubmitting,
}: LeaveTypeFormProps) {
	const formik = useFormik({
		initialValues: leaveType || defaultValues,
		validate: (values) => {
			const validation = leaveTypeFormSchema.safeParse(values);

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

	const isFieldInvalid = (fieldName: keyof LeaveTypeFormData) =>
		!!(formik.touched[fieldName] && formik.errors[fieldName]);

	const getFieldError = (fieldName: keyof LeaveTypeFormData) => {
		return isFieldInvalid(fieldName)
			? (formik.errors[fieldName] as string)
			: undefined;
	};

	return (
		<form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
			<div className="flex flex-column md:flex-row gap-2">
				<div className="w-full flex flex-column gap-2">
					<label htmlFor="name">Nama Cuti</label>
					<InputText
						id="name"
						name="name"
						value={formik.values.name}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={` ${isFieldInvalid("name") ? "p-invalid" : ""}`}
						placeholder="Isi Nama Cuti"
					/>
					{getFieldError("name") && (
						<small className="p-error">{getFieldError("name")}</small>
					)}
				</div>

				<div className="w-full flex flex-column gap-2">
					<label htmlFor="deduction">Pengurangan Gaji</label>
					<InputNumber
						id="deduction"
						name="deduction"
						value={formik.values.deduction}
						onValueChange={(e: InputNumberValueChangeEvent) => {
							formik.setFieldValue("deduction", e.value);
						}}
						onBlur={formik.handleBlur}
						className={isFieldInvalid("deduction") ? "p-invalid" : ""}
					/>

					{getFieldError("deduction") && (
						<small className="p-error">{getFieldError("deduction")}</small>
					)}
				</div>
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="description">
					Deskripsi Cuti <span className="text-xs font-light">(optional)</span>{" "}
				</label>
				<InputTextarea
					id="description"
					name="description"
					rows={5}
					value={formik.values.description}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("description") ? "p-invalid" : ""}
				/>

				{getFieldError("description") && (
					<small className="p-error">{getFieldError("description")}</small>
				)}
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
