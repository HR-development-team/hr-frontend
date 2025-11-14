"use client";
import FormDropdown from "@/components/form/FormDropdown";
import FormInputNumber from "@/components/form/FormInputNumber";
import FormInputText from "@/components/form/FormInputText";
import FormInputTextarea from "@/components/form/FormInputTextarea";
import { DivisionFormData, divisionFormSchema } from "@/lib/schemas/divisionFormSchema";
import { positionFormSchema } from "@/lib/schemas/positionFormSchema";
import { DivisionFormProps } from "@/lib/types/form/divisionFormType";
import { divisionDefaultValue } from "@/lib/values/divisionDefaultValue";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";

export default function DivisionDialogForm({
	divisionData,
	onSubmit,
	departmentOptions,
	isSubmitting,
}: DivisionFormProps) {
	const formik = useFormik({
		initialValues: divisionData || divisionDefaultValue,
		validate: (values) => {
			const validation = divisionFormSchema.safeParse(values);

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

	const isFieldInvalid = (fieldName: keyof DivisionFormData) =>
		!!(formik.touched[fieldName] && formik.errors[fieldName]);

	const getFieldError = (fieldName: keyof DivisionFormData) => {
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
				label="Nama Divisi"
				isFieldInvalid={isFieldInvalid}
				getFieldError={getFieldError}
			/>

			<FormDropdown
				props={{
					...formik.getFieldProps("department_code"),
					options: departmentOptions,
					optionLabel: "name",
					optionValue: "department_code",
					placeholder: "Pilih Departemen",
					filter: true,
					filterDelay: 400,
				}}
				fieldName={"department_code"}
				label="Pilih Departemen"
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
