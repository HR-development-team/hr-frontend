import { Dropdown, DropdownProps } from "primereact/dropdown";

interface FormDropdownProps<TFormData> {
	fieldName: keyof TFormData;
	props: DropdownProps;
	label: string;
	isFieldInvalid: (fieldName: keyof TFormData) => boolean;
	getFieldError: (fieldName: keyof TFormData) => string | undefined;
	optional?: boolean;
}

export default function FormDropdown<TFormData>({
	fieldName,
	props,
	label,
	isFieldInvalid,
	getFieldError,
	optional,
}: FormDropdownProps<TFormData>) {
	const hasError = isFieldInvalid(fieldName);
	const errorMessage = getFieldError(fieldName);
	return (
		<div className="flex flex-column gap-2 w-full">
			<label htmlFor={fieldName as string}>
				<span className="mr-1">{label}</span>
				<span className={`${optional ? "text-xs font-ligh" : "text-red-500"}`}>
					{optional ? "(Optional)" : "*"}
				</span>
			</label>
			<Dropdown
				{...props}
				id={fieldName as string}
				name={fieldName as string}
				className={`${props.className || ""} ${hasError ? "p-invalid" : ""}`}
			/>

			{errorMessage && <small className="p-error">{errorMessage}</small>}
		</div>
	);
}
