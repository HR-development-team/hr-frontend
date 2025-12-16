"use client";

import { useState, useEffect } from "react";
import { MenuItem } from "./sidebarConfig";
import { SidebarItem } from "./SidebarItem";
import { usePathname } from "next/navigation";
import { classNames } from "primereact/utils";

interface SidebarSubmenuProps {
  item: MenuItem;
}

export const SidebarSubmenu = ({ item }: SidebarSubmenuProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Check if any child is currently active
  const hasActiveChild = item.children?.some((child) =>
    pathname.startsWith(child.href)
  );

  // Auto-expand if a child is active
  useEffect(() => {
    if (hasActiveChild) {
      setIsOpen(true);
    }
  }, [hasActiveChild]);

  return (
    <div className="">
      {/* 1. Toggle Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={classNames(
          "flex align-items-center justify-content-between px-3 py-3 border-round-md cursor-pointer select-none transition-colors duration-200",
          {
            "bg-blue-50 text-blue-700": hasActiveChild && !isOpen,
            "text-600 hover:surface-100 hover:text-900": !hasActiveChild,
            "text-blue-800 font-medium": isOpen && hasActiveChild,
          }
        )}
      >
        <div className="flex align-items-center gap-3">
          {item.icon && (
            <item.icon
              size={20}
              className={classNames("transition-colors duration-200", {
                "text-blue-700": hasActiveChild,
                "text-500": !hasActiveChild,
              })}
            />
          )}
          <span className="text-sm font-medium">{item.label}</span>
        </div>

        <i
          className={classNames(
            "pi pi-chevron-down text-xs transition-transform duration-300 ease-in-out",
            {
              "rotate-180": isOpen,
              "text-blue-700": hasActiveChild,
              "text-500": !hasActiveChild,
            }
          )}
        />
      </div>

      {/* 2. The Animation Container */}
      <div
        style={{
          // Force Grid layout
          display: "grid",
          // Toggle the rows from 0 fraction to 1 fraction
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          // Explicitly tell the browser to animate grid-template-rows
          transition:
            "grid-template-rows 300ms ease-out, opacity 300ms ease-out",
          // Fade effect
          opacity: isOpen ? 1 : 0,
        }}
      >
        {/* CRITICAL: The inner div must be overflow-hidden.
           This allows the grid row to slice the content as it shrinks.
        */}
        <div className="overflow-hidden min-h-0">
          <div className="flex flex-column gap-1 mt-1 ml-4 border-l-2 border-gray-100 pl-2">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.href}
                label={child.label}
                href={child.href}
                isActive={pathname === child.href}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
