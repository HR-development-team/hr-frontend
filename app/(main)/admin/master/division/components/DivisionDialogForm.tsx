"use client";
import {
	DivisionFormData,
	divisionFormSchema,
} from "@/lib/schemas/divisionFormSchema";
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
const departmentOptions = [
	{ label: "Pilih Posisi", value: 0 },
	{ label: "R&D", value: 1 },
	{ label: "Penjualan", value: 2 },
	{ label: "Pemasaran", value: 3 },
	{ label: "Operasi", value: 4 },
];

type FormErrors = z.ZodFlattenedError<DivisionFormData>["fieldErrors"];

interface DivisionFormProps {
	divisionData: DivisionFormData | null;
	// onSubmit: (formData: EmployeeFormData) => void;
}

const defaultValues: DivisionFormData = {
	code: "",
	name: "",
	department_id: 0,
};

export default function DivisionDialogForm({
	divisionData,
}: // onSubmit,
DivisionFormProps) {
	// const [formData, setFormData] = useState<EmployeeFormData>(defaultValues);
	// const [errors, setErrors] = useState<FormErrors>({});

	const formik = useFormik({
		initialValues: divisionData || defaultValues,
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
			// onSubmit(values);
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
			<div className="w-full flex flex-column gap-2">
				<label htmlFor="code">Kode Divisi</label>
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
					options={departmentOptions}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					className={isFieldInvalid("department_id") ? "p-invalid" : ""}
				/>

				{getFieldError("department_id") && (
					<small className="p-error">{getFieldError("department_id")}</small>
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
