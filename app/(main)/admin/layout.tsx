"use client";

import { useEffect, useState } from "react";
import Sidebar from "@features/layout/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { PrimeReactProvider } from "primereact/api";
import Header from "@features/layout/header/Header";

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
    <PrimeReactProvider>
      <div className="flex h-screen flex-column overflow-hidden surface-50">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {/* backdrop for mobile sidebar */}
            {sidebarOpen && (
              <div
                className="fixed top-0 right-0 bottom-0 left-0 z-3 surface-900 opacity-50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              ></div>
            )}
            <div
              style={{ height: "calc(100vh - 5rem)" }}
              className="overflow-y-auto flex justify-content-center"
              // className="overflow-y-auto"
            >
              <div className="w-full py-8 px-4 md:px-6">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </PrimeReactProvider>
  );
}
