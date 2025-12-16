import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { classNames } from "primereact/utils";

interface SidebarItemProps {
  label: string;
  href: string;
  icon?: LucideIcon;
  isActive: boolean;
}

export const SidebarItem = ({
  label,
  href,
  icon: Icon,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={classNames(
        "flex align-items-center gap-3 px-3 py-3 border-round-md transition-colors no-underline",
        {
          "bg-blue-50 text-blue-700 font-bold": isActive,
          "text-600 hover:surface-100 hover:text-900 font-medium": !isActive,
        }
      )}
    >
      {Icon && (
        <Icon size={20} className={isActive ? "text-blue-700" : "text-500"} />
      )}
      <span className="text-sm">{label}</span>
    </Link>
  );
};
