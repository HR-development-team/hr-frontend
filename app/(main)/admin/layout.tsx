"use client";

import { useEffect, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const pathName = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathName]);
  return (
    <div className="min-h-screen bg-slate-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 mt-24 surface-100 md:ml-80">{children}</main>
      </div>
    </div>
  );
}
