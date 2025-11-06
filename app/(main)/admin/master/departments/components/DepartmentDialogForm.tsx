"use client";
import {
	DepartementFormData,
	departmentFormSchema,
} from "@/lib/schemas/departmentFormSchema";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

interface DepartmentFormProps {
	departmentData: DepartementFormData | null;
	dialogMode: "add" | "edit" | null;
	onSubmit: (formData: DepartementFormData) => Promise<void>;
}

const defaultValues: DepartementFormData = {
	name: "",
	department_code: "",
};

export default function DepartmentDialogForm({
	departmentData,
	dialogMode,
	onSubmit,
}: DepartmentFormProps) {
	const formik = useFormik({
		initialValues: departmentData || defaultValues,
		validate: (values) => {
			const validation = departmentFormSchema.safeParse(values);

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
		onSubmit: async (values, { setStatus, setSubmitting }) => {
			try {
				await onSubmit(values);
			} catch (error: any) {
				setStatus(error.message);
			}
		},

		enableReinitialize: true,
	});

	const isFieldInvalid = (fieldName: keyof DepartementFormData) =>
		!!(formik.touched[fieldName] && formik.errors[fieldName]);

	const getFieldError = (fieldName: keyof DepartementFormData) => {
		return isFieldInvalid(fieldName)
			? (formik.errors[fieldName] as string)
			: undefined;
	};

	return (
		<form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
			<div className="w-full flex flex-column gap-2">
				<label htmlFor="department_code">Kode Departemen</label>
				<InputText
					id="department_code"
					name="department_code"
					value={formik.values.department_code}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={` ${isFieldInvalid("department_code") ? "p-invalid" : ""}`}
				/>
				{getFieldError("department_code") && (
					<small className="p-error">{getFieldError("department_code")}</small>
				)}
			</div>

			<div className="w-full flex flex-column gap-2">
				<label htmlFor="name">Nama Departement</label>
				<InputText
					id="name"
					name="name"
					value={formik.values.name}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("department_code") ? "p-invalid" : ""}
				/>

				{getFieldError("department_code") && (
					<small className="p-error">{getFieldError("department_code")}</small>
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
