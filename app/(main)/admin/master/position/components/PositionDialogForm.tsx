"use client";
import {
	PositionFormData,
	positionFormSchema,
} from "@/lib/schemas/positionFormSchema";
import { PositionFormProps } from "@/lib/types/form/positionFormType";
import { positionDefaultValues } from "@/lib/values/positionDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import {
	InputNumber,
	InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

export default function PositionDialogForm({
	positionData,
	onSubmit,
	divisionOptions,
	isSubmitting,
}: PositionFormProps) {
	const formik = useFormik({
		initialValues: positionData || positionDefaultValues,
		validate: (values) => {
			const validation = positionFormSchema.safeParse(values);

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

	const isFieldInvalid = (fieldName: keyof PositionFormData) =>
		!!(formik.touched[fieldName] && formik.errors[fieldName]);

	const getFieldError = (fieldName: keyof PositionFormData) => {
		return isFieldInvalid(fieldName)
			? (formik.errors[fieldName] as string)
			: undefined;
	};

	return (
		<form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
			<div className="w-full flex flex-column gap-2">
				<label htmlFor="position_code">Kode Divisi</label>
				<InputText
					id="position_code"
					name="position_code"
					value={formik.values.position_code}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={` ${isFieldInvalid("position_code") ? "p-invalid" : ""}`}
				/>
				{getFieldError("position_code") && (
					<small className="p-error">{getFieldError("position_code")}</small>
				)}
			</div>

			<div className="w-full flex flex-column gap-2">
				<label htmlFor="name">Nama Divisi</label>
				<InputText
					id="name"
					name="name"
					value={formik.values.name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("name") ? "p-invalid" : ""}
				/>

				{getFieldError("name") && (
					<small className="p-error">{getFieldError("name")}</small>
				)}
			</div>

			<div className="w-full flex flex-column gap-2">
				<label htmlFor="department_id">Berasal Dari Departement</label>
				<Dropdown
					id="department_id"
					name="department_id"
					value={formik.values.department_id}
					options={divisionOptions}
					optionLabel="name"
					optionValue="id"
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					filter
					filterDelay={400}
					className={isFieldInvalid("department_id") ? "p-invalid" : ""}
				/>

				{getFieldError("department_id") && (
					<small className="p-error">{getFieldError("department_id")}</small>
				)}
			</div>

			<div className="w-full flex flex-column gap-2">
				<label htmlFor="base_salary">Gaji Pokok</label>
				<InputNumber
					id="base_salary"
					name="base_salary"
					value={formik.values.base_salary}
					onValueChange={(e: InputNumberValueChangeEvent) => {
						formik.setFieldValue("base_salary", e.value);
					}}
					// onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("base_salary") ? "p-invalid" : ""}
				/>

				{getFieldError("base_salary") && (
					<small className="p-error">{getFieldError("base_salary")}</small>
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
