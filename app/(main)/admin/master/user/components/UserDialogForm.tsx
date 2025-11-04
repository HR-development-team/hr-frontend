"use client";

import {
	EmployeeFormData,
	employeeFormSchema,
} from "@/lib/schemas/employeeFormSchema";
import { UserFormData, userFormSchema } from "@/lib/schemas/userFormSchema";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import z, { any } from "zod";

// dummy dropdown
const employeeOptions = [
	{ label: "Pilih Karyawan", value: 0 },
	{ label: "Budi Setiawan", value: 1 },
	{ label: "Agus Zarihudin", value: 2 },
	{ label: "Sir Axelrod", value: 3 },
	{ label: "Rod Redline", value: 4 },
];

// dummy status
const roleOptions = [
	{ label: "Admin", value: "admin" },
	{ label: "Karyawan", value: "employee" },
];

type FormErrors = z.ZodFlattenedError<UserFormData>["fieldErrors"];

interface UserFormProps {
	userData: UserFormData | null;
	// onSubmit: (formData: EmployeeFormData) => void;
}

const defaultValues: UserFormData = {
	email: "",
	password: "",
	employee_id: 0,
	role: "employee",
};

export default function UserDialogForm({
	userData,
}: // onSubmit,
UserFormProps) {
	// const [formData, setFormData] = useState<EmployeeFormData>(defaultValues);
	// const [errors, setErrors] = useState<FormErrors>({});

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
			// onSubmit(values);
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

	const passwordFooter = (
		<>
			<Divider />
			<p>Password harus berisi</p>
			<ul className="pl-2 ml-2 mt-0 line-height-3">
				<li>Setidaknya mengandung 1 huruf kecil</li>
				<li>Setidaknya mengandung 1 huruf besar</li>
				<li>Setidaknya mengandung 1 angka</li>
				<li>Setidaknya mengandung 1 karakter spesial</li>
				<li>Minimal 8 karakter</li>
			</ul>
		</>
	);

	return (
		<form onSubmit={formik.handleSubmit} className="flex flex-column gap-3">
			<div className="flex flex-column md:flex-row gap-2">
				<div className="w-full flex flex-column gap-2">
					<label htmlFor="email">email</label>
					<InputText
						id="email"
						name="email"
						value={formik.values.email}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						className={` ${isFieldInvalid("email") ? "p-invalid" : ""}`}
					/>
					{getFieldError("email") && (
						<small className="p-error">{getFieldError("email")}</small>
					)}
				</div>

				<div className="w-full flex flex-column gap-2">
					<label htmlFor="password">Password</label>
					<Password
						id="password"
						name="password"
						value={formik.values.password}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						footer={passwordFooter}
						className={isFieldInvalid("password") ? "p-invalid" : ""}
						inputClassName="w-full"
						toggleMask
					/>

					{getFieldError("password") && (
						<small className="p-error">{getFieldError("password")}</small>
					)}
				</div>
			</div>

			<div className="flex flex-column gap-2">
				<label htmlFor="employee_id">Nama Karyawan</label>
				<Dropdown
					id="employee_id"
					name="employee_id"
					value={formik.values.employee_id}
					options={employeeOptions}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
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
