"use client";

import { HeaderLogo } from "./HeaderLogo";
import { UserDropdown } from "./UserDropdown";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="fixed top-0 z-5 w-full bg-white shadow-1 border-b py-2 h-16">
      <div className="px-4 md:px-6 h-full">
        <div className="flex justify-content-between align-items-center h-full">
          {/* Left Side */}
          <HeaderLogo onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          {/* Right Side */}
          <div>
            <UserDropdown />
          </div>
        </div>
      </div>
    </header>
  );
}
