import { Button } from "primereact/button";
import { InputText, InputTextProps } from "primereact/inputtext";
import { useState } from "react";

interface InputTextComponentProps<TFormData> {
  fieldName: keyof TFormData;
  props: InputTextProps;
  label: string;
  isFieldInvalid: (fieldName: keyof TFormData) => boolean;
  getFieldError: (fieldName: keyof TFormData) => string | undefined;
  optional?: boolean;
}

export default function FormPassword<TFormData>({
  props,
  label,
  fieldName,
  isFieldInvalid,
  getFieldError,
  optional,
}: InputTextComponentProps<TFormData>) {
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

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
      <div className="p-inputgroup w-full">
        <InputText
          {...props}
          id={fieldName as string}
          name={fieldName as string}
          type={passwordVisible ? "text" : "password"}
          className={`${props.className || ""} ${hasError ? "p-invalid" : ""}`}
        />

        <Button
          type="button"
          icon={passwordVisible ? "pi pi-eye-slash" : "pi pi-eye"}
          className="p-button-secondary p-button-text p-button-plain border-1 border-gray-400"
          onClick={() => setPasswordVisible(!passwordVisible)}
        />
      </div>

      {errorMessage && <small className="p-error">{errorMessage}</small>}
    </div>
  );
}
