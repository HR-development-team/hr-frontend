"use client";

import { usePathname } from "next/navigation";
import { SIDEBAR_ITEMS } from "./sidebarConfig";
import { SidebarItem } from "./SidebarItem";
import { SidebarSubmenu } from "./SidebarSubMenu";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  const renderItem = (item: (typeof SIDEBAR_ITEMS)[0]) => {
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
  };

  return (
    <>
      {/* Mobile Overlay (Backdrop) */}
      <div
        className={classNames(
          "fixed inset-0 bg-black/50 z-4 transition-opacity duration-300 md:hidden",
          {
            "opacity-100 pointer-events-auto": sidebarOpen,
            "opacity-0 pointer-events-none": !sidebarOpen,
          }
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={classNames(
          // 1. Layout & Scroll
          "bg-white border-r-1 border-gray-200 overflow-y-auto",

          // 2. Mobile: Fixed to Viewport (Guarantees 100vh)
          "fixed top-0 left-0 h-screen w-18rem shadow-8 z-5",

          // 3. Desktop: Static (Fills the flex container defined in AdminLayout)
          "md:static md:h-full md:shadow-none md:z-auto",

          // 4. Animation
          "transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)",
          {
            "translate-x-0": sidebarOpen,
            "-translate-x-100": !sidebarOpen,
            "md:translate-x-0": true,
          }
        )}
      >
        <div className="flex flex-column h-full">
          {/* Mobile Header (Logo + Close Button) */}
          <div className="flex align-items-center justify-content-between md:hidden px-4 pt-4 pb-2">
            <span className="font-bold text-xl text-gray-800">Menu</span>
            <Button
              icon="pi pi-times"
              text
              rounded
              severity="secondary"
              onClick={() => setSidebarOpen(false)}
            />
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-column gap-1 px-3 pt-8 pb-8 mt-4">
            {SIDEBAR_ITEMS.map((item) => renderItem(item))}
          </nav>

          {/* Footer */}
          <div className="mt-auto px-4 pb-4 pt-6 text-center">
            <div className="border-top-1 border-gray-100 pt-3">
              <small className="text-gray-500 text-sm block">HR v1.0.0</small>
              <small className="text-gray-500 text-sm block">
                PT. Marstech Global
              </small>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
