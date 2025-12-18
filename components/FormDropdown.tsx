import { Dropdown, DropdownProps } from "primereact/dropdown";
import { classNames } from "primereact/utils";

interface FormDropdownProps extends DropdownProps {
  label: string;
  id: string; // use name as id usually
  error?: string;
  touched?: boolean;
  isRequired?: boolean;
}

export default function FormDropdown({
  label,
  id,
  error,
  touched,
  className,
  isRequired,
  ...props
}: FormDropdownProps) {
  const isInvalid = touched && !!error;

  return (
    <div className="flex flex-column gap-2">
      <label htmlFor={id} className="font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <Dropdown
        id={id}
        className={classNames({ "p-invalid": isInvalid }, className)}
        {...props}
      />
      {isInvalid && <small className="p-error">{error}</small>}
    </div>
  );
}
