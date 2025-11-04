"use client";
import {
	DepartementFormData,
	departmentFormSchema,
} from "@/lib/schemas/departmentFormSchema";
import {
	EmployeeFormData,
	employeeFormSchema,
} from "@/lib/schemas/employeeFormSchema";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
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

type FormErrors = z.ZodFlattenedError<DepartementFormData>["fieldErrors"];

interface DepartmentFormProps {
	departmentData: DepartementFormData | null;
	// onSubmit: (formData: EmployeeFormData) => void;
}

const defaultValues: DepartementFormData = {
	code: "",
	name: "",
	created_at: null as any,
};

export default function DepartmentDialogForm({
	departmentData,
}: // onSubmit,
DepartmentFormProps) {
	// const [formData, setFormData] = useState<EmployeeFormData>(defaultValues);
	// const [errors, setErrors] = useState<FormErrors>({});

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

		onSubmit: (values) => {
			// onSubmit(values);
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
				<label htmlFor="code">Kode Departemen</label>
				<InputText
					id="code"
					name="code"
					value={formik.values.code}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={` ${isFieldInvalid("code") ? "p-invalid" : ""}`}
				/>
				{getFieldError("code") && (
					<small className="p-error">{getFieldError("code")}</small>
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
					className={isFieldInvalid("name") ? "p-invalid" : ""}
				/>

				{getFieldError("name") && (
					<small className="p-error">{getFieldError("name")}</small>
				)}
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="created_at">Tanggal Dibuat</label>
				<Calendar
					id="created_at"
					name="created_at"
					value={formik.values.created_at}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("created_at") ? "p-invalid" : ""}
					showIcon
				/>

				{getFieldError("created_at") && (
					<small className="p-error">{getFieldError("created_at")}</small>
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
