import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";

interface FormInputTextareProps<TFormData> {
  fieldName: keyof TFormData;
  props: InputTextareaProps;
  label: string;
  isFieldInvalid: (fieldName: keyof TFormData) => boolean;
  getFieldError: (fieldName: keyof TFormData) => string | undefined;
  optional?: boolean;
}

export default function FormInputTextarea<TFormData>({
  props,
  label,
  fieldName,
  isFieldInvalid,
  getFieldError,
  optional,
}: FormInputTextareProps<TFormData>) {
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
      <InputTextarea
        {...props}
        id={fieldName as string}
        name={fieldName as string}
        className={`${props.className || ""} ${hasError ? "p-invalid" : ""}`}
      />

      {errorMessage && <small className="p-error">{errorMessage}</small>}
    </div>
  );
}
