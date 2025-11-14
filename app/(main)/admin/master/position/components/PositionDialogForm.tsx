"use client";
import FormDropdown from "@/components/form/FormDropdown";
import FormInputNumber from "@/components/form/FormInputNumber";
import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import {
	PositionFormData,
	positionFormSchema,
} from "@/lib/schemas/positionFormSchema";
import { PositionFormProps } from "@/lib/types/form/positionFormType";
import { positionDefaultValues } from "@/lib/values/positionDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";

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
			<FormInputText
				props={{
					...formik.getFieldProps("name"),
				}}
				fieldName={"name"}
				label="Nama Posisi"
				isFieldInvalid={isFieldInvalid}
				getFieldError={getFieldError}
			/>

			<FormDropdown
				props={{
					...formik.getFieldProps("division_code"),
					options: divisionOptions,
					optionLabel: "name",
					optionValue: "division_code",
					placeholder: "Pilih Divisi",
					filter: true,
					filterDelay: 400,
				}}
				fieldName={"division_code"}
				label="Pilih Divisi"
				isFieldInvalid={isFieldInvalid}
				getFieldError={getFieldError}
			/>

			<FormInputNumber
				props={{
					value: formik.values.base_salary,
					onValueChange: (e: InputNumberValueChangeEvent) => {
						formik.setFieldValue("base_salary", e.value);
					},
					onBlur: formik.handleBlur,
				}}
				fieldName={"base_salary"}
				label="Gaji Pokok"
				isFieldInvalid={isFieldInvalid}
				getFieldError={getFieldError}
			/>

			<FormInputTextarea
				props={{
					...formik.getFieldProps("description"),
					rows: 5,
				}}
				fieldName={"description"}
				label="Deskripsi"
				isFieldInvalid={isFieldInvalid}
				getFieldError={getFieldError}
				optional
			/>

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
