import { Calendar, CalendarProps } from "primereact/calendar";
import { classNames } from "primereact/utils";

interface FormCalendarProps extends CalendarProps {
  label: string;
  id: string;
  error?: string;
  touched?: boolean;
  isRequired?: boolean;
}

export default function FormCalendar({
  label,
  id,
  error,
  touched,
  className,
  isRequired,
  ...props
}: FormCalendarProps) {
  const isInvalid = touched && !!error;

  return (
    <div className="flex flex-column gap-2">
      <label htmlFor={id} className="font-medium">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <Calendar
        id={id}
        showIcon
        dateFormat="dd/mm/yy"
        className={classNames({ "p-invalid": isInvalid }, className)}
        {...props}
      />
      {isInvalid && <small className="p-error">{error}</small>}
    </div>
  );
}
