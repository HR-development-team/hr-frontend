"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "./sidebarConfig";
import { SidebarItem } from "./SidebarItem";
import { usePathname } from "next/navigation";
import { classNames } from "primereact/utils";
import { ChevronDown, Dot } from "lucide-react";

interface SidebarSubmenuProps {
  item: MenuItem;
}

export const SidebarSubmenu = ({ item }: SidebarSubmenuProps) => {
  const pathname = usePathname();

  // 1. Strict check: active if current path starts with child href
  const isChildActive =
    item.children?.some(
      (child) =>
        child.href &&
        (pathname === child.href || pathname.startsWith(`${child.href}/`))
    ) ?? false;

  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  return (
    <div className="mb-1">
      {/* --- Parent Toggle Button --- */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          // PrimeFlex classes
          "flex align-items-center justify-content-between px-3 py-2 border-round cursor-pointer select-none transition-colors transition-duration-200 hover:surface-100",
          {
            "text-blue-700 bg-blue-50 font-medium": !isOpen && isChildActive, // Highlight parent if closed but child active
            "text-700": !isChildActive,
            "text-900 font-medium": isOpen,
          }
        )}
      >
        <div className="flex align-items-center gap-3">
          {item.icon && (
            <item.icon
              size={20}
              className={classNames({
                "text-blue-700": isChildActive,
                "text-500": !isChildActive,
              })}
            />
          )}
          <span className="text-sm">{item.label}</span>
        </div>

        <ChevronDown
          size={16}
          className={classNames(
            "text-400 transition-all transition-duration-300",
            {
              "rotate-180": isOpen,
            }
          )}
        />
      </div>

      {/* --- Animation Container --- */}
      <div
        className="transition-all transition-duration-300 transition-ease-in-out"
        style={{
          display: "grid", // Essential for the row animation
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0.6,
        }}
      >
        <div className="overflow-hidden min-h-0">
          <div className="flex flex-column mt-1">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.href}
                label={child.label}
                href={child.href!}
                isActive={pathname === child.href}
                icon={Dot}
                // PrimeFlex indentation
                className="pl-5"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
