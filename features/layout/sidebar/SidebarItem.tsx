import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { classNames } from "primereact/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon?: LucideIcon;
  isActive: boolean;
  className?: string;
}

export const SidebarItem = ({
  label,
  href,
  icon: Icon,
  isActive,
  className,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={classNames(
        // PrimeFlex Layout & Spacing
        "flex align-items-center gap-3 px-3 py-2 border-round transition-colors transition-duration-200 no-underline mb-1 cursor-pointer",
        {
          // Active State: Blue background, blue text
          "bg-blue-50 text-blue-700 font-semibold": isActive,
          // Inactive State: Gray text, hover light gray background
          "text-600 hover:surface-100 hover:text-900": !isActive,
        },
        className
      )}
    >
      {Icon && (
        <Icon
          size={20}
          strokeWidth={isActive ? 2.5 : 2}
          className={classNames({
            "text-blue-700": isActive,
            "text-500": !isActive,
          })}
        />
      )}
      <span className="text-sm">{label}</span>
    </Link>
  );
};
