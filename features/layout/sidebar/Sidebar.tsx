"use client";

import { usePathname } from "next/navigation";
import { MenuItem, SIDEBAR_ITEMS } from "./sidebarConfig";
import { SidebarItem } from "./SidebarItem";
import { SidebarSubmenu } from "./SidebarSubMenu";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { useMemo } from "react";
import { useAuthPermissions } from "@features/auth/hooks/useAuthPermission";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { canRead, isLoading } = useAuthPermissions();

  const visibleItems = useMemo(() => {
    // Return empty while loading to prevent "flashing" unauthorized items
    if (isLoading) return [];

    const filterMenu = (items: MenuItem[]): MenuItem[] => {
      return items.reduce((acc: MenuItem[], item) => {
        // 1. Handle Items with Children (Submenus)
        if (item.children) {
          // Recursively filter children based on THEIR requiredFeature
          const visibleChildren = item.children.filter((child) =>
            canRead(child.requiredFeature)
          );

          // Only show the parent if it has at least one visible child
          if (visibleChildren.length > 0) {
            acc.push({ ...item, children: visibleChildren });
          }
        }
        // 2. Handle Standalone Items
        else if (canRead(item.requiredFeature)) {
          acc.push(item);
        }

        return acc;
      }, []);
    };

    return filterMenu(SIDEBAR_ITEMS);
  }, [canRead, isLoading]);

  return (
    <>
      {/* 1. Mobile Backdrop */}
      <div
        className={classNames(
          "fixed top-0 left-0 w-full h-full bg-black-alpha-40 z-4 transition-duration-300 md:hidden",
          {
            "opacity-100 pointer-events-auto": sidebarOpen,
            "opacity-0 pointer-events-none": !sidebarOpen,
          }
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* 2. Custom CSS for Drawer Logic */}
      <style jsx>{`
        .custom-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 18rem;
          z-index: 1100;
          background-color: white;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
        }
        .custom-sidebar.sidebar-open {
          transform: translateX(0);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        @media (min-width: 768px) {
          .custom-sidebar {
            position: static;
            height: 100%;
            transform: none !important;
            z-index: auto;
            box-shadow: none;
            border-right: 1px solid #dee2e6;
          }
        }
      `}</style>

      {/* 3. Sidebar Container */}
      <aside
        className={classNames("custom-sidebar flex flex-column", {
          "sidebar-open": sidebarOpen,
        })}
      >
        {/* Header */}
        <div className="flex align-items-center justify-content-between px-4 py-4 h-5rem border-bottom-1 border-200">
          <div className="flex align-items-center gap-2">
            <div className="w-2rem h-2rem bg-blue-600 border-round flex align-items-center justify-content-center text-white font-bold">
              M
            </div>
            <span className="font-bold text-xl text-800">
              Marstech<span className="text-blue-600">HR</span>
            </span>
          </div>

          <Button
            icon="pi pi-times"
            text
            rounded
            severity="secondary"
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Optional: Loading Skeleton */}
          {isLoading && (
            <div className="flex flex-column gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-3rem bg-gray-100 border-round"></div>
              ))}
            </div>
          )}

          {/* Actual Menu */}
          {!isLoading && (
            <nav className="flex flex-column gap-1">
              {visibleItems.map((item) => {
                if (item.children && item.children.length > 0) {
                  return <SidebarSubmenu key={item.id} item={item} />;
                }
                return (
                  <SidebarItem
                    key={item.id}
                    label={item.label}
                    href={item.href!}
                    icon={item.icon}
                    isActive={pathname === item.href}
                  />
                );
              })}

              {visibleItems.length === 0 && (
                <div className="text-center text-gray-500 text-sm mt-4">
                  Tidak ada menu yang tersedia.
                </div>
              )}
            </nav>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-top-1 border-200 bg-gray-50">
          <div className="flex flex-column gap-1">
            <small className="text-500 font-medium">HR System v1.0</small>
            <small className="text-400 text-xs">
              © {new Date().getFullYear()} Marstech Global
            </small>
          </div>
        </div>
      </aside>
    </>
  );
}
