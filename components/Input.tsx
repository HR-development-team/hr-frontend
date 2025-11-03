import { InputText, InputTextProps } from "primereact/inputtext";
import { ReactNode } from "react";

interface iconInputProps extends InputTextProps {
	icon: ReactNode;
	iconPosition?: "left" | "right";
}

export default function InputTextComponent({
	icon,
	iconPosition = 'left',
	...props
}: iconInputProps) {


	const wrapperClass =
		iconPosition === "left" ? "p-input-icon-left" : "p-input-icon-right";

	let iconElement: ReactNode;

	if (typeof icon === "string") {
		iconElement = <i className={icon}></i>;
	} else {
		iconElement = icon;
	}
	return (
		<span className={`${wrapperClass} w-full`}>
			{iconPosition === "left" && iconElement}
			<InputText {...props} />
			{iconPosition === "right" && iconElement}
		</span>
	);
}
