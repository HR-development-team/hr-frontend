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
  style,
  ...props
}: IconInputProps) {
  return (
    <div className="relative w-full" style={{ position: "relative" }}>
      {iconPosition === "left" && (
        <div
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            color: "#6b7280",
          }}
        >
          {typeof icon === "string" ? <i className={icon} /> : icon}
        </div>
      )}

      <InputText
        className={`w-full ${className || ""}`}
        style={{
          ...style,
          paddingLeft: iconPosition === "left" ? "40px" : undefined,
          paddingRight: iconPosition === "right" ? "40px" : undefined,
        }}
        {...props}
      />

      {iconPosition === "right" && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            color: "#6b7280",
          }}
        >
          {typeof icon === "string" ? <i className={icon} /> : icon}
        </div>
      )}
    </div>
  );
}
