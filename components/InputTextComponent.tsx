import { InputText, InputTextProps } from "primereact/inputtext";
import { ReactNode } from "react";

interface IconInputProps extends InputTextProps {
  icon: ReactNode;
  iconPosition?: "left" | "right";
}

export default function InputTextComponent({
  icon,
  iconPosition = "left",
  className,
  ...props
}: IconInputProps) {
  const wrapperClass =
    iconPosition === "left" ? "p-input-icon-left" : "p-input-icon-right";

  let iconElement: ReactNode;

  if (typeof icon === "string") {
    iconElement = (
      <i className={`${icon} z-1 absolute`} style={{ left: "0.5em" }} />
    );
  } else {
    iconElement = (
      <i className="flex align-items-center justify-content-center z-1">
        {icon}
      </i>
    );
  }

  return (
    <span className={`${wrapperClass} w-full`}>
      {iconPosition === "left" && iconElement}
      <InputText className={`w-full ${className || ""}`} {...props} />
      {iconPosition === "right" && iconElement}
    </span>
  );
}
